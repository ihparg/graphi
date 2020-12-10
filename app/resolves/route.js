'use strict'

const getFullPath = route => {
  return route.method + ':' + route.path.toLowerCase()
}

module.exports = {
  async list(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'get')

    const routes = await ctx.model.Route.find({ aid: data.aid })
    return routes
  },

  async fetchOne(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'get')
    const route = await ctx.model.Route.findById(data._id).populate('user')
    ctx.assert(route)
    return route
  },

  async save(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'update')

    data.fullPath = getFullPath(data)

    let exist
    if (data._id) {
      exist = await ctx.model.Route.exists({ aid: data.aid, fullPath: data.fullPath, _id: { $ne: data._id } })
    } else {
      exist = await ctx.model.Route.exists({ aid: data.aid, fullPath: data.fullPath })
    }
    ctx.assert(!exist, '接口路径已存在')

    let route
    if (data._id) {
      route = await ctx.model.Route.findById(data._id)
      ctx.assert(route, '接口不存在')

      Object.keys(data).forEach(k => {
        route[k] = data[k]
      })
    } else {
      route = await ctx.model.Route(data)
    }
    route.user = ctx.user._id
    // 编辑后接口状态变更为开发中
    route.status = 0
    route.save()

    // 处理refs
    await ctx.model.RouteRefs.deleteOne({ aid: route.aid, rid: route._id })
    if (data.refs && data.refs.length > 0) {
      await ctx.model.RouteRefs.create({ aid: route.aid, rid: route._id, refs: data.refs })
    }

    return route
  },

  async process(ctx, data) {
    const route = await ctx.model.Route.findById(data._id)
    ctx.assert(route, '接口不存在')
    ctx.assert(route.status < 2, '接口状态不正确')

    const op = [ 'update', 'test' ][route.status]
    await ctx.service.app.checkPermission(data.aid, op)

    route.status += 1
    route.save()

    return route.status
  },
}

