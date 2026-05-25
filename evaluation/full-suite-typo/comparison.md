# External Agent Backtest Comparison

Iteration: `C:\Users\tonyb\Documents\Playground\research-proof\research-proof-workspace\full-suite-typo`
Baseline variant: `clean_baseline`
Eval IDs: `0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27`
Expected Eval IDs: `0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27`

This report compares externally generated answer files graded by `tools/run-research-backtest.mjs --answers`. It is a behavioral sample, not a deterministic fixture.

| Variant | Evals | Full Passes | Eval Pass Rate | Expectations | Expectation Pass Rate | Lift vs Baseline |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| clean_baseline | 28 | 0 | 0.0% | 5 / 437 | 1.1% | +0.0% |
| with_skill_compact_rules | 28 | 7 | 25.0% | 396 / 437 | 90.6% | +89.5% |

## Interpretation

- Expectation pass rate measures partial behavioral lift.
- Full eval pass rate is intentionally strict: every shared assertion, failure mode, and forbidden shortcut must pass.
- Treat a high expectation lift with low full-pass count as useful but incomplete; it means the skill is steering behavior, but some required pressure is still missing.
