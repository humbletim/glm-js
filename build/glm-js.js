var GLM, GLMAT, GLMAT_VERSION, GLMJS_PREFIX, $GLM_console_factory, glm;
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.2.2
 */
GLMAT={};
GLMAT_VERSION="2.2.2";
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


// (function(_global) {
//   "use strict";

//   var shim = {};
//   if (typeof(exports) === 'undefined') {
//     if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
//       shim.exports = {};
//       define(function() {
//         return shim.exports;
//       });
//     } else {
//       // gl-matrix lives in a browser, define its namespaces in global
//       shim.exports = typeof(window) !== 'undefined' ? window : _global;
//     }
//   }
//   else {
//     // gl-matrix lives in commonjs, define its namespaces in exports
//     shim.exports = exports;
//   }

  (function(exports) {
      exports.VERSION = GLMAT_VERSION;
    /* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


if(!GLMAT_EPSILON) {
    var GLMAT_EPSILON = 0.000001;
}

if(!GLMAT_ARRAY_TYPE) {
    var GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
}

if(!GLMAT_RANDOM) {
    var GLMAT_RANDOM = Math.random;
}

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

if(typeof(exports) !== 'undefined') {
    exports.glMatrix = glMatrix;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */

var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
vec2.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }

        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }

        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec2 = vec2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */

var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
vec3.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    var z = (GLMAT_RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2],
        w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

	return out;
};

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateY = function(out, a, b, c){
	var p = [], r=[];
	//Translate point to the origin
	p[0] = a[0] - b[0];
	p[1] = a[1] - b[1];
	p[2] = a[2] - b[2];

	//perform rotation
	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
	r[1] = p[1];
	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);

	//translate to correct position
	out[0] = r[0] + b[0];
	out[1] = r[1] + b[1];
	out[2] = r[2] + b[2];

	return out;
};

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateZ = function(out, a, b, c){
	var p = [], r=[];
	//Translate point to the origin
	p[0] = a[0] - b[0];
	p[1] = a[1] - b[1];
	p[2] = a[2] - b[2];

	//perform rotation
	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
	r[2] = p[2];

	//translate to correct position
	out[0] = r[0] + b[0];
	out[1] = r[1] + b[1];
	out[2] = r[2] + b[2];

	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }

        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }

        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec3 = vec3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */

var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
vec4.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        out[3] = a[3] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = GLMAT_RANDOM();
    out[1] = GLMAT_RANDOM();
    out[2] = GLMAT_RANDOM();
    out[3] = GLMAT_RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }

        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }

        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec4 = vec4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x2 Matrix
 * @name mat2
 */

var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }

    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;

    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
};

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix
 * @param {mat2} D the diagonal matrix
 * @param {mat2} U the upper triangular matrix
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) {
    L[2] = a[2]/a[0];
    U[0] = a[0];
    U[1] = a[1];
    U[3] = a[3] - L[2] * U[1];
    return [L, D, U];
};

if(typeof(exports) !== 'undefined') {
    exports.mat2 = mat2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x3 Matrix
 * @name mat2d
 *
 * @description
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;


/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
};

if(typeof(exports) !== 'undefined') {
    exports.mat2d = mat2d;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3x3 Matrix
 * @name mat3
 */

var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }

    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) {
        return null;
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
        return null;
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' +
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};


if(typeof(exports) !== 'undefined') {
    exports.mat3 = mat3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4x4 Matrix
 * @name mat4
 */

var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }

    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
        return null;
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < GLMAT_EPSILON) { return null; }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;

    return out;
};

mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
        Math.abs(eyey - centery) < GLMAT_EPSILON &&
        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' +
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};


if(typeof(exports) !== 'undefined') {
    exports.mat4 = mat4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class Quaternion
 * @name quat
 */

var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5;

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5;

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5;

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {
        // "from" and "to" quaternions are very close
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;

    return out;
};

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;

    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[5]-m[7])*fRoot;
        out[1] = (m[6]-m[2])*fRoot;
        out[2] = (m[1]-m[3])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;

        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }

    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.quat = quat;
}
;










   })(GLMAT);


//   })(shim.exports);
// })(this);
try { module.exports = GLMAT; } catch(e) {}
// ----------------------------------------------------------------------------
// glm.common.js - common math wrangler bits
// for full functionality this requires linking with a "math vendor" back-end
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

try { glm.exists && alert("glm.common.js loaded over exist glm instance: "+glm); } catch(e) {}

glm = null;

GLMJS_PREFIX = 'glm-js: ';

GLM = {
   $DEBUG: 'undefined' !== typeof $GLM_DEBUG && $GLM_DEBUG,
   version: "0.0.6c",
   GLM_VERSION: 96,

   $outer: {
      polyfills: GLM_polyfills(),
      functions: {},
      intern: function(k,v) {
         if (!k) return;
         //console.warn("$GLM_intern", k,v);
         if (v === undefined && typeof k === 'object') {
            for(var p in k) GLM.$outer.intern(p, k[p]);
            return;
         }
         GLM.$DEBUG && GLM.$outer.console.debug("intern "+k, v && (v.name || typeof v));
         return GLM.$outer[k] = v;
      },
      $import: function(DLL) {
         GLM.$outer.$import = function() { throw new Error('glm.$outer.$import already called...'); };
         GLM.$outer.intern(DLL.statics);
         GLM.$template.extend(GLM,
            GLM.$template['declare<T,V,number>'](DLL['declare<T,V,number>']),
            GLM.$template['declare<T,V,...>'](DLL['declare<T,V,...>']),
            GLM.$template['declare<T,...>'](DLL['declare<T,...>']),
            GLM.$template['declare<T>'](DLL['declare<T>'])
         );
         GLM.$init(DLL);
      },
      console: $GLM_reset_logging(),
      quat_array_from_xyz: function(o) {
         var q = glm.quat(), M=glm.mat3(1);
         q['*='](glm.angleAxis(o.x, M[0]));
         q['*='](glm.angleAxis(o.y, M[1]));
         q['*='](glm.angleAxis(o.z, M[2]));
         return q.elements;
      },
      // _vec3_eulerAngles: function(q) {
      //    // adapted from three.js
      //    var te = this.mat4_array_from_quat(q);
      //    var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
      //    m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
      //    m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

      //    var thiz = new glm.vec3();
      //    thiz.y = Math.asin( - glm._clamp( m31, - 1, 1 ) );

      //    if ( Math.abs( m31 ) < 0.99999 ) {
      //       thiz.x = Math.atan2( m32, m33 );
      //       thiz.z = Math.atan2( m21, m11 );
      //    } else {
      //       thiz.x = 0;
      //       thiz.z = Math.atan2( - m12, m22 );
      //    }
      //    return thiz;
      // },

       // so that people can work-around faulty TypedArray implementations
      Array: Array,
      ArrayBuffer: ArrayBuffer,
      Float32Array: Float32Array, Float64Array: Float64Array,
      Uint8Array:Uint8Array, Uint16Array: Uint16Array, Uint32Array: Uint32Array,
      Int8Array: Int8Array, Int16Array: Int16Array, Int32Array: Int32Array,
      DataView: typeof DataView !== 'undefined' && DataView,
      $rebindTypedArrays: function(alternator) {
         var ret = Object.keys(GLM.$outer)
            .filter(RegExp.prototype.test.bind(/.Array$|^ArrayBuffer$|^DataView$/))
            .map(
               function(p) {
                  var rep = alternator.call(this, p, GLM.$outer[p]);
                  if (rep !== GLM.$outer[p]) {
                     GLM.$outer.console.warn("$rebindTypedArrays("+p+")... replacing");
                     GLM.$outer[p] = rep;
                  }
                  return rep;
               });
         GLM.$subarray = GLM.patch_subarray();
         return ret;
      }
   },
   $extern: $GLM_extern,

   $log: $GLM_log,

   GLMJSError: $GLM_GLMJSError('GLMJSError'),

   _radians: function(n) { return n * this.PI / 180; }.bind(Math),
   _degrees: function(n) { return n * 180 / this.PI; }.bind(Math),

//    _degrees: $GLM_extern('degrees', '_degrees'),
//    radians: $GLM_extern("radians"),

   normalize: $GLM_extern('normalize'),
   inverse: $GLM_extern('inverse'),
   distance: $GLM_extern('distance'),
   length: $GLM_extern('length'),
   length2: $GLM_extern('length2'),
   transpose: $GLM_extern('transpose'),
   slerp: $GLM_extern("slerp"),
   mix: $GLM_extern("mix"),
   clamp: $GLM_extern('clamp'),
   angleAxis: $GLM_extern('angleAxis'),
   rotate: $GLM_extern('rotate'),
   scale: $GLM_extern('scale'),
   translate: $GLM_extern('translate'),
   lookAt: $GLM_extern('lookAt'),
   cross: $GLM_extern('cross'),
   dot: $GLM_extern('dot'),

   perspective: function(fov, aspect, near, far) {
      return GLM.$outer.mat4_perspective(fov, aspect, near, far);
   },
   ortho: function(left, right, bottom, top, near, far) {
       return GLM.$outer.mat4_ortho(left, right, bottom, top, near, far);
   },

   _eulerAngles: function(q) {
      return GLM.$outer.vec3_eulerAngles(q);
   },
   angle: function(x) {
      return Math.acos(x.w) * 2;
   },
   axis: function(x) {
      var tmp1 = 1 - x.w * x.w;
      if(tmp1 <= 0)
         return glm.vec3(0, 0, 1);
      var tmp2 = 1 / Math.sqrt(tmp1);
      return glm.vec3(x.x * tmp2, x.y * tmp2, x.z * tmp2);
   },

   $from_ptr: function(typ, ptr, byteOffset) {
      if (this !== GLM) throw new GLM.GLMJSError("... use glm.make_<type>() (not new glm.make<type>())");
      var components = new GLM.$outer.Float32Array(ptr.buffer || ptr,byteOffset||0,typ.componentLength);
      var elements = new GLM.$outer.Float32Array(components);// ensure it's a clone
      return new typ(elements);
   },
   make_vec2: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.vec2, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_vec3: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.vec3, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_vec4: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.vec4, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_quat: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.quat, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_mat3: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.mat3, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_mat4: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.mat4, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },

   diagonal4x4: function(v) {
      if (GLM.$typeof(v) !== 'vec4') throw new GLM.GLMJSError('unsupported argtype to GLM.diagonal4x4: '+['type:' + GLM.$typeof(v)]);
      v = v.elements;
      return new GLM.mat4(
         [v[0], 0, 0, 0,
          0, v[1], 0, 0,
          0, 0, v[2], 0,
          0, 0, 0, v[3]]
      );
   },

   diagonal3x3: function(v) {
      if (GLM.$typeof(v) !== 'vec3') throw new GLM.GLMJSError('unsupported argtype to GLM.diagonal3x3: '+['type:' + GLM.$typeof(v)]);
      v = v.elements;
      return new GLM.mat3(
         [v[0], 0, 0,
          0, v[1], 0,
          0, 0, v[2]]
      );
   },

   _toMat4: function toMat4(q) {
      return new GLM.mat4(GLM.$outer.mat4_array_from_quat(q));
   },

   FAITHFUL: true, // attempt to match GLM::to_string output ASCII-for-ASCII

   to_string: function to_string(o, opts) {
      try {
         var type = o.$type || typeof o;
         if (!GLM[type])
            throw new GLM.GLMJSError('unsupported argtype to GLM.to_string: '+['type:'+type,o]);
         if (!GLM.FAITHFUL)
            return GLM.$to_string(o, opts); // prettier-printed w/indentation
         else
            return GLM.$to_string(o, opts).replace(/[\t\n]/g,''); // flat
      } catch(e) {
         GLM.$DEBUG && GLM.$outer.console.error('to_string error: ',type,o+'',e);
         return e+'';
      }
   },

   $sizeof: function(o) { return o.BYTES_PER_ELEMENT; },
   $types: [],
   $isGLMConstructor: function(o) { return !!(o&&o.prototype instanceof GLM.$GLMBaseType); },
   $getGLMType: function(o) { return o instanceof GLM.$GLMBaseType && o.constructor || 'string' === typeof o && GLM[o] ; },
   $isGLMObject: function(o) { return !!(o instanceof GLM.$GLMBaseType && o.$type); },
   $typeof: function(o) { return o instanceof GLM.$GLMBaseType ? o.$type : 'undefined'; },

   $to_array: function(o) {
      return [].slice.call(o.elements);
   },

   $to_json: function(v,p,q) {
      if (this instanceof GLM.$GLMBaseType) { q=p, p=v, v=this; }
      return JSON.stringify(GLM.$to_object(v),p,q);
   },

   $inspect: function(v) {
      if (this instanceof GLM.$GLMBaseType)
         v = this;
      return GLM.$to_json(v,null,2);
   },

   _clamp: function (a,b,c) { return a<b?b:(a>c?c:a); },
   _abs: function(a) { return Math.abs(a); },
   _equal: function(a,b) { return a === b; },
   _epsilonEqual: function(x,y,e) { return Math.abs(x - y) < e; },
   _fract: function(a) { return a - Math.floor(a) },

   // adapted from Squeak.js (see ../lib/squeak.js)
    _frexp: (function define_frexp() {
        // mini-DataView emulator (polyfills _frexp's specific need)
        function _DataView(ab) {
            this.buffer = ab;
            this.setFloat64 = function(offset, value) {
                if (offset !== 0) throw new Error('...this is a very limited DataView emulator');
                // effectively writes the bigEndian encoding of the float...
                new Uint8Array(this.buffer).set([].reverse.call(new Uint8Array(new Float64Array([value]).buffer)), offset);
            };
            this.getUint32 = function(offset) {
                if (offset !== 0) throw new Error('...this is a very limited DataView emulator');
                return new Uint32Array(new Uint8Array([].slice.call(new Uint8Array(this.buffer)).reverse()).buffer)[1];
            };
        };
        _frexp._DataView = _DataView; // expose for unit testing
        function _frexp(value, arrptr) {
            // frexp separates a float into its mantissa and exponent
            var DV = GLM.$outer.DataView || _frexp._DataView;

            if (value == 0.0) { // zero is special
                if (arrptr && Array.isArray(arrptr)) {
                    arrptr[0] = arrptr[1] = 0;
                    return 0;
                }
                return [0,0];
            }
            var data = new DV(new GLM.$outer.ArrayBuffer(8));
            data.setFloat64(0, value);      // for accessing IEEE-754 exponent bits
            var bits = (data.getUint32(0) >>> 20) & 0x7FF;
            if (bits === 0) { // we have a subnormal float (actual zero was handled above)
                // make it normal by multiplying a large number
                data.setFloat64(0, value * Math.pow(2, 64));
                // access its exponent bits, and subtract the large number's exponent
                bits = ((data.getUint32(0) >>> 20) & 0x7FF) - 64;
            }
            var exponent = bits - 1022;                 // apply bias
            var mantissa = GLM.ldexp(value, -exponent)

            // no C pointers available; not sure which strategy is best yet...
            if (arrptr && Array.isArray(arrptr)) {
                arrptr[0] = exponent; // glm-ish behavior
                arrptr[1] = mantissa; // extra return value
                return mantissa;
            }
            return [mantissa, exponent]; // both values at once
        }
        return _frexp;
    })(),
   _ldexp: function(mantissa, exponent) {
      // construct a float from mantissa and exponent
      return exponent > 1023 // avoid multiplying by infinity
         ? mantissa * Math.pow(2, 1023) * Math.pow(2, exponent - 1023)
         : exponent < -1074 // avoid multiplying by zero
         ? mantissa * Math.pow(2, -1074) * Math.pow(2, exponent + 1074)
         : mantissa * Math.pow(2, exponent);
   }, /// Squeak.js

   _max: Math.max,
   _min: Math.min,
   sqrt: Math.sqrt,
   __sign: function(x) {
      return x > 0 ? 1 : x < 0 ? -1 : +x;
   },

    $constants: {
        epsilon: 1e-6,
        euler: 0.577215664901532860606,
        e: Math.E,
        ln_ten: Math.LN10,
        ln_two: Math.LN2,
        //Math.LOG10E,
        //Math.LOG2E,
        pi: Math.PI,
        half_pi: Math.PI/2,
        quarter_pi: Math.PI/4,
        one_over_pi: 1/Math.PI,
        two_over_pi: 2/Math.PI,
        root_pi: Math.sqrt(Math.PI),
        root_two: Math.sqrt(2),
        root_three: Math.sqrt(3),
        two_over_root_pi: 2/Math.sqrt(Math.PI),
        one_over_root_two: Math.SQRT1_2,
        root_two: Math.SQRT2
    },

   FIXEDPRECISION: 6,
   $toFixedString: function(prefix, what, props, precision) {
      if (precision === undefined)
         precision = GLM.FIXEDPRECISION;
      if (!props || !props.map) throw new Error('unsupported argtype to $toFixedString(..,..,props='+typeof props+')');
      function verify() {
          try {
              // pre-check .toFixed conversion would work
              var lp = "";
              props.map(function(p) { var w=what[lp=p]; if (!w.toFixed)throw new Error('!toFixed in w'+[w,prefix,JSON.stringify(what)]); return w.toFixed(0); });
          } catch(e) {
              GLM.$DEBUG && GLM.$outer.console.error(
                  "$toFixedString error", prefix, typeof what, Object.prototype.toString.call(what), lp
              );
              GLM.$DEBUG && glm.$log(
                  "$toFixedString error", prefix, typeof what, Object.prototype.toString.call(what), lp);
              throw new GLM.GLMJSError(e);
          }
      }
       verify();
      props = props.map(function(p) { return what[p].toFixed(precision); });
      return prefix + "(" + props.join(", ") + ")";
   }
};

GLM._sign = Math.sign || GLM.__sign;

for(var p in GLM.$constants) {
    (function(v,k) {
        GLM[k] = function() { return v; };
        GLM[k].valueOf = GLM[k];
    })(GLM.$constants[p], p);
}
// ----------------------------------------------------------------------------

GLM.$GLMBaseType = (
   function()  {
      function $GLMBaseType($class, $type) {
         var $ = $class.$ || {};
         this.$type = $type;
         this.$type_name = $.name || '<'+$type+'>';

         if ($.components)
            this.$components = $.components[0];
         this.$len =
            this.components = $class.componentLength;
         this.constructor = $class;
         this.byteLength = $class.BYTES_PER_ELEMENT;

         //this.repr = function() { return "function $GLMBaseType<"+$type+">(){ [ GLMType@"+(GLM.$template.$_module_stamp)+" ] }"; };

         //GLM.$outer.console.debug("CREATED $class: "+this.repr());

         GLM.$types.push($type);
      }
      $GLMBaseType.prototype = {
         clone: function() { return new this.constructor(new this.elements.constructor(this.elements)); },
         toString: function() {
            return GLM.$to_string(this);
         },
         inspect: function() {
            return GLM.$inspect(this);
         },
         toJSON: function() {
            return GLM.$to_object(this);
         }
      };
      Object.defineProperty(
         $GLMBaseType.prototype, 'address',
         {
            get: function() {
               var r = this.elements.byteOffset.toString(16);
               return "0x00000000".substr(0,10-r.length)+r;
           }
         });
      return $GLMBaseType;
   })();

// ----------------------------------------------------------------------------

// SpiderMonkey ~1.8.5's TypedArray.subarray was broken; this is a workaround
/*
  var f = new Float32Array([0,1,2]);
  if(f.subarray(1).subarray(0) !== f[1]) throw "broken subarrays!"
*/

(function() {
    function native_subarray(o, a, b) {
       return o.subarray(a, b || o.length);
    }

    function workaround_broken_spidermonkey_subarray(o, a, b) {
       // re-calculate subarray offsets directly
       var typedArray = o.constructor;
       b = b || o.length;
       return new typedArray(
          o.buffer, o.byteOffset +
             a * typedArray.BYTES_PER_ELEMENT,
          (b-a));
    }

    //var ab = new ArrayBuffer(16*4);
    //var fb = new Float32Array(ab);
    //if (fb.length === ab.byteLength)
    //   GLM.$outer.console.error("BROKEN TypedArrays detected");

    function test_native_subarray() {
        var f = new GLM.$outer.Float32Array([0,0]);
        f.subarray(1).subarray(0)[0] = 1;
        var result = test_native_subarray.result = [ f[1], new GLM.$outer.Float32Array(16).subarray(12,16).length ];
        return !(
            f[1] !== result[0] || // SpiderMonkey
            4 !== result[1] // QtScript
        );
    }

    function test_patched_subarray(subarray) {
        var f = new GLM.$outer.Float32Array([0,0]);
        subarray(subarray(f,1), 0)[0] = 1;
        var result = test_patched_subarray.result = [ f[1], subarray(new GLM.$outer.Float32Array(16), 12, 16).length ];
        return !(
            f[1] !== result[0] || // SpiderMonkey
            4 !== result[1] // QtScript
        );
    }

    Object.defineProperty(
       GLM, 'patch_subarray',
       {
           configurable: true,
           value: function patch_subarray() {
               var busted = !test_native_subarray();
               var subarray = busted ?
                   workaround_broken_spidermonkey_subarray :
                   native_subarray;
               subarray.workaround_broken_spidermonkey_subarray = workaround_broken_spidermonkey_subarray;
               subarray.native_subarray = native_subarray;

               if (!test_patched_subarray(subarray))
                   throw new Error('failed to resolve working TypedArray.subarray implementation... '+test_patched_subarray.result);

               return subarray;
           }
       });
 })();
GLM.$subarray = GLM.patch_subarray();

// ----------------------------------------------------------------------------

var GLM_template = GLM.$template = {
   _genArgError: function(F, dbg, TV, args) {
      if (~args.indexOf(undefined)) {
         args = args.slice(0,args.indexOf(undefined));
      }
      var no_dollars = RegExp.prototype.test.bind(/^[^$_]/);
      return new GLM.GLMJSError(
         'unsupported argtype to '+dbg+' '+F.$sig+': [typ='+TV+"] :: "+
            'got arg types: '+args.map(GLM.$template.jstypes.get)+
            " // supported types: "+Object.keys(F).filter(no_dollars).join("||"));
   },
   jstypes: {
      get: function(x) {
         return x === null ? "null" :
            x === undefined ? "undefined" :
            (x.$type ||
             GLM.$template.jstypes[typeof x] ||
             GLM.$template.jstypes[x+''] ||
             (function auxiliary(x) {
                 if ('object' === typeof x) { // older versions of node
                    if (x instanceof GLM.$outer.Float32Array) return "Float32Array";
                    if (x instanceof GLM.$outer.ArrayBuffer) return "ArrayBuffer";
                    if (Array.isArray(x)) return 'array';
                 }
                 return "<unknown "+[typeof x, x]+">";
              })(x));
      },
      0: "float",
      "boolean": "bool",
      "number": "float",
      "string": "string",
      "[object Float32Array]": "Float32Array",
      "[object ArrayBuffer]": "ArrayBuffer",
      "function":"function"
   },
   _add_overrides: function(type, kvfuncs) {
      for(var p in kvfuncs)
         if(kvfuncs[p]) GLM[p].override(type, kvfuncs[p]);
   },
   _add_inline_override: function(dbg, type, func) {
      this[type] = /*TRACING*/ /*EVAL*/eval(GLM.$template._traceable("glm_"+dbg+"_"+type, func))();
      return this;
   },
   _inline_helpers: function(F,dbg) {
      Object.defineProperty(F, 'GLM', { value: GLM });
      return {
         $type: "built-in",
         $type_name: dbg,
         $template: F,
         F: F,
         dbg: dbg,
         override: this._add_inline_override.bind(F,dbg),
         link: function(sig) {
            var func = F[sig];
            if (!func)
               func = F[[sig,undefined+'']];
            if (!func)
               throw new GLM.GLMJSError("error linking direct function for "+dbg+"<"+sig+"> or "+dbg+"<"+[sig,undefined]+">");
            if (/\bthis[\[.]/.test(func+'')) return func.bind(F);
            return func;
         }
      };
   },
   "template<T>": function(F, dbg) {
      F.$sig = "template<T>";
      var types = GLM.$template.jstypes;
      var _genArgError = GLM.$template._genArgError;
      var $GLMBaseType = GLM.$GLMBaseType;
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         /*EVAL*/eval(this._traceable("Tglm_"+dbg,
         function(o) {
            //var F = arguments.callee.F;
            if (this instanceof $GLMBaseType) { o=this; }
            var T = [(o&&o.$type) || types[typeof o] || types.get(o) || "null"];
            if (!F[T])
               throw _genArgError(F, arguments.callee.dbg, T, [o]);
            return F[T](o);
         }))());
   },
   "template<T,...>": function(F, dbg) {
      F.$sig = "template<T,...>";
      var types = GLM.$template.jstypes;
      var _genArgError = GLM.$template._genArgError;
      var $GLMBaseType = GLM.$GLMBaseType;
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         /*EVAL*/eval(this._traceable("Tdotglm_"+dbg,
         function(o) {
            //var F = arguments.callee.F;
            //var types = GLM.$template.jstypes;
            var args = __VA_ARGS__;
            if (this instanceof $GLMBaseType) { args.unshift(o=this); }
            var T = [(o&&o.$type) || types[typeof o] || types.get(o) || "null"];
            if (!F[T])
               throw _genArgError(F, arguments.callee.dbg, T, args);
            return F[T].apply(F, args);
         }))());
   },
   "template<T,V,number>": function(F, dbg) {
      F.$sig = "template<T,V,number>";
      var types = GLM.$template.jstypes;
      var _genArgError = GLM.$template._genArgError;
      var _genArgErrorType = function(F, dbg, v) {
          return new GLMJSError(dbg+F.$sig+': unsupported n type: '+[typeof v,v]);
      };
      var GLMJSError = GLM.GLMJSError;
      var $GLMBaseType = GLM.$GLMBaseType;
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         /*EVAL*/eval(this._traceable("TVnglm_"+dbg,
         function () {
            var args = __VA_ARGS__;
            if (this instanceof $GLMBaseType) { args.unshift(this); }
            var o=args[0], p=args[1], v=args[2];
            //if (this instanceof GLM.$GLMBaseType) { v=p, p=o, o=this; }
            var TV = [(o&&o.$type) || types[typeof o] || types[o+''] || "<unknown "+o+">",
                      (p&&p.$type) || types[typeof p] || types[p+''] || "<unknown "+p+">"];
            if (!F[TV])
               throw _genArgError(F, arguments.callee.dbg, TV, [o,p,v]);
            if (typeof v !== 'number')
               throw _genArgErrorType(F, arguments.callee.dbg, v);
            return F[TV](o,p,v);
         }))());
   },
   "template<T,V,...>": function(F, dbg) {
      F.$sig = 'template<T,V,...>';
      var types = GLM.$template.jstypes;
      var $GLMBaseType = GLM.$GLMBaseType;
      var _genArgError = GLM.$template._genArgError;
      var Array = GLM.$outer.Array;
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         /*EVAL*/eval(this._traceable("TVglm_"+dbg,
         function(/*o,p,a,b,c*/) {
            var args = __VA_ARGS__;
            if (this instanceof $GLMBaseType) { args.unshift(this); }
            //            if (this instanceof GLM.$GLMBaseType) { c=b, b=a, a=p, p=o, o=this; }
            var o=args[0], p=args[1];
            var TV = [(o&&o.$type) || types[typeof o],
                      (p&&p.$type) || types[typeof p] || types[p+''] || (Array.isArray(p) && "array"+p.length+"") || ""+p+""];
            if (!F[TV]) { //alert(this.constructor+'');
               throw _genArgError(F, arguments.callee.dbg, TV, args); }
            return F[TV].apply(F, args);
            //return F[TV](o,p,a,b,c);
         }))());
   },

   override: function(TV, p, TSP, ret, force) {
      GLM.$DEBUG && GLM.$outer.console.debug('glm.$template.override: ', TV, p, TSP.$op?'$op: ["'+TSP.$op+'"]':"");
      if (!ret) throw new Error('unspecified target group '+ret+' (expected override(<TV>, "p", {TSP}, ret={GROUP}))');
      var merge = ret[p];
      if (merge && merge.$op !== TSP.$op) {
         throw new Error('glm.$template.override: mismatch merging existing override: .$op "'+
                         [merge.$op,'!=',TSP.$op].join(" ")+'" '+
                         ' p='+[p,merge.$op,TSP.$op,
                                "||"+Object.keys(merge.$template).join("||")]);
      }
      var overlay = GLM.$template[TV](GLM.$template.deNify(TSP, p), p);

      if (merge && merge.F.$sig !== overlay.F.$sig) {
         throw new Error('glm.$template.override: mismatch merging existing override: .$sig "'+
                         [merge && merge.F.$sig,'!=',overlay.F.$sig].join(" ")+'" '+
                         ' p='+[p,merge && merge.F.$sig,overlay.F.$sig,
                                "||"+Object.keys(merge && merge.$template || {}).join("||")]);
      }
      overlay.$op = TSP.$op;
      if (!merge) {
         ret[p] = overlay;
         GLM.$DEBUG && log_override(ret[p], []);
      } else {
         for(var P in overlay.$template) {
            if (P === '$op' || P === '$sig') continue;
            var existing = P in merge.$template;
            if (!existing || force === true) {
               GLM.$DEBUG && GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+P+" merged");
               merge.$template[P] = overlay.$template[P];
            } else if (existing) {
               GLM.$DEBUG && GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+P+" skipped");
            }
         }

         if (GLM.$DEBUG) {
            var oldsigs = [];
            Object.keys(merge.$template).forEach(
               function(P) {
                  if (!(P in overlay.$template)) {
                     GLM.$DEBUG && GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+P+" carried-forward");
                     oldsigs.push(P);
                  }
               }
            );
            log_override(ret[p], oldsigs);
         }
      }

      function log_override(retp, oldsigs) {
         GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+
                                  (Object.keys(retp.$template)
                                   .filter(function(x){return !~x.indexOf('$')})
                                   .map(function(x){ return !~oldsigs.indexOf(x) ? "*"+x+"*" : x; })
                                   .join(" | ")));
      }
//       if (TSP.$op)
//          ret[TSP.$op] = ret[p];
      return ret;
   },

   _override: function(TV, TS, ret) {
      for(var p in TS) {
          //console.warn("_override", p);
          if (p !== 'mat4_scale' && typeof TS[p] !== 'object')
              throw new GLM.GLMJSError('expect object property overrides' + [p,TS[p], Object.keys(ret)]);
          if (typeof TS[p] === 'object') {
              this.override(TV, p, TS[p], ret, true /*force / replace existing*/);
          } else
              ret_scale = 5;
      }
      return ret;
   },
   slingshot: function() {
      return this.extend.apply(this, [].reverse.call(arguments));
   },
   extend: function(dest, sources) {
      [].slice.call(arguments,1)
         .forEach(function(source) {
                     if (!source) return;
                     for(var p in source)
                        if (source.hasOwnProperty(p))
                            dest[p] = source[p];
                  });
      return dest;
   },
   'declare<T,V,...>': function operations(TS) {
      //console.warn("operations", TS);
      if (!TS) return {};
      return this._override("template<T,V,...>",TS,GLM.$outer.functions);
   },
   'declare<T>': function calculators(TS) {
      //console.warn("FUNCTION_SOURCES", TS);
      if (!TS) return {};
      return this._override("template<T>",TS,GLM.$outer.functions);
   },
   'declare<T,...>': function varargs_functions(TS) {
      if (!TS) return {};
      //console.warn("FUNCTION_SOURCES", TS);
      return this._override("template<T,...>",TS,GLM.$outer.functions);
   },
   'declare<T,V,number>': function functions(TS) {
      if (!TS) return {};
      //console.warn("FUNCTION_SOURCES", TS);
      return this._override("template<T,V,number>",TS,GLM.$outer.functions);
   },
   _tojsname: function(hint) {
      return (hint || "_").replace(/[^$a-zA-Z0-9_]/g,'_');
   },
   _traceable: function(hint, _src) {
      var src = _src;
      if ('function' !== typeof src)
         throw new GLM.GLMJSError("_traceable expects tidy function as second arg "+src);
      if (!hint) throw new GLM.GLMJSError("_traceable expects hint or what's the point" + [src,hint]);
      hint = this._tojsname(hint||"_traceable");
      src = (src.toString()).replace(/^(\s*var\s*(\w+)\s*=\s*)__VA_ARGS__;/mg,
                             function(_,rep,varname) {
                                return rep+
                                   'new Array(arguments.length);for(var I=0;I<varname.length;I++)varname[I]=arguments[I];'.replace(/I/g,'__VA_ARGS__I').replace(/varname/g,varname);
                             })
         .replace(/\barguments[.]callee\b/g, hint);
       //if (/callee/.test(src))throw new Error(src);
      if (!/^function _traceable/.test(src)) { //src.split(/^\s*function\b/).length === 2) {
         // not already a factory; wrap it
         src = ('function _traceable(){ "use strict"; SRC; return HINT; }')
            .replace("HINT", hint.replace(/[$]/g,'$$$$'))
            .replace("SRC", src.replace(/[$]/g,'$$$$').replace(/^function\s*\(/,'function '+hint+'('));
      } else {
         throw new GLM.GLMJSError("already wrapped in a _traceable: "+[src,hint]);
      }
      src = "1,"+src;
      if (GLM.$DEBUG) {
         try {
            eval(src);
         } catch(e) {
            console.error('_traceable error', hint, src, _src,e);
            throw e;
         }
      }
      return src;
   },

   // this expands TSPs like { 'vec<N>': function(a) { return N; } }
   // ... into { vec2: function(a) { return 2; }, vec3: ..., vec4: ... }
   deNify: function(TSP, hint) {
      var rng = { vec: [2,3,4], mat: [3,4] };
      var _tojsname = this._tojsname.bind(this);
      for(var TN in TSP) {
         var bN = false;
         TN.replace(/([vV]ec|[mM]at)(?:\w*)<N>/,
            function(_, vorm) {
               bN = true;
               var tpl = TSP[TN];
               delete TSP[TN];
               rng[vorm.toLowerCase()].forEach(
                  function(N){
                     var kn = TN.replace(/<N[*]N>/g,N*N).replace(/<N>/g,N);
                     if (!( kn in TSP )) {
                        var fname = _tojsname("glm_"+hint+"_"+kn);
                        //GLM.$outer.console.warn("implicit "+kn);
                         TSP[kn] = /*EVAL*/eval(
                             "'use strict'; 1,"+(tpl+'')
                                 .replace(/^function\s*\(/,'function '+fname+'(')
                                 .replace(/N[*]N/g,N*N).replace(/N/g,N)
                         );
                        //console.error('TN:',TN,kn,TSP[kn]);
                     }
                  }
               );
            }.bind(this));
         if (/^[$]/.test(TN)) GLM.$DEBUG && GLM.$outer.console.debug("@ NOT naming "+TN);
         else if (!bN && 'function' === typeof TSP[TN] && !TSP[TN].name) {
            GLM.$DEBUG && GLM.$outer.console.debug("naming "+_tojsname(hint+"_"+TN));
            /*TRACING*/ TSP[TN] = /*EVAL*/eval(this._traceable("glm_"+hint+"_"+TN, TSP[TN]))();
         }
      }
      //GLM.$outer.console.warn(TN);
      return TSP;
   },
   $_module_stamp: +new Date(),

   // see also: http://stackoverflow.com/a/31194949
   _iso: '/[*][^/\*]*[*]/',
   _get_argnames: function $args(func) {
      return (func+'').replace(/\s+/g,'')
         .replace(new RegExp(this._iso,'g'),'') // strip simple comments
         .split('){',1)[0].replace(/^[^(]*[(]/,'') // extract the parameters
         .replace(/=[^,]+/g,'') // strip any ES6 defaults
         .split(',').filter(Boolean); // split & filter [""]
   },

    _fix_$_names: function($type, $) {
      if (1) {
         // make sure methods have a reasonable function name for profiling
         Object.keys($)
            .filter(function(p) { return 'function' === typeof $[p] && !$[p].name })
            .map(function(p) {
                    var hint = $type+"_"+p;
                    GLM.$DEBUG && GLM.$outer.console.debug("naming $."+p+" == "+hint, this._traceable(hint, $[p]));
                    /*TRACING*/ $[p] = /*EVAL*/eval(this._traceable("glm_"+hint,$[p]))();
                 }.bind(this));
      }
      return $;
    },
    _typedArrayMaker: function($len, Float32Array) {
        return function makeTypedArray(n) {
            if (n.length === $len)
                return new Float32Array( n );
            var elements = new Float32Array( $len );
            elements.set(n);
            return elements;
        };
    },

   GLMType: function ($type, _$) {
      var $ = this._fix_$_names($type, _$);
      var $len = $.identity.length;

       var getBuilder = (function(Object, GLM, $, $type, _get_argnames, GLMJSError) {
           var $$ = {}
           for(var p in $)
               if (typeof $[p] === 'function') {
                   (function(builder) {
                       $$[p] = function(args) { return builder.apply($, args); };
                   })($[p]);
               }
           return function getBuilder(args) {
               var n = args[0];
               var sig = typeof n + args.length;
               var builder = $$[sig];

               if (!builder) {
                   var s = 'glm.'+$type;
                   var provided = s + '('+args.map(function(_){return typeof _})+')';
                   var hints = Object.keys($)
                       .filter(
                           function(_) {
                               return typeof $[_] === 'function' && /^\w+\d+$/.test(_); }
                       )
                       .map(function(_) {
                           return s+'('+_get_argnames($[_])+')';
                       });
                   throw new GLMJSError(
                       'no constructor found for: '+provided+'\n'+
                           'supported signatures:\n\t'+
                           hints.join('\n\t'));
               }
               return builder;
           };
       })(Object, GLM, $, $type, GLM.$template._get_argnames.bind(GLM.$template), GLM.GLMJSError);

       var verifyLength = (function(Object, GLM, $, $type, _get_argnames, GLMJSError) {
           return function verifyLength(n, fail) {
               GLM.$DEBUG > 2 && GLM.$outer.console.info("adopting elements...", typeof n);
               if (n.length != $len) {
                   if (fail === false)
                       return fail;
                   GLM.$outer.console.error(
                       $type+' elements size mismatch: '+
                           ['wanted:'+$len, 'handed:'+n.length]
                   );
                   var nn = GLM.$subarray(n,0,$len);
                   throw new GLM.GLMJSError(
                       $type+' elements size mismatch: '+
                           ['wanted:'+$len, 'handed:'+n.length,
                            'theoreticaly-correctable?:'+(nn.length ===  $len)]
                   );
               }
               return n;
           }
       })(Object, GLM, $, $type, GLM.$template._get_argnames.bind(GLM.$template), GLM.GLMJSError);

       var makeTypedArray = this._typedArrayMaker($len, GLM.$outer.Float32Array);

       var isTypedArray = (function($outer) {
           return function isTypedArray(n) {
               return n instanceof $outer.Float32Array;
           };
       })(GLM.$outer);

       var $class = (function(Array, Object, GLM, $, $type, _get_argnames, GLMJSError, _traceable) {
           return /*TRACING*/ /*EVAL*/eval(_traceable("glm_"+$type+"$class", function(n) {
         //var $class = arguments.callee;
         var args = __VA_ARGS__;
         var builder = getBuilder(args);
         var elements;
         //GLM.$outer.console.warn(sig, $type, n, $type, this.$type, this.constructor);
         var $class = getClass();
         if (!(this instanceof $class)) { //(!isASelf(this)) {
            // if we're called as a regular function, redirect to "new $class()"
            // new $class(<Float32Array>) will use <Float32Array> by reference
            // $class(<Float32Array>) will use <Float32Array> by copy
              if (isTypedArray(n) && n.length === $len)
                  elements = makeTypedArray(n);
              else
                  elements = builder(args);
              return new $class(elements);
         } else {
            // called as "new $class()"
             if (isTypedArray(n)) {
               // note: $class(<Float32Array>) is a special case in which we adopt the passed buffer
               //       (bypassing the builder / causing updates to the existing buffer instead)
                elements = verifyLength(n);
            } else {
                elements = makeTypedArray(builder(args));
            }
             //this.elements = elements;
             Object.defineProperty(this, 'elements', { enumerable: false, configurable: true, value: elements });
         }
      }))();
       })(Array, Object, GLM, $, $type, GLM.$template._get_argnames.bind(GLM.$template), GLM.GLMJSError, GLM.$template._traceable.bind(GLM.$template));

       function getClass() {
           return $class;
       }
       function isASelf(t) {
           return t instanceof getClass();
       }
      // resolve shorthand defs like $.components=['xyz',...] into [['x','y',z'], ...]
      $.components = $.components ?
         $.components.map(
            function(v) { return 'string' === typeof(v) ? v.split("") : v; }
         ) : [];

      $class.$ = $;
      $class.componentLength = $len;
      $class.BYTES_PER_ELEMENT = $len * GLM.$outer.Float32Array.BYTES_PER_ELEMENT,
      $class.prototype = new GLM.$GLMBaseType($class, $type);
      $class.toJSON = function() { var ob={ glm$type: $type, glm$class: $class.prototype.$type_name, glm$eg: new $class().object };for(var p in $class)if(!/function |^[$]/.test(p+$class[p]))ob[p]=$class[p]; return ob; return { glm$type_name: this.$type_name, glm$type: $type, BYTES_PER_ELEMENT: this.BYTES_PER_ELEMENT }; };

      return $class;
   }
};

GLM.$template['declare<T,V,...>'](
   {
      cross: {
         'vec2,vec2': function(a, b) {
            return this.GLM.vec3(0,0,a.x * b.y - a.y * b.x);
         }
      },
      distance: {
          'vec<N>,vec<N>': function(a, b) {
              return this.GLM.length(b.sub(a));
          }
      }
   });
GLM.$template['declare<T,V,number>'](
   {
      mix: {
         "float,float": function(v,n,rt) {
            return n*rt+v*(1-rt);
         },
         "vec<N>,vec<N>": function(v,n,rt) {
            //if (rt === undefined) throw new Error('glm.mix<vecN,vecN>(v,n,rt) requires 3 arguments');
            var rtm1 = (1-rt);
            var ret = new this.GLM.vecN(new (v.elements.constructor)(N));
             var re = ret.elements,
                 ve = v.elements,
                 ne = n.elements;
             for(var i = 0; i < N; i++)
                 re[i] = ne[i]*rt+ve[i]*rtm1;
             return ret;
         }
      },
      clamp: {
         "float,float": function(n,a,b) {
            return GLM._clamp(n,a,b);
         },
         "vec<N>,float": function(v,a,b) {
            return new GLM.vecN(GLM.$to_array(v).map(function(n){ return GLM._clamp(n,a,b); }));
         }
      },
      epsilonEqual: {
         'float,float': GLM._epsilonEqual,
         'vec<N>,vec<N>': function(a,b,ep) {
            var eq = this['float,float'];
            var ret = glm.bvecN();
            for(var i=0; i < N; i++)
               ret[i] = eq(a[i],b[i],ep);
            return ret;
         },
         //'bvec<N>,bvec<N>': function(a,b,ep) { return this['vecN,vecN'](a,b,ep); },
         'ivec<N>,ivec<N>': function(a,b,ep) { return this['vecN,vecN'](a,b,ep); },
         'uvec<N>,uvec<N>': function(a,b,ep) { return this['vecN,vecN'](a,b,ep); },
         'quat,quat': function(a,b,ep) {
            var eq = this['float,float'];
            var ret = glm.bvec4();
            for(var i=0; i < 4; i++)
               ret[i] = eq(a[i],b[i],ep);
            return ret;
         },
         'mat<N>,mat<N>': function(a,b,ep) {
            throw new GLM.GLMJSError("error: 'epsilonEqual' only accept floating-point and integer scalar or vector inputs");
         }
      }

   });

GLM.$template.extend(
   GLM, GLM.$template['declare<T>'](
   {
      degrees: {
         "float": function(n) { return this.GLM._degrees(n); },
         "vec<N>": function(o) {
            return new this.GLM.vecN(this.GLM.$to_array(o).map(this.GLM._degrees));
         }
      },
      radians: {
         "float": function(n) { return this.GLM._radians(n); },
         "vec<N>": function(o) {
            return new this.GLM.vecN(this.GLM.$to_array(o).map(this.GLM._radians));
         }
      },
      sign: {
         "null":function() { return 0; },
         "undefined": function() { return NaN; },
         "string": function() { return NaN; },
         "float": function(n) { return GLM._sign(n); },
         "vec<N>": function(o) {
            return new GLM.vecN(GLM.$to_array(o).map(GLM._sign));
         },
         "ivec<N>": function(o) {
            return new GLM.ivecN(GLM.$to_array(o).map(GLM._sign));
         }
      },
      abs: {
         "float": function(n) { return GLM._abs(n); },
         "vec<N>": function(o) {
            return new GLM.vecN(GLM.$to_array(o).map(GLM._abs));
         }
      },
      fract: {
         "float": function(n) { return GLM._fract(n); },
         "vec<N>": function(o) {
            return new GLM.vecN(GLM.$to_array(o).map(GLM._fract));
         }
      },
      all: {
         "vec<N>": function(o) { return N === GLM.$to_array(o).filter(Boolean).length; },
         "bvec<N>": function(o) { return N === GLM.$to_array(o).filter(Boolean).length; },
         "ivec<N>": function(o) { return N === GLM.$to_array(o).filter(Boolean).length; },
         "uvec<N>": function(o) { return N === GLM.$to_array(o).filter(Boolean).length; },
         "quat": function(o) { return 4 === GLM.$to_array(o).filter(Boolean).length; }

      },

      $to_object: {
         "vec2": function(v) { return {x:v.x, y:v.y}; },
         "vec3": function(v) { return {x:v.x, y:v.y, z:v.z}; },
         "vec4": function(v) { return {x:v.x, y:v.y, z:v.z, w:v.w}; },
         "uvec2":function(v) { return {x:v.x, y:v.y}; },
         "uvec3":function(v) { return {x:v.x, y:v.y, z:v.z}; },
         "uvec4":function(v) { return {x:v.x, y:v.y, z:v.z, w:v.w}; },
         "ivec2":function(v) { return {x:v.x, y:v.y}; },
         "ivec3":function(v) { return {x:v.x, y:v.y, z:v.z}; },
         "ivec4":function(v) { return {x:v.x, y:v.y, z:v.z, w:v.w}; },
         "bvec2":function(v) { return {x:!!v.x, y:!!v.y}; },
         "bvec3":function(v) { return {x:!!v.x, y:!!v.y, z:!!v.z}; },
         "bvec4":function(v) { return {x:!!v.x, y:!!v.y, z:!!v.z, w:!!v.w}; },
         "quat": function(v) { return {w:v.w, x:v.x, y:v.y, z:v.z}; },
         "mat3": function(v) { return {0:this.vec3(v[0]),
                                       1:this.vec3(v[1]),
                                       2:this.vec3(v[2])}; },
         "mat4": function(v) { return {0:this.vec4(v[0]),
                                       1:this.vec4(v[1]),
                                       2:this.vec4(v[2]),
                                       3:this.vec4(v[3])}; }
      },

       // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtc/quaternion.inl
       roll: {
           $atan2: Math.atan2,
           'quat': function(q) {
		       return (this.$atan2((2) * (q.x * q.y + q.w * q.z), q.w * q.w + q.x * q.x - q.y * q.y - q.z * q.z));
	       }
       },
       pitch: {
           $atan2: Math.atan2,
           'quat': function(q) {
		       return (this.$atan2((2) * (q.y * q.z + q.w * q.x), q.w * q.w - q.x * q.x - q.y * q.y + q.z * q.z));
	       }
       },
       yaw: {
           $asin: Math.asin,
           'quat': function(q) {
		       //return this.$asin((-2) * (q.x * q.z - q.w * q.y));
               // GLM 0.9.8 fix for NaN
               return this.$asin(this.GLM.clamp((-2) * (q.x * q.z - q.w * q.y), (-1), (1)));
	       }
       },
       eulerAngles: {
           'quat': function(x) {
               return this.GLM.vec3(this.GLM.pitch(x), this.GLM.yaw(x), this.GLM.roll(x));
           }
       }
       /// glm/gtc/quaternion.inl
   }),
   GLM.$template['declare<T,...>'](
      {
         $from_glsl: {
            'string': function(v, returnType) {
               var ret;
               v.replace(/^([$\w]+)\(([-.0-9ef, ]+)\)$/,
                      function(_,what, dat) {
                         var type = glm[what] || glm['$'+what];
                         if (!type) throw new GLM.GLMJSError("glsl decoding issue: unknown type '"+what+"'");
                         ret = dat.split(',').map(parseFloat);
                         if (!returnType || returnType === type)
                            ret = type.apply(glm, ret);
                         else if (returnType === true || returnType === Array) {
                             while (ret.length < type.componentLength)
                                 ret.push(ret[ret.length-1]);
                             return ret;
                         } else throw new GLM.GLMJSError("glsl decoding issue: second argument expected to be undefined|true|Array");
                      });
               return ret;
            }
         },

         $to_glsl: {
            "vec<N>": function(v, opts) {
               var arr = GLM.$to_array(v);
               if (opts && typeof opts === 'object' && "precision" in opts)
                  arr = arr.map(function(_) { return _.toFixed(opts.precision); });
               // un-expand identical trailing values
               while(arr.length && arr[arr.length-2] === arr[arr.length-1])
                  arr.pop();
               return v.$type+"("+arr+")";
            },
            "uvec<N>": function(v, opts) { return this.vecN(v, opts); },// will pick up "uvecN" from $type
            "ivec<N>": function(v, opts) { return this.vecN(v, opts); },// will pick up "ivecN" from $type
            "bvec<N>": function(v, opts) { return this.vecN(v, opts); },// will pick up "bvecN" from $type
            quat: function(q, opts) { // note: quat()s aren't actually available in GLSL yet
               var precision;
               if (opts && typeof opts === 'object' && "precision" in opts) precision = opts.precision;
               if((q.x+q.y+q.z)===0)
                  return "quat("+(precision === undefined ? q.w : q.w.toFixed(precision))+")";
               return this.vec4(q, opts);
               //return "quat("+GLM.$to_array(q)+")";
            },
            'mat<N>': function(M, opts) {
               var precision;
               if (opts && typeof opts === 'object' && "precision" in opts) precision = opts.precision;
               // FIXME: this could fail on particular diagonals that sum to N
               var m=GLM.$to_array(M);
               if (precision !== undefined)
                  m = m.map(function(_) { return _.toFixed(precision); });
               var ss=m.reduce(function(s,e){return s+1*e; },0);
               if (ss === m[0]*N) return "matN("+m[0]+")";
               return "matN("+m+")";
            }
         },

         frexp: {
            "float": function(val,arrptr) {
               return arguments.length === 1 ?
                  this['float,undefined'](val) :
                  this['float,array'](val, arrptr);
            },
            "vec<N>": function(fvec, ivec) {
               if (arguments.length < 2)
                  throw new GLM.GLMJSError('frexp(vecN, ivecN) expected ivecN as second parameter');
               return GLM.vecN(
                  GLM.$to_array(fvec).map(
                     function(x,_) {
                        var mantissa_exp = GLM._frexp(x);
                        ivec[_] = mantissa_exp[1];
                        return mantissa_exp[0];
                     })
               );
            },
            // referenced here only (from float/vec<N>)
            "float,undefined": function(val) {
               return GLM._frexp(val);
            },
            "float,array": function(val,arr) {
               return GLM._frexp(val, arr);
            }
         },
         ldexp: {
            "float": GLM._ldexp,
            "vec<N>": function(fvec, ivec) {
               return GLM.vecN(
                  GLM.$to_array(fvec).map(
                     function(x,_) {
                        return GLM._ldexp(x,ivec[_]);
                     })
               );
            }
         }
      }
   )
);

GLM.$template['declare<T,V,...>'](
   {
      rotate: {
         'float,vec3': function(theta, axis) {
            return this.GLM.$outer.mat4_angleAxis(theta, axis);
         },
         'mat4,float': function(mat, theta, vec) {
            return mat.mul(this.GLM.$outer.mat4_angleAxis(theta, vec));
         }
      },
       scale: {
           $outer: GLM.$outer,
           'mat4,vec3': function(mat, v) {
               return mat.mul(this.$outer.mat4_scale(v));
           },
           'vec3,undefined': function(v) { return this.$outer.mat4_scale(v); }
      },
      translate: {
         'mat4,vec3': function(mat, v) {
            return mat.mul(this.GLM.$outer.mat4_translation(v));
         },
         'vec3,undefined': function(v) { return this.GLM.$outer.mat4_translation(v); }
      },
      angleAxis: {
         'float,vec3': function(angle, axis) {
            return this.GLM.$outer.quat_angleAxis(angle, axis);
         }
         // GLM 0.9.5 supported this signature, but 0.9.6 dropped it
         //'float,float':  function(angle,x,y,z) {
         //   return GLM.$outer.quat_angleAxis(angle, glm.vec3(x,y,z));
         //}
      },
      min: {
         "float,float": function(a,b) { return this.GLM._min(a,b); },
         "vec<N>,float": function(o,b) {
             return new this.GLM.vecN(this.GLM.$to_array(o).map(function(v){ return this.GLM._min(v,b); }.bind(this)));
         }
      },
      max: {
         "float,float": function(a,b) { return this.GLM._max(a,b); },
         "vec<N>,float": function(o,b) {
            return new this.GLM.vecN(this.GLM.$to_array(o).map(function(v){ return this.GLM._max(v,b); }.bind(this)));
         }
      },
      equal: {
         'float,float': GLM._equal,
         'vec<N>,vec<N>': function(a,b) {
            var eq = this['float,float'];
            var ret = glm.bvecN();
            for(var i=0; i < N; i++)
               ret[i] = eq(a[i],b[i]);
            return ret;
         },
         'bvec<N>,bvec<N>': function(a,b) { return this['vecN,vecN'](a,b); },
         'ivec<N>,ivec<N>': function(a,b) { return this['vecN,vecN'](a,b); },
         'uvec<N>,uvec<N>': function(a,b) { return this['vecN,vecN'](a,b); },
         'quat,quat': function(a,b) {
            var eq = this['float,float'];
            var ret = glm.bvec4();
            for(var i=0; i < 4; i++)
               ret[i] = eq(a[i],b[i]);
            return ret;
         }
      },

       // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtx/quaternion.inl
       _slerp: {
           'quat,quat': function(x, y, a) {
		       var z = y;

		       var cosTheta = glm.dot(glm.vec4(x), glm.vec4(y));

		       // If cosTheta < 0, the interpolation will take the long way around the sphere.
		       // To fix this, one quat must be negated.
		       if (cosTheta < (0))
		       {
			       z        = y.mul(-1);
			       cosTheta = -cosTheta;
		       }

		       // Perform a linear interpolation when cosTheta is close to 1 to avoid side effect of sin(angle) becoming a zero denominator
		       if(cosTheta > (1) - glm.epsilon())
		           {
			           // Linear interpolation
			           return glm.quat(
				           glm.mix(x.w, z.w, a),
				           glm.mix(x.x, z.x, a),
				           glm.mix(x.y, z.y, a),
				           glm.mix(x.z, z.z, a));
		           }
		           else
		       {
			       // Essential Mathematics, page 467
			       var angle = Math.acos(cosTheta);
			       return (x.mul(Math.sin((1 - a) * angle))  + z.mul(Math.sin(a * angle))) / Math.sin(angle);
		       }
	       }
       },
       rotation: {
         'vec3,vec3': function(orig, dest) {
            var cosTheta = this.$dot(orig, dest);
             var rotationAxis = new (orig.constructor)(new (orig.elements.constructor)(3));

            if(cosTheta >= 1 - this.$epsilon)
               return this.$quat();

            if(cosTheta < -1 + this.$epsilon)
               {
                  // special case when vectors in opposite directions :
                  // there is no "ideal" rotation axis
                  // So guess one; any will do as long as it's perpendicular to start
                  // This implementation favors a rotation around the Up axis (Y),
                  // since it's often what you want to do.
                  rotationAxis = this.$cross(this.$m[2], orig); //glm.vec3(0, 0, 1)
                  if(this.$length2(rotationAxis) < this.$epsilon) // bad luck, they were parallel, try again!
                     rotationAxis = this.$cross(this.$m[0], orig);//glm.vec3(1, 0, 0)

                  rotationAxis = this.$normalize(rotationAxis);
                  return this.$angleAxis(this.$pi, rotationAxis);
               }

            // Implementation from Stan Melax's Game Programming Gems 1 article
            rotationAxis = this.$cross(orig, dest);

            var s = this.$sqrt(((1) + cosTheta) * (2));
            var invs = (1) / s;

            return this.$quat(
               s * (0.5),
               rotationAxis.x * invs,
               rotationAxis.y * invs,
               rotationAxis.z * invs);
         }
       }, /// glm/gtx/quaternion.inl

       project: {
           // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtc/matrix_transform.inl
           'vec3,mat4': function project(obj, model, proj, viewport) {
		       var tmp = glm.vec4(obj, (1));
		       tmp = model ['*']( tmp );
		       tmp = proj ['*']( tmp );

		       tmp ['/=']( tmp.w );
		       tmp = tmp ['*'] (0.5) ['+'] (0.5);
		       tmp[0] = tmp[0] * (viewport[2]) + (viewport[0]);
		       tmp[1] = tmp[1] * (viewport[3]) + (viewport[1]);

		       return glm.vec3(tmp);
	       } /// glm/gtc/matrix_transform.inl
       },
       unProject: {
           // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtc/matrix_transform.inl
           'vec3,mat4': function unProject(win, model, proj, viewport) {
		       var Inverse = glm.inverse(proj ['*']( model ));

		       var tmp = glm.vec4(win, (1));
		       tmp.x = (tmp.x - (viewport[0])) / (viewport[2]);
		       tmp.y = (tmp.y - (viewport[1])) / (viewport[3]);
		       tmp = tmp ['*']( (2) ) ['-'](glm.vec4(1));

		       var obj = Inverse ['*']( tmp );
		       obj['/=']( obj.w );

		       return glm.vec3(obj);
	       } /// glm/gtc/matrix_transform.inl
       },
       orientedAngle: {
           // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtx/vector_angle.inl
           'vec3,vec3': function orientedAngle(x,y,ref) {
		       var Angle = Math.acos(glm.clamp(glm.dot(x, y), (0), (1)));
		       return glm.mix(Angle, -Angle, glm.dot(ref, glm.cross(x, y)) < 0 ? 1 : 0);
           } /// glm/gtx/vector_angle.inl
       }
   });

// like glm.to_string; tho this also supports rounding to a precision
GLM.$to_string = GLM.$template['declare<T,...>'](
   {
      $to_string: {
         "function": function(func) {
            return "[function "+(func.name||"anonymous")+"]";
         },
         "ArrayBuffer": function(b) {
            return "[object ArrayBuffer "+JSON.stringify({byteLength: b.byteLength})+"]";
         },
         "Float32Array": function(b) {
            return "[object Float32Array "+JSON.stringify({length: b.length, byteOffset: b.byteOffset, byteLength: b.byteLength, BPE: b.BYTES_PER_ELEMENT})+"]";
         },
         "float": function(what, opts) {
            return GLM.$toFixedString("float", { value: what }, ['value'], opts && opts.precision);
         },
         string: function(what) { return what; },
         bool: function(what) { return 'bool('+what+')'; },
         'vec<N>': function(what, opts) {
            return GLM.$toFixedString(what.$type_name, what, what.$components, opts && opts.precision);
         },
         'uvec<N>': function(what, opts) {
            var prec = (opts && typeof opts === 'object' && opts.precision) || 0;
            return GLM.$toFixedString(what.$type_name, what, what.$components, prec);
            //return what.$type_name+"("+glm.$to_array(what)+")";
         },
         'ivec<N>': function(what, opts) {
            var prec = (opts && typeof opts === 'object' && opts.precision) || 0;
            return GLM.$toFixedString(what.$type_name, what, what.$components, prec);
         },
         'bvec<N>': function(what, opts) {
            return what.$type_name+'('+GLM.$to_array(what).map(Boolean).join(', ')+')';
         },
         'mat<N>': function(what, opts) {
            var ret = [0,1,2,3].slice(0,N)
            .map(function(_) { return what[_]; }) // into columns
            .map(function(wi) { // each column's vecN
                    return GLM.$toFixedString("\t", wi, wi.$components, opts && opts.precision);
                 });
            return what.$type_name + '(\n'+ ret.join(", \n") +"\n)";
         },
         quat: function(what, opts) {
            what = GLM.degrees(GLM.eulerAngles(what));
            return GLM.$toFixedString("<quat>"+what.$type_name, what, ['x','y','z'], opts && opts.precision);
         }
      }
   }).$to_string;

GLM.$template['declare<T,V,...>'](
   {
      copy: {
         $op: '=',
         'vec<N>,vec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'vec<N>,array<N>': function(me,you) { me.elements.set(you); return me; },
         'vec<N>,uvec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'vec<N>,ivec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'vec<N>,bvec<N>': function(me,you) { me.elements.set(you.elements); return me; },

         'uvec<N>,uvec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'uvec<N>,array<N>': function(me,you) { me.elements.set(you); return me; },
         'uvec<N>,vec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'uvec<N>,ivec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'uvec<N>,bvec<N>': function(me,you) { me.elements.set(you.elements); return me; },

         'ivec<N>,ivec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'ivec<N>,array<N>': function(me,you) { me.elements.set(you); return me; },
         'ivec<N>,vec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'ivec<N>,uvec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'ivec<N>,bvec<N>': function(me,you) { me.elements.set(you.elements); return me; },

         'bvec<N>,ivec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'bvec<N>,array<N>': function(me,you) { me.elements.set(you); return me; },
         'bvec<N>,vec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'bvec<N>,uvec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'bvec<N>,bvec<N>': function(me,you) { me.elements.set(you.elements); return me; },

         'quat,quat': function(me,you) { me.elements.set(you.elements); return me; },
         'mat<N>,mat<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'mat<N>,array<N>': function(me,you) {
            you = you.reduce(function(a,b) {
                                if (!a.concat) throw new GLM.GLMJSError("matN,arrayN -- [[.length===4] x 4] expected");
                                return a.concat(b);
                             });
            if (you === N) throw new GLM.GLMJSError("matN,arrayN -- [[N],[N],[N],[N]] expected");
            return me['='](you);
         },
         'mat<N>,array<N*N>': function(me,you) { me.elements.set(you); return me; },
         'mat4,array9': function(me,you) { me.elements.set(new GLM.mat4(you).elements); return me; }
      },
      sub: {
         $op: '-',
         _sub: function(me,you) {
            return (this.GLM.$to_array(me).map(function(v,_) { return v - you[_]; }));
         },
         'vec<N>,vec<N>': function(me,you) { return new this.GLM.vecN(this._sub(me,you)); },
         'vec<N>,uvec<N>': function(me,you) { return new this.GLM.vecN(this._sub(me,you)); },
         'uvec<N>,uvec<N>': function(me,you) { return new this.GLM.uvecN(this._sub(me,you)); },
         'uvec<N>,ivec<N>': function(me,you) { return new this.GLM.uvecN(this._sub(me,you)); },
         'vec<N>,ivec<N>': function(me,you) { return new this.GLM.vecN(this._sub(me,you)); },
         'ivec<N>,uvec<N>': function(me,you) { return new this.GLM.ivecN(this._sub(me,you)); },
         'ivec<N>,ivec<N>': function(me,you) { return new this.GLM.ivecN(this._sub(me,you)); }
      },
      sub_eq: {
         $op: '-=',
          'vec<N>,vec<N>': function(me,you) {
              var a = me.elements, b = you.elements;
              for(var i=0; i < N; i++)
                  a[i] = a[i] - b[i];
              return me;
         },
         'vec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'uvec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'uvec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'vec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'ivec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'ivec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); }
      },
      add: {
         $op: '+',
         _add: function(me,you) {
            return (this.GLM.$to_array(me).map(function(v,_) { return v + you[_]; }));
         },
         'vec<N>,float': function(me,you) { return new this.GLM.vecN(this._add(me,[you,you,you,you])); },
         'vec<N>,vec<N>': function(me,you) { return new this.GLM.vecN(this._add(me,you)); },
         'vec<N>,uvec<N>': function(me,you) { return new this.GLM.vecN(this._add(me,you)); },
         'uvec<N>,uvec<N>': function(me,you) { return new this.GLM.uvecN(this._add(me,you)); },
         'uvec<N>,ivec<N>': function(me,you) { return new this.GLM.uvecN(this._add(me,you)); },
         'vec<N>,ivec<N>': function(me,you) { return new this.GLM.vecN(this._add(me,you)); },
         'ivec<N>,ivec<N>': function(me,you) { return new this.GLM.ivecN(this._add(me,you)); },
         'ivec<N>,uvec<N>': function(me,you) { return new this.GLM.ivecN(this._add(me,you)); }
      },
      add_eq: {
         $op: '+=',
         'vec<N>,vec<N>': function(me,you) {
             var a = me.elements, b = you.elements;
             for(var i=0; i < N; i++)
                 a[i] = a[i] + b[i];
             return me;
           //this.GLM.$to_array(me).map(function(v,_) { return me.elements[_] = v + you[_]; });
         },
         'vec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'uvec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'uvec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'vec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'ivec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'ivec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); }
      },
      div: {
         $op: '/',
         'vec<N>,float': function(me, k) {
            return new this.GLM.vecN(
               this.GLM.$to_array(me).map(function(v,_) { return v / k; })
            );
         }
      },
      div_eq: {
         $op: '/=',
         'vec<N>,float': function(me, k) {
            for(var i=0; i < N ; i++)
              me.elements[i] /= k;
            return me;
         }
      },
      mul: {
         $op: '*',
         'vec<N>,vec<N>': function(me, you) {
            return new this.GLM.vecN(
                this.GLM.$to_array(me).map(function(v,_) { return v  * you[_]; })
            );
         }
      },
      eql_epsilon: (
         function(epsilonEqual) {
            return {
               $op: '~=',
               'vec<N>,vec<N>': epsilonEqual,
               'mat<N>,mat<N>': epsilonEqual,
               'quat,quat': epsilonEqual,
               'uvec<N>,uvec<N>': epsilonEqual,
               'ivec<N>,ivec<N>': epsilonEqual
            };
         }
      )(function epsilonEqualAB(a,b) { return this.GLM.all(this.GLM.epsilonEqual(a,b,this.GLM.epsilon())); }),
      eql: (
         function(equal) {
            return {
               $op: '==',
               'mat<N>,mat<N>': function(me,you) {
                  return you.elements.length === glm.$to_array(me)
                     .filter(function(v,_) { return v === you.elements[_]; }).length;
               },
               'vec<N>,vec<N>': equal,
               'quat,quat': equal,
               'uvec<N>,uvec<N>': equal,
               'ivec<N>,ivec<N>': equal,
               'bvec<N>,bvec<N>': equal
            };
         }
      )(function equalAB(a,b) { return GLM.all(GLM.equal(a,b)); })
   });

// ----------------------------------------------------------------------------
// typeof support for catch-all to_string()
GLM['string'] = {
   $type_name: "string", $: {  }
};
GLM['number'] = {
   $type_name: "float", $: {  }
};
GLM['boolean'] = {
   $type: 'bool', $type_name: "bool", $: {  }
};

// ----------------------------------------------------------------------------
GLM.vec2 = GLM.$template.GLMType(
   'vec2',
   {
      name: 'fvec2',
      identity: [0,0],
      components: [ 'xy', '01' ],
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         return [x,x];
      },
      'number2': function(x,y) {
         return [x,y];
      },
      'object1': function(o) {
         if (o!==null)
         switch(o.length){
         case 4: // vec4 -> vec2 reduction
         case 3: // vec3 -> vec2 reduction
         case 2: return [o[0], o[1]];
         default:
               if ("y" in o && "x" in o) {
                  if (typeof o.x !== typeof o.y)
                     throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.vec2: '+o);
                  if (typeof o.x === 'string') // coerce into numbers
                     return [o.x*1, o.y*1];
                  return [o.x, o.y];
               }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.vec2: '+o);
      }
   }); // GLM.vec2.$
// ----------------------------------------------------------------------------
GLM.uvec2 = GLM.$template.GLMType(
   'uvec2',
   {
      name: 'uvec2',
      identity: [0,0],
      components: [ 'xy', '01' ],
      _clamp: function(x) { return ~~x; }, // match observed GLM C++ behavior
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         x=this._clamp(x);
         return [x,x];
      },
      'number2': function(x,y) {
         x=this._clamp(x);
         y=this._clamp(y);
         return [x,y];
      },
      'object1': function(o) {
         switch(o.length){
         case 4: // vec4 -> vec2 reduction
         case 3: // vec3 -> vec2 reduction
         case 2: return [o[0], o[1]].map(this._clamp);
         default:
               if ("y" in o && "x" in o) {
                  if (typeof o.x !== typeof o.y) throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.'+this.name+': '+o);
                  return [o.x, o.y].map(this._clamp);
               }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+': '+o);
      }
   }); // GLM.uvec2.$

// ----------------------------------------------------------------------------
GLM.vec3 = GLM.$template.GLMType(
   'vec3',
   {
      name: 'fvec3',
      identity: [0,0,0],
      components: [ 'xyz', '012', 'rgb' ],
      'undefined0': function() { return GLM.vec3.$.identity; },
      'number1': function(x) {
         return [x,x,x];
      },
      'number2': function(x,y) {
         return [x,y,y];
      },
      'number3': function(x,y,z) {
         return [x,y,z];
      },
       Error: GLM.GLMJSError,
      'object1': function(o) {
         if (o) {
            switch(o.length){
            case 4: // vec4 -> vec3 reduction
            case 3: return [o[0], o[1], o[2]];
            case 2: return [o[0], o[1], o[1]];
            default:
                  if ("z" in o /*&& "y" in o*/ && "x" in o) {
                     if (typeof o.x !== typeof o.y)
                        throw new this.Error('unrecognized .x-ish object passed to GLM.vec3: '+o);
                     if (typeof o.x === 'string') // coerce into numbers
                        return [o.x*1, o.y*1, o.z*1];
                     return [o.x, o.y, o.z];
                  }
            }
         }
         throw new this.Error('unrecognized object passed to GLM.vec3: '+o);
      },
      'object2': function(o,z) {
         if (o instanceof GLM.vec2 || o instanceof GLM.uvec2 || o instanceof GLM.ivec2 || o instanceof GLM.bvec2)
            return [o.x, o.y, z];
         throw new GLM.GLMJSError('unrecognized object passed to GLM.vec3(o,z): '+[o,z]);
      }
   }); // GLM.vec3.$

// ----------------------------------------------------------------------------
GLM.uvec3 = GLM.$template.GLMType(
   'uvec3',
   {
      name: 'uvec3',
      identity: [0,0,0],
      components: [ 'xyz', '012' ],
      _clamp: GLM.uvec2.$._clamp,
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         x=this._clamp(x);
         return [x,x,x];
      },
      'number2': function(x,y) {
         x=this._clamp(x);
         y=this._clamp(y);
         return [x,y,y];
      },
      'number3': function(x,y,z) {
         x=this._clamp(x);
         y=this._clamp(y);
         z=this._clamp(z);
         return [x,y,z];
      },
      'object1': function(o) {
         if (o) {
            switch(o.length){
            case 4: // vec4 -> vec3 reduction
            case 3: return [o[0], o[1], o[2]].map(this._clamp);
            case 2: return [o[0], o[1], o[1]].map(this._clamp);
            default:
                  if ("z" in o /*&& "y" in o*/ && "x" in o) {
                     if (typeof o.x !== typeof o.y)
                        throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.'+this.name+': '+o);
                     return [o.x, o.y, o.z].map(this._clamp);
                  }
            }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+': '+o);
      },
      'object2': function(o,z) {
         if (o instanceof GLM.vec2)
            return [o.x, o.y, z].map(this._clamp);
         if (o instanceof GLM.uvec2 || o instanceof GLM.ivec2 || o instanceof GLM.bvec2)
            return [o.x, o.y, this._clamp(z)];

         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+'(o,z): '+[o,z]);
      }
   }); // GLM.uvec3.$

// ----------------------------------------------------------------------------

GLM.vec4 = GLM.$template.GLMType(
   'vec4',
   {
      name: 'fvec4',
      identity: [0,0,0,0],
      components: ['xyzw','0123','rgba'],
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         return [x,x,x,x];
      },
      'number2': function(x,y) {
         return [x,y,y,y];
      },
      'number3': function(x,y,z) {
         return [x,y,z,z];
      },
      'number4': function(x,y,z,w) {
         return [x,y,z,w];
      },
      Error: GLM.GLMJSError,
      'object1': function(o) {
         if (o) {
            switch(o.length){
            case 4: return [o[0], o[1], o[2], o[3]];
            case 3: return [o[0], o[1], o[2], o[2]];
            case 2: return [o[0], o[1], o[1], o[1]];
            default:
                  if ("w" in o /*&& "z" in o && "y" in o*/ && "x" in o)  {
                     if (typeof o.x !== typeof o.w)
                        throw new this.Error('unrecognized .x-ish object passed to GLM.vec4: '+o);
                     if (typeof o.x === 'string') // coerce into numbers
                        return [o.x*1, o.y*1, o.z*1, o.w*1];
                     return [o.x, o.y, o.z, o.w];
                  }
            }
         }
         throw new this.Error('unrecognized object passed to GLM.vec4: '+[o,o&&o.$type]);
      },
      $GLM: GLM,
      'object2': function(o,w) {
         if (o instanceof this.$GLM.vec3 || o instanceof this.$GLM.uvec3 || o instanceof this.$GLM.ivec3 || o instanceof this.$GLM.bvec3)
            return [o.x, o.y, o.z, w];
         throw new this.$GLM.GLMJSError('unrecognized object passed to GLM.vec4(o,w): '+[o,w]);
      },
      'object3': function(o,z,w) {
         if (o instanceof this.$GLM.vec2 || o instanceof this.$GLM.uvec2 || o instanceof this.$GLM.ivec2 || o instanceof this.$GLM.bvec2)
            return [o.x, o.y, z, w];
         throw new this.$GLM.GLMJSError('unrecognized object passed to GLM.vec4(o,z,w): '+[o,z,w]);
      }
   }
); // GLM.vec4.$

// ----------------------------------------------------------------------------

GLM.uvec4 = GLM.$template.GLMType(
   'uvec4',
   {
      name: 'uvec4',
      identity: [0,0,0,0],
      components: [ 'xyzw', '0123' ],
      _clamp: GLM.uvec2.$._clamp,
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         x=this._clamp(x);
         return [x,x,x,x];
      },
      'number2': function(x,y) {
         x=this._clamp(x);
         y=this._clamp(y);
         return [x,y,y,y];
      },
      'number3': function(x,y,z) {
         x=this._clamp(x);
         y=this._clamp(y);
         z=this._clamp(z);
         return [x,y,z,z];
      },
      'number4': function(x,y,z,w) {
         return [x,y,z,w].map(this._clamp);
      },
      Error: GLM.GLMJSError,
      'object1': function(o) {
         if (o) {
            switch(o.length){
            case 4: return [o[0], o[1], o[2], o[3]].map(this._clamp);
            case 3: return [o[0], o[1], o[2], o[2]].map(this._clamp);
            case 2: return [o[0], o[1], o[1], o[1]].map(this._clamp);
            default:
                  if ("w" in o /*&& "z" in o && "y" in o*/ && "x" in o) {
                     if (typeof o.x !== typeof o.y)
                        throw new this.Error('unrecognized .x-ish object passed to GLM.'+this.name+': '+o);
                     return [o.x, o.y, o.z, o.w].map(this._clamp);
                  }
            }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+': '+[o,o&&o.$type]);
      },
      'object2': function(o,w) {
         if (o instanceof GLM.vec3)
            return [o.x, o.y, o.z, w].map(this._clamp);
         if (o instanceof GLM.uvec3 || o instanceof GLM.ivec3 || o instanceof GLM.bvec3)
            return [o.x, o.y, o.z, this._clamp(w)];
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+'(o,w): '+[o,w]);
      },
      'object3': function(o,z,w) {
         if (o instanceof GLM.vec2)
            return [o.x, o.y, z, w].map(this._clamp);
         if (o instanceof GLM.uvec2 || o instanceof GLM.ivec2 || o instanceof GLM.bvec2)
            return [o.x, o.y, this._clamp(z), this._clamp(w)];
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+'(o,z,w): '+[o,z,w]);
      }
   }
); // GLM.uvec4.$

// ----------------------------------------------------------------------------
// observed GLM behavior is that ivec2 and uvec2 seem to behave identically
GLM.ivec2 = GLM.$template.GLMType(
   'ivec2', GLM.$template.extend({}, GLM.uvec2.$, { name: 'ivec2' })
);
GLM.ivec3 = GLM.$template.GLMType(
   'ivec3', GLM.$template.extend({}, GLM.uvec3.$, { name: 'ivec3' })
);
GLM.ivec4 = GLM.$template.GLMType(
   'ivec4', GLM.$template.extend({}, GLM.uvec4.$, { name: 'ivec4' })
);
// first-pass at bvec emulation
GLM.bvec2 = GLM.$template.GLMType(
   'bvec2', GLM.$template.extend(
      {}, GLM.uvec2.$, { name: 'bvec2',
                         'boolean1': GLM.uvec2.$.number1,
                         'boolean2': GLM.uvec2.$.number2
                       })
);
GLM.bvec3 = GLM.$template.GLMType(
   'bvec3', GLM.$template.extend(
      {}, GLM.uvec3.$, { name: 'bvec3',
                         'boolean1': GLM.uvec3.$.number1,
                         'boolean2': GLM.uvec3.$.number2,
                         'boolean3': GLM.uvec3.$.number3
                       })
);
GLM.bvec4 = GLM.$template.GLMType(
   'bvec4', GLM.$template.extend(
      {}, GLM.uvec4.$, { name: 'bvec4',
                         'boolean1': GLM.uvec4.$.number1,
                         'boolean2': GLM.uvec4.$.number2,
                         'boolean3': GLM.uvec4.$.number3,
                         'boolean4': GLM.uvec4.$.number4
                       })
);
GLM.bvec2.$._clamp = GLM.bvec3.$._clamp = GLM.bvec4.$._clamp =
    function _bclamp(x) { return !!x; };
// ----------------------------------------------------------------------------
GLM.mat3 = GLM.$template.GLMType(
   'mat3',
   {
      name: 'mat3x3',
      identity : [1, 0, 0,
                  0, 1, 0,
                  0, 0, 1],
      'undefined0' : function(M) { return this.identity; },
      'number1': function(n) {
         if (n === 1) {
            return this.identity;
         }
         return [n, 0, 0,
                 0, n, 0,
                 0, 0, n];
      },
      'number9': function(
         c1r1, c1r2, c1r3,
         c2r1, c2r2, c2r3,
         c3r1, c3r2, c3r3
      ) {
         return arguments;
      },
      Error: GLM.GLMJSError,
      $vec3: GLM.vec3,
      'object1': function(o) {
         if (o) {
            var m4 = o.elements || o;
            if (m4.length === 16) {
               return [ // mat4 -> mat3
                  m4[0+0], m4[0+1], m4[0+2],
                  m4[4+0], m4[4+1], m4[4+2],
                  m4[8+0], m4[8+1], m4[8+2]
               ];
            }
            if (m4.length === 9)
               return m4;
            // JSON-encoded objects may arrive this way: {"0":{"x": ...
            if (0 in m4 && 1 in m4 && 2 in m4  &&
                !(3 in m4) && typeof m4[2] === 'object' )
               return [
                  m4[0],m4[1],m4[2]
               ].map(this.$vec3.$.object1)
                .reduce(function(a,b) { return a.concat(b); });
         }
         throw new this.Error('unrecognized object passed to GLM.mat3: '+o);
      },
      'object3': function(c1,c2,c3) {
         return [c1,c2,c3].map(glm.$to_array)
            .reduce(function(a,b) { return a.concat(b); });
      }

   }); // GLM.mat3.$

// ----------------------------------------------------------------------------
GLM.mat4 = GLM.$template.GLMType(
   'mat4',
   {
      name: 'mat4x4',
      identity: [1, 0, 0, 0,
                 0, 1, 0, 0,
                 0, 0, 1, 0,
                 0, 0, 0, 1],
      'undefined0' : function() { return this.identity; },
      'number16': function(
         c1r1, c1r2, c1r3, c1r4,
         c2r1, c2r2, c2r3, c2r4,
         c3r1, c3r2, c3r3, c3r4,
         c4r1, c4r2, c4r3, c4r4
      ) {
         return arguments;
      },
      'number1' : function(n) {
         if (n === 1)
            return this.identity;
         return [n, 0, 0, 0,
                 0, n, 0, 0,
                 0, 0, n, 0,
                 0, 0, 0, n];
      },
      Error: GLM.GLMJSError,
      $vec4: GLM.vec4,
      'object1' : function(o) {
         var m4;
         if (o) {
            m4 = o.elements || o;
            if (m4.length === 9) {
               // mat3 -> mat4
               return [
                  m4[0+0], m4[0+1], m4[0+2], 0,
                  m4[3+0], m4[3+1], m4[3+2], 0,
                  m4[6+0], m4[6+1], m4[6+2], 0,
                  0      , 0      , 0      , 1
               ];
            }
            if (m4.length === 4 && m4[0] && m4[0].length === 4) {
               return m4[0].concat(m4[1],m4[2],m4[3]);
            }
            if (m4.length === 16)
               return m4;

            // JSON-encoded objects may arrive this way: {"0":{"x": ...
            if (0 in m4 && 1 in m4 && 2 in m4 && 3 in m4 &&
                !(4 in m4) && typeof m4[3] === 'object' )
               return [
                  m4[0],m4[1],m4[2],m4[3]
               ].map(this.$vec4.$.object1)
                .reduce(function(a,b) { return a.concat(b); });
      }
         throw new this.Error('unrecognized object passed to GLM.mat4: '+[o,m4&&m4.length]);
      },
      'object4': function(c1,c2,c3,c4) {
         return [c1,c2,c3,c4].map(glm.$to_array)
            .reduce(function(a,b) { return a.concat(b); });
      }

   }); // GLM.mat4.$


// ----------------------------------------------------------------------------

GLM.quat = GLM.$template.GLMType(
   'quat',
   {
      identity: [0,0,0,1],
      components: ['xyzw','0123'],
      'undefined0': function() { return this.identity; },
      'number1': function(w) {
         if (w !== 1)
            throw new Error('only quat(1) syntax supported for quat(number1 args)...');
         return this.identity;
      },
      'number4': function(w,x,y,z) {
         return [x,y,z,w];
      },
      $GLM: GLM,
      $M3: GLM.mat3(),
      $quat_array_from_zyx: function(o) {
         //TODO: optimizations?
         //var q = this.$GLM.quat();
         var M3 = this.$M3;
          return (
                 this.$GLM.$outer.quat_angleAxis(o.z, M3[2])
            .mul(this.$GLM.$outer.quat_angleAxis(o.y, M3[1]))
            .mul(this.$GLM.$outer.quat_angleAxis(o.x, M3[0]))
          ).elements;
      },
      'object1': function(o) {
         if (o) {
            if (o instanceof this.$GLM.mat4)
               return this.$GLM.$outer.quat_array_from_mat4(o);
            if (o.length === 4)
               return [o[0], o[1], o[2], o[3]];
            if (o instanceof this.$GLM.quat)
               return [o.x, o.y, o.z, o.w];
            if (o instanceof this.$GLM.vec3)
                return this.$quat_array_from_zyx(o);
            if ("w" in o && "x" in o) {
               if (typeof o.x === 'string') // coerce into numbers
                  return [o.x*1, o.y*1, o.z*1, o.w*1];
               return [o.x, o.y, o.z, o.w];
            }
         }
         throw new this.$GLM.GLMJSError('unrecognized object passed to GLM.quat.object1: '+[o,o&&o.$type, typeof o, o&&o.constructor]);
      }
   });


// ----------------------------------------------------------------------------
// indexers and swizzles
(function() {

    var rigswizzle = function(o, arr, visible, noswizzles) {
       var default_properties = {
           def: function(k,v) {
             //console.warn("okv", o.prototype, k, v);
             this[k] = v;
             Object.defineProperty(o.prototype, k, v);
          }
       };
       o.$properties = o.$properties || default_properties;
       var def = o.$properties.def.bind(o.$properties);

       //console.warn("rigswizzle", o.prototype.$type_name, arr);

       // indexer templates
       var indexers = [0,1,2,3].map(
          function(_) {
             return {
                enumerable: visible,
                get: function getter() { return this.elements[_]; },
                set: function setter(v) { this.elements[_] = v; }
             };
          });

       // wire-up new o.x, o.y etc.
       arr.forEach(function(a,_) { def(a, indexers[_]); });

       // swizzle (non-numeric, non-_) prop sets
       if (isNaN(arr[0]) && !/^_/.test(arr[0])) {

          var _arr = arr.slice();//clone
          // like .xyzw, ,.xyz, .xy
          var $subarray = GLM.$subarray;
          do {
             (function(p,vn,n) {
                 if (vn === 'quat') vn = 'vec'+n;
                 var glmtype = GLM[vn];
                 def(p, {
                        enumerable: false,
                        get: function getter() { return new glmtype($subarray(this.elements,0*n,(0+1)*n)); },//this.elements.subarray(0*n,(0+1)*n)); },
                        set: function setter(val) { return new glmtype($subarray(this.elements,0*n,(0+1)*n))['='](val); }
                     });
              })(_arr.join(""), o.prototype.$type.replace(/[1-9]$/, _arr.length), _arr.length);
          } while(_arr[1] != _arr.pop());

          if (noswizzles) return o.$properties;

          _arr = arr.slice();//clone

          // like .yz, .yzw, .zw
          // TODO: algorithmize
          var other = ({
                          'xyz': { yz: 1 },
                          'xyzw': { yzw: 1, yz: 1, zw: 2 }
                       })[_arr.join("")];
          if (other) {
             for(var p in other) {
                (function(p, vn, n, offset) {
                    def(p, {
                           enumerable: false,
                           get: function getter() { return new GLM[vn](GLM.$subarray(this.elements,0*n+offset,(0+1)*n+offset)); },
                           set: function setter(val) { return new GLM[vn](GLM.$subarray(this.elements,0*n+offset,(0+1)*n+offset))['='](val); }
                        });
                 })(p, o.prototype.$type.replace(/[1-9]$/, p.length), p.length, other[p]);
             }
          }
       };
       return o.$properties;
    };

    rigswizzle(GLM.vec2, GLM.vec2.$.components[0] /*xy*/, true);
    rigswizzle(GLM.vec2, GLM.vec2.$.components[1] /*01*/);

    rigswizzle(GLM.vec3, GLM.vec3.$.components[0] /*xyz*/, true);
    rigswizzle(GLM.vec3, GLM.vec3.$.components[1] /*012*/);
    rigswizzle(GLM.vec3, GLM.vec3.$.components[2] /*rgb*/);

    rigswizzle(GLM.vec4, GLM.vec4.$.components[0] /*xyzw*/, true);
    rigswizzle(GLM.vec4, GLM.vec4.$.components[1] /*0123*/);
    rigswizzle(GLM.vec4, GLM.vec4.$.components[2] /*rgba*/);

    // quat .wxyz
    rigswizzle(GLM.quat, GLM.quat.$.components[0] /*xyzw*/, true, "noswizzles");
    rigswizzle(GLM.quat, GLM.quat.$.components[1] /*0123*/);

    GLM.quat.$properties
       .def('wxyz', {
              enumerable: false,
              get: function() { return new GLM.vec4(this.w,this.x,this.y,this.z); },
              set: function(v) { v=GLM.vec4(v); return this['='](GLM.quat(v.x,v.y,v.z,v.w)); }
           });

    ['uvec2','uvec3','uvec4','ivec2','ivec3','ivec4','bvec2','bvec3','bvec4'].forEach(
       function(_vecN) {
          rigswizzle(GLM[_vecN], GLM[_vecN].$.components[0] /*xy[z][w]*/, true);
          rigswizzle(GLM[_vecN], GLM[_vecN].$.components[1] /*01[2][3]*/);
       });

    // rigswizzle(GLM.uvec2, GLM.uvec2.$.components[0] /*xy*/, true);
    // rigswizzle(GLM.uvec2, GLM.uvec2.$.components[1] /*01*/);
    // rigswizzle(GLM.uvec3, GLM.uvec3.$.components[0] /*xyz*/, true);
    // rigswizzle(GLM.uvec3, GLM.uvec3.$.components[1] /*012*/);
    // rigswizzle(GLM.uvec4, GLM.uvec4.$.components[0] /*xyzw*/, true);
    // rigswizzle(GLM.uvec4, GLM.uvec4.$.components[1] /*0123*/);

    // legacy THREE.js interop detection
    Object.defineProperty(GLM.quat.prototype, '_x', { get: function() { throw new Error('erroneous quat._x access'); } });

    // less common swizzle patterns
    var lesscommon = {
        2: {
            yx: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.y,this.x); },
                set: function(v) { v=GLM.vec2(v); this.y = v[0]; this.x = v[1]; }
            }
        },
        3: {
            xz: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.x,this.z); },
                set: function(v) { v=GLM.vec2(v); this.x = v[0]; this.z = v[1]; }
            },
            zx: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.z,this.x); },
                set: function(v) { v=GLM.vec2(v); this.z = v[0]; this.x = v[1]; }
            },
            xzy: {
                enumerable: false,
                get: function() { return new GLM.vec3(this.x,this.z,this.y); },
                set: function(v) { v=GLM.vec3(v); this.x = v[0]; this.z = v[1]; this.y = v[2]; }
            }
        },
        4: {
            xw: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.x,this.w); },
                set: function(v) { v=GLM.vec2(v); this.x = v[0]; this.w = v[1]; }
            },
            wz: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.w,this.z); },
                set: function(v) { v=GLM.vec2(v); this.w = v[0]; this.z = v[1]; }
            },
            wxz: {
                enumerable: false,
                get: function() { return new GLM.vec3(this.w,this.x,this.z); },
                set: function(v) { v=GLM.vec3(v); this.w = v[0]; this.x = v[1]; this.z = v[2]; return this; }
            },
            xyw: {
                enumerable: false,
                get: function() { return new GLM.vec3(this.x,this.y,this.w); },
                set: function(v) { v=GLM.vec3(v); this.x = v[0]; this.y = v[1]; this.w = v[2]; return this; }
            },
            xzw: {
                enumerable: false,
                get: function() { return new GLM.vec3(this.x,this.z,this.w); },
                set: function(v) { v=GLM.vec3(v); this.x = v[0]; this.z = v[1]; this.w = v[2]; }
            },
            wxyz: {
                enumerable: false,
                get: function() { return new GLM.vec4(this.w,this.x,this.y,this.z); },
                set: function(v) { v=GLM.vec4(v); this.w = v[0]; this.x = v[1]; this.y = v[2]; this.z = v[3]; return this; }
            }
        }
    };
    for(var N in lesscommon) {
        for(var p in lesscommon[N]) {
            if (N <= 2)
                GLM.vec2.$properties.def(p, lesscommon[N][p])
            if (N <= 3)
                GLM.vec3.$properties.def(p, lesscommon[N][p])
            if (N <= 4)
                GLM.vec4.$properties.def(p, lesscommon[N][p])
        }
    }

    // cached NxN matrix column accessors
    var szfloat = GLM.$outer.Float32Array.BYTES_PER_ELEMENT;
    GLM.$partition = function cols(mat_prototype, vec, nrows, cache_prefix) {
       if (nrows === undefined) throw new GLM.GLMJSError('nrows is undefined');
       // mat column accessors -- eg: mat[0] as a read/write vec
       var vec_length = vec.$.identity.length;

       // if unspecified then assume square
       nrows = nrows || vec_length;

       //GLM.$outer.console.info("GLM.$partition", [vec_length,nrows].join("x"));
       var CACHEDBG = function(x) { GLM.$DEBUG > 3 && GLM.$outer.console.debug('CACHEDBG: '+x); };
       //var elements = mat_prototype.elements;
       var bytesper = szfloat * vec_length;
       for(var i=0; i < nrows; i++) {
          (function(index) {
              var offset = index * bytesper;
              var cache_index = cache_prefix && cache_prefix + index;
              var _index = index * vec_length;
             Object.defineProperty(
                mat_prototype, index,
                   { configurable: true,
                     enumerable: true,
                     set: function setter(o) {
                        if (o instanceof vec)
                           this.elements.set(o.elements, _index);
                        else if (o && o.length === vec_length) {
                           this.elements.set(o, _index);
                        } else
                        throw new GLM.GLMJSError("unsupported argtype to "+
                                             (mat_prototype&&mat_prototype.$type)+"["+index+'] setter: '+
                                             [typeof o,o]);
                     },
                     get: function getter() {
                        if (cache_prefix) {
                           if (this[cache_index]) {
                              if (!index) { CACHEDBG("cache hit "+cache_index); }
                              //Object.defineProperty(this, index, {configurable: true, enumerable: false, get: function() { return this[cache_index] }});
                              return this[cache_index];
                           }
                           if (!index) { CACHEDBG("cache miss "+cache_index); }
                        }
                        var t;
                        // this.elements.subarray (which can be reentrant)
                        // didn't work as reliably as new Float32Array(.buffer,...)
                        var v = new vec(
                           t = GLM.$subarray(this.elements, _index, _index + vec_length)
                        );
                        if(!(v.elements === t)) throw new GLM.GLMJSError("v.elements !== t "+[GLM.$subarray, v.elements.constructor=== t.constructor, v.elements.buffer === t.buffer])
                        //if(!(v.elements === t)) throw new GLM.GLMJSError("v.elements !== t");
                        if (cache_prefix) {
                           // defineProperty to mask from enumeration
                           Object.defineProperty(
                              this, cache_index,
                              {
                                 configurable: true,
                                 enumerable: false,
                                 value: v
                              });
                        }
                        return v;//this[cache_index];
                     }
                   });
           })(i);
       }
    };//GLM.$partition
    GLM.$partition(GLM.mat4.prototype, GLM.vec4, 4, '_cache_');
    GLM.$partition(GLM.mat3.prototype, GLM.vec3, 3, '_cache_');
 })(); //indexers and swizzlers

GLM.$dumpTypes = function(out) {
   GLM.$types.forEach(
      function(p) {
         if (GLM[p].componentLength) {
            out("GLM."+p, JSON.stringify(
                   {
                      '#type': GLM[p].prototype.$type_name,
                      '#floats': GLM[p].componentLength,
                      '#bytes': GLM[p].BYTES_PER_ELEMENT
                   }));
         }
      });
};

GLM.$init = function(hints) {
   if (hints.prefix)
      GLMJS_PREFIX = hints.prefix;

   GLM.$prefix = GLMJS_PREFIX;

   var DBG = hints.log || function() {};

   try { DBG("GLM-js: ENV: "+_ENV._VERSION); } catch(e) {}

   DBG("GLM-JS: initializing: "+JSON.stringify(hints,0,2));
   DBG(JSON.stringify({'functions':Object.keys(GLM.$outer.functions)}));

    //GLM.$outer.vec3_eulerAngles = GLM.$outer.vec3_eulerAngles || GLM.$outer._vec3_eulerAngles;
    //GLM.eulerAngles = GLM.$outer.vec3_eulerAngles.bind(GLM.$outer);
    GLM.toMat4 = (function(mat4, outer) { return function toMat4(q) { return new mat4(outer.mat4_array_from_quat(q)); } })(GLM.mat4, GLM.$outer);

    GLM.$template.extend(GLM.rotation.$template, {
        $quat: GLM.quat,
        $dot: GLM.dot.link('vec3,vec3'),
        $epsilon: GLM.epsilon(),
        $m: GLM.mat3(),
        $pi: GLM.pi(),
        $length2: GLM.length2.link('vec3'),
        $cross: GLM.cross.link('vec3,vec3'),
        $normalize: GLM.normalize.link('vec3'),
        $angleAxis: GLM.angleAxis.link('float,vec3'),
        $sqrt: GLM.sqrt
    });

   // augmented metadata
   GLM.$symbols = [];
   for(var p in GLM) {
      if (typeof GLM[p] === 'function') {
         if (/^[a-z]/.test(p)) // for glm.using_namespace and other metaprog
            GLM.$symbols.push(p);
      }
   }

   GLM.$types.forEach(
      function(p) {
         var type = GLM[p].prototype.$type;
         for(var op in GLM.$outer.functions) {
            var theop = GLM.$outer.functions[op];
            if (theop.$op) { // mixin operator-likes
               GLM.$DEBUG && GLM.$outer.console.debug("mapping operator<"+type+"> "+op+" / "+theop.$op);
               GLM[p].prototype[op] = theop; // longform (eg: .mul)
               GLM[p].prototype[theop.$op] = theop; //shortform (eg: ['*'])
            }
         }
      });

   DBG("GLM-JS: "+GLM.version+" emulating "+
       "GLM_VERSION="+GLM.GLM_VERSION+" "+
       "vendor_name="+hints.vendor_name+" "+
       "vendor_version="+hints.vendor_version);
   glm.vendor = hints;
};

// yes, this is doing what you think
// (exporting GLM.$symbols to globals, invoking function, restoring old globals)
// (... currently only used for testing parity with C++ GLM...)
GLM.using_namespace = function(tpl) {
   GLM.$DEBUG && GLM.$outer.console.debug("GLM.using_namespace munges globals; it should probably not be used!");
    GLM.using_namespace.$tmp = {
        ret: undefined,
        tpl: tpl,
        names: GLM.$symbols,
        saved: {},
        evals: [],
        restore: [],
        before: [],
        after: []
    };

    eval(GLM.using_namespace.$tmp.names
         .map(function(x,_) { return "GLM.using_namespace.$tmp.saved['"+x+"'] = GLM.using_namespace.$tmp.before["+_+"] = 'undefined' !== typeof "+x+";" }).join("\n")
        );
   GLM.$DEBUG && console.warn("GLM.using_namespace before #globals: "+GLM.using_namespace.$tmp.before.length);

   GLM.using_namespace.$tmp.names.map(function(x) {
                var cme = "GLM.using_namespace.$tmp.saved['"+x+"']=undefined;"+
                   "delete GLM.using_namespace.$tmp.saved['"+x+"'];";

                //try {
                   GLM.using_namespace.$tmp.restore.push(x+"=GLM.using_namespace.$tmp.saved['"+x+"'];"+cme);
                //} catch(e) {
                //   restore.push(x+"=undefined;delete "+x+";"+cme);
                //}
                GLM.using_namespace.$tmp.evals.push(x+"=GLM."+x+";");
             });
   eval(GLM.using_namespace.$tmp.evals.join("\n"));

   GLM.using_namespace.$tmp.ret = tpl();

   eval(GLM.using_namespace.$tmp.restore.join("\n"));
   eval(GLM.using_namespace.$tmp.names.map(function(x,_) { return "GLM.using_namespace.$tmp.after["+_+"] = 'undefined' !== typeof "+x+";" }).join("\n"));
    GLM.$DEBUG && console.warn("GLM.using_namespace after #globals: "+GLM.using_namespace.$tmp.after.length);
    var ret = GLM.using_namespace.$tmp.ret;
    delete GLM.using_namespace.$tmp;
   // if ((before.length+after.length) !== 0) {
   //    throw new Error(JSON.stringify({before:before,after:after, usn: Object.keys(GLM.using_namespace)}));
   // }
   // if (before.length !== after.length) {
   //    throw new Error(JSON.stringify({before:before,after:after, usn: Object.keys(GLM.using_namespace)}));
   // }
   return ret;
};

function $GLM_extern(func, local) {
   //try { console.debug("extern "+func, local||""); } catch(e){}
   local = local || func;
   return function() {
      GLM[local] = GLM.$outer.functions[func] || GLM.$outer[func];
      if (!GLM[local]) throw new GLM.GLMJSError('$GLM_extern: unresolved external symbol: '+func);
      GLM.$DEBUG && GLM.$outer.console.debug('$GLM_extern: resolved external symbol '+func+' '+typeof GLM[local]);
      return GLM[local].apply(this, arguments);
   };
}

function GLM_polyfills() {
    var filled = {};
    if (!( "bind" in Function.prototype )) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill
        filled.bind = Function.prototype.bind = function(b){
            if(typeof this!=="function"){throw new TypeError("not callable");}
            function c(){}var a=[].slice,f=a.call(arguments,1),e=this,
            d=function(){
                return e.apply(this instanceof c?this:b||global,f.concat(a.call(arguments)));
            };
            c.prototype=this.prototype||c.prototype;d.prototype=new c();return d;};
    }
    return filled;
}

$GLM_reset_logging.current = function() {
   return {
      $GLM_log: typeof $GLM_log !== 'undefined' && $GLM_log,
      $GLM_console_log: typeof $GLM_console_log !== 'undefined' && $GLM_console_log,
      $GLM_console_prefixed: typeof $GLM_console_prefixed !== 'undefined' && $GLM_console_prefixed,
      console: GLM.$outer.console
   };
};

function $GLM_reset_logging(force) {
   if (force && typeof force === 'object') {
      $GLM_log = force.$GLM_log;
      $GLM_console_log = force.$GLM_console_log;
      $GLM_console_factory = force.$GLM_console_factory;
      GLM.$outer.console = force.console;
      force = false; // fall-thru for any missing values
   }
   // support glm.$log being injected for easier testing
   if (force || 'undefined' === typeof $GLM_log)
      $GLM_log = function(x,y) {
         GLM.$outer.console.log.apply(
            GLM.$outer.console,
            [].slice.call(arguments).map(
               function(x){
                  var jstype = typeof x;
                  if (jstype === 'xboolean' || jstype === 'string')
                     return x+'';
                  if (GLM.$isGLMObject(x) || !isNaN(x))
                     return GLM.to_string(x);
                  return x+'';
               })
         );
      };

   // ditto for consolidated console writes
   if (force || 'undefined' === typeof $GLM_console_log) {
      $GLM_console_log = function(prefix, args) {
         (console[prefix]||function(){}).apply(
            console,
            [].slice.call(arguments,1)
         );
      };
   }
   if (force || 'undefined' === typeof $GLM_console_factory) {
      $GLM_console_factory = function(prefix) { return $GLM_console_log.bind($GLM_console_log, prefix); };
   }

   var con = (
      function(factory) {
         var ret = {};
         "debug,warn,info,error,log,write"
         .replace(/\w+/g,
                  function(prop) {
                     ret[prop] = factory(prop);
                  });
         return ret;
      })($GLM_console_factory);
     if ('object' === typeof GLM) {
         if (GLM.$outer)
             GLM.$outer.console = con;
         GLM.$log = $GLM_log;
     }
   return con;
}//$GLM_reset_logging
try{ window.$GLM_reset_logging = this.$GLM_reset_logging = $GLM_reset_logging; }catch(e){}
GLM.$reset_logging = $GLM_reset_logging;
GLM.$log = GLM.$log || $GLM_log;
//http://stackoverflow.com/a/27925672/1684079
function $GLM_GLMJSError(name, init) {
   function E(message) {
      this.name = name;
      this.stack = (new Error()).stack;
      if (Error.captureStackTrace)
         Error.captureStackTrace(this, this.constructor);
      this.message = message;
      init && init.apply(this, arguments);
   }
   E.prototype = new Error();
   E.prototype.name = name;
   E.prototype.constructor = E;
   return E;
}

//try { module.exports = GLM; } catch(e) {}
// ----------------------------------------------------------------------------
// glMatrix GLM math adapter
// copyright(c) 2015 humbletim
// https://github.com/humbletim/glm-js
// MIT LICENSE
// ----------------------------------------------------------------------------

GLMAT.mat4.exists;

glm = GLM;

var DLL = {
   _version: '0.0.2',
   _name: 'glm.gl-matrix.js',
   _glm_version: glm.version,
   prefix: 'glm-js[glMatrix]: ',

   vendor_version: GLMAT.VERSION,
   vendor_name: "glMatrix"
};

DLL['statics'] = {
   $outer: GLM.$outer,
   $typeArray: function(n) { return new this.$outer.Float32Array(n); },
   $mat4: GLM.mat4,
   $quat: GLM.quat,
   $mat4$perspective: GLMAT.mat4.perspective,
   $mat4$ortho: GLMAT.mat4.ortho,
   mat4_perspective: function(fov, aspect, near, far) {
      return new this.$mat4(
         this.$mat4$perspective(this.$typeArray(16), fov, aspect, near, far)
      );
   },
   mat4_ortho: function(left, right, bottom, top, near, far) {
      near = near || -1;
      far = far || 1;
      return new this.$mat4(
         this.$mat4$ortho(this.$typeArray(16), left, right, bottom, top, near, far)
      );
   },
   $quat$setAxisAngle: GLMAT.quat.setAxisAngle,
   $mat4$fromQuat: GLMAT.mat4.fromQuat,
   mat4_angleAxis: function(theta, axis) {
      var Q = this.$quat$setAxisAngle(this.$typeArray(4), axis, theta);
      return new this.$mat4(this.$mat4$fromQuat(this.$typeArray(16), Q));
   },
   quat_angleAxis: function(angle, axis) {
      return new this.$quat(
         this.$quat$setAxisAngle(this.$typeArray(4), axis, angle)
      );
   },
   $mat4$translate: GLMAT.mat4.translate,
   mat4_translation: function(v) {
      var m = new this.$mat4;
      this.$mat4$translate(m.elements, m.elements, v.elements);
      return m;
   },
   $mat4$scale: GLMAT.mat4.scale,
   mat4_scale: function(v) {
      var m = new this.$mat4;
      this.$mat4$scale(m.elements, m.elements, v.elements);
      return m;
   },
   //$mat4$fromQuat: GLMAT.mat4.fromQuat,
   toJSON: function() {
       var ob = {};
       for(var p in this)
           0 !== p.indexOf('$') && (ob[p]=this[p]);
       return ob;
   },
   $vec3: GLM.vec3,
   $clamp: GLM.clamp,
   // vec3_eulerAngles: function(q) {
   //    // adapted from three.js
   //    var te = this.$typeArray(16);
   //    this.$mat4$fromQuat(te, q.elements);
   //    var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
   //    m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
   //    m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

   //    var thiz = new this.$vec3;
   //    thiz.y = Math.asin( - this.$clamp( m31, - 1, 1 ) );

   //    if ( Math.abs( m31 ) < 0.99999 ) {
   //  	 thiz.x = Math.atan2( m32, m33 );
   //  	 thiz.z = Math.atan2( m21, m11 );
   //    } else {
   //  	 thiz.x = 0;
   //  	 thiz.z = Math.atan2( - m12, m22 );
   //    }
   //    return thiz;
   // },
   //$mat4$fromQuat: GLMAT.mat4.fromQuat,
   mat4_array_from_quat: function(q) {
      return this.$mat4$fromQuat(this.$typeArray(16), q.elements);
   },
   $qtmp: new GLM.$outer.Float32Array(9),
   $quat$fromMat3: GLMAT.quat.fromMat3,
   $mat3$fromMat4: GLMAT.mat3.fromMat4,
   quat_array_from_mat4: function(o) {
      return this.$quat$fromMat3(this.$typeArray(4), this.$mat3$fromMat4(this.$qtmp, o.elements));
   }
}; //statics

DLL['declare<T,V,...>'] = {
   'mul': {
      $op: '*',
      $typeArray: function(N) { return new this.GLM.$outer.Float32Array(N); },
      $vec3$transformQuat: GLMAT.vec3.transformQuat,
      'quat,vec3': function(a,b) {
         return new this.GLM.vec3(
            this.$vec3$transformQuat(this.$typeArray(3),
                                     b.elements, a.elements)
         );
      },
      'vec3,quat': function(a,b) { return this['quat,vec3'](this.GLM.inverse(b),a); },
      'quat,vec4': function(a,b) { return this['mat4,vec4'](this.GLM.toMat4(a), b); },
      'vec4,quat': function(a,b) { return this['quat,vec4'](this.GLM.inverse(b),a); },
      '$vec<N>$scale': 'GLMAT.vecN.scale',
      'vec<N>,float': function(a,b) {
          return new this.GLM.vecN(
              this.$vecN$scale(this.$typeArray(N), a.elements, b)
          );
      },
      'quat,float': function(a,b) { return new (a.constructor)(this['vec4,float'](a,b).elements); },
      $vec4$transformMat4: GLMAT.vec4.transformMat4,
      'mat4,vec4': function(a,b) {
         return new GLM.vec4(
            this.$vec4$transformMat4(this.$typeArray(4),
                                     b.elements, a.elements)
         );
      },
      'vec4,mat4': function(a,b) { return this['mat4,vec4'](GLM.inverse(b),a); },
      '$mat<N>mul': 'GLMAT.matN.mul',
      'mat<N>,mat<N>': function(a,b) {
         return new (a.constructor)(
            this.$matNmul(this.$typeArray(N*N),
                           a.elements, b.elements)
         );
      },
      $quat$multiply: GLMAT.quat.multiply,
      'quat,quat': function(a,b) {
         return new (a.constructor)(this.$quat$multiply(
                                this.$typeArray(4),
                                a.elements, b.elements));
      }
   },
   'mul_eq': {
       $op: '*=',
      '$mat<N>$multiply': 'GLMAT.matN.multiply',
      'mat<N>,mat<N>': function(a,b) {
         this.$matN$multiply(a.elements,a.elements,b.elements);
         return a;
      },
      '$vec<N>$scale': 'GLMAT.vecN.scale',
      'vec<N>,float': function(a,b) {
         this.$vecN$scale(a.elements,a.elements,b);
         return a;
      },
      $quat$multiply: GLMAT.quat.multiply,
      'quat,quat': function(a,b) {
         this.$quat$multiply(
            a.elements,
            a.elements, b.elements);
         return a;
      },

      $quat$invert: GLMAT.quat.invert,
      $vec3$transformQuat: GLMAT.vec3.transformQuat,
      // note: v3 *= q; is not supported by GLM C++
      //  but v3['*='](q); seems to perform slightly-better in JS
      //  and can be used as: glm.mul_eq.link('inplace:vec3,quat')(v3,q);
      'inplace:vec3,quat': function(a,b) {
         var Q = this.$quat$invert(new this.GLM.$outer.Float32Array(4), b.elements);
         this.$vec3$transformQuat(a.elements, a.elements, Q);
         return a;
      },

      $mat4$invert: GLMAT.mat4.invert,
      $vec4$transformMat4: GLMAT.vec4.transformMat4,
      'inplace:vec4,mat4': function(a,b) {
         var M = this.$mat4$invert(new this.GLM.$outer.Float32Array(16), b.elements);
         this.$vec4$transformMat4(a.elements, a.elements, M);
         return a;
      }
   },
   cross: {
      $vec2$cross: GLMAT.vec2.cross,
      'vec2,vec2': function(a,b) {
         return new this.GLM.vec3(this.$vec2$cross( new this.GLM.$outer.Float32Array(3), a, b));
      },
      $vec3$cross: GLMAT.vec3.cross,
      'vec3,vec3': function(a,b) {
         return new this.GLM.vec3(this.$vec3$cross( new this.GLM.$outer.Float32Array(3), a, b));
      }
   },
    dot: {
      '$vec<N>$dot': 'GLMAT.vecN.dot',
      'vec<N>,vec<N>': function(a,b) {
         return this.$vecN$dot(a, b);
      }
   },
    lookAt: {
      $mat4$lookAt: GLMAT.mat4.lookAt,
      'vec3,vec3': function(eye,target,up) {
             return new this.GLM.mat4(
	          this.$mat4$lookAt(
	              new this.GLM.$outer.Float32Array(16),
	              eye.elements, target.elements, up.elements
	          ));
      }
   }
}; //operations

DLL['declare<T,V,number>'] = {
    mix: {
      $quat$slerp: GLMAT.quat.slerp,
      "quat,quat": function(a,b,rt) {
         return new GLM.quat(this.$quat$slerp(new GLM.$outer.Float32Array(4), a.elements,b.elements,rt));
      }
   }
}; //function
DLL['declare<T,V,number>'].slerp = DLL['declare<T,V,number>'].mix;

DLL['declare<T>'] = {
    normalize: {
      '$vec<N>normalize': 'GLMAT.vecN.normalize',
       $typeArray: function(N) { return new this.GLM.$outer.Float32Array(N); },
      'vec<N>': function(q) {
          return new this.GLM.vecN(
              this.$vecNnormalize(this.$typeArray(N), q)
          );
      },
      $quat$normalize: GLMAT.quat.normalize,
      quat: function(q) {
         return new this.GLM.quat(
            this.$quat$normalize(new this.GLM.$outer.Float32Array(4), q.elements)
         );
      }
   },
    length: {
      $quat$length: GLMAT.quat.length,
      quat: function(q) {  return this.$quat$length(q.elements); },
      //vec3: function(v) { return GLMAT.vec3.length(v.elements); },
      '$vec<N>$length': 'GLMAT.vecN.length',
      'vec<N>': function(v) { return this.$vecN$length(v.elements); }
   },
    length2: {
      $quat$squaredLength: GLMAT.quat.squaredLength,
      quat: function(q) {  return this.$quat$squaredLength(q.elements); },
      '$vec<N>$squaredLength': 'GLMAT.vecN.squaredLength',
      'vec<N>': function(v) { return this.$vecN$squaredLength(v.elements); }
   },

    inverse: {
      $quatinvert: GLMAT.quat.invert,
      quat: function(q) {
         return this.GLM.quat(
            this.$quatinvert(new this.GLM.$outer.Float32Array(4), q.elements)
         );
      },
      /*xmat4: function(m) {
         return glm.mat4(
            GLMAT.mat4.invert(new GLM.$outer.Float32Array(16), m.elements)
         );
         },*/
      $mat4invert: GLMAT.mat4.invert,
      mat4: function(m) {
         m=m.clone();
	 // what should happen if no determinant?
	 // (note: THREE, tdl-fast and gl-matrix all behave differently)
         if (null === this.$mat4invert(m.elements, m.elements))
	    return m['='](this.GLM.mat4()); // identity
         return m;
      }
   },
   transpose: {
      /*xmat4: function(m) {
         return glm.mat4(
            GLMAT.mat4.transpose(new GLM.$outer.Float32Array(16), m.elements)
         );
         },*/
      $mat4$transpose: GLMAT.mat4.transpose,
      mat4: function(m) {
         m=m.clone();
         this.$mat4$transpose(m.elements, m.elements);
         return m;
      }
   }
}; //calculators

glm.$outer.$import(DLL);

try { module.exports = glm; } catch(e) {}
// ----------------------------------------------------------------------------
// glm.buffers.js - glm-js ArrayBuffer / data views
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

function $GLMVector(typ, sz, typearray) {
   typearray = typearray || GLM.$outer.Float32Array;
   this.typearray = typearray;
   if (!(this instanceof $GLMVector)) throw new GLM.GLMJSError('use new');
   if (!('function' === typeof typ) || !GLM.$isGLMConstructor(typ))
      throw new GLM.GLMJSError('expecting typ to be GLM.$isGLMConstructor: '+
                               [typeof typ, (typ?typ.$type:typ)]+" // "+
                               GLM.$isGLMConstructor(typ));
   if (typ.componentLength === 1 && GLM[typ.prototype.$type.replace("$","$$v")])
      throw new GLM.GLMJSError("unsupported argtype to glm.$vectorType - for single-value types use glm."+typ.prototype.$type.replace("$","$$v")+"..."+typ.prototype.$type);
   this.glmtype = typ;
   if (!this.glmtype.componentLength) throw new Error('need .componentLength '+[typ, sz, typearray]);
   this.componentLength = this.glmtype.componentLength;
   this.BYTES_PER_ELEMENT = this.glmtype.BYTES_PER_ELEMENT;

   this._set_$elements = function _set_$elements(elements) {
      Object.defineProperty(this, '$elements', { enumerable: false, configurable: true, value: elements });
      return this.$elements;
   };

   Object.defineProperty(
      this, 'elements',
      { enumerable: true,
        configurable: true,
        get: function() { return this.$elements; },
        set: function(elements) {
           if (this._kv && !this._kv.dynamic)
              GLM.$DEBUG && GLM.$outer.console.warn("WARNING: setting .elements on frozen (non-dynamic) GLMVector...");
           if (!elements) {
              this.length = this.byteLength = 0;
           } else {
              var oldlength = this.length;
              this.length = elements.length / this.componentLength;
              this.byteLength = this.length * this.BYTES_PER_ELEMENT;
              if (this.length !== Math.round(this.length))
                 throw new GLM.GLMJSError(
                    '$vectorType.length alignment mismatch '+
                       JSON.stringify(
                          {componentLength:this.componentLength,
                           length:this.length,
                           rounded_length:Math.round(this.length),
                           elements_length: elements.length,
                           old_length: oldlength
                          }));
           }
           return this._set_$elements(elements);
        }
      });

   this.elements = sz && new typearray(sz * typ.componentLength);

}

GLM.$vectorType = $GLMVector;
GLM.$vectorType.version = '0.0.2';

$GLMVector.prototype = GLM.$template.extend(
   new GLM.$GLMBaseType($GLMVector, '$vectorType'),
   {
      toString: function() {
         return "[$GLMVector .elements=#"+(this.elements&&this.elements.length)+
            " .elements[0]="+(this.elements&&this.elements[0])+
            " ->[0]"+(this['->']&&this['->'][0])+"]";
      },
      '=': function(elements) {
         if (elements instanceof this.constructor || glm.$isGLMObject(elements))
            elements = elements.elements;
         return this._set(new this.typearray(elements)); // makes a copy
      },
      _typed_concat: function(a,b,out) {
         var n = a.length + b.length;
         out = out || new a.constructor(n);
         out.set(a);
         out.set(b, a.length);
         return out;
      },
      '+': function(elements) {
         if (elements instanceof this.constructor || glm.$isGLMObject(elements))
            elements = elements.elements;
         return new this.constructor(this._typed_concat(this.elements, elements));
      },
      '+=': function(elements) {
         if (elements instanceof this.constructor || glm.$isGLMObject(elements))
            elements = elements.elements;
         return this._set(this._typed_concat(this.elements, elements));
      },
      _set: function(elements) {
         if (elements instanceof this.constructor)
            elements = new this.typearray(elements.elements);
         if (!(elements instanceof this.typearray))
            throw new GLM.GLMJSError("unsupported argtype to $GLMVector._set "+(elements&&elements.constructor));
         GLM.$DEBUG && GLM.$outer.console.debug("$GLMVector.prototype.set..." +
                      'this.elements:'+[this.elements&&this.elements.constructor.name,
                       this.elements&&this.elements.length]+
                      'elements:'+[elements.constructor.name,
                       elements.length]);
         var _kv = this._kv;
         this._kv = undefined;
         this.elements = elements;
         if (this.elements !== elements)
            throw new GLM.GLMJSError("err with .elements: "+ [this.glmtype.prototype.$type, this.elements,elements]);
         if (_kv)
            this._setup(_kv);
         return this;
      },
      arrayize: function(bSetters,bDynamic) {
         return this._setup({
                               //stride: this.glmtype.BYTES_PER_ELEMENT,
                               //offset: ele.byteOffset,
                               //ele: this.elements,
                               //container: [],
                               dynamic: bDynamic,
                               setters: bSetters
                            }, this.length);
      },
      $destroy: function(arr) {
         if (arr) {
            var isArray = Array.isArray(arr);
            function _destroy(i) {
               Object.defineProperty(arr, i, { enumerable: true, configurable: true, value: undefined });
               delete arr[i];
               if (!isArray) {
                  arr[i] = undefined; // dbl check... fires error if still prop-set
                  delete arr[i];
               }
            }
            for(var i=0;i < arr.length; i++) {
               if (i in arr)
                  _destroy(i);
            }
            while(i in arr) {
               GLM.$DEBUG && GLM.$outer.console.debug("$destroy", this.name, i);
               _destroy(i++);
            }
            if (isArray)
               arr.length = 0;
         }
      },
      _arrlike_toJSON: function() { return this.slice(0); },
      _mixinArray: function(arr) {
         arr.toJSON = this._arrlike_toJSON;
         "forEach,map,slice,filter,join,reduce".split(",")
            .forEach(function(k) { arr[k] = Array.prototype[k]; });
         return arr;
      },
      _setup: function(kv, oldlen) {
         var vec = this.glmtype;
         var typearray = this.typearray;
         var n = this.length;
         this._kv = kv;
         var stride = kv.stride || this.glmtype.BYTES_PER_ELEMENT,
         offset = kv.offset || this.elements.byteOffset,
         ele = kv.elements || this.elements,
         container = kv.container || this.arr || [],
         bSetters = kv.setters || false,
         dynamic = kv.dynamic || false;

         if (container === 'self')
            container = this;
         //console.warn("ele",typeof ele,ele, this.componentLength);

         if (!ele)
            throw new GLMJSError("GLMVector._setup - neither kv.elements nor this.elements...");

         this.$destroy(this.arr, oldlen);
         // cleanup
         var arr = this.arr = this['->'] = container;

         // add convenience methods to pseudo-Array containers
         if (!Array.isArray(arr)) {
            this._mixinArray(arr);
         }

         var cl = this.componentLength;
         if (!cl) throw new GLM.GLMJSError("no componentLength!?"+Object.keys(this));
         var last = ele.buffer.byteLength;
         var thiz = this;
         for(var i=0; i < n; i++) {
            var off = offset + i*stride;
            var next = off + this.glmtype.BYTES_PER_ELEMENT;//offset + (i+1)*stride;
            function dbg() {
               kv.i = i; kv.next = next; kv.last = last; kv.offset = kv.offset || offset; kv.stride = kv.stride || stride;
               return JSON.stringify(kv);//{i:i, eleO: ele.byteOffset, stride: stride, offset:offset, next:next, last:last});
            }
            if (off > last)
               throw new Error('['+i+'] off '+off+' > last '+last+' '+dbg());
            if (next > last)
               throw new Error('['+i+'] next '+next+' > last '+last+' '+dbg());

            arr[i] = null;
            var make_ti = function(ele,off) {
               ///if (!ele) { throw new Error('!ele ' + (+new Date())); onmessage({stop:1}); }
               var ret = new vec(new typearray(ele.buffer,off,cl));
               if (dynamic) // for detecting underlying .elements changes..
               Object.defineProperty(ret, '$elements', { value: ele });
               return ret;
            };
            var ti = make_ti(ele,off);

            if (!bSetters && !dynamic) {
               // read-only array elements
               arr[i] = ti;
            } else {
               // update-able array elements
               (function(ti,i,off) {
                   Object.defineProperty(
                      arr, i,
                      {
                         enumerable: true,
                         configurable: true,
                         get: dynamic ?
                            function() {
                               if (ti.$elements !== thiz.elements) {
                                  GLM.$log("dynoget rebinding ti",i,off,ti.$elements === thiz.elements);
                                  ti = make_ti(thiz.elements,off);
                               }
                               return ti;
                            } :
                            function() { return ti; },
                         set: bSetters && (
                            dynamic ?
                               function(v) {
                                  GLM.$log("dynoset",i,off,ti.$elements === thiz.elements);
                                  if (ti.$elements !== thiz.elements) {
                                     GLM.$log("dynoset rebinding ti",i,off,ti.$elements === thiz.elements);
                                     ti = make_ti(thiz.elements,off);
                                  }
                                  return ti.copy(v);
                               } :
                               function(v,_) {
                                  //console.warn("setter" + JSON.stringify({i:i,ti:ti,v:v},0,2));
                                  return ti.copy(v);
                               }) || undefined
                      });
                })(ti,i,off);
            }
         }
         return this;
      },
      // DATA is arg is a set of [typearray(),typearray()] buffers (eg: socket.io buffers)
      setFromBuffers: function(DATA) {
         var fa = this.elements;
         var off = 0;
         var fl = fa.length;
         DATA.forEach(
            function(seg) {
               var sl = seg.length;
               if (off+sl > fa.length) {
                  var mseg = Math.min(
                     fa.length - off,
                     seg.length);
                  if (mseg <= 0) {
                     return;
                  } else {
                     seg = glm.$subarray(seg,0,mseg);
                     sl = seg.length;
                  }
               }

               if (off+sl > fa.length)
                  throw new glm.GLMJSError('$vectorType.fromBuffers mismatch '+[off,sl,fa.length]);

               fa.set(seg,off);
               off += seg.length;
            });
         return off;
      },
      setFromPointer: function(ptr) {
         if(!(ptr instanceof GLM.$outer.ArrayBuffer))
            throw new glm.GLMJSError("unsupported argtype "+[typeof ptr]+" - $GLMVector.setFromPointer");
         return this._set(new this.typearray(ptr));
      }
   });

// Object.defineProperty(
//     $GLMVector.prototype, 'base64',
//     {
//         get: function() {
//             return GLM.$to_base64(this);
//         },
//         set: function(a) {
//             return this.elements.set(new this.typearray(GLM.$b64.decode(a)));
//         }
//     });



// ----------------------------------------------------------------------------
// glm.experimental.js - glm-js experimental stuff
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

GLM.exists;
GLM.$vectorType.exists;

if (GLM.$toTypedArray) throw "error: glm.experimental.js double-included";

// coerces elementSource into the specified arrayType:
//   arrayType<typedarray constructor>,
//   elementSource<glm-object|typedarray|arraybuffer|array|number*<componentLength>>,
//   componentLength<number> (only needed if elementSource is also a number)
GLM.$toTypedArray = function(arrayType, elementSource, componentLength) {
   var sz = elementSource || 0;
   var sztype = typeof sz;

   if (sztype === 'number') {
      if (typeof componentLength !== 'number')
         throw new GLM.GLMJSError("GLM.$toTypedArray: unsupported argtype for componentLength ("+typeof componentLength+")");
      return new arrayType(sz * componentLength);
   }
   if (sztype !== 'object')
      throw new GLM.GLMJSError("GLM.$toTypedArray: unsupported arrayType: "+[typeof arrayType, arrayType]);

   if (sz instanceof arrayType)
      return sz;

   if (sz instanceof GLM.$outer.ArrayBuffer || Array.isArray(sz))
      return new arrayType(sz);

   if (GLM.$isGLMObject(sz)) {
      var ref = sz.elements;
      sz = new arrayType(ref.length);
      sz.set(ref);
      //if (arrayType === Float32Array)
      //   return sz;
      // ... otherwise, fall-thru since may require manual coercion
   }

   if (!(sz instanceof arrayType)) {
      if ("byteOffset" in sz && "buffer" in sz) {
         GLM.$DEBUG && GLM.$outer.console.warn(
            "coercing "+sz.constructor.name+".buffer into "+
               [arrayType.name, sz.byteOffset, sz.byteLength+" bytes",
                "~"+(sz.byteLength / arrayType.BYTES_PER_ELEMENT)+" coerced elements"
               ]+"...", { byteOffset: sz.byteOffset, byteLength: sz.byteLength,
                          ecount: sz.byteLength / arrayType.BYTES_PER_ELEMENT });
         return new arrayType(sz.buffer,
                              sz.byteOffset,
                              sz.byteLength / arrayType.BYTES_PER_ELEMENT);
      }
   }

   if (sz instanceof arrayType)
      return sz;
   throw new GLM.GLMJSError("GLM.$toTypedArray: unsupported argtype initializers: "+[arrayType, elementSource, componentLength]);
};

//GLM.$DEBUG = 1;
GLM.$make_primitive = function(type, typearray) {
   GLM[type] = function(v) {
      if (!(this instanceof GLM[type]))
         return new GLM[type](v);
      if (typeof v !== 'object') v = [v];
      this.elements = GLM.$toTypedArray(typearray, v, 1);
   };
   /*TRACING*/ GLM[type] = eval(GLM.$template._traceable("glm_"+type+"$class", GLM[type]))();

   GLM.$template._add_overrides(
      type,
      {
         $to_string: function(v) { return v.$type.replace(/[^a-z]/g,'')+'('+v.elements[0]+')';  },
         $to_object: function(v) { return v.elements[0]; },
         $to_glsl: function(v) { return v.$type.replace(/[^a-z]/g,'')+'('+v.elements[0]+')';  }
      }
   );

   GLM.$template._add_overrides(
      type.substr(1),  // $float => float
      {
         $to_string: !(type.substr(1) in GLM.$to_string.$template) && function(v) { return v.$type.replace(/[^a-z]/g,'')+'('+v.elements[0]+')';  },
         $to_object: function(v) { return v; },
         $to_glsl: function(v) { return v.$type.replace(/[^a-z]/g,'')+'('+v+')';  }

      }
   );

   GLM.$template.extend(
      GLM[type],
      {
         componentLength: 1,
         BYTES_PER_ELEMENT: typearray.BYTES_PER_ELEMENT,
         prototype: GLM.$template.extend(
            new GLM.$GLMBaseType(GLM[type], type),
            {
               copy: function(v) {
                  this.elements.set(GLM.$isGLMObject(v) ? v.elements : [v]);
                  return this;
               },
               valueOf: function() {
                  return this.elements[0];
               }
            })
      });
   GLM[type].prototype['='] = GLM[type].prototype.copy;

   return GLM[type];
};

GLM.$make_primitive("$bool", GLM.$outer.Int32Array);
GLM.$template._add_overrides('$bool', {
    $to_object: function(v) { return !!v; }
});
//GLM.$template.jstypes['$boolean'] = 'float'; // internal representation
GLM.$make_primitive("$int32", GLM.$outer.Int32Array);
GLM.$make_primitive("$uint32", GLM.$outer.Uint32Array);
GLM.$make_primitive("$uint16", GLM.$outer.Uint16Array);
GLM.$make_primitive("$uint8", GLM.$outer.Uint8Array);
GLM.$float32 = GLM.$make_primitive("$float", GLM.$outer.Float32Array);

GLM.$make_primitive_vector = function(type, glmtype, typearray) {
   typearray = typearray || new glmtype().elements.constructor;
   var $class = function(sz) {
      if (!(this instanceof $class))
         return new $class(sz);
      this.$type = type;
      //this.componentLength = glmtype.componentLength;
      this.$type_name = 'vector<'+type+'>';
      var ele = GLM.$toTypedArray(typearray, sz, glmtype.componentLength);
      if (ele)
         this._set(ele);
   };
   /*TRACING*/ $class = eval(GLM.$template._traceable("glm_"+type+"$class", $class))();

   $class.prototype = new GLM.$vectorType(glmtype, 0, typearray);

   GLM.$template._add_overrides(
      type,
      {
         $to_string: function(what) { return "[GLM."+what.$type+" elements[0]="+(what.elements&&what.elements[0])+"]"; },
         $to_object: function(v) { return v.map(GLM.$to_object);  },
         $to_glsl: function(v,name) {
            // eg: glm.$vvec4(4) ==> 'vec4 example[4];example[0]=vec4(...);example[1]=vec4(...);...'
            var t = v.$type.substr(2).replace(/[^a-z]/g,'');
            name=typeof name === 'string' ? name : 'example';
            var def = [];
            if (name)
               def.push(t+' '+name+'['+v.length+']');
            return def.concat(
               v.map(function(vv,_) {
                        return name+'['+_+'] = '+vv;
                     })).join(";")+";";
         }
      }
   );

   GLM.$types.push(type);

   GLM.$template.extend(
      $class.prototype,
      {
         $type: type,
         constructor: $class,
         _setup: function() { throw new GLM.GLMJSError("._setup not available on primitive vectors yet..."); },
         _set: function(e) {
            //Object.defineProperty(this, 'elements', { configurable: true, value: e });//GLM.$toTypedArray(this.typearray, e, this.glmtype.componentLength);
            this.elements = e;
            this.length = !this.elements ? 0 : (this.elements.length / this.glmtype.componentLength);
            //if (this.length)
            this.arrayize();
            return this;
         },

         arrayize: function() {
            var elements = this.elements;
            var sprop = Object.defineProperty.bind(Object, this);
            for(var i=0; i < this.length; i++) {
               (function(_) {
                   sprop(_,
                         {
                            configurable: true,
                            enumerable: true,
                            get: function() {
                               return this.elements[_];
                            },
                            set: function(v) {
                               return this.elements[_] = v;
                            }
                         });
                })(i);
            }
//             "forEach,map,slice,filter,join,reduce".split(",").forEach(
//                function(k) { this[k] = Array.prototype[k]; }.bind(this));
            return this._mixinArray(this)
         },
         toString: function() {
            return "[vector<"+type+"> {"+[].slice.call(this.elements,0,5)+(this.elements.length > 5?",...":"")+"}]";
         }
      });

   return $class;
};

GLM.$vint32 = GLM.$make_primitive_vector('$vint32', GLM.$int32);
GLM.$vfloat = //GLM.$make_primitive_vector('$vfloat', GLM.$float);
GLM.$vfloat32 = GLM.$make_primitive_vector('$vfloat32', GLM.$float32);
GLM.$vuint8 = GLM.$make_primitive_vector('$vuint8', GLM.$uint8);
GLM.$vuint16 = GLM.$make_primitive_vector('$vuint16', GLM.$uint16);
GLM.$vuint32 = GLM.$make_primitive_vector('$vuint32', GLM.$uint32);

GLM.$make_componentized_vector = function(type, glmtype, typearray) {
   typearray = typearray || new glmtype().elements.constructor;
   var $class = function(_sz, dynamic) {
      if (!(this instanceof $class))
         return new $class(_sz, dynamic);
      this._set(
         GLM.$toTypedArray(typearray, _sz, glmtype.componentLength)
      );
      if (!this.elements) throw new GLM.GLMJSError("!this.elements: " + [GLM.$toTypedArray(typearray, _sz, glmtype.componentLength)]);
      this._setup({
                     setters: true,
                     dynamic: dynamic,
                     container: 'self'
                  });
   };
   /*TRACING*/ $class = eval(GLM.$template._traceable("glm_"+type+"$class", $class))();

   $class.prototype = new GLM.$vectorType(glmtype, 0, typearray);

   GLM.$template._add_overrides(
      type,
      {
         $to_string: function(what) { return "[GLM."+what.$type+" elements[0]="+(what.elements&&what.elements[0])+"]"; },
         $to_object: function(v) { return v.map(GLM.$to_object);  },
//         $to_glsl: function(v) { return type.substr(2)+'['+v.length+']('+v.map(GLM.$to_glsl)+')'; }
//         $to_glsl: function(v) { return v.map(GLM.$to_glsl);  }
         $to_glsl: function(v,name) {
            var t = v.$type.substr(2);
            name=typeof name === 'string' ? name : 'example';
            var def = [];
            if (name)
               def.push(t+' '+name+'['+v.length+']');
            return def.concat(
               v.map(GLM.$to_glsl)
                  .map(function(vv,_) {
                          return name+'['+_+'] = '+vv;
                       })).join(";\n ")+";";
         }
      }
    );

   GLM.$types.push(type);

   GLM.$template.extend($class.prototype,
                        {
                           $type: type,
                           constructor: $class
                        });
   if (!$class.prototype.componentLength) alert('!cmop '+p);
   return $class;
};

(function(){
    var $makers = GLM.$template.deNify(
       {
          '$vvec<N>': function() {
             return GLM.$make_componentized_vector("$vvecN", GLM.vecN);
          },
          '$vuvec<N>': function() {
             return GLM.$make_componentized_vector("$vuvecN", GLM.uvecN);
          },
          '$vmat<N>': function(_sz) {
             return GLM.$make_componentized_vector("$vmatN", GLM.matN);
          },
          '$vquat': function() {
             return GLM.$make_componentized_vector("$vquat", GLM.quat);
          }
       }, '$v');
    for(var p in $makers) {
       GLM[p] = $makers[p]();
    }
 })();

// base64 helpers/polyfills
(GLM._redefine_base64_helpers = function define_base64_helpers(atob, btoa) {
    atob = define_base64_helpers.atob = atob || define_base64_helpers.atob || $atob;
    btoa = define_base64_helpers.btoa = btoa || define_base64_helpers.btoa || $btoa;
    var UINT = GLM.$outer.Uint8Array;
    var AB = GLM.$outer.ArrayBuffer;
    var $b64 = (function(d){
        var D=d.indexOf.bind(d);
        function encode(b,off,len){b=new UINT(b,off,len);var a,e=b.length,c="";for(a=0;a<e;a+=3)c+=d[b[a]>>2],c+=d[(b[a]&3)<<4|b[a+1]>>4],c+=d[(b[a+1]&15)<<2|b[a+2]>>6],c+=d[b[a+2]&63];2===e%3?c=c.substring(0,c.length-1)+"=":1===e%3&&(c=c.substring(0,c.length-2)+"==");return c}
        function decode(b){b=trim(b);var _=b.length,a=0.75*_,e=_,c=0,i,f,g,j;"="===b[_-1]&&(a--,"="===b[_-2]&&a--);for(var k=new AB(a),h=new UINT(k),a=0;a<e;a+=4)i=D(b[a]),f=D(b[a+1]),g=D(b[a+2]),j=D(b[a+3]),h[c++]=i<<2|f>>4,h[c++]=(f&15)<<4|g>>2,h[c++]=(g&3)<<6|j&63;return k}
        return { encode: encode, decode: decode };
    })("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
    function trim(s) { return (s+'').replace(/\s/g,''); }
    function toCharCodes(str) {
        return new UINT(str.split('').map(function(x){return x.charCodeAt(0)}));
    }
    function fromCharCodes(arr) {
        if (!(arr instanceof UINT))
            arr = new UINT(arr);
        return [].map.call(arr, function(ch) { return String.fromCharCode(ch); }).join('');
    }
    function $btoa(str) {
        var buffer = str instanceof AB ? str : toCharCodes(str).buffer;
        return GLM.$b64.encode(buffer, buffer.byteOffset, buffer.byteLength);
    };
    function $atob(str) {
        var ret = new String(fromCharCodes(GLM.$b64.decode(str)));
        ret.array = toCharCodes(ret);
        ret.buffer = ret.array.buffer;
        return ret;
    };
    GLM.$template.extend(
        $b64, {
            trim: trim, atob: atob, btoa: btoa, $atob: $atob, $btoa: $btoa,
            toCharCodes: toCharCodes, fromCharCodes: fromCharCodes,
            b64_to_utf8: function(s){return decodeURIComponent(escape(atob(trim(s))));},
            utf8_to_b64: function(s){return btoa(unescape(encodeURIComponent(s)));}
        });

    GLM.$template.extend(GLM, {
        $b64: $b64,
        $to_base64: function $to_base64(v) {
            return GLM.$b64.encode(
                v.elements.buffer,
                v.elements.byteOffset,
                v.elements.byteLength
            );
        },
        $from_base64: function $from_base64(a, returnType) {
            var buffer = GLM.$b64.decode(a);
            if (returnType === true || returnType == GLM.$outer.ArrayBuffer)
                return buffer;
            else {
                if (returnType === undefined)
                    returnType = GLM.$outer.Float32Array;
                return new returnType(buffer);
            }
            throw new GLM.GLMJSError("TODO: $from_base64 not yet supported second argument type: ("+[typeof returnType, returnType]+")");
        }
    });
})(typeof atob === 'function' && atob.bind(this), typeof btoa === 'function' && btoa.bind(this));

// experimental support for transcoding swizzles:
//  .array <=> <Array-encoded representation>
//  .base64 <=> <base64-encoded representation>
//  .buffer <=> <ArrayBuffer representation> (note: .elements is already Float32Array representation)
//  .object <=> <POJS (Object) representation>
//  .json <=> <JSON-encoded representation>
//  .glsl <=> <GLSL-encoded representation>
(function define_transcoding_swizzles() {
    function mkdprop(serializer, parser) {
        return {
            get: function() { return serializer.call(this); },
            set: function(nv) {
                if (this.copy)
                    return this.copy(new this.constructor(parser.call(this, nv)));
                this.elements.set(parser.call(this, nv));
            }
        };
    }
    "$bool,$float32,$vfloat32,$vuint8,$vuint16,$vuint32,$vvec2,$vvec3,$vvec4,$vmat3,$vmat4,$vquat,vec2,vec3,vec4,mat3,mat4,uvec2,uvec3,uvec4,ivec2,ivec3,ivec4,bvec2,bvec3,bvec4,quat".split(",")
       .map(GLM.$getGLMType)
       .forEach(
          function(o) {
              Object.defineProperty(o.prototype, 'array', mkdprop(
                  function() { return GLM.$to_array(this); },
                  function(nv) { return nv; } //copy(this.constructor(nv)); }
              ));
              Object.defineProperty(o.prototype, 'base64', mkdprop(
                  function() { return GLM.$to_base64(this); },
                  function(nv) { return GLM.$from_base64(nv, this.elements.constructor); }
              ));
              Object.defineProperty(o.prototype, 'buffer', mkdprop(
                  function() { return this.elements.buffer; },
                  function(nv) { return new this.elements.constructor(nv); }
              ));
              Object.defineProperty(o.prototype, 'json', mkdprop(
                  function() { return GLM.$to_json(this); },
                  function(nv) { return JSON.parse(nv); }
              ));
              Object.defineProperty(o.prototype, 'object', mkdprop(
                  function() { return GLM.$to_object(this); },
                  function(nv) { return nv; }
              ));
              Object.defineProperty(o.prototype, 'glsl', mkdprop(
                  function() { return GLM.$to_glsl(this); },
                  function(nv) { return GLM.$from_glsl(nv, /*GLM.$outer.*/Array); }
              ));
          });
 })();

module.exports = glm;
