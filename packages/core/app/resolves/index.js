'use strict'

const app = require('./app')
const route = require('./route')
const schema = require('./schema')
const user = require('./user')
const resolve = require('./resolve')
const recycle = require('./recycle')
const version = require('./version')

const resolves = {
  app,
  resolve,
  route,
  schema,
  user,
  recycle,
  version,
}

const execute = async (name, obj, args, ctx) => {
  const [ , m, f ] = name.split(/[:\.]/)
  try {
    const data = await resolves[m][f](ctx, args.data)
    return obj === 'noWrap' ? data : { code: 200, data }
  } catch (e) {
    ctx.logger.error(e)
    return { code: e.status || 500, message: e.message }
  }
}

module.exports = {
  resolves,
  execute,
}
