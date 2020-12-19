import { deepMerge } from '../objects'

const options = { skipUndefined: true }

export default ({ message, tip } = {}) => msg =>
  deepMerge(
    {
      required: true,
      message: () => '不能为空.',
    },
    deepMerge({ message, tip }, { message: msg }, options),
    options,
  )
