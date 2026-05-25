# External Agent Backtest Comparison

Iteration: `C:\Users\tonyb\Documents\Playground\research-proof\research-proof-workspace\post-patch-agent-sample`
Baseline variant: `clean_baseline`
Eval IDs: `14,15`
Expected Eval IDs: `14,15`

This report compares externally generated answer files graded by `tools/run-research-backtest.mjs --answers`. It is a behavioral sample, not a deterministic fixture.

| Variant | Evals | Full Passes | Eval Pass Rate | Expectations | Expectation Pass Rate | Lift vs Baseline |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| clean_baseline | 2 | 0 | 0.0% | 1 / 30 | 3.3% | +0.0% |
| with_skill_compact_rules | 2 | 2 | 100.0% | 30 / 30 | 100.0% | +96.7% |

## Interpretation

- Expectation pass rate measures partial behavioral lift.
- Full eval pass rate is intentionally strict: every shared assertion, failure mode, and forbidden shortcut must pass.
- Treat a high expectation lift with low full-pass count as useful but incomplete; it means the skill is steering behavior, but some required pressure is still missing.
