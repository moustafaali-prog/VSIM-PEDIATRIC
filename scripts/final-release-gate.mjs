import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportPath = path.join(root, "docs", "FINAL_RELEASE_GATE_v2.4.9.md");
const results = [];
function run(name, cmd, args) {
  const r = spawnSync(cmd, args, { cwd: root, encoding: "utf8" });
  results.push({ name, status: r.status === 0 ? "PASS" : "FAIL", exit: r.status ?? -1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" });
  return r.status === 0;
}
function check(name, ok, detail) { results.push({ name, status: ok ? "PASS" : "FAIL", exit: ok ? 0 : 1, detail }); }

run("Static preflight", "node", ["scripts/release-preflight.mjs"]);
run("Core TypeScript", "tsc", ["-p", "tsconfig.core.json", "--noEmit", "--pretty", "false"]);
run("Final QA", "node", ["tests/final-qa.mjs"]);
run("Procedure interaction", "node", ["tests/procedure-interaction.test.mjs"]);
run("Clinical validation registry", "node", ["--test", "tests/scenarios/clinical-validation-registry.test.mjs"]);
run("Medication/order validation", "node", ["--test", "tests/scenarios/medication-order-validation.test.mjs"]);
run("Audio validation registry", "node", ["--test", "tests/audio/audio-validation-registry.test.mjs"]);
run("Pilot harness", "node", ["tests/pilot/pilot-simulation-harness.test.mjs"]);
run("Automated pilot regression", "node", ["tests/pilot/pilot-regression.mjs"]);

const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const browserDepsInstalled = existsSync(path.join(root, "node_modules", "three")) &&
  existsSync(path.join(root, "node_modules", "vite"));
if (browserDepsInstalled) {
  check("Browser dependency availability", true, "three and vite are installed.");
} else {
  results.push({ name: "Browser dependency availability", status: "BLOCKED", exit: 2, detail: "three/vite are not installed in this environment." });
}

const browserBuildAttempted = process.argv.includes("--browser-build");
const browserE2ERequested = process.argv.includes("--browser-e2e");
if (browserBuildAttempted && browserDepsInstalled) {
  run("Browser TypeScript/Vite build", "npm", ["run", "build"]);
} else if (browserBuildAttempted) {
  results.push({ name: "Browser TypeScript/Vite build", status: "BLOCKED", exit: 2, detail: "Dependencies unavailable; no build claim made." });
} else {
  results.push({ name: "Browser TypeScript/Vite build", status: "BLOCKED", exit: 2, detail: "Not attempted without installed dependencies. Use --browser-build after dependency installation." });
}


if (browserE2ERequested && browserDepsInstalled && existsSync(path.join(root, "node_modules", "@playwright", "test"))) {
  run("Browser E2E", "npm", ["run", "browser:e2e"]);
} else if (browserE2ERequested) {
  results.push({ name: "Browser E2E", status: "BLOCKED", exit: 2, detail: "Browser dependencies or Playwright are unavailable in this environment." });
} else {
  results.push({ name: "Browser E2E", status: "BLOCKED", exit: 2, detail: "Not attempted without installed browser dependencies. Use --browser-e2e in a connected validation environment." });
}

const hardFails = results.filter(r => r.status === "FAIL");
const blocked = results.filter(r => r.status === "BLOCKED");
const engineeringGo = hardFails.length === 0;
const releaseStatus = engineeringGo && blocked.length === 0 ? "GO" : "NO-GO";
const lines = [
  "# Final Release Gate v2.4.9",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `## Decision`,
  `**${releaseStatus}**`,
  "",
  "This gate separates deterministic engineering evidence from external clinical/device validation.",
  "",
  "## Results",
  "| Gate | Status |",
  "|---|---|",
  ...results.map(r => `| ${r.name} | **${r.status}** |`),
  "",
  "## Interpretation",
  `- Engineering gates passed: **${results.filter(r => r.status === "PASS").length}**`,
  `- Hard failures: **${hardFails.length}**`,
  `- Blocked external/environment gates: **${blocked.length}**`,
  "- A blocked browser build is not converted into PASS.",
  "- Clinical SME approval, real-device performance, real-browser E2E, and licensed clinical audio remain external validation activities unless explicitly evidenced.",
  "",
  "## Regression policy",
  "Any intentional behavioral change must be reviewed and the pilot baseline regenerated explicitly with `npm run pilot:regression:update`.",
  "",
  "## Safety boundary",
  "Medication execution remains locked until the medication/order-set validation gate is explicitly satisfied.",
  ""
];
mkdirSync(path.dirname(reportPath), { recursive: true });
writeFileSync(reportPath, lines.join("\n"));

console.log(JSON.stringify({ releaseStatus, engineeringGo, hardFails: hardFails.length, blocked: blocked.length, results: results.map(({name,status})=>({name,status})) }, null, 2));
process.exitCode = hardFails.length ? 1 : 0;
