'use strict'

const path = require('path')

module.exports = {
  'register-routes': {
    enable: true,
    path: path.resolve(__dirname, '../plugin/register-routes'),
  },
}
