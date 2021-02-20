#!/bin/sh

rm -rf dist

mkdir -p dist/tools
cp -r packages/tools/src dist/tools/src
cp -r packages/tools/package.json dist/tools/package.json

cd dist
git clone git@github.com:ihparg/graphi-api.git api
git clone git@github.com:ihparg/graphi-core.git core

cd ../packages/web
yarn build

cd ../../
mv build/index.html build/public/index.html
mv build/favicon.ico build/public/favicon.ico
cp -r build/public dist/core/app

cp -r packages/core/app dist/core
cp -r packages/core/config dist/core
cp -r packages/core/data dist/core
cp -r packages/core/plugin dist/core
cp -r packages/core/app.js dist/core
cp -r packages/core/package.json dist/core
cp -r packages/core/README.md dist/core

cp -r packages/api/app dist/api
cp -r packages/api/config dist/api
cp -r packages/api/plugin dist/api
cp -r packages/api/app.js dist/api
cp -r packages/api/config.js dist/api
cp -r packages/api/init.js dist/api
cp -r packages/api/package.json dist/api
cp -r packages/api/README.md dist/api

node ./scripts/package.js