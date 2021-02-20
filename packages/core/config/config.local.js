'use strict'

module.exports = () => {
  const config = {}

  config.development = {
    watchDirs: [
      '../tools/src',
      './data/routes',
      './plugin',
    ],
  }

  return config
}
