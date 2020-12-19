'use strict'

const assert = require('power-assert')
const mock = require('egg-mock')
const ObjectId = require('mongoose').Types.ObjectId
const { loginUser } = require('../data')
const _ = require('../../app/resolves').resolves.schema

describe('resolves/schema.js', () => {
  let app
  let owner
  let _aid
  before(() => {
    app = mock.app()
    return app.ready()
  })
  before(async () => {
    const ctx = app.mockContext()
    owner = await loginUser(ctx, 'owner')
    _aid = (await ctx.model.App.findOne({}))._id
  })

  it('create schema', async () => {
    const ctx = app.mockContext({ user: owner })
    const shop = { aid: _aid, name: 'shop', description: 'shop description', tag: 'mongodb', content: { type: 'object' } }
    await _.save(ctx, shop)

    const schemas = await _.list(ctx, { aid: _aid })
    assert(schemas.length === 1)
    const schema = schemas[0]
    assert(schema.name === 'shop')
    assert(schema.tag === 'mongodb')
    assert.deepEqual(schema.content, shop.content)

    try {
      await _.save(ctx, shop)
      throw new Error('should not pass')
    } catch (err) {
      assert(err.status === 500)
      assert(err.message = 'shop 已存在')
    }
  })

  it('update schema', async () => {
    const ctx = app.mockContext({ user: owner })
    const b = await _.save(ctx, { aid: _aid, name: 'book1', description: 'book description', tag: 'mongodb', content: { type: 'object' } })

    await _.save(ctx, { _id: b._id, aid: _aid, name: 'book' })
    const book = await _.findOne(ctx, { aid: _aid, _id: b._id })
    assert(book.name === 'book')

    try {
      await _.save(ctx, { _id: b._id, aid: _aid, name: 'shop' })
      throw new Error('should not pass')
    } catch (err) {
      assert(err.status === 500)
      assert(err.message = 'shop 已存在')
    }
  })

  it('remove schema', async () => {
    const ctx = app.mockContext({ user: owner })
    const obj = { aid: _aid, name: 'article', description: 'article description', tag: 'mongodb', content: { type: 'object' } }
    const article = await _.save(ctx, obj)
    let list = await _.list(ctx, { aid: _aid })
    assert(list.length === 3)

    await _.remove(ctx, { aid: _aid, _id: article._id })
    list = await _.list(ctx, { aid: _aid })
    assert(list.length === 2)

    try {
      await ctx.service.schema.restore(new ObjectId())
      throw new Error('should not pass')
    } catch (err) {
      assert(err.status === 404)
      assert(err.message = '记录不存在')
    }

    await ctx.service.schema.restore(article._id)
    list = await _.list(ctx, { aid: _aid })
    assert(list.length === 3)

    await _.remove(ctx, { aid: _aid, _id: article._id })
    await _.save(ctx, obj)

    try {
      await ctx.service.schema.restore(article._id)
      throw new Error('should not pass')
    } catch (err) {
      assert(err.status === 503)
      assert(err.message = '存在另一个 article，恢复失败')
    }

  })
})
