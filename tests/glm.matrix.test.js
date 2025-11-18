import { test } from 'node:test';
import { strict as assert } from 'node:assert';

test('Matrix functions', (t) => {
    const m = new glm.mat3();
    m.elements.set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assert.strictEqual(glm.determinant(m), 0);

    const m1 = new glm.mat3();
    m1.elements.set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const m2 = new glm.mat3();
    m2.elements.set([9, 8, 7, 6, 5, 4, 3, 2, 1]);
    const m3 = glm.matrixCompMult(m1, m2);
    const expected = new glm.mat3();
    expected.elements.set([9, 16, 21, 24, 25, 24, 21, 16, 9]);
    assert.ok(m3.equals(expected));

    const v1 = new glm.vec3(1, 2, 3);
    const v2 = new glm.vec3(4, 5, 6);
    const m4 = glm.outerProduct(v1, v2);
    const expected2 = new glm.mat3();
    expected2.elements.set([4, 8, 12, 5, 10, 15, 6, 12, 18]);
    assert.ok(m4.equals(expected2));
});
