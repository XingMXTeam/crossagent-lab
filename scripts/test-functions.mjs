import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const esbuild = require('esbuild');
const dir = mkdtempSync(join(tmpdir(), 'crossagent-test-'));
const outfile = join(dir, 'saved-list.test.mjs');

await esbuild.build({
  entryPoints: ['test/saved-list.test.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile,
});

const result = spawnSync(process.execPath, ['--test', outfile], { stdio: 'inherit' });
process.exit(result.status ?? 1);
