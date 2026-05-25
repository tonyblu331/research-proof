import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function parseArgs(argv) {
  const args = {
    workspace: "research-proof-workspace",
    out: undefined,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--workspace") {
      args.workspace = argv[index + 1];
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

async function exists(path) {
  return stat(path).then(() => true).catch(() => false);
}

async function listSummaryFiles(directory) {
  if (!(await exists(directory))) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listSummaryFiles(path)));
    else if (entry.name.endsWith(".summary.json")) files.push(path);
  }
  return files;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function pct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function sameIds(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function hasIdIntegrity(item) {
  const summary = item.summary;
  return (
    Array.isArray(summary.eval_ids) &&
    summary.eval_ids.length > 0 &&
    Array.isArray(summary.expected_eval_ids) &&
    sameIds(summary.eval_ids, summary.expected_eval_ids)
  );
}

function groupsByIteration(summaries) {
  const groups = new Map();
  for (const item of summaries) {
    const key = item.iteration;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.entries()].map(([iteration, rows]) => ({ iteration, rows }));
}

function comparableGroups(summaries) {
  return groupsByIteration(summaries).filter(({ rows }) => {
    if (!rows.every(hasIdIntegrity)) return false;
    const baselineRows = rows.filter((item) => item.summary.variant.toLowerCase().includes("baseline"));
    const nonBaselineRows = rows.filter((item) => !item.summary.variant.toLowerCase().includes("baseline"));
    if (!baselineRows.length || !nonBaselineRows.length) return false;
    const expected = rows[0].summary.expected_eval_ids;
    return rows.every((item) => sameIds(item.summary.expected_eval_ids, expected));
  });
}

function bestExternalLift(summaries) {
  const candidates = [];
  for (const group of comparableGroups(summaries)) {
    const baseline = group.rows
      .filter((item) => item.summary.variant.toLowerCase().includes("baseline"))
      .toSorted((a, b) => a.summary.expectation_pass_rate - b.summary.expectation_pass_rate)[0];
    const best = group.rows
      .filter((item) => !item.summary.variant.toLowerCase().includes("baseline"))
      .toSorted((a, b) => b.summary.expectation_pass_rate - a.summary.expectation_pass_rate)[0];
    candidates.push({
      iteration: group.iteration,
      baseline: baseline.summary,
      best: best.summary,
      lift: best.summary.expectation_pass_rate - baseline.summary.expectation_pass_rate,
    });
  }
  return candidates.toSorted((a, b) => b.lift - a.lift)[0];
}

function hasOldNewRegression(summaries) {
  return comparableGroups(summaries).some(({ rows }) => {
    const variants = new Set(rows.map((item) => item.summary.variant));
    return variants.has("old_skill_compact_rules") && (variants.has("new_skill_compact_rules") || variants.has("with_skill_compact_rules"));
  });
}

function hasFullSuiteExternal(summaries, expectedCount) {
  return Boolean(fullSuiteExternal(summaries, expectedCount));
}

function fullSuiteExternal(summaries, expectedCount) {
  const candidates = comparableGroups(summaries)
    .flatMap(({ iteration, rows }) =>
      rows
        .filter((item) => item.mode === "external-answers" && item.summary.evals >= expectedCount)
        .map((item) => ({ iteration, summary: item.summary })),
    )
    .toSorted((a, b) => b.summary.expectation_pass_rate - a.summary.expectation_pass_rate);
  return candidates.find((item) => item.summary.expectation_pass_rate >= 0.9);
}

function hasExpectedIdIntegrity(summaries) {
  return comparableGroups(summaries).length > 0;
}

function gateRows(gates) {
  return gates
    .map((gate) => `| ${gate.level} | ${gate.name} | ${gate.pass ? "PASS" : "OPEN"} | ${gate.evidence} |`)
    .join("\n");
}

function score(gates) {
  const passed = gates.filter((gate) => gate.pass).length;
  const base = 6.8 + passed * ((12 - 6.8) / gates.length);
  const missing = new Set(gates.filter((gate) => !gate.pass).map((gate) => gate.level));
  let cap = 12;
  if (missing.has("L5")) cap = Math.min(cap, 9.2);
  if (missing.has("L6")) cap = Math.min(cap, 9.4);
  if (missing.has("L7")) cap = Math.min(cap, 9.7);
  if (missing.has("L8")) cap = Math.min(cap, 10.0);
  return Math.min(cap, base);
}

function markdown({ gates, rating, lift, fullSuite, skillLines }) {
  const liftText = lift
    ? `${lift.best.variant} beats ${lift.baseline.variant} by ${pct(lift.lift)} expectations within ${lift.iteration} (${pct(lift.best.expectation_pass_rate)} vs ${pct(lift.baseline.expectation_pass_rate)}).`
    : "No baseline-vs-skill external lift found.";

  return `# Research Proof 12/10 Gate Report

Current rating: **${rating.toFixed(1)} / 12**

This score is intentionally capped by missing evidence gates. A 12/10 claim requires all maturity gates, not just a polished runtime skill.

Runtime skill lines: ${skillLines}

External lift: ${liftText}

Full-suite external gate: ${
    fullSuite
      ? `${fullSuite.summary.variant} reached ${pct(fullSuite.summary.expectation_pass_rate)} across ${fullSuite.summary.evals} evals in ${fullSuite.iteration}.`
      : "No full-suite external run has reached the >=90% expectation gate."
  }

| Level | Gate | Status | Evidence |
| --- | --- | --- | --- |
${gateRows(gates)}

## Interpretation

- PASS means the artifact exists and satisfies the local integrity checks.
- OPEN means the next improvement requires evidence, not more skill prose.
- The score can move above 10 only after real-task transfer and adversarial refresh evidence exist.
`;
}

const args = parseArgs(process.argv.slice(2));
const workspaceDir = resolve(root, args.workspace);
const skillText = await readFile(join(root, "skills", "research-proof", "SKILL.md"), "utf8");
const evals = await readJson(join(root, "skills", "research-proof", "evals", "evals.json"));
const benchmarkPath = join(workspaceDir, "iteration-1", "benchmark.json");
const benchmark = (await exists(benchmarkPath)) ? await readJson(benchmarkPath) : undefined;
const summaryFiles = await listSummaryFiles(workspaceDir);
const summaries = await Promise.all(summaryFiles.map(async (path) => ({ ...(await readJson(path)), path, iteration: dirname(path) })));
const externalSummaries = summaries.filter((item) => item.mode === "external-answers");
const lift = bestExternalLift(externalSummaries);
const fullSuite = fullSuiteExternal(externalSummaries, evals.evals.length);
const skillLines = skillText.replace(/\r?\n$/, "").split(/\r?\n/).length;

const gates = [
  {
    level: "L0",
    name: "Structural validator ready",
    pass: await exists(join(root, "tools", "validate-research-skill.mjs")),
    evidence: "Validator script exists and is run separately in CI/local verification.",
  },
  {
    level: "L1",
    name: "Deterministic fixture",
    pass: Boolean(benchmark?.summary?.with_skill?.eval_pass_rate === 1 && benchmark?.summary?.without_skill?.expectation_pass_rate === 0),
    evidence: benchmark ? `with_skill ${pct(benchmark.summary.with_skill.eval_pass_rate)}, without_skill expectations ${pct(benchmark.summary.without_skill.expectation_pass_rate)}.` : "No benchmark.json found.",
  },
  {
    level: "L2",
    name: "External answer grading",
    pass: externalSummaries.length > 0,
    evidence: `${externalSummaries.length} external summary files found.`,
  },
  {
    level: "L3",
    name: "Clean baseline sample",
    pass: externalSummaries.some((item) => item.summary.variant.toLowerCase().includes("baseline")),
    evidence: "At least one clean baseline variant is present.",
  },
  {
    level: "L4",
    name: "Expected-ID comparison integrity",
    pass: hasExpectedIdIntegrity(externalSummaries),
    evidence: "External summaries carry matching eval_ids and expected_eval_ids.",
  },
  {
    level: "L5",
    name: "Full-suite or noisy multi-seed behavior",
    pass: hasFullSuiteExternal(externalSummaries, evals.evals.length),
    evidence: `Requires an external summary with at least ${evals.evals.length} evals and >=90% expectation pass rate.`,
  },
  {
    level: "L6",
    name: "Old-vs-new regression dashboard",
    pass: hasOldNewRegression(externalSummaries),
    evidence: "Requires old_skill_compact_rules and new/current skill variants in one workspace.",
  },
  {
    level: "L7",
    name: "Real-task transfer",
    pass: await exists(join(root, "evaluation", "real-task-transfer.md")),
    evidence: "Requires a non-fixture research task transfer report.",
  },
  {
    level: "L8",
    name: "Adversarial refresh",
    pass: await exists(join(root, "evaluation", "judgment-day.md")) && (evals.evals.filter((evalCase) => evalCase.uses_prompt_injection_assertions).length >= 4),
    evidence: "Judgment-day report exists and prompt-injection cases remain in suite.",
  },
];

const report = markdown({ gates, rating: score(gates), lift, fullSuite, skillLines });
if (args.out) await writeFile(resolve(root, args.out), report, "utf8");
else process.stdout.write(report);
