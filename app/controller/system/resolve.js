'use strict'

const Controller = require('egg').Controller
const resolves = require('../../resolves').resolves

module.exports = class extends Controller {
  async list() {
    const { ctx } = this
    const result = {}

    Object.keys(resolves).forEach(n => {
      const versions = []
      Object.keys(resolves[n]).forEach(m => {
        versions.push(m)
      })
      result[n] = versions
    })
    ctx.body = { func: result }
  }
}
