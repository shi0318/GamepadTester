const state = {
  gamepad: null,
  selectedIndex: -1,
  previousPressed: new Set(),
  events: 0,
  lastFrame: performance.now(),
  frameCount: 0,
  padSignature: '',
  calibration: {
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
  },
  calibrated: false,
  history: { left: [], right: [] },
  lastAxes: { left: null, right: null },
  circle: { active: false, side: 'left', radii: [], angleBins: new Set() },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const labels = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Back', 'Start', 'L3', 'R3', 'D-pad up', 'D-pad down', 'D-pad left', 'D-pad right', 'Home', 'Touchpad'];
const formatAxis = (value) => (value >= 0 ? '+' : '') + value.toFixed(2);
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const setText = (selector, value) => {
  const element = $(selector);
  if (element) element.textContent = String(value);
};

function setConnection(connected, gamepad) {
  if (!$('#banner-title')) return;
  setText('#banner-title', connected ? 'Controller connected' : 'Press any button to connect');
  setText('#banner-copy', connected ? 'Press buttons and move both sticks to inspect every input signal.' : 'Connect the controller in Windows, macOS or Linux first. This page cannot pair Bluetooth or install drivers.');
  setText('#banner-status', connected ? 'LIVE' : 'WAITING');
  setText('#controller-name', connected ? (gamepad.id || 'Standard gamepad') : 'No controller detected');
  const live = $('#live-badge');
  if (live) {
    live.innerHTML = '<span class="status-dot"></span> ' + (connected ? 'Online' : 'Offline');
    live.classList.toggle('online', connected);
  }
  const hint = $('#visual-hint');
  if (hint) hint.innerHTML = connected ? '<span class="hint-pulse active"></span> Input stream active' : '<span class="hint-pulse"></span> Waiting for input';
  setText('#rumble-support', connected && gamepad.vibrationActuator ? 'AVAILABLE' : connected ? 'LIMITED' : 'NOT READY');
  $$('.vibration-button, .custom-rumble-button').forEach((button) => {
    button.disabled = !connected || !gamepad || !gamepad.vibrationActuator;
  });
}

function setUnsupportedBrowser() {
  setText('#banner-title', 'Gamepad API unavailable');
  setText('#banner-copy', 'Use a current desktop version of Chrome or Edge, then connect a controller over USB or Bluetooth.');
  setText('#banner-status', 'UNSUPPORTED');
  setText('#controller-name', 'Browser not supported');
  setText('#rumble-support', 'NOT READY');
  $$('.vibration-button, .custom-rumble-button, #calibrate-sticks, #circle-test').forEach((button) => {
    button.disabled = true;
  });
}

function currentGamepad() {
  if (!navigator.getGamepads) return null;
  const pads = navigator.getGamepads();
  if (state.selectedIndex >= 0 && pads[state.selectedIndex]) return pads[state.selectedIndex];
  if (state.gamepad && pads[state.gamepad.index]) return pads[state.gamepad.index];
  return Array.from(pads).find(Boolean) || null;
}

function updateControllerPicker() {
  const picker = $('#controller-select');
  if (!picker || !navigator.getGamepads) return;
  const pads = Array.from(navigator.getGamepads());
  const signature = pads.map((pad, index) => (pad ? index + ':' + pad.id : '')).join('|');
  if (signature === state.padSignature) return;
  state.padSignature = signature;
  picker.replaceChildren();
  const available = pads.filter(Boolean);
  if (!available.length) {
    picker.add(new Option('No controllers detected', '-1'));
    state.selectedIndex = -1;
    return;
  }
  available.forEach((pad) => {
    picker.add(new Option('Controller ' + (pad.index + 1) + ': ' + (pad.id || 'Standard gamepad').slice(0, 34), String(pad.index)));
  });
  if (state.selectedIndex < 0 || !pads[state.selectedIndex]) state.selectedIndex = available[0].index;
  picker.value = String(state.selectedIndex);
}

function updateAxis(side, x, y) {
  const prefix = side === 'left' ? 'left' : 'right';
  const stickVisual = $('#' + prefix + '-stick-visual');
  if (stickVisual) stickVisual.style.transform = 'translate(' + (x * 8) + 'px, ' + (y * 8) + 'px)';
  const point = $('#' + prefix + '-point');
  if (point) point.style.transform = 'translate(calc(-50% + ' + (x * 42) + 'px), calc(-50% + ' + (y * 42) + 'px))';
  setText('#' + prefix + '-x', formatAxis(x));
  setText('#' + prefix + '-y', formatAxis(y));

  const baseline = state.calibration[side];
  const offset = Math.hypot(x - baseline.x, y - baseline.y);
  const previous = state.lastAxes[side];
  const moving = previous ? Math.hypot(x - previous.x, y - previous.y) > 0.018 : false;
  const status = moving || offset > 0.12 ? 'ACTIVE' : 'CENTERED';
  setText('#' + prefix + '-stick-status', status);
  const metric = $('#' + prefix + '-stick-status');
  if (metric) metric.closest('.metric-block')?.classList.remove('drifting');

  const history = state.history[side];
  history.push({ x, y });
  if (history.length > 180) history.shift();
  state.lastAxes[side] = { x, y };
}

function updateButtons(gamepad) {
  const pressed = new Set();
  $$('[data-button]').forEach((element) => element.classList.remove('button-pressed'));
  $$('[data-button-value]').forEach((element) => { element.textContent = '0.00'; });
  $$('[data-button-cell]').forEach((element) => element.classList.remove('button-cell-active'));
  gamepad.buttons.forEach((button, index) => {
    const value = Number.isFinite(button.value) ? button.value : (button.pressed ? 1 : 0);
    const isPressed = button.pressed || value > 0.2;
    if (isPressed) pressed.add(index);
    $$('[data-button="' + index + '"]').forEach((element) => element.classList.toggle('button-pressed', isPressed));
    const valueElement = $('[data-button-value="' + index + '"]');
    if (valueElement) valueElement.textContent = value.toFixed(2);
    const cell = $('[data-button-cell="' + index + '"]');
    if (cell) cell.classList.toggle('button-cell-active', isPressed);
  });
  const newlyPressed = Array.from(pressed).filter((index) => !state.previousPressed.has(index));
  if (newlyPressed.length) {
    state.events += newlyPressed.length;
    setText('#event-count', state.events);
    setText('#last-input', labels[newlyPressed[0]] || 'Button ' + newlyPressed[0]);
  }
  state.previousPressed = pressed;
  setText('#raw-buttons', pressed.size ? Array.from(pressed).map((index) => labels[index] || 'B' + index).join(', ') : 'None');
}

function updateTriggers(gamepad) {
  const lt = gamepad.buttons[6]?.value || 0;
  const rt = gamepad.buttons[7]?.value || 0;
  setText('#lt-value', lt.toFixed(2));
  setText('#rt-value', rt.toFixed(2));
  const ltBar = $('#lt-bar');
  const rtBar = $('#rt-bar');
  if (ltBar) ltBar.style.width = lt * 100 + '%';
  if (rtBar) rtBar.style.width = rt * 100 + '%';
}

function updateRaw(gamepad) {
  const axes = Array.from(gamepad.axes).slice(0, 4).map((axis) => axis.toFixed(2));
  setText('#raw-axes', axes.join(', ') || '0.00, 0.00, 0.00, 0.00');
  const raw = {
    id: gamepad.id,
    index: gamepad.index,
    connected: gamepad.connected,
    mapping: gamepad.mapping || 'unknown',
    timestamp: gamepad.timestamp || 0,
    axes: Array.from(gamepad.axes).map((axis) => Number(axis.toFixed(3))),
    buttons: Array.from(gamepad.buttons).map((button) => ({ pressed: button.pressed, value: Number(button.value.toFixed(3)) })),
  };
  setText('#raw-details', JSON.stringify(raw, null, 2));
}

function calculateStats(side) {
  const values = state.history[side];
  if (values.length < 8) return null;
  const mean = values.reduce((sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }), { x: 0, y: 0 });
  mean.x /= values.length;
  mean.y /= values.length;
  const jitter = Math.sqrt(values.reduce((sum, point) => sum + ((point.x - mean.x) ** 2) + ((point.y - mean.y) ** 2), 0) / values.length);
  const offset = Math.hypot(mean.x - state.calibration[side].x, mean.y - state.calibration[side].y);
  return { jitter, offset };
}

function updateDriftDiagnostics() {
  const stats = [calculateStats('left'), calculateStats('right')].filter(Boolean);
  if (!stats.length) return;
  const maxOffset = Math.max(...stats.map((item) => item.offset));
  const maxJitter = Math.max(...stats.map((item) => item.jitter));
  const score = clamp(maxOffset / 0.2) * 100;
  setText('#center-offset', maxOffset.toFixed(3));
  setText('#jitter-value', maxJitter.toFixed(3));
  setText('#drift-score', Math.round(score) + ' / 100');
  const verdict = maxOffset > 0.12 ? 'DRIFT FOUND' : maxJitter > 0.06 ? 'UNSTABLE' : 'HEALTHY';
  setText('#drift-verdict', verdict);
  $('#drift-verdict')?.classList.toggle('diagnostic-warning', verdict !== 'HEALTHY');
}

function updateCircularity() {
  if (!state.circle.active) return;
  const gamepad = currentGamepad();
  if (!gamepad) return;
  const offset = state.circle.side === 'left' ? 0 : 2;
  const baseline = state.calibration[state.circle.side];
  const x = (gamepad.axes[offset] || 0) - baseline.x;
  const y = (gamepad.axes[offset + 1] || 0) - baseline.y;
  const radius = Math.hypot(x, y);
  if (radius > 0.12) {
    state.circle.radii.push(radius);
    const angle = (Math.atan2(y, x) + Math.PI * 2) % (Math.PI * 2);
    state.circle.angleBins.add(Math.floor((angle / (Math.PI * 2)) * 16));
  }
  setText('#circle-samples', state.circle.radii.length);
  setText('#circle-coverage', Math.round((state.circle.angleBins.size / 16) * 100) + '%');
  if (state.circle.radii.length) {
    setText('#circle-min', Math.min(...state.circle.radii).toFixed(2));
    setText('#circle-max', Math.max(...state.circle.radii).toFixed(2));
  }
}

function applyMode() {
  const mode = $('#tester')?.dataset.gamepadTool || 'full';
  const visible = {
    full: ['sticks', 'drift', 'circularity', 'triggers', 'vibration'],
    drift: ['sticks', 'drift', 'circularity'],
    buttons: [],
    vibration: ['vibration'],
    triggers: ['triggers'],
    polling: [],
    ps5: ['sticks', 'drift', 'circularity', 'triggers', 'vibration'],
    xbox: ['sticks', 'drift', 'circularity', 'triggers', 'vibration'],
    switch: ['sticks', 'drift', 'circularity', 'triggers', 'vibration'],
  }[mode] || [];
  $$('[data-diagnostic]').forEach((panel) => {
    panel.hidden = visible.length ? !visible.includes(panel.dataset.diagnostic) : true;
  });
}

function rumble(kind) {
  const gamepad = currentGamepad();
  if (!gamepad?.vibrationActuator?.playEffect) return;
  const strong = Number($('#strong-magnitude')?.value || 80) / 100;
  const weak = Number($('#weak-magnitude')?.value || 60) / 100;
  const patterns = {
    light: { duration: 180, strongMagnitude: strong * 0.35, weakMagnitude: weak * 0.35 },
    heavy: { duration: 500, strongMagnitude: strong, weakMagnitude: weak },
    burst: { duration: 1100, strongMagnitude: strong * 0.8, weakMagnitude: weak * 0.8 },
    pulse: { duration: 120, strongMagnitude: strong, weakMagnitude: weak },
    custom: { duration: 1000, strongMagnitude: strong, weakMagnitude: weak },
  };
  const effect = patterns[kind] || patterns.custom;
  gamepad.vibrationActuator.playEffect('dual-rumble', effect).catch(() => {});
}

function clearControllerDisplay() {
  $$('[data-button]').forEach((element) => element.classList.remove('button-pressed'));
  $$('[data-button-value]').forEach((element) => { element.textContent = '0.00'; });
  $$('[data-button-cell]').forEach((element) => element.classList.remove('button-cell-active'));
  setText('#raw-buttons', 'None');
  setText('#raw-axes', '0.00, 0.00, 0.00, 0.00');
  setText('#lt-value', '0.00');
  setText('#rt-value', '0.00');
  const ltBar = $('#lt-bar');
  const rtBar = $('#rt-bar');
  if (ltBar) ltBar.style.width = '0%';
  if (rtBar) rtBar.style.width = '0%';
  ['left', 'right'].forEach((side) => {
    const prefix = side === 'left' ? 'left' : 'right';
    setText('#' + prefix + '-x', '+0.00');
    setText('#' + prefix + '-y', '+0.00');
    setText('#' + prefix + '-stick-status', 'CENTERED');
    const point = $('#' + prefix + '-point');
    if (point) point.style.transform = 'translate(-50%, -50%)';
    const stickVisual = $('#' + prefix + '-stick-visual');
    if (stickVisual) stickVisual.style.transform = 'translate(0, 0)';
  });
}

function resetControllerMeasurements() {
  state.previousPressed.clear();
  state.events = 0;
  state.history.left = [];
  state.history.right = [];
  state.lastAxes = { left: null, right: null };
  state.calibration = { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } };
  state.calibrated = false;
  state.circle = { active: false, side: 'left', radii: [], angleBins: new Set() };
  setText('#event-count', '0');
  setText('#last-input', '—');
  setText('#calibration-status', 'Not calibrated');
  setText('#drift-verdict', 'WAITING');
  setText('#center-offset', '—');
  setText('#jitter-value', '—');
  setText('#drift-score', '—');
  setText('#circle-verdict', 'READY');
  setText('#circle-samples', '0');
  setText('#circle-min', '—');
  setText('#circle-max', '—');
  setText('#circle-coverage', '0%');
  setText('#circle-score', '—');
  const circleButton = $('#circle-test');
  if (circleButton) circleButton.textContent = 'Start circle';
  clearControllerDisplay();
}

function adoptGamepad(gamepad) {
  const changed = !state.gamepad
    || state.gamepad.index !== gamepad.index
    || state.gamepad.id !== gamepad.id
    || state.gamepad.buttons.length !== gamepad.buttons.length
    || state.gamepad.axes.length !== gamepad.axes.length;
  state.gamepad = gamepad;
  if (changed) resetControllerMeasurements();
  setConnection(true, gamepad);
}

function calibrateSticks() {
  const gamepad = currentGamepad();
  if (!gamepad) {
    setText('#calibration-status', 'Connect a controller first');
    return;
  }
  state.calibration = {
    left: { x: gamepad.axes[0] || 0, y: gamepad.axes[1] || 0 },
    right: { x: gamepad.axes[2] || 0, y: gamepad.axes[3] || 0 },
  };
  state.history.left = [];
  state.history.right = [];
  state.calibrated = true;
  setText('#calibration-status', 'Centers locked: ' + formatAxis(state.calibration.left.x) + ', ' + formatAxis(state.calibration.left.y));
}

function stopCircle() {
  state.circle.active = false;
  const radii = state.circle.radii;
  const min = radii.length ? Math.min(...radii) : 0;
  const max = radii.length ? Math.max(...radii) : 0;
  const angleCoverage = state.circle.angleBins.size / 16;
  const score = max ? clamp(min / max) * 100 : 0;
  const complete = radii.length >= 12 && angleCoverage >= 0.75;
  setText('#circle-verdict', complete ? 'COMPLETE' : radii.length >= 12 ? 'INCOMPLETE' : 'NOT ENOUGH DATA');
  setText('#circle-score', complete ? Math.round(score) + '%' : 'INCOMPLETE');
  const button = $('#circle-test');
  if (button) button.textContent = 'Start circle';
}

function toggleCircle() {
  if (state.circle.active) {
    stopCircle();
    return;
  }
  state.circle = { active: true, side: $('#circle-stick')?.value || 'left', radii: [], angleBins: new Set() };
  setText('#circle-verdict', 'CAPTURING');
  setText('#circle-score', '—');
  setText('#circle-samples', '0');
  setText('#circle-coverage', '0%');
  const button = $('#circle-test');
  if (button) button.textContent = 'Stop circle';
}

function reset() {
  resetControllerMeasurements();
}

function frame(now) {
  updateControllerPicker();
  const gamepad = currentGamepad();
  if (gamepad) {
    adoptGamepad(gamepad);
    updateAxis('left', gamepad.axes[0] || 0, gamepad.axes[1] || 0);
    updateAxis('right', gamepad.axes[2] || 0, gamepad.axes[3] || 0);
    updateButtons(gamepad);
    updateTriggers(gamepad);
    updateRaw(gamepad);
    updateDriftDiagnostics();
    updateCircularity();
    state.frameCount += 1;
    if (now - state.lastFrame >= 1000) {
      setText('#sample-rate', state.frameCount + ' fps');
      state.frameCount = 0;
      state.lastFrame = now;
    }
  } else if (state.gamepad) {
    state.gamepad = null;
    resetControllerMeasurements();
    setConnection(false);
  }
  requestAnimationFrame(frame);
}

function init() {
  if (!$('#tester')) return;
  applyMode();
  if (typeof navigator.getGamepads !== 'function') {
    setUnsupportedBrowser();
    return;
  }
  window.addEventListener('gamepadconnected', (event) => {
    adoptGamepad(event.gamepad);
  });
  window.addEventListener('gamepaddisconnected', (event) => {
    if (!currentGamepad() || state.gamepad?.index === event.gamepad.index) {
      state.gamepad = null;
      resetControllerMeasurements();
      setConnection(false);
    }
  });
  $('#reset-test')?.addEventListener('click', reset);
  $('#calibrate-sticks')?.addEventListener('click', calibrateSticks);
  $('#circle-test')?.addEventListener('click', toggleCircle);
  $('#controller-select')?.addEventListener('change', (event) => {
    state.selectedIndex = Number(event.currentTarget.value);
    state.gamepad = null;
    resetControllerMeasurements();
    setConnection(false);
  });
  $('#raw-toggle')?.addEventListener('click', (event) => {
    const details = $('#raw-details');
    if (!details) return;
    const show = details.hidden;
    details.hidden = !show;
    event.currentTarget.innerHTML = show ? 'Hide details <span>−</span>' : 'Show details <span>+</span>';
  });
  $$('.vibration-button, .custom-rumble-button').forEach((button) => {
    button.addEventListener('click', () => rumble(button.dataset.rumble));
  });
  ['strong', 'weak'].forEach((kind) => {
    const input = $('#' + kind + '-magnitude');
    const output = $('#' + kind + '-output');
    input?.addEventListener('input', () => {
      if (output) output.textContent = input.value + '%';
    });
  });
  setConnection(false);
  requestAnimationFrame(frame);
}

init();
