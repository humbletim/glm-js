import { test } from 'node:test';
import { strict as assert } from 'node:assert';

test('Geometric functions', (t) => {
    const v1 = new glm.vec3(1, 0, 0);
    const v2 = new glm.vec3(0, 1, 0);
    const v3 = new glm.vec3(0, 0, 1);
    const v4 = new glm.vec3(0, 0, -1);

    const ff1 = glm.faceforward(v1, v2, v3);
    assert.ok(ff1.equals(v1['*'](-1)));

    const ff2 = glm.faceforward(v1, v4, v3);
    assert.ok(ff2.equals(v1));

    const r = glm.reflect(new glm.vec3(1, -1, 0), new glm.vec3(0, 1, 0));
    assert.ok(r.equals(new glm.vec3(1, 1, 0)));

    const ref = glm.refract(new glm.vec3(1, -1, 0), new glm.vec3(0, 1, 0), 1);
    assert.ok(ref.equals(new glm.vec3(1, -1, 0)));
});
