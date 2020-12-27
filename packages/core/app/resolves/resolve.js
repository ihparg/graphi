'use strict'

const cacheWrap = async (ctx, key, fn) => {
  let result = await ctx.app.cache.get(key)
  if (!result) {
    result = await fn()
    await ctx.app.cache.set(key, result, 600)
  }
  return result
}

module.exports = {
  async list(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'get')

    const key = `${data.aid}:resolves`

    if (data.force) {
      await ctx.app.cache.delMatches(key + '*')
    }

    const resolves = await cacheWrap(ctx, key, async () => {
      const devServer = await ctx.app.cache.get(`${data.aid}:dev-server`)
      if (!devServer) return null

      const options = {
        headers: { token: devServer.token },
        dataType: 'json',
      }
      const result = await ctx.curl(devServer.host + '/_/resolve', options)
      console.log(result)
      ctx.assert(result.status === 200, '获取resolves失败')
      return result.data
    })

    return resolves
  },

  async versions(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'get')

    const key = `${data.aid}:resolves:${data.func}`
    const versions = await cacheWrap(ctx, key, async () => {
      const devServer = await ctx.app.cache.get(`${data.aid}:dev-server`)
      const options = {
        headers: { token: devServer.token },
        dataType: 'json',
        method: 'POST',
        data,
      }
      const result = await ctx.curl(devServer.host + '/_/versions', options)

      ctx.assert(result.status === 200, '获取versions失败')
      return result.data
    })

    return versions
  },
}

