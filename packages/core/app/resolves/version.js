'use strict'

module.exports = {
  async list(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'get')
    const versions = await ctx.model.Version.find({ aid: data.aid })
    return versions
  },

  async create(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'dev')

  },

  async remove(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'delete')

  },
}
