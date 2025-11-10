import test from 'node:test';
import assert from 'node:assert/strict';

test('Swizzling: Read operations', () => {
  const v4 = glm.vec4(1, 2, 3, 4);

  // Single component access
  assert.strictEqual(v4.x, 1, '.x should return the first component');
  assert.strictEqual(v4.y, 2, '.y should return the second component');
  assert.strictEqual(v4.z, 3, '.z should return the third component');
  assert.strictEqual(v4.w, 4, '.w should return the fourth component');

  // Multi-component access (should return new vector types)
  const v3_swizzle = v4.xyz;
  assert.ok(v3_swizzle instanceof glm.vec3, '.xyz should return a vec3 instance');
  assert.deepEqual(v3_swizzle.elements, new Float32Array([1, 2, 3]), '.xyz should return the first three components');

  const v2_swizzle = v4.zw;
  assert.ok(v2_swizzle instanceof glm.vec2, '.zw should return a vec2 instance');
  assert.deepEqual(v2_swizzle.elements, new Float32Array([3, 4]), '.zw should return the last two components');
});

test('Swizzling: Write operations', () => {
  // To a single component
  const v_single = glm.vec4(0, 0, 0, 0);
  v_single.x = 1;
  v_single.y = 2;
  assert.deepEqual(v_single.elements, new Float32Array([1, 2, 0, 0]), 'Single component assignment should work');

  // To multiple components from another vector
  const v_multi = glm.vec4(1, 2, 3, 4);
  v_multi.xy = v_multi.zw; // Assign [3, 4] to the first two components
  assert.deepEqual(v_multi.elements, new Float32Array([3, 4, 3, 4]), 'Multi-component assignment from another vector should work');

  // To multiple components from an array
  const v_array = glm.vec4(0, 0, 0, 0);
  v_array.yz = [8, 9];
  assert.deepEqual(v_array.elements, new Float32Array([0, 8, 9, 0]), 'Multi-component assignment from an array should work');
});
