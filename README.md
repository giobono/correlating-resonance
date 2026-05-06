# Correlating Resonance

### A computational methodology for frame analysis in contested policy spaces

**Version:** v0.9 Beta · **Status:** Experimental · **Released:** April 2026

The v0.9 specification documents the methodology as implemented in the current beta. The v0.8 document is retained as the pre-implementation baseline for version control purposes.
---

## What is Correlating Resonance?

Correlating Resonance is a structured analytical methodology for identifying the *frames of reference* that underpin conflicting positions within complex or wicked problems. It takes a corpus of policy texts — submissions, reports, responses, articles — and produces a map of the conceptual configurations that explain why stakeholders disagree, what divides them, and where common ground exists.

The methodology combines inductive concept coding with document-term matrix construction and cluster analysis to reveal three analytically distinct types of concept across the corpus:

- **Core differentiating concepts** — those that make frames genuinely incompatible
- **Core bridging concepts** — the common ground on which people who disagree can still collaborate
- **Boundary concepts** — frame-neutral or ambiguous concepts that sit outside the dominant structure

The approach was developed for contested policy spaces where a range of conflicting opinions have proved difficult to resolve. It is corpus-agnostic and has been applied to food security policy, digital health governance, and sustainability transitions.

---

## The web application

The application operationalises the methodology as a four-phase browser-based tool powered by the Anthropic Claude API. It runs entirely in your browser — no installation required.

**Live tool:** [https://giobono.github.io/correlating-resonance/app/](https://giobono.github.io/correlating-resonance/app/)

> **You will need an Anthropic API key to use the tool.** See [Getting an API key](#getting-an-api-key) below. For access to a working copy with sample data contact the author. 

### The four phases

| Phase | What it does | Input | Output |
|-------|-------------|-------|--------|
| [Phase 1 — Typology Development](app/cr_phase1_typology.html) | Upload 5 random corpus documents to extract a candidate concept list through open coding | 5 × PDF or TXT | Typology CSV |
| [Phase 2 — Saturation Check](app/cr_phase2_saturation.html) | Test the typology against new document batches until no new concepts emerge | Typology CSV + document batch | Saturated typology CSV |
| [Phase 3 — Corpus Coding](app/cr_phase3_1_coding.html) | Apply the finalised typology to the full corpus, with automatic checkpoint exports | Typology CSV + full corpus | Document-Term Matrix CSV |
| [Phase 4 — Cluster Analysis](app/cr_phase4_analysis.html) | Binarise the DTM, construct the TTM, run cluster analysis, and name frames | Reviewed DTM CSV | Frame analysis + document frame scores |

---

## Getting started

### Getting an API key

The tool calls the Anthropic Claude API to perform document coding and analysis. You will need to:

1. Create an account at [console.anthropic.com](https://console.anthropic.com)
2. Add a small credit balance — $10–20 USD is sufficient to test all phases on a sample corpus
3. Create an API key under API Keys in your account settings

### Inserting your API key into the application

Before using any phase, open the HTML file in a text editor and find this line near the top of the `<script>` section:

```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
```

Replace `YOUR_API_KEY_HERE` with your actual API key. Save the file. Your key stays on your own machine and is never transmitted anywhere other than directly to Anthropic's API.

> **Security note:** Never share or publish HTML files that contain your real API key. The files in this repository contain only the placeholder.

### Testing with sample data

If you want to test the tool before committing your own corpus, any collection of PDF or TXT documents that express a range of views on a contested topic will work. Five to ten documents is sufficient for Phase 1 testing.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Methodology v0.8](docs/correlating_resonance_methodology_v0_8.md) | Formal specification of the methodology as presented at beta release |
| [Methodology v0.9](docs/correlating_resonance_methodology_v0_9.md) | Updated specification reflecting implementation decisions made during the v0.8 build, including the experimental binarisation threshold and hybrid PDF extraction |

The v0.8 specification is the version described in the accompanying presentation. The v0.9 document records the delta between the specification and the actual implementation — these are the things that changed as theory met practice, and they are the most methodologically interesting aspects of the current beta.

---

## Beta status — what this means for testers

This is an experimental beta. The methodology is sound and has produced analytically meaningful results across multiple corpora, but several aspects are still being refined:

**The binarisation threshold** — Phase 4 offers three modes for converting raw scores to binary important/not-important values. The *auto* mode (mean of non-zero scores) has produced stronger analytical results in testing than the original fixed rule, but has not been validated across enough different corpora to be the general recommendation. Your observations here are particularly valuable.

**The cluster count decision** — there is not yet a formal rule for how many clusters to specify in the Multiple Correspondence Analysis step. Current practice is to start with 4–5, compare against the sorted Term-Term Matrix, and adjust until the cluster structure is analytically coherent. Documenting your decision process is encouraged.

**The MCA implementation** — the browser-based version uses TruncatedSVD from scikit-learn as a computationally efficient approximation of classical MCA. It produces equivalent cluster assignments for practical purposes. A full MCA implementation is planned for v1.0.

---

## Providing feedback

This beta release is actively seeking feedback on:

1. **The tool** — usability, interface issues, errors, unexpected behaviour
2. **The methodology** — cases where the analytical outputs are or are not convincing
3. **The documentation** — gaps, ambiguities, or places where the specification does not match the tool's behaviour

Please use the [GitHub Issues](https://github.com/giobono/correlating-resonance/issues) tab to log observations. Label your issue as `bug`, `methodology`, or `documentation` as appropriate.

---

## About this work

Correlating Resonance was developed as part of PhD research into sustainability transitions in urban food systems, and extended through ongoing work in digital health policy and computational social science at Griffith University. The methodology is described in a forthcoming article — a link will be added here when published.

The operationalisation of the methodology as a browser-based API-powered tool was developed in 2026 as part of a broader effort to make the methodology accessible to researchers who do not have programming environments available.

---

## Citing this work

If you use this methodology or tool in your research, please cite it as:

> Geoff Ebbs. (2026). *Correlating Resonance: A computational methodology for frame analysis in contested policy spaces* (v0.8). GitHub. https://github.com/giobono/correlating-resonance

A formal citation with DOI will be added when the accompanying article is published.

---

## Licence

This project is released under the [MIT Licence](LICENSE). You are free to use, adapt, and build on this work with attribution.

---

*Correlating Resonance v0.8 · April 2026 · Experimental beta*
