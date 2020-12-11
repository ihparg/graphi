'use strict'

module.exports = {
  async list(ctx, { aid }) {
    await ctx.service.app.checkPermission(aid, 'get')
    const result = await ctx.model.Recycle.find({ aid }).populate('deletedBy')
    return result
  },

  async restore(ctx, { _id }) {
    const log = await ctx.model.Recycle.findById(_id)
    ctx.assert(log, '记录不存在')
    await ctx.service.app.checkPermission(log.aid, 'delete')

    if (log.cname === 'route') {
      await ctx.service.route.restore(log.cid)
    } else if (log.cname === 'schema') {
      await ctx.service.schema.restore(log.cid)
    }

    await ctx.model.Recycle.deleteOne({ _id })

    return true
  },
}
