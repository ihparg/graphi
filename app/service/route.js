'use strict'

const Service = require('egg').Service

module.exports = class extends Service {
  async checkExist({ aid, fullPath, _id }) {
    const { ctx } = this
    let exist
    if (_id) {
      exist = await ctx.model.Route.findOne({ aid, fullPath, _id: { $ne: _id } })
    } else {
      exist = await ctx.model.Route.findOne({ aid, fullPath })
    }

    return exist
  }

  async restore(_id) {
    const route = await this.ctx.model.Route.findOneDeleted({ _id })
    this.ctx.assert(route, 404, '记录不存在')
    const exist = await this.checkExist(route)
    this.ctx.assert(!exist, 503, '存在另一个相同路径的接口，恢复失败')
    await route.restore()

    return route
  }
}

