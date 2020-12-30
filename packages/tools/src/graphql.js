'use strict'

const { graphql, graphqlSync, GraphQLSchema, GraphQLInt, GraphQLInputObjectType, GraphQLObjectType, GraphQLNonNull, GraphQLList } = require('graphql')
const { parse } = require('graphql/language/parser')
const { buildExecutionContext } = require('graphql/execution/execute')
const convertType = require('./type')

const isEmpty = val => {
  if (val == null) return true
  if (val.length !== undefined) return val.length === 0
  if (val instanceof Date) return false
  if (typeof val === 'object') return Object.keys(val).length === 0

  return false
}

// query ===============================================

const pad = length => Array.from({ length }, () => ' ').join('')

const formatBody = (obj, indent = 4) => {
  let str = ''
  switch (obj.type) {
    case 'array':
      str += formatBody(obj.items[0], indent)
      break
    case 'object':
      str += ' {\n'
      Object.keys(obj.properties).forEach(key => {
        str += pad(indent) + key + formatBody(obj.properties[key], indent + 2) + '\n'
      })
      str += pad(indent - 2) + '}'
      break
    default:
  }

  return str
}

const createQuery = (args, body, method) => {
  method = method === 'GET' ? 'query' : 'mutation'
  let query = ''
  if (isEmpty(args.properties)) {
    query = `${method} {
  result${formatBody(body)} 
}`
  } else {
    query = `${method} ($data: InputSchema) {
  result (data: $data)${formatBody(body)} 
}`
  }

  return query
}

// schema ===============================================

const emptyFields = { empty: { type: GraphQLInt } }

const emptyQuery = new GraphQLObjectType({
  name: 'query',
  fields: emptyFields,
})

const createType = (field, name, isInput, resolve) => {
  let propsType = ''
  if (field.type === 'object') {
    const propsTypeDefined = {
      name,
      fields: isEmpty(field.properties)
        ? emptyFields
        : Object.keys(field.properties).reduce((prev, k) => {
          prev[k] = { type: createType(field.properties[k], name + '_' + k, isInput, resolve) }
          return prev
        }, {}),
    }

    if (field.resolve) {
      propsTypeDefined.resolve = (...args) => (resolve(field.resolve, ...args))
    }

    propsType = isInput
      ? new GraphQLInputObjectType(propsTypeDefined)
      : new GraphQLObjectType(propsTypeDefined)

    return propsType
  }

  if (field.type === 'array') {
    return new GraphQLList(createType(field.items[0], name + '_0', isInput, resolve))
  }

  propsType = convertType(field.type)
  if (field.required) propsType = new GraphQLNonNull(propsType)
  return propsType
}

const createInputType = args => {
  return new GraphQLInputObjectType({
    name: 'InputSchema',
    fields: isEmpty(args) ? emptyFields : Object.keys(args).reduce((prev, k) => {
      prev[k] = { type: createType(args[k], 'input_' + k, true) }
      return prev
    }, {}),
  })
}

const createSchema = (route, args, body, resolve) => {
  const schema = {
    name: 'schema',
    fields: {
      result: {
        type: createType(body, 'result', false, resolve),
        args: {
          data: {
            type: createInputType(args),
          },
        },
        resolve: (...args) => resolve(route.resolve, ...args),
      },
    },
  }

  return new GraphQLObjectType(schema)
}

// 只处理基础类型的数据
const convertQuery = (data, route) => {
  const fields = Object.assign(
    {},
    (route.queryString || {}).properties,
    (route.routeParams || {}).properties
  )
  Object.keys(fields).forEach(key => {
    const type = fields[key].type
    const val = data[key]
    if (val) {
      if (type === 'boolean') data[key] = val === 'true' || val === '1'
      if (type === 'integer') data[key] = parseInt(val)
      if (type === 'decimal') data[key] = parseFloat(val)
    }
  })
}

const getSchema = (route, resolve, args) => {
  const rootType = createSchema(route, args.properties, route.responseBody, resolve)

  const schema = route.method === 'GET'
    ? new GraphQLSchema({ query: rootType })
    : new GraphQLSchema({ query: emptyQuery, mutation: rootType })

  return schema
}

module.exports = (route, resolve) => {
  const args = {
    type: 'object',
    properties: Object.assign(
      {},
      (route.queryString || {}).properties,
      (route.routeParams || {}).properties,
      (route.requestBody || {}).properties
    ),
  }

  const query = createQuery(args, route.responseBody, route.method)
  const schema = getSchema(route, resolve, args)

  return (data, ctx, sync) => {
    convertQuery(data, route)
    if (sync) {
      return graphqlSync(schema, query, null, ctx, { data })
    }
    return graphql(schema, query, null, ctx, { data })
  }
}

module.exports.validateArguments = route => {
  const args = {
    type: 'object',
    properties: Object.assign(
      {},
      (route.queryString || {}).properties,
      (route.routeParams || {}).properties,
      (route.requestBody || {}).properties
    ),
  }

  const query = createQuery(args, route.responseBody, route.method)
  const schema = getSchema(route, null, args)

  return data => {
    const res = buildExecutionContext(schema, parse(query), null, null, { data })
    // console.log(res)
    return res
  }
}
