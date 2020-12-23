'use strict'

const fs = require('fs/promises')
const { ObjectId } = require('mongodb')
const { flattenRoute } = require('@graphi/tools/src/route')
const Controller = require('egg').Controller
const { loadDir } = require('../../utils/file')
const { getFullPath } = require('../../utils/route')

module.exports = class extends Controller {
  async index() {
    const { ctx, app } = this
    const routes = await loadDir(app.config.routePath)
    ctx.body = routes
  }

  async save() {
    const { ctx, app } = this
    const { body } = ctx.request

    if (!body._id) body._id = `${ObjectId()}`
    body.fullPath = getFullPath(body)

    const path = app.config.routePath + '/' + body._id
    await fs.writeFile(path, JSON.stringify(body, null, 2))

    ctx.body = body
  }

  async latest() {
    const { ctx, app } = this
    const routes = await loadDir(app.config.routePath)
    const schemas = await loadDir(app.config.schemaPath)

    ctx.body = routes.map(r => flattenRoute(r, schemas))
  }
}

