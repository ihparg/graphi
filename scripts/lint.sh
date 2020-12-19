#!/bin/sh

cd packages
for dir in `ls .`
do
  cd $dir
  yarn lint
  cd ..
done