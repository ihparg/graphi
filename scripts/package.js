const fs = require('fs/promises')

const main = async () => {
  let pkg = await fs.readFile('./package.json', 'utf-8')
  pkg = JSON.parse(pkg)
  const { version } = pkg

  pkg = await fs.readFile('./build/core/package.json', 'utf-8')
  pkg = JSON.parse(pkg)
  pkg.version = version
  pkg.dependencies['@graphi/tools'] = version
  await fs.writeFile('./build/core/package.json', JSON.stringify(pkg, null, 2))

  pkg = await fs.readFile('./build/api/package.json', 'utf-8')
  pkg = JSON.parse(pkg)
  pkg.version = version
  await fs.writeFile('./build/api/package.json', JSON.stringify(pkg, null, 2))

  pkg = await fs.readFile('./build/tools/package.json', 'utf-8')
  pkg = JSON.parse(pkg)
  pkg.version = version
  await fs.writeFile('./build/tools/package.json', JSON.stringify(pkg, null, 2))
}

main()