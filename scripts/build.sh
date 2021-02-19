#!/bin/sh

rm -rf build

cd packages/web
yarn build

cd ../../

mkdir build/tools
cp -r packages/tools/src build/tools/src
cp -r packages/tools/package.json build/tools/package.json

cp -r packages/core/app build/core/app
cp -r packages/core/config build/core/config
cp -r packages/core/data build/core/data
cp -r packages/core/plugin build/core/plugin
cp -r packages/core/app.js build/core/app.js
cp -r packages/core/package.json build/core/package.json

mv build/core/index.html build/core/public/index.html
mv build/core/favicon.ico build/core/public/favicon.ico

mkdir build/api

cp -r packages/api/app build/api/app
cp -r packages/api/config build/api/config
cp -r packages/api/plugin build/api/plugin
cp -r packages/api/app.js build/api/app.js
cp -r packages/api/config.js build/api/config.js
cp -r packages/api/init.js build/api/init.js
cp -r packages/api/package.json build/api/package.json

node ./scripts/package.js