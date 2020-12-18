'use strict'

module.exports = {
  async list(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'get')

    const devServer = await ctx.app.cache.get(`${data.aid}:dev-server`)
    if (!devServer) return null

    const options = {
      headers: { token: devServer.token },
      dataType: 'json',
    }
    const result = await ctx.curl(devServer.host + '/_/resolve', options)

    ctx.assert(result.status === 200, '获取resolves失败')

    return result.data
  },
}

