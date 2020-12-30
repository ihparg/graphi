'use strict'

const graphql = require('@graphi/tools/src/graphql')
const { createProxyMiddleware } = require('http-proxy-middleware')
const c2k = require('koa-connect')

module.exports = (route, target) => {
  const validate = graphql.validateArguments(route)

  const execute = graphql(route, (name, obj, args, data) => {
    return data
  })

  return async (ctx, next) => {
    const { rawBody, body } = ctx.request
    const data = Object.assign({}, ctx.query, ctx.params, body)
    const res = validate(data)
    if (Array.isArray(res)) ctx.throw(503, res.map(e => e.message).join(';'))

    await c2k(createProxyMiddleware({
      target,
      changeOrigin: true,
      onProxyReq(proxyReq) {
        if (body && rawBody) {
          proxyReq.setHeader('Content-Length', Buffer.byteLength(rawBody))
          proxyReq.write(rawBody)
          proxyReq.end()
        }
        return proxyReq
      },
      onProxyRes(proxyRes, req, res) {
        const write = res.write
        const writeHead = res.writeHead
        let writeHeadArgs
        let body = ''
        proxyRes.on('data', function(data) {
          data = data.toString('utf-8')
          body += data
        })

        res.writeHead = (...args) => { writeHeadArgs = args }

        res.write = () => {
          let result
          try {
            const output = execute(data, JSON.parse(body), true)
            if (output.errors) {
              res.writeHead(500, { 'Content-Type': 'text/plain' })
              result = output.errors.map(e => e.message).join(';')
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json' })
              result = JSON.stringify(output.data.result)
            }
          } catch (e) {
            res.writeHead(500, { 'Content-Type': 'text/plain' })
            result = e.message
          }
          writeHead.apply(res, writeHeadArgs)
          write.call(res, result)
        }
      },
      onError(err, req, res) {
        console.log(err, res)
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end(err)
      },
    }))(ctx, next)

    await next()
  }
}
