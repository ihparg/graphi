'use strict'

const { app, assert } = require('egg-mock/bootstrap')

const Users = require('../data').users

describe('controller/route', () => {
  let authorization

  before(async () => {
    const result = await app.httpRequest()
      .post('/api/user/login')
      .send(Users.owner)
      .expect(200)

    authorization = 'Bearer ' + result.body.data.token
  })

  it('get route', async () => {
    const ctx = app.mockContext()
    const route = await ctx.model.Route.findOne({})

    const result = await app.httpRequest().get(`/api/route/${route.aid}/detail/${route._id}`)
      .set('authorization', authorization)
      .expect(200)

    assert(result.body.code === 200)
    assert(result.body.data._id === route._id.toString())
  })
})
