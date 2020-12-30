'use strict'

const tencentcloud = require('tencentcloud-sdk-nodejs')
const graphql = require('@graphi/tools/src/graphql')

const ScfClient = tencentcloud.scf.v20180416.Client

module.exports = app => {
  const config = app.config.graphi.resolve['faas-tx']
  if (!config) return

  const clientConfig = {
    credential: {
      secretId: config.secretId,
      secretKey: config.secretKey,
    },
    region: config.region,
    profile: {},
  }

  const client = new ScfClient(clientConfig)

  app.txcloud = {
    async listFunctions() {
      const funcs = {}
      const namespace = config.namespace ? [ ...config.namespace ] : [ 'default' ]
      let ns = namespace.pop()
      while (ns) {
        const result = await client.ListFunctions({ Limit: 100, Namespace: ns })
        result.Functions.forEach(f => {
          funcs[f.Namespace + '.' + f.FunctionName] = []
        })
        ns = namespace.pop()
      }
      return funcs
    },

    async listVersions(func) {
      const [ Namespace, FunctionName ] = func.split('.')
      const result = await client.ListVersionByFunction({ FunctionName, Namespace, Order: 'DESC' })
      return result.FunctionVersion
    },

    async invoke(data) {
      const response = await client.Invoke(data)
      return response.Result
    },

    registerRoute(route, func, version, skipGraphql) {
      const [ Namespace, FunctionName ] = func.split('.')
      app.router[route.method.toLowerCase()](route.path, async ctx => {
        const body = Object.assign({}, ctx.query, ctx.params, ctx.request.body)

        if (skipGraphql) {
          const ClientContext = JSON.stringify({ body, env: app.config.graphi.env })
          const response = await app.txcloud.invoke({ Namespace, FunctionName, Qualifier: version, ClientContext }, ctx)
          ctx.body = JSON.parse(response.RetMsg)
        } else {
          const execute = await graphql(route, async (_, obj, args) => {
            const ClientContext = JSON.stringify({ body: args, env: app.config.graphi.env })
            const res = await app.txcloud.invoke({ Namespace, FunctionName, Qualifier: version, ClientContext }, ctx)
            return JSON.parse(res.RetMsg)
          })
          const response = await execute(body)
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
