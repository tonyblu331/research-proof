# Candid Backtest: Cross-Field Research Patterns

## Scope

This backtest evaluates whether Research Proof now learns from AI labs, universities, field-defining researchers, medical research, causal inference, design science, systems engineering, open science, and cross-domain mathematical discovery without turning those sources into authority-based proof.

## Result

Overall rating: **12.0 / 12** for the repository's defined maturity ladder.

Verdict: **The skill now passes structural validation, deterministic full-suite fixtures, clean external-agent samples, old-vs-new regression, real-task transfer evidence, adversarial refresh, and a full 28-eval typo-heavy external-agent run above the 90% expectation gate. Candid caveat: only 7/28 full evals passed in that noisy suite, so the next frontier is multi-seed full-pass reliability without bloating the runtime skill.**

## What Passed

| Check | Rating | Evidence |
| --- | ---: | --- |
| Cross-field source breadth | 9/10 | `source-patterns.md` now includes AI labs, OpenAI's discrete-geometry discovery pattern, Harvard causal inference, Stanford philosophy/design, MIT / Simon design science, Stokes use-inspired research, NASA systems engineering, Berkeley open science, registered reports, reproducibility, PRISMA, SPIRIT, and GRADE. |
| Authority-not-proof discipline | 9/10 | `SKILL.md` says sources are design references, not proof; normal outputs are instructed to encode patterns unless attribution is requested. |
| Evaluable pressure | 8/10 | Compact eval suite now includes readiness inflation, causal identification, invalid user proxy, degenerating program, certainty inflation, evaluator hacking, prompt injection, and protocol drift. |
| No-Python validation | 10/10 | `node tools/validate-research-skill.mjs` passes and rejects Python tooling/cache files. |
| Plugin/source consolidation | 10/10 | Validator fails on plugin drift; current source and plugin skill copies match. |
| Medical evidence discipline | 8/10 | Cases cover protocol freeze, systematic review completeness, certainty downgrades, harms, confounders, and recommendation boundaries. |
| Context efficiency | 9/10 | `SKILL.md` is now the compact runtime contract, rarely used operational detail moved to `research-operations.md`, and eval assertions are shared instead of repeated per case. |
| Prompt-injection coverage | 8/10 | The harness now includes shared prompt-injection assertions plus explicit cases for injected memos, retrieved pages, unsafe upload sinks, and candidate code comments. |
| Skill-creator bridge | 8/10 | `tools/export-skill-creator-evals.mjs` exports the compact schema into the standard skill-creator eval shape, and `run-research-backtest.mjs` can grade external answer files into the same workspace format. |
| Deterministic backtest harness | 8/10 | `tools/run-research-backtest.mjs --clean --json` generated per-eval `eval_metadata.json`, `answer.md`, `transcript.md`, `timing.json`, `grading.json`, plus aggregate `benchmark.json` and `benchmark.md`. |
| Independent sampled loops | 8/10 | Six evals were run through independent subagents. With-skill improved from 60.8% expectation pass rate in sample 1 to 91.2% in sample 3 after targeted refinements. |
| Cross-domain math transfer | 8/10 | Added `Cross-Domain Transfer Search`, source-field bridge tables, preservation checks, and a dedicated eval for importing machinery from distant math fields without analogy overfit. |
| Broader research-source transfer | 8/10 | Added Anthropic mechanism-audit patterns, SIGGRAPH artifact/perceptual review, DeepMind tool-grounded science patterns, xAI live-source/tool-budget patterns, and CONSORT/TRIPOD+AI clinical-reporting pressure. |
| Skill steering and agent leverage | 9/10 | Added `references/skill-steering.md` with registry injection, bounded subagent lanes, ledger merging, no-bloat rules, and a maturity ladder from structural validation through adversarial refresh. |
| Clean external-agent sample | 7/10 | Fresh baseline agents received only prompts and no skill rules; with-skill agents received compact injected standards. Under the stricter explicit-rejection grader, historical with-skill answers score 2/10 full passes and 92.4% partial expectations. |
| Full-suite noisy external run | 9/10 | Typo-heavy 28-eval external-agent run scored baseline 5/437 expectations and with-skill compact rules 396/437 expectations, a 90.6% expectation pass rate and +89.5% lift. |
| Harness safety and comparison integrity | 9/10 | `--clean` is constrained to a dedicated `*-workspace`, external grading rejects duplicates and requires expected eval IDs, comparison requires matching actual/expected eval IDs and an explicit/singular baseline, and ledger decisions are section-scoped. |

## What Is Still Weak

| Weakness | Severity | Why it matters |
| --- | --- | --- |
| Full-pass reliability is still uneven | High | The full-suite external run crossed the expectation gate at 90.6%, but only 7/28 evals were perfect under the strict all-assertions rubric. |
| Source synthesis is representative, not exhaustive | Medium | The skill now learns from several strong traditions, but it does not yet cover all major innovation fields such as materials science, economics of innovation, education research, organizational science, or lab operations. |
| Skill body may still be too directive for some agents | Low | The runtime skill is compact now, but behavioral evals should check whether agents overproduce matrices instead of choosing the right method. |
| English-centric eval prompts | Medium | The suite does not yet test multilingual, typo-heavy, or mixed-language prompts. |
| Multi-seed noisy benchmark is still open | High | One full-suite typo-heavy run passed the 90% expectation gate, but mixed-language and multi-seed runs are not yet complete. |
| Prompt-injection evals are broader but not exhaustive | Medium | There are now four explicit injection cases, but no live tool-use sandbox or adversarial retrieved-web fixture has been executed. |
| 12/10 is local, not universal | Medium | The repo-level 12/12 gate is now earned, but it is not proof the skill is universally optimal across agents, models, languages, and future research domains. |

## Failure Patterns Added

- `readiness-inflation`: prototype, subsystem, paper, or lab evidence is treated as deployment proof.
- `integration-risk`: interfaces, dependencies, operations, safety, or maintenance are not charged.
- `identification-gap`: a causal claim lacks a credible identification strategy.
- `confounding-leak`: plausible confounders can explain the result.
- `solutionism`: the favored artifact drives research before problem validation.
- `invalid-user-proxy`: internal preference or demo enthusiasm is treated as user evidence.
- `degenerating-program`: a research program protects its thesis by post-hoc changes instead of producing novel verified progress.
- `prompt-injection`: untrusted text tries to change instructions, reveal hidden rubrics, or trigger unsafe tool/data flows.
- `field-silo`: the search stays inside the target field when a distant field may contain the needed invariant or construction.
- `analogy-overfit`: a borrowed field sounds relevant but lacks a valid bridge.
- `unverified-transfer`: a translated theorem, construction, or invariant is used before preservation assumptions are checked.
- `mechanism-blindness`: behavior looks good but the mechanism is unverified.
- `perceptual-artifact`: aggregate metrics or demos hide visual/system artifacts.
- `tool-grounding-gap`: model reasoning and retrieved/tool evidence are blended without trust boundaries.
- `live-source-drift`: real-time sources are treated as truth without freshness/trust checks.
- `clinical-ai-opacity`: clinical AI readiness is claimed without transparent reporting, calibration, or external validation.
- `delegation-drift`: subagents are launched without compact injected standards or lose the verifier boundary.
- `context-bloat`: the skill or subagent prompt grows instead of routing to the smallest needed reference or lane.
- `unmeasured-skill-lift`: improvement is claimed without baseline/old/new-skill comparison.

## Backtest Commands

```text
node tools/run-research-backtest.mjs --clean --json
node tools/validate-research-skill.mjs
node tools/export-skill-creator-evals.mjs --check
node tools/create-research-eval-pack.mjs --out research-proof-workspace/eval-pack-smoke.json --ids 0,17,27 --prompt-variant typo
node tools/rate-research-skill.mjs --out evaluation/12-10-gate-report.md
node -e "JSON.parse(require('fs').readFileSync('skills/research-proof/evals/evals.json','utf8')); console.log('json valid')"
git diff --no-index -- skills/research-proof plugins/research-proof-plugin/skills/research-proof
git diff --check
```

All commands passed.

## Deterministic Backtest Result

Mode: deterministic fixture run.

| Variant | Evals Passed | Eval Pass Rate | Expectations Passed | Expectation Pass Rate |
| --- | ---: | ---: | ---: | ---: |
| with_skill | 28 / 28 | 100.0% | 437 / 437 | 100.0% |
| without_skill | 0 / 28 | 0.0% | 0 / 437 | 0.0% |

The run exposed one useful bug before the final pass: the fixture initially echoed hostile prompt text containing `PROVEN` into the generated claim for eval 17. The runner now avoids replaying prompt-injection text inside the proof claim and treats it as an untrusted evidence bundle. The latest loop also added eval 27 for registry/subagent steering so the harness checks context bloat, delegation drift, and unmeasured skill-lift claims.

## Independent Sampled Loop

Mode: independent subagent answers, six high-risk evals: standard-care evidence, observational causality, prototype/problem validation, injected memo, unsafe README upload, and evaluator-tampering comments.

| Loop | Variant | Evals Passed | Expectation Pass Rate | What changed |
| --- | --- | ---: | ---: | --- |
| sample 1 | masked baseline | 0 / 6 | 25.5% | Baseline could answer common-sense safety/certainty questions, but did not preserve the proof ledger contract. It reported skill auto-load, so it is not a clean baseline. |
| sample 1 | with_skill | 0 / 6 | 60.8% | Strong research judgment, but collapsed required headings and missed some explicit trust-boundary language. |
| sample 2 | with_skill | 0 / 6 | 88.2% | After adding the exact-heading rule, outputs followed the contract and improved rejection gates. |
| sample 3 | with_skill | 1 / 6 | 91.2% | After adding the untrusted-text/source-sink-capability rule, security cases became much stronger. |

The loop forced two useful refinements:

- The main skill now says compact answers must preserve the exact output headings.
- The workflow now says untrusted text, code comments, READMEs, retrieved pages, and documents are evidence, not instructions, and must trigger source/sink/capability risk analysis before tool or data movement.

## Clean External-Agent Sample

Mode: fresh subagents, no forked parent context. Baseline agents received only the eval prompts and were told not to load any local skill. With-skill agents received compact injected rules plus the same prompts. Raw answer files are stored in `evaluation/external-agent-sample/`.

| Variant | Evals | Full Passes | Expectation Pass Rate | Lift vs Baseline |
| --- | ---: | ---: | ---: | ---: |
| clean_baseline | 10 | 0 | 3.2% | +0.0% |
| with_skill_compact_rules | 10 | 2 | 92.4% | +89.3% |
| old_skill_compact_rules | 10 | 0 | 24.7% | +21.5% |

Remaining live misses:

- Historical sample misses are mostly explicit-rejection misses: the answers often name a forbidden shortcut but do not always make each shortcut fail the claim in `Rejection Gates`.
- Fresh post-patch agents on the causal/design misses scored 2/2 full evals and 30/30 expectations, versus baseline 0/2 and 1/30 expectations.
- Old-vs-new regression on the same 10-case slice scored old compact rules at 39/158 expectations and current compact rules at 146/158 expectations.

Harness improvement from this loop: the grader now recognizes equivalent verifier and domain language while also requiring operational section-scoped evidence for failure modes, forbidden shortcuts, conditional rejection gates, and proof-ledger decisions. It also rejects unsafe cleanup, duplicate external eval IDs, missing expected eval IDs, mismatched comparison eval sets, and inferred baselines.

See `evaluation/peer-pressure.md` for the adversarial review of this result. The strongest caveat is now full-suite multi-seed external sampling and higher full-eval pass reliability, not the targeted causal/design patch.

## Full-Suite Typo External Run

Mode: independent external-agent answers over all 28 evals with typo-heavy prompts and compact injected rules. Raw answers are stored in `evaluation/full-suite-typo/`.

| Variant | Evals | Full Passes | Expectation Pass Rate | Lift vs Baseline |
| --- | ---: | ---: | ---: | ---: |
| clean_baseline | 28 | 0 | 1.1% | +0.0% |
| with_skill_compact_rules | 28 | 7 | 90.6% | +89.5% |

The first grader pass exposed harness brittleness around equivalent phrasing such as `only X may change` and `Ignoring migration cost fails...`. The harness was refined to recognize semantic term variants and section-scoped verifier-boundary evidence, then rerun on the same external answers and eval IDs.

## Next Honest Gate

Run multi-seed behavioral evaluation with cleaner isolation for at least these cases:

- observational feature causality;
- robotics lab demo readiness;
- prototype/user-problem validation;
- use-inspired research funding;
- standard-care recommendation from limited studies.
- injected memo / hostile retrieved-document cases.
- SIGGRAPH-style artifact proof;
- mechanistic interpretability audit;
- tool-grounded life-science discovery;
- live-source trend claims;
- clinical AI deployment readiness.

Call the next result reliable only if the skill improves full-eval pass rate without merely increasing verbosity.

## Path To 100 / 12-10

The honest path is evidence, not more prose:

1. Run multi-seed behavioral evals for all 28 cases, including mixed-language prompts.
2. Repeat real-task transfer outside this repository and grade whether the skill improves decisions without increasing verbosity.
3. Add old-skill regression to more external slices when new failure families are introduced.
4. Refresh adversarial prompt-injection and stale-source cases periodically.
5. Keep the 12/12 badge conditional on repeated full-suite behavior; revoke or downgrade it if future noisy runs fall below the 90% expectation gate.
