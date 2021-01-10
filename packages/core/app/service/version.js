'use strict'

const Service = require('egg').Service

module.exports = class extends Service {
  async checkExist({ aid, tag }) {
    /*
    let exist
    if (_id) {
      exist = await ctx.model.Route.findOne({ aid, tag, _id: { $ne: _id } })
    } else {
      exist = await ctx.model.Route.findOne({ aid, tag })
    }
    */
    const exist = await this.ctx.model.Version.findOne({ aid, tag })
    return exist
  }

  async restore(_id) {
    const version = await this.ctx.model.Version.findOneDeleted({ _id })
    this.ctx.assert(version, 404, '记录不存在')
    const exist = await this.checkExist(version)
    this.ctx.assert(!exist, 503, '存在另一个相同的版本号，恢复失败')
    await version.restore()

    return version
  }
}

