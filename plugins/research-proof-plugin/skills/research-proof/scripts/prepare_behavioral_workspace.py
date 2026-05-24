from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_WORKSPACE = ROOT.parent / "research-proof-workspace"
CONFIGS = ("with_skill", "without_skill")


def slugify(text: str, max_words: int = 6) -> str:
    words = re.findall(r"[a-z0-9]+", text.lower())
    return "-".join(words[:max_words]) or "eval"


def load_evals() -> list[dict[str, Any]]:
    evals_path = ROOT / "evals" / "evals.json"
    data = json.loads(evals_path.read_text(encoding="utf-8"))
    evals = data.get("evals")
    if not isinstance(evals, list):
        raise ValueError("evals/evals.json must contain an evals list")
    return evals


def write_json_once(path: Path, data: dict[str, Any], overwrite: bool) -> bool:
    if path.exists() and not overwrite:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    return True


def scaffold_workspace(workspace: Path, iteration: str, runs: int, overwrite: bool) -> tuple[int, int]:
    evals = load_evals()
    iteration_dir = workspace / iteration
    written_files = 0
    created_runs = 0

    for eval_case in evals:
        eval_id = eval_case["id"]
        slug = slugify(eval_case["prompt"])
        eval_dir = iteration_dir / f"eval-{eval_id}-{slug}"
        metadata = {
            "eval_id": eval_id,
            "eval_name": slug,
            "prompt": eval_case["prompt"],
            "expected_output": eval_case["expected_output"],
            "expectations": eval_case["expectations"],
        }
        if write_json_once(eval_dir / "eval_metadata.json", metadata, overwrite):
            written_files += 1

        for config in CONFIGS:
            for run_number in range(1, runs + 1):
                run_dir = eval_dir / config / f"run-{run_number}"
                (run_dir / "outputs").mkdir(parents=True, exist_ok=True)
                created_runs += 1

    (workspace / "skill-snapshot").mkdir(parents=True, exist_ok=True)
    return written_files, created_runs


def main() -> int:
    parser = argparse.ArgumentParser(description="Prepare behavioral backtest workspace layout.")
    parser.add_argument("--workspace", type=Path, default=DEFAULT_WORKSPACE)
    parser.add_argument("--iteration", default="iteration-1")
    parser.add_argument("--runs", type=int, default=1)
    parser.add_argument("--overwrite", action="store_true")
    args = parser.parse_args()

    if args.runs < 1:
        raise SystemExit("--runs must be at least 1")

    written_files, created_runs = scaffold_workspace(
        workspace=args.workspace,
        iteration=args.iteration,
        runs=args.runs,
        overwrite=args.overwrite,
    )
    print(f"Prepared {created_runs} run directories in {args.workspace / args.iteration}")
    print(f"Wrote {written_files} eval metadata files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
