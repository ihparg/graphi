'use strict'

const path = require('path')

module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  redis: {
    enable: !!process.env.REDIS_URL,
    package: 'egg-redis',
  },
  database: {
    enable: true,
    path: path.resolve(__dirname, '../plugin/database'),
  },
}
