import { test } from 'node:test';
import { strict as assert } from 'node:assert';

test('packSnorm2x16', () => {
    const v = new glm.vec2(0.1, -0.5);
    const p = glm.packSnorm2x16(v);
    const u = glm.unpackSnorm2x16(p);

    assert.ok(Math.abs(u.x - 0.1) < 1e-4);
    assert.ok(Math.abs(u.y - (-0.5)) < 1e-4);
});

test('packUnorm2x16', () => {
    const v = new glm.vec2(0.1, 0.5);
    const p = glm.packUnorm2x16(v);
    const u = glm.unpackUnorm2x16(p);

    assert.ok(Math.abs(u.x - 0.1) < 1e-4);
    assert.ok(Math.abs(u.y - 0.5) < 1e-4);
});

test('packSnorm4x8', () => {
    const v = new glm.vec4(0.1, -0.5, 0.2, -0.8);
    const p = glm.packSnorm4x8(v);
    const u = glm.unpackSnorm4x8(p);

    assert.ok(Math.abs(u.x - 0.1) < 1e-2);
    assert.ok(Math.abs(u.y - (-0.5)) < 1e-2);
    assert.ok(Math.abs(u.z - 0.2) < 1e-2);
    assert.ok(Math.abs(u.w - (-0.8)) < 1e-2);
});

test('packUnorm4x8', () => {
    const v = new glm.vec4(0.1, 0.5, 0.2, 0.8);
    const p = glm.packUnorm4x8(v);
    const u = glm.unpackUnorm4x8(p);

    assert.ok(Math.abs(u.x - 0.1) < 1e-2);
    assert.ok(Math.abs(u.y - 0.5) < 1e-2);
    assert.ok(Math.abs(u.z - 0.2) < 1e-2);
    assert.ok(Math.abs(u.w - 0.8) < 1e-2);
});
