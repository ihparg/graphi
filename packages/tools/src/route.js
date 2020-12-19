'use strict'

const getRefType = (schemas, key) => {
  const ref = schemas[key]

  if (ref.type === 'ref') {
    return getRefType(schemas, ref.ref)
  }
  return ref.type
}

const flattenProperty = (property, schemas) => {
  const props = { ...property }

  if (props.properties) {
    props.type = 'object'
    Object.keys(props.properties).forEach(k => {
      props.properties[k] = flattenProperty(props.properties[k], schemas)
    })
  }

  if (props.items) {
    props.items[0] = flattenProperty(props.items[0], schemas)
  }

  if (props.ref) {
    const ref = schemas[props.ref]
    if (ref) {
      props.type = getRefType(schemas, props.ref)
      Object.keys(ref).forEach(k => {
        if (k === 'properties' || k === 'items') return
        if (props[k] == null) props[k] = ref[k]
      })
    } else {
      console.error(props.ref + '引用丢失')
    }
  }

  return props
}

const flattenRoute = (route, schemas) => {
  route = JSON.parse(JSON.stringify(route))
  const keys = [ 'requestHeaders', 'requestBody', 'queryString', 'responseHeaders', 'responseBody' ]
  keys.forEach(k => {
    if (route[k]) route[k] = flattenProperty(route[k], schemas)
  })

  return route
}

module.exports = {
  flattenRoute,
}
