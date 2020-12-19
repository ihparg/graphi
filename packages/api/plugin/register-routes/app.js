'use strict'

const registerDev = require('./dev')
const registerProd = require('./prod')

module.exports = app => {
  const fn = app.config.graphi.mode === 'dev' ? registerDev : registerProd
  app.registerRoutes = () => fn(app)
}
