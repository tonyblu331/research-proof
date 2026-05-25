# Real-Task Transfer Report

## Task

Use the research-proof skill to improve the research-proof repository itself: consolidate the source of truth, remove Python from validation, learn from AI labs and cross-field research disciplines, harden prompt-injection boundaries, and backtest the result without bloating runtime context.

## Baseline

Before this iteration, the skill already had a proof-program shape, but the repo had several transfer gaps:

- Python scripts were part of the validation path.
- Runtime skill text mixed core instructions with operational detail.
- External comparison did not enforce expected eval IDs or explicit baseline selection.
- Old-vs-new skill lift was not measured.
- Cross-field patterns existed mostly as intent, not as a compact source-pattern reference and eval pressure.

## Candidate

The current implementation uses:

- `skills/research-proof` as source of truth and plugin copy as distribution.
- Dependency-free Node validation and grading tools.
- `evals/evals.json` as the single eval source of truth.
- `references/source-patterns.md`, `research-operations.md`, and `skill-steering.md` for progressive disclosure.
- External-answer grading with expected-ID integrity and explicit baseline comparison.
- Judgment-day review plus old-vs-new regression evidence.

## Evidence

| Gate | Result |
| --- | --- |
| Runtime compactness | `SKILL.md` stays at 100 lines. |
| Structural validation | `node tools/validate-research-skill.mjs` passes. |
| Deterministic harness | 28/28 with-skill, 437/437 expectations; no-skill fixture 0/437. |
| Clean baseline vs current sample | Baseline 5/158 expectations; current with-skill 146/158. |
| Old vs current sample | Old compact rules 39/158 expectations; current compact rules 146/158 on the same 10 evals. |
| Prompt-injection transfer | Four injection/security evals plus source/sink/capability rules. |
| Distribution transfer | Root and plugin skill directories match under drift check. |

## Verdict

`SUPPORTED`: the skill transferred to a real repo-improvement task and produced measurable improvements in harness safety, skill compactness, source consolidation, and old-vs-new behavior.

It is not `PROVEN` as a universal research skill. The remaining gates require full-suite noisy external runs and periodic adversarial refresh against new prompt-injection/source-drift cases.

## Proof Ledger Decision

CONTINUE: promote the score only after a full-suite noisy external sample passes and the transfer result repeats outside this repository.

## Next Pressure

Run full-suite typo and mixed-language external packs, then apply the skill to one unrelated repo/domain and compare decisions against a baseline reviewer.
