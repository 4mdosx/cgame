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

export function randomNormalDistribution(mean, stdDev) {
  let u = 0,
    v = 0
  while (u === 0) u = Math.random() // 生成(0,1)区间的随机数
  while (v === 0) v = Math.random() // 生成(0,1)区间的随机数
  let z0 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return z0 * stdDev + mean // 转换为指定均值和标准差的正态分布随机数
}
