'use strict'

const jwt = require('jsonwebtoken')
const Stream = require('stream')
const Archiver = require('archiver')
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

  async findById(ctx, data) {
    await ctx.service.app.checkPermission(data._id, 'get')

    const app = await ctx.model.App.findById(data._id).populate('owner').populate('users.user')
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
    await ctx.app.cache.set(info._id + ':' + info.dt, info.dt)

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

    await ctx.model.App.updateOne({ _id: data.aid }, { $pull: { tokens: { _id: data._id } } })
    await ctx.app.cache.delMatches(data.aid + ':*')

    return true
  },

  async registerDevServer(ctx, data) {
    ctx.assert(data._id === ctx.user._id, '没有权限')
    await ctx.app.cache.set(`${data._id}:dev-server`, data)
    return true
  },

  async getDevServer(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'get')
    const devServer = await ctx.app.cache.get(`${data.aid}:dev-server`)
    return devServer ? devServer.host : null
  },

  async getModules(ctx, data) {
    await ctx.service.app.checkPermission(data.aid, 'get')
    const archive = Archiver('zip')
    const stream = new Stream.PassThrough()

    archive.on('error', function(err) {
      ctx.throw(500, err)
    })
    archive.on('end', function() {
      console.log('Archive wrote %d bytes', archive.pointer())
    })
    archive.pipe(stream)

    let schemas
    if (data.tag === '$latest') {
      schemas = await ctx.model.Schema.find({ aid: data.aid })
    } else {
      const version = await ctx.model.Version.findOne({ aid: data.aid, tag: data.tag })
      ctx.assert(version, 403, '版本不存在')
      schemas = version.schemas
    }

    const sequelizeModels = []

    const fns = []
    schemas.forEach(schema => {
      if ([ 'mysql', 'postgres', 'sqlite', 'sequelize' ].includes(schema.tag)) {
        fns.push(new Promise((resolve, reject) => {
          ctx.app.database.sequelize.createModel(schema, schemas).then(content => {
            archive.append(content, { name: 'node_modules/models/' + schema.name + '.js' })
            resolve(true)
          }).catch(reject)
        }))
        sequelizeModels.push(schema.name)
      }
    })

    if (sequelizeModels.length > 0) {
      const dbContent = await ctx.app.database.sequelize.createDatabase(sequelizeModels)
      archive.append(dbContent, { name: 'node_modules/database/sequelize.js' })
    }

    await Promise.all(fns)
    archive.finalize()

    ctx.attachment(data.tag + '.zip')
    ctx.set('Content-Type', 'application/zip')

    return stream
  },
}

