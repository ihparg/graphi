'use strict'

module.exports = {
  filterProps(obj, props = []) {
    if (typeof obj !== 'object') return

    if (typeof props === 'function') {
      const prediction = props
      props = []
      Object.keys(obj).forEach(k => {
        if (prediction(obj[k])) props.push(k)
      })
    }

    const temp = props.reduce((p, i) => {
      p[i] = true
      return p
    }, {})

    Object.keys(obj).forEach(k => {
      if (!temp[k]) delete obj[k]
    })
  },
}
