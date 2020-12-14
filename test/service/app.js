'use strict'

const assert = require('power-assert')
const mock = require('egg-mock')
const { loginUser } = require('./data')

describe('service/app.js', () => {
  let app
  let admin
  let owner
  let maintainer
  let tester
  let guest
  let developer
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
  })


  it('check permission', async () => {
    const ctx = app.mockContext()
    const data = ctx.model.App.findOne({ visibility: 0 })

    ctx.user = owner
    await ctx.service.app.checkPermission(data._id, 'get')

    assert(true)
  })
})
