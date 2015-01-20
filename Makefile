# quick build system; still need to decide on better packaging / JS Unit

all:
	echo TODO

CXX := g++ -I/tmp/latest-glm -std=c++0x
MINIFIER := java -jar /tmp/closure-compiler-read-only/build/compiler.jar --language_in ECMASCRIPT5 --js -

tmp/test-%: tests/%.cpp
	$(CXX) $< -o $@

build/glm.js: lib/three.js src/glm.three.js
	cat $^ > $@

build/glm.min.js: build/glm.js
	cat $< | $(MINIFIER) > $@

# this is sorta dumb tho allows for some initial visual testing
test-g-truc: tmp/test-ex-g-truc
	./tmp/_compare.sh g-truc

test-improv: tmp/test-ex-improv
	./tmp/_compare.sh improv

test-readme: tmp/test-ex-readme
	./tmp/_compare.sh readme

test: test-g-truc test-improv test-readme
	echo done
