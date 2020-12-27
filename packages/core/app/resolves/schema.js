'use strict'

module.exports = {
  async list(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'get')
    const schemas = await ctx.model.Schema.find({ aid: data.aid }).populate('updatedBy')
    return schemas
  },

  async findOne(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'get')
    const schema = await ctx.model.Schema.findOne({ _id: data._id })
    return schema
  },

  async save(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'update')

    const exist = await ctx.service.schema.checkExist(data)
    ctx.assert(!exist, data.name + ' 已存在')

    data.updatedBy = ctx.user._id

    let schema
    if (data._id) {
      schema = await ctx.model.Schema.findById(data._id)
      Object.keys(data).forEach(key => {
        if (key !== '_id') schema[key] = data[key]
      })
      await schema.save()

      // todo: 标记所有引用此 schema 的接口状态为开发中
      const routeRefs = await ctx.model.RouteRefs.find({ aid: data.aid, refs: schema._id })
      const ids = routeRefs.map(r => r.rid)
      await ctx.model.Route.updateMany({ _id: ids }, { $set: { status: 0 } })
    } else {
      schema = await ctx.model.Schema.create(data)
    }

    // 不要 await
    ctx.service.app.refreshPub(schema.aid)

    return schema
  },

  async remove(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'delete')

    const ref = await ctx.model.RouteRefs.findOne({ aid: data.aid, refs: data._id })
    if (ref) {
      const route = await ctx.model.Route.findById(ref.rid)
      ctx.throw(new Error(`接口${route.title}引用了此Schema，不能删除`))
    }
    const schema = await ctx.model.Schema.findById(data._id)
    ctx.assert(schema, 'Schema 不存在')
    await schema.delete()

    await ctx.model.Recycle.create({
      aid: data.aid,
      cid: data._id,
      cname: 'schema',
      deletedBy: ctx.user._id,
      content: schema.name,
    })

    // 不要 await
    ctx.service.app.refreshPub(schema.aid)

    return true
  },
}
