import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const evalPath = join(root, "skills", "research-proof", "evals", "evals.json");
const defaultSkillPath = join(root, "skills", "research-proof", "SKILL.md");

function parseArgs(argv) {
  const args = {
    out: undefined,
    ids: "all",
    promptVariant: "clean",
    skillPath: defaultSkillPath,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--out") {
      args.out = argv[index + 1];
      index += 1;
    } else if (arg === "--ids") {
      args.ids = argv[index + 1];
      index += 1;
    } else if (arg === "--prompt-variant") {
      args.promptVariant = argv[index + 1];
      index += 1;
    } else if (arg === "--skill-path") {
      args.skillPath = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }

  return args;
}

function parseIds(value, evals) {
  if (value === "all") return evals.map((evalCase) => evalCase.id);
  const ids = String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      if (!/^\d+$/.test(item)) throw new Error(`invalid eval id: ${item}`);
      return Number(item);
    });
  if (!ids.length) throw new Error("--ids must be all or a comma-separated list");
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`duplicate eval id: ${id}`);
    seen.add(id);
  }
  return ids;
}

function section(text, heading) {
  const start = text.indexOf(`## ${heading}`);
  if (start === -1) return "";
  const next = text.indexOf("\n## ", start + 1);
  return text.slice(start, next === -1 ? text.length : next).trim();
}

function compactRules(skillText) {
  const purpose = section(skillText, "Purpose")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("##"))
    .join(" ");
  const workflow = section(skillText, "Workflow")
    .split(/\r?\n/)
    .filter((line) => /^\d+\./.test(line.trim()))
    .join("\n");
  const output = section(skillText, "Output Contract");
  return [purpose, workflow, output]
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function typoPrompt(prompt) {
  return prompt
    .replace(/\bCan\b/g, "Cna")
    .replace(/\bprove\b/gi, "prvoe")
    .replace(/\bresearch\b/gi, "reserach")
    .replace(/\bevaluator\b/gi, "evalautor")
    .replace(/\bprototype\b/gi, "prototpye")
    .replace(/\bobservational\b/gi, "observatinoal");
}

function mixedLanguagePrompt(prompt) {
  return `Answer in English, but handle this mixed-language user prompt without losing the verifier boundary: che, ${prompt} Decime tambien que evidencia faltaria y que gate lo rechazaria.`;
}

function variantPrompt(prompt, variant) {
  if (variant === "clean") return prompt;
  if (variant === "typo") return typoPrompt(prompt);
  if (variant === "mixed-language") return mixedLanguagePrompt(prompt);
  throw new Error(`unknown prompt variant: ${variant}`);
}

function buildPack(source, skillText, ids, promptVariant) {
  const byId = new Map(source.evals.map((evalCase) => [evalCase.id, evalCase]));
  const evals = ids.map((id) => {
    const evalCase = byId.get(id);
    if (!evalCase) throw new Error(`unknown eval id: ${id}`);
    return {
      id: evalCase.id,
      domain: evalCase.domain,
      method: evalCase.method,
      prompt: variantPrompt(evalCase.prompt, promptVariant),
      original_prompt: evalCase.prompt,
      prompt_variant: promptVariant,
      expected_output: evalCase.expected_output,
      failure_modes: evalCase.failure_modes,
      forbidden_shortcuts: evalCase.forbidden_shortcuts,
      uses_prompt_injection_assertions: Boolean(evalCase.uses_prompt_injection_assertions),
    };
  });

  return {
    skill_name: source.skill_name,
    schema_version: 1,
    prompt_variant: promptVariant,
    eval_ids: ids,
    instructions: {
      baseline: "Answer each prompt naturally without loading or using the research-proof skill. Return JSON only.",
      with_skill: "Apply the compact research-proof rules. Use exact headings inside each answer. Return JSON only.",
    },
    compact_rules: compactRules(skillText),
    output_schema: [{ id: 0, answer: "string" }],
    evals,
  };
}

const args = parseArgs(process.argv.slice(2));
const source = JSON.parse(await readFile(evalPath, "utf8"));
const skillText = await readFile(resolve(root, args.skillPath), "utf8");
const ids = parseIds(args.ids, source.evals);
const pack = buildPack(source, skillText, ids, args.promptVariant);
const output = `${JSON.stringify(pack, null, 2)}\n`;

if (args.out) {
  const outPath = resolve(root, args.out);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, output, "utf8");
} else {
  process.stdout.write(output);
}
