import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import glm from '../implementation/index.js';

describe('Top-level Functions: Vector operations', () => {
    it('should calculate the length of a vec2', () => {
        const v = glm.vec2(3, 4);
        assert.strictEqual(glm.length(v), 5);
    });

    it('should calculate the length of a vec3', () => {
        const v = glm.vec3(2, 3, 6);
        assert.strictEqual(glm.length(v), 7);
    });

    it('should calculate the length of a vec4', () => {
        const v = glm.vec4(2, 4, 6, 7);
        assert.ok(Math.abs(glm.length(v) - Math.sqrt(105)) < 1e-6);
    });

    it('should calculate the squared length of a vec2', () => {
        const v = glm.vec2(3, 4);
        assert.strictEqual(glm.length2(v), 25);
    });

    it('should calculate the squared length of a vec3', () => {
        const v = glm.vec3(2, 3, 6);
        assert.strictEqual(glm.length2(v), 49);
    });

    it('should calculate the squared length of a vec4', () => {
        const v = glm.vec4(2, 4, 6, 7);
        assert.strictEqual(glm.length2(v), 105);
    });

    it('should calculate the distance between two vec2s', () => {
        const v1 = glm.vec2(1, 2);
        const v2 = glm.vec2(4, 6);
        assert.strictEqual(glm.distance(v1, v2), 5);
    });

    it('should calculate the distance between two vec3s', () => {
        const v1 = glm.vec3(1, 2, 3);
        const v2 = glm.vec3(3, 5, 9);
        assert.strictEqual(glm.distance(v1, v2), 7);
    });

    it('should calculate the distance between two vec4s', () => {
        const v1 = glm.vec4(1, 2, 3, 4);
        const v2 = glm.vec4(3, 6, 9, 11);
        assert.ok(Math.abs(glm.distance(v1, v2) - Math.sqrt(105)) < 1e-6);
    });

    it('should mix two vec2s', () => {
        const v1 = glm.vec2(1, 2);
        const v2 = glm.vec2(5, 6);
        const result = glm.mix(v1, v2, 0.5);
        assert.deepStrictEqual(Array.from(result.elements), [3, 4]);
    });

    it('should mix two vec3s', () => {
        const v1 = glm.vec3(1, 2, 3);
        const v2 = glm.vec3(5, 6, 7);
        const result = glm.mix(v1, v2, 0.5);
        assert.deepStrictEqual(Array.from(result.elements), [3, 4, 5]);
    });

    it('should mix two vec4s', () => {
        const v1 = glm.vec4(1, 2, 3, 4);
        const v2 = glm.vec4(5, 6, 7, 8);
        const result = glm.mix(v1, v2, 0.5);
        assert.deepStrictEqual(Array.from(result.elements), [3, 4, 5, 6]);
    });

    it('should clamp a vec2', () => {
        const v = glm.vec2(-1, 5);
        const result = glm.clamp(v, 0, 4);
        assert.deepStrictEqual(Array.from(result.elements), [0, 4]);
    });

    it('should clamp a vec3', () => {
        const v = glm.vec3(-1, 5, 2);
        const result = glm.clamp(v, 0, 4);
        assert.deepStrictEqual(Array.from(result.elements), [0, 4, 2]);
    });

    it('should clamp a vec4', () => {
        const v = glm.vec4(-1, 5, 2, 10);
        const result = glm.clamp(v, 0, 4);
        assert.deepStrictEqual(Array.from(result.elements), [0, 4, 2, 4]);
    });
});
