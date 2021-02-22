const fs = require('fs/promises')

const main = async () => {
  let pkg = await fs.readFile('./package.json', 'utf-8')
  pkg = JSON.parse(pkg)
  const { version } = pkg

  pkg = await fs.readFile('./dist/core/package.json', 'utf-8')
  pkg = JSON.parse(pkg)
  pkg.version = version
  pkg.dependencies['@graphi/tools'] = version
  delete pkg.devDependencies
  await fs.writeFile('./dist/core/package.json', JSON.stringify(pkg, null, 2))

  pkg = await fs.readFile('./dist/api/package.json', 'utf-8')
  pkg = JSON.parse(pkg)
  pkg.version = version
  pkg.dependencies['@graphi/tools'] = version
  delete pkg.devDependencies
  await fs.writeFile('./dist/api/package.json', JSON.stringify(pkg, null, 2))

  pkg = await fs.readFile('./dist/tools/package.json', 'utf-8')
  pkg = JSON.parse(pkg)
  pkg.version = version
  await fs.writeFile('./dist/tools/package.json', JSON.stringify(pkg, null, 2))
}

main()