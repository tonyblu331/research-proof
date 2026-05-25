# External Agent Backtest Comparison

Iteration: `C:\Users\tonyb\Documents\Playground\research-proof\research-proof-workspace\old-new-agent-sample`
Baseline variant: `clean_baseline`
Eval IDs: `11,14,15,17,19,21,23,24,26,27`
Expected Eval IDs: `11,14,15,17,19,21,23,24,26,27`

This report compares externally generated answer files graded by `tools/run-research-backtest.mjs --answers`. It is a behavioral sample, not a deterministic fixture.

| Variant | Evals | Full Passes | Eval Pass Rate | Expectations | Expectation Pass Rate | Lift vs Baseline |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| clean_baseline | 10 | 0 | 0.0% | 5 / 158 | 3.2% | +0.0% |
| old_skill_compact_rules | 10 | 0 | 0.0% | 39 / 158 | 24.7% | +21.5% |
| with_skill_compact_rules | 10 | 2 | 20.0% | 146 / 158 | 92.4% | +89.3% |

## Interpretation

- Expectation pass rate measures partial behavioral lift.
- Full eval pass rate is intentionally strict: every shared assertion, failure mode, and forbidden shortcut must pass.
- Treat a high expectation lift with low full-pass count as useful but incomplete; it means the skill is steering behavior, but some required pressure is still missing.
