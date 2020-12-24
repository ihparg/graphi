'use strict'

const mongoose = require('./moogoose')
const sequelize = require('./sequelize')

module.exports = app => {
  app.nodejs = {
    mongoose,
    sequelize,
  }
}
