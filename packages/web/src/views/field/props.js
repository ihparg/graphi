export const getProps = t => {
  let props = ['id', 'name', 'type', 'required', 'description']
  switch (t) {
    case 'integer':
      props = [...props, 'enum', 'minimum', 'maximum', 'defaultValue', 'example', 'index']
      break
    case 'decimal':
    case 'double':
      props = [...props, 'minimum', 'maximum', 'defaultValue', 'example']
      break
    case 'array':
      props = [...props, 'maxItems', 'minItems', 'items', 'example']
      break
    case 'map':
      props = [...props, 'items']
      break
    case 'string':
      props = [...props, 'enum', 'minLength', 'maxLength', 'defaultValue', 'example', 'index']
      break
    case 'text':
      props = [...props, 'minLength', 'maxLength', 'defaultValue', 'example']
      break
    case 'ref':
      props = [...props, 'properties', 'ref']
      break
    case 'object':
      props = [...props, 'properties']
      break
    case 'uuid':
      props = [...props, 'index']
      break
    default:
  }

  return props
}

export default {}
