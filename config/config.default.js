'use strict'

const path = require('path')

module.exports = app => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {}

  config.keys = process.env.APP_KEYS || (app.name + '_1602347723076_8844')

  config.middleware = [ 'error' ]

  config.static = {
    prefix: '/public/',
  }

  config.mongoose = {
    url: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/graphi',
    options: {},
  }

  config.redis = {
    client: {
      port: 6379,
      host: process.env.REDIS_URL || '127.0.0.1',
      password: null,
      db: 0,
    },
  }

  // add your user config here
  const userConfig = {
    schemaPath: path.join(app.baseDir, 'data/schemas'),
    routePath: path.join(app.baseDir, 'data/routes'),
  }

  return {
    ...config,
    ...userConfig,
  }
}
