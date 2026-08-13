import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = process.env.PUBLIC_SITE_URL || 'https://gamepadtester.pages.dev';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  server: { port: 4371, host: true },
  preview: { port: 4372, host: true },
  integrations: [sitemap()],
});
