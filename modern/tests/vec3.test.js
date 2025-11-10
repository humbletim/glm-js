import test from 'node:test';
import assert from 'node:assert/strict';

test('vec3 constructor and initialization', () => {
  // Empty constructor
  const v0 = glm.vec3();
  assert.deepEqual(v0.elements, new Float32Array([0, 0, 0]), 'vec3() should create a zero vector');

  // Scalar constructor
  const v1 = glm.vec3(1);
  assert.deepEqual(v1.elements, new Float32Array([1, 1, 1]), 'vec3(1) should create a vector with all components set to 1');

  // Component-wise constructor
  const v2 = glm.vec3(1, 2, 3);
  assert.deepEqual(v2.elements, new Float32Array([1, 2, 3]), 'vec3(1, 2, 3) should create a vector with components [1, 2, 3]');

  // Copy constructor from another vec3
  const v3 = glm.vec3(v2);
  assert.deepEqual(v3.elements, new Float32Array([1, 2, 3]), 'vec3(vec3) should create a copy');
  assert.notStrictEqual(v3.elements, v2.elements, 'Copy constructor should create a new Float32Array');

  // Promotion from vec2
  const v4 = glm.vec3(glm.vec2(1, 2), 3);
  assert.deepEqual(v4.elements, new Float32Array([1, 2, 3]), 'vec3(vec2, 3) should promote and construct the vector');

  // Demotion from vec4
  const v5 = glm.vec3(glm.vec4(4, 3, 2, 1));
  assert.deepEqual(v5.elements, new Float32Array([4, 3, 2]), 'vec3(vec4) should demote and copy the first three components');
});

test('vec3 core operations', () => {
  const v_a = glm.vec3(1, 2, 3);
  const v_b = glm.vec3(4, 5, 6);

  // Addition
  const v_add = v_a['+'](v_b);
  assert.deepEqual(v_add.elements, new Float32Array([5, 7, 9]), "vec3 addition should be component-wise");

  // Subtraction
  const v_sub = v_b['-'](v_a);
  assert.deepEqual(v_sub.elements, new Float32Array([3, 3, 3]), "vec3 subtraction should be component-wise");

  // Multiplication (scalar)
  const v_mul = v_a['*'](2);
  assert.deepEqual(v_mul.elements, new Float32Array([2, 4, 6]), "vec3 scalar multiplication should be component-wise");

  // Division (scalar)
  const v_div = v_b['/'](2);
  assert.deepEqual(v_div.elements, new Float32Array([2, 2.5, 3]), "vec3 scalar division should be component-wise");
});
