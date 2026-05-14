# Correlating Resonance — Version Summary

## Version
v0.9.2

## Date
2026-05-15

## Status
Stable baseline (first committed version)

---

## Overview

Version 0.9.2 represents the first stable, fully integrated HTML application for the Correlating Resonance frame analysis methodology.

All four analytical phases are implemented as linked HTML interfaces, with consistent navigation, styling, and functional workflows. This version establishes a clean and reproducible baseline prior to JavaScript modularisation and further architectural refactoring.

---

## Key Changes in v0.9.2

### 1. File Renaming and Naming Standardisation

All phase files were renamed to a new consistent naming scheme:

| Phase | Previous Filename | Final Filename |
|------|------------------|---------------|
| Phase 1 | cr_phase1_typology.html | gioianie_index.html |
| Phase 2 | cr_phase2_saturation.html | gioianie_iterate.html |
| Phase 3 | cr_phase3_1_coding.html | sanzognie.html |
| Phase 4 | cr_phase4_analysis.html | corres.html |
| Entry | index.html | index.html |

Associated CSS files were renamed to match.

---

### 2. Navigation Alignment

- Updated all internal links across:
  - Top navigation bars
  - Bottom navigation controls
  - Index phase cards
- Ensured all phases link correctly to each other
- Verified bidirectional navigation between all steps

---

### 3. CSS Reference Correction

- Updated all `<link>` references to match renamed CSS files
- Ensured consistent loading of:
  - `cr-common.css`
  - phase-specific CSS files
- Verified styling consistency across all pages

---

### 4. Baseline Preservation (Phase 1.1 Integration)

- All changes applied to **Phase 1.1 repaired HTML files**
- No regeneration or reconstruction of HTML
- No modification of:
  - JavaScript logic
  - DOM structure
  - functional behaviour

This ensures that v0.9.2 is a **true preservation of a working system state**

---

### 5. Directory Clean-Up

- Removed:
  - intermediate repair files
  - legacy HTML files
  - temporary ZIP outputs
- Established clean project structure for version control

---

## What Was NOT Changed

To preserve system stability:

- No JavaScript extraction or refactoring
- No architectural reorganisation
- No API changes
- No logic changes within any phase

---

