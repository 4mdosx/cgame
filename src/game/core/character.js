class Character {
  constructor (profile) {
    this.profile = {
      name: profile.name || 'Neo',
    }
  }

  toJSON () {
    return this.profile
  }
}

export class CharacterModule  {
  name = 'character'
  constructor () {
    this.characters = []
  }

  dispatch (modules, action) {

    switch (action.type) {
      case 'tick':
        break
      default:
        break
    }
  }

  get () {
    return {
      characters: this.characters,
    }
  }

  init ({ character = {}}) {
    const characters = character.characters || []
    if (characters.length === 0) {
      this.characters.push(new Character({}))
    } else {
      this.characters = characters.map(character => new Character(character))
    }
  }

  save () {
    return {
      characters: this.characters.map(character => character.toJSON()),
    }
  }
}
