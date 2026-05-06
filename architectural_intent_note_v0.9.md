# Architectural Intent Note: Guidance for the v0.9 Revision

**Version:** 1.0
**Date:** 21 April 2026
**Purpose:** Guidance for the Claude conversation producing v0.9 of the correlating resonance methodology specification.
**Status:** Architectural intent. Not a methodological change.

---

## 1. Purpose of this Note

This note records architectural intent that should inform how v0.9 of the specification is written. It does not modify the methodology itself. Its purpose is to ensure that the v0.9 text is expressed in a form that will support a planned architectural separation of the implementing application at V2.0 and beyond, without requiring methodological change to achieve that separation.

The methodology and the application implementing it are versioned separately. Methodological versions follow the v0.x / v1.x convention documented in the specification. Application versions follow a separate V1.x / V2.x convention. This note is concerned with ensuring that the methodology specification is written in a way that supports the intended application architecture.

Check note below on open v closed archticture

## 2. Intended Application Architecture

The application currently exists as a single browser-based codebase at approximately V1.x. The intended future architecture separates the implementation into three architecturally distinct layers. The first separation is planned for V2.0, concurrent with migration to a server-side VPS deployment. The second separation is flagged as a probable subsequent refinement.

### Layer 1: Document Handling and Coding

Owns everything from corpus ingestion through to Document-Term Matrix (DTM) assembly. This includes the researcher interface for typology development, document management, LLM coding calls, and aggregation of individual document scores into the DTM. Corresponds to Sections 2, 3.1–3.2, and the coding-relevant portions of Section 7 of the methodology.

### Layer 2: Statistical Analysis

Owns everything from binarisation through to cluster output. Takes the raw DTM as its sole input. Produces the binarised DTM, TTM, clusters, frame strength measures, concept designations, and references (identifiers) to the documents that most closely match each cluster — but not the document content itself. Corresponds to Sections 3.3, 4, and 5.1–5.5.

This layer is methodology-aware at the level of the binarisation rule and the chosen clustering method, but should otherwise be expressible in methodology-agnostic terms. Any frame analysis methodology that produces a well-formed DTM could in principle consume this layer's services.

### Layer 3: Interpretation

Owns frame naming and reference-back to source documents to identify illustrative material — quotes, passages, or other evidence that substantiates the statistical characterisation of each frame. Takes two inputs: the cluster output from Layer 2, and the original document corpus managed by Layer 1. Produces named frames with supporting evidence drawn from the documents. Corresponds to Section 5.6 and the frame-naming portions of Section 7.

The separation of Layer 3 from Layer 2 is the second, subsequent separation. It is flagged here so that v0.9 is written with awareness of it, not because it is imminent.

## 3. The Interfaces Between Layers

Two interfaces matter and should be clearly legible from the v0.9 specification.

**DTM interface (Layer 1 → Layer 2).** The raw DTM as it leaves Layer 1 is the handoff to statistical analysis. The specification should make the structure and content of this output unambiguous: rows, columns, cell content, accompanying metadata (coding mode used, typology version), and the fact that the DTM is a self-contained artefact that can be serialised, archived, and passed to an analytical process that has no other knowledge of the corpus.

**Cluster-plus-document-reference interface (Layer 2 → Layer 3, with Layer 1 reference-back).** The statistical output hands Layer 3 the cluster structure and document identifiers pointing to representative documents. Layer 3 then reaches back to the document store managed by Layer 1 to retrieve content for interpretation. The specification should be clear that the statistical output does not itself contain document content — only identifiers — and that interpretation requires access to both the cluster output and the original corpus.

## 4. Practical Guidance for v0.9

The v0.9 revision should be written with awareness of these boundaries, so that each layer's responsibilities, inputs, and outputs are legible from the specification alone. Specifically:

1. Ensure that each stage's "required output" is described in a form that could be serialised and handed off to a separate process. If an output is currently described in a way that presumes continuous access to prior state, consider whether that description can be tightened.

2. Where Section 5.6 (frame naming) or Section 7 (LLM architecture) describe interpretation, be explicit about what inputs interpretation requires — specifically, the need for access to both cluster output and original documents for quote extraction and validation.

3. The Summary of Inputs and Outputs by Stage (current Section 8) should continue to function as a reference for identifying layer boundaries. When refining this table, consider whether the outputs listed are the natural handoff points between architectural layers.

4. If refinements in v0.9 introduce new dependencies between stages that would be expensive to separate later, flag these explicitly in the accompanying changelog so they can be considered before hardening.

## 5. What This Note Does Not Mean

This note does not require the v0.9 specification to be restructured around the three-layer architecture. The specification should continue to present the methodology as a coherent analytical process, not as a software architecture. The architectural separation is a deployment concern, not a methodological one.

This note does not license methodological change. The layers described here are architectural abstractions over the methodology as it stands. If v0.9 introduces methodological refinements for other reasons — drawn from MVP learnings — those should be judged on their own merits, not shaped by architectural convenience.

---

*This note should accompany v0.8 as an input to the v0.9 revision conversation. It is expected to remain stable across subsequent versions of the methodology; it should be updated only if the intended architecture itself changes.*

# Licensing & Openness Strategy — Version Checkpoint
Current Position
This project is developed openly on GitHub under the Apache License 2.0. No proprietary framework has yet been separated from the open codebase. Reputation, methodological credibility, and trust are presently understood to be the primary commercial assets, and openness is judged to support rather than threaten them at this stage.
Licence Layering
The licensing strategy operates across three distinct layers, each with its own logic and licence type. Treating them as separate decisions rather than a single licensing question is itself a deliberate choice — it preserves clarity of purpose and prevents drift into a one-size-fits-all stance.

Source code — Apache License 2.0. Declared in the repository LICENSE file and README. Covers the implementation of the toolkit. Selected for permissive distribution with patent grant and defensive termination provisions.
Methodology and academic documentation — Creative Commons Attribution (CC BY). Covers the written expression of the methodology: papers, diagrams, formal descriptions. Maximises academic citation, adoption, and reach. Subject to per-journal verification, since publisher agreements may modify or override this choice at submission. Note that copyright covers expression only; the methodology as a procedure remains freely implementable by others regardless of the licence on its description.
Application output and client-facing artifacts — terms determined per engagement. Anything the toolkit produces for users or clients sits outside the open-source and open-content layers. Default terms have not been set, and explicit decisions are made when commercial or consulting work begins. This layer is the one most likely to require deliberate thought as the project moves from research toolkit to commercial offering.

The discipline this layering imposes is that future decisions are taken about a specific layer, not about "the licence" in the abstract. A change to the source code licence does not automatically extend to the methodology, and a commercial engagement does not automatically alter the open-source position.
Why This Decision Was Taken
For an AI toolkit built on a frontier model API, the code is rarely the moat. Commercial value lives in the underlying methodology, embedded domain expertise, calibration data, brand and credibility, and the trust required for clients to share sensitive material. None of these are exposed by an open repository. At the project's current stage, no proprietary intellectual property exists that would require protective closure, and the academic component benefits directly from open access.
Asymmetry of Reversibility
Closing an open project is effectively impossible — prior versions remain loose under their original licence, and reputational cost is real. Opening a closed project is straightforward at any time. This asymmetry means the burden of proof sits with closure, not openness, but it also means that hygiene practices to preserve the option to close or dual-licence later must be maintained from the outset.
Hygiene Practices to Keep Options Open
These should be in place regardless of whether closure is imminent:

Contributor sign-off (DCO) on all external contributions. Apache 2.0 section 5 already licenses inbound contributions under the same terms by default, so a sign-off is sufficient for protection. It is retained here because relicensing or dual-licensing later still requires explicit contributor consent, and tracking sign-offs from the outset is the cheapest way to preserve that option. A full Contributor Licence Agreement (CLA) is overkill until contribution volume justifies it.
Apache License 2.0 as the chosen permissive licence. Apache 2.0 was selected over MIT for its explicit patent grant (sections 3 and 5) and its defensive termination provisions, which matter for a methodology-heavy project that may evolve commercially.
LICENSE file at the repository root, with NOTICE file if attribution requirements arise. Source file headers following the Apache recommendation are encouraged but not strictly required.
Clear separation between methodology and implementation in documentation. Papers and conceptual contributions are cited as the academic contribution; the repository is one implementation of that methodology, not the methodology itself. A CITATION.cff file and explicit README framing support this.
Modular architecture that would permit a future open-core split — keeping prompts, evaluation logic, orchestration, and interface layers cleanly separable even while all are presently open.
No embedded secrets, credentials, or client-specific calibration data in the public repository, so a future commercial layer can be built without retroactive cleanup.

Triggers for Re-evaluation
Reconsider the open-by-default position when any of the following occurs:

Architectural separation emerges — when the interface layer becomes meaningfully distinct from the algorithmic core, prompting a natural open-core split decision.
First commercial offer — when someone first offers to pay for a configured, hosted, or domain-specific version of the toolkit. This clarifies what the commercial layer actually is, faster than architectural planning alone.
Proprietary calibration accumulates — when domain-specific tuning, evaluation criteria, or training data represent significant non-replicable investment.
Competitive cloning becomes plausible — when the project gains enough visibility that bad-faith reuse (rebadging, hosted-service competition) becomes a realistic risk rather than a theoretical one.
Contributor base grows — when external contributions become substantial enough that future relicensing would be socially or legally complicated, prompting either formalisation of contribution terms or earlier strategic clarity.

Re-evaluation Questions Per Version
At each version checkpoint, ask:

Has any of the above triggers fired since the last version?
Does the architecture still permit a clean future split between open and commercial layers?
Are contribution-tracking practices (CLA/DCO, contributor records) still adequate for the current pace of external contribution?
Is the distinction between the methodology (academically contributed) and this implementation (one realisation of it) still legible to a new reader of the README?
Has the commercial picture clarified enough that the open-by-default position should be revisited?

If the answer to all of these is "no change required," document that and proceed. If any answer indicates movement, the licensing position itself becomes a specification item for the next version, not just a checkpoint note.
