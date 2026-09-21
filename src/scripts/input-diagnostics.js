const $ = (selector) => document.querySelector(selector);

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function initKeyboardLatency() {
  const root = $('[data-input-tool="keyboard-latency"]');
  if (!root) return;

  const samples = [];
  let armed = true;
  let lastFrame = performance.now();

  const render = () => {
    const last = samples.at(-1);
    $('#keyboard-last').textContent = last == null ? '—' : `${last.toFixed(1)} ms`;
    $('#keyboard-median').textContent = samples.length ? `${median(samples).toFixed(1)} ms` : '—';
    $('#keyboard-average').textContent = samples.length ? `${(samples.reduce((sum, value) => sum + value, 0) / samples.length).toFixed(1)} ms` : '—';
    $('#keyboard-count').textContent = String(samples.length);
    const list = $('#keyboard-samples');
    if (list) list.replaceChildren(...samples.slice(-8).reverse().map((value, index) => {
      const item = document.createElement('li');
      item.textContent = `Sample ${samples.length - index}: ${value.toFixed(1)} ms`;
      return item;
    }));
  };

  const arm = () => {
    armed = true;
    $('#keyboard-status').textContent = 'READY';
    $('#keyboard-help').textContent = 'Press one key. Repeat presses are ignored until the next ready prompt.';
  };

  window.addEventListener('keydown', (event) => {
    if (!armed || event.repeat) return;
    if (event.key === 'Tab' || event.metaKey || event.ctrlKey || event.altKey) return;
    event.preventDefault();
    armed = false;
    const delay = Math.max(0, performance.now() - lastFrame);
    samples.push(delay);
    $('#keyboard-status').textContent = 'CAPTURED';
    render();
    window.setTimeout(arm, 280);
  });

  $('#keyboard-reset')?.addEventListener('click', () => {
    samples.length = 0;
    render();
    arm();
  });

  const tick = (now) => {
    lastFrame = now;
    requestAnimationFrame(tick);
  };
  render();
  arm();
  requestAnimationFrame(tick);
}

function initMouseDpi() {
  const root = $('[data-input-tool="mouse-dpi"]');
  if (!root) return;

  const estimates = [];
  let tracking = false;
  let origin = null;
  let travel = 0;

  const inchesInput = $('#mouse-inches');
  const distanceLabel = () => `${Number(inchesInput?.value || 4).toFixed(1)} in`;

  const render = (pixels = 0, dpi = null) => {
    $('#mouse-pixels').textContent = String(Math.round(pixels));
    $('#mouse-distance').textContent = distanceLabel();
    $('#mouse-dpi').textContent = dpi == null ? '—' : String(Math.round(dpi));
    $('#mouse-count').textContent = String(estimates.length);
  };

  const stop = () => {
    tracking = false;
    origin = null;
    $('#mouse-start').textContent = 'Start swipe';
    $('#mouse-status').textContent = estimates.length ? 'MEASURED' : 'WAITING';
  };

  const finish = () => {
    if (!tracking) return;
    const inches = Math.max(0.5, Number(inchesInput?.value) || 4);
    const dpi = inches > 0 ? travel / inches : 0;
    if (travel > 8) estimates.push(dpi);
    $('#mouse-help').textContent = estimates.length
      ? `Latest estimate ${Math.round(dpi)} DPI across ${Math.round(travel)} px. Repeat the same mark for a cluster.`
      : 'The swipe was too short. Mark the distance again and move in one direction.';
    render(travel, dpi);
    stop();
  };

  $('#mouse-start')?.addEventListener('click', () => {
    if (tracking) {
      finish();
      return;
    }
    tracking = true;
    origin = null;
    travel = 0;
    $('#mouse-start').textContent = 'Stop swipe';
    $('#mouse-status').textContent = 'SWIPING';
    $('#mouse-help').textContent = `Move the mouse ${distanceLabel()} in a straight line, then click Stop swipe.`;
    render(0, null);
  });

  window.addEventListener('pointermove', (event) => {
    if (!tracking || event.pointerType === 'touch') return;
    if (!origin) {
      origin = { x: event.clientX, y: event.clientY };
      return;
    }
    travel = Math.hypot(event.clientX - origin.x, event.clientY - origin.y);
    render(travel, null);
  });

  $('#mouse-reset')?.addEventListener('click', () => {
    estimates.length = 0;
    travel = 0;
    stop();
    render(0, null);
    $('#mouse-help').textContent = 'Click Start swipe, then move the mouse the measured distance without lifting it.';
  });

  inchesInput?.addEventListener('input', () => {
    $('#mouse-distance').textContent = distanceLabel();
  });

  render();
}

initKeyboardLatency();
initMouseDpi();
initKeyboardMap();
initMouseButtons();
initMouseDouble();

function initKeyboardMap() {
  const root = $('[data-input-tool="keyboard-map"]');
  if (!root) return;
  const pressed = new Set();
  const down = (event) => {
    if (event.repeat) return;
    const cell = root.querySelector('[data-key-code="' + event.code + '"]');
    if (!cell) return;
    event.preventDefault();
    pressed.add(event.code);
    cell.classList.add('keyboard-key-active');
    $('#keyboard-map-last').textContent = 'Last key: ' + event.code;
    $('#keyboard-map-count').textContent = pressed.size + ' KEYS';
  };
  const up = (event) => {
    const cell = root.querySelector('[data-key-code="' + event.code + '"]');
    if (cell) cell.classList.remove('keyboard-key-active');
  };
  window.addEventListener('keydown', down);
  window.addEventListener('keyup', up);
  $('#keyboard-map-reset')?.addEventListener('click', () => {
    pressed.clear();
    root.querySelectorAll('.keyboard-key-active').forEach((cell) => cell.classList.remove('keyboard-key-active'));
    $('#keyboard-map-last').textContent = 'Waiting for a key';
    $('#keyboard-map-count').textContent = '0 KEYS';
  });
}

function initMouseButtons() {
  const root = $('[data-input-tool="mouse-buttons"]');
  if (!root) return;
  const names = ['Left', 'Middle', 'Right', 'Back', 'Forward'];
  const counts = [0, 0, 0, 0, 0];
  const render = () => {
    counts.forEach((count, index) => {
      const cell = root.querySelector('[data-mouse-button="' + index + '"]');
      if (!cell) return;
      cell.querySelector('strong').textContent = String(count);
      cell.classList.toggle('mouse-button-cell-active', count > 0);
    });
  };
  root.addEventListener('pointerdown', (event) => {
    if (event.button > 4) return;
    event.preventDefault();
    counts[event.button] += 1;
    $('#mouse-button-last').textContent = 'Last button: ' + (names[event.button] || event.button);
    $('#mouse-button-status').textContent = 'LIVE';
    render();
  });
  root.addEventListener('contextmenu', (event) => event.preventDefault());
  $('#mouse-button-reset')?.addEventListener('click', () => {
    counts.fill(0);
    $('#mouse-button-last').textContent = 'Waiting for a click';
    $('#mouse-button-status').textContent = 'WAITING';
    render();
  });
  render();
}

function initMouseDouble() {
  const root = $('[data-input-tool="mouse-double"]');
  if (!root) return;
  let clicks = 0;
  let flags = 0;
  let lastAt = 0;
  root.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const now = performance.now();
    const gap = lastAt ? now - lastAt : null;
    clicks += 1;
    if (gap != null && gap < 80) {
      flags += 1;
      $('#mouse-double-verdict').textContent = 'Double fire detected';
      $('#mouse-double-status').textContent = 'FAULT';
    } else {
      $('#mouse-double-verdict').textContent = 'Single click recorded';
      $('#mouse-double-status').textContent = 'OK';
    }
    $('#mouse-double-clicks').textContent = String(clicks);
    $('#mouse-double-flags').textContent = String(flags);
    $('#mouse-double-gap').textContent = gap == null ? '—' : Math.round(gap) + ' ms';
    lastAt = now;
  });
  $('#mouse-double-reset')?.addEventListener('click', () => {
    clicks = 0;
    flags = 0;
    lastAt = 0;
    $('#mouse-double-verdict').textContent = 'Waiting for a single click';
    $('#mouse-double-status').textContent = 'WAITING';
    $('#mouse-double-clicks').textContent = '0';
    $('#mouse-double-flags').textContent = '0';
    $('#mouse-double-gap').textContent = '—';
  });
}
