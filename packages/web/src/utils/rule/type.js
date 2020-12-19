import { deepMerge } from '../objects'

/*
export const typeMessage = (props) => {
  const path = props.title ? 'rules.type' : 'rules.reg'
  return substitute(getLocale(path), props)
}
*/

const options = { skipUndefined: true }

export default (type, { message, tip } = {}) => msg =>
  deepMerge(
    {
      type,
      message: () => '格式不正确.', // typeMessage,
    },
    deepMerge({ message, tip }, { message: msg }, options),
    options,
  )
