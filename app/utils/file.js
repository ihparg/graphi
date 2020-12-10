'use strict'

const fs = require('fs/promises')
const path = require('path')

const ignorebleList = file => new RegExp(
  [
    // # All
    '^npm-debug\\.log$', // Error log for npm
    '^\\.git$', // git files
    '^\\..*\\.swp$', // Swap file for vim state
    // # macOS
    '^\\.DS_Store$', // Stores custom folder attributes
    '^\\.AppleDouble$', // Stores additional file resources
    '^\\.LSOverride$', // Contains the absolute path to the app to be used
    '^Icon\\r$', // Custom Finder icon: http://superuser.com/questions/298785/icon-file-on-os-x-desktop
    '^\\._.*', // Thumbnail
    '^\\.Spotlight-V100(?:$|\\/)', // Directory that might appear on external disk
    '\\.Trashes', // File that might appear on external disk
    '^__MACOSX$', // Resource fork
    // # Linux
    '~$', // Backup file
    // # Windows
    '^Thumbs\\.db$', // Image file cache
    '^ehthumbs\\.db$', // Folder config file
    '^Desktop\\.ini$', // Stores custom folder attributes
    '@eaDir$', // Synology Diskstation "hidden" folder where the server.js stores thumbnails
  ].join('|')
).test(file)

const loadJsonFile = async (filePath, isUnix = true) => {
  const text = await fs.readFile(filePath, 'utf8')
  const std = text.replace(/\r/g, '')
  const out = isUnix ? std.replace(/\n/g, '\r\n') : std
  return JSON.parse(out)
}

const loadDir = async dir => {
  const result = []
  const files = await fs.readdir(dir)
  files.forEach(file => {
    const filePath = path.join(dir, file)
    if (!ignorebleList(path.basename(filePath))) {
      result.push(loadJsonFile(filePath))
    }
  })
  return Promise.all(result)
}

module.exports = {
  loadJsonFile,
  loadDir,
}
