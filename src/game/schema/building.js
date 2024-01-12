export const buildings = {
  bonfire: {
    name: '篝火',
    size: 'standard',
    keywords: ['consume_fuel'],
    time: 1,
    effect: {
      'recovery_rate/power': building => {
        if (!building.fuel.count) return 0
        return building.level * 0.1
      }
    },
    menu: [{
      name: '添柴',
      event: 'add_fuel',
    }]
  },
  workbench: {
    name: '工作台',
    size: 'standard',
    keywords: ['workbench'],
    cost: {
      wood: 10,
    },
    time: 1,
    effect: {},
    menu: []
  },
}
