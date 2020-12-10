'use strict'

const app = require('./app')
const route = require('./route')
const schema = require('./schema')
const user = require('./user')
const resolve = require('./resolve')

const resolves = {
  app,
  resolve,
  route,
  schema,
  user,
}

const execute = async (name, _, args, ctx) => {
  const path = name.split('.')
  try {
    const data = await resolves[path[0]][path[1]](ctx, args.data)
    return { code: 200, data }
  } catch (e) {
    ctx.logger.error(e)
    // throw e
    return { code: e.status, message: e.message }
  }
}

module.exports = {
  resolves,
  execute,
}
