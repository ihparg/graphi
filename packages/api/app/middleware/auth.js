'use strict'

module.exports = () => async (ctx, next) => {
  const { authorization } = ctx.request.headers
  if (ctx.app.jwt && authorization) {
    try {
      const [ bearer, token ] = authorization.split(' ')
      if (bearer === 'Bearer') {
        const payload = await ctx.app.jwt.verify(token)
        ctx.payload = payload
      }
    } catch (e) {
      ctx.throw(401, '用户认证失败')
    }
  }
  await next()
}
