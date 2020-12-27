'use strict'

const devAuth = require('./middleware/devAuth')

module.exports = app => {
  const { router, controller } = app

  router.get('/_/health', controller.home.health)

  if (app.config.graphi.env === 'dev') {
    router.get('/_/resolve', devAuth, controller.dev.resolves)
    router.post('/_/versions', devAuth, controller.dev.versions)
    router.post('/_/refresh/route', devAuth, controller.dev.refreshRoute)
  }
}
