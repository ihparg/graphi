'use strict'

const { flattenRoute } = require('@graphi/tools/src/route')
const { flattenSchemas } = require('@graphi/tools/src/schema')
const graphql = require('@graphi/tools/src/graphql')
const auth = require('../middleware/auth')
const resolve = require('../resolves')
const { loadDir } = require('./file')
const { filterProps } = require('./objects')

const registerRoutes = async (router, config) => {
  let schemas = await loadDir(config.schemaPath)
  schemas = flattenSchemas(schemas)
  const routes = await loadDir(config.routePath)

  routes.forEach(r => {
    const route = flattenRoute(r, schemas)
    const execute = graphql(route, resolve.execute)
    const needLogin = route.requestHeaders && route.requestHeaders.properties.Authorization

    const inputSchemaKeys = Object.keys(Object.assign(
      {},
      (route.queryString || {}).properties,
      (route.routeParams || {}).properties,
      (route.requestBody || {}).properties
    ))


    router[route.method.toLowerCase()](route.path, auth(needLogin), async function(ctx) {
      const args = Object.assign({}, ctx.query, ctx.params, ctx.request.body)
      // 过滤掉第一层不要的数据
      filterProps(args, inputSchemaKeys)
      const res = await execute(args, ctx)

      if (res.errors) {
        ctx.body = { code: 500, message: res.errors[0].message }
        ctx.logger.error(new Error(res.errors))
      } else {
        ctx.body = res.data.result
      }
    })
  })
}

const getFullPath = route => {
  return route.method + ':' + route.path.toLowerCase()
}

module.exports = { registerRoutes, getFullPath }
