import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourcePath = join(root, "skills", "research-proof", "evals", "evals.json");

function parseArgs(argv) {
  const args = { out: undefined, check: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--check") args.check = true;
    else if (arg === "--out") {
      args.out = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  return args;
}

function buildAssertions(source, evalCase) {
  const assertions = [
    ...source.shared_assertions.map((text) => ({ name: text.slice(0, 80), text })),
    ...(evalCase.uses_prompt_injection_assertions
      ? source.prompt_injection_assertions.map((text) => ({ name: text.slice(0, 80), text }))
      : []),
    ...evalCase.failure_modes.map((mode) => ({
      name: `Reject ${mode}`,
      text: `Names or prevents the failure mode: ${mode}.`,
    })),
    ...evalCase.forbidden_shortcuts.map((shortcut) => ({
      name: `Forbid ${shortcut}`,
      text: `Does not rely on the shortcut: ${shortcut}.`,
    })),
  ];

  return assertions;
}

function exportSkillCreatorSchema(source) {
  if (source.skill_name !== "research-proof") throw new Error("source skill_name must be research-proof");
  if (source.schema_version !== 2) throw new Error("source schema_version must be 2");
  if (!Array.isArray(source.evals)) throw new Error("source evals must be an array");

  return {
    skill_name: source.skill_name,
    generated_from_schema_version: source.schema_version,
    evals: source.evals.map((evalCase) => ({
      id: evalCase.id,
      prompt: evalCase.prompt,
      expected_output: evalCase.expected_output,
      files: evalCase.files,
      assertions: buildAssertions(source, evalCase),
      metadata: {
        domain: evalCase.domain,
        method: evalCase.method,
        failure_modes: evalCase.failure_modes,
        forbidden_shortcuts: evalCase.forbidden_shortcuts,
        uses_prompt_injection_assertions: Boolean(evalCase.uses_prompt_injection_assertions),
      },
    })),
  };
}

function validateExport(exported) {
  const failures = [];
  if (exported.skill_name !== "research-proof") failures.push("exported skill_name mismatch");
  if (!Array.isArray(exported.evals) || exported.evals.length === 0) failures.push("exported evals missing");

  for (const [index, evalCase] of (exported.evals ?? []).entries()) {
    for (const key of ["id", "prompt", "expected_output", "files", "assertions"]) {
      if (!(key in evalCase)) failures.push(`eval ${index}: missing ${key}`);
    }
    if (!Array.isArray(evalCase.assertions) || evalCase.assertions.length < 8) {
      failures.push(`eval ${index}: expected assertions from shared grading bar`);
    }
  }

  if (failures.length) throw new Error(failures.join("\n"));
}

const args = parseArgs(process.argv.slice(2));
const source = JSON.parse(await readFile(sourcePath, "utf8"));
const exported = exportSkillCreatorSchema(source);
validateExport(exported);

const output = `${JSON.stringify(exported, null, 2)}\n`;
if (args.out) {
  const outPath = resolve(root, args.out);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, output, "utf8");
} else if (!args.check) {
  process.stdout.write(output);
}
