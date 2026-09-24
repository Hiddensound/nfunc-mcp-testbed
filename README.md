# nfunc-mcp-testbed

A small, **deliberately defective** storefront ("Trailhead Outfitters") for
exercising every tool in [nfunc-mcp](https://github.com/Hiddensound/NFunc_MCP).
Every bug is marked in the source with a `[BUG – …]` comment.

```bash
npm install
npm start            # http://localhost:3000
npm run lint         # ESLint – expect exactly 1 error
npm run gen:assets   # regenerate the heavy hero PNG / vendor JS / SVGs
```

| Page | Purpose |
|---|---|
| `/` (index.html) | Baseline. Clean except the shared footer contrast. |
| `/products.html` | Use case 1: WCAG 2.1 **Level A** failures. |
| `/deals.html` | Use case 2: components failing **performance + accessibility**. |

---

## Use case 1 – Level A violations against an AA target

**Tool:** `run_accessibility_check` (default `target_level: "AA"`, standard `WCAG2AA`)

> Run an accessibility check on http://localhost:3000/products.html

`products.html` failures (all Level A → **P1**, AA conformance unreachable):

| WCAG | Level | Defect | pa11y code |
|---|---|---|---|
| 1.1.1 Non-text Content | A | 4 product images with no `alt` | `H37` |
| 1.3.1 Info & Relationships | A | search input and select have no label | `F68` |
| 2.4.2 Page Titled | A | no `<title>` | `H25.1.NoTitleEl` |
| 3.1.1 Language of Page | A | `<html>` has no `lang` | `H57.2` |
| 4.1.2 Name, Role, Value | A | icon-only cart link, unlabeled input/select, empty submit button | `H91.*` |
| 1.4.3 Contrast (Minimum) | **AA** | footer text (shared layout) → **P2** | `G18.Fail` |

## Use case 2 – Components failing both Lighthouse and pa11y

**Tool:** `run_qa_gate`

> QA snapshot — http://localhost:3000/deals.html, code at ~/Documents/nfunc-mcp-testbed

| Component | Performance defect (Lighthouse) | Accessibility defect | Correlator pair |
|---|---|---|---|
| B – Hero banner | ~5.8 MB PNG, unsized, oversized → LCP ≈ 30 s, image-delivery, total-byte-weight, unsized-images | no `alt` | `image-alt` ↔ `H37` |
| C – Flash-sale carousel | long synchronous tasks → TBT ≈ 4 s, bootup-time, main-thread work | grey-on-white text; icon-only prev/next buttons | `color-contrast` ↔ `G18`, `button-name` ↔ `H91.Button` |
| D – Deal list | — | empty "read more" links; h1 → h4 skip | `link-name` ↔ `H91.A.`, `heading-order` (LH only) |
| E – Deal alerts | — | email input with no label | `label` ↔ `H91.InputEmail` |
| A – Promo bar | injected 1.5 s after load → CLS ≈ 0.2 | — | — |
| `<head>` vendor script | ~370 KB render-blocking, ~320 KB unused JS | — | — |
| Server | `Cache-Control: no-store`, no compression | — | — |

Expect `run_qa_gate` to return correlated findings with `confirmed_by:
["lighthouse","pa11y"]`, promoted one tier, plus a composite score
(Lighthouse 40% / pa11y 40% / static 20%), a release verdict and an HTML report.

Measured locally (Lighthouse 13.3, mobile): **deals** Perf 20 / A11y 71,
**products** Perf 100 / A11y 62, **index** Perf 100 / A11y 96.

## Use case 3 – Accessibility scan across 3 pages

> Run an accessibility check on http://localhost:3000/, http://localhost:3000/products.html, http://localhost:3000/deals.html

Batch mode. The footer contrast fails on 3 of 3 pages, so it should be
reported as a **shared-layout** defect (one fix clears every page).

## Use case 4 – Lighthouse web vitals across 3 pages

> Run Lighthouse on these: http://localhost:3000/, http://localhost:3000/products.html, http://localhost:3000/deals.html

Two fast pages and one very slow page (`deals`) give the cross-page rollup a
clear outlier. Add `form_factor: "both"` for mobile + desktop.

## Use case 5 – OWASP Top 10 (Semgrep)

**Tool:** `run_static_analysis` → `path: ~/Documents/nfunc-mcp-testbed`

| File | Defect | Caught by default rules (`p/javascript` + `p/typescript`)? |
|---|---|---|
| `src/routes/diagnostics.js:11` | **A03 Injection** – OS command injection via `exec("ping -c 1 " + req.query.host)` | ✅ `express-child-process` (category `security` → **P1**) |
| `src/routes/search.js:11` | **A03 Injection** – SQL built by string concatenation from `req.query.q` | ❌ only with `ruleset: "r/javascript.express.security.injection.tainted-sql-string"` |

The SQL injection is a useful test of the `ruleset` override. It is not in
`p/javascript` or `p/owasp-top-ten`.

## Use case 6 – ESLint

Same `run_static_analysis` call. The repo ships its own `eslint.config.mjs`, so
`eslint_config_used` should be `"project"`, with exactly one finding:

- `src/utils/pricing.js:5` – `no-unused-vars` (`legacyDiscountRate`)
