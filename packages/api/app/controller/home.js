'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async health() {
    this.ctx.body = 'ok'
  }
}

module.exports = HomeController
