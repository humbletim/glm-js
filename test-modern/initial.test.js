const test = require('node:test');
const assert = require('node:assert/strict');
const glm = require('../build/glm-three.js');

test('Initial Test Setup', () => {
  assert.ok(glm, 'The glm object should be successfully imported.');
  assert.strictEqual(typeof glm.vec3, 'function', 'glm.vec3 should be a function.');
  const v = glm.vec3(1, 2, 3);
  assert.ok(v, 'vec3 instance should be created successfully.');
});
