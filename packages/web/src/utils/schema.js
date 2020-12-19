export const flattenSchemas = (schemas, path = '', res = {}) => {
  Object.keys(schemas).forEach(k => {
    const p = `${path}${k}`
    res[p] = { ...schemas[k] }

    if (schemas[k].properties) {
      flattenSchemas(schemas[k].properties, `${p}.`, res)
    }
    if (schemas[k].items) {
      flattenSchemas(schemas[k].items, `${p}.`, res)
    }
  })
  return res
}

export const flattenSchemasFromArray = schemas => {
  const obj = schemas.reduce((prev, schema) => {
    prev[schema.name] = schema.content
    return prev
  }, {})
  return flattenSchemas(obj)
}

export const getActiveField = (path, value) => {
  let temp = value
  let names = []
  let parent = null
  let nodeType = path === '' ? 'root' : ''
  path = path.split('.')
  path.forEach((s, i) => {
    if (i === 0) return
    if (i === path.length - 1) {
      if (temp.properties) {
        names = Object.keys(temp.properties).map(n => n.toLowerCase())
        /* 注释掉这里，是允许route的字段覆盖schema的字段
        if (temp.type === 'ref') {
          const field = schemas[temp.ref]
          names = [...names, ...Object.keys(field.properties)]
        }
        */
      }
      parent = temp
      if (temp.type === 'array' || temp.type === 'map') nodeType = 'item'
    }
    temp = temp.items ? temp.items[s] : temp.properties[s]
  })

  return {
    name: path[path.length - 1],
    parent,
    names,
    data: temp || {},
    isRef: temp && temp.ref && temp.ref.indexOf('.') > 0,
    nodeType,
  }
}

export const getFlattenedProps = (value, schemas) => {
  let props = value
  if (props.type === 'ref' && schemas[props.ref]) {
    props = schemas[props.ref]
    if (props.type === 'ref') props = getFlattenedProps(props, schemas)
  }
  props = { ...props }
  ;['required', 'defaultValue', 'exampleValue', 'description'].forEach(k => {
    if (value[k] != null && value[k] !== '') props[k] = value[k]
  })

  return props
}

export const getSubField = (field, ref, schemas) => {
  const sub = { ...field.items[0] }
  const item = {
    type: 'ref',
    ref: sub.ref || `${ref}.0`,
  }
  if (sub.type === 'object') {
    item.properties = {}
  }
  if (sub.type === 'array' || sub.type === 'map') {
    item.items = [getSubField(schemas[item.ref], item.ref, schemas)]
  }

  return item
}
