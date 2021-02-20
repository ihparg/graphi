# Graphi-core
Graphi 文档管理平台，可单独使用，用来管理接口文档信息。

## Requirements
```
mongodb >= 4
nodejs >= 12
redis 可选
```

## Usage
```
git clone https://github.com/ihparg/graphi-core.git
cd graphi-core
// 不使用redis，使用内存缓存，只能启用一个worker
npx egg-scripts start --daemon --workers=1
// 使用redis，需要传入redis地址
REDIS_URL=127.0.0.1 npx egg-scripts start --daemon
```

更多启动参数
```
APP_KEYS - eggjs secret key
REDIS_URL - redis地址
REDIS_PORT - redis端口，默认值： 6379
REDIS_PASSWORD - redis密码，默认值：null
MONGODB_URL - mongodb链接地址，默认值：mongodb://127.0.0.1:27017/graphi
```

浏览器访问 http://127.0.0.1:7001

## Init
第一个登录用户自动注册为管理员账号。（管理员账号不能创建项目，需要用管理员账号创建普通账号，以普通账号登录继续创建项目）

## Feature
目前已完成功能
- Schema 管理，复用数据结构和生成model代码
- Route 管理
- CodeGenerator
  - node sequelize 代码生成
- 开发中接口Mock（需要graphi-api配合）
- 腾讯云Faas接口预览调用（需要graphi-api配合）
- 阿里云Faas接口预览调用（需要graphi-api配合）
- 项目接口版本管理

