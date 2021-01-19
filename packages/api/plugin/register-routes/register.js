'use strict'

const { createProxyMiddleware } = require('http-proxy-middleware')
const c2k = require('koa-connect')
const { getTpl, mock } = require('@graphi/tools/src/mock')
const proxyWithGraphql = require('./proxy')

module.exports = (app, routes) => {
  const proxy = {}

  const rp = app.config.graphi.resolve.proxy || {}
  Object.keys(rp).forEach(key => {
    proxy[key] = c2k(createProxyMiddleware({ target: rp[key], changeOrigin: true }))
  })

  routes.forEach(r => {
    const exec = app.router[r.method.toLowerCase()]

    if (r.status === 0 && app.config.graphi.env === 'dev') {
      // 未完成的接口,使用mock数据
      const tpl = getTpl(r.responseBody)
      exec(r.path, ctx => {
        ctx.body = mock(tpl)
      })
      return
    }

    try {
      let [ type, func, version ] = r.resolve.split(/[:@]/)
      const skipGraphql = type[0] === '*'
      if (skipGraphql) type = type.substr(1)

      if (type === 'proxy') {
        if (skipGraphql) return exec(r.path, proxy[func])
        return exec(r.path, proxyWithGraphql(r, rp[func]))
      }

      if (type === 'faas-tx') {
        return app.txcloud.registerRoute(r, func, version, skipGraphql)
      }

      if (type === 'faas-ali') {
        return app.aliyun.registerRoute(r, func, version, skipGraphql)
      }

      app.logger.error(r.title + ' 没有匹配的resolve')
    } catch (e) {
      app.logger.error(e)
    }
  })

  app.logger.info(routes.length + ' routes registered')
}
