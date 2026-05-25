# Research Proof

[![Claude Code Marketplace](https://img.shields.io/badge/Claude%20Code-marketplace-5A32A3?logo=anthropic&logoColor=white)](#claude-code-plugin)

Pressure-test research claims with falsifiable evidence plans, adversarial checks, frozen verifiers, evidence certainty checks, and proof ledgers.

Research Proof distills verifier patterns from Google DeepMind / Google Research, OpenAI, Anthropic, university research traditions, systems engineering, design science, causal inference, open science, and medical research disciplines such as PRISMA, SPIRIT, and GRADE. Those references shape the method; they are not treated as proof of any user claim.

![Research Proof image generation concept](assets/research-proof-imagegen.png)

## Release 1.1.0

This release turns Research Proof from a useful proof-ledger skill into a measured research-verification harness.

Highlights:

- Consolidated `skills/research-proof` as the source of truth and made the plugin skill copy a drift-checked distribution artifact.
- Removed Python from repo validation and replaced it with dependency-free Node tooling.
- Added compact source-pattern references from AI labs, universities, systems engineering, medicine, causal inference, design science, graphics, mechanistic audits, and live-source research.
- Expanded eval coverage for clinical AI readiness, prompt injection, cross-domain mathematical transfer, design research, observational causality, tool-grounded science, and skill/delegation steering.
- Added external-agent eval packs, old-vs-new comparison, full-suite typo-heavy grading, and a 12/10 maturity gate.
- Verified the full noisy external suite at `396 / 437` expectations, `90.6%`, with `+89.5%` lift over clean baseline.

See [`CHANGELOG.md`](CHANGELOG.md) for the detailed release notes and verification commands.

## Install

```powershell
npx skills add tonyblu331/research-proof --skill research-proof
```

Global install:

```powershell
npx skills add tonyblu331/research-proof --skill research-proof -g
```

List available skills before installing:

```powershell
npx skills add tonyblu331/research-proof --list
```

Manual install:

```powershell
git clone https://github.com/tonyblu331/research-proof.git
```

Then copy `skills/research-proof` into your agent's skills directory.

## Claude Code Plugin

This repo is a Claude Code marketplace. Install it with:

```powershell
claude plugin marketplace add tonyblu331/research-proof
claude plugin install research-proof-plugin@research-proof
```

Invoke it with:

```text
/research-proof-plugin:research-proof
```

The plugin wrapper lives here:

```text
.claude-plugin/marketplace.json
plugins/research-proof-plugin/
  .claude-plugin/plugin.json
  skills/research-proof/
```

Local plugin test:

```powershell
claude plugin marketplace add .\
claude --plugin-dir .\plugins\research-proof-plugin
```

Validate the marketplace and plugin manifests:

```powershell
claude plugin validate .
claude plugin validate .\plugins\research-proof-plugin
```

## Use It For

Use Research Proof when a claim is promising but still vague:

```text
Use research-proof to pressure-test this claim: our agent loop can improve a prompt library overnight without human review.
```

Good fits:

- research roadmaps
- benchmark reviews
- proof ladders
- cross-domain mathematical transfer
- evaluator-gated loops
- research TDD scenarios
- clinical or intervention evidence questions
- systematic reviews and evidence-certainty checks
- causal inference and observational-data claims
- mathematical innovation by borrowing invariants, constructions, or proof tools from distant fields
- SIGGRAPH-style artifact, rendering, simulation, and perceptual-system claims
- tool-grounded scientific workflows and live-source research claims
- clinical AI reporting, calibration, validation, and deployment-readiness claims
- design research and prototype-readiness claims
- research-program strategy and funding decisions
- adversarial follow-up tests

## What It Produces

Research Proof forces the agent to define:

```text
Claim
Verifier Boundary
Baseline / Candidate Family
Current Evidence
Enemy Terms
Rejection Gates
Evidence Certainty
Proof Ladder / Transfer Path
Verdict
Proof Ledger Decision
Next Pressure
```

Evidence is labeled as `PROVEN`, `SUPPORTED`, `REJECTED`, or `OPEN`.

## Quick Example

Messy claim:

```text
Our autonomous loop can improve a prompt library overnight without human review.
```

Research Proof rewrite:

```text
Claim
For prompt set D and baseline B, candidate loop C wins only if held-out task score improves by +5% while latency, token cost, regressions, and human review stay within budget.

Verifier Boundary
The evaluator, held-out tasks, scoring rubric, and regression set are frozen before the loop starts. The candidate can edit prompts only. It cannot inspect held-out answers, change tests, widen budgets, or mark its own outputs as accepted.

Rejection Gates
Reject if the candidate changes the evaluator, fails regression, exceeds token budget, improves only visible tasks, or requires manual cleanup.

Proof Ledger Decision
OPEN until it wins the frozen harness and survives transfer.

Next Pressure
Run a transfer test on a new prompt family with the same scoring rules.
```

See [`examples/fuzzy-claim-proof-ledger.md`](examples/fuzzy-claim-proof-ledger.md) for the full worked example.

## Distribution

This repository ships the same skill through Claude Code plugins and the open `skills` CLI. The source of truth is `skills/research-proof`; the plugin skill directory is a distribution copy and validation fails if it drifts.

- Source: [github.com/tonyblu331/research-proof](https://github.com/tonyblu331/research-proof)
- Releases: [github.com/tonyblu331/research-proof/releases](https://github.com/tonyblu331/research-proof/releases)

## Validate

Run the structural validator:

```powershell
node .\tools\validate-research-skill.mjs
```

Validate eval JSON:

```powershell
node -e "JSON.parse(require('fs').readFileSync('skills/research-proof/evals/evals.json', 'utf8'))"
```

Export evals to the standard `skill-creator` shape when running comparative behavioral reviews:

```powershell
node .\tools\export-skill-creator-evals.mjs --out research-proof-workspace\evals.skill-creator.json
```

Create a compact external-agent eval pack, including typo or mixed-language prompt variants:

```powershell
node .\tools\create-research-eval-pack.mjs --ids all --prompt-variant typo --out research-proof-workspace\full-suite-typo-pack.json
```

Run the local deterministic backtest harness:

```powershell
node .\tools\run-research-backtest.mjs --clean
```

Grade external agent answers and compare variants:

```powershell
node .\tools\run-research-backtest.mjs --workspace research-proof-workspace --iteration external-agent-sample --clean --answers evaluation\external-agent-sample\baseline-clean.json --variant clean_baseline --expected-ids 11,14,15,17,19,21,23,24,26,27 --json
node .\tools\run-research-backtest.mjs --workspace research-proof-workspace --iteration external-agent-sample --answers evaluation\external-agent-sample\with-skill-compact-rules.json --variant with_skill_compact_rules --expected-ids 11,14,15,17,19,21,23,24,26,27 --json
node .\tools\compare-external-backtests.mjs --iteration external-agent-sample --baseline clean_baseline --out evaluation\external-agent-sample\comparison.md
```

Rate the 12/10 maturity gates:

```powershell
node .\tools\rate-research-skill.mjs --out evaluation\12-10-gate-report.md
```

CI runs these checks on every push and pull request.

The eval harness is intentionally compact: `skills/research-proof/evals/evals.json` is the case source of truth, `references/backtest-cases.md` defines grading rules and failure labels, `references/skill-steering.md` defines delegation and 12/10 maturity gates, `tools/create-research-eval-pack.mjs` packages external-agent runs without duplicating cases, and `tools/export-skill-creator-evals.mjs` adapts the suite for external benchmark tooling.

## Repository Layout

```text
assets/
examples/
plugins/research-proof-plugin/
skills/research-proof/
  SKILL.md
  evals/evals.json
  references/
tools/
  compare-external-backtests.mjs
  create-research-eval-pack.mjs
  export-skill-creator-evals.mjs
  rate-research-skill.mjs
  run-research-backtest.mjs
  validate-research-skill.mjs
.github/
```

## License

MIT
