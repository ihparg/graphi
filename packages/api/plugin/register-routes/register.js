'use strict'

const { createProxyMiddleware } = require('http-proxy-middleware')
const c2k = require('koa-connect')

module.exports = (app, routes) => {
  const proxy = {}

  const rp = app.config.graphi.resolve.proxy || {}
  Object.keys(rp).forEach(key => {
    proxy[key] = c2k(createProxyMiddleware({ target: rp[key], changeOrigin: true }))
  })

  routes.forEach(r => {
    app.router[r.method.toLowerCase()](r.path, proxy.default)
  })
}
