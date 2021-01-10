#!/bin/sh

cd packages
for dir in `ls .`
do
  echo $dir
  cd $dir
  yarn
  cd ..
done

cd tools
yarn link
cd ../core
yarn link @graphi/tools
cd ../api
yarn link @graphi/tools
cd ../web
yarn link @graphi/tools
