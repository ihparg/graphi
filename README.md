# Graphi
Graphi是一个Faas接口管理平台，包含接口文档，接口网关两个部分。接口文档用来定义数据结构（Schema）和接口以及接口开发中的测试，也可以用作传统项目的接口文档管理。接口网关实现文档和接口的转换，通过graphql实现数据mock（dev模式下），数据校验，过滤等功能。
![业务架构](./docs/images/1.png)

## QuickStart

<!-- add docs here for user -->
### Development

```bash
$ yarn bootstrap
$ yarn dev:core
$ yarn dev:web
$ yarn dev:api
$ open http://localhost:7000/
```

### Deploy

```bash
```

### npm scripts
