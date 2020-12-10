'use strict'

module.exports = {
  async list(ctx) {
    const query = {}
    if (ctx.user.role !== 1) {
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
    app.save()

    return app._id
  },

  async one(ctx, data) {
    const app = await ctx.model.App.findById(data.id).populate('owner').populate('users.user')
    ctx.assert(app, 404)
    const hasPermission = app.users.find(u => {
      // eslint-disable-next-line eqeqeq
      return u.user._id == ctx.user._id
    })
    ctx.assert(hasPermission, 403, '没有权限')

    return app
  },

  async addMember(ctx, data) {
    const app = await ctx.model.App.findById(data.aid)
    ctx.assert(app, 404)
    ctx.assert(app.owner.toString() === ctx.user._id, '没有权限')

    const exist = app.users.find(u => u.user.toString() === data.user._id)
    ctx.assert(!exist, '用户在项目内已存在')

    app.users.push({ role: data.role, user: data.user._id })
    app.save()

    return true
  },

  async removeMember(ctx, data) {
    const app = await ctx.model.App.findById(data.aid)
    ctx.assert(app, 404)
    ctx.assert(app.owner.toString() === ctx.user._id, '没有权限')

    await ctx.model.App.update({ _id: data.aid }, { $pull: { users: { user: data._id } } })

    return true
  },
}

