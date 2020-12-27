'use strict'

module.exports = async (ctx, next) => {
  const token = await ctx.app.cache.get('graphi:token')
  ctx.assert(ctx.request.headers.token === token)

  await next()
}
