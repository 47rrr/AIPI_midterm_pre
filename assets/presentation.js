(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const deck = $('#deck');
  const extensions = window.ReturnPilotPresentationSections || [];
  const scenes = [$('#problem'), $('#solution'), $('#progress'), ...extensions.map(section => document.getElementById(section.id))];
  const steps = [4, 2, 3, ...extensions.map(section => section.steps)];
  const names = ['Project overview', 'Project overview', 'Progress overview', ...extensions.map(section => section.name)];
  const stepLabels = ['AIPI 590 · Presentation 02', 'Purchase information → Next actions', 'Idea → Scope · Experience · Evaluation', ...extensions.map(section => section.label)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const sources = [...document.querySelectorAll('.material')];
  const panels = [...document.querySelectorAll('.progress-panel')];
  const demo = $('#demo-overlay');
  const imagePreview = $('#image-overlay');
  let scene = 0;
  let step = 0;
  let phase = 0;
  let animation = null;
  let raf = 0;
  let returnFocus = null;

  // Only one RAF controller owns motion. No delayed callbacks survive navigation.
  // During a reveal, another Next finishes that reveal; it does not skip a beat.
  const phaseSequence = [
    { at: 0, phase: 1 },     // Gather and straighten the same five documents.
    { at: 1000, phase: 2 },  // Highlight names, dates, and missing information.
    { at: 2100, phase: 3 },  // Merge policy evidence into its original purchase.
    { at: 3050, phase: 4 },  // Morph the original purchase cards into tasks.
    { at: 4100, phase: 5 }   // Sort: action required, confirmation, then decision.
  ];
  const phaseCopy = ['', 'Bring the scattered information together',
    'Find the item and date. Keep missing information visible.',
    'Match each purchase with its policy',
    'Give each item a next action',
    'Act first. Confirm what is missing. Keep the decision with the user.'];

  function resize() {
    document.documentElement.style.setProperty('--scale', Math.min(innerWidth / 1600, innerHeight / 900));
  }

  function render() {
    deck.dataset.scene = scene;
    deck.dataset.step = step;
    deck.dataset.phase = phase;
    deck.classList.toggle('personas-active', scene >= 3);
    extensions.forEach((section, index) => {
      const element = scenes[index + 3];
      element.dataset.personaStep = index + 3 === scene ? String(step) : '0';
    });
    const planned = scene === 2 || (scene === 1 && phase >= 4);
    const flags = {
      'questions-visible': scene === 0 && step >= 3,
      organizing: scene === 1 && step >= 1,
      gather: scene > 0 && phase >= 1,
      highlight: scene === 1 && phase === 2,
      merged: scene > 0 && phase >= 3,
      tasks: planned,
      sorted: scene > 0 && phase >= 5,
      branded: scene === 1 && step >= 2
    };
    for (const [flag, enabled] of Object.entries(flags)) deck.classList.toggle(flag, enabled);
    scenes.forEach((element, index) => {
      element.setAttribute('aria-hidden', String(index !== scene));
      element.inert = index !== scene;
    });
    sources.forEach((source, index) => {
      const visible = scene < 3 && (scene > 0 || step >= [1, 2, 2, 4, 4][index]);
      source.classList.toggle('shown', visible);
      source.setAttribute('aria-hidden', String(!visible || (index > 2 && phase >= 3)));
      source.querySelector('.source-details')?.setAttribute('aria-hidden', String(planned));
      source.querySelector('.action-details')?.setAttribute('aria-hidden', String(!planned));
      if (index < 3) source.setAttribute('aria-label', planned
        ? source.querySelector('h4').textContent + ' — ' + source.querySelector('h3').textContent
        : ['Wireless Headphones order email', 'Everyday Hoodie purchase receipt', 'Phone Case purchase screenshot'][index]);
    });
    $('#question-cloud').setAttribute('aria-hidden', String(!(scene === 0 && step >= 3)));
    $('.plan-paper').setAttribute('aria-hidden', String(!planned));
    $('.product-reveal').setAttribute('aria-hidden', String(!(scene === 1 && step >= 2)));
    panels.forEach((panel, index) => {
      const visible = scene === 2 && step > index;
      panel.classList.toggle('revealed', visible);
      panel.classList.toggle('current', visible && step === index + 1);
      panel.classList.toggle('compact', visible && step > index + 1);
      panel.setAttribute('aria-hidden', String(!visible));
      panel.inert = !visible;
    });
    [...document.querySelectorAll('.process-rail li')].forEach((li, index) => {
      const active = Math.min(3, Math.max(0, phase - 1));
      li.classList.toggle('active', index === active);
      li.classList.toggle('past', index < active);
    });
    $('#phase-caption').textContent = phaseCopy[phase] || '';
    $('#chapter').textContent = names[scene];
    $('#page-number').textContent = `${String(scene + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`;
    $('#step-count').textContent = `${step} / ${steps[scene]}`;
    $('#step-label').textContent = stepLabels[scene];
    const total = steps.reduce((sum, value) => sum + value + 1, 0);
    const past = steps.slice(0, scene).reduce((sum, value) => sum + value + 1, 0);
    const percent = Math.round((past + step + 1) / total * 100);
    $('#progressBar').style.width = `${percent}%`;
    $('.progress-track').setAttribute('aria-valuenow', String(percent));
    $('#prevBtn').disabled = scene === 0 && step === 0;
    $('#nextBtn').disabled = scene === scenes.length - 1 && step === steps[scene];
    document.title = `Return Pilot · ${names[scene]} · ${scene + 1}/${scenes.length}`;
  }

  function writeHash() { history.replaceState(null, '', `#${scene + 1}/${step}`); }
  function finalPhase() { return scene === 2 || (scene === 1 && step > 0) ? 5 : 0; }
  function announce() { $('#status').textContent = `${names[scene]}, screen ${scene + 1}, step ${step} of ${steps[scene]}`; }
  function cancel() { cancelAnimationFrame(raf); raf = 0; animation = null; deck.dataset.busy = 'false'; }
  function instantRender() {
    deck.classList.add('instant');
    render();
    // Commit final styles while transitions are disabled; this also cancels delayed transitions.
    void deck.offsetHeight;
    deck.classList.remove('instant');
  }
  function finish() {
    cancel();
    phase = finalPhase();
    instantRender();
    announce();
  }
  function animate(sequence = false) {
    if (reducedMotion.matches) { finish(); return; }
    animation = { start: performance.now(), sequence, duration: sequence ? 5050 : 1000 };
    deck.dataset.busy = 'true';
    function tick(now) {
      if (!animation) return;
      const elapsed = now - animation.start;
      if (animation.sequence) {
        const active = phaseSequence.filter(item => elapsed >= item.at).at(-1).phase;
        if (phase !== active) { phase = active; render(); }
      }
      if (elapsed >= animation.duration) { cancel(); announce(); return; }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  }
  function forward() {
    if (demo.open || imagePreview.open) return;
    if (animation) { finish(); return; }
    if (step < steps[scene]) {
      step++;
      if (scene === 1 && step === 1) {
        phase = 1; render(); animate(true);
      } else { phase = finalPhase(); render(); animate(); }
    } else if (scene < scenes.length - 1) {
      scene++; step = 0; phase = finalPhase(); render(); animate();
    }
    writeHash();
  }
  function backward() {
    if (demo.open || imagePreview.open) return;
    cancel();
    if (step > 0) step--;
    else if (scene > 0) { scene--; step = steps[scene]; }
    phase = finalPhase();
    // A reverse command during any motion restores the prior stable beat immediately.
    instantRender(); writeHash(); announce();
  }
  function goTo(target, targetStep = 0) {
    cancel();
    scene = Math.max(0, Math.min(scenes.length - 1, target));
    step = Math.max(0, Math.min(steps[scene], targetStep));
    phase = finalPhase();
    instantRender(); writeHash(); announce();
  }
  function readHash() {
    const [name, moment] = location.hash.slice(1).split('/');
    const aliases = { problem: 0, solution: 1, progress: 2 };
    extensions.forEach((section, index) => section.aliases.forEach(alias => { aliases[alias] = index + 3; }));
    const numericTarget = /^\d+$/.test(name || '') && Number(name) >= 1 && Number(name) <= scenes.length ? Number(name) - 1 : 0;
    const target = aliases[name] ?? numericTarget;
    goTo(target, /^\d+$/.test(moment || '') ? Number(moment) : 0);
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { $('#status').textContent = 'Fullscreen is unavailable in this browser. The presentation still fits the window.'; }
  }
  function bindControl(selector, action) {
    $(selector).addEventListener('click', event => {
      action();
      // Pointer users can continue with arrow keys; keyboard users retain button focus.
      if (event.detail > 0) deck.focus({ preventScroll: true });
    });
  }
  bindControl('#nextBtn', forward);
  bindControl('#prevBtn', backward);
  bindControl('#fullBtn', fullscreen);
  document.addEventListener('keydown', event => {
    if (demo.open || imagePreview.open || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (event.target.closest('a, button, input, textarea, select, [contenteditable]')) return;
    const key = event.key.toLowerCase();
    if (['arrowright', 'arrowdown', 'pagedown', 'enter', ' '].includes(key)) { event.preventDefault(); forward(); }
    else if (['arrowleft', 'arrowup', 'pageup', 'backspace'].includes(key)) { event.preventDefault(); backward(); }
    else if (key === 'home') { event.preventDefault(); goTo(0); }
    else if (key === 'end') { event.preventDefault(); goTo(scenes.length - 1); }
    else if (key === 'f') { event.preventDefault(); fullscreen(); }
  });
  deck.addEventListener('dblclick', event => { if (!event.target.closest('a, button')) fullscreen(); });
  let pointerStart = null;
  deck.addEventListener('pointerdown', event => {
    pointerStart = event.target.closest('a, button') ? null : { x: event.clientX, y: event.clientY, id: event.pointerId };
  });
  deck.addEventListener('pointerup', event => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) dx < 0 ? forward() : backward();
  });
  deck.addEventListener('pointercancel', () => { pointerStart = null; });
  document.querySelectorAll('[data-demo-route]').forEach(button => button.addEventListener('click', () => {
    if (animation) finish();
    returnFocus = button;
    const route = button.dataset.demoRoute;
    const frame = $('#demo-frame');
    frame.src = `demo/index.html#${route}`;
    document.querySelector('.demo-toolbar a').href = `demo/index.html#${route}`;
    demo.showModal(); $('#close-demo').focus();
  }));
  $('#close-demo').addEventListener('click', () => demo.close());
  $('#preview-prototype')?.addEventListener('click', () => {
    if (animation) finish();
    returnFocus = $('#preview-prototype');
    imagePreview.showModal(); $('#close-image').focus();
  });
  $('#close-image').addEventListener('click', () => imagePreview.close());
  [demo, imagePreview].forEach(dialog => dialog.addEventListener('close', () => {
    if (returnFocus && !returnFocus.closest('[inert]')) returnFocus.focus();
    else deck.focus();
  }));
  window.addEventListener('resize', resize);
  window.addEventListener('hashchange', readHash);
  window.addEventListener('popstate', readHash);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches && animation) finish(); });
  resize(); readHash();
})();
