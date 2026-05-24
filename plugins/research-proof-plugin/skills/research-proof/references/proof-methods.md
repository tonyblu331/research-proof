# Proof Methods Reference

Load this for mathematical, algorithmic, or proof-like research claims.

## Mathematician's Proof Loop

1. Define objects precisely.
2. State assumptions and quantifiers.
3. Try small examples.
4. Search for counterexamples.
5. Identify invariant structure.
6. Break the claim into lemmas.
7. Prove lemmas with explicit dependencies.
8. Check edge cases.
9. Translate the proof into an executable or formal verifier when possible.
10. Record remaining gaps in the proof ledger.

## Proof Types

| Proof type | Use when | Failure mode |
| --- | --- | --- |
| Direct proof | Definitions compose cleanly | Hidden assumption |
| Contradiction | Negation creates impossible condition | Proving a stronger false claim |
| Contrapositive | The reverse condition is easier | Quantifier flip |
| Induction | Object has recursive structure | Bad base case or weak hypothesis |
| Construction | Existence is enough | Construction violates constraints |
| Exhaustion | Finite cases can be checked | Missed case |
| Invariant | Process preserves a property | Invariant not strong enough |
| Reduction | Known hard/solved problem maps cleanly | Mapping changes the problem |
| Probabilistic proof | Existence follows from expectation/probability | Non-constructive result misused |
| Formal verification | Checker can validate the proof object | Formalization omits real-world assumption |

## Required Proof Metadata

- Definitions:
- Assumptions:
- Quantifiers:
- Lemmas:
- Counterexample search:
- Edge cases:
- Verifier:
- Scope of proof:

## Status Rules

- `PROVEN`: proof or checker covers the stated scope.
- `SUPPORTED`: examples, tests, or partial lemmas support the claim.
- `REJECTED`: counterexample or failed gate exists.
- `OPEN`: definitions, assumptions, or verifier are incomplete.
