'use strict'

const assert = require('power-assert')
const jwt = require('jsonwebtoken')
const mock = require('egg-mock')
const { loginUser } = require('../data')
const _ = require('../../app/resolves').resolves.app

describe('resolves/app.js', () => {
  let app
  let admin
  let owner
  let maintainer
  let tester
  let guest
  let developer
  let stranger
  before(() => {
    app = mock.app()
    return app.ready()
  })
  before(async () => {
    const ctx = app.mockContext()
    admin = loginUser(ctx, 'admin')
    owner = await loginUser(ctx, 'owner')
    maintainer = await loginUser(ctx, 'maintainer')
    tester = await loginUser(ctx, 'tester')
    guest = await loginUser(ctx, 'guest')
    developer = await loginUser(ctx, 'developer')
    stranger = await loginUser(ctx, 'stranger')
  })


  it('create app', async () => {
    const ctx = app.mockContext({ user: {} })

    try {
      await _.create(ctx, {})
    } catch (e) {
      assert(e.status === 403)
    }

    ctx.user = admin
    try {
      await _.create(ctx, {})
    } catch (e) {
      assert(e.status === 403)
    }
    ctx.user = owner

    await Promise.all([ 'private', 'internal', 'public' ].map((name, i) => new Promise((resolve, reject) => {
      _.create(ctx, { name: name + ' app', description: name, visibility: i }).then(_id => {
        _.findById(ctx, { _id }).then(res => {
          assert(res.name === name + ' app')
          resolve()
        }).catch(reject)
      })
    })))
  })

  it('app list', async () => {
    const ctx = app.mockContext()
    let apps = await _.list(ctx)
    assert(apps.length === 1)

    ctx.user = owner
    apps = await _.list(ctx)
    assert(apps.length === 3)

    ctx.user = maintainer
    apps = await _.list(ctx)
    assert(apps.length === 2)
  })

  it('add member', async () => {
    const ctx = app.mockContext({ user: owner })
    let apps = await _.list(ctx)
    await Promise.all(apps.map(a => (
      Promise.all([
        _.addMember(ctx, { aid: a._id.toString(), user: maintainer, role: 1 }),
        _.addMember(ctx, { aid: a._id.toString(), user: developer, role: 2 }),
        _.addMember(ctx, { aid: a._id.toString(), user: tester, role: 3 }),
        _.addMember(ctx, { aid: a._id.toString(), user: guest, role: 4 }),
      ])
    )))

    apps = await _.list(ctx)
    apps.forEach(a => {
      assert(a.users.length === 5)
    })
  })

  it('change/remove member', async () => {
    const ctx = app.mockContext({ user: owner })
    const _id = (await ctx.model.App.findOne({}))._id
    await _.addMember(ctx, { aid: _id, user: stranger, role: 4 })
    let _app = await _.findById(ctx, _id)
    let user = _app.users.find(u => u.user._id.toString() === stranger._id)
    assert(user.user.name === stranger.name)
    assert(user.role === 4)

    await _.changeMember(ctx, { aid: _id, _id: stranger._id, role: 1 })
    _app = await _.findById(ctx, _id)
    user = _app.users.find(u => u.user._id.toString() === stranger._id)
    assert(user.role === 1)

    ctx.user = stranger
    await ctx.service.app.checkPermission(_id, 'maintainer')
    try {
      await _.removeMember(ctx, { aid: _id, _id: user._id })
    } catch (e) {
      assert(e.message === '没有权限')
    }

    ctx.user = owner
    await _.removeMember(ctx, { aid: _id, _id: stranger._id })
    _app = await _.findById(ctx, _id)

    assert(_app.users.length === 5)
    user = _app.users.find(u => u.user._id.toString() === stranger._id)
    assert(!user)

    try {
      await ctx.service.app.checkPermission(_id, 'maintainer')
    } catch (e) {
      assert(e.message === '没有权限')
    }
  })

  it('app token', async () => {
    const ctx = app.mockContext({ user: owner })
    const _id = (await ctx.model.App.findOne({}))._id

    let tokens = await _.createToken(ctx, { aid: _id, description: 'hello' })
    assert(tokens.length === 1)

    tokens = await _.getTokens(ctx, { aid: _id })

    const token = tokens[0]
    assert(token.description === 'hello')
    assert(token.createdBy === owner.name)
    const payload = await jwt.verify(token.token, app.config.keys)
    assert(payload.role === 2)

    await _.removeToken(ctx, { aid: _id, _id: token._id })
    tokens = await _.getTokens(ctx, { aid: _id })
    assert(tokens.length === 0)
  })
})
