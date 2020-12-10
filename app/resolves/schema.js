'use strict'

module.exports = {
  async list(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'get')
    const schemas = await ctx.model.Schema.find({ aid: data.aid })
    return schemas
  },

  async save(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'update')

    let exist
    if (data._id) {
      exist = await ctx.model.Schema.exists({ aid: data.aid, name: data.name, _id: { $ne: data._id } })
    } else {
      exist = await ctx.model.Schema.exists({ aid: data.aid, name: data.name })
    }

    ctx.assert(!exist, data.name + ' 已存在')

    let schema
    if (data._id) {
      schema = await ctx.model.Schema.findById(data._id)
      Object.keys(data).forEach(key => {
        if (key !== '_id') schema[key] = data[key]
      })
      schema.save()

      // todo: 标记所有引用此 schema 的接口状态为开发中
      const routeRefs = await ctx.model.RouteRefs.find({ aid: data.aid, refs: schema._id })
      const ids = routeRefs.map(r => r.rid)
      await ctx.model.Route.updateMany({ _id: ids }, { $set: { status: 0 } })
    } else {
      schema = await ctx.model.Schema.create(data)
    }

    return schema
  },
}
