import { defineConfig } from 'astro/config';

// Production: https://crossagent.maoxunxing.com (Cloudflare subdomain → static dist)
export default defineConfig({
  site: 'https://crossagent.maoxunxing.com',
  base: '/',
  trailingSlash: 'always',
  outDir: './dist',
});
