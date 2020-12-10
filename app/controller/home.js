'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index.html')
    /*
    if (this.app.config.env === 'local') {
      const html = await this.ctx.curl('http://' + this.ctx.hostname + ':7000/index.html')
      this.ctx.set('content-type', 'text/html')
      this.ctx.body = html.data
    } else {
      await this.ctx.render('index.html')
    }
    */
  }
}

module.exports = HomeController
