export class CharacterModule  {
  name = 'character'
  constructor () {
    this.status = {}
    this.characters = []
  }

  dispatch (modules, action) {

  }

  get () {
    return this.status
  }

  init (payload) {
    this.status = payload.character
  }

  save () {
    return this.status
  }
}
