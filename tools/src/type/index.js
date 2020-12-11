'use strict'

const { GraphQLInt, GraphQLFloat, GraphQLString, GraphQLBoolean } = require('graphql')
const { datetimeType } = require('./datetime')
const jsonType = require('./json')

const types = [
  'boolean',
  'datetime',
  'decimal',
  'double',
  'integer',
  'json',
  'ref',
  'object',
  'string',
  'text',
  'map',
  'uuid',
]

module.exports = type => {
  let fieldType = type
  if (types.includes(type)) {
    switch (type) {
      case 'boolean':
        fieldType = GraphQLBoolean
        break
      case 'integer':
        fieldType = GraphQLInt
        break
      case 'decimal':
      case 'double':
        fieldType = GraphQLFloat
        break
      case 'map':
      case 'json':
        fieldType = jsonType
        break
      case 'string':
      case 'text':
      case 'uuid':
        fieldType = GraphQLString
        break
      case 'datetime':
        fieldType = datetimeType
        break
      default:
        fieldType = type
        break
    }
  }
  return fieldType
}
