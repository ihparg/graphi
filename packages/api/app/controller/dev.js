'use strict'

const Controller = require('egg').Controller

class DevController extends Controller {
  async versions() {
    const { type, func } = this.ctx.request.body
    let versions

    if (type === 'faas-tx') {
      versions = await this.app.txcloud.listVersions(func)
    }

    if (type === 'faas-ali') {
      versions = await this.app.aliyun.listVersions(func)
    }

    this.ctx.body = versions
  }

  // 获取resolves
  async resolves() {
    const resolves = {}
    const config = this.app.config.graphi.resolve

    if (config.proxy) {
      resolves.proxy = Object.keys(config.proxy)
    }

    if (config['faas-tx']) {
      resolves['faas-tx'] = await this.app.txcloud.listFunctions()
    }

    if (config['faas-ali']) {
      resolves['faas-ali'] = await this.app.aliyun.listFunctions()
    }

    this.ctx.body = resolves
  }

  async refreshRoute() {
    // 不要 await
    this.app.registerRoutes()

    this.ctx.body = true
  }
}

module.exports = DevController
