'use strict'

const { app } = require('egg-mock/bootstrap');

before(async () => {
  const models = app.mongoose.models
  const fns = Object.keys(models).map(name => {
    return models[name].deleteMany({})
  })

  await Promise.all(fns)
})