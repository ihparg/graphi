'use strict'

const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')

const parseLiteral = (ast, variables) => {
  switch (ast.kind) {
    case Kind.STRING:
      return JSON.parse(ast.value)
    case Kind.BOOLEAN:
      return ast.value
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value)
    case Kind.OBJECT: {
      const value = Object.create(null)
      ast.fields.forEach(field => {
        value[field.name.value] = parseLiteral(field.value, variables)
      })

      return value
    }
    case Kind.LIST:
      return ast.values.map(n => parseLiteral(n, variables))
    case Kind.NULL:
      return null
    case Kind.VARIABLE: {
      const name = ast.name.value
      return variables ? variables[name] : undefined
    }
    default:
      return undefined
  }
}

module.exports = new GraphQLScalarType({
  name: 'Json',
  serialize: value => {
    if (typeof value === 'string') value = JSON.parse(value)
    return value
  },
  parseValue: value => value,
  parseLiteral,
})
