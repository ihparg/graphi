'use strict'

const path = require('path')

module.exports = {
  'register-routes': {
    enable: true,
    path: path.resolve(__dirname, '../plugin/register-routes'),
  },
  txcloud: {
    enable: !!process.env.GRAPHI_FAAS_TX,
    path: path.resolve(__dirname, '../plugin/txcloud'),
  },
  aliyun: {
    enable: !!process.env.GRAPHI_FAAS_ALI,
    path: path.resolve(__dirname, '../plugin/aliyun'),
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  'graphi-jwt': {
    enable: true,
    path: path.resolve(__dirname, '../plugin/jwt'),
  },
}
