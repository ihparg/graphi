'use strict'

const register = require('./register')

module.exports = async app => {
  const { host, appId, token } = app.config.graphi
  const url = `${host}/api/route/${appId}/version/$latest`
  const headers = {}
  if (token) headers.Authorization = token
  const result = await app.curl(url, { headers, dataType: 'json' })

  app.router.stack = app.router.stack.filter(r => r.path.startsWith('/_/'))

  register(app, result.data.data)
}
