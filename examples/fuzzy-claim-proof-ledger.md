# Fuzzy Claim To Proof Ledger

This example shows how Research Proof turns a vague research claim into a falsifiable verifier plan.

## 1. Messy Claim

```text
Our autonomous loop can improve a prompt library overnight without human review.
```

## 2. Research-Proof Rewrite

### Claim

For prompt library `D`, baseline prompt set `B`, and candidate loop `C`, the loop wins only if it improves held-out task quality by at least `+5%` while staying within fixed token, latency, regression, and review budgets.

### Verifier Boundary

Frozen before the run:

- Held-out task set
- Scoring rubric
- Regression prompts
- Cost budget
- Latency budget
- Style guardrails
- Acceptance threshold

Mutable during the run:

- Candidate prompt wording
- Candidate prompt ordering
- Candidate examples inside the editable prompt library

Forbidden:

- Inspecting held-out answers
- Editing evaluator code
- Changing the scoring rubric
- Widening budgets after seeing results
- Marking candidate outputs as accepted without verifier output
- Adding hidden human cleanup

### Baseline / Candidate Family

Baseline `B` is the current prompt library measured against the frozen evaluator.

Candidate family `C` is any agent-generated edit that preserves task intent, prompt interface, and evaluation contract.

### Enemy Terms

- Evaluator hacking
- Overfitting to visible tasks
- Hidden human review
- Token-cost inflation
- Latency inflation
- Regression on previously passing prompts
- Style drift
- Cherry-picked examples
- Transfer failure on a new prompt family

### Rejection Gates

Reject the claim if any gate fails:

1. The candidate changes evaluator code, data, or thresholds.
2. The candidate exceeds token or latency budget.
3. The candidate improves visible tasks but fails held-out tasks.
4. The candidate regresses more than the allowed threshold on previous passing cases.
5. The candidate requires manual cleanup after the run.
6. The candidate cannot reproduce the result across repeated runs.
7. The candidate fails transfer on a new prompt family.

## 3. Proof Ladder

| Level | Status | Evidence |
| --- | --- | --- |
| Example win | OPEN | No candidate run yet. |
| Frozen harness win | OPEN | Evaluator must be frozen before candidate generation. |
| Regression-safe win | OPEN | Regression set must pass after candidate edits. |
| Repeated-run win | OPEN | Run consistency must be checked across repeated trials. |
| Transfer win | OPEN | Must pass a new prompt family with the same scoring rules. |
| Production evidence | OPEN | Requires production-style workload or review sample. |

## 4. Verification Plan

Run order:

1. Score baseline `B` against the frozen evaluator.
2. Run candidate loop `C` with fixed budget and action limits.
3. Score candidate output against the same evaluator.
4. Run regression prompts.
5. Repeat the run at least three times if the loop is stochastic.
6. Run a transfer prompt family that was not used during candidate construction.
7. Update the proof ledger.

Required artifacts:

- `baseline-results.json`
- `candidate-results.json`
- `regression-results.json`
- `transfer-results.json`
- `cost-report.json`
- `proof-ledger.md`

## 5. Proof Ledger

### Current Evidence

`OPEN`: The claim is interesting but not tested. No frozen harness result exists yet.

### Verifier Integrity

`OPEN`: The evaluator must be frozen before candidate generation. Until then, no autonomous improvement claim is valid.

### Hidden Costs

`OPEN`: Token cost, latency, regression rate, and human cleanup are not yet measured.

### Transfer Check

`OPEN`: No transfer result exists yet.

### Decision

`REFINE`

The claim is not ready to implement as a general autonomous loop. First, freeze the verifier and run the smallest baseline-vs-candidate test that can reject the idea.

### Next Pressure

Build a tiny fixed-harness test with 20 visible prompts, 20 held-out prompts, fixed cost limits, and a transfer set from a different prompt family. The first kill test is whether the loop improves held-out quality without changing the evaluator or increasing cost.
