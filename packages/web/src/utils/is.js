import { curry } from './func'

// eslint-disable-next-line
const generatorFunction = function*() {}

const nameIs = curry((name, val) => val && val.constructor && val.constructor.name === name)

// eslint-disable-next-line
export const isArray = Array.isArray
export const isUndef = v => v == null
export const isNotUndef = v => v != null
// eslint-disable-next-line
export const isNan = a => a !== a
export const isFunc = f => typeof f === 'function'
export const isGenerator = f => f && f.constructor === generatorFunction.constructor
export const isNumber = n => typeof n === 'number'
export const isObject = val => val && typeof val === 'object' && !isArray(val)
export const isString = s => typeof s === 'string'
export const isDate = val => val instanceof Date
export const isError = val => val instanceof Error
export const isRegexp = val => val instanceof RegExp
export const isMap = nameIs('Map')
export const isSet = nameIs('Set')
export const isSymbol = nameIs('Symbol')
export const isPromise = p => p && (nameIs('Promise', p) || isFunc(p.then))

export const isInPath = (val, path) => {
  if (val === path) return true
  return path.indexOf(`${val}[`) === 0 || path.indexOf(`${val}.`) === 0
}

export const isEmpty = val => {
  if (val == null) return true
  if (isNan(val)) return true
  if (val.length !== undefined) return val.length === 0
  if (val instanceof Date) return false
  if (typeof val === 'object') return Object.keys(val).length === 0

  return false
}

export const isBuffer = val => {
  if (val.constructor && typeof val.constructor.isBuffer === 'function') {
    return val.constructor.isBuffer(val)
  }
  return false
}

export const isMergeable = val => {
  if (!isObject(val)) return false
  const fns = [isDate, isError, isRegexp, isMap, isSet, isBuffer]

  for (let i = 0; i < fns.length; i++) {
    if (fns[i](val)) return false
  }

  return true
}

export const isInseparable = val =>
  Object(val) !== val ||
  isFunc(val) ||
  isDate(val) ||
  isError(val) ||
  isSet(val) ||
  isMap(val) ||
  isRegexp(val)

export const isUrl = url => {
  const reg = new RegExp(
    '^' +
      '(?:(?:https?|socket)://)?' +
      '(?:\\S+(?::\\S*)?@)?' +
      '(?:' +
      '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
      '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
      '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
      '|' +
      '(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]-*)*[a-zA-Z\\u00a1-\\uffff0-9]+)' +
      '(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]-*)*[a-zA-Z\\u00a1-\\uffff0-9]+)*' +
      '(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))' +
      ')' +
      '(?::\\d{2,5})?' +
      '(?:/\\S*)?' +
      '$',
  )

  return reg.test(url)
}
