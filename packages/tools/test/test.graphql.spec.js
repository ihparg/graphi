'use strict'

const assert = require('assert')
const graphql = require('../src/graphql')
const { validateArguments } = require('../src/graphql')
const userone = require('./data/userone.json')
const userlist = require('./data/userlist.json')
const userlogin = require('./data/userlogin.json')
const userinit = require('./data/userinit.json')
const testdata = require('./data/user.json')

describe('Graphql query', function() {
  it('should return one user', async function() {
    const resolve = async () => {
      return testdata[0]
    }

    const execute = graphql(userone, resolve)
    const data = (await execute({})).data.result
    assert(typeof data === 'object')
    assert(data.name === 'test1')
    assert(data.password === undefined)
    assert(data.role === undefined)
    assert(Object.keys(data).length === 6)
  })

  it('should return user list', async function() {
    const resolve = async () => {
      return testdata
    }

    const execute = graphql(userlist, resolve)
    const res = await execute({})
    const data = res.data.result
    assert(Array.isArray(data))
    assert(data.length === 2)

    const user = data[1]
    assert(user.name === 'test2')
    assert(user.password === undefined)
    assert(user.role === 2)
    assert(Object.keys(user).length === 7)
  })

  it('should return matched user', async function() {
    const resolve = async (name, _, { data }) => {
      return testdata.find(d => d.name === data.name)
    }

    const execute = graphql(userlogin, resolve)
    let result = await execute({ name: 'test1', password: '1111' })
    let user = result.data.result

    assert(typeof user === 'object')
    assert(user.name === 'test1')
    assert(user.password === undefined)
    assert(user.role === 1)
    assert(Object.keys(user).length === 5)

    result = await execute({ name: 'test2', password: '1111' })
    user = result.data.result

    assert(user.name === 'test2')
    assert(user.role === 2)
    assert(Object.keys(user).length === 5)
  })

  it('should return throw notnone error', async function() {
    const resolve = async (name, _, { data }) => {
      return testdata.find(d => d.name === data.name)
    }

    const execute = graphql(userlogin, resolve)
    const result = await execute({ name: 'test1' })

    assert(result.data == null)
    assert(typeof result.errors === 'object')
  })

  it('init user', async function() {
    const createdAt = '2010-01-01 12:00:00'
    const resolve = async (name, _, { data }) => {
      return { code: 200, data: { ...data, _id: '1', createdAt, status: 1, role: 1 } }
    }

    const execute = graphql(userinit, resolve)
    const result = await execute({ name: 'test', password: '11112', email: 'test@example.com' })

    const user = result.data.result.data

    assert(user)
    assert(user.name === 'test')
    assert(user.password === undefined)
    assert(user.email === 'test@example.com')
    assert(user.createdAt === createdAt)
  })

  it('check arguments', async function() {
    const fn = validateArguments(userlogin)
    let res = fn({ name: 1234, invalid: true })
    assert(Array.isArray(res))
    assert(res.length === 3)
    assert(res[0].message === 'Variable "$data" got invalid value { name: 1234, invalid: true }; Field "password" of required type "String!" was not provided.')

    res = fn({ name: 'test', password: '123456' })
    assert(!Array.isArray(res))
  })
})

