'use strict'

const fs = require('fs/promises')
const path = require('path')
const nunjucks = require('nunjucks')

const getEnum = (arr, sp = '') => {
  if (!arr) return ''
  const values = arr.map(a => sp + a.value + sp)
  return `, enum: [${values.join(', ')}]`
}

const getIndex = data => (data.index ? ', index: true' : '')

const genField = (name, data, schemas) => {
  const result = { name }

  if (data.type === 'ref' && schemas[data.ref].tag !== 'mongodb') {
    data = schemas[data.ref].content
  }

  const dv = data.defaultValue

  switch (data.type) {
    case 'integer':
    case 'biginteger':
    case 'decimal':
    case 'number':
    case 'double':
      result.text = `{ type: Number${dv ? ', default: ' + dv : ''}${getEnum(data.enum)}${getIndex(data)} },`
      break
    case 'datetime':
      result.text = '{ type: Date },'
      break
    case 'boolean':
      result.text = `{ type: Boolean, default: ${dv === 'true'} },`
      break
    case 'map':
    case 'json':
      result.text = '{},'
      break
    case 'ref':
      result.text = `{ type: Schema.Types.ObjectId, ref: '${data.ref}' },`
      break
    case 'object':
      result.text = '{'
      result.children = Object.keys(data.properties).map(k => genField(k, data.properties[k], schemas))
      break
    case 'array':
      result.text = '['
      result.children = [ genField('', data.items[0], schemas) ]
      break
    case 'uuid':
      result.text = `{ type: Schema.Types.ObjectId${getIndex(data)} },`
      break
    default:
      result.text = `{ type: String${dv ? ", default: '" + dv + "'" : ''}${getEnum(data.enum, "'")}${getIndex(data)} },`
  }

  return result
}

const createModel = async (data, schemas) => {
  const tpl = await fs.readFile(path.resolve(__dirname, './model.njk'), 'utf8')
  const name = data.name

  const fields = []
  let softDelete = false
  Object.keys(data.content.properties).forEach(k => {
    if (k === 'deletedAt') softDelete = true
    if ([ '_id', 'createdAt', 'updatedAt', 'deletedAt' ].includes(k)) return
    fields.push(genField(k, data.content.properties[k], schemas))
  })

  const template = nunjucks.compile(tpl)
  const content = template.render({ name, fields, softDelete })
  return content.replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
}

module.exports = {
  createModel,
}
