import { test } from 'node:test';
import { strict as assert } from 'node:assert';

test('Exponential functions', (t) => {
    assert.strictEqual(glm.pow(2, 3), 8);
    assert.strictEqual(glm.exp(0), 1);
    assert.strictEqual(glm.log(1), 0);
    assert.strictEqual(glm.exp2(3), 8);
    assert.strictEqual(glm.log2(8), 3);
    assert.strictEqual(glm.sqrt(4), 2);
    assert.strictEqual(glm.inversesqrt(4), 0.5);
});
