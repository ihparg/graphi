# Graphi-API
Graphi 网关。用来提供接口数据mock和云函数调用功能。

## Requirements
```
nodejs >= 12
redis 可选
```

## Usage
```
git clone https://github.com/ihparg/graphi-api.git
```

可以修改 config.js 文件启动项目，默认配置如下
```
{
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
    // 当前环境，会作为参数传递给Faas函数
    env: process.env.GRAPHI_ENV || 'prod',

    // api 启动时，会将本服务地址注册到graphi-core服务，用来交换接口文档内容
    // 注册到文档平台的本机地址，用来测试接口和获取函数配置
    localhost: 'http://localhost:7002',

    // 如果需要网关jwt校验，可以提供jwt key开启
    jwtkey: process.env.GRAPHI_JWTKEY || null,

    // 获取接口内容参数
    host: process.env.GRAPHI_HOST || 'http://localhost:7001',
    // graphi-core里创建的项目Id
    appId: process.env.GRAPHI_APP_ID || '0',
    // 在graphi-core的项目下创建的token
    token: process.env.GRAPHI_TOKEN || '',
    // 使用的接口文档版本
    version: process.env.GRAPHI_VERSION || '$latest',

    resolve: {
      // 除了调用Faas外，网关也可以代理接口到指定地址
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
  }
}
```

可以通过启动参数修改配置启动

## Env
GRAPHI_ENV 设置为 dev 时，为开发模式，此模式下，接口内容会动态读取graphi-core数据。标记为开发中的接口会调用mock数据返回。

GRAPHI_ENV 设置为其他值时，网关只会读取一次接口数据，生成静态文件，以后启动不会再读取接口信息。

## Feature
目前已完成功能
- 开发中接口Mock
- 接口代理
- grahpql 数据过滤校验
- 腾讯云Faas接口调用
- 阿里云Faas接口调用

