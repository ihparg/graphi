'use strict'

const { registerRoutes } = require('./utils/route')
const auth = require('./middleware/auth')

const jsonWrapper = async (ctx, next) => {
  await next()
  ctx.body = {
    code: 200,
    data: ctx.body,
  }
}

module.exports = app => {
  const { controller } = app

  const router = app.router.namespace('/api')

  router.get('/schema/0/list', jsonWrapper, auth(true), controller.system.schema.index)
  router.get('/route/0', jsonWrapper, auth(true), controller.system.route.index)
  router.get('/route/0/version/latest', jsonWrapper, controller.system.route.latest)
  router.get('/resolve/0/list', jsonWrapper, auth(true), controller.system.resolve.list)

  // 只有本地开发模式可以保存
  if (app.config.env === 'local') {
    router.post('/route/0/save', jsonWrapper, controller.system.route.save)
    router.post('/schema/0/save', jsonWrapper, controller.system.schema.save)
  }

  registerRoutes(app.router, app.config)

  app.router.get(/^(?!\/api\/)/, controller.home.index)
}
