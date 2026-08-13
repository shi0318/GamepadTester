import { SITE } from '../data/site';

export const GET = () => new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', SITE.url).href}\n`, {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
});
