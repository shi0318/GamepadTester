export const SITE = {
  name: 'Gamepad Tester',
  url: import.meta.env.PUBLIC_SITE_URL || 'https://checkgamepad.com',
  description: 'A free browser-based gamepad tester for practical button, stick, trigger and vibration diagnostics using the standard Gamepad API.',
};

export const NAVIGATION = [
  { href: '/', label: 'Tester' },
  { href: '/stick-drift-test/', label: 'Joystick drift' },
  { href: '/controllers/', label: 'Controllers' },
  { href: '/controller-adapters/', label: 'Adapters' },
  { href: '/tools/', label: 'All tools' },
];

export type ToolCategory = 'controller' | 'keyboard' | 'mouse';

export const TOOL_PAGES = [
  { href: '/stick-drift-test/', label: 'Joystick drift test', kicker: 'Analog diagnostics', category: 'controller' as const, description: 'Check joystick center offset, deadzone, jitter and unwanted movement.' },
  { href: '/gamepad-calibration/', label: 'Gamepad calibration', kicker: 'Analog diagnostics', category: 'controller' as const, description: 'Set a browser-side center reference and check stick range without changing controller firmware.' },
  { href: '/button-test/', label: 'Button test', kicker: 'Input diagnostics', category: 'controller' as const, description: 'Check every button, D-pad direction, bumper and trigger response.' },
  { href: '/vibration-test/', label: 'Vibration test', kicker: 'Haptic diagnostics', category: 'controller' as const, description: 'Test supported light, heavy, burst and pulse rumble patterns.' },
  { href: '/trigger-test/', label: 'Trigger test', kicker: 'Analog diagnostics', category: 'controller' as const, description: 'Inspect the full 0–1 range and pressure response of LT and RT.' },
  { href: '/polling-rate-test/', label: 'Polling rate test', kicker: 'Performance diagnostics', category: 'controller' as const, description: 'Estimate the browser sample rate for wired and wireless input.' },
  { href: '/ps5-controller-test/', label: 'PS5 controller test', kicker: 'Device test', category: 'controller' as const, description: 'Test DualSense buttons, sticks, triggers and supported rumble.' },
  { href: '/xbox-controller-test/', label: 'Xbox controller test', kicker: 'Device test', category: 'controller' as const, description: 'Test Xbox and XInput-style controllers in your browser.' },
  { href: '/switch-controller-test/', label: 'Switch controller test', kicker: 'Device test', category: 'controller' as const, description: 'Check Switch Pro, Joy-Con and compatible Bluetooth controllers.' },
  { href: '/keyboard-latency-test/', label: 'Keyboard latency test', kicker: 'Keyboard diagnostics', category: 'keyboard' as const, description: 'Measure the interval between a key press and the browser keydown event.' },
  { href: '/keyboard-test/', label: 'Keyboard tester', kicker: 'Keyboard diagnostics', category: 'keyboard' as const, description: 'Light up every key, including ghosting and rollover checks, in the browser.' },
  { href: '/mouse-dpi-test/', label: 'Mouse DPI test', kicker: 'Mouse diagnostics', category: 'mouse' as const, description: 'Estimate mouse DPI from a measured on-screen travel distance in your browser.' },
  { href: '/mouse-button-test/', label: 'Mouse button test', kicker: 'Mouse diagnostics', category: 'mouse' as const, description: 'Check left, right, middle and extra mouse buttons without installing software.' },
  { href: '/mouse-double-click-test/', label: 'Mouse double click test', kicker: 'Mouse diagnostics', category: 'mouse' as const, description: 'See whether one physical click registers as two button events.' },
];

export const TOOL_CATEGORIES: { id: ToolCategory; label: string; kicker: string; description: string }[] = [
  { id: 'controller', label: 'Controllers', kicker: 'Gamepad diagnostics', description: 'Button, stick, trigger, rumble and device tests for USB and Bluetooth controllers.' },
  { id: 'keyboard', label: 'Keyboards', kicker: 'Keyboard diagnostics', description: 'Keyboard tester and latency checks that stay on this machine.' },
  { id: 'mouse', label: 'Mice', kicker: 'Mouse diagnostics', description: 'Button, double-click and DPI checks from local mouse movement.' },
];

export const CONTROLLER_LIBRARY_LINKS = [
  { href: '/controllers/', label: 'Controller compatibility', description: 'Check connection modes, browser mappings, supported inputs and common quirks.' },
  { href: '/controller-adapters/', label: 'Controller adapters', description: 'Find the right USB, Bluetooth or retro-console adapter direction.' },
];

export interface Crumb {
  name: string;
  path: string;
}

const STANDALONE_LABELS: Record<string, string> = {
  '/tools/': 'All tools',
  '/controllers/': 'Controllers',
  '/controller-adapters/': 'Adapters',
  '/gamepad-not-detected/': 'Controller not detected',
  '/about/': 'About',
  '/privacy-policy/': 'Privacy policy',
  '/keyboard-latency-test/': 'Keyboard latency test',
  '/keyboard-test/': 'Keyboard tester',
  '/mouse-dpi-test/': 'Mouse DPI test',
  '/mouse-button-test/': 'Mouse button test',
  '/mouse-double-click-test/': 'Mouse double click test',
};

/** Breadcrumb trail for a path, excluding the implicit Home entry. */
export const resolveBreadcrumbs = (pathname: string): Crumb[] => {
  const tool = TOOL_PAGES.find((item) => item.href === pathname);
  if (tool) return [{ name: 'All tools', path: '/tools/' }, { name: tool.label, path: tool.href }];
  const label = STANDALONE_LABELS[pathname];
  return label ? [{ name: label, path: pathname }] : [];
};

export const FAQS = [
  { question: 'Why is my controller not detected?', answer: 'Connect the controller before opening the page, then press any button or move a stick. If it still does not appear, try a USB cable, close Steam or other controller software, and reload the browser.' },
  { question: 'Does this work with PS5, Xbox and Switch?', answer: 'Many modern Xbox, PlayStation, Switch Pro and generic USB or Bluetooth controllers expose standard inputs through the Gamepad API. The operating system must connect the controller first; this site cannot pair Bluetooth or install drivers.' },
  { question: 'Why does vibration not work?', answer: 'Rumble support depends on your browser, operating system, connection type and controller. Chrome or Edge on Windows typically provide the broadest support.' },
  { question: 'Can this prove that my controller is broken?', answer: 'No. The tester shows the signals exposed by your browser. It is useful for finding dead buttons, stick drift and missing rumble, but results can vary by browser, operating system, connection and driver.' },
];

export const SISTER_SITES = [
  { href: 'https://click-speed-test.net/', name: 'CPS Test', note: 'Measure click speed in your browser.' },
  { href: 'https://reactiontimetest.fun/', name: 'Reaction Time Test', note: 'A five-round visual reaction test.' },
];
