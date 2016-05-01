all:
	echo TODO

MINIFIER := java -jar /tmp/closure-compiler-read-only/build/compiler.jar --language_in ECMASCRIPT5 --js -

PREAMBLE := '/*! glm-js built '$(shell date --rfc-3339=seconds)' | (c) humbletim | http://humbletim.github.io/glm-js */'

build/glm-three.js: lib/LICENSE.three.js lib/three.js LICENSE src/glm.common.js src/glm.three.js
	( echo $(PREAMBLE); cat $^ ) > $@

build/glm-gl-matrix.js: lib/LICENSE.gl-matrix.txt lib/gl-matrix.js LICENSE src/glm.common.js src/glm.gl-matrix.js
	( echo $(PREAMBLE); cat $^ ) > $@

build/glm-tdl-fast.js: lib/LICENSE.tdl-fast.js lib/tdl-fast.js LICENSE src/glm.common.js src/glm.tdl-fast.js
	( echo $(PREAMBLE); cat $^ ) > $@

build/__VA_ARGS__.js: src/glm.common.js
	( echo "var src = require('fs').readFileSync('/dev/stdin').toString('utf8');" ; \
	grep __VA_ARGS__I $< -A1 -B3 ; \
	echo "process.stdout.write(src, 'utf8');" ; \
	) > $@
	echo test | node $@

build/glm-js.js: lib/LICENSE.gl-matrix.txt lib/gl-matrix.js LICENSE src/glm.common.js src/glm.gl-matrix.js src/glm.buffers.js src/glm.experimental.js
	( echo $(PREAMBLE); echo '(function(globals, $$GLM_log, $$GLM_console_log) { var GLM, GLMAT, GLMAT_VERSION, GLMJS_PREFIX, $$GLM_console_factory, glm; ArrayBuffer.exists;' ; cat $^ | node build/__VA_ARGS__.js ; echo ' try { module.exports = glm; } catch(e) {}; return glm; })(this, typeof $$GLM_log !== "undefined" ? $$GLM_log : undefined, typeof $$GLM_console_log !== "undefined" ? $$GLM_console_log : undefined);' ) > $@

build/glm-js.min.js: lib/LICENSE.gl-matrix.txt lib/gl-matrix.js LICENSE src/glm.common.js src/glm.gl-matrix.js src/glm.buffers.js src/glm.experimental.js
	( echo $(PREAMBLE); echo '(function declare_glmjs_glmatrix(globals, $$GLM_log, $$GLM_console_log) { var GLM, GLMAT, GLMAT_VERSION, GLMJS_PREFIX, $$GLM_console_factory, glm; ArrayBuffer.exists;' ; \
	cat $^ | node build/__VA_ARGS__.js  | $(MINIFIER) ; \
	echo 'globals.glm = glm; try { module.exports = glm; } catch(e) { }; try { window.glm = glm; } catch(e) {} ; try { declare.amd && declare(function() { return glm; }); } catch(e) {}; return this.glm = glm; })(this, typeof $$GLM_log !== "undefined" ? $$GLM_log : undefined, typeof $$GLM_console_log !== "undefined" ? $$GLM_console_log : undefined);' ) > $@

build/%.min.js: build/%.js
	( echo $(PREAMBLE); echo "glm = (function glmjs_scope(g) { var GLMJS_PREFIX, \$$GLM_console_factory, \$$GLM_reset_logging;" ; \
	cat $< | node build/__VA_ARGS__.js | $(MINIFIER) ; \
	echo "return glm; })(this);" ) > $@

build: build/glm-three.min.js build/glm-gl-matrix.min.js build/glm-tdl-fast.min.js build/glm-js.min.js
	echo OK

test-glm-js:
	GLM=glm-js ./node_modules/.bin/mocha -b

test-glm-js-min:
	GLM=glm-js-min ./node_modules/.bin/mocha -b

test-three:
	GLM=three ./node_modules/.bin/mocha -b

test-three-min:
	GLM=three-min ./node_modules/.bin/mocha -b

test-gl-matrix:
	GLM=gl-matrix ./node_modules/.bin/mocha -b

test-gl-matrix-min:
	GLM=gl-matrix-min ./node_modules/.bin/mocha -b

test-tdl-fast:
	GLM=tdl-fast ./node_modules/.bin/mocha -b

test-tdl-fast-min:
	GLM=tdl-fast-min ./node_modules/.bin/mocha -b

test: test-three test-gl-matrix test-tdl-fast test-glm-js
	@echo OK

test-min: test-three-min test-gl-matrix-min test-tdl-fast-min test-glm-js-min
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
	./node_modules/.bin/mocha --watch test/test.js

.PHONY: test

j.js: lib/three.js src/glm.common.js src/glm.three.js src/glm-js.js
	( cat xjs._ENV.js ; echo 'console=_ENV.console; ' ; cat $^ | sed -E 's/\bTHREE\b/THREEMATHS/g;s/var THREEMATHS/THREEMATHS/;' ; echo '_ENV.console.warn(glm);' ) > $@

engine-test: j.js
	for x in node node-0.6.6 smjs v8 d8 ; do which $$x && $$x j.js ; done

smjs-test: lib/three.js \
	src/glm.common.js src/glm.three.js src/glm.buffers.js src/glm.experimental.js \
	test/browser/chai.js test/browser/mocha.js test/browser/cane.js \
	 test/test.js
	( cat  xjs._ENV.js ; cat smjs.js; echo 'PRE();' ; for x in $^ ; do echo "load('$$x');"; done ; echo ';POST();' )  | env DEBUG=1 GLM=three smjs
