from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]


def joined(*parts: str) -> str:
    return "".join(parts)


BANNED_PATTERNS = {
    "legacy_domain_a": re.compile(rf"\b{joined('ph', 'os')}\b", re.IGNORECASE),
    "named_lab_a": re.compile(rf"\b{joined('open', 'ai')}\b", re.IGNORECASE),
    "named_lab_b": re.compile(rf"\b{joined('anth', 'ropic')}\b", re.IGNORECASE),
    "named_lab_c": re.compile(rf"\b{joined('deep', 'mind')}\b", re.IGNORECASE),
    "named_person_a": re.compile(rf"\b{joined('kar', 'pathy')}\b", re.IGNORECASE),
    "hardware_specific": re.compile(rf"\b{joined('g', 'pu')}\b", re.IGNORECASE),
    "old_domain_phrase_a": re.compile(rf"\b{joined('scene', ' transport')}\b", re.IGNORECASE),
    "old_domain_phrase_b": re.compile(rf"\b{joined('gauss', 'ian')} supports?\b", re.IGNORECASE),
    "old_domain_phrase_c": re.compile(rf"\b{joined('page', '[_ -]?table')}\b", re.IGNORECASE),
}

REQUIRED_TERMS = {
    "SKILL.md": [
        "Core Discipline",
        "Method Selection",
        "Proof Ladder",
        "Research TDD Sandbox",
        "Backtest This Skill",
        "Observable Agent Loop",
        "Claim",
        "Verifier Boundary",
        "Baseline / Candidate Family",
        "Enemy Terms",
        "Rejection Gates",
        "Proof Ledger Decision",
        "Next Pressure",
        "Fixed harness",
        "Observable loop",
        "Evaluator-gated discovery",
        "Divergent exploration",
        "Evidence synthesis",
        "Transfer discipline",
        "behavioral-run-protocol.md",
    ],
    "evals/evals.json": [
        "evaluator-hacking",
        "hidden-cost-leak",
        "no-transfer-gate",
        "status-inflation",
        "generic-pressure",
        "proof-gap",
        "source-confusion",
        "loop-drift",
    ],
    "references/research-claim-template.md": [
        "Verifier Boundary",
        "Win Condition",
        "Enemy Terms",
        "Proof Ladder",
        "Rejection Gates",
        "Verification Plan",
    ],
    "references/proof-ledger-template.md": [
        "Verifier Integrity",
        "Transfer Check",
        "Anti-Fixation Decision",
        "Next Pressure",
    ],
    "references/research-methods.md": [
        "Fixed-Harness Research Loop",
        "Proof Ladder",
        "Divergent Researcher Pool",
        "Evaluator-Gated Program Search",
        "Observable Agent Loop",
        "Evidence Synthesis",
        "Transfer Gate",
    ],
    "references/proof-methods.md": [
        "Mathematician's Proof Loop",
        "Proof Types",
        "Required Proof Metadata",
        "Status Rules",
    ],
    "references/backtest-cases.md": [
        "Backtest Protocol",
        "Training Recipe Loop",
        "Compression Representation",
        "Alignment Method Search",
        "Algorithm Discovery",
        "Research Method Synthesis",
        "Mathematical Claim",
        "Scientific Hypothesis",
        "Architecture Claim",
        "Evaluation Benchmark",
        "Product Experiment",
        "Tool-Using Research Agent",
        "Failure Pattern Taxonomy",
        "Refinement Patch Contract",
    ],
    "references/behavioral-run-protocol.md": [
        "with_skill",
        "without_skill",
        "transcript.md",
        "outputs/answer.md",
        "timing.json",
        "grading.json",
        "expectations",
        "benchmark.json",
        "benchmark.md",
        "review.html",
        "N=3",
    ],
}

REQUIRED_SCENARIO_KEYS = {
    "id",
    "domain",
    "prompt",
    "required_pressure",
    "expected_failure_modes",
    "forbidden_shortcuts",
}

REQUIRED_PRESSURE = {
    "claim",
    "verifier_boundary",
    "baseline_candidate",
    "enemy_terms",
    "rejection_gates",
    "proof_ladder",
    "proof_ledger_decision",
    "next_pressure",
}

PRESSURE_EXPECTATION_TERMS = {
    "claim": ["claim"],
    "verifier_boundary": ["verifier boundary"],
    "baseline_candidate": ["baseline / candidate family", "baseline and candidate"],
    "enemy_terms": ["enemy terms"],
    "rejection_gates": ["rejection gates"],
    "proof_ladder": ["proof ladder", "transfer path"],
    "proof_ledger_decision": ["proof ledger decision"],
    "next_pressure": ["next pressure"],
}

EXPECTED_EVAL_KEYS = {
    "id",
    "prompt",
    "expected_output",
    "files",
    "expectations",
}

MIN_SCENARIOS = 10


def text_files() -> list[Path]:
    return [
        path
        for path in ROOT.rglob("*")
        if path.is_file() and path.suffix.lower() in {".md", ".yaml", ".json", ".py"}
    ]


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()


def load_json(relative_path: str, failures: list[str]) -> Any:
    path = ROOT / relative_path
    if not path.exists():
        failures.append(f"missing file: {relative_path}")
        return None

    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        failures.append(f"{relative_path}: invalid JSON: {exc}")
        return None


def check_required_terms(failures: list[str]) -> None:
    for relative_path, terms in REQUIRED_TERMS.items():
        path = ROOT / relative_path
        if not path.exists():
            failures.append(f"missing file: {relative_path}")
            continue
        text = path.read_text(encoding="utf-8")
        for term in terms:
            if term not in text:
                failures.append(f"{relative_path}: missing {term!r}")


def check_banned_terms(failures: list[str]) -> None:
    this_file = Path(__file__).resolve()
    for path in text_files():
        text = path.read_text(encoding="utf-8")
        for name, pattern in BANNED_PATTERNS.items():
            if path == this_file and name in text:
                continue
            if pattern.search(text):
                failures.append(f"{path.relative_to(ROOT)}: banned legacy/source term matched {name}")


def check_scenarios(failures: list[str]) -> list[dict[str, Any]]:
    scenarios = load_json("references/sandbox-scenarios.json", failures)
    if scenarios is None:
        return []

    if not isinstance(scenarios, list):
        failures.append("references/sandbox-scenarios.json: root must be a list")
        return []

    if len(scenarios) < MIN_SCENARIOS:
        failures.append(f"references/sandbox-scenarios.json: expected at least {MIN_SCENARIOS} scenarios")

    ids: set[str] = set()
    domains: set[str] = set()
    for index, scenario in enumerate(scenarios):
        if not isinstance(scenario, dict):
            failures.append(f"scenario {index}: must be an object")
            continue
        missing = REQUIRED_SCENARIO_KEYS - set(scenario)
        if missing:
            failures.append(f"scenario {index}: missing keys {sorted(missing)}")

        scenario_id = scenario.get("id")
        if not isinstance(scenario_id, str) or not scenario_id:
            failures.append(f"scenario {index}: id must be a non-empty string")
        elif scenario_id in ids:
            failures.append(f"scenario {index}: duplicate id {scenario_id!r}")
        else:
            ids.add(scenario_id)

        domain = scenario.get("domain")
        if isinstance(domain, str) and domain:
            domains.add(domain)

        required_pressure = set(scenario.get("required_pressure", []))
        if required_pressure != REQUIRED_PRESSURE:
            failures.append(
                f"scenario {scenario_id or index}: required_pressure must equal {sorted(REQUIRED_PRESSURE)}"
            )

        if len(scenario.get("expected_failure_modes", [])) < 2:
            failures.append(f"scenario {scenario_id or index}: expected at least two failure modes")

        if len(scenario.get("forbidden_shortcuts", [])) < 2:
            failures.append(f"scenario {scenario_id or index}: expected at least two forbidden shortcuts")

    if len(domains) < 8:
        failures.append("sandbox scenarios must cover at least 8 distinct domains")

    return [scenario for scenario in scenarios if isinstance(scenario, dict)]


def check_eval_schema(eval_case: dict[str, Any], index: int, failures: list[str]) -> None:
    missing = EXPECTED_EVAL_KEYS - set(eval_case)
    if missing:
        failures.append(f"eval {index}: missing keys {sorted(missing)}")

    unexpected = set(eval_case) - EXPECTED_EVAL_KEYS
    if unexpected:
        failures.append(f"eval {index}: unexpected keys {sorted(unexpected)}")

    if not isinstance(eval_case.get("id"), int):
        failures.append(f"eval {index}: id must be an integer")

    if not isinstance(eval_case.get("prompt"), str) or not eval_case.get("prompt", "").strip():
        failures.append(f"eval {index}: prompt must be a non-empty string")

    if not isinstance(eval_case.get("expected_output"), str) or not eval_case.get("expected_output", "").strip():
        failures.append(f"eval {index}: expected_output must be a non-empty string")

    if not isinstance(eval_case.get("files"), list):
        failures.append(f"eval {index}: files must be a list")

    expectations = eval_case.get("expectations")
    if not isinstance(expectations, list) or len(expectations) < len(REQUIRED_PRESSURE):
        failures.append(
            f"eval {index}: expectations must be a list with at least {len(REQUIRED_PRESSURE)} entries"
        )
        return

    for expectation_index, expectation in enumerate(expectations):
        if not isinstance(expectation, str) or not expectation.strip():
            failures.append(f"eval {index}: expectation {expectation_index} must be a non-empty string")


def check_eval_pressure(eval_case: dict[str, Any], index: int, failures: list[str]) -> None:
    expectations_text = normalize(" ".join(eval_case.get("expectations", [])))
    for pressure, terms in PRESSURE_EXPECTATION_TERMS.items():
        if not any(term in expectations_text for term in terms):
            failures.append(f"eval {index}: expectations do not cover required pressure {pressure!r}")


def check_eval_suite(failures: list[str], scenarios: list[dict[str, Any]]) -> None:
    evals_root = load_json("evals/evals.json", failures)
    if evals_root is None:
        return

    if not isinstance(evals_root, dict):
        failures.append("evals/evals.json: root must be an object")
        return

    if evals_root.get("skill_name") != "research-proof":
        failures.append("evals/evals.json: skill_name must be 'research-proof'")

    evals = evals_root.get("evals")
    if not isinstance(evals, list):
        failures.append("evals/evals.json: evals must be a list")
        return

    scenario_by_prompt = {
        scenario.get("prompt"): scenario
        for scenario in scenarios
        if isinstance(scenario.get("prompt"), str)
    }
    scenario_prompts = set(scenario_by_prompt)
    eval_prompts = {
        eval_case.get("prompt")
        for eval_case in evals
        if isinstance(eval_case, dict) and isinstance(eval_case.get("prompt"), str)
    }

    missing_eval_prompts = scenario_prompts - eval_prompts
    extra_eval_prompts = eval_prompts - scenario_prompts
    if missing_eval_prompts:
        failures.append(f"evals/evals.json: missing evals for prompts {sorted(missing_eval_prompts)}")
    if extra_eval_prompts:
        failures.append(f"evals/evals.json: eval prompts not found in sandbox scenarios {sorted(extra_eval_prompts)}")

    if len(evals) != len(scenarios):
        failures.append(f"evals/evals.json: expected {len(scenarios)} evals, found {len(evals)}")

    ids: set[int] = set()
    covered_failure_modes: set[str] = set()
    has_evaluator_loophole_check = False

    for index, eval_case in enumerate(evals):
        if not isinstance(eval_case, dict):
            failures.append(f"eval {index}: must be an object")
            continue

        check_eval_schema(eval_case, index, failures)
        check_eval_pressure(eval_case, index, failures)

        eval_id = eval_case.get("id")
        if isinstance(eval_id, int):
            if eval_id in ids:
                failures.append(f"eval {index}: duplicate id {eval_id}")
            ids.add(eval_id)

        scenario = scenario_by_prompt.get(eval_case.get("prompt"))
        if scenario is None:
            continue

        expectations_text = normalize(" ".join(eval_case.get("expectations", [])))
        expected_failure_modes = set(scenario.get("expected_failure_modes", []))
        forbidden_shortcuts = set(scenario.get("forbidden_shortcuts", []))

        missing_modes = [
            mode for mode in sorted(expected_failure_modes)
            if normalize(mode) not in expectations_text
        ]
        if missing_modes:
            failures.append(
                f"eval {eval_case.get('id', index)}: expectations missing expected failure modes {missing_modes}"
            )

        if not any(normalize(mode) in expectations_text for mode in expected_failure_modes) and not any(
            normalize(shortcut) in expectations_text for shortcut in forbidden_shortcuts
        ):
            failures.append(
                f"eval {eval_case.get('id', index)}: missing domain-specific loophole or forbidden-shortcut check"
            )

        covered_failure_modes.update(mode for mode in expected_failure_modes if normalize(mode) in expectations_text)
        if "evaluator-hacking" in expected_failure_modes and "evaluator-hacking" in expectations_text:
            has_evaluator_loophole_check = True

    all_failure_modes = {
        mode
        for scenario in scenarios
        for mode in scenario.get("expected_failure_modes", [])
    }
    missing_suite_modes = sorted(all_failure_modes - covered_failure_modes)
    if missing_suite_modes:
        failures.append(f"evals/evals.json: suite does not cover failure modes {missing_suite_modes}")

    if not has_evaluator_loophole_check:
        failures.append("evals/evals.json: at least one eval must explicitly catch evaluator-hacking")


def main() -> int:
    failures: list[str] = []
    scenarios = check_scenarios(failures)
    check_required_terms(failures)
    check_banned_terms(failures)
    check_eval_suite(failures, scenarios)

    if failures:
        print("Backtest failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(
        "Backtest passed: structural files, sandbox scenarios, eval coverage, "
        "failure-mode pressure, and behavioral-run protocol are coherent."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
