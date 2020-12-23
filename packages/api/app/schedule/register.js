'use strict'

const crypto = require('crypto')

module.exports = app => {
  return {
    schedule: {
      disabled: app.config.graphi.env !== 'dev',
      interval: '10m',
      type: 'worker',
      immediate: true,
    },
    async task(ctx) {
      const { graphi } = app.config

      const token = crypto.randomBytes(20).toString('hex')

      try {
        const result = await ctx.curl(`${graphi.host}/api/app/registerDevServer`, {
          headers: {
            Authorization: graphi.token,
          },
          data: {
            _id: graphi.appId,
            token,
            host: graphi.localhost,
          },
          method: 'POST',
          dataType: 'json',
        })

        if (result.data.code !== 200) {
          console.log(result.data)
        }
        app.cache.set('graphi:token', token)
      } catch (e) {
        app.logger.error(e)
      }
    },
  }
}
