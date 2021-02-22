'use strict'

const fs = require('fs/promises')
const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    if (!this.indexHtml) {
      this.indexHtml = await fs.readFile(this.app.baseDir + '/app/public/index.html', 'utf-8')
    }
    this.ctx.body = this.indexHtml
  }
}

module.exports = HomeController
