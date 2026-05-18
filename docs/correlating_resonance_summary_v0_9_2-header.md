## Correlating Resonance — Version Summary

### Version
v0.9.2-heading

### Date
2026-05-16

### Status
Stable refactor baseline (post shared-layer consolidation, pre app-directory split)

---

## Overview

Version 0.9.2-heading represents a significant architectural consolidation of the Correlating Resonance HTML application.

Building on the stable baseline established in v0.9.2, this version introduces:

- A fully implemented shared JavaScript layer (`edu-common.js`)
- Standardised navigation via a modular header/footer system
- Preparation for application-level directory separation (`/apps/<appname>/`)

The system remains functionally identical to v0.9.2, but is now structurally organised for modular expansion and multi-application deployment.

---

## Key Changes in v0.9.2-heading

### 1. Shared JavaScript Layer (edu-common.js)

A structured shared runtime layer has been implemented, containing:

- Platform API binding (`callAPI`)
- File ingestion utilities (`readFile` with PDF.js support)
- CSV export and artefact utilities (`csvCell`, `downloadBlob`)
- UI utilities (`escHtml`, `showError`, `clearError`, `formatBytes`)
- Transitional JSON parsing (`parseLLMResponse`)

The file is formally organised into sections:

- §A Platform Binding
- §B File I/O
- §C Artefact I/O
- §D UI Utilities
- §E Stage 3 Transitional Parsing

This establishes a clear boundary between:

- Page-level orchestration (HTML files)
- Shared infrastructure (edu-common.js)

---

### 2. Navigation System Refactor

Navigation has been extracted into reusable HTML fragments:

- `edu_header.html`
- `edu_footer.html`

These are loaded dynamically using:

- `loadFragment(...)`
- `markActiveNav()`

Key characteristics:

- Navigation links standardised to target future structure:
  `/apps/<appname>/`
- Active state is determined dynamically via JavaScript
- CSS uses the `.current` class for active phase highlighting

This replaces previously duplicated inline navigation across all pages.

---

### 3. Header Structure Standardisation

The header now defines a consistent structure:

- branding (`cr-nav-logo`)
- home navigation (`cr-nav-home`)
- phase navigation (`cr-phase-link`)

This enables:

- clean CSS targeting
- programmatic active-state assignment
- consistent UI across all phases

---

### 4. Fragment Loading Mechanism

A reusable fragment loader has been implemented:

```javascript
loadFragment(id, path)