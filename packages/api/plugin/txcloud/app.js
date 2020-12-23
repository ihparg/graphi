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
      let Offset = 0
      let count = 100
      while (Offset < count) {
        const result = await client.ListFunctions({ Offset, Limit: 100 })
        result.Functions.forEach(f => {
          funcs[f.Namespace + '.' + f.FunctionName] = []
        })
        count = result.TotalCount
        Offset += result.Functions.length
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
