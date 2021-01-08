'use strict'
const Mock = require('@graphi/mockjs')
const ROUND = 10


const getItem = (v, word) => {
  if (v.exampleValue) return v.exampleValue
  if (v.defaultValue) return v.defaultValue
  if (v.enum) return `@pick([${(v.enum.map(r => r.value)).join(', ')}])`
  if (v.minimum && v.maximum) return `@${word}(${v.minimum}, ${Math.floor(Math.random() * ROUND) + v.minimum})`
  if (v.maximum) return `@${word}(0, ${v.maximum})`
  return `@${word}()`
}

const getKey = function(key, v) {
  switch (v.type) {
    case 'array':
      if (v.minItems && v.maxItems) return `${key}|${v.minItems}-${v.maxItems}`
      if (v.minItems) return `${key}|${v.minItems}-${Math.floor(Math.random() * ROUND) + v.minItems}`
      if (v.maxItems) return `${key}|0-${v.maxItems}`
      return key
    default:
      return key
  }
}

// mockjs 枚举用pick
const getTpl = function(v) {
  switch (v.type) {
    case 'integer' :
      return getItem(Object.assign({}, v, { maximum: 2147483640 }), 'natural')
    case 'biginteger':
      return getItem(v, 'natural')
    case 'decial' || 'double':
      return getItem(v, 'float')
    case 'string':
      return getItem(v, 'word')
    case 'text':
      return getItem(v, 'text')
    case 'datetime':
      return getItem(v, 'datetime')
    case 'uuid':
      return getItem(v, 'id')
    case 'map':
      return { map: getTpl(v.items[0]) }
    case 'array':
      return [ getTpl(v.items[0]) ]
    case 'object':
      return Object.keys(v.properties).reduce((prev, k) => {
        prev[getKey(k, v)] = getTpl(v.properties[k])
        return prev
      }, {})
    default:
      return ''
  }
}

const getValue = obj => {
  const tpl = getTpl(obj)
  return Mock.mock(tpl)
}

module.exports = {
  getTpl,
  getValue,
  mock: Mock.mock,
}
