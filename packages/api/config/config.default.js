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
  config.middleware = [ 'auth' ]

  config.security = {
    csrf: {
      enable: false,
    },
  }

  config.dateFormat = 'YYYY-MM-DD HH:mm:ss'

  exports.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  }

  return {
    ...config,
    ...userConfig,
  }
}
