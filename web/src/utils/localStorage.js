const fakeStorage = {}

const supportLS = (() => {
  const test = '______test_localstorage______'
  try {
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
})()

const getItem = key => {
  if (!supportLS) return fakeStorage[key]

  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

const setItem = (key, data) => {
  if (supportLS) localStorage.setItem(key, JSON.stringify(data))
  else fakeStorage[key] = data
}

const removeItem = key => {
  if (supportLS) localStorage.removeItem(key)
  else delete fakeStorage[key]
}

export const TOKEN = 'token'
export const USER_INFO = 'userinfo'

export function getToken() {
  return getItem(TOKEN)
}

export function setToken(token) {
  setItem(TOKEN, token)
}

export default {
  getItem,
  setItem,
  removeItem,
}
