'use strict'

const { createProxyMiddleware } = require('http-proxy-middleware')
const c2k = require('koa-connect')
const { getTpl, mock } = require('@graphi/tools/src/mock')

module.exports = (app, routes) => {
  const proxy = {}

  const rp = app.config.graphi.resolve.proxy || {}
  Object.keys(rp).forEach(key => {
    proxy[key] = c2k(createProxyMiddleware({ target: rp[key], changeOrigin: true }))
  })

  routes.forEach(r => {
    const tpl = getTpl(r.responseBody)

    const exec = app.router[r.method.toLowerCase()]

    if (r.status === 0 && app.config.graphi.env === 'dev') {
      // 未完成的接口,使用mock数据
      exec(r.path, ctx => {
        ctx.body = mock(tpl)
      })
      return
    }
    try {
      const [ type, func, version ] = r.resolve.split(/[:@]/)
      if (type === 'proxy') {
        exec(r.path, proxy[func])
        return
      }

      if (type === 'faas-tx') {
        const [ Namespace, FunctionName ] = func.split('.')
        exec(r.path, async ctx => {
          const result = await app.txcloud.invoke({ Namespace, FunctionName, Qualifier: version }, {})
          ctx.body = JSON.parse(result.RetMsg)
        })
      }
    } catch (e) {
      console.log(r)
      app.logger.error(e)
    }
  })
}
