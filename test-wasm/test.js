// test-wasm/test.js
const assert = require('chai').assert;
const glm = require('../build/glm-wasm.js');

describe('glm-wasm', function() {
    before(function() {
        return glm.init();
    });

    it('should create a vec2', function() {
        const v = glm.vec2(1, 2);
        assert.equal(v.x, 1);
        assert.equal(v.y, 2);
        assert.equal(v.toString(), 'vec2(1, 2)');
    });

    it('should add two vec2s', function() {
        const v1 = glm.vec2(1, 2);
        const v2 = glm.vec2(3, 4);
        const v3 = v1['+'](v2);
        assert.equal(v3.x, 4);
        assert.equal(v3.y, 6);
        assert.equal(v3.toString(), 'vec2(4, 6)');
    });

    it('should clone a vec2', function() {
        const v1 = glm.vec2(1, 2);
        const v2 = glm.vec2(v1);
        assert.notEqual(v1, v2);
        assert.equal(v2.x, 1);
        assert.equal(v2.y, 2);
    });
});
