'use strict'

const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')

let parseDate = str => {
  const d = new Date(str)
  return Number.isNaN(d.getTime()) ? null : d
}

let serialize = value => value.toString()

module.exports = {
  set serialize(fn) {
    serialize = fn
  },
  set parse(fn) {
    parseDate = fn
  },
  datetimeType: new GraphQLScalarType({
    name: 'DateTime',
    serialize: value => serialize(value),
    parseValue: value => parseDate(value),
    parseLiteral: ast => (ast.kind === Kind.STRING ? parseDate(ast.value) : null),
  }),
}
