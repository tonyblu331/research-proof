---
name: research-proof
description: Turn vague research ideas, math-heavy claims, algorithmic bets, optimization loops, evaluation plans, and autonomous research workflows into falsifiable proof programs. Use when the user asks to prove, disprove, pressure-test, peer review, backtest or refine this skill, design a sandboxed research loop, choose evaluators, create research TDD scenarios, avoid hand-wavy iteration, or decide where a research roadmap should go next.
license: MIT
compatibility: Agent Skills open standard; works with Claude Code plugins, skills.sh, Codex, and other SKILL.md-compatible agents.
metadata:
  author: Tony Blanco
  categories: research,evaluation,verification,agent-workflows
  tags: research-agent,ai-research,evals,benchmarking,proof-ledger,falsification,scientific-method,autonomous-agents
---

# Research Proof

## Purpose

Force research work to behave like a proof program: define the object, state the claim, freeze the verifier, search for counterexamples, and update the ledger when evidence changes.

Use this before implementation when possible. If code or experiments already exist, backfill the claim, verifier boundary, proof ladder, and ledger from actual evidence before adding more work.

## Core Discipline

Do not start from a favorite mechanism. Start from a falsifiable proposition.

Bad:

```text
Can this approach work?
```

Good:

```text
For domain D and baseline B, candidate family C wins only if metric M improves by delta, guardrails G stay within budget, hidden costs H are charged, and the result survives transfer test T.
```

Every output must label evidence as one of:

- `PROVEN`: follows from a proof, verified derivation, executable checker, or primary-source fact with explicit scope. Do not mark a research claim `PROVEN` from authority, plausibility, benchmark score, or secondary interpretation alone.
- `SUPPORTED`: current evidence points this way, but scope is limited.
- `REJECTED`: failed an explicit gate.
- `OPEN`: not tested or not formalized enough.

Before implementation, require `Claim`, `Verifier Boundary`, `Baseline / Candidate Family`, `Enemy Terms`, and `Rejection Gates`. If any are missing, produce those first and stop implementation planning.

## Method Selection

Choose the method by verifier strength. If the verifier is weak, do not pretend the loop is autonomous.

| Situation | Method | Use when | Main failure mode |
| --- | --- | --- | --- |
| One mutable artifact, one frozen metric | Fixed-harness research loop | A candidate can be changed mechanically and scored cheaply | Metric hacking or local overfit |
| Mathematical or algorithmic claim | Proof ladder | A claim can move from examples to lemmas to proof | Plausible prose mistaken for proof |
| Many cheap ideas, uncertain prior | Divergent researcher pool | Independent starts can explore different hypotheses | Collapse to same idea or reward hacking |
| Program-search discovery | Evaluator-gated evolution | Candidate programs can be executed and scored | Evaluator accepts clever invalid shortcuts |
| Tool-using research agent | Observable agent loop | Each step can inspect reality before choosing the next action | Infinite loop, stale state, or unverifiable progress |
| Literature-heavy research | Evidence synthesis | External sources determine priors or baselines | Cherry-picked or stale claims |
| Shipping research | Transfer gate | A fixture win must survive real constraints | Benchmark win fails outside the sandbox |

For method details, read `references/research-methods.md`. For mathematical proof patterns, read `references/proof-methods.md`.

## Workflow

1. **Claim**
   State the proposition with variables, domain, baseline, candidate family, metric, guardrails, hidden costs, and win condition.

2. **Verifier Boundary**
   Name what is frozen, what is mutable, what the candidate cannot inspect, who reviews outputs, and what counts as tampering.

3. **Baseline / Candidate Family**
   Define the current best alternative and the exact space of candidates allowed.

4. **Enemy Terms**
   Charge every term that can erase the win: data leakage, evaluator hacking, extra supervision, human review burden, runtime, memory, complexity, operational cost, distribution shift, numerical instability, dependency changes, or cherry-picked evidence.

5. **Proof Ladder**
   Move from examples to counterexamples, invariants, lemmas, derivation, executable check, formal proof, and transfer. Mark the highest level reached.

6. **Candidate Construction**
   Specify the strongest construction or fixture family. Include what would count as a counterexample to the current thesis.

7. **Verification Plan**
   Define commands, metrics, guardrails, PASS/REJECT gates, artifacts, and audit logs before implementation. If tests cannot run, say exactly what evidence is missing.

8. **Proof Ledger**
   Record what changed in understanding, what got rejected, what remains open, and whether to `CONTINUE`, `REFINE`, `PIVOT`, or `REJECT`.

9. **Next Pressure**
   Choose the next adversarial test. Avoid "make it better" as a next step; name the failure mode.

## Observable Agent Loop

For agentic research, require the loop to be inspectable:

```text
goal -> compact state -> next action -> observation -> verifier -> ledger update -> stop or continue
```

Rules:

- Define `done` before the loop starts.
- Keep state compact: claim, current best candidate, verifier status, open failure modes, budget.
- Give every action a typed input, expected output, failure mode, and retry limit.
- Observe reality after each action: test output, source result, metric, log, diff, or human review.
- Verify before continuing; do not let action count substitute for progress.
- Stop on pass, explicit rejection, budget exhaustion, repeated failure, or verifier tampering.

## Output Contract

For normal research reviews, return:

```text
Claim
Verifier Boundary
Baseline / Candidate Family
Current Evidence
Enemy Terms
Rejection Gates
Proof Ladder / Transfer Path
Verdict
Proof Ledger Decision
Next Pressure
```

For substantial research work, create or update artifacts using the templates in `references/`:

- `research-claim-template.md`
- `proof-ledger-template.md`

For behavioral backtests of this skill, read `references/behavioral-run-protocol.md` before running outputs, grading, aggregation, or review.

## Research TDD Sandbox

When designing or refining research workflows, use a sandbox with frozen tests before experiments.

Minimum sandbox:

```text
scenario -> candidate action -> frozen evaluator -> score + guardrails -> ledger decision -> patch or reject
```

Rules:

- Store scenario prompts, expected pressure, forbidden shortcuts, and failure modes.
- Freeze evaluator code and data before candidate generation.
- Keep candidate work in a disposable workspace.
- Log every candidate, score, guardrail result, and keep/reset decision.
- Fail the sandbox if a scenario lacks a rejection gate or transfer path.
- Fail the sandbox if domain-specific terms leak into unrelated scenarios.

Run the deterministic smoke test when available:

```text
python scripts/backtest_research_skill.py
```

## Backtest This Skill

When the user asks to backtest or refine this skill, evaluate the skill itself. Do not solve the research cases as the main task.

Use `references/backtest-cases.md` and `references/sandbox-scenarios.json` as the test suite. For each case:

1. Apply the skill as written to the prompt.
2. Score whether the output forced each required behavior: `PASS`, `WEAK`, or `FAIL`.
3. Name the failure pattern.
4. Name the exact instruction that should have forced the missing behavior.
5. Propose the smallest skill patch that would prevent the miss.

Return:

```text
Backtest Matrix
Failure Patterns
Refinement Patch
Validation Plan
```

Reject the backtest as incomplete if it only says the skill is good, generic, or promising without naming failure patterns. The purpose is to improve the skill, not admire it.

## Peer Review Rules

- Attack the strongest version of the idea, not the first implementation.
- Treat baselines as falsification targets, not rhetorical enemies.
- Prefer held-out and production-style evidence over fit to the training fixture.
- Freeze the evaluator before letting an agent or optimization loop modify candidates.
- Reject candidates that win by changing tests, changing data, hiding costs, or widening budgets.
- Ask what would make the favorite idea false. If the answer is vague, the claim is not ready.
- Distinguish claim status from artifact quality: a strong plan can still leave the research claim `OPEN`.
- Separate construction evidence from transfer evidence; sandbox wins do not automatically generalize.
- Mark company, author, or project narratives as source claims, not proof.
- If evidence changes the goal, revise the goal instead of forcing the old thesis.
- Do not add implementation tasks until the next falsification gate is named.

## Mental Models To Encode

Do not name specific labs or projects in final artifacts unless the user asks for source attribution. Encode the patterns:

- **Fixed harness**: human writes the research program; agents edit only the candidate; a frozen evaluator scores every run.
- **Observable loop**: plan, act, observe, verify, update state, and stop by evidence rather than momentum.
- **Evaluator-gated discovery**: creative generation is useful only when a checker filters invalid outputs.
- **Proof ladder**: examples are not proof; climb through counterexamples, invariants, lemmas, and verifiers.
- **Divergent exploration**: multiple independent starts can increase coverage only if scoring resists reward hacking.
- **Evidence synthesis**: separate source facts, author interpretation, and your inference.
- **Transfer discipline**: a sandbox result becomes strong only after held-out or production-style transfer.

## SDD Integration

For a substantial research change, add these artifacts under the active change:

```text
openspec/changes/<change>/research-claim.md
openspec/changes/<change>/proof-ledger.md
```

If the codebase already has `tasks.md`, add a task for the next pressure test only after the claim and rejection gate are explicit.

When updating SDD artifacts, keep this order:

```text
research-claim -> proof-ledger -> design/tasks -> implementation
```

If implementation has already happened, backfill the claim and ledger from actual evidence before adding more code.
