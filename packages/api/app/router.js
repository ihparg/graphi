'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app

  router.get('/_/health', controller.home.health)
  router.get('/_/resolve', controller.home.resolves)
}
