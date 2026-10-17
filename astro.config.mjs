import { copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production: https://crossagent.maoxunxing.com (Cloudflare subdomain → static dist)
//
// @astrojs/sitemap is pinned to 3.6.0. 3.6.1+ listens for `astro:routes:resolved`,
// which Astro 4.16 does not emit, so the build throws.
// The integration writes sitemap-index.xml + sitemap-0.xml (urlset).
// A build hook copies the urlset to dist/sitemap.xml so /sitemap.xml is HTTP 200.

/** Drop noindex lead-form routes and non-HTML endpoints. */
function includeInSitemap(page) {
  const { pathname } = new URL(page);
  if (pathname.startsWith('/want/') || pathname.startsWith('/api/')) return false;
  if (pathname === '/rss.xml') return false;
  return true;
}

export default defineConfig({
  site: 'https://crossagent.maoxunxing.com',
  base: '/',
  trailingSlash: 'always',
  outDir: './dist',
  integrations: [
    sitemap({
      filter: includeInSitemap,
    }),
    {
      name: 'sitemap-xml',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const dest = fileURLToPath(dir);
          const chunk = path.join(dest, 'sitemap-0.xml');
          const overflow = path.join(dest, 'sitemap-1.xml');
          try {
            await access(overflow);
            throw new Error(
              'Sitemap exceeded one chunk (sitemap-1.xml). /sitemap.xml would be partial.'
            );
          } catch (err) {
            if (err && err.code !== 'ENOENT') throw err;
          }
          await copyFile(chunk, path.join(dest, 'sitemap.xml'));
        },
      },
    },
  ],
});
