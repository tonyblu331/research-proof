# Changelog

## 1.1.0 - 2026-05-26

### Summary

Research Proof 1.1.0 upgrades the skill from a compact proof-ledger prompt into a measured research-verification system. It keeps the runtime skill small, removes Python from repo validation, broadens the mental models beyond frontier AI labs, and adds behavioral evidence that the skill changes agent output under noisy external evaluation.

### Added

- `tools/validate-research-skill.mjs` as the dependency-free structural validator.
- `tools/run-research-backtest.mjs` for deterministic fixture grading and external-answer grading.
- `tools/compare-external-backtests.mjs` for baseline/current/old-skill comparison with expected-ID integrity.
- `tools/export-skill-creator-evals.mjs` to adapt the compact eval schema to skill-creator-style eval files.
- `tools/create-research-eval-pack.mjs` for clean, typo-heavy, and mixed-language external-agent prompt packs.
- `tools/rate-research-skill.mjs` for the 12/10 maturity gate report.
- `skills/research-proof/references/source-patterns.md` with distilled patterns from OpenAI, Anthropic, Google DeepMind / Google Research, xAI, medical evidence disciplines, causal inference, systems engineering, design science, open science, graphics, mechanistic audits, and cross-domain mathematics.
- `skills/research-proof/references/research-operations.md` for observable loops, research TDD sandboxing, backtesting, prompt-injection boundaries, and SDD integration.
- `skills/research-proof/references/skill-steering.md` for registry injection, bounded subagent lanes, no-bloat rules, and the maturity ladder.
- Evaluation artifacts under `evaluation/`, including candid backtest, peer-pressure review, judgment-day review, real-task transfer, old-vs-new comparison, and full-suite typo-heavy external results.

### Changed

- Consolidated `skills/research-proof` as the single source of truth.
- Treats `plugins/research-proof-plugin/skills/research-proof` as a generated/copied distribution copy and fails validation on drift.
- Strengthened `SKILL.md` around exact output headings, source-aware but non-authority-driven references, prompt-injection handling, method selection, and backtesting.
- Expanded evals to 28 compact cases across AI research, medicine, clinical AI, causal inference, design research, systems engineering, cross-domain mathematics, SIGGRAPH-style artifact review, mechanism audits, live-source research, and skill/delegation steering.
- Reworked README validation instructions around Node tools and the 12/10 gate.
- Bumped Claude marketplace and plugin metadata to `1.1.0`.

### Removed

- Removed Python validation scripts from `skills/research-proof/scripts/` and the plugin copy.
- Removed duplicated `sandbox-scenarios.json`; `skills/research-proof/evals/evals.json` is now the case source of truth.
- Removed stale Python aggregation guidance from the skill behavioral-run protocol.

### Fixed

- External grading now rejects duplicate answer IDs and requires explicit `--expected-ids`.
- Comparison now requires an explicit baseline and matching actual/expected eval IDs across variants.
- `--clean` is constrained to a dedicated `*-workspace` under the repository.
- Proof-ledger decisions are parsed from the `Proof Ledger Decision` section instead of matching arbitrary labels elsewhere.
- Semantic grading now recognizes equivalent verifier/rejection language such as `only X may change` and `Ignoring Y fails the claim`.
- The maturity rater can now actually reach 12 when all evidence gates pass, while still capping scores when late-stage evidence is missing.

### Verification

No build was run.

```powershell
node .\tools\validate-research-skill.mjs
node .\tools\run-research-backtest.mjs --clean --json
node .\tools\export-skill-creator-evals.mjs --check
node .\tools\create-research-eval-pack.mjs --out research-proof-workspace\eval-pack-smoke.json --ids 0,17,27 --prompt-variant typo
node .\tools\rate-research-skill.mjs --out evaluation\12-10-gate-report.md
node -e "const fs=require('fs'); ['skills/research-proof/evals/evals.json','evaluation/full-suite-typo/baseline-clean.json','evaluation/full-suite-typo/with-skill-compact-rules.json'].forEach(p=>JSON.parse(fs.readFileSync(p,'utf8'))); console.log('json valid')"
git diff --no-index -- skills\research-proof plugins\research-proof-plugin\skills\research-proof
git diff --check
```

### Results

| Gate | Result |
| --- | --- |
| Deterministic fixture | with-skill `28 / 28`, `437 / 437`; without-skill `0 / 28`, `0 / 437` |
| Clean external 10-case sample | baseline `5 / 158`; current compact rules `146 / 158`; old compact rules `39 / 158` |
| Full-suite typo-heavy external run | baseline `5 / 437`; current compact rules `396 / 437`, `90.6%`, `+89.5%` lift |
| Maturity report | `12.0 / 12` local gate |

### Candid Limitation

The local 12/12 gate is earned by the current harness and artifacts, but it is not a claim of universal optimality. The next pressure is multi-seed full-suite and mixed-language external runs that improve the strict full-eval pass count without bloating the runtime skill.
