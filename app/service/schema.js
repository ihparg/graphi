'use strict'

const Service = require('egg').Service

module.exports = class extends Service {
  async checkExist({ aid, name, _id }) {
    const { ctx } = this
    let exist
    if (_id) {
      exist = await ctx.model.Schema.findOne({ aid, name, _id: { $ne: _id } })
    } else {
      exist = await ctx.model.Schema.findOne({ aid, name })
    }

    return exist
  }

  async restore(_id) {
    const schema = await this.ctx.model.Schema.findOneDeleted({ _id })
    this.ctx.assert(schema, '记录不存在')
    const exist = await this.checkExist(schema)
    this.ctx.assert(!exist, `存在另一个 ${schema.name}，恢复失败`)
    schema.restore()
  }
}
