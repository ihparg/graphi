'use strict'
const assert = require('power-assert')
const mock = require('egg-mock')
const ObjectId = require('mongoose').Types.ObjectId
const testData = require('./test.json')
const { loginUser } = require('../data')
const resolves = require('../../app/resolves').resolves

const _ = resolves.version

describe('resolves/version.js', () => {
  let app
  let maintainer
  let _aid
  before(() => {
    app = mock.app()
    return app.ready()
  })
  before(async () => {
    const ctx = app.mockContext()
    maintainer = await loginUser(ctx, 'maintainer')
    _aid = (await ctx.model.App.findOne({}))._id
  })

  it('create version', async () => {
    const ctx = app.mockContext({ user: maintainer })
    testData.aid = _aid
    const routes = await resolves.route.list(ctx, { aid: _aid })
    try {
      await _.create(ctx, { aid: _aid })
    } catch (err) {
      assert(err.message === `有 ${routes.length} 个接口未完成，创建版本失败`)
    }

    // 两次进入已完成
    await Promise.all(routes.map(r => resolves.route.process(ctx, r)))
    await Promise.all(routes.map(r => resolves.route.process(ctx, r)))
    await _.create(ctx, { aid: _aid, tag: 'v2' })
    const version = await _.create(ctx, { aid: _aid, tag: 'v1' })
    assert(version.routes.length === 2)
  })

  it('list versions', async () => {
    const ctx = app.mockContext({ user: maintainer })
    const list = await _.list(ctx, { aid: _aid })
    assert(list.length === 2)
  })

  it('remove version', async () => {
    const ctx = app.mockContext({ user: maintainer })
    const _id = (await _.list(ctx, { aid: _aid }))[0]._id.toString()
    try {
      await _.remove(ctx, { aid: _aid, _id: new ObjectId() })
      throw new Error('should not pass')
    } catch (err) {
      assert(err.status === 500)
      assert(err.message = '版本不存在')
    }
    const isDel = await _.remove(ctx, { aid: _aid, _id })
    assert(isDel === true)

    const recycle = await resolves.recycle.list(ctx, { aid: _aid })
    assert(recycle[0].cid.toString() === _id)

    const list = await _.list(ctx, { aid: _aid })
    assert(list.length === 1)

  })
})
