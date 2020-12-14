'use strict'

const { login } = require('../../app/resolves').resolves.user

const users = {
  get admin() {
    return { name: 'admin', password: '123456', role: 1 }
  },
  get owner() {
    return { name: 'owner', password: '123456', role: 0 }
  },
  get maintainer() {
    return { name: 'maintainer', password: '123456', role: 0 }
  },
  get developer() {
    return { name: 'developer', password: '123456', role: 0 }
  },
  get tester() {
    return { name: 'tester', password: '123456', role: 0 }
  },
  get guest() {
    return { name: 'guest', password: '123456', role: 0 }
  },
}

const loginUser = async (ctx, name) => {
  const user = await login(ctx, users[name])
  return [ '_id', 'name', 'role' ].reduce((r, i) => {
    r[i] = i === '_id' ? user[i].toString() : user[i]
    return r
  }, {})
}

module.exports = {
  users,
  loginUser,
}
