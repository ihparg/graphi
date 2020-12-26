'use strict'

const tencentcloud = require('tencentcloud-sdk-nodejs')

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
  }
}
