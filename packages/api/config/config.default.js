/* eslint valid-jsdoc: "off" */

'use strict'

const userConfig = require('../config')

module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = process.env.APP_KEYS || (appInfo.name + '_1607867947548_5744')

  // add your middleware config here
  config.middleware = []

  config.redis = {
    client: {
      port: process.env.REDIS_PORT || 6379,
      host: process.env.REDIS_URL || '127.0.0.1',
      password: process.env.REDIS_PASSWORD || null,
      db: 0,
    },
  }

  return {
    ...config,
    ...userConfig,
  }
}
