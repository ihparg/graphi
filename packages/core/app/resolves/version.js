'use strict'

module.exports = {
  async list(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'get')
    const versions = await ctx.model.Version.find({ aid: data.aid }, { schemas: 0, routes: 0 }).sort({ _id: -1 })
    return versions
  },

  async create(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'dev')

    const exist = await ctx.service.version.checkExist(data)
    ctx.assert(!exist, `版本号 ${data.tag} 已存在`)

    const routes = await ctx.model.Route.find({ aid: data.aid })
    const unfinished = routes.filter(r => r.status !== 2)
    ctx.assert(unfinished.length === 0, `有 ${unfinished.length} 个接口未完成，创建版本失败`)

    const schemas = await ctx.model.Schema.find({ aid: data.aid })
    const version = await ctx.model.Version(data)
    version.createdBy = ctx.user.name
    version.schemas = schemas
    version.routes = routes
    version.routeCount = routes.length

    await version.save()

    return version
  },

  async remove(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'delete')

    const version = await ctx.model.Version.findOne({ _id: data._id })
    ctx.assert(version, '版本不存在')
    await version.delete()

    await ctx.model.Recycle.create({
      aid: data.aid,
      cid: data._id,
      cname: 'version',
      content: version.tag,
      deletedBy: ctx.user._id,
    })

    return true
  },
}
