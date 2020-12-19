let defaultComponent

export const components = {}

export const register = (type, comp) => {
  components[type] = comp
}

export const setDefaultComponent = comp => {
  defaultComponent = comp
}

export default type => {
  const comp = components[type] || defaultComponent
  if (!comp) throw new Error(`Type ${type} not found.`)
  return comp
}
