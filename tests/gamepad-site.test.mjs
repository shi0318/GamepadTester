import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

test('Astro routes and shared components exist', () => {
  for (const file of ['astro.config.mjs', 'public/gamepad-tester-logo.svg', 'public/gamepad-tester-favicon.svg', 'src/layouts/BaseLayout.astro', 'src/components/GamepadBench.astro', 'src/components/AdapterDirections.astro', 'src/scripts/gamepad-tester.js', 'src/scripts/input-diagnostics.js', 'src/data/controller-library.ts', 'src/data/adapter-library.ts', 'src/components/ControllerCard.astro', 'src/components/AdapterCard.astro', 'src/pages/index.astro', 'src/pages/404.astro', 'src/pages/about.astro', 'src/pages/tools/index.astro', 'src/pages/controllers/index.astro', 'src/pages/controllers/[slug].astro', 'src/pages/controller-adapters/index.astro', 'src/pages/controller-adapters/[slug].astro', 'src/pages/stick-drift-test/index.astro', 'src/pages/gamepad-calibration/index.astro', 'src/pages/button-test/index.astro', 'src/pages/vibration-test/index.astro', 'src/pages/ps5-controller-test/index.astro', 'src/pages/xbox-controller-test/index.astro', 'src/pages/switch-controller-test/index.astro', 'src/pages/gamepad-not-detected/index.astro', 'src/pages/keyboard-latency-test/index.astro', 'src/pages/mouse-dpi-test/index.astro']) assert.equal(fs.existsSync(path.join(root, file)), true, file);
});

test('tool page contains static SEO metadata and Gamepad API hook', () => {
  const layout = fs.readFileSync(path.join(root, 'src/layouts/BaseLayout.astro'), 'utf8');
  const script = fs.readFileSync(path.join(root, 'src/scripts/gamepad-tester.js'), 'utf8');
  assert.match(layout, /canonical/);
  assert.match(layout, /application\/ld\+json/);
  assert.match(script, /navigator\.getGamepads/);
  assert.match(script, /gamepadconnected/);
  assert.match(script, /vibrationActuator/);
});

test('production site URL points to checkgamepad.com by default', () => {
  const config = fs.readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');
  const site = fs.readFileSync(path.join(root, 'src/data/site.ts'), 'utf8');
  const robots = fs.readFileSync(path.join(root, 'src/pages/robots.txt.ts'), 'utf8');
  assert.match(config, /https:\/\/checkgamepad\.com/);
  assert.match(site, /https:\/\/checkgamepad\.com/);
  assert.match(robots, /sitemap-index\.xml/);
  assert.doesNotMatch(config, /gamepadtester\.pages\.dev/);
  assert.doesNotMatch(site, /gamepadtester\.pages\.dev/);
});

test('404 page is explicit and non-indexable', () => {
  const page = fs.readFileSync(path.join(root, 'src/pages/404.astro'), 'utf8');
  const layout = fs.readFileSync(path.join(root, 'src/layouts/BaseLayout.astro'), 'utf8');
  assert.match(page, /<BaseLayout[^>]*noindex/);
  assert.match(page, /Page not found/);
  assert.match(layout, /name="robots" content="noindex,follow"/);
});

test('homepage keeps the primary keyword and explanatory content in static source', () => {
  const homepage = fs.readFileSync(path.join(root, 'src/pages/index.astro'), 'utf8');
  const explainer = fs.readFileSync(path.join(root, 'src/components/WhatIsGamepadTester.astro'), 'utf8');
  assert.match(homepage, /title="Gamepad Tester Online/);
  assert.match(homepage, /description="Gamepad tester online/);
  assert.match(homepage, /<h1>Gamepad Tester Online<\/h1>/);
  assert.match(homepage, /<WhatIsGamepadTester \/>/);
  assert.match(explainer, /href="\/button-test\/"/);
  assert.match(explainer, /href="\/stick-drift-test\/"/);
  assert.match(explainer, /href="\/vibration-test\/"/);
});

test('joystick drift page targets the focused search intent', () => {
  const driftPage = fs.readFileSync(path.join(root, 'src/pages/stick-drift-test/index.astro'), 'utf8');
  const guide = fs.readFileSync(path.join(root, 'src/components/JoystickDriftGuide.astro'), 'utf8');
  assert.match(driftPage, /title="Joystick Drift Test Online/);
  assert.match(driftPage, /description="Free joystick drift test online/);
  assert.match(driftPage, /<ToolPage title="Joystick Drift Test Online"/);
  assert.match(driftPage, /<JoystickDriftGuide \/>/);
  assert.match(guide, /How this joystick drift test works/);
  assert.match(guide, /href="\/gamepad-calibration\/"/);
  assert.match(guide, /href="\/controllers\/"/);
});

test('layout emits BreadcrumbList and ItemList schema', () => {
  const layout = fs.readFileSync(path.join(root, 'src/layouts/BaseLayout.astro'), 'utf8');
  const site = fs.readFileSync(path.join(root, 'src/data/site.ts'), 'utf8');
  assert.match(layout, /'@type': 'BreadcrumbList'/);
  assert.match(layout, /'@type': 'ItemList'/);
  assert.match(layout, /<Breadcrumbs trail=\{trail\} \/>/);
  // Home is the only crumb on top-level pages, so nothing should render there.
  assert.match(layout, /trail\.length > 1/);
  assert.match(site, /export const resolveBreadcrumbs/);
});

test('catalog index pages expose their entries as an ItemList', () => {
  for (const file of ['src/pages/controllers/index.astro', 'src/pages/controller-adapters/index.astro', 'src/pages/tools/index.astro']) {
    assert.match(fs.readFileSync(path.join(root, file), 'utf8'), /itemList=\{itemList\}/, file);
  }
});

test('detail pages pass a two-level breadcrumb trail', () => {
  assert.match(fs.readFileSync(path.join(root, 'src/pages/controllers/[slug].astro'), 'utf8'), /breadcrumbs=\{\[\{ name: 'Controllers'/);
  assert.match(fs.readFileSync(path.join(root, 'src/pages/controller-adapters/[slug].astro'), 'utf8'), /breadcrumbs=\{\[\{ name: 'Adapters'/);
});

test('device profiles do not compete with their dedicated test page', () => {
  const profile = fs.readFileSync(path.join(root, 'src/pages/controllers/[slug].astro'), 'utf8');
  assert.match(profile, /const hasOwnToolPage = controller\.testHref !== '\/'/);
  assert.match(profile, /Compatibility & Browser Mapping/);
});

test('homepage links into the adapter cluster with exact-match anchors', () => {
  const homepage = fs.readFileSync(path.join(root, 'src/pages/index.astro'), 'utf8');
  const directions = fs.readFileSync(path.join(root, 'src/components/AdapterDirections.astro'), 'utf8');
  assert.match(homepage, /<AdapterDirections \/>/);
  for (const slug of ['bluetooth-to-usb-gamepad-adapter', 'usb-to-gamecube-adapter', 'multi-console-controller-adapter']) {
    assert.match(directions, new RegExp(slug), slug);
  }
  // Anchor text is the short keyword, not the whole card body.
  assert.match(directions, /\{adapter\.anchor\}<\/a>/);
});

test('cards expose the title as anchor text instead of wrapping the whole block', () => {
  for (const file of ['src/components/AdapterCard.astro', 'src/components/ControllerCard.astro', 'src/components/ToolPage.astro', 'src/components/FeatureCards.astro', 'src/components/WhatIsGamepadTester.astro', 'src/components/AdapterDirections.astro', 'src/pages/controllers/[slug].astro', 'src/pages/controller-adapters/[slug].astro']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.match(source, /class="catalog-card-link"/, file);
    assert.doesNotMatch(source, /<a\s[^>]*class="[^"]*(catalog-card|related-card|feature-card|ecosystem-link|explainer-link)(?![-\w])/, file);
  }
  // The stretched-link overlay keeps the whole card clickable without widening the anchor text.
  assert.match(fs.readFileSync(path.join(root, 'src/styles/global.css'), 'utf8'), /\.catalog-card-link::after\{[^}]*inset:0/);
});

test('the about page is reachable from every page', () => {
  assert.match(fs.readFileSync(path.join(root, 'src/components/Footer.astro'), 'utf8'), /href="\/about\/"/);
  assert.match(fs.readFileSync(path.join(root, 'src/components/WhatIsGamepadTester.astro'), 'utf8'), /href="\/about\/"/);
});

test('adapter pairings are declared once and no adapter is left without sibling links', () => {
  const controllers = fs.readFileSync(path.join(root, 'src/data/controller-library.ts'), 'utf8');
  const profile = fs.readFileSync(path.join(root, 'src/pages/controllers/[slug].astro'), 'utf8');
  const guide = fs.readFileSync(path.join(root, 'src/pages/controller-adapters/[slug].astro'), 'utf8');
  assert.doesNotMatch(controllers, /adapterSlugs/);
  assert.match(profile, /adapter\.relatedControllers\.includes\(controller\.slug\)/);
  assert.match(guide, /item\.category !== adapter\.category/);
});

test('every adapter profile carries the expanded guide content', () => {
  const source = fs.readFileSync(path.join(root, 'src/data/adapter-library.ts'), 'utf8');
  const data = source.slice(source.indexOf('export const ADAPTERS'));
  assert.equal((data.match(/slug: '[a-z0-9-]+'/g) ?? []).length, 6);
  for (const field of ['anchor:', 'howItWorks:', 'latency:', 'verify:', 'faqs:']) {
    assert.equal(data.split(field).length - 1, 6, field);
  }
  assert.equal(data.split('question:').length - 1, 18);
});

test('adapter guides publish the expanded sections and their own FAQ schema', () => {
  const page = fs.readFileSync(path.join(root, 'src/pages/controller-adapters/[slug].astro'), 'utf8');
  assert.match(page, /faqs=\{adapter\.faqs\}/);
  assert.match(page, /\{adapter\.howItWorks\}/);
  assert.match(page, /\{adapter\.latency\}/);
  assert.match(page, /adapter\.verify\.map/);
  assert.match(page, /href="\/polling-rate-test\/"/);
});

test('the about page carries the read-only trust angle', () => {
  const page = fs.readFileSync(path.join(root, 'src/pages/about.astro'), 'utf8');
  assert.match(page, /Why we never write to your controller/);
  assert.match(page, /faqs=\{faqs\}/);
});

test('tools hub groups controller, keyboard and mouse diagnostics', () => {
  const tools = fs.readFileSync(path.join(root, 'src/pages/tools/index.astro'), 'utf8');
  const site = fs.readFileSync(path.join(root, 'src/data/site.ts'), 'utf8');
  const homepage = fs.readFileSync(path.join(root, 'src/pages/index.astro'), 'utf8');
  assert.match(tools, /TOOL_CATEGORIES/);
  assert.match(site, /\/keyboard-latency-test\//);
  assert.match(site, /\/mouse-dpi-test\//);
  assert.match(homepage, /<h1>Gamepad Tester Online<\/h1>/);
});

test('keyboard latency and mouse DPI pages keep local-only diagnostics', () => {
  const keyboard = fs.readFileSync(path.join(root, 'src/pages/keyboard-latency-test/index.astro'), 'utf8');
  const mouse = fs.readFileSync(path.join(root, 'src/pages/mouse-dpi-test/index.astro'), 'utf8');
  const script = fs.readFileSync(path.join(root, 'src/scripts/input-diagnostics.js'), 'utf8');
  assert.match(keyboard, /<h1>Keyboard Latency Test<\/h1>/);
  assert.match(keyboard, /title="Keyboard Latency Test/);
  assert.match(mouse, /<h1>Mouse DPI Test<\/h1>/);
  assert.match(mouse, /title="Mouse DPI Test/);
  assert.match(script, /keydown/);
  assert.match(script, /pixels \/ inches|travel \/ inches/);
  assert.doesNotMatch(mouse, /mouse polling rate test/i);
});
