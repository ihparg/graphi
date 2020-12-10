'use strict'

const isJSON = body => {
  return !(
    !body ||
    typeof body === 'string' ||
    typeof body.pipe === 'function' ||
    Buffer.isBuffer(body)
  )
}

module.exports = () => {
  return async function responseWrap(ctx, next) {
    await next()

    if (isJSON(ctx.body)) {
      ctx.body = {
        code: 200,
        data: ctx.body,
      }
    }
  }
}
