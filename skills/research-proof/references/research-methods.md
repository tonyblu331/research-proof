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

## Cross-Domain Transfer Search

Use when innovation may require importing machinery from an isolated or distant field, especially in mathematics, algorithms, science, or research strategy.

Pattern:

```text
target obstruction -> source field with matching invariant -> bridge map -> translated construction -> verifier -> new counterexample or proof pressure
```

Require:

- Target problem stated in objects, operations, invariants, and failure examples.
- At least three candidate source fields with different structural affordances, not just nearby literature.
- A bridge table mapping source objects, invariants, operations, and theorems to target objects.
- A preservation check: what must commute, remain invariant, or survive approximation for the transfer to be valid.
- A smallest transferred construction or counterexample that can be independently checked.
- A ledger entry for failed analogies; failed bridges are useful evidence.

Reject if the output only says "use topology/category theory/number theory" without a bridge, if the imported theorem's assumptions do not hold in the target domain, or if the transfer cannot create a new verifier, construction, counterexample, or search direction.

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
- For systematic or literature-heavy work, record the search strategy, databases or source families, inclusion/exclusion criteria, deduplication rule, screening decision, and synthesis method.
- For citation-backed claims, verify identifiers or metadata when possible and check that the cited source actually supports the sentence, not merely the topic.
- Separation between direct evidence, author interpretation, and your inference.
- At least one source that could weaken the favorite idea.
- For quantitative claims, check whether the design, statistical test, assumptions, missing-data handling, effect sizes, confidence intervals, and practical significance support the conclusion.
- Current-source check for fast-moving claims.

## Mechanistic Audit

Use when behavior may look correct while the mechanism is untrusted, especially for AI systems, agents, reasoning traces, or safety claims.

Require:

- Behavior evidence, internal/mechanistic evidence, and intervention evidence separated.
- A hypothesis for the mechanism that produced the output.
- Probes or audits that could distinguish genuine reasoning from sycophancy, shortcut use, memorization, or post-hoc rationalization.
- A failure gallery where the mechanism should break.

Reject if fluent explanations are treated as proof of the actual mechanism or if the audit cannot catch hidden goals, sabotage, or evaluator gaming.

## Artifact / Perceptual Systems Review

Use when the claim is about graphics, simulation, interaction, perception, generated media, robotics visuals, or a technical artifact whose quality must be inspected.

Require:

- Artifact boundary: algorithm, implementation, assets, scenes, data, hardware, latency, and user interaction scope.
- Quantitative metrics plus visual/perceptual evidence and failure cases.
- Ablations that isolate each contribution.
- Stress scenes, edge cases, and in-the-wild or interactive tests when relevant.
- Reproducible outputs, code or enough implementation detail, and comparison to strong baselines.

Reject if the output relies on cherry-picked demos, ignores artifacts/flicker/latency, lacks ablations, or cannot be reproduced.

## Tool-Grounded Scientific Workflow

Use when models connect to scientific tools, databases, literature, code, lab protocols, or experimental planning.

Require:

- Tool/source inventory with trust level, freshness, permissions, and failure modes.
- Separation of model reasoning from tool retrieval and downstream analysis.
- Domain-expert review boundary and governance for high-stakes or dual-use domains.
- Follow-up experiment, external validation, or independent replication before readiness claims.

Reject if live search/tool output is treated as verified fact, if database predictions are treated as wet-lab proof, or if governance is missing for sensitive science.

## Clinical-AI Reporting Review

Use when a clinical prediction model, medical AI system, diagnostic model, or randomized trial is being used as evidence.

Require:

- Intended use, population, setting, inputs, outputs, comparator, clinical action, and harm boundary.
- Reporting completeness: data provenance, missingness, model specification, calibration, external validation, code/protocol access, trial registration when applicable, participant flow, harms, and disclosures.
- Separation between discrimination/performance, calibration, clinical utility, implementation burden, and recommendation strength.

Reject if one dataset, one AUROC, or one trial report is treated as clinical readiness without external validation and transparent reporting.

## Protocol-Frozen Evidence Review

Use when the claim resembles a clinical, scientific, policy, or intervention question where causality and certainty matter.

Pattern:

```text
question -> protocol freeze -> evidence collection -> bias/confounder review -> certainty rating -> recommendation boundary
```

Require:

- A precise population, intervention or exposure, comparator, outcome, time window, and measurement method.
- Frozen eligibility criteria, outcome definitions, analysis plan, stopping rules, and adverse-effect handling before results are inspected.
- Controls or a causal identification strategy; correlation alone cannot establish an intervention effect.
- Explicit certainty downgrades for risk of bias, inconsistency, indirectness, imprecision, publication bias, confounding, missing data, and measurement weakness.
- Replication, held-out population validation, or a transfer gate before broad claims.

Reject if the output upgrades confidence from narrative plausibility, ignores harms, changes outcomes after seeing data, treats recommendation strength as evidence certainty, or skips confounders and controls.

## Causal Identification Review

Use when a claim says that X caused Y, especially from observational, historical, product, policy, or quasi-experimental data.

Require:

- Population, treatment/exposure, comparator, outcome, time window, estimand, and decision threshold.
- Identification strategy before estimation: randomized assignment, natural experiment, instrument, difference-in-differences, regression discontinuity, matching/weighting, negative controls, or a stated reason no causal claim is supported.
- A confounder map and a record of unmeasured confounders that could reverse the conclusion.
- Sensitivity analysis, placebo or negative-control tests, replication or transfer to a new setting, and the reviewer or review authority that can accept the causal assumptions.

Reject if the output treats prediction as causation, relies on one uncontrolled association, changes the estimand after seeing results, or recommends action without naming the causal assumptions.

## Causal Attribution Review

Use when a hard debugging case, production regression, benchmark anomaly, leakage concern, graphics artifact, numerical residual, or multi-agent synthesis miss has many plausible contributors and the work can drift into narrative branching.

Pattern:

```text
bounded lateral aperture -> evidence contract -> pre-D1 candidate map -> ranking basis -> canonical evidence rows -> attribution cube -> observed-evidence causal ranking -> minimal discriminator -> residual guard -> synthesis
```

Require:

- A bounded lateral aperture: weird or cross-domain hypotheses are welcome, but each branch must state a mechanism, expected signature, kill condition, and the row dimensions needed to test it.
- Canonical evidence rows before broad prose. Name the row grain, dimensions, derived measures, and missing fields.
- An attribution cube that can rank contributors by observed pressure, not by plausibility alone.
- A **Pre-D1 Candidate Map** instead of a naked suspicion ranking. Each ordered list must name its **Ranking Basis**: `information_gain_priority`, `symptom_fit_prior`, `operational_check_order`, or `observed_evidence_ranking`.
- A strict distinction between **pre-D1 ordering** and **causal ranking**. Only `observed_evidence_ranking` may be called causal; all other bases are triage only.
- If the basis is `observed_evidence_ranking`, cite resolvable **EvidenceRefs**: canonical row ids, attribution-cube cells/results, D1 output, or negative-control/ablation evidence. If an EvidenceRef cannot be resolved to provided artifacts or rows, downgrade the basis.
- Artifact rows with `d1_status=not_run` may support suspicion or operational priority, not causal `observed_evidence_ranking`.
- A minimal discriminator `D1` that separates the top hypotheses with the cheapest decisive observation, ablation, counterfactual, or negative control.
- `DOMINANT_UNKNOWN_PENDING_D1` when the first discriminator is required before naming a dominant contributor.
- A residual guard that preserves secondary contributors after the dominant bucket is isolated.
- A promotion gate before runtime/design changes: dominant win, residual guard, negative controls, and no unresolved evidence-contract violation.

Reject if the output names a dominant cause from a clean-looking table that contains only priors, uses a numbered pre-D1 list without a Ranking Basis, treats `symptom_fit_prior` or `operational_check_order` as causality, launders `observed_evidence_ranking` with fake/unresolved EvidenceRefs, averages subagent opinions as evidence, hides uncertainty behind confident prose, erases residual risks, or turns lateral ideas into untestable narratives.

### Runtime proof-report contract

Use this sub-check when a report claims a runtime feature, renderer path, benchmark fix, or harness status is implemented/closed.

- Derive every headline status from raw evidence fields; if the object says unavailable, disabled, zero bytes, null texture, OPEN, or not-run, the headline must downgrade.
- Name rows by the active algorithm, not the roadmap. Use labels like `scalar-validity-weighted` or `visibility-scaffold-disabled` until the feature gate proves real moment-backed data.
- Feature gates must check existence, mode, non-null resources, positive byte/sample counts, and a behavioral difference from the fallback path.
- A subsystem/probe metric cannot close a final-image claim unless matching render targets isolate direct, scene-linear indirect, albedo, tone mapping, and receiver masks.
- Evidence readers are part of the proof. Test absent, disabled, enabled, and malformed returns; never let a reader recurse into its wrapper.
- Optimization claims must describe the local loop/readback/pass shape, not a different branch or reference implementation.
- External references must state `proves` and `does not prove`; inspiration is not evidence that the local feature exists.
- Reports must state whether build, tests, screenshots, GPU timing, and readbacks actually ran.

## Design-Science Review

Use when the research object is an artifact, interface, method, workflow, or engineered intervention.

Require:

- User or stakeholder need, context of use, artifact hypothesis, success metric, guardrails, and win condition.
- Baseline workflow and strongest competing artifact.
- Prototype or intervention boundary: what is being tested, what is simulated, and what remains unbuilt.
- User evidence separated from designer interpretation.
- Iteration log that records what changed because of evidence, not taste.

Reject if the output starts from the favored solution, uses internal preference as user evidence, measures only usability theater, or ignores the context where the artifact must work.

## Readiness / Transfer Ladder

Use when a prototype, paper result, demo, or lab fixture is being treated as innovation evidence.

Move explicitly through:

```text
principle -> lab proof -> relevant environment -> integrated system -> operational context -> maintainable deployment
```

Require interface assumptions, dependency readiness, integration risk, operational burden, safety margins, monitoring, rollback, and maintenance evidence.

Reject if a demo is treated as deployment proof, if subsystem wins ignore system interactions, or if the claim skips relevant-environment testing.

## Progressive-Program Review

Use when the user asks whether a research agenda, roadmap, thesis, or field direction is promising.

Separate:

- **Hard core**: the central commitments the program refuses to abandon.
- **Protective belt**: auxiliary hypotheses, methods, datasets, and evaluation choices that may change.
- **Progressive signal**: novel predictions, stronger explanations, better transfer, or new verified capabilities.
- **Degenerating signal**: excuses, post-hoc metric changes, narrower claims after each failure, or novelty without cumulative evidence.

Reject if every failure is absorbed by moving the goalposts or if the roadmap cannot name what would make it pivot.

## Transfer Gate

Use when a research win must survive outside the sandbox.

Ask what changes between the fixture and reality:

- Scale, latency, memory, cost, API contract, hardware, UX, operations, monitoring.
- Distribution shift and adversarial inputs.
- Human review burden.
- Rollback strategy.

Sandbox wins are `SUPPORTED`, not `PROVEN`, until they survive the transfer gate.
