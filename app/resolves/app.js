'use strict'

const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId
const { ROLES } = require('../utils/const')

module.exports = {
  async list(ctx) {
    const query = {}
    if (!ctx.user) {
      query.visibility = 2
    } else if (ctx.user.role !== 1) {
      query.$or = [{ 'users.user': ctx.user._id }, { visibility: { $ne: 0 } }]
    }

    const result = await ctx.model.App.find(query).populate('owner')
    return result
  },

  async create(ctx, data) {
    ctx.assert(ctx.user.role === 0, 403, '没有权限')
    const app = await ctx.model.App(data)
    app.owner = ctx.user._id
    app.users.push({ role: 1, user: ctx.user._id })
    await app.save()

    return app._id
  },

  async one(ctx, data) {
    await ctx.service.app.checkPermission(data.id, 'get')

    const app = await ctx.model.App.findOne({ _id: data.id }).populate('owner').populate('users.user')
    ctx.assert(app, 404)

    return app
  },

  async addMember(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'owner')
    const app = await ctx.model.App.findById(data.aid)

    const exist = app.users.find(u => u.user.toString() === data.user._id)
    ctx.assert(!exist, '用户在项目内已存在')

    app.users.push({ role: data.role, user: data.user._id })
    await app.save()

    ctx.service.app.removeCache(data.user._id, data.aid)

    return true
  },

  async removeMember(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'owner')

    await ctx.model.App.updateOne({ _id: data.aid }, { $pull: { users: { user: data._id } } })
    ctx.service.app.removeCache(data._id, data.aid)

    return true
  },

  async changeMember(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'owner')
    const app = await ctx.model.App.findById(data.aid)

    const user = app.users.find(u => u.user.toString() === data._id)
    user.role = data.role
    await app.save()

    ctx.service.app.removeCache(data._id, data.aid)

    return true
  },

  async getTokens(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'maintainer')
    const app = await ctx.model.App.findById(data.aid)
    return app.tokens
  },

  async createToken(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'maintainer')
    const app = await ctx.model.App.findById(data.aid)

    const info = {
      _id: app._id,
      role: ROLES.app,
      dt: Date.now(),
    }
    const token = jwt.sign(info, ctx.app.config.keys)
    await ctx.app.cache.set(info._id + ':' + info.dt, info.dt, 3600 * 24)

    app.tokens.push({
      _id: ObjectId(),
      description: data.description,
      createdAt: info.dt,
      createdBy: ctx.user.name,
      token,
    })
    await app.save()

    return app.tokens
  },

  async removeToken(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'maintainer')

    const result = await ctx.model.App.updateOne({ _id: data.aid }, { $pull: { tokens: { _id: data._id } } })
    console.log(result)
    await ctx.app.cache.delMatches(data.aid + ':*')

    return true
  },
}

