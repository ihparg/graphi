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

    await cache.set(_b, 654321, 1)
    assert((await cache.get(_b)) === 654321)
    await sleep(1000)
    assert((await cache.get(_b)) === undefined)

    cache.del(_a)
    assert((await cache.get(_a)) === undefined)

    cache.set(_a, 123456)
    cache.set(_b, 654321)
    assert((await cache.get(_b)) === 654321)

    cache.delMatches(K('*'))
    assert((await cache.get(_a)) === undefined)
    assert((await cache.get(_b)) === undefined)
  }

  it('redis cache', async () => {
    const redis = new Redis()
    testCase(createCache(redis))
  })

  it('lru cache', async () => {
    testCase(createCache())
  })
})

