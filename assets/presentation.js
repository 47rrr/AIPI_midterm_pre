(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const deck = $('#deck');
  const cover = $('#cover');
  const extensions = window.ReturnPilotPresentationSections || [];
  const sections = [
    { id: 'problem', steps: 1, name: 'Project overview', label: 'AIPI 590 · Presentation 02' },
    { id: 'solution', steps: 2, name: 'Project overview', label: 'Purchase information → Next actions' },
    { id: 'progress', steps: 3, name: 'Progress overview', label: 'Idea → Scope · Experience · Evaluation' },
    ...extensions,
    { id: 'system', steps: 1, name: 'System overview', label: 'Purchase → Policy → Plan → Refund' },
    { id: 'costs', steps: 1, name: 'Pilot cost', label: '200 active users · Monthly service budget' },
    { id: 'experiment-setup', steps: 0, name: 'Experiment', label: 'Experiment setup', aliases: ['setup'] },
    { id: 'experiment-prompts', steps: 2, name: 'Experiment', label: 'Prompt design', aliases: ['prompts'] },
    { id: 'experiment-results', steps: 2, name: 'Experiment', label: 'Results → Rules baseline', aliases: ['results'] },
    { id: 'experiment-economics', steps: 1, name: 'Experiment', label: 'Token economics', aliases: ['economics'] },
    { id: 'challenges-priorities', steps: 1, name: 'Next steps', label: 'Challenges and next priorities', aliases: ['challenges', 'priorities'] }
  ];
  const scenes = sections.map(section => document.getElementById(section.id));
  const steps = sections.map(section => section.steps);
  const names = sections.map(section => section.name);
  const labels = sections.map(section => section.label);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const sources = [...document.querySelectorAll('.material')];
  const panels = [...document.querySelectorAll('.progress-panel')];
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  const demo = $('#demo-overlay');
  const imagePreview = $('#image-overlay');
  let scene = -1;
  let step = 0;
  let phase = 0;
  let animation = null;
  let raf = 0;
  let returnFocus = null;

  // Only one RAF controller owns motion. No delayed callbacks survive navigation.
  // Match donny: every Next advances one step, settling any in-flight motion first.
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
    deck.dataset.sceneId = scene === -1 ? 'cover' : sections[scene].id;
    deck.dataset.step = step;
    deck.dataset.phase = phase;
    // Preserve the opening composition while it fades out into the added pages.
    deck.dataset.visualScene = Math.min(scene, 2);
    const progressStep = scene > 2 ? steps[2] : step;
    deck.dataset.progressStep = progressStep;
    cover.setAttribute('aria-hidden', String(scene !== -1));
    cover.inert = scene !== -1;
    cover.classList.toggle('scene-before', scene > -1);
    const planned = scene >= 2 || (scene === 1 && phase >= 4);
    const flags = {
      'questions-visible': scene === 0,
      organizing: scene === 1 && step >= 1,
      gather: scene > 0 && phase >= 1,
      highlight: scene === 1 && phase === 2,
      merged: scene > 0 && phase >= 3,
      tasks: planned,
      sorted: scene > 0 && phase >= 5,
      branded: scene === 1 && step >= 2,
      'post-overview': scene > 2,
      'system-revealed': deck.dataset.sceneId === 'system' && step >= 1,
      'costs-revealed': deck.dataset.sceneId === 'costs' && step >= 1
    };
    for (const [flag, enabled] of Object.entries(flags)) deck.classList.toggle(flag, enabled);
    scenes.forEach((element, index) => {
      element.classList.toggle('scene-before', index < scene);
      element.classList.toggle('scene-after', index > scene);
      element.setAttribute('aria-hidden', String(index !== scene));
      element.inert = index !== scene;
      if (extensions.some(section => section.id === element.id)) {
        // Completed sections keep their final composition during the outgoing fade;
        // upcoming sections are ready to enter at their initial step.
        element.dataset.personaStep = String(index < scene ? steps[index] : index === scene ? step : 0);
      }
    });
    $('#materials').setAttribute('aria-hidden', String(scene < 0 || scene > 2));
    $('.illustration-label').setAttribute('aria-hidden', String(scene < 0 || scene > 2));
    sources.forEach((source, index) => {
      const visible = scene > 0 || (scene === 0 && (index < 3 || step >= 1));
      source.classList.toggle('shown', visible);
      source.setAttribute('aria-hidden', String(!visible || (index > 2 && phase >= 3)));
      source.querySelector('.source-details')?.setAttribute('aria-hidden', String(planned));
      source.querySelector('.action-details')?.setAttribute('aria-hidden', String(!planned));
      if (index < 3) source.setAttribute('aria-label', planned
        ? source.querySelector('h4').textContent + ' — ' + source.querySelector('h3').textContent
        : ['Wireless Headphones order email', 'Everyday Hoodie purchase receipt', 'Phone Case purchase screenshot'][index]);
    });
    $('#question-cloud').setAttribute('aria-hidden', String(scene !== 0));
    $('.plan-paper').setAttribute('aria-hidden', String(!planned));
    $('.product-reveal').setAttribute('aria-hidden', String(!(scene === 1 && step >= 2)));
    panels.forEach((panel, index) => {
      const visible = scene >= 2 && progressStep > index;
      panel.classList.toggle('revealed', visible);
      panel.classList.toggle('current', visible && progressStep === index + 1);
      panel.classList.toggle('compact', visible && progressStep > index + 1);
      panel.setAttribute('aria-hidden', String(!visible));
      panel.inert = !visible;
    });
    reveals.forEach(element => {
      const index = scenes.findIndex(item => item.id === element.dataset.reveal);
      const visible = scene > index || (scene === index && step >= Number(element.dataset.revealStep));
      element.classList.toggle('is-revealed', visible);
      element.setAttribute('aria-hidden', String(!visible));
      element.inert = !visible;
    });
    $('#phase-caption').textContent = phaseCopy[phase] || '';
    $('#chapter').textContent = scene === -1 ? 'Return Pilot' : names[scene];
    $('#page-number').textContent = `${String(scene + 2).padStart(2, '0')} / ${String(scenes.length + 1).padStart(2, '0')}`;
    $('#step-count').textContent = `${step} / ${scene === -1 ? 0 : steps[scene]}`;
    $('#step-label').textContent = scene === -1 ? 'AIPI 590 · Mid-Semester Presentation' : labels[scene];
    const total = steps.reduce((sum, value) => sum + value + 1, 1);
    const past = scene === -1 ? 0 : 1 + steps.slice(0, scene).reduce((sum, value) => sum + value + 1, 0);
    const percent = Math.round((past + step + 1) / total * 100);
    $('#progressBar').style.width = `${percent}%`;
    $('.progress-track').setAttribute('aria-valuenow', String(percent));
    $('#prevBtn').disabled = scene === -1;
    $('#nextBtn').disabled = scene === scenes.length - 1 && step === steps[scene];
    document.title = `Return Pilot · ${scene === -1 ? 'Cover' : names[scene]} · ${scene + 2}/${scenes.length + 1}`;
  }

  function writeHash() { history.replaceState(null, '', `#${scene + 2}/${step}`); }
  function finalPhase() { return scene >= 2 || (scene === 1 && step > 0) ? 5 : 0; }
  function announce() { $('#status').textContent = `${scene === -1 ? 'Cover' : names[scene]}, screen ${scene + 2}, step ${step} of ${scene === -1 ? 0 : steps[scene]}`; }
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
    if (animation) finish();
    if (scene === -1) {
      scene = 0; step = 0; phase = 0; render(); animate(); writeHash();
      return;
    }
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
    const previousScene = scene;
    if (step > 0) step--;
    else if (scene > -1) { scene--; step = scene === -1 ? 0 : steps[scene]; }
    phase = finalPhase();
    // Match donny: undo a reveal immediately, animate when returning to a page.
    if (scene !== previousScene) { render(); animate(); }
    else instantRender();
    writeHash(); announce();
  }
  function goTo(target, targetStep = 0) {
    cancel();
    scene = Math.max(-1, Math.min(scenes.length - 1, target));
    step = scene === -1 ? 0 : Math.max(0, Math.min(steps[scene], targetStep));
    phase = finalPhase();
    instantRender(); writeHash(); announce();
  }
  function readHash() {
    const [name, moment] = location.hash.slice(1).split('/');
    const aliases = new Map([['cover', -1]]);
    sections.forEach((section, index) => {
      [section.id, ...(section.aliases || [])].forEach(alias => aliases.set(alias, index));
    });
    const target = aliases.get(name) ?? (/^\d+$/.test(name) ? Number(name) - 2 : -1);
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
  const interactive = 'a, button, input, textarea, select, iframe, [contenteditable]';
  document.addEventListener('keydown', event => {
    if (demo.open || imagePreview.open || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (event.target.closest(interactive)) return;
    const key = event.key.toLowerCase();
    if (['arrowright', 'arrowdown', 'pagedown', 'enter', ' '].includes(key)) { event.preventDefault(); forward(); }
    else if (['arrowleft', 'arrowup', 'pageup', 'backspace'].includes(key)) { event.preventDefault(); backward(); }
    else if (key === 'home') { event.preventDefault(); goTo(-1); }
    else if (key === 'end') { event.preventDefault(); goTo(scenes.length - 1); }
    else if (key === 'f') { event.preventDefault(); fullscreen(); }
  });
  deck.addEventListener('click', event => {
    if (event.detail !== 1 || pointerSwiped || event.target.closest(interactive)) return;
    forward();
    deck.focus({ preventScroll: true });
  });
  deck.addEventListener('dblclick', event => { if (!event.target.closest(interactive)) fullscreen(); });
  let pointerStart = null;
  let pointerSwiped = false;
  deck.addEventListener('pointerdown', event => {
    pointerSwiped = false;
    pointerStart = event.target.closest(interactive) ? null : { x: event.clientX, y: event.clientY, id: event.pointerId };
  });
  deck.addEventListener('pointerup', event => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      pointerSwiped = true;
      dx < 0 ? forward() : backward();
    }
  });
  deck.addEventListener('pointercancel', () => { pointerStart = null; });
  $('#launch-demo').addEventListener('click', () => {
    if (animation) finish();
    returnFocus = $('#launch-demo');
    const frame = $('#demo-frame');
    if (!frame.hasAttribute('src')) frame.src = frame.dataset.src;
    demo.showModal(); $('#close-demo').focus();
  });
  $('#close-demo').addEventListener('click', () => demo.close());
  $('#preview-prototype').addEventListener('click', () => {
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
