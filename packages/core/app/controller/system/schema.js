'use strict'

const fs = require('fs/promises')
const path = require('path')
const Controller = require('egg').Controller
const { loadDir } = require('../../utils/file')
const genModel = require('../../utils/genModel')

class SchemaController extends Controller {
  async index() {
    const { ctx, app } = this
    const schemas = await loadDir(app.config.schemaPath)
    ctx.body = schemas
  }

  async save() {
    const { ctx, app } = this
    const { body } = ctx.request

    // 系统文件的 _id 暂未用到
    body._id = body.name
    const filePath = path.resolve(app.config.schemaPath, body.name)

    await fs.writeFile(filePath, JSON.stringify(body, null, 2))
    let schemas = await loadDir(app.config.schemaPath)
    schemas = schemas.reduce((obj, s) => {
      obj[s.name] = s
      return obj
    }, {})

    if (body.tag === 'mongodb') genModel(filePath, body.name, schemas)

    ctx.body = body
  }
}

module.exports = SchemaController
