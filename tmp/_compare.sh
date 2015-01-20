#!/bin/sh
node tests/ex-$1.js > ./tmp/ex-$1.js.out
./tmp/test-ex-$1 > ./tmp/ex-$1.cpp.out
icdiff --whole-file ./tmp/ex-$1.js.out  ./tmp/ex-$1.cpp.out 

