'use strict'

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
}
