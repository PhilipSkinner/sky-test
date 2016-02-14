#!/bin/sh

#run server side tests
jasmine

#run client side tests
./node_modules/karma/bin/karma start karma.conf.js --single-run