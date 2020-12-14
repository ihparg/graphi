'use strict'

const assert = require('power-assert')
const mock = require('egg-mock')
const resolves = require('../../app/resolves').resolves

describe('user test', () => {
  let app
  before(() => {
    app = mock.app()
    return app.ready()
  })

  it('init user', async () => {
    const ctx = app.mockContext()
    const data = {
      name: 'admin',
      password: '123456',
    }

    const user = await resolves.user.init(ctx, data)
    assert(data.name === user.name)
    assert(user.role === 1)

    try {
      await resolves.user.init(ctx, data)
    } catch (e) {
      assert(e.message === '已经有用户存在')
    }
  })

  it('user login', async () => {
    const ctx = app.mockContext()
    const data = {
      name: 'admin',
      password: '123456',
    }
    const user = await resolves.user.login(ctx, data)
    assert(data.name === user.name)
    assert(user.role === 1)
    assert(user.token)
  })
})
