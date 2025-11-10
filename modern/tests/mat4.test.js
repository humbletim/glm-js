import test from 'node:test';
import assert from 'node:assert/strict';

test('mat4 constructor and initialization', () => {
  // Empty constructor
  const m0 = glm.mat4();
  assert.deepEqual(m0.elements, new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), 'mat4() should create an identity matrix');

  // Scalar constructor
  const m1 = glm.mat4(2);
  assert.deepEqual(m1.elements, new Float32Array([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2]), 'mat4(2) should create a diagonal matrix');

  // Reference constructor from another mat4 (functional style)
  const m2_ref = glm.mat4(m1);
  assert.deepEqual(m2_ref.elements, m1.elements, 'glm.mat4(mat4) should have the same values');
  assert.strictEqual(m2_ref.elements, m1.elements, 'functional glm.mat4(mat4) should create a reference (share the buffer)');

  // Copy constructor from another mat4 (using 'new')
  const m2_copy = new glm.mat4(m1);
  assert.deepEqual(m2_copy.elements, m1.elements, 'new glm.mat4(mat4) should create a copy with the same values');
  assert.notStrictEqual(m2_copy.elements, m1.elements, "new glm.mat4(mat4) should create a new buffer (true copy)");

  // Promotion from mat3
  const m3 = glm.mat3(3);
  const m4_from_m3 = glm.mat4(m3);
  const expected_m4 = glm.mat4();
  expected_m4.elements.set([3,0,0,0, 3,0,0,0, 3,0,0,0, 0,0,1]); // a bit manual, but clear
  assert.deepEqual(m4_from_m3.elements, new Float32Array([3,0,0,0, 0,3,0,0, 0,0,3,0, 0,0,0,1]), 'mat4(mat3) should promote the 3x3 matrix');
});

test('mat4 core operations', () => {
  const m_a = glm.mat4(2);
  const m_b = glm.mat4(3);
  const m_result = glm.mat4(6);

  // Matrix multiplication
  const m_mul = m_a['*'](m_b);
  assert.deepEqual(m_mul.elements, m_result.elements, "mat4 multiplication should be correct");
});
