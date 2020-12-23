'use strict'

const Service = require('egg').Service

const ROLES = {
  maintainer: 1,
  developer: 2,
  tester: 3,
  guest: 4,
  owner: 9,
}

module.exports = class extends Service {
  async checkPermission(aid, op = 'get') {
    const { ctx } = this
    const key = ctx.user._id + ':app:' + aid

    let role = ctx.user._id === aid ? ROLES.guest : await this.app.cache.get(key)

    if (role == null) {
      const app = await ctx.model.App.findById(aid)
      ctx.assert(app, '应用不存在')

      if (app.owner.toString() === ctx.user._id) {
        role = ROLES.owner
      } else {
        const user = app.users.find(u => u.user.toString() === ctx.user._id)

        if (user) role = user.role
        // 如果不在用户列表里，私有应用设为无权限，其他应用设为guest
        else role = app.visibility === 0 ? 0 : ROLES.guest
      }

      // 缓存1小时
      this.app.cache.set(key, role, 3600)
    }

    if (op === 'owner') {
      ctx.assert(role === ROLES.owner, 403, '没有权限')
    }

    // maintainer 有下列所有权限
    if (role === ROLES.owner || role === ROLES.maintainer) return

    switch (op) {
      case 'get':
      case 'guest':
        ctx.assert(role !== 0, 403, '没有权限')
        break
      case 'dev':
      case 'update':
        ctx.assert(role === ROLES.developer, 403, '没有权限')
        break
      case 'test':
        ctx.assert(role === ROLES.tester, 403, '没有权限')
        break
      case 'delete':
      case 'maintainer':
        ctx.assert(role === ROLES.maintainer, 403, '没有权限')
        break
      default:
        ctx.throw(new Error('没有权限'))
    }
  }

  async removeCache(_id, aid) {
    const key = _id + ':app:' + aid
    this.app.cache.del(key)
  }

  async checkToken(obj, token) {
    const app = await this.ctx.model.App.findOne({ _id: obj._id })
    const exist = app.tokens.find(t => t.token === token)

    if (!exist) return false

    await this.app.cache.set(`${obj._id}:${obj.dt}`, Date.now())
    return true
  }
}
