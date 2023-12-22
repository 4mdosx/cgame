export class SystemModule {
  name = 'system'
  constructor() {
    this.interactions = [] // 可用的交互行为
  }

  dispatch(modules, action) {}

  get() {
    return {
      cyborg: this.cyborg,
      keywords: this.keywords,
      proposals: this.proposals,
      actions: this.actions,
    }
  }

  init(payload) {
    Object.assign(this, payload.system)
  }

  save() {
    return this.get()
  }
}
