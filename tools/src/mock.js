'use strict'
const Mock = require('@graphi/mockjs')

const getTpl = (v, word) => {
  if (v.exampleValue) return v.exampleValue
  if (v.enum) return `@pick([${(v.enum.map(r => r.value)).join(', ')}])`
  if (v.minimum || v.maximum) return `@${word}(${v.minimum}, ${v.maximum})`
  return `@${word}()`
}

const getKey = function(key, v) {
  const ROUND = 10
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
const getValue = function(v) {
  switch (v.type) {
    case 'integer' :
      return getTpl(v, 'natural')
    case 'decial' || 'double':
      return getTpl(v, 'float')
    case 'string':
      return getTpl(v, 'word')
    case 'text':
      return getTpl(v, 'text')
    case 'datetime':
      return getTpl(v, 'datetime')
    case 'uuid':
      return getTpl(v, 'id')
    case 'map':
      return { map: getValue(v.items[0]) }
    case 'array':
      return [ getValue(v.items[0]) ]
    case 'object':
      return Object.keys(v.properties).reduce((prev, k) => {
        prev[getKey(k, v)] = getValue(v.properties[k])
        return prev
      }, {})
    default:
      return ''
  }
}

const getMock = function(route) {
  const { responseBody } = route
  const { properties } = responseBody

  const mockTpl = Object.keys(properties).reduce((prev, k) => {
    prev[getKey(k, properties[k])] = getValue(properties[k])
    return prev
  }, {})

  const mockValue = Mock.mock(mockTpl)
  return mockValue
}


module.exports = {
  getMock,
}
