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

function oldNewRegression(summaries) {
  return comparableGroups(summaries).find(({ rows }) => {
    const variants = new Set(rows.map((item) => item.summary.variant));
    return variants.has("old_skill_compact_rules") && (variants.has("new_skill_compact_rules") || variants.has("with_skill_compact_rules"));
  });
}

function hasOldNewRegression(summaries) {
  return Boolean(oldNewRegression(summaries));
}

function hasFullSuiteExternal(summaries, expectedCount, hardGateCounts) {
  return Boolean(fullSuiteExternal(summaries, expectedCount, hardGateCounts));
}

function passesFullSuiteHardGates(summary, expectedCount, hardGateCounts) {
  const requiresArtifactGate = hardGateCounts.artifact > 0;
  const requiresStructuralArtifactGate = hardGateCounts.structuralArtifact > 0;
  const requiresDecisionGate = hardGateCounts.decision > 0;
  const requiresContradictionGate = hardGateCounts.contradiction > 0;
  if (summary.evals < expectedCount || summary.expectation_pass_rate < 0.9) return false;
  if (requiresArtifactGate && (!summary.artifact_expectations_total || summary.artifact_expectation_pass_rate !== 1)) return false;
  if (requiresStructuralArtifactGate && (!summary.structural_artifact_expectations_total || summary.structural_artifact_expectation_pass_rate !== 1)) return false;
  if (requiresDecisionGate && (!summary.decision_expectations_total || summary.decision_expectation_pass_rate !== 1)) return false;
  if (requiresContradictionGate && (!summary.contradiction_expectations_total || summary.contradiction_expectation_pass_rate !== 1)) return false;
  if ((requiresArtifactGate || requiresStructuralArtifactGate || requiresDecisionGate || requiresContradictionGate) && summary.hard_gate_pass_rate !== 1) return false;
  return true;
}

function fullSuiteExternal(summaries, expectedCount, hardGateCounts) {
  const candidates = comparableGroups(summaries).map(({ iteration, rows }) => {
    const passingSeeds = rows
      .filter((item) => item.mode === "external-answers" && !item.summary.variant.toLowerCase().includes("baseline"))
      .filter((item) => passesFullSuiteHardGates(item.summary, expectedCount, hardGateCounts))
      .toSorted((a, b) => b.summary.expectation_pass_rate - a.summary.expectation_pass_rate);
    return { iteration, passingSeeds, seedCount: passingSeeds.length, summary: passingSeeds[0]?.summary };
  });
  return candidates
    .filter((candidate) => candidate.seedCount >= 3)
    .toSorted((a, b) => b.seedCount - a.seedCount || b.summary.expectation_pass_rate - a.summary.expectation_pass_rate)[0];
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

function markdown({ gates, rating, lift, fullSuite, oldNew, skillLines }) {
  const liftText = lift
    ? `${lift.best.variant} beats ${lift.baseline.variant} by ${pct(lift.lift)} expectations within ${lift.iteration} (${pct(lift.best.expectation_pass_rate)} vs ${pct(lift.baseline.expectation_pass_rate)}).`
    : "No baseline-vs-skill external lift found.";
  const missing = gates.filter((gate) => !gate.pass);
  const capText = missing.length
    ? `This score is intentionally capped by missing evidence gates: ${missing.map((gate) => gate.level).join(", ")}.`
    : "All local release checks are currently satisfied; this is a local release score, not proof of universal transfer.";
  const oldNewText = oldNew
    ? `Old/current regression dashboard found in ${oldNew.iteration}; variants: ${oldNew.rows.map((row) => row.summary.variant).join(", ")}.`
    : "No comparable old/current regression dashboard found.";
  const confidenceText = missing.length
    ? "- Higher scores require the missing evidence checks, not more prose."
    : "- With every local gate passing, remaining confidence work is external replication, broader domains, and keeping adversarial cases fresh.";

  return `# Research Proof Capability Gate Report

Current release score: **${rating.toFixed(1)} / 12**

${capText} A release claim requires evidence gates, not just a polished runtime skill.

Runtime skill lines: ${skillLines}

External lift: ${liftText}

Old-vs-new regression: ${oldNewText}

Full-suite external gate: ${
    fullSuite
      ? `${fullSuite.seedCount} noisy full-suite seeds passed in ${fullSuite.iteration}; best ${fullSuite.summary.variant} reached ${pct(fullSuite.summary.expectation_pass_rate)} expectations, ${pct(fullSuite.summary.artifact_expectation_pass_rate ?? 1)} lexical artifacts, ${pct(fullSuite.summary.structural_artifact_expectation_pass_rate ?? 1)} structural artifacts, ${pct(fullSuite.summary.decision_expectation_pass_rate ?? 1)} decisions, ${pct(fullSuite.summary.contradiction_expectation_pass_rate ?? 1)} contradictions, and ${pct(fullSuite.summary.hard_gate_pass_rate ?? 1)} hard gates across ${fullSuite.summary.evals} evals.`
      : "No comparable run has at least 3 noisy full-suite seeds reaching >=90% expectation plus 100% artifact/structural/decision/contradiction gates."
  }

| Level | Gate | Status | Evidence |
| --- | --- | --- | --- |
${gateRows(gates)}

## Interpretation

- PASS means the artifact exists and satisfies the local integrity checks.
- OPEN would mean the next improvement requires evidence, not more skill prose.
${confidenceText}
`;
}

const args = parseArgs(process.argv.slice(2));
const workspaceDir = resolve(root, args.workspace);
const trackedEvidenceDir = join(root, "evaluation", "capability-gates");
const skillText = await readFile(join(root, "skills", "research-proof", "SKILL.md"), "utf8");
const evals = await readJson(join(root, "skills", "research-proof", "evals", "evals.json"));
const hardGateCounts = {
  artifact: evals.evals.reduce((sum, evalCase) => sum + (Array.isArray(evalCase.artifact_expectations) ? evalCase.artifact_expectations.length : 0), 0),
  structuralArtifact: evals.evals.reduce((sum, evalCase) => sum + (Array.isArray(evalCase.artifact_structural_expectations) ? evalCase.artifact_structural_expectations.length : 0), 0),
  decision: evals.evals.reduce((sum, evalCase) => sum + (Array.isArray(evalCase.decision_expectations) ? evalCase.decision_expectations.length : 0), 0),
  contradiction: evals.evals.reduce((sum, evalCase) => sum + (Array.isArray(evalCase.contradiction_expectations) ? evalCase.contradiction_expectations.length : 0), 0),
};
const benchmarkPath = join(workspaceDir, "iteration-1", "benchmark.json");
const benchmark = (await exists(benchmarkPath)) ? await readJson(benchmarkPath) : undefined;
const summaryFiles = [
  ...(await listSummaryFiles(trackedEvidenceDir)),
  ...(await listSummaryFiles(workspaceDir)),
];
const summaries = await Promise.all(summaryFiles.map(async (path) => ({ ...(await readJson(path)), path, iteration: dirname(path) })));
const externalSummaries = summaries.filter((item) => item.mode === "external-answers");
const lift = bestExternalLift(externalSummaries);
const fullSuite = fullSuiteExternal(externalSummaries, evals.evals.length, hardGateCounts);
const oldNew = oldNewRegression(externalSummaries);
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
    pass: Boolean(benchmark?.summary?.with_skill?.eval_pass_rate === 1 && benchmark?.summary?.without_skill?.expectation_pass_rate <= 0.02 && benchmark?.summary?.without_skill?.hard_gate_pass_rate <= 0.2),
    evidence: benchmark ? `with_skill ${pct(benchmark.summary.with_skill.eval_pass_rate)}, without_skill expectations ${pct(benchmark.summary.without_skill.expectation_pass_rate)}, without_skill hard gates ${pct(benchmark.summary.without_skill.hard_gate_pass_rate ?? 0)}.` : "No benchmark.json found.",
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
    pass: hasFullSuiteExternal(externalSummaries, evals.evals.length, hardGateCounts),
    evidence: `Requires one comparable external run with baseline plus at least 3 noisy full-suite seeds; each passing seed needs ${evals.evals.length} evals, >=90% expectation pass rate, and 100% artifact, structural-artifact, decision, contradiction, and combined hard-gate pass rates when those expectations exist.`,
  },
  {
    level: "L6",
    name: "Old-vs-new regression dashboard",
    pass: hasOldNewRegression(externalSummaries),
    evidence: "Requires old_skill_compact_rules and new/current skill variants in one workspace.",
  },
  {
    level: "L7",
    name: "Tracked release evidence",
    pass: (await listSummaryFiles(trackedEvidenceDir)).length > 0,
    evidence: "Requires summary-only release evidence under evaluation/capability-gates.",
  },
  {
    level: "L8",
    name: "Adversarial refresh",
    pass: evals.evals.filter((evalCase) => evalCase.uses_prompt_injection_assertions).length >= 4,
    evidence: "Prompt-injection cases remain in the eval suite.",
  },
];

const report = markdown({ gates, rating: score(gates), lift, fullSuite, oldNew, skillLines });
if (args.out) await writeFile(resolve(root, args.out), report, "utf8");
else process.stdout.write(report);
