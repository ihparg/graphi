'use strict'

const fs = require('fs/promises')
const path = require('path')
const nunjucks = require('nunjucks')
const { loadJsonFile } = require('./file')

const templateStr = `
{%- macro fieldBlock(fs) %}
  {% for field in fs -%}
  {% if (field.name) %}{{field.name}}:{% endif %} {{field.text | safe }}
  {% if (field.children) %}{{fieldBlock(field.children)}}{% endif %}
  {% if (field.text === '{') -%}},{% endif %}
  {% if (field.text === '[') -%}],{% endif %}
  {% endfor -%}
{% endmacro -%}
/**
 * model: {{name}}
 * 由 modelGenerator 自动生成，不要修改
 */
'use strict'
 
module.exports = ({ mongoose }) => {
  const Schema = mongoose.Schema
  const {{name}} = new Schema({
    {{- fieldBlock(fields) -}}
  }, {
    minimize: false,
    timestamps: {},
  })
  return mongoose.model('{{name}}', {{name}})
}
`

const getEnum = (arr, sp = '') => {
  if (!arr) return ''
  const values = arr.map(a => sp + a.value + sp)
  return `, enum: [${values.join(', ')}]`
}

const getIndex = data => (data.index ? ', index: true' : '')

const genField = (name, data) => {
  const result = { name }

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
      result.text = `{ type: Boolean, default: ${dv === 'true'} }`
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
      result.children = Object.keys(data.properties).map(k => genField(k, data.properties[k]))
      break
    case 'array':
      result.text = '['
      result.children = [ genField('', data.items[0]) ]
      break
    case 'uuid':
      result.text = '{ type: Schema.Types.ObjectId }'
      break
    default:
      result.text = `{ type: String${dv ? ", default: '" + dv + "'" : ''}${getEnum(data.enum, "'")}${getIndex(data)} },`
  }

  return result
}

module.exports = async (filePath, name) => {
  const data = await loadJsonFile(filePath)
  if (data.tag !== 'mongodb') return
  name = data.name

  const fields = []
  Object.keys(data.content.properties).forEach(k => {
    if ([ '_id', 'createdAt', 'updatedAt' ].includes(k)) return
    fields.push(genField(k, data.content.properties[k]))
  })

  const template = nunjucks.compile(templateStr)
  let content = template.render({ name, fields })
  content = content.replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')

  await fs.writeFile(path.resolve(__dirname, '../model', name + '.js'), content)
}
