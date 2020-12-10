'use strict'

const jwt = require('jsonwebtoken')
const { createPwd, checkPwd } = require('../utils/pwd')

module.exports = {
  async init(ctx, data) {
    const exist = await ctx.model.User.exists({})
    ctx.assert(!exist, '已经有用户存在')

    data.password = createPwd(data.password)
    data.status = 1
    data.role = 1 // 管理员

    const user = await ctx.model.User.create(data)

    return user
  },

  async all(ctx) {
    ctx.assert(ctx.user.role === 1)
    const users = await ctx.model.User.find({})
    return users
  },

  async normal(ctx, { name }) {
    const query = { status: 1, role: 0 }
    let limit = 1000
    if (name) {
      query.name = { $regex: new RegExp(name, 'i') }
      limit = 10
    }
    const users = await ctx.model.User.find(query).limit(limit)
    return users
  },

  async normalCount(ctx) {
    const count = await ctx.model.User.count({ status: 1, role: 0 })
    return count
  },

  async login(ctx, data) {
    const user = await ctx.model.User.findOne({ name: data.name })
    ctx.assert(user && checkPwd(data.password, user.password), '用户名或密码不正确')
    ctx.assert(user.status === 1, '用户账号已停用')

    const info = { _id: user._id, dt: Date.now(), role: user.role }
    const token = jwt.sign(info, ctx.app.config.keys)

    user.lastLoginAt = Date.now()
    user.save()

    await ctx.cache.set(user._id + ':' + info.dt, info.dt, 3600 * 24)
    user.token = token

    return user
  },

  async logout(ctx) {
    ctx.cache.del(ctx.user._id + ':' + ctx.user.dt)
    return true
  },

  async info(ctx, data) {
    const id = data.id || ctx.user._id
    const user = await ctx.model.User.findById(id)
    ctx.assert(user, '用户不存在')

    return user
  },

  async create(ctx, data) {
    ctx.assert(ctx.user.role === 1, '没有权限')
    const user = await ctx.model.User(data)
    user.save()
    return user
  },
}
