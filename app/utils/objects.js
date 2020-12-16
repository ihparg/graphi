'use strict'

module.exports = {
  filterProps(obj, props = []) {
    if (typeof obj !== 'object') return

    const temp = props.reduce((p, i) => {
      p[i] = true
      return p
    }, {})

    Object.keys(obj).forEach(k => {
      if (!temp[k]) delete obj[k]
    })
  },
}
