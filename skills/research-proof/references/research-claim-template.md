# Research Claim Template

## Claim

State the proposition in one falsifiable sentence.

## Domain

- Domain:
- Input family:
- Output or decision:
- Baseline:
- Candidate family:

## Verifier Boundary

- Frozen evaluator:
- Frozen data/fixtures:
- Mutable candidate/artifact:
- Forbidden changes:
- Human review required for:
- Tamper checks:

## Win Condition

```text
candidate_wins =
  primary_metric improves by required_delta
  && guardrail_metrics stay within budget
  && hidden_costs are charged
  && transfer_gate passes
```

## Enemy Terms

| Term | Charge | Current status |
| --- | --- | --- |
| Data leakage |  | OPEN |
| Evaluator hacking |  | OPEN |
| Hidden supervision or human review |  | OPEN |
| Runtime, memory, or operational cost |  | OPEN |
| Complexity or maintainability |  | OPEN |
| Distribution shift |  | OPEN |
| Dependency or environment change |  | OPEN |

## Proof Ladder

| Level | Evidence | Status |
| --- | --- | --- |
| Example |  | OPEN |
| Counterexample search |  | OPEN |
| Invariant or principle |  | OPEN |
| Lemma or decomposition |  | OPEN |
| Executable checker |  | OPEN |
| Formal or expert verification |  | OPEN |
| Transfer gate |  | OPEN |

## Rejection Gates

- Reject if:
- Reject if:
- Reject if:
- Reject if evaluator integrity is compromised:

## What Would Falsify The Favorite Idea?

Name the shortest test that would make the preferred candidate lose.

## Verification Plan

- Command:
- Primary metric:
- Guardrail metrics:
- Hidden-cost accounting:
- Artifacts:
- Expected PASS/REJECT:
