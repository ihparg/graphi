'use strict'

const Controller = require('egg').Controller
const resolves = require('../../resolves').resolves

module.exports = class extends Controller {
  async list() {
    const { ctx } = this
    const result = []

    Object.keys(resolves).forEach(n => {
      Object.keys(resolves[n]).forEach(m => {
        result.push(`${n}.${m}`)
      })
    })
    ctx.body = result
  }
}
