/* ============================================================================
 * cr-common.js
 *
 * Shared JavaScript utilities for the Correlating Resonance phase pages.
 * Loaded after config.js, before any page-specific <script> block.
 *
 * Organisation: this file is sectioned by Stage 3 migration destination.
 * When the JS → Python migration happens, each section is moved (or stays)
 * as a unit. Read the section headers as a migration manifest.
 *
 *   §A  PLATFORM-BINDING            — stays browser-side (per contract §6)
 *   §B  FILE I/O                    — stays until §16 file-services lands
 *   §C  ARTEFACT I/O (CSV)          — stays browser-side (the §11.1 boundary)
 *   §D  UI UTILITIES                — stays browser-side
 *   §E  STAGE 3 RETIREMENT          — current technical debt against §6;
 *                                     disappears when platform parsing ships
 *
 * Globals introduced by this file (intentional, used by page scripts):
 *   CR_MODEL, callAPI, readFile, csvCell, downloadBlob, today, formatBytes,
 *   escHtml, showError, clearError
 *
 * Globals expected to exist before this script runs:
 *   window.CORRES_CONFIG (from config.js)
 *   window.pdfjsLib      (from the pdf.js CDN script tag)
 * ============================================================================ */


/* ============================================================================
 * §A  PLATFORM-BINDING — stays browser-side
 *
 * The thin client over the platform LLM endpoint. Per contract §6 the
 * platform abstraction is the only path to the provider; per §6.1 the
 * platform holds the credentials. Per §6 the model registry will eventually
 * replace pinned_model with task-semantic selection (Q6b); for now we pin.
 *
 * Stage 3 will change three things about this section, none of which alter
 * its location:
 *   1. callAPI gains a `task` parameter and calls the registry instead of
 *      passing pinned_model (or in addition to it for academic reproduction).
 *   2. callAPI returns parsed objects rather than raw text once the platform
 *      structured-output parsing layer ships (retires §E below).
 *   3. The endpoint path changes per app (/v1/gioiaie/, /v1/sanzognie/, etc.)
 *      once the four-app split is provisioned.
 * ============================================================================ */

// Pinned model identifier. Will become a fallback / explicit-pin escape hatch
// once the registry ships (contract §6, paragraph on identifier pinning).
window.CR_MODEL = 'claude-sonnet-4-20250514';

/**
 * Call the platform LLM endpoint and return the response text.
 *
 * @param {string} system    System prompt
 * @param {string} user      User message
 * @param {number} maxTokens Max output tokens (default 4096)
 * @returns {Promise<string>} Response text (raw — parsing is the caller's
 *                            responsibility until §E retires; see §6)
 */
window.callAPI = async function callAPI(system, user, maxTokens = 4096) {
  const cfg = window.CORRES_CONFIG;
  if (!cfg || !cfg.apiBase) {
    throw new Error('CORRES_CONFIG not loaded — check config.js is deployed');
  }

  const requestId = (crypto.randomUUID && crypto.randomUUID()) ||
                    (Date.now() + '-' + Math.random().toString(36).slice(2));

  const res = await fetch(`${cfg.apiBase}/v1/corres/llm/messages`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'X-Request-Id':  requestId,
    },
    body: JSON.stringify({
      system,
      user,
      max_tokens:   maxTokens,
      pinned_model: window.CR_MODEL,
    }),
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const err = await res.json();
      detail = err?.detail?.message || err?.error?.message || detail;
    } catch (_) { /* keep statusText */ }
    throw new Error(`API error ${res.status}: ${detail}`);
  }

  const data = await res.json();
  return data.text;
};


/* ============================================================================
 * §B  FILE I/O — stays browser-side until §16 file-services lands
 *
 * Reading uploaded files (txt and pdf) into strings. PDF extraction uses
 * pdf.js loaded from the CDN. The 10-item override surface specification
 * of 1 May 2026 anticipates this moving server-side in a later release
 * (Q7); until then it lives here.
 * ============================================================================ */

// Configure pdf.js worker once. Idempotent.
if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

/**
 * Read an uploaded file into text. Supports .txt and .pdf.
 *
 * @param {File}   file
 * @param {Object} [opts]
 * @param {number} [opts.limit] Maximum characters to extract (PDF only).
 *                              Useful for very large PDFs in Phase 3.
 * @returns {Promise<string>}
 */
window.readFile = async function readFile(file, opts = {}) {
  const name = (file.name || '').toLowerCase();
  const limit = opts.limit || Infinity;

  if (name.endsWith('.txt')) {
    const text = await file.text();
    return limit === Infinity ? text : text.substring(0, limit);
  }

  if (name.endsWith('.pdf')) {
    if (!window.pdfjsLib) {
      throw new Error('PDF.js not loaded — cannot read PDF files');
    }
    const buf = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
    let out = '';
    for (let p = 1; p <= pdf.numPages && out.length < limit; p++) {
      const page    = await pdf.getPage(p);
      const content = await page.getTextContent();
      out += content.items.map(i => i.str).join(' ') + '\n\n';
    }
    return out.substring(0, limit).trim();
  }

  throw new Error(`Unsupported file type: ${file.name}`);
};


/* ============================================================================
 * §C  ARTEFACT I/O (CSV) — stays browser-side (the §11.1 boundary)
 *
 * The inter-phase handoff format. Per platform contract §11.1, artefact-I/O
 * is the permanent shape of the application boundary; user-mediated handoff
 * (download from one phase, upload at the next) is platform-supported by
 * design, not a degraded fallback. These utilities therefore stay here
 * even after the JS → Python migration.
 * ============================================================================ */

/**
 * Escape a value for inclusion in a CSV row. Quotes fields containing
 * commas, double-quotes, or newlines; doubles up internal quotes.
 */
window.csvCell = function csvCell(val) {
  const s = String(val ?? '');
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
};

/**
 * Trigger a download of a string as a file.
 *
 * @param {string} filename
 * @param {string} content
 * @param {string} [type='text/csv'] MIME type
 */
window.downloadBlob = function downloadBlob(filename, content, type = 'text/csv') {
  const blob = new Blob([content], { type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/** ISO date stamp for filenames: YYYY-MM-DD. */
window.today = function today() {
  return new Date().toISOString().slice(0, 10);
};


/* ============================================================================
 * §D  UI UTILITIES — stays browser-side
 *
 * Page-level helpers that have no business migrating server-side: HTML
 * escaping, error/status display against well-known DOM ids, byte-formatting
 * for file size readouts.
 *
 * Convention: pages provide a #error-display element if they want
 * showError/clearError to work. Pages that don't provide one get a console
 * warning rather than a thrown exception, so a missing element is visible
 * without breaking the call site.
 * ============================================================================ */

/** Escape a string for safe insertion into innerHTML. */
window.escHtml = function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Display an error message in #error-display. If the element is absent,
 * logs a warning and falls back to alert() so the user still sees something.
 */
window.showError = function showError(msg) {
  const el = document.getElementById('error-display');
  if (!el) {
    console.warn('showError: no #error-display element on this page');
    alert('Error: ' + msg);
    return;
  }
  el.innerHTML =
    `<div class="error-box"><strong>Error</strong>${window.escHtml(msg)}</div>`;
};

/** Clear the error display. No-op if #error-display is absent. */
window.clearError = function clearError() {
  const el = document.getElementById('error-display');
  if (el) el.innerHTML = '';
};

/** Format a byte count as a short human string: "847B", "23KB", "1.8MB". */
window.formatBytes = function formatBytes(b) {
  if (b < 1024)        return `${b}B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)}KB`;
  return `${(b / 1024 / 1024).toFixed(1)}MB`;
};


/* ============================================================================
 * §E  STAGE 3 RETIREMENT — technical debt against contract §6
 *
 * Per platform contract §6, structured-output parsing and repair is a
 * platform-layer responsibility: applications "do not implement parsing or
 * repair locally." The current pages inline JSON.parse after every callAPI;
 * that pattern is incompatible with §6 and retires at Stage 3 when the
 * platform parsing layer ships (Q4a–Q4b).
 *
 * This helper is provided as a single chokepoint for the existing parse
 * pattern. Pages should call this rather than scattering inline parse calls
 * across the codebase; the eventual retirement is then a single delete plus
 * a callsite sweep, not a hunt through page-specific JS.
 *
 * Stage 3 action: delete this section; replace callsites with the parsed
 * object returned directly by callAPI; close out the §6 contract debt.
 * ============================================================================ */

/**
 * Parse an LLM response as JSON. Tolerates the common failure mode of the
 * model wrapping its JSON in a ```json ... ``` fence.
 *
 * @param {string} text Response text from callAPI
 * @param {string} [context] Optional context string for error messages
 *                            (e.g. "Phase 1 typology generation")
 * @throws {Error} If parsing fails after de-fencing.
 */
window.parseLLMResponse = function parseLLMResponse(text, context = '') {
  let s = String(text || '').trim();

  // Strip ```json ... ``` or ``` ... ``` fences if present.
  const fence = s.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) s = fence[1].trim();

  try {
    return JSON.parse(s);
  } catch (err) {
    const where = context ? ` (${context})` : '';
    throw new Error(`Could not parse LLM response as JSON${where}: ${err.message}`);
  }
};
