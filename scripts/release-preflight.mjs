import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'package.json', 'index.html', 'src/main.ts',
  'src/core/EndToEndSession.ts',
  'src/scenarios/ScenarioPackage.ts',
  'src/clinical/ActionTypes.ts',
  'src/scene/InteractionRegistry.ts',
  'src/procedures/ProcedureStateMachine.ts',
  'src/audio/AudioValidationRegistry.ts',
  'src/scenarios/ClinicalValidationRegistry.ts',
  'tests/final-qa.mjs',
  'tests/procedure-interaction.test.mjs'
];
const missing = required.filter(f => !fs.existsSync(path.join(root, f)));
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const result = {
  packageVersion: pkg.version,
  requiredFiles: required.length,
  missing,
  dependencySpec: pkg.dependencies,
  buildScript: pkg.scripts?.build,
  qaScript: pkg.scripts?.qa,
  nodeModulesPresent: fs.existsSync(path.join(root, 'node_modules')),
  status: missing.length === 0 ? 'PASS_STATIC_PREFLIGHT' : 'FAIL_STATIC_PREFLIGHT'
};
console.log(JSON.stringify(result, null, 2));
process.exit(missing.length ? 1 : 0);
