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

test('vec4 constructor and initialization', () => {
  // Empty constructor
  const v0 = glm.vec4();
  assert.deepEqual(v0.elements, new Float32Array([0, 0, 0, 0]), 'vec4() should create a zero vector');

  // Scalar constructor
  const v1 = glm.vec4(1);
  assert.deepEqual(v1.elements, new Float32Array([1, 1, 1, 1]), 'vec4(1) should create a vector with all components set to 1');

  // Component-wise constructor
  const v2 = glm.vec4(1, 2, 3, 4);
  assert.deepEqual(v2.elements, new Float32Array([1, 2, 3, 4]), 'vec4(1, 2, 3, 4) should create a vector with components [1, 2, 3, 4]');

  // Copy constructor from another vec4
  const v3 = glm.vec4(v2);
  assert.deepEqual(v3.elements, new Float32Array([1, 2, 3, 4]), 'vec4(vec4) should create a copy');
  assert.notStrictEqual(v3.elements, v2.elements, 'Copy constructor should create a new Float32Array');

  // Promotion from vec3
  const v4 = glm.vec4(glm.vec3(1, 2, 3), 4);
  assert.deepEqual(v4.elements, new Float32Array([1, 2, 3, 4]), 'vec4(vec3, 4) should promote and construct the vector');

  // Promotion from vec2
  const v5 = glm.vec4(glm.vec2(1, 2), 3, 4);
  assert.deepEqual(v5.elements, new Float32Array([1, 2, 3, 4]), 'vec4(vec2, 3, 4) should promote and construct the vector');
});

test('vec4 core operations', () => {
  const v_a = glm.vec4(1, 2, 3, 4);
  const v_b = glm.vec4(5, 6, 7, 8);

  // Addition
  const v_add = v_a['+'](v_b);
  assert.deepEqual(v_add.elements, new Float32Array([6, 8, 10, 12]), "vec4 addition should be component-wise");

  // Subtraction
  const v_sub = v_b['-'](v_a);
  assert.deepEqual(v_sub.elements, new Float32Array([4, 4, 4, 4]), "vec4 subtraction should be component-wise");

  // Multiplication (scalar)
  const v_mul = v_a['*'](2);
  assert.deepEqual(v_mul.elements, new Float32Array([2, 4, 6, 8]), "vec4 scalar multiplication should be component-wise");

  // Division (scalar)
  const v_div = v_b['/'](2);
  assert.deepEqual(v_div.elements, new Float32Array([2.5, 3, 3.5, 4]), "vec4 scalar division should be component-wise");
});

test('Top-level Functions: Vector operations', () => {
    const v2 = glm.vec2(3, 4);
    assert.strictEqual(glm.length(v2), 5, "length of a vec2");

    const v3 = glm.vec3(2, 3, 6);
    assert.strictEqual(glm.length(v3), 7, "length of a vec3");

    const v4 = glm.vec4(2, 4, 6, 7);
    assert.ok(Math.abs(glm.length(v4) - Math.sqrt(105)) < 1e-6, "length of a vec4");

    assert.strictEqual(glm.length2(v2), 25, "squared length of a vec2");
    assert.strictEqual(glm.length2(v3), 49, "squared length of a vec3");
    assert.strictEqual(glm.length2(v4), 105, "squared length of a vec4");

    const v2_2 = glm.vec2(1, 2);
    const v2_3 = glm.vec2(4, 6);
    assert.strictEqual(glm.distance(v2_2, v2_3), 5, "distance between two vec2s");

    const v3_2 = glm.vec3(1, 2, 3);
    const v3_3 = glm.vec3(3, 5, 9);
    assert.strictEqual(glm.distance(v3_2, v3_3), 7, "distance between two vec3s");

    const v4_2 = glm.vec4(1, 2, 3, 4);
    const v4_3 = glm.vec4(3, 6, 9, 11);
    assert.ok(Math.abs(glm.distance(v4_2, v4_3) - Math.sqrt(105)) < 1e-6, "distance between two vec4s");

    const v2_4 = glm.vec2(1, 2);
    const v2_5 = glm.vec2(5, 6);
    const result_mix_v2 = glm.mix(v2_4, v2_5, 0.5);
    assert.deepStrictEqual(Array.from(result_mix_v2.elements), [3, 4], "mix two vec2s");

    const v3_4 = glm.vec3(1, 2, 3);
    const v3_5 = glm.vec3(5, 6, 7);
    const result_mix_v3 = glm.mix(v3_4, v3_5, 0.5);
    assert.deepStrictEqual(Array.from(result_mix_v3.elements), [3, 4, 5], "mix two vec3s");

    const v4_4 = glm.vec4(1, 2, 3, 4);
    const v4_5 = glm.vec4(5, 6, 7, 8);
    const result_mix_v4 = glm.mix(v4_4, v4_5, 0.5);
    assert.deepStrictEqual(Array.from(result_mix_v4.elements), [3, 4, 5, 6], "mix two vec4s");

    const v2_6 = glm.vec2(-1, 5);
    const result_clamp_v2 = glm.clamp(v2_6, 0, 4);
    assert.deepStrictEqual(Array.from(result_clamp_v2.elements), [0, 4], "clamp a vec2");

    const v3_6 = glm.vec3(-1, 5, 2);
    const result_clamp_v3 = glm.clamp(v3_6, 0, 4);
    assert.deepStrictEqual(Array.from(result_clamp_v3.elements), [0, 4, 2], "clamp a vec3");

    const v4_6 = glm.vec4(-1, 5, 2, 10);
    const result_clamp_v4 = glm.clamp(v4_6, 0, 4);
    assert.deepStrictEqual(Array.from(result_clamp_v4.elements), [0, 4, 2, 4], "clamp a vec4");
});
