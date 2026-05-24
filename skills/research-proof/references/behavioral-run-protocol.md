# Behavioral Run Protocol

Use this when running the skill against its backtest suite. The goal is to compare behavior, not just validate file shape.

## Research-Aligned Principles

- Compare `with_skill` against `without_skill`; if the baseline passes the same evals, the skill may not add value.
- Prefer deterministic checks first, rubric grading second, and human review for nuance.
- Capture full outputs and traces, not just final verdicts.
- Repeat noisy cases with `N=3` before claiming reliability.
- Track pass rate, timing, token use, variance, and failures.
- Keep evals faithful to real research tasks and edge cases.
- Make rubrics specific enough that generic pressure words do not pass.
- Add anti-hacking checks for evaluator loopholes and reward-hacked wins.

## Workspace Layout

```text
research-proof-workspace/
  skill-snapshot/
  iteration-1/
    eval-<id>-<slug>/
      eval_metadata.json
      with_skill/
        run-1/
          transcript.md
          outputs/
            answer.md
          timing.json
          grading.json
      without_skill/
        run-1/
          transcript.md
          outputs/
            answer.md
          timing.json
          grading.json
```

## Run Contract

For every eval in `evals/evals.json`:

1. Run `with_skill` with explicit access to this skill.
2. Run `without_skill` with the same user prompt and no skill access.
3. Save the final answer to `outputs/answer.md`.
4. Save the execution trace or transcript to `transcript.md`.
5. Save timing and token data to `timing.json` when available.
6. Grade each run with the local skill-creator grader contract.

Prepare the directory layout with:

```text
python scripts/prepare_behavioral_workspace.py --runs 1
```

## Grading Contract

Each `grading.json` must include:

```json
{
  "expectations": [
    {
      "text": "The expectation being graded",
      "passed": true,
      "evidence": "Specific evidence from transcript or outputs"
    }
  ],
  "summary": {
    "passed": 0,
    "failed": 0,
    "total": 0,
    "pass_rate": 0.0
  }
}
```

The grader must reject surface compliance. A response that names `Claim`, `Verifier Boundary`, or `Next Pressure` without domain-specific substance is a failure.

## Aggregation And Review

Aggregate results with the local benchmark aggregator, then generate a static review page:

```text
python <skill-creator>/scripts/aggregate_benchmark.py <iteration-dir> --skill-name research-proof
python <skill-creator>/eval-viewer/generate_review.py <iteration-dir> --skill-name research-proof --benchmark <iteration-dir>/benchmark.json --static <iteration-dir>/review.html
```

The aggregator should emit both `benchmark.json` and `benchmark.md`; keep both with the iteration artifacts.

## Reliability Rule

Use one run for first-pass harness validation. Move to `N=3` for noisy or open-ended cases before calling a result reliable. Treat `pass_all_3` as stronger evidence than mean pass rate.
