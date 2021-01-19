'use strict'

const FCClient = require('@alicloud/fc2')
const graphql = require('@graphi/tools/src/graphql')

module.exports = app => {
  const config = app.config.graphi.resolve['faas-ali']
  if (!config) return

  const client = new FCClient(config.accountId, {
    accessKeyID: config.accessKeyID,
    accessKeySecret: config.accessKeySecret,
    region: config.region,
    timeout: 10000, // Request timeout in milliseconds, default is 10s
  })

  app.aliyun = {
    async listFunctions() {
      const funcs = {}
      const service = config.service ? [ ...config.service ] : [ 'default' ]
      let serviceName = service.pop()
      while (serviceName) {
        const result = await client.listFunctions(serviceName, { limit: 100 })

        // eslint-disable-next-line no-loop-func
        result.data.functions.forEach(f => {
          funcs[serviceName + '.' + f.functionName] = []
        })
        serviceName = service.pop()
      }
      return funcs
    },

    async listVersions(func) {
      const [ serviceName ] = func.split('.')
      const result = await client.listVersions(serviceName)
      return [ 'LATEST', ...result.data.versions.map(v => v.versionId) ]
    },

    async invoke(data) {
      const result = await client.invokeFunction(data.serviceName, data.functionName, data.event, data.headers, data.qualifier)
      return result.data
    },

    registerRoute(route, func, version, skipGraphql) {
      const [ serviceName, functionName ] = func.split('.')
      app.router[route.method.toLowerCase()](route.path, async ctx => {
        const body = Object.assign({}, ctx.query, ctx.params, ctx.request.body)

        let event = {
          env: app.config.graphi.env,
          jwtkey: app.config.graphi.jwtkey,
          headers: ctx.request.headers,
          payload: ctx.payload,
        }

        if (route.requestHeaders && route.requestHeaders.properties.Authorization && route.requestHeaders.properties.Authorization.required) {
          if (!ctx.payload) ctx.throw(401, '用户鉴权失败')
        }

        if (skipGraphql) {
          event = JSON.stringify({ body, ...event })
          const response = await app.aliyun.invoke({ serviceName, functionName, qualifier: version, event }, ctx)
          ctx.body = JSON.parse(response)
        } else {
          const execute = await graphql(route, async (_, obj, args) => {
            event = JSON.stringify({ body: args.data, ...event })
            let res = await app.aliyun.invoke({ serviceName, functionName, qualifier: version, event }, ctx)
            console.log(res)
            res = JSON.parse(res)
            if (res.errorCode === -1) {
              ctx.logger.error(serviceName, functionName, version, res)
              throw new Error(res.errorMessage)
            }
            return res
          })
          const response = await execute(body)
          console.log('return', response)
          if (response.errors) {
            ctx.status = 500
            ctx.body = response.errors[0].message
          } else {
            ctx.body = response.data.result
          }
        }
      })
    },
  }
}
