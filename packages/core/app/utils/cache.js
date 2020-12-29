'use strict'

const LRU = require('ylru')

const createRedis = redis => ({
  async get(key) {
    const data = await redis.get(key)
    return JSON.parse(data)
  },
  async set(key, value, ex) {
    const data = JSON.stringify(value)
    let args = [ key, data ]
    if (ex) args = [ ...args, 'PX', ex * 1000 ]
    await redis.set(...args)
  },
  async del(key) {
    await redis.del(key)
  },
  delMatches(match) {
    const stream = redis.scanStream({ match })
    return new Promise((resolve, reject) => {
      stream.on('data', function(keys) {
        if (keys.length) {
          const pipeline = redis.pipeline()
          keys.forEach(function(key) {
            pipeline.del(key)
          })
          pipeline.exec()
        }
        resolve()
      })
      stream.on('error', e => {
        reject(e.message)
      })
    })

  },
})

const createLRU = () => {
  const lru = new LRU(9999)
  return {
    async get(key) {
      return lru.get(key)
    },
    async set(key, value, ex) {
      const options = ex ? { maxAge: ex * 1000 } : {}
      lru.set(key, value, options)
    },
    async del(key) {
      lru.get(key, { maxAge: -1 })
    },
    async delMatches(str) {
      const reg = new RegExp('^' + str)
      lru.keys().forEach(key => {
        if (reg.test(key)) lru.get(key, { maxAge: -1 })
      })
    },
  }
}

module.exports = redis => {
  if (redis) return createRedis(redis)
  return createLRU()
}
