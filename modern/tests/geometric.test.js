import test from 'node:test';
import assert from 'node:assert/strict';

test('Top-level Functions: Geometric operations', () => {
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
