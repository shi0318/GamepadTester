// Last date each page's visible content changed, used as <lastmod> in the sitemap.
// Kept static on purpose: Cloudflare Pages builds from a shallow clone, so git history
// is not available at build time. When you change a page's copy or layout (not just a
// shared header/footer link), update its date here; the sitemap test fails if a built
// page has no entry or an entry points at a page that no longer exists.
//
// Initial values came from building every commit and recording the last one in which
// the page's <main> text, <title> or meta description changed.
export const PAGE_LASTMOD = {
  '/': '2026-09-04',
  '/about/': '2026-11-07',
  '/button-test/': '2026-11-07',
  '/contact/': '2026-11-07',
  '/controller-adapters/': '2026-11-07',
  '/controller-adapters/bluetooth-to-usb-gamepad-adapter/': '2026-09-04',
  '/controller-adapters/multi-console-controller-adapter/': '2026-09-04',
  '/controller-adapters/usb-to-db9-adapter/': '2026-09-04',
  '/controller-adapters/usb-to-gamecube-adapter/': '2026-09-04',
  '/controller-adapters/usb-to-n64-adapter/': '2026-09-04',
  '/controller-adapters/usb-to-retro-console-adapter/': '2026-09-04',
  '/controllers/': '2026-11-07',
  '/controllers/8bitdo-pro-2/': '2026-11-07',
  '/controllers/generic-usb-gamepad/': '2026-11-07',
  '/controllers/logitech-f310/': '2026-11-07',
  '/controllers/ps5-dualsense/': '2026-11-07',
  '/controllers/switch-pro-controller/': '2026-11-07',
  '/controllers/xbox-series-controller/': '2026-11-07',
  '/gamepad-calibration/': '2026-11-07',
  '/gamepad-not-detected/': '2026-11-07',
  '/keyboard-latency-test/': '2026-09-21',
  '/keyboard-test/': '2026-09-21',
  '/mouse-button-test/': '2026-11-07',
  '/mouse-double-click-test/': '2026-11-07',
  '/mouse-dpi-test/': '2026-09-21',
  '/polling-rate-test/': '2026-11-07',
  '/privacy-policy/': '2026-11-07',
  '/ps5-controller-test/': '2026-11-07',
  '/stick-drift-fix/': '2026-11-07',
  '/stick-drift-test/': '2026-11-07',
  '/switch-controller-test/': '2026-11-07',
  '/terms/': '2026-11-07',
  '/tools/': '2026-09-21',
  '/trigger-test/': '2026-11-07',
  '/vibration-test/': '2026-11-07',
  '/xbox-controller-test/': '2026-11-07',
};
