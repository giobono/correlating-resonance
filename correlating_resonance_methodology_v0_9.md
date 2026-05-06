# Correlating Resonance: A Methodology for Frame Analysis in Contested Policy Spaces

**Version:** v0.9
**Date:** 27 April 2026
**Status:** Working specification. Documents the methodology as implemented in the browser-based MVP application.
**Previous version:** v0.8 (21 April 2026)

---

## Changelog — v0.8 to v0.9

| Section | Change type | Summary |
|---------|-------------|---------|
| 3.2 | Addition | Note on enriched definitions including synonyms |
| 3.3 | Substantial rewrite | Binarisation now supports three threshold modes: auto (experimental), fixed, and manual; DTM heatmap and calibration diagnostics added |
| 3.4 | Addition | Note on `Neutral,directional` column in typology CSV |
| 4 | Addition | Clarified required outputs including clustered TTM |
| 5.1 | Clarification + addition | Block seriation status clarified; MVP implementation note added (TruncatedSVD approximation) |
| 5.2 | Addition | Explained variance indicator documented |
| 7 | Significant addition | Hybrid PDF text/vision extraction, low-confidence flagging, and batch processing with checkpoints documented |
| 8 | Update | Summary table updated to reflect three-mode binarisation and addition of DTM review gate |
| Closing note | Update | Reflects deployment status and reframes open questions |

---

## 1. Purpose and Scope

Correlating resonance is a structured analytical methodology for identifying the frames of reference that underpin conflicting positions within complex or wicked problems. It takes a corpus of texts as input and produces a map of the conceptual configurations — frames — that characterise different points of view within that corpus.

The methodology identifies three types of concepts:

**Core differentiating concepts** — those strongly present within one frame and absent from others. These are the concepts that make frames genuinely incompatible and that explain why certain policy disagreements resist resolution.

**Core bridging concepts** — those present and important across two or more frames. These represent the common ground on which people who disagree fundamentally about other things can nevertheless collaborate.

**Boundary concepts** — those that do not clearly belong to any frame, that are internally inconsistent across the corpus, or that combine frames in ways that do not align with the dominant analytical structure. These are noted but not pursued as primary analytical outputs.

The methodology was developed for contested policy spaces where a range of conflicting opinions have proved difficult to resolve. It is corpus-agnostic and can be applied to any body of texts that express a range of positions on a complex issue.

---

## 2. Typology Development — Saturation Protocol

### 2.1 Researcher Input — Initial Framing

Before open coding begins, the researcher makes foundational decisions about the scope and structure of the typology. This step requires careful judgement: purely open coding risks generating concepts that are irrelevant to the analytical purpose, while excessive researcher direction risks introducing subjectivity that compromises the inductive integrity of the process.

The recommended approach is to establish broad orienting categories before coding begins. These are not imposed as a fixed typology but serve as a scaffold that keeps coding relevant without predetermining outcomes. Examples of useful broad categories include:

- Intended outcomes or results
- Barriers or enablers
- Actions suggested, studied, or considered
- Discipline categories (e.g. dental, mental health, physiological — for health corpora)

Real-world descriptive categories — such as industry, business type, business size, or demographics — may be included in the concept typology alongside substantive concepts. The analytical process is self-sorting: if a metadata category strongly correlates with core bridging or differentiating concepts, it is a meaningful component of the frame structure and should be retained in the analysis. If it emerges as a boundary concept, it can be disregarded in the final interpretation. This approach avoids a separate metadata analysis step with little additional cognitive overhead at the analysis stage. The one exception is where a large number of metadata categories risks overloading the statistical analysis — in that case, metadata should be reduced or removed before re-running the cluster analysis.

Broad categories established at this stage may be discarded during analysis if they do not contribute to frame differentiation. Their purpose is to frame the coding process, not to survive into the final typology.

The researcher should also make an initial judgement about relevance, usefulness, and appropriate level of granularity for concepts as they emerge. Concepts that are too broad, too narrow, or that appear to duplicate existing concepts should be flagged for merging or deletion. This judgement is revisited at each stage of the process.

### 2.2 Saturation Protocol

The concept typology is developed inductively using a three-phase saturation approach. Concepts are not organised into a hierarchical typology in advance; they emerge from open coding of documents.

**Phase 1: Establish**
Select 5 documents at random from the corpus. Code them openly to generate an initial typology of concepts present in the corpus.

**Phase 2: Check**
Expand the coded sample to 5–10% of the corpus, randomly selected. Review the rate of new concept emergence. The question being asked is whether the typology is holding, or whether significant new concepts are still appearing regularly.

**Phase 3: Seek Disagreement**
Actively search the remaining corpus for documents that appear to express substantially different viewpoints. If a document introduces significant new concepts, expand the typology and return to Phase 2. If 10% of the corpus is traversed without meaningful disagreement, saturation is declared.

The core logic is three sequential tests: establish with a small sample, verify by at least doubling that sample, then actively attempt to break the typology. Saturation is not the absence of any new concept — it is surviving a good-faith attempt to find disagreement.

Once the typology is stable, it is applied to the full corpus.

### 2.3 Output — Final Typology

**Required output:** The final concept typology as applied to the full corpus — a flat, non-hierarchical list of concepts with definitions sufficient to allow consistent coding, exported as a CSV with the following columns:

| Column | Description |
|--------|-------------|
| `Term` | Concept name in lowercase |
| `Definition: including synonyms` | Neutral coding rule plus alternative phrasings accumulated through saturation iterations |
| `Ambiguous` | YES / NO — whether the concept carries multiple possible meanings |
| `Ambiguity_Note` | Explanation of ambiguity if flagged |
| `Neutral,directional` | Currently defaults to `neutral` for all concepts — reserved for the directionality extension |
| `Source_Documents` | Documents in which the concept was first identified |
| `Scaffolding_Category` | Optional researcher orientation label — not used in analysis |

**Optional output:** Iteration records documenting how the typology evolved across coding phases. Researchers who require transparency about typology development for methodological validation should retain these records.

---

## 3. Document Coding — Scoring and Binarisation

### 3.1 Coding Architecture

Each document is coded individually against the full concept typology. The coder — whether human or LLM — receives one document and the complete concept list, and returns a score for every concept in that document. Documents are not coded comparatively; each judgement is made in isolation.

### 3.2 Coding Modes and Output — Raw DTM

Two coding modes are available. The researcher selects one at the outset and applies it consistently across the corpus.

**Frequency mode:** Count the number of occurrences of each concept in each document. Suited to larger corpora where granular quantitative data is preferred.

**Rating mode:** Apply a four-point importance scale:

| Score | Label | Description | Binary Value |
|-------|-------|-------------|--------------|
| 0 | Absent | Concept not mentioned | 0 — Not Important |
| 1 | Mentioned | Brief reference only | 0 — Not Important |
| 2 | Important theme | Discussed and emphasised | 1 — Important |
| 3 | Central theme | Core focus of the document | 1 — Important |

Rating mode is suited to smaller corpora or where interpretive depth is preferred.

Concept definitions in the typology serve as coding rules and are enriched during Phase 2 with synonyms and alternative phrasings identified through saturation testing. The LLM coder uses the full definition including synonyms when assigning scores.

Both modes produce a Document-Term Matrix (DTM) — rows are documents, columns are concepts, cells contain the raw score.

**Required output:** The complete raw DTM prior to binarisation. This serves two purposes: it constitutes the primary data record for assessing repeatability and methodological transparency; and it supports subsequent identification of documents that most closely match specific frames or concept clusters. The DTM also records which extraction method was used for each document (see Section 7) in an `Extraction_Method` column, and flags low-confidence scores with a `[?]` marker (see Section 7).

### 3.3 Binarisation

The DTM is converted to a binary matrix in which each concept is classified as either important (1) or not important (0) for each document. Three threshold modes are available. The researcher selects a mode based on visual and statistical review of the DTM before confirming the threshold and proceeding.

**Auto — mean of non-zero values (experimental)**
The threshold is set at the mean of all non-zero scores across the full DTM. Scores at or above this value map to 1 (important); scores below map to 0 (not important). This mode has been found to produce more differentiated results on rating-mode corpora in initial testing but has not been validated across sufficient corpora to be treated as a general rule. It is the current default but should be treated as experimental.

**Fixed — rating mode boundary**
Scores of 0 and 1 map to 0 (not important); scores of 2 and 3 map to 1 (important). This is the original methodologically specified rule and remains the appropriate choice for publication contexts where a fixed, pre-specified rule is required.

**Manual — researcher set**
The researcher sets a numerical threshold directly, informed by visual inspection of the DTM heatmap and the statistical diagnostics described below.

In **frequency mode**, the threshold is set by the researcher and calibrated against two criteria:
- More than half the concepts are important in more than half the documents
- Matrix density is sufficient for meaningful co-occurrence analysis (target 15–60%)

**Threshold calibration diagnostics**
Before confirming any threshold, the researcher reviews:
- Matrix density (percentage of important cells)
- Average important concepts per document, with standard deviation
- Documents with very few important concepts (below mean − 1SD) flagged as potential outliers
- Concepts important in fewer than 10% of documents flagged as potentially peripheral
- Whether the two calibration criteria above are met
- A colour-coded heatmap of the full DTM with documents sorted by total importance and concepts sorted by total importance, with the importance boundary visible as the threshold is adjusted

If the resulting binary matrix is too sparse to support meaningful cluster analysis, the threshold is adjusted and binarisation is repeated.

### 3.4 Note on Directionality

The current methodology measures importance without coding for directionality. A document arguing against a concept with intensity is coded identically to one arguing for it with the same intensity. This is a deliberate simplification. Pilot work using principal component analysis with explicit coding for positive and negative correlation produced a richer analysis — distinguishing unipolar concepts from bipolar concept pairs — but at significant cost in complexity of interpretation and explanation. Directionality is documented here as a validated extension to the methodology that has been deferred pending further development.

The typology CSV format includes a `Neutral,directional` column which currently defaults to `neutral` for all concepts. This column is reserved for the directionality extension and requires no action in the current implementation.

---

## 4. Term-Term Matrix Construction

The binarised DTM is collapsed into a Term-Term Matrix (TTM). Each cell records the number of documents in which both concepts were scored as important — their co-occurrence count across the corpus.

**Required outputs:**
- The complete TTM together with the threshold values used to produce it, exported as a CSV sorted by total co-occurrence count. The threshold record is necessary for replication and for understanding what decisions were made during binarisation.
- A second TTM sorted by cluster assignment (produced after Step 5.3) to enable visual comparison with the frequency-sorted TTM. Comparing the two allows the researcher to assess whether the cluster structure meaningfully reorganises concept relationships relative to the frequency sort.

The TTM is then sorted by total co-occurrence count per concept, from highest to lowest, as the starting point for cluster analysis.

---

## 5. Cluster Analysis and Frame Identification

### 5.1 Method Selection

Multiple clustering approaches were evaluated, including k-means analysis, principal components analysis combined with k-means, and block seriation. The consistent finding was that most methods organised concepts primarily by frequency of occurrence or co-occurrence — reproducing the sort order of the TTM rather than revealing underlying structural relationships between concepts.

Block seriation and Multiple Correspondence Analysis (MCA) most closely matched the structure revealed by visual reorganisation of the TTM. MCA is the preferred method. Block seriation is a theoretically valid cross-check and was evaluated during methodology development, but is not implemented in the current version of the application. It is noted here for researchers running the methodology outside the application.

**MVP implementation note:** The current browser-based implementation uses TruncatedSVD from scikit-learn (via Pyodide) as a computationally efficient approximation of MCA. This produces equivalent cluster assignments for the purposes of frame identification. Migration to a full MCA implementation via the `prince` library running server-side is planned for v1.0. Methods sections in publications based on the current implementation should describe the approach as MCA via truncated SVD rather than classical MCA.

### 5.2 Researcher Input — Cluster Decisions

The number of clusters must be specified before MCA is run. This is an area where the decision criteria are still being refined and will be documented more precisely as further applications accumulate. Current practice is:

- Specify four or five clusters as a default starting point
- Review the output against the stingray diagram reference standard (Section 5.3)
- If the output does not resolve clearly into the expected structure, adjust the number of clusters and re-run
- Review outputs at different cluster counts to assess sensitivity

The application surfaces an explained variance indicator after each MCA run, allowing the researcher to compare the proportion of variance captured at different cluster counts. Higher explained variance values indicate the components capture more of the structure in the concept co-occurrence patterns. This provides a quantitative basis for comparing runs at different cluster counts alongside the visual stingray reference standard.

In principal component analysis applications, both the number of components and the number of clusters were determined by the researcher based on scree plots and explained variance. Equivalent explicit criteria for MCA will be developed and added to this section as the methodology is refined through deployment.

### 5.3 Visual Reference Standard — The Stingray Diagram

The expected output of a successful cluster analysis is a structure that can be described as a stingray diagram. Each stingray represents one frame of reference. The structural elements are:

**Head:** The core bridging concepts — those present and important across two or more adjacent frames. These are the concepts that allow people who hold different frames to find common ground. In the TTM, these concepts co-occur highly with concepts from more than one cluster.

**Base of tail:** The core differentiating concepts — those that distinguish one frame from the next. These are present and important within one frame but absent from adjacent frames. The terminology "base of tail" is used deliberately: the smallest stingray in a multi-frame analysis has a diagonal structure at its extremity that differs from the larger frames, and the differentiating concepts sit at the base rather than the terminal end of this structure.

**Unnumbered concepts:** Boundary concepts — those that do not clearly belong to any frame, that appear frame-neutral, or that are internally inconsistent across the corpus. These are noted but not interpreted as primary outputs. They may point to alternative framings that produce a different organisation of the data, but this has not proven analytically productive in applications to date.

### 5.4 The Degenerate Case — Single Dominant Frame

Some corpora produce a stable, dense triangular structure with minimal internal differentiation — effectively a single stingray with no protruding base. This indicates a dominant frame rather than competing frames. The appropriate interpretive register shifts:

- The corpus is characterised by a single dominant point of view, which most documents accept to varying degrees
- The analytical output describes a spectrum — for and against the dominant frame — rather than a map of competing configurational frames
- Concepts are interpreted as more or less central to the dominant view, rather than as differentiating between frames

This is a legitimate and interpretable result, not a methodological failure. Users should recognise this output and apply the appropriate interpretive approach.

### 5.5 Required Outputs — Clusters and Frames

**Required output:** The full cluster analysis output, comprising:

- The identified clusters with their constituent concepts
- A measure of frame strength — the distance between concept clusters, indicating how clearly differentiated the frames are from one another
- Designation of each concept as core bridging, core differentiating, or boundary
- For each frame: the documents that most closely match the core concept configuration of that frame

### 5.6 Researcher Input — Frame Naming and Validation

Frame naming is a collaborative step between the LLM and the researcher.

The LLM produces working names for each frame based on a statistical description of the core concepts in each cluster — what the concepts have in common, how they differ from adjacent clusters, and what interpretive label best captures their configuration.

The researcher then reviews these working names against:
- The core concepts themselves
- The documents identified as most closely matching each frame
- Their own domain knowledge of the corpus

The researcher may revise frame names, reconsider the number of clusters, or flag concepts for merging, deletion, or reclassification. This review step is also the point at which the researcher considers whether the boundary concepts point to any meaningful alternative framing worth pursuing.

---

## 6. Known Extension — Directionality

As noted in Section 3.4, the methodology currently measures concept importance without coding for directionality. A full implementation of directionality would require:

- An expanded scoring rubric distinguishing positive, neutral, and negative importance
- Separate treatment of unipolar concepts and bipolar concept pairs
- Revised logic for TTM construction and cluster interpretation

This extension is validated in principle through pilot work but has been deferred from the current implementation. The scoring rubric and DTM structure are designed to accommodate this extension. It should be revisited when the core methodology has been stabilised through deployment and user feedback.

---

## 7. LLM Coding Architecture

When an LLM performs the document coding step, the following architecture applies:

**One document per call.** The LLM receives a single document and the complete concept typology, and returns scores for every concept in that document. Documents are not processed in batches or comparatively. This preserves coding consistency and manages API call size.

**The researcher selects the coding mode** (frequency or rating) at the outset. The LLM applies that mode consistently across all documents.

**For large corpora**, the corpus is processed document by document. The DTM is assembled from the individual outputs. The TTM construction, binarisation, threshold calibration, and cluster analysis steps are performed on the assembled DTM, not within individual LLM calls.

**For frame naming**, the LLM receives the identified concept clusters, provides a statistical description of each cluster's core concepts, and proposes working names for each frame. The researcher validates these against the most representative documents for each frame and may revise them.

**Ongoing researcher judgement.** At each stage the researcher retains the right to assess the relevance and usefulness of concepts, to flag additional concepts that appear to be missing, and to propose merging or deletion of concepts that are duplicative, too broad, or analytically unproductive. These judgements are recorded as part of the process documentation.

**Hybrid PDF text extraction.** Documents are processed by extracting text from the PDF using PDF.js before the API call. If the extracted text falls below a configurable quality threshold (default 500 characters, or fewer than 50 meaningful words), the document is automatically rerouted to a vision-based coding path in which the PDF is sent directly to the API as a base64-encoded document for visual reading. The DTM records which extraction method was used for each document (`text` or `vision`) in an `Extraction_Method` column. This column supports audit and reproducibility assessment. Researchers should note that the two extraction paths may produce marginally different text samples for the same document, and that vision-coded documents should be subject to the same DTM review process as text-coded ones.

**Low-confidence flagging.** The LLM is instructed to flag any concept score where it is genuinely uncertain between adjacent scores. Flagged cells are recorded in the DTM with a `[?]` marker. Researchers should review all flagged cells before proceeding to binarisation and correct them where the context of the document makes the correct score clear. Systematic patterns in low-confidence flags — for instance, a concept that is consistently flagged across many documents — may indicate a definition that requires further enrichment.

**Batch processing and checkpoints.** For large corpora, documents are processed in configurable batches (default 20 documents per batch, researcher-configurable). The DTM is exported automatically after each batch as a checkpoint file. If processing is interrupted — for example by API credit exhaustion — the researcher can resume from the most recent checkpoint. The checkpoint CSV, together with the typology and corpus, fully specifies the state of the analysis at any point and allows processing to resume from any device or session without loss of prior work. Document matching on resume uses filename rather than generated document ID, ensuring correct matching across sessions.

---

## 8. Summary of Inputs and Outputs by Stage

| Stage | Section | Researcher Input | Required Output |
|-------|---------|-----------------|-----------------|
| Typology development | 2.1–2.2 | Orienting categories; relevance and granularity judgements; saturation decision | Final concept typology CSV (+ optional iteration records) |
| Document coding | 3.1–3.2 | Coding mode selection (frequency or rating); batch size and extraction settings | Raw DTM prior to binarisation (including Extraction_Method and [?] flags) |
| DTM review | 3.2–3.3 | Review of raw DTM; correction of low-confidence [?] cells; identification of anomalous documents or concepts | Reviewed DTM CSV |
| Binarisation | 3.3 | Threshold mode selection (auto / fixed / manual); visual review of DTM heatmap and calibration statistics; confirmation before proceeding | Binarised DTM + threshold values used |
| TTM construction | 4 | None | Frequency-sorted TTM CSV + threshold values |
| Cluster analysis | 5.1–5.2 | Number of clusters; sensitivity review via explained variance; confirmation of cluster structure | Clusters, frame strength, concept designations, representative documents; cluster-sorted TTM CSV |
| Frame naming | 5.6 | Review and revision of working names; cluster count reconsideration | Named frames with validated concept configurations; frame analysis CSV; document-frame scores CSV |

---

*This document is the authoritative specification of the correlating resonance methodology at v0.9. Two open questions require resolution in the next development cycle, informed by results from initial corpus applications:*

*Primary open question: explicit criteria for cluster count decisions in MCA — currently determined by researcher judgement with reference to explained variance and the stingray visual standard, but not yet formalised as decision rules.*

*Secondary open question: the binarisation threshold rule — the auto mode (mean of non-zero values) has produced stronger results in initial testing than the original fixed 1/2 boundary rule, but has not been validated across sufficient corpora to be recommended as a general rule. Further corpus applications are needed before a defensible general recommendation can be made.*


# Licensing & Openness Strategy — Version Checkpoint

*Include this section in the specification document for each version. Review and update the "Current Position" before tagging a release.*

## Current Position

This project is developed openly on GitHub under [LICENCE NAME — recommended: Apache 2.0]. No proprietary framework has yet been separated from the open codebase. Reputation, methodological credibility, and trust are presently understood to be the primary commercial assets, and openness is judged to support rather than threaten them at this stage.

## Why This Decision Was Taken

For an AI toolkit built on a frontier model API, the code is rarely the moat. Commercial value lives in the underlying methodology, embedded domain expertise, calibration data, brand and credibility, and the trust required for clients to share sensitive material. None of these are exposed by an open repository. At the project's current stage, no proprietary intellectual property exists that would require protective closure, and the academic component benefits directly from open access.

## Asymmetry of Reversibility

Closing an open project is effectively impossible — prior versions remain loose under their original licence, and reputational cost is real. Opening a closed project is straightforward at any time. This asymmetry means the burden of proof sits with closure, not openness, but it also means that hygiene practices to *preserve the option to close or dual-licence later* must be maintained from the outset.

## Hygiene Practices to Keep Options Open

These should be in place regardless of whether closure is imminent:

- **Contributor License Agreement (CLA) or DCO sign-off** on all external contributions, so relicensing remains possible without tracking down past contributors.
- **Apache 2.0 over MIT** as the default permissive licence, for its explicit patent grant and defensive protection.
- **Clear separation between methodology and implementation** in documentation. Papers and conceptual contributions are cited as the academic contribution; the repository is one implementation of that methodology, not the methodology itself. A `CITATION.cff` file and explicit README framing support this.
- **Modular architecture** that would permit a future open-core split — keeping prompts, evaluation logic, orchestration, and interface layers cleanly separable even while all are presently open.
- **No embedded secrets, credentials, or client-specific calibration data** in the public repository, so a future commercial layer can be built without retroactive cleanup.

## Triggers for Re-evaluation

Reconsider the open-by-default position when any of the following occurs:

1. **Architectural separation emerges** — when the interface layer becomes meaningfully distinct from the algorithmic core, prompting a natural open-core split decision.
2. **First commercial offer** — when someone first offers to pay for a configured, hosted, or domain-specific version of the toolkit. This clarifies what the commercial layer actually is, faster than architectural planning alone.
3. **Proprietary calibration accumulates** — when domain-specific tuning, evaluation criteria, or training data represent significant non-replicable investment.
4. **Competitive cloning becomes plausible** — when the project gains enough visibility that bad-faith reuse (rebadging, hosted-service competition) becomes a realistic risk rather than a theoretical one.
5. **Contributor base grows** — when external contributions become substantial enough that future relicensing would be socially or legally complicated, prompting either formalisation of contribution terms or earlier strategic clarity.

## Re-evaluation Questions Per Version

At each version checkpoint, ask:

- Has any of the above triggers fired since the last version?
- Does the architecture still permit a clean future split between open and commercial layers?
- Are contribution-tracking practices (CLA/DCO, contributor records) still adequate for the current pace of external contribution?
- Is the distinction between the methodology (academically contributed) and this implementation (one realisation of it) still legible to a new reader of the README?
- Has the commercial picture clarified enough that the open-by-default position should be revisited?

If the answer to all of these is "no change required," document that and proceed. If any answer indicates movement, the licensing position itself becomes a specification item for the next version, not just a checkpoint note.