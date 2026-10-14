#!/usr/bin/env node
/**
 * Cloudflare Pages Direct Upload helper.
 * Usage: node pages-direct-upload.mjs <jwt> <distDir> <outManifestJson>
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const jwt = process.argv[2];
const distDir = path.resolve(process.argv[3] || 'dist');
const outManifest = path.resolve(process.argv[4] || 'manifest.json');
if (!jwt) {
  console.error('Usage: node pages-direct-upload.mjs <jwt> <distDir> <outManifestJson>');
  process.exit(1);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
};

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function contentType(file) {
  return MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

const files = walk(distDir);
const byHash = new Map();
const manifest = {};

for (const file of files) {
  const buf = fs.readFileSync(file);
  const hash = crypto.createHash('md5').update(buf).digest('hex');
  const rel = '/' + path.relative(distDir, file).split(path.sep).join('/');
  manifest[rel] = hash;
  if (!byHash.has(hash)) {
    byHash.set(hash, { file, rel, buf, ct: contentType(file) });
  }
}

const hashes = [...byHash.keys()];
console.log(`Files: ${files.length}, unique hashes: ${hashes.length}`);

async function cf(pathname, body) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${pathname}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.success) {
    console.error(pathname, JSON.stringify(data.errors || data, null, 2));
    throw new Error(`${pathname} failed`);
  }
  return data;
}

const missingRes = await cf('/pages/assets/check-missing', { hashes });
const missing = missingRes.result || [];
console.log(`Missing to upload: ${missing.length}`);

const BATCH = 15;
for (let i = 0; i < missing.length; i += BATCH) {
  const chunk = missing.slice(i, i + BATCH);
  const payload = chunk.map((h) => {
    const item = byHash.get(h);
    return {
      key: h,
      value: item.buf.toString('base64'),
      base64: true,
      metadata: { contentType: item.ct },
    };
  });
  await cf('/pages/assets/upload', payload);
  console.log(`Uploaded ${Math.min(i + BATCH, missing.length)}/${missing.length}`);
}

await cf('/pages/assets/upsert-hashes', { hashes });
console.log('Upserted hashes');

fs.writeFileSync(outManifest, JSON.stringify(manifest));
console.log(`Wrote manifest ${outManifest} (${Object.keys(manifest).length} entries)`);
console.log('MANIFEST_READY');
