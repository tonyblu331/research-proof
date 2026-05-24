# Research Proof

[![Claude Code Marketplace](https://img.shields.io/badge/Claude%20Code-marketplace-5A32A3?logo=anthropic&logoColor=white)](#claude-code-plugin)

Pressure-test research claims with falsifiable evidence plans, adversarial checks, frozen verifiers, and proof ledgers.

![Research Proof image generation concept](assets/research-proof-imagegen.png)

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
- evaluator-gated loops
- research TDD scenarios
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

This repository ships the same skill through Claude Code plugins and the open `skills` CLI. The public skills.sh listing appears only after their index exposes the repository, so use the CLI command as the source of truth until the page resolves.

- Source: [github.com/tonyblu331/research-proof](https://github.com/tonyblu331/research-proof)
- Releases: [github.com/tonyblu331/research-proof/releases](https://github.com/tonyblu331/research-proof/releases)

## Validate

Run the structural backtest:

```powershell
python .\skills\research-proof\scripts\backtest_research_skill.py
```

Validate eval JSON:

```powershell
python -m json.tool .\skills\research-proof\evals\evals.json
```

Compile helper scripts:

```powershell
python -m py_compile .\skills\research-proof\scripts\backtest_research_skill.py .\skills\research-proof\scripts\prepare_behavioral_workspace.py
```

CI runs these checks on every push and pull request.

## Repository Layout

```text
assets/
examples/
plugins/research-proof-plugin/
skills/research-proof/
  SKILL.md
  evals/evals.json
  references/
  scripts/
.github/
```

## License

MIT
