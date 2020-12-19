/**
 * 用户配置文件，使用自己的配置文件替换此文件
 */
'use strict'

module.exports = {
  graphi: {
    mode: process.env.GRAPHI_MODE || 'prod',

    // 注册到文档平台的本机地址，用来测试接口和获取函数配置
    localhost: 'http://localhost:7002',

    // 获取接口内容参数
    host: process.env.GRAPHI_HOST || 'http://localhost:7000',
    appId: process.env.GRAPHI_APP_ID || '0',
    token: process.env.GRAPHI_TOKEN || '',

    resolve: {
      // 代理接口配置
      proxy: {
        default: 'http://localhost:7000',
      },

      /**
       * 腾讯云函数配置
       * 'faas-tx': {
       *   secretId: '',
       *   secretKey: '',
       *   region: '',
       *  },
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
