import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { PAGE_LASTMOD } from './src/data/page-lastmod.mjs';

const SITE = process.env.PUBLIC_SITE_URL || 'https://checkgamepad.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  server: { port: 4371, host: true },
  preview: { port: 4372, host: true },
  integrations: [
    sitemap({
      serialize(item) {
        const pathname = new URL(item.url).pathname;
        const lastmod = PAGE_LASTMOD[pathname];
        if (!lastmod) throw new Error(`No PAGE_LASTMOD entry for ${pathname} (src/data/page-lastmod.mjs)`);
        return { ...item, lastmod };
      },
    }),
  ],
});
