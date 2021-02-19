#!/bin/sh

cd build/tools
npm publish --access=public

cd ../core
npm publish --access=public

cd ../api
npm publish --access=public