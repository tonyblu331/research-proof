# Backtest Cases

Use these cases when revising this skill or checking whether an agent applying it preserves proof discipline.

## Backtest Protocol

The goal is to test the skill, not to solve the research problem. Run each case as a prompt against the skill and score whether the skill forces the expected behavior.

For every case, return:

| Field | Required |
| --- | --- |
| Case verdict | `PASS`, `WEAK`, or `FAIL` |
| Missing pressure | Which required behavior was absent or vague |
| Failure pattern | One taxonomy value from below |
| Instruction gap | Which line or section failed to force it |
| Patch proposal | Smallest change to `SKILL.md`, a reference, a template, or a scenario |

Minimum passing behavior across the suite:

- Every case includes a falsifiable claim, verifier boundary, baseline/candidate family, enemy terms, rejection gates, proof ladder or transfer path, proof ledger decision, and next pressure.
- At least one case must expose an evaluation loophole or the backtest is too soft.
- At least one proposed refinement must be concrete enough to patch.
- Domain-specific terms must not appear outside their scenario unless explicitly mapped as analogies.

## Case 1: Training Recipe Loop

Prompt:

```text
Can an autonomous loop improve a training recipe overnight?
```

Expected behavior:

- Separates frozen harness from mutable candidate.
- Defines one primary metric, guardrails, hidden costs, and keep/reset rule.
- Prohibits modifying evaluator, data split, time budget, prompts, or dependencies.
- Requires result ledger and transfer/holdout checks after local wins.

## Case 2: Compression Representation

Prompt:

```text
Can a new compression representation beat the current baseline?
```

Expected behavior:

- Defines input family, baseline codec/representation, candidate family, and measured output quality.
- Charges metadata, decode cost, complexity, fallback path, and transfer to held-out data.
- Rejects if accounting hides costs behind generic "smaller".
- Names the shortest fixture that would make the representation lose.

## Case 3: Alignment Method Search

Prompt:

```text
Can multiple agents discover a better alignment method if we keep whatever scores best?
```

Expected behavior:

- Assigns diverse starting priors without letting agents change the score.
- Warns that evaluation quality is the bottleneck.
- Charges reward hacking, human review burden, supervision cost, and transfer to held-out domains.
- Rejects "keep whatever scores best" unless the score resists gaming.

## Case 4: Algorithm Discovery

Prompt:

```text
Can LLM-generated programs discover a better bin-packing heuristic?
```

Expected behavior:

- Uses evaluator-gated program search.
- Separates correctness, asymptotic complexity, empirical runtime, and benchmark distribution.
- Stores frontier programs with scores and complexity notes.
- Rejects candidates that exploit evaluator weaknesses.

## Case 5: Research Method Synthesis

Prompt:

```text
Can we synthesize several modern AI research workflows into one reusable method?
```

Expected behavior:

- Searches current primary sources when claims may be stale.
- Separates source facts, author interpretation, and the agent's inference.
- Produces a method matrix with tradeoffs.
- Avoids treating organization-authored narratives as neutral proof.

## Case 6: Mathematical Claim

Prompt:

```text
Can we prove this greedy algorithm is optimal for every instance in this problem class?
```

Expected behavior:

- Defines objects, assumptions, and quantifiers.
- Searches for counterexamples before proving.
- Chooses a proof method and states lemmas.
- Rejects proof status unless the proof covers all instances.

## Case 7: Scientific Hypothesis

Prompt:

```text
Does intervention X improve outcome Y in population Z?
```

Expected behavior:

- Defines controls, confounders, measurement method, and exclusion criteria.
- Separates correlation from causation.
- Requires replication or held-out validation.
- Rejects claims that lack a falsifiable measurement plan.

## Case 8: Architecture Claim

Prompt:

```text
Will this event-driven architecture reduce coupling without increasing operational risk?
```

Expected behavior:

- Defines coupling metric, baseline architecture, candidate architecture, and risk guardrails.
- Charges migration cost, observability, failure modes, latency, and team cognition.
- Requires rollback and production transfer gates.
- Rejects claims based only on architectural taste.

## Case 9: Evaluation Benchmark

Prompt:

```text
Can this benchmark prove our model is better?
```

Expected behavior:

- Separates benchmark validity from model performance.
- Checks contamination, saturation, grading objectivity, and distribution fit.
- Requires held-out or adversarial evaluation.
- Rejects the word "prove" unless the benchmark scope supports it.

## Case 10: Product Experiment

Prompt:

```text
Will this onboarding change increase activation?
```

Expected behavior:

- Defines activation metric, baseline, candidate change, sample, and guardrails.
- Charges novelty effects, segment shift, support burden, and long-term retention.
- Requires A/B or quasi-experimental design.
- Rejects shipping based only on short-term lift.

## Case 11: Tool-Using Research Agent

Prompt:

```text
Can an agent keep researching this topic until it finds a strong answer?
```

Expected behavior:

- Defines done, budget, retry limits, and stop conditions before acting.
- Keeps compact state across loop iterations.
- Requires every action to produce an observable result.
- Rejects continuing when observations stop changing the proof ledger.

## Failure Pattern Taxonomy

Use these names when reporting backtest failures:

- `missing-verifier-boundary`: The output never froze what can and cannot change.
- `soft-claim`: The claim cannot be rejected by a concrete test.
- `hidden-cost-leak`: Costs, metadata, runtime, supervision, or human review were not charged.
- `evaluator-hacking`: The candidate can influence the scoring process.
- `no-transfer-gate`: A fixture win is treated as a general win.
- `status-inflation`: `PROVEN` or `SUPPORTED` is stronger than the evidence allows.
- `generic-pressure`: The output uses broad research words but no domain-specific enemy terms.
- `domain-overfit`: Domain language leaks into unrelated cases without mapping.
- `proof-gap`: Examples or intuition are treated as proof.
- `source-confusion`: Source fact, author interpretation, and agent inference are mixed.
- `loop-drift`: The agent continues acting without new evidence, stop condition, or state update.

## Refinement Patch Contract

Every backtest should end with one concrete patch proposal:

```text
Patch target:
Problem:
Change:
Why this prevents the failure:
Validation case:
```

Prefer one surgical patch over a broad rewrite. If several cases fail for the same reason, patch the shared instruction.
