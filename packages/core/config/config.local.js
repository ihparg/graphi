'use strict'

module.exports = () => {
  const config = {}

  config.security = {
    csrf: {
      enable: false,
    },
  }

  config.development = {
    watchDirs: [
      '../tools/src',
      './data/routes',
      './plugin',
    ],
  }

  return config
}
