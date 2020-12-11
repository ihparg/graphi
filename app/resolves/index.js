'use strict'

const app = require('./app')
const route = require('./route')
const schema = require('./schema')
const user = require('./user')
const resolve = require('./resolve')
const recycle = require('./recycle')

const resolves = {
  app,
  resolve,
  route,
  schema,
  user,
  recycle,
}

const execute = async (name, _, args, ctx) => {
  const path = name.split('.')
  try {
    const data = await resolves[path[0]][path[1]](ctx, args.data)
    return { code: 200, data }
  } catch (e) {
    ctx.logger.error(e)
    return { code: e.status || 500, message: e.message }
  }
}

module.exports = {
  resolves,
  execute,
}
