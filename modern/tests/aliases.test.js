// modern/tests/aliases.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Canonical Naming and Aliases', () => {

    it('should confirm .equal() is canonical and .eql() is a functioning alias', () => {
        const v1 = new glm.vec3(1, 2, 3);
        const v2 = new glm.vec3(1, 2, 3);
        const v3 = new glm.vec3(4, 5, 6);

        assert.ok(v1.equal(v2), '.equal() should return true for equal vectors');
        assert.ok(v1.eql(v2), '.eql() alias should also return true for equal vectors');
        assert.strictEqual(v1.equal(v3), false, '.equal() should return false for unequal vectors');
        assert.strictEqual(v1.eql(v3), false, '.eql() alias should also return false for unequal vectors');
    });

    it('should confirm .epsilonEqual() is canonical and .eql_epsilon() is a functioning alias', () => {
        const v1 = new glm.vec3(1, 2, 3);
        const v2 = new glm.vec3(1.0000001, 2.0000001, 3.0000001);
        const v3 = new glm.vec3(1.1, 2.1, 3.1);

        assert.ok(v1.epsilonEqual(v2), '.epsilonEqual() should return true for vectors within epsilon');
        assert.ok(v1.eql_epsilon(v2), '.eql_epsilon() alias should also return true for vectors within epsilon');
        assert.strictEqual(v1.epsilonEqual(v3), false, '.epsilonEqual() should return false for vectors outside epsilon');
        assert.strictEqual(v1.eql_epsilon(v3), false, '.eql_epsilon() alias should also return false for vectors outside epsilon');
    });

});
