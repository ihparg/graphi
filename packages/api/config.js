/**
 * 用户配置文件，使用自己的配置文件替换此文件
 */
'use strict'

module.exports = {
  graphi: {
    env: process.env.GRAPHI_ENV || 'prod',

    // 注册到文档平台的本机地址，用来测试接口和获取函数配置
    localhost: 'http://localhost:7002',

    jwtkey: process.env.GRAPHI_JWTKEY || null,

    // 获取接口内容参数
    host: process.env.GRAPHI_HOST || 'http://localhost:7001',
    appId: process.env.GRAPHI_APP_ID || '0',
    token: process.env.GRAPHI_TOKEN || '',
    version: process.env.GRAPHI_VERSION || '$latest',

    resolve: {
      // 代理接口配置
      proxy: {
        default: 'http://localhost:7001',
      },

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
       * },
      */
    },
  },
}
