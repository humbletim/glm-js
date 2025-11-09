const test = require('node:test');
const assert = require('node:assert/strict');
const glm = require('../build/glm-three.js');

test('mat3 constructor and initialization', () => {
  // Empty constructor
  const m0 = glm.mat3();
  assert.deepEqual(m0.elements, new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]), 'mat3() should create an identity matrix');

  // Scalar constructor
  const m1 = glm.mat3(2);
  assert.deepEqual(m1.elements, new Float32Array([2, 0, 0, 0, 2, 0, 0, 0, 2]), 'mat3(2) should create a diagonal matrix');

  // Reference constructor from another mat3 (functional style)
  const m2_ref = glm.mat3(m1);
  assert.deepEqual(m2_ref.elements, m1.elements, 'glm.mat3(mat3) should have the same values');
  assert.strictEqual(m2_ref.elements, m1.elements, 'functional glm.mat3(mat3) should create a reference (share the buffer)');

  // Copy constructor from another mat3 (using 'new')
  const m2_copy = new glm.mat3(m1);
  assert.deepEqual(m2_copy.elements, m1.elements, 'new glm.mat3(mat3) should create a copy with the same values');
  assert.notStrictEqual(m2_copy.elements, m1.elements, "new glm.mat3(mat3) should create a new buffer (true copy)");

  // Demotion from mat4
  const m4 = glm.mat4(glm.mat3(2)); // start with a mat3, so we know the values
  const m3_from_m4 = glm.mat3(m4);
  assert.deepEqual(m3_from_m4.elements, m1.elements, 'mat3(mat4) should demote and copy the top-left 3x3 components');
});

test('mat3 core operations', () => {
  const m_a = glm.mat3(2);
  const m_b = glm.mat3(3);
  const m_result = glm.mat3(6);

  // Matrix multiplication
  const m_mul = m_a['*'](m_b);
  assert.deepEqual(m_mul.elements, m_result.elements, "mat3 multiplication should be correct");
});
