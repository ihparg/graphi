'use strict'

module.exports = () => {
  const createCache = redis => ({
    async get(key) {
      const data = await redis.get(key)
      return JSON.parse(data)
    },
    async set(key, value, ex) {
      const data = JSON.stringify(value)
      let args = [ key, data ]
      if (ex) args = [ ...args, 'EX', ex ]
      await redis.set(...args)
    },
    async del(key) {
      await redis.del(key)
    },
    delMatches(match) {
      const stream = redis.scanStream({ match })
      stream.on('data', function(keys) {
        // `keys` is an array of strings representing key names
        if (keys.length) {
          const pipeline = redis.pipeline()
          keys.forEach(function(key) {
            pipeline.del(key)
          })
          pipeline.exec()
        }
      })
      /*
      stream.on('end', function() {
        console.log('done')
      })
      */
    },
  })

  return async function cache(ctx, next) {
    ctx.cache = createCache(ctx.app.redis)
    await next()
  }
}
