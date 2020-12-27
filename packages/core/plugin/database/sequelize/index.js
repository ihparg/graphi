'use strict'

const fs = require('fs/promises')
const path = require('path')
const nunjucks = require('nunjucks')
const model = require('./model')

const createDatabase = async models => {
  const tpl = await fs.readFile(path.resolve(__dirname, './database.njk'), 'utf8')

  const template = nunjucks.compile(tpl)
  const content = template.render({ models })
  return content
}

module.exports = {
  ...model,
  createDatabase,
}
