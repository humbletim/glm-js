const test = require('node:test');
const assert = require('node:assert/strict');
const glm = require('../build/glm-three.js');

test('Top-level Functions: Vector operations', () => {
  // glm.dot
  const v_dot1 = glm.vec3(1, 2, 3);
  const v_dot2 = glm.vec3(4, 5, 6);
  assert.strictEqual(glm.dot(v_dot1, v_dot2), 32, 'glm.dot should return the dot product of two vectors');

  // glm.cross
  const v_cross1 = glm.vec3(1, 0, 0);
  const v_cross2 = glm.vec3(0, 1, 0);
  const cross_result = glm.cross(v_cross1, v_cross2);
  assert.deepEqual(cross_result.elements, new Float32Array([0, 0, 1]), 'glm.cross should return the cross product of two vectors');

  // glm.normalize
  const v_norm = glm.vec3(0, 5, 0);
  const norm_result = glm.normalize(v_norm);
  assert.deepEqual(norm_result.elements, new Float32Array([0, 1, 0]), 'glm.normalize should return a unit vector');
});

test('Top-level Functions: Transformation operations', () => {
  const m_ident = glm.mat4();
  const v_trans = glm.vec3(1, 2, 3);

  // glm.translate
  const m_translated = glm.translate(m_ident, v_trans);
  const expected_trans = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1]);
  assert.deepEqual(m_translated.elements, expected_trans, 'glm.translate should produce a correct translation matrix');

  // glm.rotate
  const angle = Math.PI / 2;
  const axis = glm.vec3(0, 0, 1);
  const m_rotated = glm.rotate(m_ident, angle, axis);
  const cos_a = Math.cos(angle);
  const sin_a = Math.sin(angle);
  const expected_rot = new Float32Array([cos_a, sin_a, 0, 0, -sin_a, cos_a, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

  for (let i = 0; i < 16; i++) {
    assert.ok(Math.abs(m_rotated.elements[i] - expected_rot[i]) < 0.0001, `Rotation matrix element at index ${i} is incorrect`);
  }

  // glm.scale
  const v_scale = glm.vec3(2, 3, 4);
  const m_scaled = glm.scale(m_ident, v_scale);
  const expected_scale = new Float32Array([2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1]);
  assert.deepEqual(m_scaled.elements, expected_scale, 'glm.scale should produce a correct scaling matrix');
});
