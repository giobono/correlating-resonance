# CorRes Project Brief — Preparation for v0.9.1 Platform/Application Split

**Issued from:** ArtIE platform project
**Issued to:** CorRes (Correlating Resonance) project
**Date:** 1 May 2026
**Status:** For confirmation before any code work begins on the split

---

## 1. Purpose

This brief lists the structural decisions that need to be agreed between the two projects before the CorRes v0.9.1 split commences. It accompanies platform contract v0.2, which is the authoritative reference for platform-level commitments and is provided separately.

The CorRes project is asked to confirm each of the items in §3 and §4 below, and to produce the two artefacts listed in §5, before any code is moved.

## 2. Context

CorRes is the first application in the ArtIE suite. Up to v0.9.0, application logic and shared platform services have been entangled in a single codebase. v0.9.1 is the release in which they are formally separated:

- **Platform code** (LLM abstraction, storage, file services, export, observability, auth, tenancy) becomes a shared library under `platform/`.
- **CorRes code** (methodology, prompts, workflows, schemas, application API) moves under `apps/corres/`.

The boundary is enforced by import discipline: application code may import only from `platform.*` or its own namespace. With a solo developer, this is enforced by review rather than by a CI lint rule, but the discipline itself is non-negotiable — the future option to split applications into separate services depends on it being held throughout.

v0.9.0 has been tagged on GitHub as the pre-split snapshot.

## 3. Items requiring confirmation — identifiers and structure

### 3.1 Identifiers

| Item | Value | Source |
|---|---|---|
| `app_id` | `corres` | Contract §3.2 (lowercase alphanumeric + underscores) |
| Beta `tenant_id` | `artie_corres_v0` | Contract §4.3, while CorRes is sub-1.0 |
| Platform library SemVer (initial) | `0.1.0` | Decoupled from any application's version |

The beta `tenant_id` rolls over to `artie_corres_v1` at the v1.0 release cut, per contract §4.4.

### 3.2 Repository topology

A new monorepo named `artie` will be created on GitHub when the platform code is ready to be moved. The existing `correlating-resonance` repo is unaffected — it remains the frontend repository (HTML/CSS/JS, methodology spec, GitHub Pages mirror).

The two repositories communicate over HTTP only. There is no code-level dependency between them.

### 3.3 Directory structure inside the `artie` repo

```
artie/
├── platform/
│   ├── llm/
│   ├── storage/
│   ├── files/
│   ├── export/
│   ├── observability/
│   ├── auth/
│   ├── tenancy/
│   ├── api/
│   └── registry/
├── apps/
│   └── corres/
│       ├── api/
│       ├── prompts/
│       ├── schemas/
│       ├── workflows/
│       ├── tests/
│       └── docs/
├── tests/
│   └── contract/
├── docs/
│   └── platform/
├── main.py
└── requirements.txt
```

Cross-application imports are prohibited. Application code may import only from `platform.*` or from within its own `apps/<app_id>/` namespace.

### 3.4 URL and storage paths

| Item | Value | Source |
|---|---|---|
| API path | `/v1/corres/...` | Contract §10 |
| Storage path | `/corres/<tenant_id>/<object_path>` | Contract §9 |

The `v1` prefix is registered at the route-mounting line in `main.py` and does **not** appear in the directory structure. It is a property of the URL clients see, not the on-disk layout.

### 3.5 Hosting layout (informational — for CorRes awareness, not action)

Production deployment on `ebono.com.au`:

```
/public_html/
    artie/index.html         (ArtIE landing page)
    corres/                  (HTML/CSS/JS — CorRes app)
    index.html               (Ebono Institute, WordPress)
/api/
    platform/                (shared services)
    apps/
        corres/              (CorRes-specific endpoints)
    main.py
    requirements.txt
```

The API is served from a dedicated subdomain: `api.ebono.com.au`.

A development environment will mirror this layout at a parallel URL (subdomain or separate host, to be decided). The development API will be served from `api-dev.ebono.com.au` or equivalent.

### 3.6 Runtime configuration

The frontend will use a runtime config file (`config.js`) loaded by every page, defining the API base URL for the current deployment. The config file is **not** committed to the repository — it is generated per environment at deployment time. The repository may hold a `config.example.js` as a template.

CorRes application code reads the API base from `window.CORRES_CONFIG.apiBase` rather than hard-coding any URL.

## 4. Items requiring confirmation — process

### 4.1 Documentation home

| Document | Location |
|---|---|
| Platform contract and platform reference docs | `docs/platform/` in `artie` repo |
| CorRes methodology specification | `docs/` in `correlating-resonance` repo (existing) |
| CorRes user-facing app documentation | `apps/corres/docs/` in `artie` repo |
| Academic publication drafts | Outside both code repositories |

### 4.2 Migration sequence

1. Tag current CorRes state as `v0.9.0` on GitHub. **(Done)**
2. Create the `artie` repository with empty `platform/` and `apps/corres/` skeletons.
3. Move shared services into `platform/` first.
4. Move CorRes domain code into `apps/corres/` in a single commit, fixing imports as needed.
5. Test against the development API (`api-dev.ebono.com.au`).
6. Tag `corres-v0.9.1` and `platform-v0.1.0`.
7. Promote to production once stable.

## 5. Items the CorRes project must produce before the split begins

### 5.1 Declared override surface

Per the §16 amendment to platform contract v0.2, the platform's file upload/download services must expose declared configuration knobs for any behaviour that affects CorRes methodology. The CorRes project is asked to produce a list of every such knob it requires.

The PDF text-extraction threshold is the worked example. Others may include: maximum file size, allowed MIME types, OCR fallback toggles, page-range limits, encoding handling. The list is needed before the file-services interface is frozen, so that the platform exposes the right surface from the start.

### 5.2 Model registry initial task taxonomy

The platform's model registry (contract §6, amended) lets applications select models by task semantics rather than by provider model identifier. The taxonomy is platform-managed but cannot ship empty.

The CorRes project is asked to confirm whether the proposed initial set is complete and correctly named for v0.9.1 use:

- `open_coding`
- `structured_extraction`
- `interpretation`

If additional task semantics are needed (e.g. for Phase 4 cluster naming, or for any methodology task that uses the LLM differently from these three), please specify them with a short description of what distinguishes each.

The identifier-pinning escape hatch is a separate mechanism, exposed as an explicit parameter on every registry call. It does not need to be enumerated here.

## 6. Items explicitly deferred

These are recorded so the CorRes project does not raise them as gaps in the present brief:

- **Separation of CorRes from future academic tools** sharing prompt or schema infrastructure. Tracked as a v0.9.2 consideration.
- **Parallel deployment of multiple platform versions in production.** Architecturally accommodated by the `/v1/...`, `/v2/...` URL path convention, but the implementation work is deferred until an external constraint requires it.
- **CI lint rule** for mechanical enforcement of import discipline. The contract specifies this; with a solo developer, enforcement is by review. The rule will be added if a second committer joins the codebase or if drift is observed.
- **Promotion criteria** for moving CorRes from beta-default tenancy to authenticated tenancy. Tracked under contract §16.

## 7. What to confirm

The CorRes project is asked to respond with:

1. **Confirmation** of every item in §3 and §4, or **proposed amendments** with rationale.
2. **The override surface list** (§5.1).
3. **The task taxonomy confirmation or extension** (§5.2).

Once these are received and the platform contract amended where necessary, the migration sequence in §4.2 may begin.
