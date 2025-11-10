// modern/implementation/index.js
import { vec2, vec3, vec4 } from './vec.js';
import { mat3, mat4 } from './mat.js';
import { quat, angleAxis } from './quat.js';
import * as functions from './functions.js';

// Factory function for mat3
const mat3Factory = function(arg) {
    if (arg instanceof mat3 && !(this instanceof mat3)) {
        return arg; // Return reference
    }
    return new mat3(arg); // Return copy
};
mat3Factory.prototype = mat3.prototype;

// Factory function for mat4
const mat4Factory = function(arg) {
    if (arg instanceof mat4 && !(this instanceof mat4)) {
        return arg; // Return reference
    }
    return new mat4(arg); // Return copy
};
mat4Factory.prototype = mat4.prototype;

// Factory function for quat (always copies)
const quatFactory = function(w, x, y, z) {
    return new quat(w, x, y, z);
};
quatFactory.prototype = quat.prototype;

const vec2Factory = (...args) => new vec2(...args);
vec2Factory.prototype = vec2.prototype;

const vec3Factory = (...args) => new vec3(...args);
vec3Factory.prototype = vec3.prototype;

const vec4Factory = (...args) => new vec4(...args);
vec4Factory.prototype = vec4.prototype;


const glm = {
    vec2: vec2Factory,
    vec3: vec3Factory,
    vec4: vec4Factory,
    mat3: mat3Factory,
    mat4: mat4Factory,
    quat: quatFactory,
    angleAxis: angleAxis,
    epsilon: () => 1e-6,
    ...functions
};

export default glm;
