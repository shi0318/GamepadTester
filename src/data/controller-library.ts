export interface ControllerProfile {
  slug: string;
  name: string;
  maker: string;
  category: 'Modern' | 'Retro' | 'Generic';
  connection: string;
  protocol: string;
  platforms: string[];
  summary: string;
  inputs: string[];
  outputs: string[];
  browserMapping: string;
  quirks: string[];
  testHref: string;
}

export const CONTROLLERS: ControllerProfile[] = [
  {
    slug: 'ps5-dualsense',
    name: 'PS5 DualSense',
    maker: 'Sony',
    category: 'Modern',
    connection: 'USB-C or Bluetooth',
    protocol: 'HID / browser mapping varies',
    platforms: ['PS5', 'Windows', 'macOS', 'Linux', 'Steam'],
    summary: 'A feature-rich PlayStation controller with two sticks, analog L2/R2 triggers, touchpad and motion hardware.',
    inputs: ['Face buttons', 'D-pad', 'L1/R1', 'L2/R2', 'Two sticks', 'Touchpad button'],
    outputs: ['Rumble may be available', 'Advanced haptics are not exposed consistently'],
    browserMapping: 'The browser can expose the standard buttons and axes, but the exact mapping depends on USB/Bluetooth mode, browser and operating system.',
    quirks: ['Adaptive triggers and full touchpad coordinates are not guaranteed through the standard Gamepad API.', 'USB is usually the easiest connection to troubleshoot.'],
    testHref: '/ps5-controller-test/',
  },
  {
    slug: 'xbox-series-controller',
    name: 'Xbox Series controller',
    maker: 'Microsoft',
    category: 'Modern',
    connection: 'USB-C, Bluetooth or Xbox Wireless adapter',
    protocol: 'XInput / browser mapping varies',
    platforms: ['Xbox', 'Windows', 'macOS', 'Linux', 'Steam'],
    summary: 'A common XInput-style controller with a reliable button layout, analog triggers and broad PC game support.',
    inputs: ['A/B/X/Y', 'D-pad', 'LB/RB', 'LT/RT', 'Two sticks', 'Menu/View'],
    outputs: ['Dual-motor rumble may be available'],
    browserMapping: 'Windows commonly exposes a standard mapping, while Bluetooth, Linux and third-party drivers can change button names or ordering.',
    quirks: ['The Xbox Wireless adapter is different from ordinary Bluetooth and may need its own Windows support.', 'Test LT/RT as analog inputs instead of only checking whether they click.'],
    testHref: '/xbox-controller-test/',
  },
  {
    slug: 'switch-pro-controller',
    name: 'Nintendo Switch Pro Controller',
    maker: 'Nintendo',
    category: 'Modern',
    connection: 'USB-C or Bluetooth',
    protocol: 'HID / browser mapping varies',
    platforms: ['Nintendo Switch', 'Windows', 'macOS', 'Linux', 'Steam'],
    summary: 'A full-size Nintendo controller with motion hardware, HD rumble and a familiar A/B/X/Y layout.',
    inputs: ['A/B/X/Y', 'D-pad', 'L/R', 'ZL/ZR', 'Two sticks', 'Home/Capture'],
    outputs: ['Rumble may be available', 'Motion and NFC are outside this tester'],
    browserMapping: 'Some browsers and games normalize the Nintendo layout; others expose the physical button order. Use the live button matrix to verify it.',
    quirks: ['The A/B and X/Y labels can feel reversed when a browser or game uses an Xbox-style logical mapping.', 'Bluetooth support can differ between browsers.'],
    testHref: '/switch-controller-test/',
  },
  {
    slug: '8bitdo-pro-2',
    name: '8BitDo Pro 2',
    maker: '8BitDo',
    category: 'Modern',
    connection: 'Bluetooth, 2.4G or USB',
    protocol: 'XInput, DInput or Switch mode',
    platforms: ['Windows', 'macOS', 'Linux', 'Switch', 'Android', 'iOS'],
    summary: 'A multi-mode controller whose physical mode switch can change the mapping seen by the browser and by games.',
    inputs: ['Face buttons', 'D-pad', 'L1/R1', 'L2/R2', 'Two sticks', 'Back buttons'],
    outputs: ['Rumble depends on the selected mode and connection'],
    browserMapping: 'Select the mode intended for the host before testing. XInput mode is usually the most predictable on Windows.',
    quirks: ['Changing modes can make the same physical controller appear as a different device.', 'Back buttons may not appear in the standard Gamepad API mapping.'],
    testHref: '/',
  },
  {
    slug: 'logitech-f310',
    name: 'Logitech F310',
    maker: 'Logitech',
    category: 'Generic',
    connection: 'USB',
    protocol: 'XInput or DirectInput switch',
    platforms: ['Windows', 'macOS', 'Linux', 'RetroArch'],
    summary: 'A wired PC gamepad with a physical XInput/DirectInput switch, useful for checking how protocol mode changes detection.',
    inputs: ['Face buttons', 'D-pad', 'Bumpers', 'Triggers', 'Two sticks', 'Stick clicks'],
    outputs: ['No vibration on the basic F310 model'],
    browserMapping: 'XInput mode generally provides the most familiar standard mapping. DirectInput mode may expose a different button order.',
    quirks: ['Move the physical X/D switch before opening a game or refreshing the tester.', 'A missing rumble actuator is normal for this model, not necessarily a browser failure.'],
    testHref: '/',
  },
  {
    slug: 'generic-usb-gamepad',
    name: 'Generic USB gamepad',
    maker: 'Various manufacturers',
    category: 'Generic',
    connection: 'USB',
    protocol: 'USB HID / DirectInput',
    platforms: ['Windows', 'macOS', 'Linux', 'Browser games'],
    summary: 'A practical profile for no-name and budget controllers whose browser name or button layout does not match a known brand.',
    inputs: ['Button matrix', 'D-pad', 'Sticks when present', 'Triggers when exposed'],
    outputs: ['Usually no rumble guarantee'],
    browserMapping: 'Use the live matrix and raw API panel as the source of truth. Generic HID devices often expose physical indexes rather than console labels.',
    quirks: ['Some devices only appear after pressing a button.', 'A controller can be visible to Windows but hidden from the browser if another application has taken exclusive control.'],
    testHref: '/',
  },
];

export const getController = (slug: string) => CONTROLLERS.find((controller) => controller.slug === slug);
