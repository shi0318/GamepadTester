export interface AdapterProfile {
  slug: string;
  name: string;
  category: string;
  input: string;
  output: string;
  target: string;
  summary: string;
  bestFor: string[];
  checkBeforeBuying: string[];
  relatedControllers: string[];
}

export const ADAPTERS: AdapterProfile[] = [
  {
    slug: 'bluetooth-to-usb-gamepad-adapter',
    name: 'Bluetooth to USB gamepad adapter',
    category: 'Wireless bridge',
    input: 'Bluetooth controller',
    output: 'USB HID gamepad',
    target: 'PC, console or USB host',
    summary: 'Use a Bluetooth PlayStation, Xbox or Switch controller on a host that only accepts a standard USB gamepad.',
    bestFor: ['Old PCs or consoles without Bluetooth', 'Reducing Bluetooth pairing complexity on a USB-only host', 'Connecting several known controller families'],
    checkBeforeBuying: ['Exact controller models and modes supported', 'Whether rumble, motion and analog triggers pass through', 'Pairing limits and whether the adapter needs a setup button'],
    relatedControllers: ['ps5-dualsense', 'xbox-series-controller', 'switch-pro-controller', '8bitdo-pro-2'],
  },
  {
    slug: 'usb-to-gamecube-adapter',
    name: 'USB to GameCube / Wii adapter',
    category: 'Retro console bridge',
    input: 'USB HID controller',
    output: 'GameCube controller port protocol',
    target: 'Nintendo GameCube or compatible Wii software',
    summary: 'Translate a modern USB controller into the native protocol expected by a GameCube or Wii controller port.',
    bestFor: ['Using a modern pad on GameCube', 'Using arcade sticks or accessibility controllers on compatible hardware', 'Preserving analog input where the adapter supports it'],
    checkBeforeBuying: ['GameCube vs Wii compatibility and required software mode', 'Rumble and analog trigger support', 'Whether calibration and per-game profiles are included'],
    relatedControllers: ['switch-pro-controller', 'logitech-f310', 'generic-usb-gamepad'],
  },
  {
    slug: 'usb-to-n64-adapter',
    name: 'USB to N64 adapter',
    category: 'Retro console bridge',
    input: 'USB or Bluetooth controller',
    output: 'Nintendo 64 controller port protocol',
    target: 'Nintendo 64',
    summary: 'Connect a current controller to a real N64 while translating the stick, buttons and optional rumble behavior.',
    bestFor: ['Modern wireless controllers on N64', 'Replacing a worn N64 controller for casual play', 'Testing alternate button layouts'],
    checkBeforeBuying: ['N64 region and console revision compatibility', 'Analog stick range and deadzone behavior', 'Rumble Pak support and number of players'],
    relatedControllers: ['switch-pro-controller', '8bitdo-pro-2', 'generic-usb-gamepad'],
  },
  {
    slug: 'usb-to-retro-console-adapter',
    name: 'USB HID to retro console adapter',
    category: 'Multi-platform retro bridge',
    input: 'USB HID controller',
    output: 'Console-specific protocol',
    target: 'Neo Geo, PC Engine, 3DO and other retro hosts',
    summary: 'A family of protocol adapters for using modern USB pads, mice or arcade sticks with systems that pre-date USB.',
    bestFor: ['One modern controller across several retro systems', 'Arcade sticks and accessibility devices', 'Systems that use DB9 or proprietary controller ports'],
    checkBeforeBuying: ['The exact console output and connector', 'Button count, turbo, mouse or multitap modes', 'Whether the adapter is firmware-updatable and how profiles are saved'],
    relatedControllers: ['8bitdo-pro-2', 'logitech-f310', 'generic-usb-gamepad'],
  },
  {
    slug: 'usb-to-db9-adapter',
    name: 'USB to DB9 gamepad adapter',
    category: 'Classic computer bridge',
    input: 'USB HID controller or mouse',
    output: 'DB9 joystick protocol',
    target: 'Amiga, Atari, Commodore and similar computers',
    summary: 'Bring USB controllers to classic computers that use a DB9 joystick or mouse port.',
    bestFor: ['Classic computer collections', 'USB arcade sticks on DB9 systems', 'Using a modern mouse with a vintage computer'],
    checkBeforeBuying: ['The exact DB9 pinout and supported computer family', 'Joystick vs mouse mode', 'Whether autofire, multiple buttons or paddles are supported'],
    relatedControllers: ['generic-usb-gamepad', 'logitech-f310'],
  },
  {
    slug: 'multi-console-controller-adapter',
    name: 'Multi-console controller adapter',
    category: 'Cross-platform bridge',
    input: 'USB, Bluetooth or controller-specific input',
    output: 'Several console protocols',
    target: 'Modern and retro consoles',
    summary: 'A configurable adapter aimed at people who want one controller to work across several console families.',
    bestFor: ['Mixed modern and retro setups', 'Profiles for different games', 'Remapping buttons for accessibility or comfort'],
    checkBeforeBuying: ['The supported output modes and firmware version', 'Input latency claims and independent testing', 'How remapping, macros and updates are handled'],
    relatedControllers: ['ps5-dualsense', 'xbox-series-controller', 'switch-pro-controller', '8bitdo-pro-2'],
  },
];

export const getAdapter = (slug: string) => ADAPTERS.find((adapter) => adapter.slug === slug);
