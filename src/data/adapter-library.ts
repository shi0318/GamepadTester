export interface AdapterProfile {
  slug: string;
  name: string;
  /** Short exact-match anchor text for internal links, so cards and lists do not bury the keyword. */
  anchor: string;
  category: string;
  input: string;
  output: string;
  target: string;
  summary: string;
  /** How the protocol translation actually happens, in plain terms. */
  howItWorks: string;
  /** Where delay comes from on this direction, and what to watch instead. */
  latency: string;
  bestFor: string[];
  checkBeforeBuying: string[];
  /** Checks a reader can run with this site's tester before or after buying. */
  verify: string[];
  faqs: { question: string; answer: string }[];
  relatedControllers: string[];
}

export const ADAPTERS: AdapterProfile[] = [
  {
    slug: 'bluetooth-to-usb-gamepad-adapter',
    name: 'Bluetooth to USB gamepad adapter',
    anchor: 'Bluetooth to USB gamepad adapter',
    category: 'Wireless bridge',
    input: 'Bluetooth controller',
    output: 'USB HID gamepad',
    target: 'PC, console or USB host',
    summary: 'Use a Bluetooth PlayStation, Xbox or Switch controller on a host that only accepts a standard USB gamepad.',
    howItWorks:
      'The adapter is the Bluetooth host, not your PC or console. It pairs with the controller, decodes that specific controller’s report format, then presents itself to the target machine as a plain USB HID gamepad. Because the translation happens inside the adapter, the host never sees a PlayStation, Xbox or Switch pad — it sees whatever generic device the adapter advertises. That is why support is listed per controller family rather than as a blanket claim: every source pad needs its own decoder in the adapter firmware.',
    latency:
      'Each translation step costs time. The adapter waits for a Bluetooth report, decodes it, then waits for the host’s next USB poll before the value moves on. A well-built adapter adds a small, consistent delay; a poor one adds a variable delay, which is more noticeable in play than a slightly larger fixed one. Treat vendor latency figures as marketing until an independent measurement backs them up.',
    bestFor: ['Old PCs or consoles without Bluetooth', 'Reducing Bluetooth pairing complexity on a USB-only host', 'Connecting several known controller families'],
    checkBeforeBuying: ['Exact controller models and modes supported', 'Whether rumble, motion and analog triggers pass through', 'Pairing limits and whether the adapter needs a setup button'],
    verify: [
      'Plug the controller straight into a PC first and confirm every input on the button test. A fault that exists without the adapter is not an adapter problem.',
      'Repeat the same check through the adapter and compare button numbers. A shifted matrix means the adapter advertises a different layout than the pad does natively.',
      'Watch the mapping field in the raw API panel. "standard" over direct USB but blank through the adapter tells you the host no longer recognises the layout.',
      'Run the polling rate test on both paths. A large drop through the adapter is the clearest available sign of added input lag.',
    ],
    faqs: [
      { question: 'Will rumble still work through a Bluetooth to USB adapter?', answer: 'Only if the adapter both accepts a rumble command from the host and re-encodes it for the source controller. Many adapters advertise input support but quietly drop force feedback, and a browser can only send rumble to a device that exposes an actuator. Run the vibration test with the adapter in place before assuming the motor is dead.' },
      { question: 'Can one adapter handle a DualSense, an Xbox pad and a Switch Pro Controller?', answer: 'Some can, because each controller family needs its own decoder in the firmware rather than a generic Bluetooth profile. Look for a printed list of supported models and a firmware update path, and check whether switching families needs a mode button or a held combination.' },
      { question: 'Does the adapter change Bluetooth range or pairing?', answer: 'The adapter replaces your host as the Bluetooth endpoint, so range depends on its own radio and where it sits. The same dongle performs worse behind a metal case than on a front port or a short extension. Pairing usually happens once against the adapter instead of against the operating system.' },
    ],
    relatedControllers: ['ps5-dualsense', 'xbox-series-controller', 'switch-pro-controller', '8bitdo-pro-2'],
  },
  {
    slug: 'usb-to-gamecube-adapter',
    name: 'USB to GameCube / Wii adapter',
    anchor: 'USB to GameCube adapter',
    category: 'Retro console bridge',
    input: 'USB HID controller',
    output: 'GameCube controller port protocol',
    target: 'Nintendo GameCube or compatible Wii software',
    summary: 'Translate a modern USB controller into the native protocol expected by a GameCube or Wii controller port.',
    howItWorks:
      'A GameCube controller port is not USB. The console polls the controller over a single bidirectional data line and expects a fixed reply frame carrying two analog sticks, two analog triggers and the digital buttons. The adapter reads your USB pad on its own schedule and synthesises that reply whenever the console asks. Direction matters here: this converts a USB controller for a GameCube port, which is the opposite of the far more common GameCube-controller-to-USB adapters sold for PC and Switch use.',
    latency:
      'The console sets the polling cadence, so the adapter must always have a fresh value ready. Because it samples your USB pad independently, one extra frame of uncertainty is possible in the worst case. For most games that is invisible; for frame-critical play it is worth measuring rather than assuming.',
    bestFor: ['Using a modern pad on GameCube', 'Using arcade sticks or accessibility controllers on compatible hardware', 'Preserving analog input where the adapter supports it'],
    checkBeforeBuying: ['GameCube vs Wii compatibility and required software mode', 'Rumble and analog trigger support', 'Whether calibration and per-game profiles are included'],
    verify: [
      'Confirm both triggers report a full 0–1 sweep on the trigger test. GameCube expects analog triggers, and a pad with digital bumpers cannot supply them.',
      'Check stick range on the joystick drift test. The adapter has to scale your range into the range the console expects, and a badly scaled axis feels like a dead zone or an over-sensitive stick in game.',
      'Count your usable buttons against the GameCube layout before buying, since a pad with fewer will leave something unmapped.',
      'If rumble matters, confirm the adapter forwards the console rumble command — on real hardware the port itself drives the motor.',
    ],
    faqs: [
      { question: 'Is a USB to GameCube adapter the same as a GameCube controller adapter for PC?', answer: 'No, and this is the most common mix-up in the category. The widely sold "GameCube controller adapter" runs the other way, putting original pads onto a USB host. A USB to GameCube adapter does the reverse and puts a modern USB controller on the console port. Check the direction printed on the listing before ordering.' },
      { question: 'Will it work on a Wii as well?', answer: 'Only on Wii models that still have GameCube controller ports, and only with software that reads them. Later Wii revisions and the Wii Mini removed the ports, and Wii U needs a different route entirely. Confirm both the console revision and whether the game you want actually reads a GameCube pad.' },
      { question: 'Do the analog triggers really matter?', answer: 'For several GameCube-era titles, yes. The original trigger has an analog stage and a click at the end, and games use both. An adapter fed by a pad with only digital shoulder buttons has to fake the analog stage, which changes how those games behave.' },
    ],
    relatedControllers: ['switch-pro-controller', 'logitech-f310', 'generic-usb-gamepad'],
  },
  {
    slug: 'usb-to-n64-adapter',
    name: 'USB to N64 adapter',
    anchor: 'USB to N64 adapter',
    category: 'Retro console bridge',
    input: 'USB or Bluetooth controller',
    output: 'Nintendo 64 controller port protocol',
    target: 'Nintendo 64',
    summary: 'Connect a current controller to a real N64 while translating the stick, buttons and optional rumble behavior.',
    howItWorks:
      'The N64 uses the same style of single-wire polled protocol as the GameCube, but with its own report format and a much smaller usable stick range. The adapter answers each console poll with a synthetic N64 report built from your USB or Bluetooth pad. Rumble is not part of that report: on real hardware it comes from a Rumble Pak in the controller expansion slot, so an adapter has to claim a Pak is present and drive a motor of its own for any feedback to appear.',
    latency:
      'As with other console-side bridges the console decides when to ask and the adapter must already hold a value, so timing is rarely where these fail. Stick behaviour is. The original stick reports a narrower numeric range than a modern analog stick, so the adapter has to rescale, and how it treats the edges of your range decides whether the pad feels right.',
    bestFor: ['Modern wireless controllers on N64', 'Replacing a worn N64 controller for casual play', 'Testing alternate button layouts'],
    checkBeforeBuying: ['N64 region and console revision compatibility', 'Analog stick range and deadzone behavior', 'Rumble Pak support and number of players'],
    verify: [
      'Check the circle coverage and range readouts on the joystick drift test. A pad that already reads short will feel worse once the adapter rescales it.',
      'Confirm the stick reports a clean centre. Drift that the adapter scales upward becomes constant movement in game.',
      'Plan the C-button mapping before you commit, because the N64 layout does not line up with a modern face-button cluster.',
      'Ask whether the adapter emulates a Rumble Pak or a Controller Pak, since some games check for one before they will save.',
    ],
    faqs: [
      { question: 'Why does my stick feel too sensitive through an N64 adapter?', answer: 'The original N64 stick reports a smaller numeric range than a modern analog stick, so the adapter has to compress or rescale yours. Mapping your full travel onto the console range linearly turns small movements into large ones in game. Some adapters expose a sensitivity or range profile for exactly this reason.' },
      { question: 'Will rumble work?', answer: 'Only if the adapter emulates a Rumble Pak and carries a motor to drive, because real N64 rumble came from an accessory inside the controller rather than from the console. An adapter with no motor can still report that a Pak is present, which satisfies the game check without producing any feedback.' },
      { question: 'Can I still use save accessories?', answer: 'Games that saved to a Controller Pak need that Pak, or an adapter that emulates one with its own storage. Check this separately from rumble support: they are two different accessories in the same slot, and an adapter can claim one without the other.' },
    ],
    relatedControllers: ['switch-pro-controller', '8bitdo-pro-2', 'generic-usb-gamepad'],
  },
  {
    slug: 'usb-to-retro-console-adapter',
    name: 'USB HID to retro console adapter',
    anchor: 'USB to retro console adapter',
    category: 'Multi-platform retro bridge',
    input: 'USB HID controller',
    output: 'Console-specific protocol',
    target: 'Neo Geo, PC Engine, 3DO and other retro hosts',
    summary: 'A family of protocol adapters for using modern USB pads, mice or arcade sticks with systems that pre-date USB.',
    howItWorks:
      'This is a family rather than a single product. The USB side is standardised: the adapter acts as a USB host, reads a HID gamepad, mouse or arcade stick, and normalises the inputs. The console side is whatever that system expected — Neo Geo uses a DB15 connector, PC Engine an 8-pin mini-DIN with its own multitap convention, 3DO daisy-chains controllers through the pad itself. One board with swappable cables or firmware profiles is what lets a single adapter cover several hosts.',
    latency:
      'These systems polled slowly by modern standards, which leaves an adapter room to work, so timing is rarely the failure mode. Feature coverage is: multitap support, mouse mode, turbo, six-button versus two-button layouts, and per-console button order are where a cheap adapter runs out of road.',
    bestFor: ['One modern controller across several retro systems', 'Arcade sticks and accessibility devices', 'Systems that use DB9 or proprietary controller ports'],
    checkBeforeBuying: ['The exact console output and connector', 'Button count, turbo, mouse or multitap modes', 'Whether the adapter is firmware-updatable and how profiles are saved'],
    verify: [
      'Identify the exact console output and connector first. The same physical plug can carry entirely different protocols between systems.',
      'Confirm your source device is seen as a plain HID gamepad by running it through the full tester and checking the mapping field. Devices that need vendor drivers usually will not work.',
      'Count buttons against the target layout: a two-button host cannot use a modern pad fully, and a six-button host needs the adapter to expose all six.',
      'If you want mouse or multitap mode, check that the exact firmware you are buying includes it rather than a similar model number.',
    ],
    faqs: [
      { question: 'Does a matching connector guarantee compatibility?', answer: 'No — a connector is not a protocol. Sega DB9 controllers multiplex their buttons through a select line, while Atari-standard DB9 joysticks are plain switches to ground. Both use the same 9-pin plug and are not interchangeable. Always match the protocol rather than the shell.' },
      { question: 'Can I use an arcade stick or accessibility controller?', answer: 'Usually yes, provided it presents itself as a standard USB HID device, and that is often the main reason people buy one of these adapters. Check it in the browser tester first: if the buttons and axes appear without extra software, an adapter that expects generic HID is likely to accept it too.' },
      { question: 'Is firmware updatability worth paying for?', answer: 'For a multi-host adapter, generally yes. Support for a specific pad or a specific console quirk usually arrives as a firmware profile, and an adapter with no update path is fixed at whatever it shipped with.' },
    ],
    relatedControllers: ['8bitdo-pro-2', 'logitech-f310', 'generic-usb-gamepad'],
  },
  {
    slug: 'usb-to-db9-adapter',
    name: 'USB to DB9 gamepad adapter',
    anchor: 'USB to DB9 adapter',
    category: 'Classic computer bridge',
    input: 'USB HID controller or mouse',
    output: 'DB9 joystick protocol',
    target: 'Amiga, Atari, Commodore and similar computers',
    summary: 'Bring USB controllers to classic computers that use a DB9 joystick or mouse port.',
    howItWorks:
      'A classic DB9 joystick port is barely a protocol. Up, down, left, right and fire are individual pins pulled to ground by switches, and the computer reads them directly. The adapter reads your USB device and closes those connections electronically. Mouse mode is different work: DB9 mice on Amiga and Atari signal movement as quadrature pulse pairs, so the adapter has to generate correctly timed pulses instead of simply holding a line low.',
    latency:
      'Digital joystick emulation is about as direct as input conversion gets, and the computer reads the port on its own schedule, so added delay is small. The practical risks sit elsewhere: how many buttons the host can actually read, and whether the machine expects a joystick or a mouse on the port you are using.',
    bestFor: ['Classic computer collections', 'USB arcade sticks on DB9 systems', 'Using a modern mouse with a vintage computer'],
    checkBeforeBuying: ['The exact DB9 pinout and supported computer family', 'Joystick vs mouse mode', 'Whether autofire, multiple buttons or paddles are supported'],
    verify: [
      'Check how many buttons your pad exposes on the button test, then check how many the target machine reads. Atari-standard ports read one fire button; some Amiga software reads a second and third.',
      'Decide up front whether you need joystick mode, mouse mode or both, because some adapters implement only one.',
      'Confirm the machine family and the specific port. The same DB9 shell appears on Atari, Commodore, Amiga and Sega hardware with different expectations behind it.',
      'If you plan to use an analog stick, remember the port is digital. The adapter has to threshold your analog input, so check the centre reading on the joystick drift test first.',
    ],
    faqs: [
      { question: 'Will a Sega Genesis controller adapter work on an Amiga?', answer: 'Not reliably. Both use a DB9 connector, but Genesis pads multiplex extra buttons through a select line that Amiga and Atari software does not drive. A three-button Genesis pad often works as a basic one-button joystick and nothing more. Buy for the protocol, not the plug.' },
      { question: 'Can I use a USB mouse on a DB9 mouse port?', answer: 'Some adapters support it by converting USB movement into the quadrature signals a vintage machine expects. It is a separate feature from joystick emulation, so check that the model lists mouse mode explicitly, and which machine family its pulse timing targets.' },
      { question: 'Do analog sticks work?', answer: 'They work as digital directions only. The adapter decides at what point your stick counts as pushed, so a stick with drift or a short range can register unwanted directions. Check the centre offset on the joystick drift test before blaming the adapter.' },
    ],
    relatedControllers: ['generic-usb-gamepad', 'logitech-f310'],
  },
  {
    slug: 'multi-console-controller-adapter',
    name: 'Multi-console controller adapter',
    anchor: 'Multi-console controller adapter',
    category: 'Cross-platform bridge',
    input: 'USB, Bluetooth or controller-specific input',
    output: 'Several console protocols',
    target: 'Modern and retro consoles',
    summary: 'A configurable adapter aimed at people who want one controller to work across several console families.',
    howItWorks:
      'A multi-console adapter is a protocol translator with several output personalities plus a stored mapping layer. It reads whatever you plug or pair in, normalises the inputs, applies your remapping, then speaks whichever console protocol the current output mode selects. The mapping layer is what most buyers are really paying for: swapping face buttons, moving a stick onto the D-pad, or keeping a different profile per game.',
    latency:
      'More stages mean more places to lose time, and remapping adds a processing step on top of translation. Consistency matters more than the raw figure — a fixed few milliseconds is easy to adapt to, a jittery delay is not. Firmware version usually matters more than the hardware here, so look for what the current release measures rather than what the launch review said.',
    bestFor: ['Mixed modern and retro setups', 'Profiles for different games', 'Remapping buttons for accessibility or comfort'],
    checkBeforeBuying: ['The supported output modes and firmware version', 'Input latency claims and independent testing', 'How remapping, macros and updates are handled'],
    verify: [
      'Test the controller directly on a PC with the full tester first and record the button numbers, axes and rumble behaviour. That record is your baseline for every later comparison.',
      'Re-check after each output mode change. A remap that works in one mode is not guaranteed in another.',
      'Compare the polling rate test with and without the adapter to see what the extra stage costs.',
      'Confirm how profiles are stored, and whether a firmware update clears them.',
    ],
    faqs: [
      { question: 'Do these adapters get detected as an official controller?', answer: 'That depends on the output mode, and it is the whole point of the mode switch: the adapter presents itself as a device the target host accepts. Whether a specific console or game keeps accepting it can change with a system update, which is why firmware support matters more here than on a single-purpose adapter.' },
      { question: 'Is remapping done on the adapter or on a computer?', answer: 'Both patterns exist. Some adapters store profiles on board and are configured with button combinations; others need a companion application to write the profile. On-board profiles survive moving the adapter between machines, which is usually what you want for console use.' },
      { question: 'Should I trust the advertised latency figure?', answer: 'Treat it as a starting point only. Latency depends on the source controller, the connection type, the output mode and the firmware version, so one number cannot cover them all. An independent measurement on your own combination, or a polling rate comparison on PC, tells you more.' },
    ],
    relatedControllers: ['ps5-dualsense', 'xbox-series-controller', 'switch-pro-controller', '8bitdo-pro-2'],
  },
];

export const getAdapter = (slug: string) => ADAPTERS.find((adapter) => adapter.slug === slug);
