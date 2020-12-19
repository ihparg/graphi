'use strict'

const { app, assert } = require('egg-mock/bootstrap')

const Users = require('../data').users

describe('controller/user', () => {
  let authorization

  before(async () => {
    const result = await app.httpRequest()
      .post('/api/user/login')
      .send(Users.admin)
      .expect(200)

    authorization = 'Bearer ' + result.body.data.token
  })

  it('get user list', async () => {
    const result = await app.httpRequest().get('/api/user/all')
      .set('authorization', authorization)
      .expect(200)
    assert(result.body.code === 200)
    const users = result.body.data
    assert(users.length === 7)
    assert(users[0].password === undefined)
  })

  it('logout', async () => {
    const result = await app.httpRequest().post('/api/user/logout')
      .set('authorization', authorization)
      .expect(200)
    assert(result.body.code === 200)
    assert(result.body.data === true)
  })

  it('no permission', async () => {
    const result = await app.httpRequest().get('/api/user/all').expect(200)
    assert(result.body.code === 401)
    assert(result.body.message === '用户未登录')
  })

  it('login expired', async () => {
    const result = await app.httpRequest().get('/api/user/all')
      .set('authorization', authorization)
      .expect(200)
    assert(result.body.code === 401)
    assert(result.body.message === '登录超时，请重新登录')
  })
})
