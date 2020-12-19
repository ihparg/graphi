import { isArray, isDate, isMap, isSet, isRegexp, isMergeable, isError } from './is'

// eslint-disable-next-line
const cloneArray = source => Array.from(source, x => deepClone(x))

const cloneObject = (source, specialKeys = []) => {
  const target = Object.create(Object.getPrototypeOf(source))
  ;[...specialKeys, ...Object.keys(source)].forEach(k => {
    // eslint-disable-next-line
    target[k] = deepClone(source[k])
  })
  return target
}

export const fastClone = obj => JSON.parse(JSON.stringify(obj))

export const shallowClone = val => {
  if (!val) return val
  if (isDate(val)) return new Date(val)
  if (isMap(val)) return new Map(val)
  if (isSet(val)) return new Set(val)
  if (isRegexp(val)) return new RegExp(val)
  if (isError(val)) return cloneObject(val, ['message'])
  return val
}

export const deepClone = source => {
  if (isArray(source)) return cloneArray(source)
  if (isMergeable(source)) return cloneObject(source)
  return shallowClone(source)
}

export const cloneDeep = (obj, hash = new WeakMap()) => {
  if (Object(obj) !== obj) return obj
  if (hash.has(obj)) return hash.get(obj)
  const types = [Set, Map, Date, RegExp, WeakMap, WeakSet]
  if (types.includes(obj.constructor)) return new obj.constructor(obj)
  hash.set(obj, obj)
  const res = Array.isArray(obj) ? [] : {}
  Object.keys(obj).forEach(key => {
    res[key] = typeof obj[key] === 'object' ? cloneDeep(obj[key], hash) : obj[key]
  })

  return res
}
