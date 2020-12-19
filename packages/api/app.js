'use strict'

const createCache = require('./app/utils/cache')

module.exports = class App {
  constructor(app) {
    this.app = app
  }

  async willReady() {
    this.app.cache = createCache(this.app.redis)
  }

  async didLoad() {
    await this.app.registerRoutes()
  }
}
