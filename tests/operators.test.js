import test from 'node:test';
import assert from 'node:assert/strict';

test('Operator Sugar: In-place assignment operators', () => {
  // vec3 addition
  const v_add = glm.vec3(1, 2, 3);
  v_add['+='](glm.vec3(10));
  assert.deepEqual(v_add.elements, new Float32Array([11, 12, 13]), "vec3['+='] should perform in-place addition");

  // vec3 subtraction
  const v_sub = glm.vec3(11, 12, 13);
  v_sub['-=' ](glm.vec3(1));
  assert.deepEqual(v_sub.elements, new Float32Array([10, 11, 12]), "vec3['-=' ] should perform in-place subtraction");

  // vec3 multiplication
  const v_mul = glm.vec3(2, 3, 4);
  v_mul['*='](2);
  assert.deepEqual(v_mul.elements, new Float32Array([4, 6, 8]), "vec3['*='] should perform in-place scalar multiplication");

  // vec3 division
  const v_div = glm.vec3(4, 6, 8);
  v_div['/='](2);
  assert.deepEqual(v_div.elements, new Float32Array([2, 3, 4]), "vec3['/='] should perform in-place scalar division");
});

test('Operator Sugar: Equality operators', () => {
  const v1 = glm.vec3(1, 2, 3);
  const v2 = glm.vec3(1, 2, 3);
  const v3 = glm.vec3(4, 5, 6);
  const v_epsilon = glm.vec3(1 + glm.epsilon() / 2, 2, 3);

  // Exact equality
  assert.strictEqual(v1['=='](v2), true, "vec3['=='] should return true for equal vectors");
  assert.strictEqual(v1['=='](v3), false, "vec3['=='] should return false for unequal vectors");

  // Epsilon equality
  assert.strictEqual(v1['~='](v_epsilon), true, "vec3['~='] should return true for vectors within epsilon tolerance");
  assert.strictEqual(v1['~='](v3), false, "vec3['~='] should return false for vectors outside epsilon tolerance");
});
