export function randomPick(dict) {
  if (typeof dict === 'string') {
    return dict[Math.floor(Math.random() * dict.length)]
  }
  if (typeof dict === 'number') {
    return Math.floor(Math.random() * dict)
  }

  if (dict instanceof Array) {
    return dict[Math.floor(Math.random() * dict.length)]
  }

  const keys = Object.keys(dict)
  return keys[Math.floor(Math.random() * keys.length)]
}

export function randomPort() {
  const level = randomPick(10)
  if (level <= 2) {
    return randomPick(1023) + 1
  }
  if (level >= 8) {
    return randomPick(65535 - 49151) + 49151
  }
  return randomPick(49151 - 1024) + 1024
}
