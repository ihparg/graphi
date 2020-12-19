'use strict'

const assert = require('power-assert')
const Redis = require('ioredis')
const createCache = require('../../app/utils/cache')

const sleep = async time => new Promise(resolve => {
  setTimeout(resolve, time)
})

describe('utils/cache', () => {
  const testCase = async cache => {
    const K = k => '__test__:' + k
    const _a = K('a')
    const _b = K('a')

    await cache.set(_a, 12345678)
    assert((await cache.get(_a)) === 12345678)

    await cache.set(_b, 654321, 0.01)
    assert((await cache.get(_b)) === 654321)
    await sleep(20)
    assert((await cache.get(_b)) == null)

    await cache.del(_a)
    assert((await cache.get(_a)) == null)

    await cache.set(_a, 123456)
    await cache.set(_b, 654321)
    assert((await cache.get(_b)) === 654321)

    await cache.delMatches(K('*'))
    assert((await cache.get(_a)) == null)
    assert((await cache.get(_b)) == null)
  }

  it('redis cache', async () => {
    const redis = new Redis()
    await testCase(createCache(redis))
  })

  it('lru cache', async () => {
    await testCase(createCache())
  })
})

