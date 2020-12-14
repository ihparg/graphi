'use strict'

const assert = require('power-assert')
const jwt = require('jsonwebtoken')
const mock = require('egg-mock')
const Users = require('./data').users
const resolves = require('../../app/resolves').resolves

describe('resolves/user.js', () => {
  let app
  before(() => {
    app = mock.app()
    return app.ready()
  })

  it('init user', async () => {
    const ctx = app.mockContext()

    const user = await resolves.user.init(ctx, Users.admin)
    assert(Users.admin.name === user.name)
    assert(user.role === 1)

    try {
      await resolves.user.init(ctx, Users.admin)
    } catch (e) {
      assert(e.message === '已经有用户存在')
    }
  })

  it('user login/logout', async () => {
    const ctx = app.mockContext()

    const user = await resolves.user.login(ctx, Users.admin)
    assert(Users.admin.name === user.name)
    assert(user.role === 1)
    assert(user.token)

    const payload = await jwt.verify(user.token, app.config.keys)
    ctx.user = payload

    assert(payload.name === user.name)
    assert(payload.role === 1)
    assert(payload._id === user._id.toString())

    let dt = await app.cache.get(payload._id + ':' + payload.dt)
    assert(dt === payload.dt)

    await resolves.user.logout(ctx)

    dt = await app.cache.get(payload._id + ':' + payload.dt)
    assert(dt === undefined)
  })

  it('create user', async () => {
    const ctx = app.mockContext()

    ctx.user = Users.admin

    const fns = [ 'owner', 'maintainer', 'developer', 'tester', 'guest' ].map(name => {
      return resolves.user.create(ctx, { ...Users[name], status: 1 })
    })

    await Promise.all(fns)

    const allUsers = await resolves.user.all(ctx)
    assert(allUsers.length === 6)
  })

  it('user info', async () => {
    const ctx = app.mockContext()
    const admin = await resolves.user.login(ctx, Users.admin)
    ctx.user = admin
    let info = await resolves.user.info(ctx, {})
    assert(info.name === admin.name)

    const guest = await resolves.user.login(ctx, Users.guest)
    info = await resolves.user.info(ctx, { _id: guest._id })
    assert(info.name === guest.name)
  })

  it('normal count', async () => {
    const ctx = app.mockContext()

    const count = await resolves.user.listCount(ctx)
    assert(count === 5)
  })

  it('normal list', async () => {
    const ctx = app.mockContext()
    let list = await resolves.user.list(ctx, {})
    assert(list.length === 5)
    list = await resolves.user.list(ctx, { name: 'owne' })
    assert(list.length === 1)
    list = await resolves.user.list(ctx, { name: 'noexist' })
    assert(list.length === 0)
  })
})
