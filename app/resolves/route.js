'use strict'

const getFullPath = route => {
  return route.method + ':' + route.path.toLowerCase()
}

module.exports = {
  async list(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'get')

    const exclude = {
      routeParams: 0,
      queryString: 0,
      requestHeaders: 0,
      requestBody: 0,
      responseHeaders: 0,
      responseBody: 0,
    }

    const routes = await ctx.model.Route.find({ aid: data.aid }, exclude).populate('updatedBy')
    return routes
  },

  async fetchOne(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'get')
    const route = await ctx.model.Route.findById(data._id).populate('updatedBy')
    ctx.assert(route)
    return route
  },

  async save(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'update')

    data.fullPath = getFullPath(data)

    const exist = await ctx.service.route.checkExist(data)
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
    route.updatedBy = ctx.user._id
    // 编辑后接口状态变更为开发中
    route.status = 0
    route.save()
    await route.populate('updatedBy').execPopulate()

    // 处理refs
    await ctx.model.RouteRefs.findOneAndUpdate(
      { aid: route.aid, rid: route._id },
      { refs: data.refs },
      { new: true, upsert: true }
    )

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

  async remove(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'delete')

    const route = await ctx.model.Route.findById(data._id)
    ctx.assert(route, '接口不存在')
    await route.delete()

    await ctx.model.Recycle.create({
      aid: data.aid,
      cid: data._id,
      cname: 'route',
      content: route.title,
      deletedBy: ctx.user._id,
    })

    return true
  },
}

