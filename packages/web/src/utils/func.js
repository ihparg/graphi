export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }
  const last = funcs[funcs.length - 1]
  const rest = funcs.slice(0, -1)
  return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
}

export function curry(f, ...args) {
  if (args.length >= f.length) {
    return f(...args)
  }

  return (...next) => curry(f.bind(f, ...args), ...next)
}

export function getTags(routes) {
  const tags = {}
  routes.forEach(r => {
    if (r.tag) tags[r.tag] = true
  })
  return Object.keys(tags).sort((a, b) => a.localeCompare(b))
}

export function formatValue(v) {
  if (v == null) return ''
  if (typeof v === 'string') return v

  return JSON.stringify(v)
}
