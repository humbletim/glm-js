import test from 'node:test';
import assert from 'node:assert/strict';

test('vec2 constructor and initialization', () => {
  // Empty constructor
  const v0 = glm.vec2();
  assert.deepEqual(v0.elements, new Float32Array([0, 0]), 'vec2() should create a zero vector');

  // Scalar constructor
  const v1 = glm.vec2(1);
  assert.deepEqual(v1.elements, new Float32Array([1, 1]), 'vec2(1) should create a vector with all components set to 1');

  // Component-wise constructor
  const v2 = glm.vec2(1, 2);
  assert.deepEqual(v2.elements, new Float32Array([1, 2]), 'vec2(1, 2) should create a vector with components [1, 2]');

  // Copy constructor from another vec2
  const v3 = glm.vec2(v2);
  assert.deepEqual(v3.elements, new Float32Array([1, 2]), 'vec2(vec2) should create a copy');
  assert.notStrictEqual(v3.elements, v2.elements, 'Copy constructor should create a new Float32Array');

  // Demotion from vec3
  const v4 = glm.vec2(glm.vec3(3, 2, 1));
  assert.deepEqual(v4.elements, new Float32Array([3, 2]), 'vec2(vec3) should demote and copy the first two components');

  // Demotion from vec4
  const v5 = glm.vec2(glm.vec4(3, 2, 1, 0));
  assert.deepEqual(v5.elements, new Float32Array([3, 2]), 'vec2(vec4) should demote and copy the first two components');
});

test('vec2 core operations', () => {
  const v_a = glm.vec2(1, 2);
  const v_b = glm.vec2(3, 4);

  // Addition
  const v_add = v_a['+'](v_b);
  assert.deepEqual(v_add.elements, new Float32Array([4, 6]), "vec2 addition should be component-wise");

  // Subtraction
  const v_sub = v_b['-'](v_a);
  assert.deepEqual(v_sub.elements, new Float32Array([2, 2]), "vec2 subtraction should be component-wise");

  // Multiplication (scalar)
  const v_mul = v_a['*'](2);
  assert.deepEqual(v_mul.elements, new Float32Array([2, 4]), "vec2 scalar multiplication should be component-wise");

  // Division (scalar)
  const v_div = v_b['/'](2);
  assert.deepEqual(v_div.elements, new Float32Array([1.5, 2]), "vec2 scalar division should be component-wise");
});
