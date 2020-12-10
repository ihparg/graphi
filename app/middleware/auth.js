'use strict'

const jwt = require('jsonwebtoken')

module.exports = needLogin => async (ctx, next) => {
  if (needLogin) {
    const { authorization } = ctx.request.headers
    ctx.assert(authorization, 401, '用户未登录')
    const [ , token ] = authorization.split(' ')

    try {
      const user = await jwt.verify(token, ctx.app.config.keys)

      const rk = await ctx.cache.get(user._id + ':' + user.dt)
      ctx.assert(rk, 401, '登录超时，请重新登录')

      ctx.user = user
    } catch (e) {
      ctx.throw(401, '登录超时，请重新登录')
    }
  }
  await next()
}
