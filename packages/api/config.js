/**
 * 用户配置文件，使用自己的配置文件替换此文件
 */
'use strict'

module.exports = {
  // 默认使用redis，如要关闭，请修改config/plugin.js
  redis: {
    client: {
      port: process.env.REDIS_PORT || 6379,
      host: process.env.REDIS_URL || '127.0.0.1',
      password: process.env.REDIS_PASSWORD || null,
      db: 0,
    },
  },
  graphi: {
    env: process.env.GRAPHI_ENV || 'prod',

    // 注册到文档平台的本机地址，用来测试接口和获取函数配置
    localhost: process.env.LOCALHOST || 'http://localhost:7002',

    jwtkey: process.env.GRAPHI_JWTKEY || null,

    // 获取接口内容参数
    host: process.env.GRAPHI_HOST || 'http://localhost:7001',
    appId: process.env.GRAPHI_APP_ID || '0',
    token: process.env.GRAPHI_TOKEN || '',
    version: process.env.GRAPHI_VERSION || '$latest',

    resolve: {
      // 代理接口配置
      /**
      proxy: {
        default: 'http://localhost:7001',
      },
      */

      /**
       * 腾讯云函数配置
       * 'faas-tx': {
       *   secretId: '',
       *   secretKey: '',
       *   region: '',
       *   namespace: ['default'],
       * },
       */
      'faas-tx': JSON.parse(process.env.GRAPHI_FAAS_TX || 'null'),

      /**
       * 阿里云函数配置
       * 'faas-ali': {
       *   accountId: '',
       *   accessKeyID: '',
       *   accessKeySecret: '',
       *   region: '',
       *   service: ['default']
       * },
      */

      'faas-ali': JSON.parse(process.env.GRAPHI_FAAS_ALI || 'null'),
    },
  },
}
