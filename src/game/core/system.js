export class SystemModule {
  name = 'system'
  constructor() {
  }

  dispatch(modules, action) {}

  get() {
    return {
    }
  }

  init({ system }= {}) {
    Object.assign(this, system)
  }

  save() {
    return this.get()
  }
}
