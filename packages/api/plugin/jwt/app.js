'use strict'

const jwt = require('jsonwebtoken')

module.exports = app => {
  const key = app.config.graphi.jwtkey
  if (!key) return
  app.jwt = {
    async verify(str) {
      const payload = await jwt.verify(str, key)
      return payload
    },
    key,
  }
}
