'use strict'

const urllib = require('urllib')
const path = require('path')
const fs = require('fs/promises')
const config = require('./config').graphi

;(async () => {
  const url = `${config.host}/api/route/${config.appId}/version/${config.version}`
  console.log('Fetch routes from ' + url)
  try {
    const res = await urllib.request(url, { headers: { Authorization: config.token }, dataType: 'json' })
    if (res.status === 200) {
      const { data } = res
      if (data.code === 200) {
        await fs.writeFile(path.join(__dirname, 'graphi.json'), JSON.stringify(data.data, null, 2))
        console.log('Successed save file graphi.json')
      }
    } else {
      console.error('Fetch failed:', res.message)
    }
  } catch (e) {
    console.error('Fetch failed:', e.message)
  }
})()
