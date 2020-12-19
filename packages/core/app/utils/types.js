'use strict'

const BIGINTEGER = 'biginteger'
const BOOLEAN = 'boolean'
const DATETIME = 'datetime'
const INTEGER = 'integer'
const DECIMAL = 'decimal'
const DOUBLE = 'double'
const JSON$ = 'json'
const REF = 'ref'
const OBJECT = 'object'
const STRING = 'string'
const TEXT = 'text'
// const NUMBER = 'number'
// const ENUM = 'enum'
const ARRAY = 'array'
const BLOB = 'blob'

module.exports = {
  types: [
    ARRAY, BOOLEAN, DATETIME, DECIMAL, DOUBLE, INTEGER, BIGINTEGER, JSON$, REF, OBJECT, STRING, TEXT, BLOB,
  ],
}

/*
export const expandable = (t) => [OBJECT, REF].includes(t)

export const getProps = (t) => {
  let props = ['id', 'name', 'type', 'required', 'description', 'defaultValue', 'example']
  switch (t) {
    case INTEGER:
      props = [...props, 'enum', 'minimum', 'maximum', 'defaultValue']
      break
    case DECIMAL:
    case DOUBLE:
      props = [...props, 'minimum', 'maximum', 'defaultValue']
      break
    case ARRAY:
      props = [...props, 'maxItems', 'minItems', 'items']
      break
    case STRING:
      props = [...props, 'enum', 'minLength', 'maxLength', 'defaultValue']
      break
    case TEXT:
      props = [...props, 'minLength', 'maxLength', 'defaultValue']
      break
    case REF:
      props = [...props, 'children', 'ref']
      break
    case OBJECT:
      props = [...props, 'children']
      break
    default:
  }

  return props
}
*/
