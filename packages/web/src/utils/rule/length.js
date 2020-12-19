import { deepMerge } from '../objects'

const createMessage = key => props => {
  const k = key === 'min' ? '小于' : '大于'
  switch (props.type) {
    case 'integer':
    case 'number':
      return `不能${k}${props[key]}`
    case 'array':
      return `不能${k}${props[key]}个选项`
    default:
      return `长度不能${k}${props[key]}`
  }
}

const options = { skipUndefined: true }

export const lengthMessage = {
  max: createMessage('max'),
  min: createMessage('min'),
}

export default (key, { message } = {}) => (len, msg) => {
  if (typeof len !== 'number') {
    console.error(new Error(`Rule "${key}" param expect a number, get ${typeof len}`))
    return null
  }
  return deepMerge(
    { message: lengthMessage[key] },
    deepMerge({ message, [key]: len }, { message: msg }, options),
    options,
  )
}
