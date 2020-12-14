'use strict'

const assert = require('power-assert')
const mock = require('egg-mock')
const { loginUser } = require('../data')

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

  const noPermission = async (ctx, _id, op) => {
    try {
      await ctx.service.app.checkPermission(_id, op)
    } catch (e) {
      assert(e.status === 403)
      assert(e.message === '没有权限')
      return
    }

    assert(false, 'should has no permission')
  }

  it('owner permission', async () => {
    const ctx = app.mockContext({ user: owner })
    let _id = (await ctx.model.App.findOne({ visibility: 0 }))._id

    await ctx.service.app.checkPermission(_id, 'owner')
    await ctx.service.app.checkPermission(_id, 'get')
    await ctx.service.app.checkPermission(_id, 'update')
    await ctx.service.app.checkPermission(_id, 'test')
    await ctx.service.app.checkPermission(_id, 'delete')
    await ctx.service.app.checkPermission(_id, 'maintainer')

    _id = (await ctx.model.App.findOne({ visibility: 1 }))._id
    await ctx.service.app.checkPermission(_id, 'owner')
    await ctx.service.app.checkPermission(_id, 'get')
    await ctx.service.app.checkPermission(_id, 'update')
    await ctx.service.app.checkPermission(_id, 'test')
    await ctx.service.app.checkPermission(_id, 'delete')
    await ctx.service.app.checkPermission(_id, 'maintainer')

    _id = (await ctx.model.App.findOne({ visibility: 2 }))._id
    await ctx.service.app.checkPermission(_id, 'owner')
    await ctx.service.app.checkPermission(_id, 'get')
    await ctx.service.app.checkPermission(_id, 'update')
    await ctx.service.app.checkPermission(_id, 'test')
    await ctx.service.app.checkPermission(_id, 'delete')
    await ctx.service.app.checkPermission(_id, 'maintainer')

    assert(true)
  })

  it('maintainer permission', async () => {
    const ctx = app.mockContext({ user: maintainer })
    let _id = (await ctx.model.App.findOne({ visibility: 0 }))._id

    noPermission(ctx, _id, 'owner')
    await ctx.service.app.checkPermission(_id, 'get')
    await ctx.service.app.checkPermission(_id, 'update')
    await ctx.service.app.checkPermission(_id, 'test')
    await ctx.service.app.checkPermission(_id, 'delete')
    await ctx.service.app.checkPermission(_id, 'maintainer')

    _id = (await ctx.model.App.findOne({ visibility: 1 }))._id
    noPermission(ctx, _id, 'owner')
    await ctx.service.app.checkPermission(_id, 'get')
    await ctx.service.app.checkPermission(_id, 'update')
    await ctx.service.app.checkPermission(_id, 'test')
    await ctx.service.app.checkPermission(_id, 'delete')
    await ctx.service.app.checkPermission(_id, 'maintainer')

    _id = (await ctx.model.App.findOne({ visibility: 2 }))._id
    noPermission(ctx, _id, 'owner')
    await ctx.service.app.checkPermission(_id, 'get')
    await ctx.service.app.checkPermission(_id, 'update')
    await ctx.service.app.checkPermission(_id, 'test')
    await ctx.service.app.checkPermission(_id, 'delete')
    await ctx.service.app.checkPermission(_id, 'maintainer')
    assert(true)
  })

  it('developer permission', async () => {
    const ctx = app.mockContext({ user: developer })
    let _id = (await ctx.model.App.findOne({ visibility: 0 }))._id

    noPermission(ctx, _id, 'owner')
    noPermission(ctx, _id, 'maintainer')
    noPermission(ctx, _id, 'test')
    noPermission(ctx, _id, 'delete')
    await ctx.service.app.checkPermission(_id, 'get')
    await ctx.service.app.checkPermission(_id, 'update')

    _id = (await ctx.model.App.findOne({ visibility: 1 }))._id
    noPermission(ctx, _id, 'owner')
    noPermission(ctx, _id, 'maintainer')
    noPermission(ctx, _id, 'test')
    noPermission(ctx, _id, 'delete')
    await ctx.service.app.checkPermission(_id, 'get')
    await ctx.service.app.checkPermission(_id, 'update')

    _id = (await ctx.model.App.findOne({ visibility: 2 }))._id
    noPermission(ctx, _id, 'owner')
    noPermission(ctx, _id, 'maintainer')
    noPermission(ctx, _id, 'test')
    noPermission(ctx, _id, 'delete')
    await ctx.service.app.checkPermission(_id, 'get')
    await ctx.service.app.checkPermission(_id, 'update')
    assert(true)
  })

  it('tester permission', async () => {
    const ctx = app.mockContext({ user: tester })
    let _id = (await ctx.model.App.findOne({ visibility: 0 }))._id

    noPermission(ctx, _id, 'owner')
    noPermission(ctx, _id, 'maintainer')
    noPermission(ctx, _id, 'update')
    noPermission(ctx, _id, 'delete')
    await ctx.service.app.checkPermission(_id, 'get')
    await ctx.service.app.checkPermission(_id, 'test')

    _id = (await ctx.model.App.findOne({ visibility: 1 }))._id
    noPermission(ctx, _id, 'owner')
    noPermission(ctx, _id, 'maintainer')
    noPermission(ctx, _id, 'update')
    noPermission(ctx, _id, 'delete')
    await ctx.service.app.checkPermission(_id, 'get')
    await ctx.service.app.checkPermission(_id, 'test')

    _id = (await ctx.model.App.findOne({ visibility: 2 }))._id
    noPermission(ctx, _id, 'owner')
    noPermission(ctx, _id, 'maintainer')
    noPermission(ctx, _id, 'update')
    noPermission(ctx, _id, 'delete')
    await ctx.service.app.checkPermission(_id, 'get')
    await ctx.service.app.checkPermission(_id, 'test')
    assert(true)
  })

  it('guest permission', async () => {
    const ctx = app.mockContext({ user: guest })
    let _id = (await ctx.model.App.findOne({ visibility: 0 }))._id

    noPermission(ctx, _id, 'owner')
    noPermission(ctx, _id, 'maintainer')
    noPermission(ctx, _id, 'update')
    noPermission(ctx, _id, 'delete')
    noPermission(ctx, _id, 'test')
    await ctx.service.app.checkPermission(_id, 'get')

    _id = (await ctx.model.App.findOne({ visibility: 1 }))._id
    noPermission(ctx, _id, 'owner')
    noPermission(ctx, _id, 'maintainer')
    noPermission(ctx, _id, 'update')
    noPermission(ctx, _id, 'delete')
    noPermission(ctx, _id, 'test')
    await ctx.service.app.checkPermission(_id, 'get')

    _id = (await ctx.model.App.findOne({ visibility: 2 }))._id
    noPermission(ctx, _id, 'owner')
    noPermission(ctx, _id, 'maintainer')
    noPermission(ctx, _id, 'test')
    noPermission(ctx, _id, 'delete')
    noPermission(ctx, _id, 'test')
    await ctx.service.app.checkPermission(_id, 'get')
    assert(true)
  })

  it('admin permission', async () => {
    const ctx = app.mockContext({ user: admin })
    let _id = (await ctx.model.App.findOne({ visibility: 0 }))._id

    noPermission(ctx, _id, 'owner')
    noPermission(ctx, _id, 'maintainer')
    noPermission(ctx, _id, 'update')
    noPermission(ctx, _id, 'delete')
    noPermission(ctx, _id, 'test')
    noPermission(ctx, _id, 'get')

    _id = (await ctx.model.App.findOne({ visibility: 1 }))._id
    noPermission(ctx, _id, 'owner')
    noPermission(ctx, _id, 'maintainer')
    noPermission(ctx, _id, 'update')
    noPermission(ctx, _id, 'delete')
    noPermission(ctx, _id, 'test')
    await ctx.service.app.checkPermission(_id, 'get')

    _id = (await ctx.model.App.findOne({ visibility: 2 }))._id
    noPermission(ctx, _id, 'owner')
    noPermission(ctx, _id, 'maintainer')
    noPermission(ctx, _id, 'test')
    noPermission(ctx, _id, 'delete')
    noPermission(ctx, _id, 'test')
    await ctx.service.app.checkPermission(_id, 'get')
    assert(true)
  })
})
