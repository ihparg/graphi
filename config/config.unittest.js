'use strict'

module.exports = () => {
  const config = {}

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/graphi-test',
    options: {},
  }

  return config
}
