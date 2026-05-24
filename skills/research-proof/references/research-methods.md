# Research Methods Reference

Load this when choosing a method, designing an automated research loop, or adapting proof pressure to a new domain.

## Fixed-Harness Research Loop

Use when there is one mutable artifact, one frozen evaluator, and a cheap repeatable run.

Structure:

```text
research brief -> candidate edits mutable artifact -> frozen evaluator scores -> keep/reset frontier
```

Require:

- Frozen evaluator and data split.
- Single primary metric plus guardrail metrics.
- Result ledger with candidate, diff summary, metric, hidden costs, and keep/reset decision.
- Reset path for losing candidates.
- Transfer test after local wins.

Reject if the candidate can modify the evaluator, extend the time budget, leak held-out answers, change dependencies, or optimize a proxy that no longer matches the claim.

## Proof Ladder

Use when the output is a mathematical, algorithmic, architecture, or scientific claim.

Move through levels explicitly:

```text
example -> counterexample search -> invariant -> lemma -> proof sketch -> executable checker -> formal proof
```

Mark the level reached. Do not label a result `PROVEN` unless the verifier is appropriate for the domain.

## Divergent Researcher Pool

Use when taste is uncertain and cheap exploration is possible.

Pattern:

- Give each researcher a different starting prior or tool bias.
- Keep the scoring function shared and frozen.
- Share findings in a ledger, not hidden rationale.
- Compare top ideas on held-out domains.

Tradeoff: diversity can compensate for weak priors, but it raises the burden on evaluation and anti-hacking inspection.

## Evaluator-Gated Program Search

Use when candidates can be represented as executable programs or structured artifacts.

Pattern:

```text
seed candidates -> generate variants -> run evaluator -> store frontier -> sample frontier for next prompt
```

Prefer interpretable programs over opaque blobs. A result is stronger when the candidate explains how the win was produced, not merely that it scored well.

## Observable Agent Loop

Use when a research agent must take multiple tool-using steps and each result changes the next move.

Structure:

```text
goal -> state -> action -> observation -> verification -> state update -> stop/continue
```

Require:

- Goal and stopping condition before the first action.
- Compact state that survives long runs without carrying irrelevant history.
- Tool interfaces with clear inputs, outputs, failure modes, and retry limits.
- Observations grounded in tests, logs, citations, metrics, diffs, or human review.
- Verification after each action before the next action is chosen.
- Budget limits for iterations, time, cost, and repeated failures.

Reject if the loop keeps acting after no new evidence appears, repeats the same failing action, hides tool failures, or cannot explain why the next action follows from the latest observation.

## Evidence Synthesis

Use when papers, official articles, documentation, or prior work determine the baseline.

Require:

- Source date and link for each important external claim.
- Separation between direct evidence, author interpretation, and your inference.
- At least one source that could weaken the favorite idea.
- Current-source check for fast-moving claims.

## Transfer Gate

Use when a research win must survive outside the sandbox.

Ask what changes between the fixture and reality:

- Scale, latency, memory, cost, API contract, hardware, UX, operations, monitoring.
- Distribution shift and adversarial inputs.
- Human review burden.
- Rollback strategy.

Sandbox wins are `SUPPORTED`, not `PROVEN`, until they survive the transfer gate.
