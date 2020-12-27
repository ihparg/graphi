'use strict'

const fs = require('fs/promises')
const path = require('path')
const nunjucks = require('nunjucks')

const isDb = tag => [ 'mysql', 'postgres', 'sqlite', 'sequelize' ].includes(tag)

const genField = (name, data, schemas) => {
  const result = { name }
  if (data.type === 'ref' && !isDb(schemas[data.ref].tag)) {
    data = schemas[data.ref].content
  }

  let defaultValue = data.defaultValue ? `, defaultValue: '${data.defaultValue.resplace("'", "\\'")}'` : ''
  let type

  switch (data.type) {
    case 'integer':
      type = 'Sequelize.INTEGER'
      if (data.maximum) {
        const maximum = parseInt(data.maximum)
        if (maximum < 128) type = 'Sequelize.TINYINT'
        else if (maximum < 32768) type = 'Sequelize.SMALLINT'
        else if (maximum < 8388608) type = 'Sequelize.MEDIUMINT'
      }
      break
    case 'biginteger':
      type = 'Sequelize.BIGINT'
      break
    case 'decimal':
      type = 'Sequelize.DECIMAL'
      break
    case 'double':
      type = 'Sequelize.DOUBLE'
      break
    case 'datetime':
      type = 'Sequelize.DATE'
      if (data.defaultValue === 'NOW') defaultValue = ', defaultValue: Sequelize.NOW'
      break
    case 'boolean':
      type = 'Sequelize.BOOLEAN'
      if (data.defaultValue) defaultValue = data.defaultValue === 'true' || defaultValue === true ? 'true' : 'false'
      break
    case 'uuid':
      type = 'Sequelize.UUID'
      defaultValue = ''
      break
    case 'blob':
      type = 'Sequelize.BLOB'
      defaultValue = ''
      break
    case 'array':
    case 'json':
    case 'object':
    case 'map':
      type = 'Sequelize.JSONTYPE'
      break
    case 'string':
      type = 'Sequelize.STRING'
      if (data.maxLength) type = `Sequelize.STRING(${data.maxLength})`
      break
    case 'text':
      type = 'Sequelize.TEXT'
      if (data.maxLength > 65536) type = "Sequelize.TEXT('medium')"
      break
    default:
      return null
  }

  if (name === 'id') {
    data.required = true
    defaultValue = ', primaryKey: true, unique: true, autoIncrement: true'
  }

  result.text = `{ type: ${type}, allowNull: ${data.required ? 'false' : 'true'}${defaultValue} }`

  return result
}

const getOptions = (data, schemas) => {
  const name = data.name
  const fieldList = []
  let softDelete = false
  let time = 0

  Object.keys(data.content.properties).forEach(k => {
    if (k === 'deletedAt') softDelete = true
    if (k === 'createdAt' || k === 'updatedAt') time += 1
    fieldList.push(genField(k, data.content.properties[k], schemas))
  })

  return {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    description: data.description,
    timestamps: time === 2,
    fieldList,
    softDelete,
  }
}

const createModel = async (data, schemas) => {
  const options = getOptions(data, schemas)
  const tpl = await fs.readFile(path.resolve(__dirname, './model.njk'), 'utf8')

  const template = nunjucks.compile(tpl)
  const content = template.render(options)
  return content.replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
}

module.exports = {
  createModel,
}
