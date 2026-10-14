/* A small extension point keeps this section separate from teammates' content.
   Visual states use data-persona-step, so forward/back/hash navigation restore
   the exact state without timers, cloned cards, or delayed callbacks. */
window.ReturnPilotPresentationSections = [...(window.ReturnPilotPresentationSections || []),
  {
    id: 'persona-emma',
    name: 'Customer persona ideas',
    steps: 2,
    aliases: ['personas', 'emma'],
    label: 'Emma · Scattered purchases → Clear next actions'
  },
  {
    id: 'persona-ryan',
    name: 'Customer persona ideas',
    steps: 2,
    aliases: ['ryan', 'privacy'],
    label: 'Ryan · Privacy concern → Selective purchase input'
  },
  {
    id: 'persona-maya',
    name: 'Customer persona ideas',
    steps: 2,
    aliases: ['maya', 'mobile'],
    label: 'Maya · Web planning → A future mobile experience'
  }
];
