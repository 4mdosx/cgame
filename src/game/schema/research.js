export const research = {
  'feature/application': {
    name: '应用程序',
    time: 10,
    max: 1,
    cost: {},
    finish (game) {
      game.system.store.categories.push('application')
    }
  },
  'app/automator': {
    name: 'automator',
    time: 10,
    max: 1,
    cost: {}
  },
}
