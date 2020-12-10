import merge from 'deepmerge'

const NodeTypes = [
  'ref',
  'object',
  'enum',
  'string',
  'text',
  'json',
  'datetime',
  'integer',
  'decimal',
  'double',
  'boolean',
  'blob',
]

const validNode = node => {
  if (node && NodeTypes.includes(node.type) && typeof node.name === 'string' && node.name.length) {
    return true
  }
  return false
}

const getRealSchema = (schemas, props) => {
  const schema = schemas.find(item => item._id === props.ref)
  if (schema) {
    const field = schema.fields[props.name]

    if (!field) {
      console.warn(`Cannot find the field in schema named ${schema.name}`)
      return null
    }

    if (field.ref) {
      return getRealSchema(schemas, field)
    }
    return field
  }
  console.warn(`Cannot find the schema ${props._id}`)
  return null
}

const flattenSchema = (node, schemas) => {
  if ('ref' in node) {
    if (node.children && Object.keys(node.children).length) {
      node.type = 'object'
    }

    const schema = schemas.find(item => item._id === node.ref)
    delete node.ref

    if (schema && !Object.keys(node.children).length) {
      const field = schema.fields[node.name]
      if (field) {
        node = merge(node, field)
      } else {
        console.warn(`Cannot find the field in schema named ${node.name}`)
      }
    } else if (!schema) {
      console.warn(`Cannot find the schema ${node.ref}`)
    }
  }

  if (node.type === 'ref') {
    if (node.children && Object.keys(node.children).length) {
      node.type = 'object'
    } else {
      const field = getRealSchema(schemas, node)

      const { name } = node
      if (field) {
        delete node.ref
        node = merge(node, field)
      } else {
        node.type = 'object'
      }
      node.name = name
    }
  }

  let children = node.children || {}

  children = Object.values(children).reduce((prev, child) => {
    const r = flattenSchema(child, schemas)
    if (validNode(r)) {
      prev[child.name] = r
    }
    return prev
  }, {})

  return { ...node, children }
}

const flattenRouteSchema = (route, schemas, circleMap) => {
  const result = { ...route }
  if (route.queryStrings) {
    result.queryStrings = flattenSchema(route.queryStrings, schemas, circleMap)
  }

  if (route.requestHeaders) {
    result.requestHeaders = flattenSchema(route.requestHeaders, schemas, circleMap)
  }

  if (route.requestBody) result.requestBody = flattenSchema(route.requestBody, schemas, circleMap)
  if (route.routeParams) result.routeParams = flattenSchema(route.routeParams, schemas, circleMap)
  if (route.responseHeaders) {
    result.responseHeaders = flattenSchema(route.responseHeaders, schemas, circleMap)
  }

  if (route.responseBody) {
    result.responseBody = flattenSchema(route.responseBody, schemas, circleMap)
  }

  return result
}

export default flattenRouteSchema
