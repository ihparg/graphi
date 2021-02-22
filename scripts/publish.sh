#!/bin/sh

cd dist/tools
npm publish --access=public

cd ../core
git add .
git commit -m 'publish'
git push origin main

cd ../api
git add .
git commit -m 'publish'
git push origin main