// modern/tests/trigonometric.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Trigonometric Functions', () => {
    it('should calculate sin', () => {
        assert.strictEqual(glm.sin(0), 0);
        assert.strictEqual(glm.sin(Math.PI / 2), 1);
    });

    it('should calculate cos', () => {
        assert.strictEqual(glm.cos(0), 1);
        assert.strictEqual(glm.cos(Math.PI), -1);
    });

    it('should calculate tan', () => {
        assert.strictEqual(glm.tan(0), 0);
        assert.ok(Math.abs(glm.tan(Math.PI / 4) - 1) < 1e-9);
    });

    it('should calculate asin', () => {
        assert.strictEqual(glm.asin(0), 0);
        assert.strictEqual(glm.asin(1), Math.PI / 2);
    });

    it('should calculate acos', () => {
        assert.strictEqual(glm.acos(1), 0);
        assert.strictEqual(glm.acos(-1), Math.PI);
    });

    it('should calculate atan', () => {
        assert.strictEqual(glm.atan(0), 0);
        assert.strictEqual(glm.atan(1), Math.PI / 4);
    });

    it('should calculate sinh', () => {
        assert.strictEqual(glm.sinh(0), 0);
    });

    it('should calculate cosh', () => {
        assert.strictEqual(glm.cosh(0), 1);
    });

    it('should calculate tanh', () => {
        assert.strictEqual(glm.tanh(0), 0);
    });

    it('should calculate asinh', () => {
        assert.strictEqual(glm.asinh(0), 0);
    });

    it('should calculate acosh', () => {
        assert.strictEqual(glm.acosh(1), 0);
    });

    it('should calculate atanh', () => {
        assert.strictEqual(glm.atanh(0), 0);
    });
});
