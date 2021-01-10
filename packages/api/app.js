'use strict'

const dayjs = require('dayjs')
const createCache = require('./app/utils/cache')
const datetime = require('@graphi/tools/src/type/datetime')

module.exports = class App {
  constructor(app) {
    this.app = app
    datetime.serialize = date => dayjs(date).format(app.config.dateFormat)
  }

  async willReady() {
    this.app.cache = createCache(this.app.redis)
  }

  async didLoad() {
    await this.app.registerRoutes()
  }
}
