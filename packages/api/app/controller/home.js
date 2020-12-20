'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async health() {
    this.ctx.body = 'ok'
  }

  async versions() {
    const token = await this.app.cache.get('graphi:token')
    this.ctx.assert(this.ctx.request.headers.token === token)

    const { type, func } = this.ctx.request.body
    let versions

    if (type === 'faas-tx') {
      versions = await this.app.txcloud.listVersions(func)
    }

    this.ctx.body = versions
  }

  // 获取resolves
  async resolves() {
    const token = await this.app.cache.get('graphi:token')
    this.ctx.assert(this.ctx.request.headers.token === token)

    const resolves = {}
    const config = this.app.config.graphi.resolve

    if (config.proxy) {
      resolves.proxy = Object.keys(config.proxy)
    }

    if (config['faas-tx']) {
      resolves['faas-tx'] = await this.app.txcloud.listFunctions()
    }

    this.ctx.body = resolves
  }
}

module.exports = HomeController
