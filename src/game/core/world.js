export class WorldModule  {
  name = 'world'
  constructor () {
    this.status = {}
    this.map = []
  }

  get () {
    return this.status
  }

  init (payload) {

  }

  dispatch (action) {

  }
}
