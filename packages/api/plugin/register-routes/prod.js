'use strict'

const path = require('path')
const fs = require('fs/promises')
const register = require('./register')

module.exports = async app => {
  try {
    const file = await fs.readFile(path.join(app.baseDir, 'graphi.json'), 'utf8')
    const routes = JSON.parse(file)
    register(app, routes)
  } catch (e) {
    throw new Error('接口信息加载失败')
  }
}
