# Judgment Day Review

## Scope

Two independent external judge agents reviewed the research-proof skill rewrite, Node harness, external-answer comparison, and evaluation reports. The target was not praise; the target was to find ways the repo could fool itself.

## Round 1 Confirmed Findings

| Finding | Severity | Resolution |
| --- | --- | --- |
| `--clean` could delete outside the intended workspace | CRITICAL | Added `safeIterationDir()` and require cleanup to stay inside the repo and a dedicated `*-workspace`. |
| External answers could omit or duplicate eval IDs | WARNING (real) | Reject duplicate answer IDs and require `--expected-ids` for every `--answers` run. |
| Comparisons could infer the wrong baseline | WARNING (real) | `compare-external-backtests.mjs` now requires `--baseline`. |
| Comparisons could mix non-identical eval sets | WARNING (real) | Comparison now validates actual and expected eval IDs across all variants. |
| Proof ledger checks could pass from unrelated answer text | WARNING (real) | Ledger parser now reads the `Proof Ledger Decision` section and requires a leading enum. |
| Prompt-injection and shortcut checks were too keyword-led | WARNING (real) | Grading now scopes evidence to operational sections and requires shortcut terms near rejection/failure language. |
| Reports overclaimed stale historical samples | WARNING (real) | Reports now separate historical external samples from fresh post-patch targeted samples. |

## Round 2 Confirmed Findings

| Finding | Severity | Resolution |
| --- | --- | --- |
| `--expected-ids` was still optional with `--answers` | WARNING (real) | Missing, empty, malformed, or duplicate expected IDs now fail. |
| Baseline matching still allowed inference/duplicates | WARNING (real) | Baseline is mandatory and must match exactly one summary variant. |
| `expected_eval_ids` were not enforced during comparison | WARNING (real) | Comparison requires `expected_eval_ids`, verifies they match actual `eval_ids`, and prints both in the report. |
| Ledger parser rejected too little, then briefly too much | WARNING (real) | Parser now requires a leading enum and rejects explicit conflicting labels without mistaking ordinary prose for a second decision. |
| Forbidden shortcut grading accepted mentions without rejection | WARNING (real) | Each forbidden shortcut must appear near `reject`, `fail`, `forbid`, `must not`, `cannot`, or equivalent refusal language. |
| Live-source method naming drifted | SUGGESTION | Canonicalized runtime method as `Evidence synthesis / live-source research review`. |

## Verification

The post-fix harness was run with positive and negative checks:

```text
node .\tools\validate-research-skill.mjs
node .\tools\run-research-backtest.mjs --clean --json
node .\tools\export-skill-creator-evals.mjs --check
node .\tools\run-research-backtest.mjs --workspace research-proof-workspace --iteration external-agent-sample --clean --answers evaluation\external-agent-sample\baseline-clean.json --variant clean_baseline --expected-ids 11,14,15,17,19,21,23,24,26,27 --json
node .\tools\run-research-backtest.mjs --workspace research-proof-workspace --iteration external-agent-sample --answers evaluation\external-agent-sample\with-skill-compact-rules.json --variant with_skill_compact_rules --expected-ids 11,14,15,17,19,21,23,24,26,27 --json
node .\tools\compare-external-backtests.mjs --iteration external-agent-sample --baseline clean_baseline --out evaluation\external-agent-sample\comparison.md
node .\tools\run-research-backtest.mjs --workspace research-proof-workspace --iteration post-patch-agent-sample --clean --answers evaluation\post-patch-agent-sample\baseline-clean.json --variant clean_baseline --expected-ids 14,15 --json
node .\tools\run-research-backtest.mjs --workspace research-proof-workspace --iteration post-patch-agent-sample --answers evaluation\post-patch-agent-sample\with-skill-compact-rules.json --variant with_skill_compact_rules --expected-ids 14,15 --json
node .\tools\compare-external-backtests.mjs --iteration post-patch-agent-sample --baseline clean_baseline --out evaluation\post-patch-agent-sample\comparison.md
git diff --no-index -- skills\research-proof plugins\research-proof-plugin\skills\research-proof
git diff --check
```

Negative checks also passed: comparison without `--baseline`, external answers without `--expected-ids`, and unsafe cleanup all fail closed.

## Candid Judgment

Judgment: **approved for this iteration, not certified as 10/10**.

The skill and harness are much harder to fool than before. The remaining gap is evidence scale: full-suite fresh external samples, old-skill regression, multilingual/typo-heavy prompts, and real-task transfer still need to run before a 10/10 or 12/10 claim is earned.
