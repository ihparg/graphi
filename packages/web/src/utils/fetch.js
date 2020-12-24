import message from '@/components/message'
import { getToken } from './localStorage'
import { getCookie } from './cookie'

let store

class FetchError extends Error {
  constructor(msg, status) {
    super(msg)
    this.name = 'FetchError'
    this.status = status
  }
}

function exec(url, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'x-csrf-token': getCookie('csrfToken'),
    ...options.headers,
  }
  if (token) headers.authorization = `Bearer ${token}`
  return fetch(url, { ...options, headers })
    .then(res => {
      if (res.status === 401) {
        store.commit('user/SET_LOGIN_STATE', 0)
        throw new FetchError('need login.', 401)
      }

      if (res.status !== 200) {
        let error = `${url} not found.`
        try {
          const json = res.json()
          if (json.message) error = json.message
        } catch (e) {
          console.error(e)
        }

        message.show(error, 'error')
        throw new FetchError(error, res.status)
      }

      const cd = res.headers.get('content-disposition')
        ? res.headers.get('content-disposition').split(';')
        : null
      if (cd && cd[0] === 'attachment') {
        res.blob().then(blob => {
          const match = /filename="(.*)"/.exec(cd[1])
          const link = document.createElement('a')
          link.style.display = 'none'
          link.download = match ? match[1] : 'file'
          link.href = URL.createObjectURL(blob)
          document.body.appendChild(link)
          link.click()
          URL.revokeObjectURL(link.href)
          document.body.removeChild(link)
        })

        return { code: 200 }
      }

      return res.json()
    })
    .then(res => {
      if (res.code === 200) return res.data
      if (res.code === 401) {
        store.commit('user/SET_LOGIN_STATE', 0)
        throw new FetchError('need login.', 401)
      }

      message.show(res.message, 'error')
      throw new FetchError(res.message, res.code)
    })
}

function get(url) {
  return exec(url)
}

const create = method => (url, data, headers) => {
  const options = {
    body: JSON.stringify(data),
    cache: 'no-cache',
    method,
    headers,
  }
  return exec(url, options)
}

export const setStore = s => {
  store = s
}

export const commonFetch = (url, method, data) =>
  fetch(url, {
    method,
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json',
    },
  })

export default {
  get,
  post: create('POST'),
  put: create('PUT'),
  delete: create('DELETE'),
}
