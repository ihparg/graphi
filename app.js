'use strict'

const dayjs = require('dayjs')
const datetime = require('@graphi/tools/src/type/datetime')

module.exports = class App {
  constructor(app) {
    this.app = app

    datetime.serialize = date => dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }
}
