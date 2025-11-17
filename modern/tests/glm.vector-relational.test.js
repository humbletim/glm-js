import { test } from 'node:test';
import { strict as assert } from 'node:assert';

test('any', () => {
    const v1 = new glm.vec2(true, false);
    assert.ok(glm.any(v1));

    const v2 = new glm.vec2(false, false);
    assert.ok(!glm.any(v2));
});

test('all', () => {
    const v1 = new glm.vec2(true, false);
    assert.ok(!glm.all(v1));

    const v2 = new glm.vec2(true, true);
    assert.ok(glm.all(v2));
});

test('equal', () => {
    const v1 = new glm.vec2(1, 2);
    const v2 = new glm.vec2(1, 3);
    const v3 = glm.equal(v1, v2);

    assert.deepStrictEqual(v3.elements, new Float32Array([1, 0]));
});

test('notEqual', () => {
    const v1 = new glm.vec2(1, 2);
    const v2 = new glm.vec2(1, 3);
    const v3 = glm.notEqual(v1, v2);

    assert.deepStrictEqual(v3.elements, new Float32Array([0, 1]));
});

test('lessThan', () => {
    const v1 = new glm.vec2(1, 2);
    const v2 = new glm.vec2(1, 3);
    const v3 = glm.lessThan(v1, v2);

    assert.deepStrictEqual(v3.elements, new Float32Array([0, 1]));
});

test('lessThanEqual', () => {
    const v1 = new glm.vec2(1, 2);
    const v2 = new glm.vec2(1, 3);
    const v3 = glm.lessThanEqual(v1, v2);

    assert.deepStrictEqual(v3.elements, new Float32Array([1, 1]));
});

test('greaterThan', () => {
    const v1 = new glm.vec2(1, 2);
    const v2 = new glm.vec2(1, 3);
    const v3 = glm.greaterThan(v1, v2);

    assert.deepStrictEqual(v3.elements, new Float32Array([0, 0]));
});

test('greaterThanEqual', () => {
    const v1 = new glm.vec2(1, 2);
    const v2 = new glm.vec2(1, 3);
    const v3 = glm.greaterThanEqual(v1, v2);

    assert.deepStrictEqual(v3.elements, new Float32Array([1, 0]));
});

test('not_', () => {
    const v1 = new glm.vec2(true, false);
    const v2 = glm.not_(v1);

    assert.deepStrictEqual(v2.elements, new Float32Array([0, 1]));
});
