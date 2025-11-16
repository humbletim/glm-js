// modern/implementation/index.js
import { vec2, vec3, vec4 } from './vec.js';
import { mat3, mat4, inverse as matInverse, transpose, lookAt, perspective, ortho } from './mat.js';
import { quat, angleAxis, slerp, inverse as quatInverse } from './quat.js';
import * as functions from './functions.js';
import { radians, degrees, min, max, abs, fract, all, sign, frexp, rotation, pi, half_pi, quarter_pi, one_over_pi, two_over_pi, root_pi, two_over_root_pi, root_two, one_over_root_two, root_three, e, ln_ten, ln_two } from './common.js';

import pkg from '../package.json' with { type: 'json' };

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

function inverse(m) {
    if (m instanceof mat3 || m instanceof mat4) {
        return matInverse(m);
    } else if (m instanceof quat) {
        return quatInverse(m);
    }
    throw new Error('inverse() not implemented for this type');
}

const vec2Factory = function(...args) {
    if (this instanceof vec2Factory) {
        return new vec2(...args);
    }
    return new vec2(...args);
};
vec2Factory.prototype = vec2.prototype;

const vec3Factory = function(...args) {
    if (this instanceof vec3Factory) {
        return new vec3(...args);
    }
    return new vec3(...args);
};
vec3Factory.prototype = vec3.prototype;

const vec4Factory = function(...args) {
    if (this instanceof vec4Factory) {
        return new vec4(...args);
    }
    return new vec4(...args);
};
vec4Factory.prototype = vec4.prototype;

const glm = {
    get version() { return `${pkg.version}-${typeof GLMJS_COMMIT === 'undefined' ? '(develop)' : GLMJS_COMMIT }`},
    vec2: vec2Factory,
    vec3: vec3Factory,
    vec4: vec4Factory,
    mat3: mat3Factory,
    mat4: mat4Factory,
    quat: quatFactory,
    angleAxis: angleAxis,
    epsilon: () => 1e-6,
    radians,
    degrees,
    min,
    max,
    abs,
    fract,
    all,
    sign,
    frexp,
    rotation,
    inverse,
    transpose,
    lookAt,
    perspective,
    ortho,
    slerp,
    pi,
    half_pi,
    quarter_pi,
    one_over_pi,
    two_over_pi,
    root_pi,
    two_over_root_pi,
    root_two,
    one_over_root_two,
    root_three,
    e,
    ln_ten,
    ln_two,
    ...functions
};

export default glm;
