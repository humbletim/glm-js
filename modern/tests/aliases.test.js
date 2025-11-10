// modern/tests/aliases.test.js
import test from 'node:test';
import assert from 'node:assert/strict';

test('Aliases and Alternative Conventions', () => {
    test('Top-level aliases', () => {
        const v1 = glm.vec3(1, 2, 3);
        const v2 = glm.vec3(4, 5, 6);

        assert.deepStrictEqual(glm.add(v1, v2), v1['+'](v2));
        assert.deepStrictEqual(glm.sub(v1, v2), v1['-'](v2));
        assert.deepStrictEqual(glm.mul(v1, v2), v1['*'](v2));
        assert.deepStrictEqual(glm.div(v1, 2), v1['/'](2));
    });
});

test('Operator Sugar', () => {
    test("vec3['*'](vec3)", () => {
        const v1 = glm.vec3(1, 2, 3);
        const v2 = glm.vec3(4, 5, 6);
        const result = v1['*'](v2);
        assert.deepStrictEqual(result.array, [4, 10, 18]);
    });
});
