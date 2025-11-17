import { test } from 'node:test';
import assert from 'node:assert/strict';

test('glm.to_string', (t) => {
    assert.strictEqual(glm.to_string(1), '1', 'to_string(number)');
    assert.strictEqual(glm.to_string('hello'), 'hello', 'to_string(string)');
    assert.strictEqual(glm.to_string(true), 'true', 'to_string(boolean)');
    assert.strictEqual(glm.to_string(null), 'null', 'to_string(null)');
    assert.strictEqual(glm.to_string(undefined), 'null', 'to_string(undefined)');
    assert.strictEqual(glm.to_string(glm.vec2(1, 2)), 'fvec2(1.000000, 2.000000)', 'to_string(vec2)');
    assert.strictEqual(glm.to_string(glm.vec3(1, 2, 3)), 'fvec3(1.000000, 2.000000, 3.000000)', 'to_string(vec3)');
    assert.strictEqual(glm.to_string(glm.vec4(1, 2, 3, 4)), 'fvec4(1.000000, 2.000000, 3.000000, 4.000000)', 'to_string(vec4)');
    assert.strictEqual(glm.to_string(glm.mat3()), 'mat3(1.000000, 0.000000, 0.000000, 0.000000, 1.000000, 0.000000, 0.000000, 0.000000, 1.000000)', 'to_string(mat3)');
    assert.strictEqual(glm.to_string(glm.quat(1,2,3,4)), 'quat(1.000000, {2.000000, 3.000000, 4.000000})', 'to_string(quat)');
});
