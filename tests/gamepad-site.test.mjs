import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

test('Astro routes and shared components exist', () => {
  for (const file of ['astro.config.mjs', 'public/gamepad-tester-logo.svg', 'public/gamepad-tester-favicon.svg', 'src/layouts/BaseLayout.astro', 'src/components/GamepadBench.astro', 'src/scripts/gamepad-tester.js', 'src/data/controller-library.ts', 'src/data/adapter-library.ts', 'src/components/ControllerCard.astro', 'src/components/AdapterCard.astro', 'src/pages/index.astro', 'src/pages/404.astro', 'src/pages/tools/index.astro', 'src/pages/controllers/index.astro', 'src/pages/controllers/[slug].astro', 'src/pages/controller-adapters/index.astro', 'src/pages/controller-adapters/[slug].astro', 'src/pages/stick-drift-test/index.astro', 'src/pages/gamepad-calibration/index.astro', 'src/pages/button-test/index.astro', 'src/pages/vibration-test/index.astro', 'src/pages/ps5-controller-test/index.astro', 'src/pages/xbox-controller-test/index.astro', 'src/pages/switch-controller-test/index.astro', 'src/pages/gamepad-not-detected/index.astro']) assert.equal(fs.existsSync(path.join(root, file)), true, file);
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
