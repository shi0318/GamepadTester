export const SITE = {
  name: 'Gamepad Tester',
  url: import.meta.env.PUBLIC_SITE_URL || 'https://checkgamepad.com',
  description: 'A free browser-based gamepad tester for practical button, stick, trigger and vibration diagnostics using the standard Gamepad API.',
};

export const NAVIGATION = [
  { href: '/', label: 'Tester' },
  { href: '/stick-drift-test/', label: 'Drift test' },
  { href: '/controllers/', label: 'Controllers' },
  { href: '/controller-adapters/', label: 'Adapters' },
  { href: '/tools/', label: 'All tools' },
];

export const TOOL_PAGES = [
  { href: '/stick-drift-test/', label: 'Stick drift test', kicker: 'Analog diagnostics', description: 'Measure stick center offset, deadzone, jitter and unwanted movement.' },
  { href: '/gamepad-calibration/', label: 'Gamepad calibration', kicker: 'Analog diagnostics', description: 'Set a browser-side center reference and check stick range without changing controller firmware.' },
  { href: '/button-test/', label: 'Button test', kicker: 'Input diagnostics', description: 'Check every button, D-pad direction, bumper and trigger response.' },
  { href: '/vibration-test/', label: 'Vibration test', kicker: 'Haptic diagnostics', description: 'Test supported light, heavy, burst and pulse rumble patterns.' },
  { href: '/trigger-test/', label: 'Trigger test', kicker: 'Analog diagnostics', description: 'Inspect the full 0–1 range and pressure response of LT and RT.' },
  { href: '/polling-rate-test/', label: 'Polling rate test', kicker: 'Performance diagnostics', description: 'Estimate the browser sample rate for wired and wireless input.' },
  { href: '/ps5-controller-test/', label: 'PS5 controller test', kicker: 'Device test', description: 'Test DualSense buttons, sticks, triggers and supported rumble.' },
  { href: '/xbox-controller-test/', label: 'Xbox controller test', kicker: 'Device test', description: 'Test Xbox and XInput-style controllers in your browser.' },
  { href: '/switch-controller-test/', label: 'Switch controller test', kicker: 'Device test', description: 'Check Switch Pro, Joy-Con and compatible Bluetooth controllers.' },
];

export const CONTROLLER_LIBRARY_LINKS = [
  { href: '/controllers/', label: 'Controller compatibility', description: 'Check connection modes, browser mappings, supported inputs and common quirks.' },
  { href: '/controller-adapters/', label: 'Controller adapters', description: 'Find the right USB, Bluetooth or retro-console adapter direction.' },
];

export const FAQS = [
  { question: 'Why is my controller not detected?', answer: 'Connect the controller before opening the page, then press any button or move a stick. If it still does not appear, try a USB cable, close Steam or other controller software, and reload the browser.' },
  { question: 'Does this work with PS5, Xbox and Switch?', answer: 'Many modern Xbox, PlayStation, Switch Pro and generic USB or Bluetooth controllers expose standard inputs through the Gamepad API. The operating system must connect the controller first; this site cannot pair Bluetooth or install drivers.' },
  { question: 'Why does vibration not work?', answer: 'Rumble support depends on your browser, operating system, connection type and controller. Chrome or Edge on Windows typically provide the broadest support.' },
  { question: 'Can this prove that my controller is broken?', answer: 'No. The tester shows the signals exposed by your browser. It is useful for finding dead buttons, stick drift and missing rumble, but results can vary by browser, operating system, connection and driver.' },
];
