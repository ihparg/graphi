import { deepMerge } from '../objects'

const options = { skipUndefined: true }

export default ({ message } = {}) => (regExp, msg) => {
  if (typeof regExp !== 'string' && !(regExp instanceof RegExp)) {
    console.error(
      new Error(`Rule "reg" param expect a RegExp object or a string, get ${typeof regExp}`),
    )
    return null
  }
  return deepMerge(
    { message: '格式不正确.' },
    deepMerge({ message, regExp }, { message: msg }, options),
    options,
  )
}
