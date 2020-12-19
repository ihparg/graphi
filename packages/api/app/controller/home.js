'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async health() {
    this.ctx.body = 'ok'
  }

  // 获取resolves
  async resolves() {
    const token = await this.app.cache.get('graphi:token')
    this.ctx.assert(this.ctx.request.headers.token === token)

    let resolves = await this.app.cache.get('resolves')
    if (!resolves) {
      resolves = {}
      const config = this.app.config.graphi.resolve
      Object.keys(config).forEach(key => {
        if (key === 'proxy') {
          resolves[key] = Object.keys(config[key])
        }
      })

      await this.app.cache.set('resolves', resolves, 600)
    }
    console.log(resolves)
    this.ctx.body = resolves
  }
}

module.exports = HomeController
