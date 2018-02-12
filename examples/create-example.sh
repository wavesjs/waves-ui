#!/bin/bash

echo "enter project name:"
read projectName

echo "clone boilerplate into $projectName"
git clone git@github.com:ircam-jstools/es-next-prototyping-client.git "$projectName"

cd "$projectName"

echo "delete .git project"
rm -Rf .git
rm README.md

echo "npm install"
npm install
npm install --save wavesjs/waves-loaders
npm install --save wavesjs/waves-ui
npm install --save @ircam/basic-controllers

rm package-lock.json

echo "npm link waves-ui"
npm link waves-ui

echo "copy assets"
cp ../assets/common.css ./css/common.css
cp ../assets/drum-loop.wav ./assets/drum-loop.wav

mkdir js
cp ../assets/insert-code.js ./js/insert-code.js
cp ../assets/prism.js ./js/prism.js
cp ../assets/prism.css ./css/prism.css
