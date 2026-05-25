import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function parseArgs(argv) {
  const args = {
    iteration: "external-agent-sample",
    workspace: "research-proof-workspace",
    baseline: undefined,
    out: undefined,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--iteration") {
      args.iteration = argv[index + 1];
      index += 1;
    } else if (arg === "--workspace") {
      args.workspace = argv[index + 1];
      index += 1;
    } else if (arg === "--baseline") {
      args.baseline = argv[index + 1];
      index += 1;
    } else if (arg === "--out") {
      args.out = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }

  return args;
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function sameIds(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function selectBaseline(summaries, requestedBaseline) {
  if (!requestedBaseline) throw new Error("--baseline <variant> is required");
  const matches = summaries.filter((row) => row.summary.variant === requestedBaseline);
  if (matches.length !== 1) {
    throw new Error(`expected exactly one requested baseline variant ${requestedBaseline}, found ${matches.length}`);
  }
  return matches[0];
}

function validateUniqueVariants(summaries) {
  const seen = new Set();
  for (const row of summaries) {
    const variant = row.summary.variant;
    if (seen.has(variant)) throw new Error(`duplicate summary variant: ${variant}`);
    seen.add(variant);
  }
}

function validateComparableSummaries(summaries) {
  validateUniqueVariants(summaries);
  const evalIds = summaries[0].summary.eval_ids;
  const expectedEvalIds = summaries[0].summary.expected_eval_ids;
  if (!Array.isArray(evalIds) || !evalIds.length) throw new Error("summary is missing eval_ids; rerun tools/run-research-backtest.mjs");
  if (!Array.isArray(expectedEvalIds) || !expectedEvalIds.length) {
    throw new Error("summary is missing expected_eval_ids; rerun tools/run-research-backtest.mjs with --expected-ids");
  }
  for (const row of summaries) {
    if (!sameIds(row.summary.eval_ids, evalIds)) {
      throw new Error(`summary eval_id mismatch for ${row.summary.variant}; all variants must grade the same eval ids`);
    }
    if (!sameIds(row.summary.expected_eval_ids, expectedEvalIds)) {
      throw new Error(`summary expected_eval_id mismatch for ${row.summary.variant}; all variants must use the same expected eval ids`);
    }
    if (!sameIds(row.summary.eval_ids, row.summary.expected_eval_ids)) {
      throw new Error(`summary eval_ids do not match expected_eval_ids for ${row.summary.variant}; rerun with the exact intended --expected-ids`);
    }
  }
  return { evalIds, expectedEvalIds };
}

function markdownReport(iterationDir, summaries, requestedBaseline) {
  const comparable = validateComparableSummaries(summaries);
  const baseline = selectBaseline(summaries, requestedBaseline);
  const rows = summaries
    .map((row) => {
      const lift = row.summary.expectation_pass_rate - baseline.summary.expectation_pass_rate;
      return `| ${row.summary.variant} | ${row.summary.evals} | ${row.summary.evals_passed} | ${percent(row.summary.eval_pass_rate)} | ${row.summary.expectations_passed} / ${row.summary.expectations_total} | ${percent(row.summary.expectation_pass_rate)} | ${lift >= 0 ? "+" : ""}${percent(lift)} |`;
    })
    .join("\n");

  return `# External Agent Backtest Comparison

Iteration: \`${iterationDir}\`
Baseline variant: \`${baseline.summary.variant}\`
Eval IDs: \`${comparable.evalIds.join(",")}\`
Expected Eval IDs: \`${comparable.expectedEvalIds.join(",")}\`

This report compares externally generated answer files graded by \`tools/run-research-backtest.mjs --answers\`. It is a behavioral sample, not a deterministic fixture.

| Variant | Evals | Full Passes | Eval Pass Rate | Expectations | Expectation Pass Rate | Lift vs Baseline |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
${rows}

## Interpretation

- Expectation pass rate measures partial behavioral lift.
- Full eval pass rate is intentionally strict: every shared assertion, failure mode, and forbidden shortcut must pass.
- Treat a high expectation lift with low full-pass count as useful but incomplete; it means the skill is steering behavior, but some required pressure is still missing.
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const iterationDir = resolve(root, args.workspace, args.iteration);
  const entries = await readdir(iterationDir);
  const summaryFiles = entries.filter((entry) => entry.endsWith(".summary.json")).sort();
  if (!summaryFiles.length) throw new Error(`no *.summary.json files found in ${iterationDir}`);

  const summaries = [];
  for (const file of summaryFiles) {
    const parsed = JSON.parse(await readFile(join(iterationDir, file), "utf8"));
    summaries.push(parsed);
  }

  const report = markdownReport(iterationDir, summaries, args.baseline);
  if (args.out) {
    await writeFile(resolve(root, args.out), report, "utf8");
  } else {
    process.stdout.write(report);
  }
}

await main();
