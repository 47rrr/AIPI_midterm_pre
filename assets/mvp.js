window.ReturnPilotPresentationSections = [...(window.ReturnPilotPresentationSections || []), {id: 'mvp', name: 'MVP demonstration', steps: 1, aliases: ['mvp', 'demo'], label: 'MVP · Purchase review, return tasks, planning and tracking'}];

document.querySelectorAll('[data-inline-route]').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById('inline-mvp').src = `demo/index.html#${button.dataset.inlineRoute}`;
  });
});
