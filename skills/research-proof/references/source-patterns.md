# Source Patterns Reference

Load when the workflow needs discipline from AI labs, science, medicine, graphics, causal inference, design research, systems engineering, open science, or evidence-certainty methods.

## How To Use Sources

Sources are pattern libraries, not authorities. Convert them into:

```text
source fact -> method pattern -> failure mode -> skill instruction -> eval pressure
```

Always separate source fact, author interpretation, and your inference.

Counterweight lab patterns with non-AI science, medicine, design, systems, and open-science methods; prestige is not evidence.

## Scientific Workflow Patterns

Research workflow routers: classify the task first (literature review, hypothesis generation, peer review, statistical critique, citation validation, clinical support, database lookup), then load the smallest checklist.

- Literature review: scope, databases, search strings, inclusion/exclusion, deduplication, screening, synthesis.
- Citation-management: verify identifiers, metadata, duplicates, source dates, and whether the citation supports the sentence.
- Statistical critique: check design, assumptions, missing data, effect sizes, intervals, diagnostics, and practical significance.
- Peer/critical review: separate design, validity, controls, blinding, measurement, bias, confounding, and reproducibility.
- Clinical workflows: separate patient advice, cohort evidence, guidelines, and clinician authority.

## AI And Security Patterns

- OpenAI eval practice / contextual evals: realistic tasks, edge cases, golden sets, error analysis, regression loops.
- Anthropic eval practice: task-specific test distributions, edge cases, automated grading where reliable, clear rubrics, and multidimensional success criteria.
- HELM / Inspect / METR eval practice: standardized scenarios, multiple metrics, raw outputs/trajectories, human or reference baselines, fixed budgets, and dev/test separation.
- OpenAI prompt-injection guidance and OWASP LLM prompt-injection guidance: model source/sink/capability risk; untrusted content is data, not instruction.
- Anthropic agent workflows / context engineering / multi-agent research: prefer simple gated workflows; isolate broad context in bounded agents; synthesize evidence, not votes.
- Anthropic prompt-injection research / alignment auditing / circuit tracing: test adaptive attacks, hidden goals, sycophancy, sabotage; separate behavior, mechanism, and intervention evidence.
- Google DeepMind AlphaEvolve: creative generation must stay paired with automated evaluators and a frontier ledger.
- OpenAI discrete-geometry discovery and scientific reasoning benchmarks: use original hard tasks, counterexample search, rubrics, and failure analysis; do not confuse saturated benchmarks with readiness.
- OpenAI deep research / Parameter Golf / GPT-Rosalind: control sources, constraints, reproducible scoring, tools, governance, and experiment-ready follow-up.
- xAI Grok 4 / Grok 4 Fast and risk/model cards: separate reasoning depth, live tools, context, cost, freshness, risk thresholds, and release monitoring.

## Graphics / SIGGRAPH Patterns

Graphics / SIGGRAPH Patterns: require algorithm, implementation, scenes/datasets, comparisons, ablations, failure galleries, reproducible visual outputs, latency, and perceptual inspection. Beautiful demos are not isolation.

## Cross-Math Transfer Patterns

Cross-Math Transfer Patterns: distant fields are useful only if the bridge preserves objects, operations, invariants, and verifier obligations.

```text
source object -> target object
source invariant -> target invariant
allowed operation -> preserved operation
known theorem/tool -> translated verifier
counterexample if bridge fails
```

Use this for number theory, topology, algebra/category theory, probability/statistical physics, optimization/control, logic/proof theory.

## Medical Research Patterns

- PRISMA / systematic review: freeze search, eligibility, study selection, synthesis, reporting.
- SPIRIT / protocols: freeze design, eligibility, interventions, outcomes, sample size, allocation, blinding, analysis, monitoring, harms, amendments.
- GRADE: downgrade for bias, inconsistency, indirectness, imprecision, publication bias.
- CONSORT 2025: participant flow, protocol/SAP access, registration, data sharing, harms, disclosures.
- TRIPOD+AI: data provenance, model specification, validation, calibration, code availability, intended-use boundary.

## Cross-Disciplinary Research Patterns

- Harvard causal inference tradition: define causal question, estimand, counterfactual, identification assumptions, sensitivity checks.
- MIT / Simon design science: artifacts need goals, constraints, environment, user/context fit.
- NASA systems engineering: requirements, ConOps, interfaces, verification, validation, readiness, operations.
- Lakatos / philosophy of science: protect hard core only through novel verified progress, not excuses.
- Open science / registered reports: pre-register decisions, disclose specs, share instruments/data when possible, expose file-drawer risks.

## Distilled Skill Rules

- Start with the weakest verifier that could reject the claim.
- Freeze evaluation artifacts before candidate generation or evidence review.
- Keep losing candidates visible; hidden failures leak evidence.
- Treat deterministic evals as smoke tests; require external/noisy answers plus artifact-reading audits before maturity claims.
- Preserve raw prompts, answers, logs, and scoring limitations for inspection.
- Parallel researchers provide coverage, not consensus.
- Log protocol changes after observation as ledger events.
- Downgrade certainty before recommendation.
- Split causal claims into estimand, identification, estimation, sensitivity, transfer.
- Treat prototypes, demos, papers, model outputs, and tool retrieval as readiness levels, not proof.
- For clinical AI, separate reporting, performance, calibration, external validation, utility, and governance.

## Source Links

- OpenAI evaluation best practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices
- OpenAI Evals: https://github.com/openai/evals ; https://developers.openai.com/cookbook/examples/evaluation/getting_started_with_openai_evals
- Anthropic evals: https://platform.claude.com/docs/en/test-and-evaluate/develop-tests ; https://platform.claude.com/docs/en/test-and-evaluate/eval-tool
- HELM / METR / Inspect: https://arxiv.org/abs/2211.09110 ; https://metr.org/measuring-autonomous-ai-capabilities/ ; https://arxiv.org/abs/2411.15114 ; https://arxiv.org/abs/2503.14499 ; https://www.aisi.gov.uk/blog/inspect-evals ; https://www.aisi.gov.uk/blog/early-lessons-from-evaluating-frontier-ai-systems
- OpenAI contextual evals: https://openai.com/index/evals-drive-next-chapter-of-ai/
- OpenAI prompt-injection: https://openai.com/index/designing-agents-to-resist-prompt-injection/
- OpenAI discrete geometry: https://openai.com/index/model-disproves-discrete-geometry-conjecture/
- OpenAI FrontierScience / deep research / Parameter Golf / GPT-Rosalind: https://openai.com/index/frontierscience/ ; https://openai.com/index/introducing-deep-research/ ; https://openai.com/index/what-parameter-golf-taught-us/ ; https://openai.com/index/introducing-gpt-rosalind/
- Anthropic agents/context/multi-agent/prompt-injection/circuit tracing/alignment auditing: https://www.anthropic.com/engineering/building-effective-agents ; https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents/ ; https://www.anthropic.com/engineering/multi-agent-research-system ; https://www.anthropic.com/research/prompt-injection-defenses ; https://www.anthropic.com/research/tracing-thoughts-language-model ; https://alignment.anthropic.com/2025/openai-findings/
- Google DeepMind AlphaFold / AlphaEvolve / science programs: https://deepmind.google/science/alphafold/ ; https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/ ; https://deepmind.google/blog/accelerating-mathematical-and-scientific-discovery-with-gemini-deep-think/
- Google Research AlphaEvolve use: https://research.google/blog/ai-as-a-research-partner-advancing-theoretical-computer-science-with-alphaevolve/
- xAI Grok 4 / Grok 4 Fast / model docs: https://x.ai/news/grok-4 ; https://x.ai/news/grok-4-fast ; https://docs.x.ai/docs/models/grok-4
- SIGGRAPH 2025 Technical Papers and awards: https://s2025.siggraph.org/program/technical-papers/ ; https://blog.siggraph.org/2025/06/siggraph-2025-technical-papers-awards-best-papers-honorable-mentions-and-test-of-time.html/
- CONSORT 2025: https://pmc.ncbi.nlm.nih.gov/articles/PMC11996237/
- TRIPOD+AI: https://www.bmj.com/content/385/bmj-2023-078378
- PRISMA / SPIRIT / GRADE: https://www.prisma-statement.org/prisma-2020-checklist ; https://www.spirit-statement.org/wp-content/uploads/2013/01/SPIRIT-Checklist-download-2Jan13.pdf ; https://www.cdc.gov/acip-grade-handbook/hcp/chapter-7-grade-criteria-determining-certainty-of-evidence/index.html
- Harvard Causal Inference / SEP scientific method / SEP Lakatos: https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/ ; https://plato.stanford.edu/entries/scientific-method/ ; https://plato.stanford.edu/entries/lakatos/
- MIT Sciences of the Artificial / Pasteur's Quadrant / NASA systems / Berkeley transparency / Stanford design: https://mitpress.mit.edu/9780262354752/the-sciences-of-the-artificial/ ; https://www.brookings.edu/books/pasteurs-quadrant/ ; https://www.nasa.gov/reference/systems-engineering-handbook/ ; https://cega.berkeley.edu/collection/berkeley-initiative-for-transparency-in-the-social-sciences/ ; https://dschool.stanford.edu/tools/design-thinking-bootleg
- Registered Reports / Reproducibility Project: https://www.nature.com/srep/journal-policies/registered-reports ; https://pubmed.ncbi.nlm.nih.gov/26315443/
