export const getFieldByRef = (schemas, path) => {
  path = path.split('.')
  let key = path.shift()
  let temp = schemas[key].content
  while (path.length > 0) {
    key = path.shift()
    temp = temp.type === 'array' || temp.type === 'map' ? temp.items[key] : temp.properties[key]
  }

  return temp
}

export const getParentByPath = (root, path) => {
  let key = path.shift()
  let temp = root
  while (path.length > 0) {
    key = path.shift()
    temp = temp.items ? temp.items[key] : temp.properties[key]
  }

  return temp
}

export const getRouteParamsKeys = (path = '') => {
  const keys = []

  path.split('/').forEach(p => {
    if (p[0] === ':') keys.push(p.substring(1))
  })

  return keys
}

const getRefs = (props, refs) => {
  if (!props) return
  if (props.ref) refs[props.ref] = true
  if (props.properties) {
    Object.keys(props.properties).forEach(k => {
      getRefs(props.properties[k], refs)
    })
  }
  if (props.items) {
    getRefs(props.items[0], refs)
  }
}

export const getAllRefs = route => {
  const refs = {}
  ;['requestBody', 'requestHeaders', 'queryString', 'responseBody', 'responseHeaders'].forEach(
    name => {
      getRefs(route[name], refs)
    },
  )

  return Object.keys(refs)
}
