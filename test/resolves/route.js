'use strict'

const assert = require('power-assert')
const mock = require('egg-mock')
const ObjectId = require('mongoose').Types.ObjectId
const { loginUser } = require('../data')
const resolves = require('../../app/resolves').resolves
const _ = resolves.route

describe('resolves/route.js', () => {
  let app
  let maintainer
  let _aid
  let schema
  before(() => {
    app = mock.app()
    return app.ready()
  })
  before(async () => {
    const ctx = app.mockContext()
    maintainer = await loginUser(ctx, 'maintainer')
    _aid = (await ctx.model.App.findOne({}))._id
    schema = await ctx.model.Schema.findOne({})
  })

  it('create route', async () => {
    const ctx = app.mockContext({ user: maintainer })
    const getShop = {
      aid: _aid,
      title: 'get shop',
      description: 'shop description',
      tag: 'shop',
      method: 'GET',
      path: '/api/shop',
    }
    const _id = (await _.save(ctx, getShop))._id.toString()

    const list = await _.list(ctx, { aid: _aid })
    assert(list.length === 1)
    assert(list[0]._id.toString() === _id)
    assert(list[0].fullPath === 'GET:/api/shop')

    try {
      await _.save(ctx, getShop)
      throw new Error('should not pass')
    } catch (err) {
      assert(err.status === 500)
      assert(err.message = '接口路径已存在')
    }
  })

  it('update route', async () => {
    const ctx = app.mockContext({ user: maintainer })
    const createShop = {
      aid: _aid,
      title: 'get shop',
      description: 'shop description',
      tag: 'shop',
      method: 'POST',
      path: '/api/shop',
      requestBoy: {},
    }
    const _id = (await _.save(ctx, createShop))._id.toString()

    const list = await _.list(ctx, { aid: _aid })
    assert(list.length === 2)

    try {
      await _.save(ctx, { aid: _aid, _id, method: 'GET', path: '/api/shop' })
      throw new Error('should not pass')
    } catch (err) {
      assert(err.status === 500)
      assert(err.message = '接口路径已存在')
    }

    await _.save(ctx, {
      aid: _aid,
      _id,
      title: 'create shop',
      method: 'POST', path: '/api/shop',
      refs: [ schema._id.toString() ],
    })

    const route = await _.findOne(ctx, { aid: _aid, _id })
    assert(route.title === 'create shop')

    const routeRefs = await ctx.model.RouteRefs.findOne({ aid: _aid, rid: _id })
    assert(routeRefs.refs.length === 1)
    assert(routeRefs.refs[0].toString() === schema._id.toString())
  })

  it('route refs', async () => {
    const ctx = app.mockContext({ user: maintainer })
    try {
      await resolves.schema.remove(ctx, { aid: _aid, _id: schema._id.toString() })
      throw new Error('should not pass')
    } catch (e) {
      assert(e.status === 500)
      assert(e.message === '接口create shop引用了此Schema，不能删除')
    }
  })

  it('route status', async () => {
    const ctx = app.mockContext({ user: maintainer })
    const routeRefs = await ctx.model.RouteRefs.findOne({ aid: _aid })
    const _id = routeRefs.rid
    let route = await _.findOne(ctx, { aid: _aid, _id })
    assert(route.status === 0)
    await _.process(ctx, { aid: _aid, _id })
    route = await ctx.model.Route.findById(_id)
    assert(route.status === 1)
    await _.process(ctx, { aid: _aid, _id })
    route = await ctx.model.Route.findById(_id)
    assert(route.status === 2)

    try {
      await _.process(ctx, { aid: _aid, _id })
      throw new Error('should not pass')
    } catch (e) {
      assert(e.status === 500)
      assert(e.message === '接口状态不正确')
    }

    await _.save(ctx, {
      aid: _aid,
      _id,
      title: 'create shop',
      method: 'POST', path: '/api/shop',
      refs: [ schema._id.toString() ],
    })

    route = await ctx.model.Route.findById(_id)
    assert(route.status === 0)

    await _.process(ctx, { aid: _aid, _id })
    route = await ctx.model.Route.findById(_id)
    assert(route.status === 1)

    await resolves.schema.save(ctx, { aid: _aid, _id: schema._id })

    route = await ctx.model.Route.findById(_id)
    assert(route.status === 0)
  })

  it('remove route', async () => {
    const ctx = app.mockContext({ user: maintainer })
    const routeRefs = await ctx.model.RouteRefs.findOne({ aid: _aid })
    const _id = routeRefs.rid
    const route = await _.findOne(ctx, { aid: _aid, _id })

    const cloneRoute = JSON.parse(JSON.stringify(route))
    delete cloneRoute._id

    await _.remove(ctx, { aid: _aid, _id })
    let list = await _.list(ctx, { aid: _aid })
    assert(list.length === 1)

    try {
      await ctx.service.route.restore(new ObjectId())
      throw new Error('should not pass')
    } catch (err) {
      assert(err.status === 404)
      assert(err.message = '记录不存在')
    }

    await ctx.service.route.restore(_id)
    list = await _.list(ctx, { aid: _aid })
    assert(list.length === 2)

    await _.remove(ctx, { aid: _aid, _id })
    await _.save(ctx, cloneRoute)

    try {
      await ctx.service.route.restore(_id)
      throw new Error('should not pass')
    } catch (err) {
      assert(err.status === 503)
      assert(err.message = '存在另一个相同路径的接口，恢复失败')
    }
  })
})
