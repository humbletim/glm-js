all:
	echo TODO

MINIFIER := java -jar /tmp/closure-compiler-read-only/build/compiler.jar --language_in ECMASCRIPT5 --js -

build/glm-three.js: lib/three.js src/glm.common.js src/glm.three.js
	cat $^ > $@

build/glm-gl-matrix.js: lib/gl-matrix.js src/glm.common.js src/glm.gl-matrix.js
	cat $^ > $@

build/glm-tdl-fast.js: lib/tdl-fast.js src/glm.common.js src/glm.tdl-fast.js
	cat $^ > $@

build/%.min.js: build/%.js
	cat $< | $(MINIFIER) > $@

build: build/glm-three.min.js build/glm-gl-matrix.min.js build/glm-tdl-fast.min.js
	echo OK

test-three:
	GLM=three ../node_modules/.bin/mocha -b

test-gl-matrix:
	GLM=gl-matrix ../node_modules/.bin/mocha -b

test-tdl-fast:
	GLM=tdl-fast ../node_modules/.bin/mocha -b

test: test-three test-gl-matrix test-tdl-fast
	@echo OK

coverage-three:
	GLM=three npm test

coverage-gl-matrix:
	GLM=gl-matrix npm test

coverage-tdl-fast:
	GLM=tdl-fast npm test

coverage: coverage-three coverage-gl-matrix coverage-tdl-fast
	@echo OK

watch:
	../node_modules/.bin/mocha --watch test/test.js

.PHONY: test

j.js: lib/three.js src/glm.common.js src/glm.three.js src/glm-js.js
	( cat xjs._ENV.js ; echo 'console=_ENV.console; ' ; cat $^ | sed -E 's/\bTHREE\b/THREEMATHS/g' ; echo '_ENV.console.warn(glm);' ) > $@

engine-test: j.js
	for x in node node-0.6.6 smjs v8 d8 ; do which $$x && $$x j.js ; done

