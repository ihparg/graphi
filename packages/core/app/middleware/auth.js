'use strict'

const jwt = require('jsonwebtoken')
const { ROLES } = require('../utils/const')

module.exports = needLogin => async (ctx, next) => {
  if (needLogin) {
    const { authorization } = ctx.request.headers
    ctx.assert(authorization, 401, '用户未登录')
    const [ , token ] = authorization.split(' ')

    try {
      const user = await jwt.verify(token, ctx.app.config.keys)

      const rk = await ctx.app.cache.get(user._id + ':' + user.dt)
      if (!rk) {
        if (user.role === ROLES.app) {
          const checked = await ctx.service.app.checkToken(user, token)
          if (!checked) ctx.throw(401, 'Token验证失败')
        } else {
          ctx.throw(401, '登录超时，请重新登录')
        }
      }

      ctx.user = user
    } catch (e) {
      console.error(e)
      ctx.throw(401, '登录超时，请重新登录')
    }
  }
  await next()
}
