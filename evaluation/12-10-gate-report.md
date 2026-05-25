# Research Proof 12/10 Gate Report

Current rating: **11.4 / 12**

This score is intentionally capped by missing evidence gates. A 12/10 claim requires all maturity gates, not just a polished runtime skill.

Runtime skill lines: 100

External lift: with_skill_compact_rules beats clean_baseline by 96.7% expectations within C:\Users\tonyb\Documents\Playground\research-proof\research-proof-workspace\post-patch-agent-sample (100.0% vs 3.3%).

Full-suite external gate: with_skill_compact_rules reached 90.6% across 28 evals in C:\Users\tonyb\Documents\Playground\research-proof\research-proof-workspace\full-suite-typo.

| Level | Gate | Status | Evidence |
| --- | --- | --- | --- |
| L0 | Structural validator ready | PASS | Validator script exists and is run separately in CI/local verification. |
| L1 | Deterministic fixture | OPEN | No benchmark.json found. |
| L2 | External answer grading | PASS | 13 external summary files found. |
| L3 | Clean baseline sample | PASS | At least one clean baseline variant is present. |
| L4 | Expected-ID comparison integrity | PASS | External summaries carry matching eval_ids and expected_eval_ids. |
| L5 | Full-suite or noisy multi-seed behavior | PASS | Requires an external summary with at least 28 evals and >=90% expectation pass rate. |
| L6 | Old-vs-new regression dashboard | PASS | Requires old_skill_compact_rules and new/current skill variants in one workspace. |
| L7 | Real-task transfer | PASS | Requires a non-fixture research task transfer report. |
| L8 | Adversarial refresh | PASS | Judgment-day report exists and prompt-injection cases remain in suite. |

## Interpretation

- PASS means the artifact exists and satisfies the local integrity checks.
- OPEN means the next improvement requires evidence, not more skill prose.
- The score can move above 10 only after real-task transfer and adversarial refresh evidence exist.
