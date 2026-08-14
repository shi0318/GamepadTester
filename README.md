# Gamepad Tester

Astro static site for browser-based controller diagnostics.

## Local development

```powershell
npm install
npm run dev
```

Open http://localhost:4371/.

The project uses port 4371 so it does not conflict with the separate Reaction Time Game Astro project.

## Checks

```powershell
npm run check
npm test
npm run build
npm run preview
```

The preview server runs on http://localhost:4372/.

## Cloudflare Pages

Use these settings when importing the GitHub repository:

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: 20 or newer

Set `PUBLIC_SITE_URL` in the Cloudflare Pages environment variables to `https://checkgamepad.com` (or another deployment URL for a preview build). If it is omitted, the build uses `https://checkgamepad.com` as the default canonical URL.

The site is static and does not require a server, database, API key or runtime function.
