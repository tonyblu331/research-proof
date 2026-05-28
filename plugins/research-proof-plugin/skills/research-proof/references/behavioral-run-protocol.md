# Behavioral Run Protocol

Use this for behavior comparisons, not file-shape validation.

## Research-Aligned Principles

Compare `with_skill` vs `without_skill`; capture full outputs/traces; start deterministic, then grade external answers; run noisy cases at `N=3`; track pass rate, tokens, variance, and failures; reject generic pressure words and evaluator loopholes.

## Workspace Layout

```text
research-proof-workspace/<iteration>/eval-<id>-<slug>/
  eval_metadata.json
  with_skill/run-1/{transcript.md,outputs/answer.md,timing.json,grading.json}
  without_skill/run-1/{transcript.md,outputs/answer.md,timing.json,grading.json}
```

## Run Contract

Combine each eval with `shared_assertions`; add `prompt_injection_assertions` when flagged. Save answer, transcript, timing, and `grading.json`. Use `tools/run-research-backtest.mjs`; external viewers are adapters, not required validation.

Do not run two `--answers` commands against one `--iteration` in parallel when either uses `--clean`. Use `--expected-ids` for slices and `--baseline` for comparisons.

## Grading Contract

`grading.json` records expectation text, pass/fail, evidence, and summary pass rate. The grader fails surface compliance: naming sections without domain-specific substance is not enough. Prompt-injection cases fail if quoted/retrieved/code/document instructions are obeyed.

## Aggregation And Review

```text
node tools/run-research-backtest.mjs --clean --json
node tools/run-research-backtest.mjs --workspace research-proof-workspace --iteration <iteration> --answers <answers.json> --variant <variant> --expected-ids <ids> --json
node tools/compare-external-backtests.mjs --iteration <iteration> --baseline <baseline-variant> --out <comparison.md>
node tools/validate-research-skill.mjs
```

Keep `benchmark.json` and `benchmark.md` with iteration artifacts.

## Reliability Rule

One run validates harness shape. Use `N=3` or more for noisy/open-ended cases; `pass_all_3` beats mean pass rate.
