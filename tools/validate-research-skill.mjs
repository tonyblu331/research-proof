import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillRoot = join(root, "skills", "research-proof");
const pluginSkillRoot = join(root, "plugins", "research-proof-plugin", "skills", "research-proof");

const requiredPressure = [
  "claim",
  "verifier_boundary",
  "baseline_candidate",
  "enemy_terms",
  "rejection_gates",
  "proof_ladder",
  "proof_ledger_decision",
  "next_pressure",
];

const requiredFiles = {
  "SKILL.md": [
    "Core Discipline",
    "Method Selection",
    "references/research-operations.md",
    "Research TDD Sandbox",
    "Backtest This Skill",
    "Prompt-injection boundary",
    "evals/evals.json",
    "references/skill-steering.md",
    "negative-control pressure",
    "behavior metric",
    "live-source research review",
  ],
  "evals/evals.json": [
    "shared_assertions",
    "prompt_injection_assertions",
    "prompt-injection",
    "evaluator-hacking",
    "certainty-inflation",
    "readiness-inflation",
    "identification-gap",
    "invalid-user-proxy",
    "degenerating-program",
    "field-silo",
    "analogy-overfit",
    "unverified-transfer",
    "mechanism-blindness",
    "perceptual-artifact",
    "tool-grounding-gap",
    "live-source-drift",
    "clinical-ai-opacity",
    "delegation-drift",
    "context-bloat",
    "unmeasured-skill-lift",
  ],
  "references/source-patterns.md": [
    "OpenAI prompt-injection guidance",
    "Anthropic prompt-injection research",
    "OWASP LLM prompt-injection guidance",
    "Harvard causal inference tradition",
    "MIT / Simon design science",
    "NASA systems engineering",
    "OpenAI discrete-geometry discovery",
    "Cross-Math Transfer Patterns",
    "Graphics / SIGGRAPH Patterns",
    "xAI Grok 4 / Grok 4 Fast",
    "CONSORT 2025",
    "TRIPOD+AI",
    "Distilled Skill Rules",
  ],
  "references/research-methods.md": [
    "Fixed-Harness Research Loop",
    "Proof Ladder",
    "Causal Identification Review",
    "Design-Science Review",
    "Readiness / Transfer Ladder",
    "Progressive-Program Review",
    "Protocol-Frozen Evidence Review",
    "Cross-Domain Transfer Search",
    "Mechanistic Audit",
    "Artifact / Perceptual Systems Review",
    "Tool-Grounded Scientific Workflow",
    "Clinical-AI Reporting Review",
    "review authority",
    "success metric",
  ],
  "references/backtest-cases.md": [
    "Use `evals/evals.json` as the single source of truth",
    "Prompt-Injection Bar",
    "Failure Pattern Taxonomy",
    "Refinement Patch Contract",
    "conditional and falsifiable",
  ],
  "references/behavioral-run-protocol.md": [
    "shared_assertions",
    "prompt_injection_assertions",
    "with_skill",
    "without_skill",
    "grading.json",
    "tools/run-research-backtest.mjs",
    "--expected-ids",
    "--baseline",
  ],
  "references/research-operations.md": [
    "Observable Agent Loop",
    "Research TDD Sandbox",
    "Backtest This Skill",
    "Prompt-Injection Boundary",
    "SDD Integration",
  ],
  "references/skill-steering.md": [
    "Steering Thesis",
    "Delegation Rules",
    "Harness Maturity Ladder",
    "No-Bloat Rule",
    "Backtest Loop",
    "Peer-Pressure Pass",
    "12/10 Rating Bar",
    "Patterns To Borrow",
  ],
};

const requiredFailureModes = [
  "evaluator-hacking",
  "hidden-cost-leak",
  "no-transfer-gate",
  "status-inflation",
  "source-confusion",
  "loop-drift",
  "certainty-inflation",
  "protocol-drift",
  "readiness-inflation",
  "integration-risk",
  "identification-gap",
  "confounding-leak",
  "solutionism",
  "invalid-user-proxy",
  "degenerating-program",
  "prompt-injection",
  "field-silo",
  "analogy-overfit",
  "unverified-transfer",
  "mechanism-blindness",
  "perceptual-artifact",
  "demo-overfit",
  "missing-ablation",
  "tool-grounding-gap",
  "live-source-drift",
  "clinical-ai-opacity",
  "delegation-drift",
  "context-bloat",
  "unmeasured-skill-lift",
];

const requiredMethods = [
  "fixed-harness research loop",
  "proof ladder",
  "divergent researcher pool",
  "evaluator-gated program search",
  "evidence synthesis",
  "protocol-frozen evidence review",
  "causal identification review",
  "readiness / transfer ladder",
  "design-science review",
  "progressive-program review",
  "observable agent loop",
  "cross-domain transfer search",
  "mechanistic audit",
  "artifact / perceptual systems review",
  "tool-grounded scientific workflow",
  "live-source research review",
  "clinical-ai reporting review",
  "skill steering review",
];

function normalize(text) {
  return String(text).toLowerCase().replace(/\s+/g, " ").trim();
}

function difference(required, actual) {
  const actualSet = new Set(actual);
  return required.filter((item) => !actualSet.has(item)).sort();
}

function hasSemanticMatcher(text, term) {
  return text.includes(`"${term}":`) || text.includes(`${term}:`);
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules" || entry.name.endsWith("-workspace")) continue;
      files.push(...(await listFiles(path)));
    }
    else files.push(path);
  }
  return files;
}

async function readSkillText(relativePath, failures) {
  try {
    return await readFile(join(skillRoot, relativePath), "utf8");
  } catch {
    failures.push(`missing file: ${relativePath}`);
    return "";
  }
}

async function readSkillJson(relativePath, failures) {
  const text = await readSkillText(relativePath, failures);
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch (error) {
    failures.push(`${relativePath}: invalid JSON: ${error.message}`);
    return undefined;
  }
}

async function checkNoPythonTooling(failures) {
  const files = await listFiles(root);
  const pythonFiles = files
    .map((path) => relative(root, path).replaceAll("\\", "/"))
    .filter((path) => !path.startsWith(".git/"))
    .filter((path) => path.endsWith(".py") || path.endsWith(".pyc") || path.includes("__pycache__"));

  if (pythonFiles.length) failures.push(`Python tooling/cache remains: ${pythonFiles.join(", ")}`);
}

async function checkRequiredText(failures) {
  for (const [relativePath, terms] of Object.entries(requiredFiles)) {
    const text = await readSkillText(relativePath, failures);
    for (const term of terms) {
      if (!text.includes(term)) failures.push(`${relativePath}: missing ${JSON.stringify(term)}`);
    }
  }
}

async function checkSkillCompactness(failures) {
  const text = await readSkillText("SKILL.md", failures);
  const lines = text.replace(/\r?\n$/, "").split(/\r?\n/).length;
  if (lines > 100) failures.push(`SKILL.md: expected <= 100 lines for runtime context, found ${lines}`);
}

async function checkRemovedDuplication(failures) {
  const removed = join(skillRoot, "references", "sandbox-scenarios.json");
  await stat(removed)
    .then(() => failures.push("references/sandbox-scenarios.json should not exist; evals/evals.json is the case source of truth"))
    .catch(() => undefined);
}

async function checkEvalSchema(failures) {
  const rootJson = await readSkillJson("evals/evals.json", failures);
  if (!rootJson || typeof rootJson !== "object" || Array.isArray(rootJson)) {
    failures.push("evals/evals.json: root must be an object");
    return;
  }

  if (rootJson.skill_name !== "research-proof") failures.push("evals/evals.json: skill_name must be research-proof");
  if (rootJson.schema_version !== 2) failures.push("evals/evals.json: schema_version must be 2");
  if (!Array.isArray(rootJson.shared_assertions) || rootJson.shared_assertions.length < requiredPressure.length) {
    failures.push("evals/evals.json: shared_assertions must cover the common grading bar");
  }
  if (!Array.isArray(rootJson.prompt_injection_assertions) || rootJson.prompt_injection_assertions.length < 3) {
    failures.push("evals/evals.json: prompt_injection_assertions must define security checks");
  }

  const missingPressure = difference(requiredPressure, rootJson.shared_required_pressure ?? []);
  if (missingPressure.length) failures.push(`evals/evals.json: missing shared pressure ${missingPressure.join(", ")}`);

  const evals = rootJson.evals;
  if (!Array.isArray(evals) || evals.length < 28) {
    failures.push("evals/evals.json: expected at least 28 compact eval cases");
    return;
  }

  const ids = new Set();
  const domains = new Set();
  const methods = new Set();
  const failureModes = new Set();
  let promptInjectionCases = 0;

  for (const [index, evalCase] of evals.entries()) {
    for (const key of ["id", "domain", "method", "prompt", "expected_output", "failure_modes", "forbidden_shortcuts", "files"]) {
      if (!(key in evalCase)) failures.push(`eval ${index}: missing ${key}`);
    }

    if (!Number.isInteger(evalCase.id)) failures.push(`eval ${index}: id must be an integer`);
    if (ids.has(evalCase.id)) failures.push(`eval ${index}: duplicate id ${evalCase.id}`);
    ids.add(evalCase.id);

    for (const key of ["domain", "method", "prompt", "expected_output"]) {
      if (typeof evalCase[key] !== "string" || !evalCase[key].trim()) failures.push(`eval ${index}: ${key} must be non-empty`);
    }

    if (!Array.isArray(evalCase.failure_modes) || evalCase.failure_modes.length < 2) {
      failures.push(`eval ${index}: failure_modes must include at least two items`);
    }
    if (!Array.isArray(evalCase.forbidden_shortcuts) || evalCase.forbidden_shortcuts.length < 2) {
      failures.push(`eval ${index}: forbidden_shortcuts must include at least two items`);
    }
    if (!Array.isArray(evalCase.files)) failures.push(`eval ${index}: files must be a list`);

    domains.add(evalCase.domain);
    methods.add(normalize(evalCase.method));
    for (const mode of evalCase.failure_modes ?? []) failureModes.add(mode);
    if (evalCase.uses_prompt_injection_assertions) promptInjectionCases += 1;
  }

  if (domains.size < 15) failures.push("evals/evals.json: expected at least 15 domains");
  const missingMethods = requiredMethods.filter((method) => !methods.has(method));
  if (missingMethods.length) failures.push(`evals/evals.json: missing methods ${missingMethods.join(", ")}`);
  const missingModes = requiredFailureModes.filter((mode) => !failureModes.has(mode));
  if (missingModes.length) failures.push(`evals/evals.json: missing failure modes ${missingModes.join(", ")}`);
  if (promptInjectionCases < 3) failures.push("evals/evals.json: expected at least three prompt-injection eval cases");
}

async function checkSkillCreatorExport(failures) {
  const exporterPath = join(root, "tools", "export-skill-creator-evals.mjs");
  await stat(exporterPath).catch(() => failures.push("missing tools/export-skill-creator-evals.mjs"));
  const runnerPath = join(root, "tools", "run-research-backtest.mjs");
  await stat(runnerPath).catch(() => failures.push("missing tools/run-research-backtest.mjs"));
  const comparerPath = join(root, "tools", "compare-external-backtests.mjs");
  await stat(comparerPath).catch(() => failures.push("missing tools/compare-external-backtests.mjs"));
  const packerPath = join(root, "tools", "create-research-eval-pack.mjs");
  await stat(packerPath).catch(() => failures.push("missing tools/create-research-eval-pack.mjs"));
  const raterPath = join(root, "tools", "rate-research-skill.mjs");
  await stat(raterPath).catch(() => failures.push("missing tools/rate-research-skill.mjs"));
  const runnerText = await readFile(runnerPath, "utf8").catch(() => "");
  for (const term of ["safeIterationDir", "expected_eval_ids", "hasLedgerDecision", "duplicate eval id"]) {
    if (!runnerText.includes(term)) failures.push(`tools/run-research-backtest.mjs: missing ${term}`);
  }
  const comparerText = await readFile(comparerPath, "utf8").catch(() => "");
  for (const term of ["--baseline <variant> is required", "summary eval_id mismatch", "summary expected_eval_id mismatch", "expected exactly one requested baseline"]) {
    if (!comparerText.includes(term)) failures.push(`tools/compare-external-backtests.mjs: missing ${term}`);
  }
  const packerText = await readFile(packerPath, "utf8").catch(() => "");
  for (const term of ["--prompt-variant", "mixed-language", "compact_rules", "original_prompt"]) {
    if (!packerText.includes(term)) failures.push(`tools/create-research-eval-pack.mjs: missing ${term}`);
  }
  const raterText = await readFile(raterPath, "utf8").catch(() => "");
  for (const term of ["12/10 Gate Report", "Old-vs-new regression dashboard", "Full-suite or noisy multi-seed behavior", "Real-task transfer"]) {
    if (!raterText.includes(term)) failures.push(`tools/rate-research-skill.mjs: missing ${term}`);
  }

  const source = await readSkillJson("evals/evals.json", failures);
  if (!source) return;

  const promptInjectionCases = source.evals?.filter((evalCase) => evalCase.uses_prompt_injection_assertions).length ?? 0;
  if (promptInjectionCases < 3) failures.push("skill-creator export: prompt-injection cases below adapter bar");

  const failureModes = [...new Set(source.evals?.flatMap((evalCase) => evalCase.failure_modes ?? []) ?? [])];
  const modesWithoutMatcher = failureModes.filter((mode) => !hasSemanticMatcher(runnerText, mode));
  if (modesWithoutMatcher.length) {
    failures.push(`tools/run-research-backtest.mjs: missing semantic matcher entries for ${modesWithoutMatcher.join(", ")}`);
  }
}

async function checkPluginDrift(failures) {
  let skillFiles;
  let pluginFiles;
  try {
    skillFiles = (await listFiles(skillRoot)).map((path) => relative(skillRoot, path).replaceAll("\\", "/")).sort();
    pluginFiles = (await listFiles(pluginSkillRoot)).map((path) => relative(pluginSkillRoot, path).replaceAll("\\", "/")).sort();
  } catch (error) {
    failures.push(`plugin drift check failed: ${error.message}`);
    return;
  }

  const missing = difference(skillFiles, pluginFiles);
  const extra = difference(pluginFiles, skillFiles);
  if (missing.length) failures.push(`plugin skill missing files: ${missing.join(", ")}`);
  if (extra.length) failures.push(`plugin skill has extra files: ${extra.join(", ")}`);

  for (const file of skillFiles.filter((path) => pluginFiles.includes(path))) {
    const [source, copy] = await Promise.all([
      readFile(join(skillRoot, file), "utf8"),
      readFile(join(pluginSkillRoot, file), "utf8"),
    ]);
    if (source !== copy) failures.push(`plugin skill drift: ${file}`);
  }
}

async function main() {
  const failures = [];
  await stat(skillRoot).catch(() => failures.push("missing skills/research-proof"));
  await stat(pluginSkillRoot).catch(() => failures.push("missing plugin research-proof skill"));

  await checkNoPythonTooling(failures);
  await checkRequiredText(failures);
  await checkSkillCompactness(failures);
  await checkRemovedDuplication(failures);
  await checkEvalSchema(failures);
  await checkSkillCreatorExport(failures);
  await checkPluginDrift(failures);

  if (failures.length) {
    console.error("Research Proof validation failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log("Research Proof validation passed: compact eval harness, prompt-injection coverage, no-Python tooling, and plugin copy are coherent.");
}

await main();
