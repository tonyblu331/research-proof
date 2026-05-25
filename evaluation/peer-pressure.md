# Peer-Pressure Review

## Scope

This review pressure-tests the current `research-proof` skill as a research artifact. It checks whether the latest causal/design patch is measured honestly, whether the harness is fair to baseline, and whether the repo can keep the skill compact without losing critical steering.

## Commands Run

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
node .\tools\run-research-backtest.mjs --workspace research-proof-workspace --iteration full-suite-typo --clean --answers evaluation\full-suite-typo\baseline-clean.json --variant clean_baseline --expected-ids 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27 --json
node .\tools\run-research-backtest.mjs --workspace research-proof-workspace --iteration full-suite-typo --answers evaluation\full-suite-typo\with-skill-compact-rules.json --variant with_skill_compact_rules --expected-ids 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27 --json
node .\tools\compare-external-backtests.mjs --iteration full-suite-typo --baseline clean_baseline --out evaluation\full-suite-typo\comparison.md
node .\tools\rate-research-skill.mjs --out evaluation\12-10-gate-report.md
node -e "JSON.parse(require('fs').readFileSync('skills/research-proof/evals/evals.json','utf8')); JSON.parse(require('fs').readFileSync('evaluation/external-agent-sample/baseline-clean.json','utf8')); JSON.parse(require('fs').readFileSync('evaluation/external-agent-sample/with-skill-compact-rules.json','utf8')); console.log('json valid')"
git diff --no-index -- skills\research-proof plugins\research-proof-plugin\skills\research-proof
git diff --check
```

No build was run.

## Results

| Gate | Result | Peer-Pressure Note |
| --- | --- | --- |
| Runtime compactness | `SKILL.md` remains 100 lines | Good. The fix did not bloat the loaded skill body. |
| Structural validation | Pass | Validator now requires the new causal/design steering terms. |
| Plugin drift | Pass | Root skill and plugin copy match. |
| Deterministic full suite | 28/28 with-skill, 437/437 expectations | Useful smoke test, but still a fixture generated from eval metadata. |
| Deterministic no-skill fixture | 0/28 evals, 0/437 expectations | Confirms the stricter section-scoped harness no longer rewards generic output. |
| Historical external baseline sample | 0/10 evals, 5/158 expectations, 3.2% | Regraded under the stricter operational harness. |
| Historical external with-skill sample | 2/10 evals, 146/158 expectations, 92.4% | Strong partial lift, but the stricter shortcut-rejection gate correctly demotes answers that mention shortcuts without making each one fail the claim. |
| Fresh post-patch external sample | 2/2 evals, 30/30 expectations, 100.0% | Fresh with-skill answers for the previously failing causal/design cases passed after the patch. Baseline on the same two cases scored 1/30 expectations. |
| Full-suite typo external sample | 7/28 evals, 396/437 expectations, 90.6% | The first complete noisy external suite crossed the L5 gate. Full-pass count is still strict and intentionally lower than expectation lift. |
| Maturity gate | 12.0/12 | All local maturity gates now pass: structural, deterministic, external, expected-ID integrity, full-suite noisy behavior, old-vs-new regression, real-task transfer, and adversarial refresh. |
| Harness negative tests | Pass | Comparison without `--baseline`, answers without `--expected-ids`, and unsafe `--clean` all fail closed. |

## Findings

### P1: Post-Patch Independent Behavior Was Re-Sampled For The Targeted Misses

The latest patch targets two live misses: causal negative controls / review authority, and design metric / guardrails / win condition. Fresh post-patch agents were run on evals 14 and 15 with compact injected standards.

Patch status: addressed for the targeted misses.

Next pressure: repeat the full 28-case suite across multiple seeds and the mixed-language pack before treating the 12/12 gate as stable.

### P2: The Grader Is Better, And Keyword-Echo Protection Was Tightened Further

The grader now uses section-scoped checks for failure modes, forbidden shortcuts, and proof-ledger decisions. It also requires each forbidden shortcut to appear near a rejection/failure relation. Generic baseline output fell to 0/437 in the deterministic suite and 5/158 in the 10-case external sample.

Patch status: addressed for the confirmed review findings. Rejection gates must be conditional and falsifiable, and ledger decisions must begin with an allowed enum inside the `Proof Ledger Decision` section.

Next pressure: add the same operationality check to proof ladders if future peer review finds keyword echo there.

### P2: Old-Skill Regression Is Now Present

The harness now includes an old-vs-new comparison on the 10-case external sample. Old compact rules scored 39/158 expectations; current compact rules scored 146/158 expectations on the same eval IDs.

Patch status: addressed for the sampled regression lane.

Next pressure: add old-vs-new regression lanes whenever a new failure family is introduced, rather than rerunning the whole suite by default.

### P3: External Sample Is High-Value But Still One-Seed

The external evidence is meaningful because it includes clean isolated baseline, old/current comparison, post-patch resampling, and one full 28-case typo-heavy suite. It is still one seed per lane.

Patch status: accepted limitation.

Next pressure: run multi-seed external sampling across all 28 cases and track full-eval pass rate, not only expectation pass rate.

## Verdict

Current rating: **12.0 / 12** on the repo-defined maturity gate.

The skill is substantially stronger than baseline and has a safer, stricter validator/backtest loop. The candid limitation is not “no evidence” anymore; it is that noisy full-suite full-pass reliability still has room to climb beyond 7/28.

## Patch Applied From This Review

The grader now requires `Rejection Gates` to include a conditional, falsifiable failure rule such as `reject if`, `fails when`, `X fails the claim`, or an equivalent condition tied to each forbidden shortcut. It also recognizes semantic term variants, constrains clean deletion to a dedicated `*-workspace`, rejects duplicate external eval IDs, requires `--expected-ids` for external answers, requires explicit/singular baselines for comparison, compares actual and expected eval sets, and validates proof-ledger decisions inside the correct section.
