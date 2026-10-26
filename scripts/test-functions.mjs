import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const esbuild = require('esbuild');
const dir = mkdtempSync(join(tmpdir(), 'crossagent-test-'));
const entries = ['test/saved-list.test.ts', 'test/activation.test.ts'];
const outfiles = [];

for (const entry of entries) {
  const outfile = join(dir, `${entry.replaceAll('/', '-')}.mjs`);
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile,
  });
  outfiles.push(outfile);
}

const result = spawnSync(process.execPath, ['--test', ...outfiles], { stdio: 'inherit' });
process.exit(result.status ?? 1);
