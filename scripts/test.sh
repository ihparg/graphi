#!/bin/sh

cd packages/core
yarn test-local

cd ../tools
yarn test
