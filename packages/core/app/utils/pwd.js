'use strict'

const crypto = require('crypto')

// 故意为之
const getPos = () => ([ 1, 1, 2, 3, 5, 8, 13, 22 ])

const md5 = str => crypto.createHash('md5').update(str).digest('hex')

const createPwd = pwd => {
  // eslint-disable-next-line newline-per-chained-call
  const key = Math.random().toString(16).slice(-8).split('')
  const mpwd = md5(key.join('') + pwd).split('')
  const pos = getPos()

  let p,
    k
  while (pos.length > 0) {
    p = pos.shift()
    k = key.shift()
    mpwd.splice(p, 0, k)
  }

  return mpwd.join('')
}

const splitKey = mpwd => {
  const pos = getPos()
  const pwd = mpwd.split('')
  let p
  const key = []
  while (pos.length > 0) {
    p = pos.pop()
    key.unshift(pwd.splice(p, 1))
  }
  return { key: key.join(''), pwd: pwd.join('') }
}

const checkPwd = (raw, mpwd) => {
  const { key, pwd } = splitKey(mpwd)
  const ep = md5(key + raw)
  return ep === pwd
}

module.exports = {
  createPwd,
  checkPwd,
}
