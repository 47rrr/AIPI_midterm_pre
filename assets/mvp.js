window.ReturnPilotPresentationSections = [...(window.ReturnPilotPresentationSections || []), {id: 'mvp', name: 'MVP demonstration', steps: 1, aliases: ['mvp', 'demo'], label: 'MVP · Purchases → Selected returns → One plan → Tracking'}];

document.querySelectorAll('[data-inline-route]').forEach(button => {
  button.addEventListener('click', event => {
    // Keep the same document and in-progress demo state when using presenter controls.
    document.getElementById('inline-mvp').contentWindow.postMessage(
      { type: 'return-pilot:navigate', route: button.dataset.inlineRoute },
      location.origin === 'null' ? '*' : location.origin
    );
    if (event.detail > 0) document.getElementById('deck').focus({ preventScroll: true });
  });
});
