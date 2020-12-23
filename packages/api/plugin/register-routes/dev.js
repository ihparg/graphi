'use strict'

const register = require('./register')

module.exports = async app => {
  const { host, appId, token, version = 'latest' } = app.config.graphi
  const url = `${host}/api/route/${appId}/version/${version}`
  const headers = {}
  if (token) headers.Authorization = token
  const result = await app.curl(url, { headers, dataType: 'json' })

  register(app, result.data.data)
}
