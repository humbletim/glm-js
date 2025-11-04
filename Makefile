#
# Makefile for glm-js
# https://github.com/humbletim/glm-js
#
# copyright(c) 2015 humbletim
# MIT LICENSE
#
# then, to select a default math backend provider:
#    export GLM_JS_MATH_VENDOR=gl-matrix
#    make
#
# vendors can be one of:
#    * gl-matrix
#    * three.js
#    * tdl-fast
#

GLM_JS_MATH_VENDOR ?= three.js
JSHINT ?= jshint

.PHONY: default all clean test jshint three.js gl-matrix tdl-fast glm-js test-three.js test-gl-matrix test-tdl-fast test-glm-js

default: all

all: jshint three.js gl-matrix tdl-fast glm-js

build/glm-three.js: src/glm.common.js src/glm.three.js
	cat $^ > $@

build/glm-gl-matrix.js: src/glm.common.js src/glm.gl-matrix.js
	cat $^ > $@

build/glm-tdl-fast.js: src/glm.common.js src/glm.tdl-fast.js
	cat $^ > $@

# see: scripts/build-glm-js.pl
build/glm-js.js:
	@echo to build the glm-js native javascript backend, see scripts/build-glm-js.pl

three.js: build/glm-three.js
gl-matrix: build/glm-gl-matrix.js
tdl-fast: build/glm-tdl-fast.js
glm-js: build/glm-js.js

build/glm-wasm.js: src-wasm/glm-wasm.cpp src-wasm/glm-wasm-loader.js
	emcc -Ilib/glm src-wasm/glm-wasm.cpp -o build/glm-wasm.js -lembind --pre-js src-wasm/glm-wasm-loader.js

test: test-three.js test-gl-matrix test-tdl-fast
	@echo "NOTE: skipping test-glm-js, as it requires manual intervention to run"
	@echo "... to run it, see the top of test/test.glm-js.js"

test-three.js:
	@GLM_JS_MATH_VENDOR=three.js ./node_modules/mocha/bin/mocha test/test.js

test-gl-matrix:
	@GLM_JS_MATH_VENDOR=gl-matrix ./node_modules/mocha/bin/mocha test/test.js

test-tdl-fast:
	@GLM_JS_MATH_VENDOR=tdl-fast ./node_modules/mocha/bin/mocha test/test.js

test-glm-js:
	@GLM_JS_MATH_VENDOR=glm-js ./node_modules/mocha/bin/mocha test/test.glm-js.js

jshint:
	@hash jshint >/dev/null 2>&1 && jshint src/glm.common.js || echo "skipping jshint"

clean:
	-rm build/*.js
	-rm -rf lib
	-rm -rf src-wasm
	-rm -rf test-wasm
