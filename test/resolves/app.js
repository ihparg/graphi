'use strict'

const assert = require('power-assert')
const mock = require('egg-mock')
const { loginUser } = require('./data')
const resolves = require('../../app/resolves').resolves

describe('resolves/app.js', () => {
  let app
  let admin
  let owner
  let maintainer
  before(() => {
    app = mock.app()
    return app.ready()
  })
  before(async () => {
    const ctx = app.mockContext()
    admin = loginUser(ctx, 'admin')
    owner = await loginUser(ctx, 'owner')
    maintainer = await loginUser(ctx, 'maintainer')
  })

  it('create app', async () => {
    const ctx = app.mockContext({ user: {} })

    try {
      await resolves.app.create(ctx, {})
    } catch (e) {
      assert(e.status === 403)
    }

    ctx.user = admin
    try {
      await resolves.app.create(ctx, {})
    } catch (e) {
      assert(e.status === 403)
    }
    ctx.user = owner

    await Promise.all([ 'private', 'internal', 'public' ].map((name, i) => new Promise((resolve, reject) => {
      resolves.app.create(ctx, { name: name + ' app', description: name, visibility: i }).then(id => {
        resolves.app.one(ctx, { id }).then(res => {
          assert(res.name === name + ' app')
          resolve()
        }).catch(reject)
      })
    })))
  })

  it('app list', async () => {
    const ctx = app.mockContext()
    let apps = await resolves.app.list(ctx)
    assert(apps.length === 1)

    ctx.user = owner
    apps = await resolves.app.list(ctx)
    assert(apps.length === 3)

    ctx.user = maintainer
    apps = await resolves.app.list(ctx)
    assert(apps.length === 2)
  })
})
