import test from 'node:test';
import assert from 'node:assert/strict';

test('quat constructor and initialization', () => {
  // Empty constructor
  const q0 = glm.quat();
  assert.deepEqual(q0.elements, new Float32Array([0, 0, 0, 1]), 'quat() should create an identity quaternion');

  // Scalar constructor (w-component)
  const q1 = glm.quat(1); // In glm-js, this sets the 'w' component.
  assert.deepEqual(q1.elements, new Float32Array([0, 0, 0, 1]), 'quat(1) should create an identity quaternion');

  // Component-wise constructor (w, x, y, z)
  const q2 = glm.quat(1, 2, 3, 4);
  assert.deepEqual(q2.elements, new Float32Array([2, 3, 4, 1]), 'quat(w,x,y,z) should create a quaternion with components [x,y,z,w]');

  // Copy constructor from another quat (functional style) - quat always copies
  const q_ref = glm.quat(q2);
  assert.deepEqual(q_ref.elements, q2.elements, 'glm.quat(quat) should create a copy with the same values');
  assert.notStrictEqual(q_ref.elements, q2.elements, 'functional glm.quat(quat) should create a new buffer (true copy)');

  // Copy constructor from another quat (using 'new')
  const q_copy = new glm.quat(q2);
  assert.deepEqual(q_copy.elements, q2.elements, 'new glm.quat(quat) should create a copy with the same values');
  assert.notStrictEqual(q_copy.elements, q2.elements, "new glm.quat(quat) should create a new buffer (true copy)");
});

test('quat core operations', () => {
  // Using angleAxis to create quaternions for predictable rotations
  const angle = Math.PI / 2; // 90 degrees
  const axis = glm.vec3(0, 1, 0); // Y-axis
  const q_a = glm.angleAxis(angle, axis);

  const angle2 = Math.PI / 4; // 45 degrees
  const q_b = glm.angleAxis(angle2, axis);

  const expected_elements = new Float32Array([0, 0.9238795, 0, 0.3826834]);
  const tolerance = 0.0001;

  // Quaternion multiplication
  const q_mul = q_a['*'](q_b);

  // Perform a fuzzy comparison directly
  for (let i = 0; i < 4; i++) {
    const diff = Math.abs(q_mul.elements[i] - expected_elements[i]);
    assert.ok(diff < tolerance, `Value at index ${i} is out of tolerance. Actual: ${q_mul.elements[i]}, Expected: ${expected_elements[i]}`);
  }
});

test('quat to_string serialization', () => {
  // Test with a known quaternion
  const q = glm.quat(0.92388, 0, 0.38268, 0); // Represents a 45-degree rotation around Y
  const expectedString = 'quat(0.923880, {0.000000, 0.382680, 0.000000})';

  // Use glm.to_string from the main index
  const actualString = glm.to_string(q);

  assert.strictEqual(actualString, expectedString, 'glm.to_string(quat) should match the GLM C++ format "quat(w, {x, y, z})"');

  // Test with identity
  const q_identity = glm.quat();
  const expectedIdentityString = 'quat(1.000000, {0.000000, 0.000000, 0.000000})';
  const actualIdentityString = glm.to_string(q_identity);
  assert.strictEqual(actualIdentityString, expectedIdentityString, 'to_string for identity quaternion should be formatted correctly');
});
