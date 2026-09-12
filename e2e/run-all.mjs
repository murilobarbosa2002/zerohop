import { spawnSync } from 'child_process';
import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const specs = readdirSync(__dirname)
  .filter((file) => file.endsWith('.spec.mjs'))
  .sort();

let failures = 0;

for (const spec of specs) {
  console.log(`\n=== ${spec} ===`);
  const result = spawnSync('xvfb-run', ['-a', 'node', path.join(__dirname, spec)], { stdio: 'inherit' });
  if (result.status !== 0) failures++;
}

console.log(failures === 0 ? `\nAll ${specs.length} e2e spec(s) passed.` : `\n${failures}/${specs.length} e2e spec(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
