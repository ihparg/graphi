'use strict'

const mongodb = require('./mongodb')

module.exports = app => {
  app.nodejs = {
    mongodb,
  }
}
