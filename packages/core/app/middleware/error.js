'use strict'

module.exports = () => async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    if (e.status !== 401) {
      ctx.logger.error(e)
    }
    ctx.body = {
      code: e.status,
      message: e.message,
    }
  }
}
