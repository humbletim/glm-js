/*! glm-js built 2025-11-04 03:08:50+00:00 | (c) humbletim | http://humbletim.github.io/glm-js */
/** @preserve
 * --------------------------------------------------------------------------
 * tdl-fast | (c) Google Inc. | https://github.com/greggman/tdl
 * --------------------------------------------------------------------------
*/

/** @license
 * Copyright 2009, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
// NOTE: this is a consolidated version of tdl-fast (which combines it with other pieces of tdl for use as glm-js backend)

/*
 * Copyright 2009, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


/**
 * @fileoverview This file contains matrix/vector math functions.
 */
// define(['./base-rs'], function(BaseRS) {

// tdl.provide('tdl.fast');
tdl = {};

/**
 * A module for math for tdl.fast.
 * @namespace
 */
tdl.fast = tdl.fast || {};

// if (!window.Float32Array) {
//   // This just makes some errors go away when there is no WebGL.
//   window.Float32Array = function() { };
// }

tdl.fast.temp0v3_ = new Float32Array(3);
tdl.fast.temp1v3_ = new Float32Array(3);
tdl.fast.temp2v3_ = new Float32Array(3);

tdl.fast.temp0v4_ = new Float32Array(4);
tdl.fast.temp1v4_ = new Float32Array(4);
tdl.fast.temp2v4_ = new Float32Array(4);

tdl.fast.temp0m4_ = new Float32Array(16);
tdl.fast.temp1m4_ = new Float32Array(16);
tdl.fast.temp2m4_ = new Float32Array(16);

/**
 * Functions which deal with 4-by-4 transformation matrices are kept in their
 * own namespsace.
 * @namespace
 */
tdl.fast.matrix4 = tdl.fast.matrix4 || {};

/**
 * Functions that are specifically row major are kept in their own namespace.
 * @namespace
 */
tdl.fast.rowMajor = tdl.fast.rowMajor || {};

/**
 * Functions that are specifically column major are kept in their own namespace.
 * @namespace
 */
tdl.fast.columnMajor = tdl.fast.columnMajor || {};

/**
 * An Array of 2 floats
 * @typedef {Float32Array} tdl.fast.Vector2
 */

/**
 * An Array of 3 floats
 * @typedef {Float32Array} tdl.fast.Vector3
 */

/**
 * An Array of 4 floats
 * @typedef {Float32Array} tdl.fast.Vector4
 */

/**
 * An Array of floats.
 * @typedef {Float32Array} tdl.fast.Vector
 */

/**
 * A 2x2 Matrix of floats
 * @typedef {Float32Array} tdl.fast.Matrix2
 */

/**
 * A 3x3 Matrix of floats
 * @typedef {Float32Array} tdl.fast.Matrix3
 */

/**
 * A 4x4 Matrix of floats
 * @typedef {Float32Array} tdl.fast.Matrix4
 */

/**
 * A arbitrary size Matrix of floats
 * @typedef {Array<Number[]>} tdl.fast.Matrix
 */

/**
 * Adds two vectors; assumes a and b have the same dimension.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Vector} a Operand vector.
 * @param {tdl.fast.Vector} b Operand vector.
 */
tdl.fast.addVector = function(dst, a, b) {
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    dst[i] = a[i] + b[i];
  return dst;
};

/**
 * Subtracts two vectors.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Vector} a Operand vector.
 * @param {tdl.fast.Vector} b Operand vector.
 */
tdl.fast.subVector = function(dst, a, b) {
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    dst[i] = a[i] - b[i];
  return dst;
};

/**
 * Performs linear interpolation on two vectors.
 * Given vectors a and b and interpolation coefficient t, returns
 * (1 - t) * a + t * b.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Vector} a Operand vector.
 * @param {tdl.fast.Vector} b Operand vector.
 * @param {number} t Interpolation coefficient.
 */
tdl.fast.lerpVector = function(dst, a, b, t) {
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    dst[i] = (1 - t) * a[i] + t * b[i];
  return dst;
};

/**
 * Divides a vector by a scalar.
 * @param {tdl.fast.Vector} dst The vector.
 * @param {tdl.fast.Vector} v The vector.
 * @param {number} k The scalar.
 * @return {tdl.fast.Vector} dst.
 */
tdl.fast.divVectorScalar = function(dst, v, k) {
  var vLength = v.length;
  for (var i = 0; i < vLength; ++i)
    dst[i] = v[i] / k;
  return dst;
};

/**
 * Computes the cross product of two vectors; assumes both vectors have
 * three entries.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Vector} a Operand vector.
 * @param {tdl.fast.Vector} b Operand vector.
 * @return {tdl.fast.Vector} The vector a cross b.
 */
tdl.fast.cross = function(dst, a, b) {
  dst[0] = a[1] * b[2] - a[2] * b[1];
  dst[1] = a[2] * b[0] - a[0] * b[2];
  dst[2] = a[0] * b[1] - a[1] * b[0];
  return dst;
};

/**
 * Computes the dot product of two vectors; assumes both vectors have
 * three entries.
 * @param {tdl.fast.Vector} a Operand vector.
 * @param {tdl.fast.Vector} b Operand vector.
 * @return {number} dot product
 */
tdl.fast.dot = function(a, b) {
  return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
};

/**
 * Divides a vector by its Euclidean length and returns the quotient.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Vector} a The vector.
 * @return {tdl.fast.Vector} The normalized vector.
 */
tdl.fast.normalize = function(dst, a) {
  var n = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    n += a[i] * a[i];
  n = Math.sqrt(n);
  if (n > 0.00001) {
    for (var i = 0; i < aLength; ++i)
      dst[i] = a[i] / n;
  } else {
    for (var i = 0; i < aLength; ++i)
      dst[i] = 0;
  }
  return dst;
};

/**
 * Negates a vector.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Vector} v The vector.
 * @return {tdl.fast.Vector} -v.
 */
tdl.fast.negativeVector = function(dst, v) {
 var vLength = v.length;
 for (var i = 0; i < vLength; ++i) {
   dst[i] = -v[i];
 }
 return dst;
};

/**
 * Negates a matrix.
 * @param {tdl.fast.Matrix} dst matrix.
 * @param {tdl.fast.Matrix} v The matrix.
 * @return {tdl.fast.Matrix} -v.
 */
tdl.fast.negativeMatrix = function(dst, v) {
  var vLength = v.length;
  for (var i = 0; i < vLength; ++i) {
    dst[i] = -v[i];
  }
  return dst;
};

/**
 * Copies a vector.
 * @param {tdl.fast.Vector} v The vector.
 * @return {tdl.fast.Vector} A copy of v.
 */
tdl.fast.copyVector = function(dst, v) {
  dst.set(v);
  return dst;
};

/**
 * Copies a matrix.
 * @param {tdl.fast.Matrix} m The matrix.
 * @return {tdl.fast.Matrix} A copy of m.
 */
tdl.fast.copyMatrix = function(dst, m) {
  dst.set(m);
  return dst;
};

/**
 * Multiplies a scalar by a vector.
 * @param {tdl.fast.Vector} dst vector.
 * @param {number} k The scalar.
 * @param {tdl.fast.Vector} v The vector.
 * @return {tdl.fast.Vector} The product of k and v.
 */
tdl.fast.mulScalarVector = function(dst, k, v) {
  var vLength = v.length;
  for (var i = 0; i < vLength; ++i) {
    dst[i] = k * v[i];
  }
  return dst;
};

/**
 * Multiplies a vector by a scalar.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Vector} v The vector.
 * @param {number} k The scalar.
 * @return {tdl.fast.Vector} The product of k and v.
 */
tdl.fast.mulVectorScalar = function(dst, v, k) {
  return tdl.fast.mulScalarVector(dst, k, v);
};

/**
 * Multiplies a scalar by a matrix.
 * @param {tdl.fast.Matrix} dst matrix.
 * @param {number} k The scalar.
 * @param {tdl.fast.Matrix} m The matrix.
 * @return {tdl.fast.Matrix} The product of m and k.
 */
tdl.fast.mulScalarMatrix = function(dst, k, m) {
  var mLength = m.length;
  for (var i = 0; i < mLength; ++i) {
    dst[i] = k * m[i];
  }
  return dst;
};

/**
 * Multiplies a matrix by a scalar.
 * @param {tdl.fast.Matrix} dst matrix.
 * @param {tdl.fast.Matrix} m The matrix.
 * @param {number} k The scalar.
 * @return {tdl.fast.Matrix} The product of m and k.
 */
tdl.fast.mulMatrixScalar = function(dst, m, k) {
  return tdl.fast.mulScalarMatrix(dst, k, m);
};

/**
 * Multiplies a vector by another vector (component-wise); assumes a and
 * b have the same length.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Vector} a Operand vector.
 * @param {tdl.fast.Vector} b Operand vector.
 * @return {tdl.fast.Vector} The vector of products of entries of a and
 *     b.
 */
tdl.fast.mulVectorVector = function(dst, a, b) {
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    dst[i] = a[i] * b[i];
  return dst;
};

/**
 * Divides a vector by another vector (component-wise); assumes a and
 * b have the same length.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Vector} a Operand vector.
 * @param {tdl.fast.Vector} b Operand vector.
 * @return {tdl.fast.Vector} The vector of quotients of entries of a and
 *     b.
 */
tdl.fast.divVectorVector = function(dst, a, b) {
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    dst[i] = a[i] / b[i];
  return dst;
};

/**
 * Multiplies a vector by a matrix; treats the vector as a row vector; assumes
 * matrix entries are accessed in [row][column] fashion.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Vector} v The vector.
 * @param {tdl.fast.Matrix} m The matrix.
 * @return {tdl.fast.Vector} The product of v and m as a row vector.
 */
tdl.fast.rowMajor.mulVectorMatrix4 = function(dst, v, m) {
  for (var i = 0; i < 4; ++i) {
    dst[i] = 0.0;
    for (var j = 0; j < 4; ++j)
      dst[i] += v[j] * m[j * 4 + i];
  }
  return dst;
};

/**
 * Multiplies a vector by a matrix; treats the vector as a row vector; assumes
 * matrix entries are accessed in [column][row] fashion.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Vector} v The vector.
 * @param {tdl.fast.Matrix} m The matrix.
 * @return {tdl.fast.Vector} The product of v and m as a row vector.
 */
tdl.fast.columnMajor.mulVectorMatrix4 = function(dst, v, m) {
  var mLength = m.length;
  var vLength = v.length;
  for (var i = 0; i < 4; ++i) {
    dst[i] = 0.0;
    var col = i * 4;
    for (var j = 0; j < 4; ++j)
      dst[i] += v[j] * m[col + j];
  }
  return dst;
};

/**
 * Multiplies a vector by a matrix; treats the vector as a row vector.
 * @param {tdl.fast.Matrix} m The matrix.
 * @param {tdl.fast.Vector} v The vector.
 * @return {tdl.fast.Vector} The product of m and v as a row vector.
 */
tdl.fast.mulVectorMatrix4 = null;

/**
 * Multiplies a matrix by a vector; treats the vector as a column vector.
 * assumes matrix entries are accessed in [row][column] fashion.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Matrix} m The matrix.
 * @param {tdl.fast.Vector} v The vector.
 * @return {tdl.fast.Vector} The product of m and v as a column vector.
 */
tdl.fast.rowMajor.mulMatrix4Vector = function(dst, m, v) {
  for (var i = 0; i < 4; ++i) {
    dst[i] = 0.0;
    var row = i * 4;
    for (var j = 0; j < 4; ++j)
      dst[i] += m[row + j] * v[j];
  }
  return dst;
};

/**
 * Multiplies a matrix by a vector; treats the vector as a column vector;
 * assumes matrix entries are accessed in [column][row] fashion.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Matrix} m The matrix.
 * @param {tdl.fast.Vector} v The vector.
 * @return {tdl.fast.Vector} The product of m and v as a column vector.
 */
tdl.fast.columnMajor.mulMatrix4Vector = function(dst, m, v) {
  for (var i = 0; i < 4; ++i) {
    dst[i] = 0.0;
    for (var j = 0; j < 4; ++j)
      dst[i] += v[j] * m[j * 4 + i];
  }
  return dst;
};

/**
 * Multiplies a matrix by a vector; treats the vector as a column vector.
 * @param {tdl.fast.Matrix} m The matrix.
 * @param {tdl.fast.Vector} v The vector.
 * @return {tdl.fast.Vector} The product of m and v as a column vector.
 */
tdl.fast.mulMatrix4Vector = null;

/**
 * Multiplies two 3-by-3 matrices; assumes that the given matrices are 3-by-3;
 * assumes matrix entries are accessed in [row][column] fashion.
 * @param {tdl.fast.Matrix3} dst matrix.
 * @param {tdl.fast.Matrix3} a The matrix on the left.
 * @param {tdl.fast.Matrix3} b The matrix on the right.
 * @return {tdl.fast.Matrix3} The matrix product of a and b.
 */
tdl.fast.rowMajor.mulMatrixMatrix3 = function(dst, a, b) {
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a10 = a[3 + 0];
  var a11 = a[3 + 1];
  var a12 = a[3 + 2];
  var a20 = a[6 + 0];
  var a21 = a[6 + 1];
  var a22 = a[6 + 2];
  var b00 = b[0];
  var b01 = b[1];
  var b02 = b[2];
  var b10 = b[3 + 0];
  var b11 = b[3 + 1];
  var b12 = b[3 + 2];
  var b20 = b[6 + 0];
  var b21 = b[6 + 1];
  var b22 = b[6 + 2];
  dst[0] = a00 * b00 + a01 * b10 + a02 * b20;
  dst[1] = a00 * b01 + a01 * b11 + a02 * b21;
  dst[2] = a00 * b02 + a01 * b12 + a02 * b22;
  dst[3] = a10 * b00 + a11 * b10 + a12 * b20;
  dst[4] = a10 * b01 + a11 * b11 + a12 * b21;
  dst[5] = a10 * b02 + a11 * b12 + a12 * b22;
  dst[6] = a20 * b00 + a21 * b10 + a22 * b20;
  dst[7] = a20 * b01 + a21 * b11 + a22 * b21;
  dst[8] = a20 * b02 + a21 * b12 + a22 * b22;
  return dst;
};

/**
 * Multiplies two 3-by-3 matrices; assumes that the given matrices are 3-by-3;
 * assumes matrix entries are accessed in [column][row] fashion.
 * @param {tdl.fast.Matrix3} dst matrix.
 * @param {tdl.fast.Matrix3} a The matrix on the left.
 * @param {tdl.fast.Matrix3} b The matrix on the right.
 * @return {tdl.fast.Matrix3} The matrix product of a and b.
 */
tdl.fast.columnMajor.mulMatrixMatrix3 = function(dst, a, b) {
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a10 = a[3 + 0];
  var a11 = a[3 + 1];
  var a12 = a[3 + 2];
  var a20 = a[6 + 0];
  var a21 = a[6 + 1];
  var a22 = a[6 + 2];
  var b00 = b[0];
  var b01 = b[1];
  var b02 = b[2];
  var b10 = b[3 + 0];
  var b11 = b[3 + 1];
  var b12 = b[3 + 2];
  var b20 = b[6 + 0];
  var b21 = b[6 + 1];
  var b22 = b[6 + 2];
  dst[0] = a00 * b00 + a10 * b01 + a20 * b02;
  dst[1] = a01 * b00 + a11 * b01 + a21 * b02;
  dst[2] = a02 * b00 + a12 * b01 + a22 * b02;
  dst[3] = a00 * b10 + a10 * b11 + a20 * b12;
  dst[4] = a01 * b10 + a11 * b11 + a21 * b12;
  dst[5] = a02 * b10 + a12 * b11 + a22 * b12;
  dst[6] = a00 * b20 + a10 * b21 + a20 * b22;
  dst[7] = a01 * b20 + a11 * b21 + a21 * b22;
  dst[8] = a02 * b20 + a12 * b21 + a22 * b22;
  return dst;
};

/**
 * Multiplies two 3-by-3 matrices; assumes that the given matrices are 3-by-3.
 * @param {tdl.fast.Matrix3} a The matrix on the left.
 * @param {tdl.fast.Matrix3} b The matrix on the right.
 * @return {tdl.fast.Matrix3} The matrix product of a and b.
 */
tdl.fast.mulMatrixMatrix3 = null;

/**
 * Multiplies two 4-by-4 matrices; assumes that the given matrices are 4-by-4;
 * assumes matrix entries are accessed in [row][column] fashion.
 * @param {tdl.fast.Matrix4} dst matrix.
 * @param {tdl.fast.Matrix4} a The matrix on the left.
 * @param {tdl.fast.Matrix4} b The matrix on the right.
 * @return {tdl.fast.Matrix4} The matrix product of a and b.
 */
tdl.fast.rowMajor.mulMatrixMatrix4 = function(dst, a, b) {
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[ 4 + 0];
  var a11 = a[ 4 + 1];
  var a12 = a[ 4 + 2];
  var a13 = a[ 4 + 3];
  var a20 = a[ 8 + 0];
  var a21 = a[ 8 + 1];
  var a22 = a[ 8 + 2];
  var a23 = a[ 8 + 3];
  var a30 = a[12 + 0];
  var a31 = a[12 + 1];
  var a32 = a[12 + 2];
  var a33 = a[12 + 3];
  var b00 = b[0];
  var b01 = b[1];
  var b02 = b[2];
  var b03 = b[3];
  var b10 = b[ 4 + 0];
  var b11 = b[ 4 + 1];
  var b12 = b[ 4 + 2];
  var b13 = b[ 4 + 3];
  var b20 = b[ 8 + 0];
  var b21 = b[ 8 + 1];
  var b22 = b[ 8 + 2];
  var b23 = b[ 8 + 3];
  var b30 = b[12 + 0];
  var b31 = b[12 + 1];
  var b32 = b[12 + 2];
  var b33 = b[12 + 3];
  dst[ 0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
  dst[ 1] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
  dst[ 2] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
  dst[ 3] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
  dst[ 4] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
  dst[ 5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
  dst[ 6] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
  dst[ 7] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
  dst[ 8] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
  dst[ 9] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
  dst[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
  dst[11] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
  dst[12] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
  dst[13] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
  dst[14] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
  dst[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
  return dst;
};

/**
 * Multiplies two 4-by-4 matrices; assumes that the given matrices are 4-by-4;
 * assumes matrix entries are accessed in [column][row] fashion.
 * @param {tdl.fast.Matrix4} dst matrix.
 * @param {tdl.fast.Matrix4} a The matrix on the left.
 * @param {tdl.fast.Matrix4} b The matrix on the right.
 * @return {tdl.fast.Matrix4} The matrix product of a and b.
 */
tdl.fast.columnMajor.mulMatrixMatrix4 = function(dst, a, b) {
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[ 4 + 0];
  var a11 = a[ 4 + 1];
  var a12 = a[ 4 + 2];
  var a13 = a[ 4 + 3];
  var a20 = a[ 8 + 0];
  var a21 = a[ 8 + 1];
  var a22 = a[ 8 + 2];
  var a23 = a[ 8 + 3];
  var a30 = a[12 + 0];
  var a31 = a[12 + 1];
  var a32 = a[12 + 2];
  var a33 = a[12 + 3];
  var b00 = b[0];
  var b01 = b[1];
  var b02 = b[2];
  var b03 = b[3];
  var b10 = b[ 4 + 0];
  var b11 = b[ 4 + 1];
  var b12 = b[ 4 + 2];
  var b13 = b[ 4 + 3];
  var b20 = b[ 8 + 0];
  var b21 = b[ 8 + 1];
  var b22 = b[ 8 + 2];
  var b23 = b[ 8 + 3];
  var b30 = b[12 + 0];
  var b31 = b[12 + 1];
  var b32 = b[12 + 2];
  var b33 = b[12 + 3];
  dst[ 0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
  dst[ 1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
  dst[ 2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
  dst[ 3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
  dst[ 4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
  dst[ 5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
  dst[ 6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
  dst[ 7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
  dst[ 8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
  dst[ 9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
  dst[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
  dst[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
  dst[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
  dst[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
  dst[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
  dst[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;
  return dst;
};

/**
 * Multiplies two 4-by-4 matrices; assumes that the given matrices are 4-by-4.
 * @param {tdl.fast.Matrix4} a The matrix on the left.
 * @param {tdl.fast.Matrix4} b The matrix on the right.
 * @return {tdl.fast.Matrix4} The matrix product of a and b.
 */
tdl.fast.mulMatrixMatrix4 = null;

/**
 * Gets the jth column of the given matrix m; assumes matrix entries are
 * accessed in [row][column] fashion.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Matrix} m The matrix.
 * @param {number} j The index of the desired column.
 * @return {tdl.fast.Vector} The jth column of m as a vector.
 */
tdl.fast.rowMajor.column4 = function(dst, m, j) {
  for (var i = 0; i < 4; ++i) {
    dst[i] = m[i * 4 + j];
  }
  return dst;
};

/**
 * Gets the jth column of the given matrix m; assumes matrix entries are
 * accessed in [column][row] fashion.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Matrix} m The matrix.
 * @param {number} j The index of the desired column.
 * @return {tdl.fast.Vector} The jth column of m as a vector.
 */
tdl.fast.columnMajor.column4 = function(dst, m, j) {
  var off = j * 4;
  dst[0] = m[off + 0];
  dst[1] = m[off + 1];
  dst[2] = m[off + 2];
  dst[3] = m[off + 3];
  return dst;
};

/**
 * Gets the jth column of the given matrix m.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Matrix} m The matrix.
 * @param {number} j The index of the desired column.
 * @return {tdl.fast.Vector} The jth column of m as a vector.
 */
tdl.fast.column4 = null;

/**
 * Gets the ith row of the given matrix m; assumes matrix entries are
 * accessed in [row][column] fashion.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Matrix} m The matrix.
 * @param {number} i The index of the desired row.
 * @return {tdl.fast.Vector} The ith row of m.
 */
tdl.fast.rowMajor.row4 = function(dst, m, i) {
  var off = i * 4;
  dst[0] = m[off + 0];
  dst[1] = m[off + 1];
  dst[2] = m[off + 2];
  dst[3] = m[off + 3];
  return dst;
};

/**
 * Gets the ith row of the given matrix m; assumes matrix entries are
 * accessed in [column][row] fashion.
 * @param {tdl.fast.Vector} dst vector.
 * @param {tdl.fast.Matrix} m The matrix.
 * @param {number} i The index of the desired row.
 * @return {tdl.fast.Vector} The ith row of m.
 */
tdl.fast.columnMajor.row4 = function(dst, m, i) {
  for (var j = 0; j < 4; ++j) {
    dst[j] = m[j * 4 + i];
  }
  return dst;
};

/**
 * Gets the ith row of the given matrix m.
 * @param {tdl.fast.Matrix} m The matrix.
 * @param {number} i The index of the desired row.
 * @return {tdl.fast.Vector} The ith row of m.
 */
tdl.fast.row4 = null;

/**
 * Creates an n-by-n identity matrix.
 *
 * @param {tdl.fast.Matrix} dst matrix.
 * @return {tdl.fast.Matrix} An n-by-n identity matrix.
 */
tdl.fast.identity4 = function(dst) {
  dst[ 0] = 1;
  dst[ 1] = 0;
  dst[ 2] = 0;
  dst[ 3] = 0;
  dst[ 4] = 0;
  dst[ 5] = 1;
  dst[ 6] = 0;
  dst[ 7] = 0;
  dst[ 8] = 0;
  dst[ 9] = 0;
  dst[10] = 1;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;
  return dst;
};

/**
 * Takes the transpose of a matrix.
 * @param {tdl.fast.Matrix} dst matrix.
 * @param {tdl.fast.Matrix} m The matrix.
 * @return {tdl.fast.Matrix} The transpose of m.
 */
tdl.fast.transpose4 = function(dst, m) {
  if (dst === m) {
    var t;

    t = m[1];
    m[1] = m[4];
    m[4] = t;

    t = m[2];
    m[2] = m[8];
    m[8] = t;

    t = m[3];
    m[3] = m[12];
    m[12] = t;

    t = m[6];
    m[6] = m[9];
    m[9] = t;

    t = m[7];
    m[7] = m[13];
    m[13] = t;

    t = m[11];
    m[11] = m[14];
    m[14] = t;
    return dst;
  }

  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];

  dst[ 0] = m00;
  dst[ 1] = m10;
  dst[ 2] = m20;
  dst[ 3] = m30;
  dst[ 4] = m01;
  dst[ 5] = m11;
  dst[ 6] = m21;
  dst[ 7] = m31;
  dst[ 8] = m02;
  dst[ 9] = m12;
  dst[10] = m22;
  dst[11] = m32;
  dst[12] = m03;
  dst[13] = m13;
  dst[14] = m23;
  dst[15] = m33;
  return dst;
};

/**
 * Computes the inverse of a 4-by-4 matrix.
 * @param {tdl.fast.Matrix4} dst matrix.
 * @param {tdl.fast.Matrix4} m The matrix.
 * @return {tdl.fast.Matrix4} The inverse of m.
 */
tdl.fast.inverse4 = function(dst, m) {
  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];
  var tmp_0  = m22 * m33;
  var tmp_1  = m32 * m23;
  var tmp_2  = m12 * m33;
  var tmp_3  = m32 * m13;
  var tmp_4  = m12 * m23;
  var tmp_5  = m22 * m13;
  var tmp_6  = m02 * m33;
  var tmp_7  = m32 * m03;
  var tmp_8  = m02 * m23;
  var tmp_9  = m22 * m03;
  var tmp_10 = m02 * m13;
  var tmp_11 = m12 * m03;
  var tmp_12 = m20 * m31;
  var tmp_13 = m30 * m21;
  var tmp_14 = m10 * m31;
  var tmp_15 = m30 * m11;
  var tmp_16 = m10 * m21;
  var tmp_17 = m20 * m11;
  var tmp_18 = m00 * m31;
  var tmp_19 = m30 * m01;
  var tmp_20 = m00 * m21;
  var tmp_21 = m20 * m01;
  var tmp_22 = m00 * m11;
  var tmp_23 = m10 * m01;

  var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

  var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

  dst[ 0] = d * t0;
  dst[ 1] = d * t1;
  dst[ 2] = d * t2;
  dst[ 3] = d * t3;
  dst[ 4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
          (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
  dst[ 5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
          (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
  dst[ 6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
          (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
  dst[ 7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
          (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
  dst[ 8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
          (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
  dst[ 9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
          (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
  dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
          (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
  dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
          (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
  dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
          (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
  dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
          (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
  dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
          (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
  dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
          (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
  return dst;
};

/**
 * Computes the inverse of a 4-by-4 matrix.
 * Note: It is faster to call this than tdl.fast.inverse.
 * @param {tdl.fast.Matrix4} m The matrix.
 * @return {tdl.fast.Matrix4} The inverse of m.
 */
tdl.fast.matrix4.inverse = function(dst,m) {
  return tdl.fast.inverse4(dst,m);
};

/**
 * Multiplies two 4-by-4 matrices; assumes that the given matrices are 4-by-4.
 * Note: It is faster to call this than tdl.fast.mul.
 * @param {tdl.fast.Matrix4} a The matrix on the left.
 * @param {tdl.fast.Matrix4} b The matrix on the right.
 * @return {tdl.fast.Matrix4} The matrix product of a and b.
 */
tdl.fast.matrix4.mul = function(dst, a, b) {
  return tdl.fast.mulMatrixMatrix4(dst, a, b);
};

/**
 * Copies a Matrix4.
 * Note: It is faster to call this than tdl.fast.copy.
 * @param {tdl.fast.Matrix4} m The matrix.
 * @return {tdl.fast.Matrix4} A copy of m.
 */
tdl.fast.matrix4.copy = function(dst, m) {
  return tdl.fast.copyMatrix(dst, m);
};

/**
 * Sets the translation component of a 4-by-4 matrix to the given
 * vector.
 * @param {tdl.fast.Matrix4} a The matrix.
 * @param {(tdl.fast.Vector3|tdl.fast.Vector4)} v The vector.
 * @return {tdl.fast.Matrix4} a once modified.
 */
tdl.fast.matrix4.setTranslation = function(a, v) {
  a[12] = v[0];
  a[13] = v[1];
  a[14] = v[2];
  a[15] = 1;
  return a;
};

/**
 * Returns the translation component of a 4-by-4 matrix as a vector with 3
 * entries.
 * @return {tdl.fast.Vector3} dst vector..
 * @param {tdl.fast.Matrix4} m The matrix.
 * @return {tdl.fast.Vector3} The translation component of m.
 */
tdl.fast.matrix4.getTranslation = function(dst, m) {
  dst[0] = m[12];
  dst[1] = m[13];
  dst[2] = m[14];
  return dst;
};

/**
 * Creates a 4-by-4 identity matrix.
 * @param {tdl.fast.Matrix4} dst matrix.
 * @return {tdl.fast.Matrix4} The 4-by-4 identity.
 */
tdl.fast.matrix4.identity = function(dst) {
  return tdl.fast.identity4(dst);
};

tdl.fast.matrix4.getAxis = function(dst, m, axis) {
  var off = axis * 4;
  dst[0] = m[off + 0];
  dst[1] = m[off + 1];
  dst[2] = m[off + 2];
  return dst;
};

/**
 * Computes a 4-by-4 perspective transformation matrix given the angular height
 * of the frustum, the aspect ratio, and the near and far clipping planes.  The
 * arguments define a frustum extending in the negative z direction.  The given
 * angle is the vertical angle of the frustum, and the horizontal angle is
 * determined to produce the given aspect ratio.  The arguments near and far are
 * the distances to the near and far clipping planes.  Note that near and far
 * are not z coordinates, but rather they are distances along the negative
 * z-axis.  The matrix generated sends the viewing frustum to the unit box.
 * We assume a unit box extending from -1 to 1 in the x and y dimensions and
 * from 0 to 1 in the z dimension.
 * @param {tdl.fast.Matrix4} dst matrix.
 * @param {number} angle The camera angle from top to bottom (in radians).
 * @param {number} aspect The aspect ratio width / height.
 * @param {number} zNear The depth (negative z coordinate)
 *     of the near clipping plane.
 * @param {number} zFar The depth (negative z coordinate)
 *     of the far clipping plane.
 * @return {tdl.fast.Matrix4} The perspective matrix.
 */
tdl.fast.matrix4.perspective = function(dst, angle, aspect, zNear, zFar) {
  var f = Math.tan(Math.PI * 0.5 - 0.5 * angle);
  var rangeInv = 1.0 / (zNear - zFar);

  dst[0]  = f / aspect;
  dst[1]  = 0;
  dst[2]  = 0;
  dst[3]  = 0;

  dst[4]  = 0;
  dst[5]  = f;
  dst[6]  = 0;
  dst[7]  = 0;

  dst[8]  = 0;
  dst[9]  = 0;
  dst[10] = (zNear + zFar) * rangeInv;
  dst[11] = -1;

  dst[12] = 0;
  dst[13] = 0;
  dst[14] = zNear * zFar * rangeInv * 2;
  dst[15] = 0;

  return dst;
};


/**
 * Computes a 4-by-4 othogonal transformation matrix given the left, right,
 * bottom, and top dimensions of the near clipping plane as well as the
 * near and far clipping plane distances.
 * @param {tdl.fast.Matrix4} dst Output matrix.
 * @param {number} left Left side of the near clipping plane viewport.
 * @param {number} right Right side of the near clipping plane viewport.
 * @param {number} top Top of the near clipping plane viewport.
 * @param {number} bottom Bottom of the near clipping plane viewport.
 * @param {number} near The depth (negative z coordinate)
 *     of the near clipping plane.
 * @param {number} far The depth (negative z coordinate)
 *     of the far clipping plane.
 * @return {tdl.fast.Matrix4} The perspective matrix.
 */
tdl.fast.matrix4.ortho = function(dst, left, right, bottom, top, near, far) {


  dst[0]  = 2 / (right - left);
  dst[1]  = 0;
  dst[2]  = 0;
  dst[3]  = 0;

  dst[4]  = 0;
  dst[5]  = 2 / (top - bottom);
  dst[6]  = 0;
  dst[7]  = 0;

  dst[8]  = 0;
  dst[9]  = 0;
  dst[10] = -1 / (far - near);
  dst[11] = 0;

  dst[12] = (right + left) / (left - right);
  dst[13] = (top + bottom) / (bottom - top);
  dst[14] = -near / (near - far);
  dst[15] = 1;

  return dst;
}

/**
 * Computes a 4-by-4 perspective transformation matrix given the left, right,
 * top, bottom, near and far clipping planes. The arguments define a frustum
 * extending in the negative z direction. The arguments near and far are the
 * distances to the near and far clipping planes. Note that near and far are not
 * z coordinates, but rather they are distances along the negative z-axis. The
 * matrix generated sends the viewing frustum to the unit box. We assume a unit
 * box extending from -1 to 1 in the x and y dimensions and from 0 to 1 in the z
 * dimension.
 * @param {number} left The x coordinate of the left plane of the box.
 * @param {number} right The x coordinate of the right plane of the box.
 * @param {number} bottom The y coordinate of the bottom plane of the box.
 * @param {number} top The y coordinate of the right plane of the box.
 * @param {number} near The negative z coordinate of the near plane of the box.
 * @param {number} far The negative z coordinate of the far plane of the box.
 * @return {tdl.fast.Matrix4} The perspective projection matrix.
 */
tdl.fast.matrix4.frustum = function(dst, left, right, bottom, top, near, far) {
  var dx = (right - left);
  var dy = (top - bottom);
  var dz = (near - far);

  dst[ 0] = 2 * near / dx;
  dst[ 1] = 0;
  dst[ 2] = 0;
  dst[ 3] = 0;
  dst[ 4] = 0;
  dst[ 5] = 2 * near / dy;
  dst[ 6] = 0;
  dst[ 7] = 0;
  dst[ 8] = (left + right) / dx;
  dst[ 9] = (top + bottom) / dy;
  dst[10] = far / dz;
  dst[11] = -1;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = near * far / dz;
  dst[15] = 0;

  return dst;
};

/**
 * Computes a 4-by-4 look-at transformation.  The transformation generated is
 * an orthogonal rotation matrix with translation component.  The translation
 * component sends the eye to the origin.  The rotation component sends the
 * vector pointing from the eye to the target to a vector pointing in the
 * negative z direction, and also sends the up vector into the upper half of
 * the yz plane.
 * @param {tdl.fast.Matrix4} dst matrix.
 * @param {tdl.fast.Vector3} eye The
 *     position of the eye.
 * @param {tdl.fast.Vector3} target The
 *     position meant to be viewed.
 * @param {tdl.fast.Vector3} up A vector
 *     pointing up.
 * @return {tdl.fast.Matrix4} The look-at matrix.
 */
tdl.fast.matrix4.lookAt = function(dst, eye, target, up) {
  var t0 = tdl.fast.temp0v3_;
  var t1 = tdl.fast.temp1v3_;
  var t2 = tdl.fast.temp2v3_;

  var vz = tdl.fast.normalize(t0, tdl.fast.subVector(t0, eye, target));
  var vx = tdl.fast.normalize(t1, tdl.fast.cross(t1, up, vz));
  var vy = tdl.fast.cross(t2, vz, vx);

  dst[ 0] = vx[0];
  dst[ 1] = vy[0];
  dst[ 2] = vz[0];
  dst[ 3] = 0;
  dst[ 4] = vx[1];
  dst[ 5] = vy[1];
  dst[ 6] = vz[1];
  dst[ 7] = 0;
  dst[ 8] = vx[2];
  dst[ 9] = vy[2];
  dst[10] = vz[2];
  dst[11] = 0;
  dst[12] = -tdl.fast.dot(vx, eye);
  dst[13] = -tdl.fast.dot(vy, eye);
  dst[14] = -tdl.fast.dot(vz, eye);
  dst[15] = 1;

  return dst;
};

/**
 * Computes a 4-by-4 camera look-at transformation. This is the
 * inverse of lookAt The transformation generated is an
 * orthogonal rotation matrix with translation component.
 * @param {(tdl.fast.Vector3|tdl.fast.Vector4)} eye The position
 *     of the eye.
 * @param {(tdl.fast.Vector3|tdl.fast.Vector4)} target The
 *     position meant to be viewed.
 * @param {(tdl.fast.Vector3|tdl.fast.Vector4)} up A vector
 *     pointing up.
 * @return {tdl.fast.Matrix4} The camera look-at matrix.
 */
tdl.fast.matrix4.cameraLookAt = function(dst, eye, target, up) {
  var t0 = tdl.fast.temp0v3_;
  var t1 = tdl.fast.temp1v3_;
  var t2 = tdl.fast.temp2v3_;

  var vz = tdl.fast.normalize(t0, tdl.fast.subVector(t0, eye, target));
  var vx = tdl.fast.normalize(t1, tdl.fast.cross(t1, up, vz));
  var vy = tdl.fast.cross(t2, vz, vx);

  dst[ 0] = vx[0];
  dst[ 1] = vx[1];
  dst[ 2] = vx[2];
  dst[ 3] = 0;
  dst[ 4] = vy[0];
  dst[ 5] = vy[1];
  dst[ 6] = vy[2];
  dst[ 7] = 0;
  dst[ 8] = vz[0];
  dst[ 9] = vz[1];
  dst[10] = vz[2];
  dst[11] = 0;
  dst[12] = eye[0];
  dst[13] = eye[1];
  dst[14] = eye[2];
  dst[15] = 1;

  return dst;
};

/**
 * Creates a 4-by-4 matrix which translates by the given vector v.
 * @param {(tdl.fast.Vector3|tdl.fast.Vector4)} v The vector by
 *     which to translate.
 * @return {tdl.fast.Matrix4} The translation matrix.
 */
tdl.fast.matrix4.translation = function(dst, v) {
  dst[ 0] = 1;
  dst[ 1] = 0;
  dst[ 2] = 0;
  dst[ 3] = 0;
  dst[ 4] = 0;
  dst[ 5] = 1;
  dst[ 6] = 0;
  dst[ 7] = 0;
  dst[ 8] = 0;
  dst[ 9] = 0;
  dst[10] = 1;
  dst[11] = 0;
  dst[12] = v[0];
  dst[13] = v[1];
  dst[14] = v[2];
  dst[15] = 1;
  return dst;
};

/**
 * Modifies the given 4-by-4 matrix by translation by the given vector v.
 * @param {tdl.fast.Matrix4} m The matrix.
 * @param {(tdl.fast.Vector3|tdl.fast.Vector4)} v The vector by
 *     which to translate.
 * @return {tdl.fast.Matrix4} m once modified.
 */
tdl.fast.matrix4.translate = function(m, v) {
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];
  var m00 = m[0];
  var m01 = m[1];
  var m02 = m[2];
  var m03 = m[3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];

  m[12] = m00 * v0 + m10 * v1 + m20 * v2 + m30;
  m[13] = m01 * v0 + m11 * v1 + m21 * v2 + m31;
  m[14] = m02 * v0 + m12 * v1 + m22 * v2 + m32;
  m[15] = m03 * v0 + m13 * v1 + m23 * v2 + m33;

  return m;
};

tdl.fast.matrix4.transpose = tdl.fast.transpose4;

/**
 * Creates a 4-by-4 matrix which rotates around the x-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.fast.Matrix4} The rotation matrix.
 */
tdl.fast.matrix4.rotationX = function(dst, angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  dst[ 0] = 1;
  dst[ 1] = 0;
  dst[ 2] = 0;
  dst[ 3] = 0;
  dst[ 4] = 0;
  dst[ 5] = c;
  dst[ 6] = s;
  dst[ 7] = 0;
  dst[ 8] = 0;
  dst[ 9] = -s;
  dst[10] = c;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;

  return dst;
};

/**
 * Modifies the given 4-by-4 matrix by a rotation around the x-axis by the given
 * angle.
 * @param {tdl.fast.Matrix4} m The matrix.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.fast.Matrix4} m once modified.
 */
tdl.fast.matrix4.rotateX = function(m, angle) {
  var m10 = m[4];
  var m11 = m[5];
  var m12 = m[6];
  var m13 = m[7];
  var m20 = m[8];
  var m21 = m[9];
  var m22 = m[10];
  var m23 = m[11];
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  m[4]  = c * m10 + s * m20;
  m[5]  = c * m11 + s * m21;
  m[6]  = c * m12 + s * m22;
  m[7]  = c * m13 + s * m23;
  m[8]  = c * m20 - s * m10;
  m[9]  = c * m21 - s * m11;
  m[10] = c * m22 - s * m12;
  m[11] = c * m23 - s * m13;

  return m;
};

/**
 * Creates a 4-by-4 matrix which rotates around the y-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.fast.Matrix4} The rotation matrix.
 */
tdl.fast.matrix4.rotationY = function(dst, angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  dst[ 0] = c;
  dst[ 1] = 0;
  dst[ 2] = -s;
  dst[ 3] = 0;
  dst[ 4] = 0;
  dst[ 5] = 1;
  dst[ 6] = 0;
  dst[ 7] = 0;
  dst[ 8] = s;
  dst[ 9] = 0;
  dst[10] = c;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;

  return dst;
};

/**
 * Modifies the given 4-by-4 matrix by a rotation around the y-axis by the given
 * angle.
 * @param {tdl.fast.Matrix4} m The matrix.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.fast.Matrix4} m once modified.
 */
tdl.fast.matrix4.rotateY = function(m, angle) {
  var m00 = m[0*4+0];
  var m01 = m[0*4+1];
  var m02 = m[0*4+2];
  var m03 = m[0*4+3];
  var m20 = m[2*4+0];
  var m21 = m[2*4+1];
  var m22 = m[2*4+2];
  var m23 = m[2*4+3];
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  m[ 0] = c * m00 - s * m20;
  m[ 1] = c * m01 - s * m21;
  m[ 2] = c * m02 - s * m22;
  m[ 3] = c * m03 - s * m23;
  m[ 8] = c * m20 + s * m00;
  m[ 9] = c * m21 + s * m01;
  m[10] = c * m22 + s * m02;
  m[11] = c * m23 + s * m03;

  return m;
};

/**
 * Creates a 4-by-4 matrix which rotates around the z-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.fast.Matrix4} The rotation matrix.
 */
tdl.fast.matrix4.rotationZ = function(dst, angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  dst[ 0] = c;
  dst[ 1] = s;
  dst[ 2] = 0;
  dst[ 3] = 0;
  dst[ 4] = -s;
  dst[ 5] = c;
  dst[ 6] = 0;
  dst[ 7] = 0;
  dst[ 8] = 0;
  dst[ 9] = 0;
  dst[10] = 1;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;

  return dst;
};

/**
 * Modifies the given 4-by-4 matrix by a rotation around the z-axis by the given
 * angle.
 * @param {tdl.fast.Matrix4} m The matrix.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.fast.Matrix4} m once modified.
 */
tdl.fast.matrix4.rotateZ = function(m, angle) {
  var m00 = m[0*4+0];
  var m01 = m[0*4+1];
  var m02 = m[0*4+2];
  var m03 = m[0*4+3];
  var m10 = m[1*4+0];
  var m11 = m[1*4+1];
  var m12 = m[1*4+2];
  var m13 = m[1*4+3];
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  m[ 0] = c * m00 + s * m10;
  m[ 1] = c * m01 + s * m11;
  m[ 2] = c * m02 + s * m12;
  m[ 3] = c * m03 + s * m13;
  m[ 4] = c * m10 - s * m00;
  m[ 5] = c * m11 - s * m01;
  m[ 6] = c * m12 - s * m02;
  m[ 7] = c * m13 - s * m03;

  return m;
};

/**
 * Creates a 4-by-4 matrix which rotates around the given axis by the given
 * angle.
 * @param {(tdl.fast.Vector3|tdl.fast.Vector4)} axis The axis
 *     about which to rotate.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.fast.Matrix4} A matrix which rotates angle radians
 *     around the axis.
 */
tdl.fast.matrix4.axisRotation = function(dst, axis, angle) {
  var x = axis[0];
  var y = axis[1];
  var z = axis[2];
  var n = Math.sqrt(x * x + y * y + z * z);
  x /= n;
  y /= n;
  z /= n;
  var xx = x * x;
  var yy = y * y;
  var zz = z * z;
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var oneMinusCosine = 1 - c;

  dst[ 0] = xx + (1 - xx) * c;
  dst[ 1] = x * y * oneMinusCosine + z * s;
  dst[ 2] = x * z * oneMinusCosine - y * s;
  dst[ 3] = 0;
  dst[ 4] = x * y * oneMinusCosine - z * s;
  dst[ 5] = yy + (1 - yy) * c;
  dst[ 6] = y * z * oneMinusCosine + x * s;
  dst[ 7] = 0;
  dst[ 8] = x * z * oneMinusCosine + y * s;
  dst[ 9] = y * z * oneMinusCosine - x * s;
  dst[10] = zz + (1 - zz) * c;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;

  return dst;
};

/**
 * Modifies the given 4-by-4 matrix by rotation around the given axis by the
 * given angle.
 * @param {tdl.fast.Matrix4} m The matrix.
 * @param {(tdl.fast.Vector3|tdl.fast.Vector4)} axis The axis
 *     about which to rotate.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.fast.Matrix4} m once modified.
 */
tdl.fast.matrix4.axisRotate = function(m, axis, angle) {
  var x = axis[0];
  var y = axis[1];
  var z = axis[2];
  var n = Math.sqrt(x * x + y * y + z * z);
  x /= n;
  y /= n;
  z /= n;
  var xx = x * x;
  var yy = y * y;
  var zz = z * z;
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var oneMinusCosine = 1 - c;

  var r00 = xx + (1 - xx) * c;
  var r01 = x * y * oneMinusCosine + z * s;
  var r02 = x * z * oneMinusCosine - y * s;
  var r10 = x * y * oneMinusCosine - z * s;
  var r11 = yy + (1 - yy) * c;
  var r12 = y * z * oneMinusCosine + x * s;
  var r20 = x * z * oneMinusCosine + y * s;
  var r21 = y * z * oneMinusCosine - x * s;
  var r22 = zz + (1 - zz) * c;

  var m00 = m[0];
  var m01 = m[1];
  var m02 = m[2];
  var m03 = m[3];
  var m10 = m[4];
  var m11 = m[5];
  var m12 = m[6];
  var m13 = m[7];
  var m20 = m[8];
  var m21 = m[9];
  var m22 = m[10];
  var m23 = m[11];
  var m30 = m[12];
  var m31 = m[13];
  var m32 = m[14];
  var m33 = m[15];

  m[ 0] = r00 * m00 + r01 * m10 + r02 * m20;
  m[ 1] = r00 * m01 + r01 * m11 + r02 * m21;
  m[ 2] = r00 * m02 + r01 * m12 + r02 * m22;
  m[ 3] = r00 * m03 + r01 * m13 + r02 * m23;
  m[ 4] = r10 * m00 + r11 * m10 + r12 * m20;
  m[ 5] = r10 * m01 + r11 * m11 + r12 * m21;
  m[ 6] = r10 * m02 + r11 * m12 + r12 * m22;
  m[ 7] = r10 * m03 + r11 * m13 + r12 * m23;
  m[ 8] = r20 * m00 + r21 * m10 + r22 * m20;
  m[ 9] = r20 * m01 + r21 * m11 + r22 * m21;
  m[10] = r20 * m02 + r21 * m12 + r22 * m22;
  m[11] = r20 * m03 + r21 * m13 + r22 * m23;

  return m;
};

/**
 * Creates a 4-by-4 matrix which scales in each dimension by an amount given by
 * the corresponding entry in the given vector; assumes the vector has three
 * entries.
 * @param {tdl.fast.Vector3} v A vector of
 *     three entries specifying the factor by which to scale in each dimension.
 * @return {tdl.fast.Matrix4} The scaling matrix.
 */
tdl.fast.matrix4.scaling = function(dst, v) {
  dst[ 0] = v[0];
  dst[ 1] = 0;
  dst[ 2] = 0;
  dst[ 3] = 0;
  dst[ 4] = 0;
  dst[ 5] = v[1];
  dst[ 6] = 0;
  dst[ 7] = 0;
  dst[ 8] = 0;
  dst[ 9] = 0;
  dst[10] = v[2];
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;
  return dst;
};

/**
 * Modifies the given 4-by-4 matrix, scaling in each dimension by an amount
 * given by the corresponding entry in the given vector; assumes the vector has
 * three entries.
 * @param {tdl.fast.Matrix4} m The matrix to be modified.
 * @param {tdl.fast.Vector3} v A vector of three entries specifying the
 *     factor by which to scale in each dimension.
 * @return {tdl.fast.Matrix4} m once modified.
 */
tdl.fast.matrix4.scale = function(m, v) {
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];

  m[0] = v0 * m[0*4+0];
  m[1] = v0 * m[0*4+1];
  m[2] = v0 * m[0*4+2];
  m[3] = v0 * m[0*4+3];
  m[4] = v1 * m[1*4+0];
  m[5] = v1 * m[1*4+1];
  m[6] = v1 * m[1*4+2];
  m[7] = v1 * m[1*4+3];
  m[8] = v2 * m[2*4+0];
  m[9] = v2 * m[2*4+1];
  m[10] = v2 * m[2*4+2];
  m[11] = v2 * m[2*4+3];

  return m;
};

/**
 * Sets each function in the namespace tdl.fast to the row major
 * version in tdl.fast.rowMajor (provided such a function exists in
 * tdl.fast.rowMajor).  Call this function to establish the row major
 * convention.
 */
tdl.fast.installRowMajorFunctions = function() {
  for (var f in tdl.fast.rowMajor) {
    tdl.fast[f] = tdl.fast.rowMajor[f];
  }
};

/**
 * Sets each function in the namespace tdl.fast to the column major
 * version in tdl.fast.columnMajor (provided such a function exists in
 * tdl.fast.columnMajor).  Call this function to establish the column
 * major convention.
 */
tdl.fast.installColumnMajorFunctions = function() {
  for (var f in tdl.fast.columnMajor) {
    tdl.fast[f] = tdl.fast.columnMajor[f];
  }
};

// By default, install the row-major functions.
tdl.fast.installRowMajorFunctions();

// return tdl.fast;
// });

/*
 * Copyright 2009, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @fileoverview This file contains various functions for quaternion arithmetic
 * and converting between rotation matrices and quaternions.  It adds them to
 * the "quaternions" module on the tdl object.  Javascript arrays with
 * four entries are used to represent quaternions, and functions are provided
 * for doing operations on those.
 *
 * Operations are done assuming quaternions are of the form:
 * `q[0] + q[1]i + q[2]j + q[3]k` and using the hamiltonian
 * rules for multiplication as described on Brougham Bridge:
 * `i^2 = j^2 = k^2 = ijk = -1`.
 *
 */

//define(['./base-rs'], function(BaseRS) {

//tdl.provide('tdl.quaternions');
/**
 * A Module for quaternion math.
 * @namespace
 */
tdl.quaternions = tdl.quaternions || {};

/**
 * A Quaternion.
 * @typedef {number[]} tdl.quaternions.Quaternion
 */

/**
 * Quickly determines if the object a is a scalar or a quaternion;
 * assumes that the argument is either a number (scalar), or an array of
 * numbers.
 * @param {(number|tdl.quaternions.Quaternion)} a A number or array the type
 *     of which is in question.
 * @return {string} Either the string 'Scalar' or 'Quaternion'.
 */
tdl.quaternions.mathType = function(a) {
  if (typeof(a) === 'number')
    return 'Scalar';
  return 'Quaternion';
};

/**
 * Creates an identity quaternion.
 * @return {tdl.quaternions.Quaternion} The identity quaternion.
 */
tdl.quaternions.identity = function() {
  return [ 0, 0, 0, 1 ];
};

/**
 * Copies a quaternion.
 * @param {tdl.quaternions.Quaternion} q The quaternion.
 * @return {tdl.quaternions.Quaternion} A new quaternion identical to q.
 */
tdl.quaternions.copy = function(q) {
  return q.slice();
};

/**
 * Negates a quaternion.
 * @param {tdl.quaternions.Quaternion} q The quaternion.
 * @return {tdl.quaternions.Quaternion} -q.
 */
tdl.quaternions.negative = function(q) {
  return [-q[0], -q[1], -q[2], -q[3]];
};

/**
 * Adds two Quaternions.
 * @param {tdl.quaternions.Quaternion} a Operand Quaternion.
 * @param {tdl.quaternions.Quaternion} b Operand Quaternion.
 * @return {tdl.quaternions.Quaternion} The sum of a and b.
 */
tdl.quaternions.addQuaternionQuaternion = function(a, b) {
  return [a[0] + b[0],
          a[1] + b[1],
          a[2] + b[2],
          a[3] + b[3]];
};

/**
 * Adds a quaternion to a scalar.
 * @param {tdl.quaternions.Quaternion} a Operand Quaternion.
 * @param {number} b Operand Scalar.
 * @return {tdl.quaternions.Quaternion} The sum of a and b.
 */
tdl.quaternions.addQuaternionScalar = function(a, b) {
  return a.slice(0, 3).concat(a[3] + b);
};

/**
 * Adds a scalar to a quaternion.
 * @param {number} a Operand scalar.
 * @param {tdl.quaternions.Quaternion} b Operand quaternion.
 * @return {tdl.quaternions.Quaternion} The sum of a and b.
 */
tdl.quaternions.addScalarQuaternion = function(a, b) {
  return b.slice(0, 3).concat(a + b[3]);
};

/**
 * Subtracts two quaternions.
 * @param {tdl.quaternions.Quaternion} a Operand quaternion.
 * @param {tdl.quaternions.Quaternion} b Operand quaternion.
 * @return {tdl.quaternions.Quaternion} The difference a - b.
 */
tdl.quaternions.subQuaternionQuaternion = function(a, b) {
  return [a[0] - b[0],
          a[1] - b[1],
          a[2] - b[2],
          a[3] - b[3]];
};

/**
 * Subtracts a scalar from a quaternion.
 * @param {tdl.quaternions.Quaternion} a Operand quaternion.
 * @param {number} b Operand scalar.
 * @return {tdl.quaternions.Quaternion} The difference a - b.
 */
tdl.quaternions.subQuaternionScalar = function(a, b) {
  return a.slice(0, 3).concat(a[3] - b);
};

/**
 * Subtracts a quaternion from a scalar.
 * @param {number} a Operand scalar.
 * @param {tdl.quaternions.Quaternion} b Operand quaternion.
 * @return {tdl.quaternions.Quaternion} The difference a - b.
 */
tdl.quaternions.subScalarQuaternion = function(a, b) {
  return [-b[0], -b[1], -b[2], a - b[3]];
};

/**
 * Multiplies a scalar by a quaternion.
 * @param {number} k The scalar.
 * @param {tdl.quaternions.Quaternion} q The quaternion.
 * @return {tdl.quaternions.Quaternion} The product of k and q.
 */
tdl.quaternions.mulScalarQuaternion = function(k, q) {
  return [k * q[0], k * q[1], k * q[2], k * q[3]];
};

/**
 * Multiplies a quaternion by a scalar.
 * @param {tdl.quaternions.Quaternion} q The Quaternion.
 * @param {number} k The scalar.
 * @return {tdl.quaternions.Quaternion} The product of k and v.
 */
tdl.quaternions.mulQuaternionScalar = function(q, k) {
  return [k * q[0], k * q[1], k * q[2], k * q[3]];
};

/**
 * Multiplies two quaternions.
 * @param {tdl.quaternions.Quaternion} a Operand quaternion.
 * @param {tdl.quaternions.Quaternion} b Operand quaternion.
 * @return {tdl.quaternions.Quaternion} The quaternion product a * b.
 */
tdl.quaternions.mulQuaternionQuaternion = function(a, b) {
  var aX = a[0];
  var aY = a[1];
  var aZ = a[2];
  var aW = a[3];
  var bX = b[0];
  var bY = b[1];
  var bZ = b[2];
  var bW = b[3];

  return [
      aW * bX + aX * bW + aY * bZ - aZ * bY,
      aW * bY + aY * bW + aZ * bX - aX * bZ,
      aW * bZ + aZ * bW + aX * bY - aY * bX,
      aW * bW - aX * bX - aY * bY - aZ * bZ];
};

/**
 * Divides two quaternions; assumes the convention that a/b = a*(1/b).
 * @param {tdl.quaternions.Quaternion} a Operand quaternion.
 * @param {tdl.quaternions.Quaternion} b Operand quaternion.
 * @return {tdl.quaternions.Quaternion} The quaternion quotient a / b.
 */
tdl.quaternions.divQuaternionQuaternion = function(a, b) {
  var aX = a[0];
  var aY = a[1];
  var aZ = a[2];
  var aW = a[3];
  var bX = b[0];
  var bY = b[1];
  var bZ = b[2];
  var bW = b[3];

  var d = 1 / (bW * bW + bX * bX + bY * bY + bZ * bZ);
  return [
      (aX * bW - aW * bX - aY * bZ + aZ * bY) * d,
      (aX * bZ - aW * bY + aY * bW - aZ * bX) * d,
      (aY * bX + aZ * bW - aW * bZ - aX * bY) * d,
      (aW * bW + aX * bX + aY * bY + aZ * bZ) * d];
};

/**
 * Divides a Quaternion by a scalar.
 * @param {tdl.quaternions.Quaternion} q The quaternion.
 * @param {number} k The scalar.
 * @return {tdl.quaternions.Quaternion} q The quaternion q divided by k.
 */
tdl.quaternions.divQuaternionScalar = function(q, k) {
  return [q[0] / k, q[1] / k, q[2] / k, q[3] / k];
};

/**
 * Divides a scalar by a quaternion.
 * @param {number} a Operand scalar.
 * @param {tdl.quaternions.Quaternion} b Operand quaternion.
 * @return {tdl.quaternions.Quaternion} The quaternion product.
 */
tdl.quaternions.divScalarQuaternion = function(a, b) {
  var b0 = b[0];
  var b1 = b[1];
  var b2 = b[2];
  var b3 = b[3];

  var d = 1 / (b0 * b0 + b1 * b1 + b2 * b2 + b3 * b3);
  return [-a * b0 * d, -a * b1 * d, -a * b2 * d, a * b3 * d];
};

/**
 * Computes the multiplicative inverse of a quaternion.
 * @param {tdl.quaternions.Quaternion} q The quaternion.
 * @return {tdl.quaternions.Quaternion} The multiplicative inverse of q.
 */
tdl.quaternions.inverse = function(q) {
  var q0 = q[0];
  var q1 = q[1];
  var q2 = q[2];
  var q3 = q[3];

  var d = 1 / (q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3);
  return [-q0 * d, -q1 * d, -q2 * d, q3 * d];
};

/**
 * Multiplies two objects which are either scalars or quaternions.
 * @param {(tdl.quaternions.Quaternion|number)} a Operand.
 * @param {(tdl.quaternions.Quaternion|number)} b Operand.
 * @return {(tdl.quaternions.Quaternion|number)} The product of a and b.
 */
tdl.quaternions.mul = function(a, b) {
  return tdl.quaternions['mul' + tdl.quaternions.mathType(a) +
      tdl.quaternions.mathType(b)](a, b);
};

/**
 * Divides two objects which are either scalars or quaternions.
 * @param {(tdl.quaternions.Quaternion|number)} a Operand.
 * @param {(tdl.quaternions.Quaternion|number)} b Operand.
 * @return {(tdl.quaternions.Quaternion|number)} The quotient of a and b.
 */
tdl.quaternions.div = function(a, b) {
  return tdl.quaternions['div' + tdl.quaternions.mathType(a) +
      tdl.quaternions.mathType(b)](a, b);
};

/**
 * Adds two objects which are either scalars or quaternions.
 * @param {(tdl.quaternions.Quaternion|number)} a Operand.
 * @param {(tdl.quaternions.Quaternion|number)} b Operand.
 * @return {(tdl.quaternions.Quaternion|number)} The sum of a and b.
 */
tdl.quaternions.add = function(a, b) {
  return tdl.quaternions['add' + tdl.quaternions.mathType(a) +
      tdl.quaternions.mathType(b)](a, b);
};

/**
 * Subtracts two objects which are either scalars or quaternions.
 * @param {(tdl.quaternions.Quaternion|number)} a Operand.
 * @param {(tdl.quaternions.Quaternion|number)} b Operand.
 * @return {(tdl.quaternions.Quaternion|number)} The difference of a and b.
 */
tdl.quaternions.sub = function(a, b) {
  return tdl.quaternions['sub' + tdl.quaternions.mathType(a) +
      tdl.quaternions.mathType(b)](a, b);
};

/**
 * Computes the length of a Quaternion, i.e. the square root of the
 * sum of the squares of the coefficients.
 * @param {tdl.quaternions.Quaternion} a The Quaternion.
 * @return {number} The length of a.
 */
tdl.quaternions.length = function(a) {
  return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]);
};

/**
 * Computes the square of the length of a quaternion, i.e. the sum of the
 * squares of the coefficients.
 * @param {tdl.quaternions.Quaternion} a The quaternion.
 * @return {number} The square of the length of a.
 */
tdl.quaternions.lengthSquared = function(a) {
  return a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3];
};

/**
 * Divides a Quaternion by its length and returns the quotient.
 * @param {tdl.quaternions.Quaternion} a The Quaternion.
 * @return {tdl.quaternions.Quaternion} A unit length quaternion pointing in
 *     the same direction as a.
 */
tdl.quaternions.normalize = function(a) {
  var d = 1 / Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]);
  return [a[0] * d, a[1] * d, a[2] * d, a[3] * d];
};

/**
 * Computes the conjugate of the given quaternion.
 * @param {tdl.quaternions.Quaternion} q The quaternion.
 * @return {tdl.quaternions.Quaternion} The conjugate of q.
 */
tdl.quaternions.conjugate = function(q) {
  return [-q[0], -q[1], -q[2], q[3]];
};


/**
 * Creates a quaternion which rotates around the x-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.quaternions.Quaternion} The quaternion.
 */
tdl.quaternions.rotationX = function(angle) {
  return [Math.sin(angle / 2), 0, 0, Math.cos(angle / 2)];
};

/**
 * Creates a quaternion which rotates around the y-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.quaternions.Quaternion} The quaternion.
 */
tdl.quaternions.rotationY = function(angle) {
  return [0, Math.sin(angle / 2), 0, Math.cos(angle / 2)];
};

/**
 * Creates a quaternion which rotates around the z-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.quaternions.Quaternion} The quaternion.
 */
tdl.quaternions.rotationZ = function(angle) {
  return [0, 0, Math.sin(angle / 2), Math.cos(angle / 2)];
};

/**
 * Creates a quaternion which rotates around the given axis by the given
 * angle.
 * @param {tdl.math.Vector3} axis The axis about which to rotate.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.quaternions.Quaternion} A quaternion which rotates angle
 *     radians around the axis.
 */
tdl.quaternions.axisRotation = function(axis, angle) {
  var d = 1 / Math.sqrt(axis[0] * axis[0] +
                        axis[1] * axis[1] +
                        axis[2] * axis[2]);
  var sin = Math.sin(angle / 2);
  var cos = Math.cos(angle / 2);
  return [sin * axis[0] * d, sin * axis[1] * d, sin * axis[2] * d, cos];
};

/**
 * Computes a 4-by-4 rotation matrix (with trivial translation component)
 * given a quaternion.  We assume the convention that to rotate a vector v by
 * a quaternion r means to express that vector as a quaternion q by letting
 * `q = [v[0], v[1], v[2], 0]` and then obtain the rotated
 * vector by evaluating the expression `(r * q) / r`.
 * @param {tdl.quaternions.Quaternion} q The quaternion.
 * @return {tdl.math.Matrix4} A 4-by-4 rotation matrix.
 */
tdl.quaternions.quaternionToRotation = function(q) {
  var qX = q[0];
  var qY = q[1];
  var qZ = q[2];
  var qW = q[3];

  var qWqW = qW * qW;
  var qWqX = qW * qX;
  var qWqY = qW * qY;
  var qWqZ = qW * qZ;
  var qXqW = qX * qW;
  var qXqX = qX * qX;
  var qXqY = qX * qY;
  var qXqZ = qX * qZ;
  var qYqW = qY * qW;
  var qYqX = qY * qX;
  var qYqY = qY * qY;
  var qYqZ = qY * qZ;
  var qZqW = qZ * qW;
  var qZqX = qZ * qX;
  var qZqY = qZ * qY;
  var qZqZ = qZ * qZ;

  var d = qWqW + qXqX + qYqY + qZqZ;

  return [
    (qWqW + qXqX - qYqY - qZqZ) / d,
     2 * (qWqZ + qXqY) / d,
     2 * (qXqZ - qWqY) / d, 0,

     2 * (qXqY - qWqZ) / d,
     (qWqW - qXqX + qYqY - qZqZ) / d,
     2 * (qWqX + qYqZ) / d, 0,

     2 * (qWqY + qXqZ) / d,
     2 * (qYqZ - qWqX) / d,
     (qWqW - qXqX - qYqY + qZqZ) / d, 0,

     0, 0, 0, 1];
};

/**
 * Computes a quaternion whose rotation is equivalent to the given matrix.
 * @param {(tdl.math.Matrix4|tdl.math.Matrix3)} m A 3-by-3 or 4-by-4
 *     rotation matrix.
 * @return {tdl.quaternions.Quaternion} A quaternion q such that
 *     quaternions.quaternionToRotation(q) is m.
 */
tdl.quaternions.rotationToQuaternion = function(m) {
  var u;
  var v;
  var w;

  // Choose u, v, and w such that u is the index of the biggest diagonal entry
  // of m, and u v w is an even permutation of 0 1 and 2.
  if (m[0*4+0] > m[1*4+1] && m[0*4+0] > m[2*4+2]) {
    u = 0;
    v = 1;
    w = 2;
  } else if (m[1*4+1] > m[0*4+0] && m[1*4+1] > m[2*4+2]) {
    u = 1;
    v = 2;
    w = 0;
  } else {
    u = 2;
    v = 0;
    w = 1;
  }

  var r = Math.sqrt(1 + m[u*4+u] - m[v*4+v] - m[w*4+w]);
  var q = [];
  q[u] = 0.5 * r;
  q[v] = 0.5 * (m[v*4+u] + m[u*4+v]) / r;
  q[w] = 0.5 * (m[u*4+w] + m[w*4+u]) / r;
  q[3] = 0.5 * (m[v*4+w] - m[w*4+v]) / r;

  return q;
};


// return tdl.quaternions;
// });

try { module.exports = tdl; } catch(e) {}

/*
 * Copyright 2009, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


/**
 * @fileoverview This file contains matrix/vector math functions.
 * It adds them to the "math" module on the tdl object.
 *
 * tdl.math supports a row-major and a column-major mode.  In both
 * modes, vectors are stored as arrays of numbers, and matrices are stored as
 * arrays of arrays of numbers.
 *
 * In row-major mode:
 *
 * - Rows of a matrix are sub-arrays.
 * - Individual entries of a matrix M get accessed in M[row][column] fashion.
 * - Tuples of coordinates are interpreted as row-vectors.
 * - A vector v gets transformed by a matrix M by multiplying in the order v*M.
 *
 * In column-major mode:
 *
 * - Columns of a matrix are sub-arrays.
 * - Individual entries of a matrix M get accessed in M[column][row] fashion.
 * - Tuples of coordinates are interpreted as column-vectors.
 * - A matrix M transforms a vector v by multiplying in the order M*v.
 *
 * When a function in tdl.math requires separate row-major and
 * column-major versions, a function with the same name gets added to each of
 * the namespaces tdl.math.rowMajor and tdl.math.columnMajor. The
 * function installRowMajorFunctions() or the function
 * installColumnMajorFunctions() should get called during initialization to
 * establish the mode.  installRowMajorFunctions() works by iterating through
 * the tdl.math.rowMajor namespace and for each function foo, setting
 * tdl.math.foo equal to tdl.math.rowMajor.foo.
 * installRowMajorFunctions() works the same way, iterating over the columnMajor
 * namespace.  At the end of this file, we call installRowMajorFunctions().
 *
 * Switching modes changes two things.  It changes how a matrix is encoded as an
 * array, and it changes how the entries of a matrix get interpreted.  Because
 * those two things change together, the matrix representing a given
 * transformation of space is the same JavaScript object in either mode.
 * One consequence of this is that very few functions require separate row-major
 * and column-major versions.  Typically, a function requires separate versions
 * only if it makes matrix multiplication order explicit, like
 * mulMatrixMatrix(), mulMatrixVector(), or mulVectorMatrix().  Functions which
 * create a new matrix, like scaling(), rotationZYX(), and translation() return
 * the same JavaScript object in either mode, and functions which implicitly
 * multiply like scale(), rotateZYX() and translate() modify the matrix in the
 * same way in either mode.
 *
 * The convention choice made for math functions in this library is independent
 * of the convention choice for how matrices get loaded into shaders.  That
 * convention is determined on a per-shader basis.
 *
 * Other utilities in tdl should avoid making calls to functions that make
 * multiplication order explicit.  Instead they should appeal to functions like:
 *
 * tdl.math.matrix4.transformPoint
 * tdl.math.matrix4.transformDirection
 * tdl.math.matrix4.transformNormal
 * tdl.math.matrix4.transformVector4
 * tdl.math.matrix4.composition
 * tdl.math.matrix4.compose
 *
 * These functions multiply matrices implicitly and internally choose the
 * multiplication order to get the right result.  That way, utilities which use
 * tdl.math work in either major mode.  Note that this does not necessarily
 * mean all sample code will work even if a line is added which switches major
 * modes, but it does mean that calls to tdl still do what they are supposed
 * to.
 *
 */

//define(['./base-rs'], function(BaseRS) {

//tdl.provide('tdl.math');

/**
 * A module for math for tdl.math.
 * @namespace
 */
tdl.math = tdl.math || {};

/**
 * A random seed for the pseudoRandom function.
 * @private
 * @type {number}
 */
tdl.math.randomSeed_ = 0;

/**
 * A constant for the pseudoRandom function
 * @private
 * @type {number}
 */
tdl.math.RANDOM_RANGE_ = Math.pow(2, 32);

/**
 * Functions which deal with 4-by-4 transformation matrices are kept in their
 * own namespsace.
 * @namespace
 */
tdl.math.matrix4 = tdl.math.matrix4 || {};

/**
 * Functions that are specifically row major are kept in their own namespace.
 * @namespace
 */
tdl.math.rowMajor = tdl.math.rowMajor || {};

/**
 * Functions that are specifically column major are kept in their own namespace.
 * @namespace
 */
tdl.math.columnMajor = tdl.math.columnMajor || {};

/**
 * An Array of 2 floats
 * @typedef {number[]} tdl.math.Vector2
 */

/**
 * An Array of 3 floats
 * @typedef {number[]} tdl.math.Vector3
 */

/**
 * An Array of 4 floats
 * @typedef {number[]} tdl.math.Vector4
 */

/**
 * An Array of floats.
 * @typedef {number[]} tdl.math.Vector
 */

/**
 * A 1x1 Matrix of floats
 * @typedef {number[]} tdl.math.Matrix1
 */

/**
 * A 2x2 Matrix of floats
 * @typedef {number[]} tdl.math.Matrix2
 */

/**
 * A 3x3 Matrix of floats
 * @typedef {number[]} tdl.math.Matrix3
 */

/**
 * A 4x4 Matrix of floats
 * @typedef {number[]} tdl.math.Matrix4
 */

/**
 * A arbitrary size Matrix of floats
 * @typedef {Array.<number[]>} tdl.math.Matrix;
 */

/**
 * Returns a deterministic pseudorandom number between 0 and 1
 * @return {number} a random number between 0 and 1
 */
tdl.math.pseudoRandom = function() {
  var math = tdl.math;
  return (math.randomSeed_ =
          (134775813 * math.randomSeed_ + 1) %
          math.RANDOM_RANGE_) / math.RANDOM_RANGE_;
};

/**
 * Resets the pseudoRandom function sequence.
 */
tdl.math.resetPseudoRandom = function() {
  tdl.math.randomSeed_ = 0;
};

/**
 * Return a random integer between 0 and n-1
 * @param {number} n
 */
tdl.math.randomInt = function(n) {
  return Math.floor(Math.random() * n);
}

/**
 * Converts degrees to radians.
 * @param {number} degrees A value in degrees.
 * @return {number} the value in radians.
 */
tdl.math.degToRad = function(degrees) {
  return degrees * Math.PI / 180;
};

/**
 * Converts radians to degrees.
 * @param {number} radians A value in radians.
 * @return {number} the value in degrees.
 */
tdl.math.radToDeg = function(radians) {
  return radians * 180 / Math.PI;
};

/**
 * Performs linear interpolation on two scalars.
 * Given scalars a and b and interpolation coefficient t, returns
 * (1 - t) * a + t * b.
 * @param {number} a Operand scalar.
 * @param {number} b Operand scalar.
 * @param {number} t Interpolation coefficient.
 * @return {number} The weighted sum of a and b.
 */
tdl.math.lerpScalar = function(a, b, t) {
  return (1 - t) * a + t * b;
};

/**
 * Adds two vectors; assumes a and b have the same dimension.
 * @param {tdl.math.Vector} a Operand vector.
 * @param {tdl.math.Vector} b Operand vector.
 * @return {tdl.math.Vector} The sum of a and b.
 */
tdl.math.addVector = function(a, b) {
  var r = [];
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r[i] = a[i] + b[i];
  return r;
};

/**
 * Subtracts two vectors.
 * @param {tdl.math.Vector} a Operand vector.
 * @param {tdl.math.Vector} b Operand vector.
 * @return {tdl.math.Vector} The difference of a and b.
 */
tdl.math.subVector = function(a, b) {
  var r = [];
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r[i] = a[i] - b[i];
  return r;
};

/**
 * Performs linear interpolation on two vectors.
 * Given vectors a and b and interpolation coefficient t, returns
 * (1 - t) * a + t * b.
 * @param {tdl.math.Vector} a Operand vector.
 * @param {tdl.math.Vector} b Operand vector.
 * @param {number} t Interpolation coefficient.
 * @return {tdl.math.Vector} The weighted sum of a and b.
 */
tdl.math.lerpVector = function(a, b, t) {
  var r = [];
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r[i] = (1 - t) * a[i] + t * b[i];
  return r;
};

/**
 * Clamps a value between 0 and range using a modulo.
 * @param {number} v Value to clamp mod.
 * @param {number} range Range to clamp to.
 * @param {number} opt_rangeStart start of range. Default = 0.
 * @return {number} Clamp modded value.
 */
tdl.math.modClamp = function(v, range, opt_rangeStart) {
  var start = opt_rangeStart || 0;
  if (range < 0.00001) {
    return start;
  }
  v -= start;
  if (v < 0) {
    v -= Math.floor(v / range) * range;
  } else {
    v = v % range;
  }
  return v + start;
};

/**
 * Lerps in a circle.
 * Does a lerp between a and b but inside range so for example if
 * range is 100, a is 95 and b is 5 lerping will go in the positive direction.
 * @param {number} a Start value.
 * @param {number} b Target value.
 * @param {number} t Amount to lerp (0 to 1).
 * @param {number} range Range of circle.
 * @return {number} lerped result.
 */
tdl.math.lerpCircular = function(a, b, t, range) {
  a = tdl.math.modClamp(a, range);
  b = tdl.math.modClamp(b, range);
  var delta = b - a;
  if (Math.abs(delta) > range * 0.5) {
    if (delta > 0) {
      b -= range;
    } else {
      b += range;
    }
  }
  return tdl.math.modClamp(tdl.math.lerpScalar(a, b, t), range);
};

/**
 * Lerps radians.
 * @param {number} a Start value.
 * @param {number} b Target value.
 * @param {number} t Amount to lerp (0 to 1).
 * @return {number} lerped result.
 */
tdl.math.lerpRadian = function(a, b, t) {
  return tdl.math.lerpCircular(a, b, t, Math.PI * 2);
};

/**
 * Divides a vector by a scalar.
 * @param {tdl.math.Vector} v The vector.
 * @param {number} k The scalar.
 * @return {tdl.math.Vector} v The vector v divided by k.
 */
tdl.math.divVectorScalar = function(v, k) {
  var r = [];
  var vLength = v.length;
  for (var i = 0; i < vLength; ++i)
    r[i] = v[i] / k;
  return r;
};

/**
 * Computes the dot product of two vectors; assumes that a and b have
 * the same dimension.
 * @param {tdl.math.Vector} a Operand vector.
 * @param {tdl.math.Vector} b Operand vector.
 * @return {number} The dot product of a and b.
 */
tdl.math.dot = function(a, b) {
  var r = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r += a[i] * b[i];
  return r;
};

/**
 * Computes the cross product of two vectors; assumes both vectors have
 * three entries.
 * @param {tdl.math.Vector} a Operand vector.
 * @param {tdl.math.Vector} b Operand vector.
 * @return {tdl.math.Vector} The vector a cross b.
 */
tdl.math.cross = function(a, b) {
  return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];
};

/**
 * Computes the Euclidean length of a vector, i.e. the square root of the
 * sum of the squares of the entries.
 * @param {tdl.math.Vector} a The vector.
 * @return {number} The length of a.
 */
tdl.math.length = function(a) {
  var r = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r += a[i] * a[i];
  return Math.sqrt(r);
};

/**
 * Computes the square of the Euclidean length of a vector, i.e. the sum
 * of the squares of the entries.
 * @param {tdl.math.Vector} a The vector.
 * @return {number} The square of the length of a.
 */
tdl.math.lengthSquared = function(a) {
  var r = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r += a[i] * a[i];
  return r;
};

/**
 * Computes the Euclidean distance between two vectors.
 * @param {tdl.math.Vector} a A vector.
 * @param {tdl.math.Vector} b A vector.
 * @return {number} The distance between a and b.
 */
tdl.math.distance = function(a, b) {
  var r = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i) {
    var t = a[i] - b[i];
    r += t * t;
  }
  return Math.sqrt(r);
};

/**
 * Computes the square of the Euclidean distance between two vectors.
 * @param {tdl.math.Vector} a A vector.
 * @param {tdl.math.Vector} b A vector.
 * @return {number} The distance between a and b.
 */
tdl.math.distanceSquared = function(a, b) {
  var r = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i) {
    var t = a[i] - b[i];
    r += t * t;
  }
  return r;
};

/**
 * Divides a vector by its Euclidean length and returns the quotient.
 * @param {tdl.math.Vector} a The vector.
 * @return {tdl.math.Vector} The normalized vector.
 */
tdl.math.normalize = function(a) {
  var r = [];
  var n = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    n += a[i] * a[i];
  n = Math.sqrt(n);
  if (n > 0.00001) {
    for (var i = 0; i < aLength; ++i)
      r[i] = a[i] / n;
  } else {
    r = [0,0,0];
  }
  return r;
};

/**
 * Adds two matrices; assumes a and b are the same size.
 * @param {tdl.math.Matrix} a Operand matrix.
 * @param {tdl.math.Matrix} b Operand matrix.
 * @return {tdl.math.Matrix} The sum of a and b.
 */
tdl.math.addMatrix = function(a, b) {
  var r = [];
  var aLength = a.length;
  var a0Length = a[0].length;
  for (var i = 0; i < aLength; ++i) {
    var row = [];
    var ai = a[i];
    var bi = b[i];
    for (var j = 0; j < a0Length; ++j)
      row[j] = ai[j] + bi[j];
    r[i] = row;
  }
  return r;
};

/**
 * Subtracts two matrices; assumes a and b are the same size.
 * @param {tdl.math.Matrix} a Operand matrix.
 * @param {tdl.math.Matrix} b Operand matrix.
 * @return {tdl.math.Matrix} The sum of a and b.
 */
tdl.math.subMatrix = function(a, b) {
  var r = [];
  var aLength = a.length;
  var a0Length = a[0].length;
  for (var i = 0; i < aLength; ++i) {
    var row = [];
    var ai = a[i];
    var bi = b[i];
    for (var j = 0; j < a0Length; ++j)
      row[j] = ai[j] - bi[j];
    r[i] = row;
  }
  return r;
};

/**
 * Performs linear interpolation on two matrices.
 * Given matrices a and b and interpolation coefficient t, returns
 * (1 - t) * a + t * b.
 * @param {tdl.math.Matrix} a Operand matrix.
 * @param {tdl.math.Matrix} b Operand matrix.
 * @param {number} t Interpolation coefficient.
 * @return {tdl.math.Matrix} The weighted of a and b.
 */
tdl.math.lerpMatrix = function(a, b, t) {
  var r = [];
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i) {
    r[i] = (1 - t) * a[i] + t * b[i];
  }
  return r;
};

/**
 * Divides a matrix by a scalar.
 * @param {tdl.math.Matrix} m The matrix.
 * @param {number} k The scalar.
 * @return {tdl.math.Matrix} The matrix m divided by k.
 */
tdl.math.divMatrixScalar = function(m, k) {
  var r = [];
  var mLength = m.length;
  for (var i = 0; i < mLength; ++i) {
    r[i] = m[i] / k;
  }
  return r;
};

/**
 * Negates a scalar.
 * @param {number} a The scalar.
 * @return {number} -a.
 */
tdl.math.negativeScalar = function(a) {
 return -a;
};

/**
 * Negates a vector.
 * @param {tdl.math.Vector} v The vector.
 * @return {tdl.math.Vector} -v.
 */
tdl.math.negativeVector = function(v) {
 var r = [];
 var vLength = v.length;
 for (var i = 0; i < vLength; ++i) {
   r[i] = -v[i];
 }
 return r;
};

/**
 * Negates a matrix.
 * @param {tdl.math.Matrix} m The matrix.
 * @return {tdl.math.Matrix} -m.
 */
tdl.math.negativeMatrix = function(m) {
 var r = [];
 var mLength = m.length;
 for (var i = 0; i < mLength; ++i) {
   r[i] = -m[i];
 }
 return r;
};

/**
 * Copies a scalar.
 * @param {number} a The scalar.
 * @return {number} a.
 */
tdl.math.copyScalar = function(a) {
  return a;
};

/**
 * Copies a vector.
 * @param {tdl.math.Vector} v The vector.
 * @return {tdl.math.Vector} A copy of v.
 */
tdl.math.copyVector = function(v) {
  var r = [];
  for (var i = 0; i < v.length; i++)
    r[i] = v[i];
  return r;
};

/**
 * Copies a matrix.
 * @param {tdl.math.Matrix} m The matrix.
 * @return {tdl.math.Matrix} A copy of m.
 */
tdl.math.copyMatrix = function(m) {
  var r = [];
  var mLength = m.length;
  for (var i = 0; i < mLength; ++i) {
    r[i] = m[i];
  }
  return r;
};

/**
 * Multiplies two scalars.
 * @param {number} a Operand scalar.
 * @param {number} b Operand scalar.
 * @return {number} The product of a and b.
 */
tdl.math.mulScalarScalar = function(a, b) {
  return a * b;
};

/**
 * Multiplies a scalar by a vector.
 * @param {number} k The scalar.
 * @param {tdl.math.Vector} v The vector.
 * @return {tdl.math.Vector} The product of k and v.
 */
tdl.math.mulScalarVector = function(k, v) {
  var r = [];
  var vLength = v.length;
  for (var i = 0; i < vLength; ++i) {
    r[i] = k * v[i];
  }
  return r;
};

/**
 * Multiplies a vector by a scalar.
 * @param {tdl.math.Vector} v The vector.
 * @param {number} k The scalar.
 * @return {tdl.math.Vector} The product of k and v.
 */
tdl.math.mulVectorScalar = function(v, k) {
  return tdl.math.mulScalarVector(k, v);
};

/**
 * Multiplies a scalar by a matrix.
 * @param {number} k The scalar.
 * @param {tdl.math.Matrix} m The matrix.
 * @return {tdl.math.Matrix} The product of m and k.
 */
tdl.math.mulScalarMatrix = function(k, m) {
  var r = [];
  var mLength = m.length;
  for (var i = 0; i < mLength; ++i) {
    r[i] = k * m[i];
  }
  return r;
};

/**
 * Multiplies a matrix by a scalar.
 * @param {tdl.math.Matrix} m The matrix.
 * @param {number} k The scalar.
 * @return {tdl.math.Matrix} The product of m and k.
 */
tdl.math.mulMatrixScalar = function(m, k) {
  return tdl.math.mulScalarMatrix(k, m);
};

/**
 * Multiplies a vector by another vector (component-wise); assumes a and
 * b have the same length.
 * @param {tdl.math.Vector} a Operand vector.
 * @param {tdl.math.Vector} b Operand vector.
 * @return {tdl.math.Vector} The vector of products of entries of a and
 *     b.
 */
tdl.math.mulVectorVector = function(a, b) {
  var r = [];
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r[i] = a[i] * b[i];
  return r;
};

/**
 * Divides a vector by another vector (component-wise); assumes a and
 * b have the same length.
 * @param {tdl.math.Vector} a Operand vector.
 * @param {tdl.math.Vector} b Operand vector.
 * @return {tdl.math.Vector} The vector of quotients of entries of a and
 *     b.
 */
tdl.math.divVectorVector = function(a, b) {
  var r = [];
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r[i] = a[i] / b[i];
  return r;
};

/**
 * Multiplies a vector by a matrix; treats the vector as a row vector; assumes
 * matrix entries are accessed in [row][column] fashion.
 * @param {tdl.math.Vector} v The vector.
 * @param {tdl.math.Matrix} m The matrix.
 * @return {tdl.math.Vector} The product of v and m as a row vector.
 */
tdl.math.rowMajor.mulVectorMatrix4 = function(v, m) {
  var r = [];
  for (var i = 0; i < 4; ++i) {
    r[i] = 0.0;
    for (var j = 0; j < 4; ++j)
      r[i] += v[j] * m[j * 4 + i];
  }
  return r;
};

/**
 * Multiplies a vector by a matrix; treats the vector as a row vector; assumes
 * matrix entries are accessed in [column][row] fashion.
 * @param {tdl.math.Vector} v The vector.
 * @param {tdl.math.Matrix} m The matrix.
 * @return {tdl.math.Vector} The product of v and m as a row vector.
 */
tdl.math.columnMajor.mulVectorMatrix = function(v, m) {
  var r = [];
  for (var i = 0; i < 4; ++i) {
    r[i] = 0.0;
    for (var j = 0; j < 4; ++j)
      r[i] += v[j] * r[i * 4 +  j];
  }
  return r;
};

/**
 * Multiplies a vector by a matrix; treats the vector as a row vector.
 * @param {tdl.math.Matrix} m The matrix.
 * @param {tdl.math.Vector} v The vector.
 * @return {tdl.math.Vector} The product of m and v as a row vector.
 */
tdl.math.mulVectorMatrix = null;

/**
 * Multiplies a matrix by a vector; treats the vector as a column vector.
 * assumes matrix entries are accessed in [row][column] fashion.
 * @param {tdl.math.Matrix} m The matrix.
 * @param {tdl.math.Vector} v The vector.
 * @return {tdl.math.Vector} The product of m and v as a column vector.
 */
tdl.math.rowMajor.mulMatrixVector = function(m, v) {
  var r = [];
  for (var i = 0; i < 4; ++i) {
    r[i] = 0.0;
    for (var j = 0; j < 4; ++j)
      r[i] += m[i * 4 + j] * v[j];
  }
  return r;
};

/**
 * Multiplies a matrix by a vector; treats the vector as a column vector;
 * assumes matrix entries are accessed in [column][row] fashion.
 * @param {tdl.math.Matrix} m The matrix.
 * @param {tdl.math.Vector} v The vector.
 * @return {tdl.math.Vector} The product of m and v as a column vector.
 */
tdl.math.columnMajor.mulMatrixVector = function(m, v) {
  var r = [];
  for (var i = 0; i < 4; ++i) {
    r[i] = 0.0;
    for (var j = 0; j < 4; ++j)
      r[i] += v[j] * m[j * 4 + i];
  }
  return r;
};

/**
 * Multiplies a matrix by a vector; treats the vector as a column vector.
 * @param {tdl.math.Matrix} m The matrix.
 * @param {tdl.math.Vector} v The vector.
 * @return {tdl.math.Vector} The product of m and v as a column vector.
 */
tdl.math.mulMatrixVector = null;

/**
 * Multiplies two 2-by-2 matrices; assumes that the given matrices are 2-by-2;
 * assumes matrix entries are accessed in [row][column] fashion.
 * @param {tdl.math.Matrix2} a The matrix on the left.
 * @param {tdl.math.Matrix2} b The matrix on the right.
 * @return {tdl.math.Matrix2} The matrix product of a and b.
 */
tdl.math.rowMajor.mulMatrixMatrix2 = function(a, b) {
  var a00 = a[0*2+0];
  var a01 = a[0*2+1];
  var a10 = a[1*2+0];
  var a11 = a[1*2+1];
  var b00 = b[0*2+0];
  var b01 = b[0*2+1];
  var b10 = b[1*2+0];
  var b11 = b[1*2+1];
  return [a00 * b00 + a01 * b10, a00 * b01 + a01 * b11,
          a10 * b00 + a11 * b10, a10 * b01 + a11 * b11];
};

/**
 * Multiplies two 2-by-2 matrices; assumes that the given matrices are 2-by-2;
 * assumes matrix entries are accessed in [column][row] fashion.
 * @param {tdl.math.Matrix2} a The matrix on the left.
 * @param {tdl.math.Matrix2} b The matrix on the right.
 * @return {tdl.math.Matrix2} The matrix product of a and b.
 */
tdl.math.columnMajor.mulMatrixMatrix2 = function(a, b) {
  var a00 = a[0*2+0];
  var a01 = a[0*2+1];
  var a10 = a[1*2+0];
  var a11 = a[1*2+1];
  var b00 = b[0*2+0];
  var b01 = b[0*2+1];
  var b10 = b[1*2+0];
  var b11 = b[1*2+1];
  return [a00 * b00 + a10 * b01, a01 * b00 + a11 * b01,
          a00 * b10 + a10 * b11, a01 * b10 + a11 * b11];
};

/**
 * Multiplies two 2-by-2 matrices.
 * @param {tdl.math.Matrix2} a The matrix on the left.
 * @param {tdl.math.Matrix2} b The matrix on the right.
 * @return {tdl.math.Matrix2} The matrix product of a and b.
 */
tdl.math.mulMatrixMatrix2 = null;


/**
 * Multiplies two 3-by-3 matrices; assumes that the given matrices are 3-by-3;
 * assumes matrix entries are accessed in [row][column] fashion.
 * @param {tdl.math.Matrix3} a The matrix on the left.
 * @param {tdl.math.Matrix3} b The matrix on the right.
 * @return {tdl.math.Matrix3} The matrix product of a and b.
 */
tdl.math.rowMajor.mulMatrixMatrix3 = function(a, b) {
  var a00 = a[0*3+0];
  var a01 = a[0*3+1];
  var a02 = a[0*3+2];
  var a10 = a[1*3+0];
  var a11 = a[1*3+1];
  var a12 = a[1*3+2];
  var a20 = a[2*3+0];
  var a21 = a[2*3+1];
  var a22 = a[2*3+2];
  var b00 = b[0*3+0];
  var b01 = b[0*3+1];
  var b02 = b[0*3+2];
  var b10 = b[1*3+0];
  var b11 = b[1*3+1];
  var b12 = b[1*3+2];
  var b20 = b[2*3+0];
  var b21 = b[2*3+1];
  var b22 = b[2*3+2];
  return [a00 * b00 + a01 * b10 + a02 * b20,
          a00 * b01 + a01 * b11 + a02 * b21,
          a00 * b02 + a01 * b12 + a02 * b22,
          a10 * b00 + a11 * b10 + a12 * b20,
          a10 * b01 + a11 * b11 + a12 * b21,
          a10 * b02 + a11 * b12 + a12 * b22,
          a20 * b00 + a21 * b10 + a22 * b20,
          a20 * b01 + a21 * b11 + a22 * b21,
          a20 * b02 + a21 * b12 + a22 * b22];
};

/**
 * Multiplies two 3-by-3 matrices; assumes that the given matrices are 3-by-3;
 * assumes matrix entries are accessed in [column][row] fashion.
 * @param {tdl.math.Matrix3} a The matrix on the left.
 * @param {tdl.math.Matrix3} b The matrix on the right.
 * @return {tdl.math.Matrix3} The matrix product of a and b.
 */
tdl.math.columnMajor.mulMatrixMatrix3 = function(a, b) {
  var a00 = a[0*3+0];
  var a01 = a[0*3+1];
  var a02 = a[0*3+2];
  var a10 = a[1*3+0];
  var a11 = a[1*3+1];
  var a12 = a[1*3+2];
  var a20 = a[2*3+0];
  var a21 = a[2*3+1];
  var a22 = a[2*3+2];
  var b00 = b[0*3+0];
  var b01 = b[0*3+1];
  var b02 = b[0*3+2];
  var b10 = b[1*3+0];
  var b11 = b[1*3+1];
  var b12 = b[1*3+2];
  var b20 = b[2*3+0];
  var b21 = b[2*3+1];
  var b22 = b[2*3+2];
  return [a00 * b00 + a10 * b01 + a20 * b02,
          a01 * b00 + a11 * b01 + a21 * b02,
          a02 * b00 + a12 * b01 + a22 * b02,
          a00 * b10 + a10 * b11 + a20 * b12,
          a01 * b10 + a11 * b11 + a21 * b12,
          a02 * b10 + a12 * b11 + a22 * b12,
          a00 * b20 + a10 * b21 + a20 * b22,
          a01 * b20 + a11 * b21 + a21 * b22,
          a02 * b20 + a12 * b21 + a22 * b22];
};

/**
 * Multiplies two 3-by-3 matrices; assumes that the given matrices are 3-by-3.
 * @param {tdl.math.Matrix3} a The matrix on the left.
 * @param {tdl.math.Matrix3} b The matrix on the right.
 * @return {tdl.math.Matrix3} The matrix product of a and b.
 */
tdl.math.mulMatrixMatrix3 = null;

/**
 * Multiplies two 4-by-4 matrices; assumes that the given matrices are 4-by-4;
 * assumes matrix entries are accessed in [row][column] fashion.
 * @param {tdl.math.Matrix4} a The matrix on the left.
 * @param {tdl.math.Matrix4} b The matrix on the right.
 * @return {tdl.math.Matrix4} The matrix product of a and b.
 */
tdl.math.rowMajor.mulMatrixMatrix4 = function(a, b) {
  var a00 = a[0*4+0];
  var a01 = a[0*4+1];
  var a02 = a[0*4+2];
  var a03 = a[0*4+3];
  var a10 = a[1*4+0];
  var a11 = a[1*4+1];
  var a12 = a[1*4+2];
  var a13 = a[1*4+3];
  var a20 = a[2*4+0];
  var a21 = a[2*4+1];
  var a22 = a[2*4+2];
  var a23 = a[2*4+3];
  var a30 = a[3*4+0];
  var a31 = a[3*4+1];
  var a32 = a[3*4+2];
  var a33 = a[3*4+3];
  var b00 = b[0*4+0];
  var b01 = b[0*4+1];
  var b02 = b[0*4+2];
  var b03 = b[0*4+3];
  var b10 = b[1*4+0];
  var b11 = b[1*4+1];
  var b12 = b[1*4+2];
  var b13 = b[1*4+3];
  var b20 = b[2*4+0];
  var b21 = b[2*4+1];
  var b22 = b[2*4+2];
  var b23 = b[2*4+3];
  var b30 = b[3*4+0];
  var b31 = b[3*4+1];
  var b32 = b[3*4+2];
  var b33 = b[3*4+3];
  return [a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
          a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
          a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
          a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
          a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
          a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
          a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
          a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
          a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
          a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
          a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
          a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
          a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
          a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
          a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
          a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33];
};

/**
 * Multiplies two 4-by-4 matrices; assumes that the given matrices are 4-by-4;
 * assumes matrix entries are accessed in [column][row] fashion.
 * @param {tdl.math.Matrix4} a The matrix on the left.
 * @param {tdl.math.Matrix4} b The matrix on the right.
 * @return {tdl.math.Matrix4} The matrix product of a and b.
 */
tdl.math.columnMajor.mulMatrixMatrix4 = function(a, b) {
  var a00 = a[0*4+0];
  var a01 = a[0*4+1];
  var a02 = a[0*4+2];
  var a03 = a[0*4+3];
  var a10 = a[1*4+0];
  var a11 = a[1*4+1];
  var a12 = a[1*4+2];
  var a13 = a[1*4+3];
  var a20 = a[2*4+0];
  var a21 = a[2*4+1];
  var a22 = a[2*4+2];
  var a23 = a[2*4+3];
  var a30 = a[3*4+0];
  var a31 = a[3*4+1];
  var a32 = a[3*4+2];
  var a33 = a[3*4+3];
  var b00 = b[0*4+0];
  var b01 = b[0*4+1];
  var b02 = b[0*4+2];
  var b03 = b[0*4+3];
  var b10 = b[1*4+0];
  var b11 = b[1*4+1];
  var b12 = b[1*4+2];
  var b13 = b[1*4+3];
  var b20 = b[2*4+0];
  var b21 = b[2*4+1];
  var b22 = b[2*4+2];
  var b23 = b[2*4+3];
  var b30 = b[3*4+0];
  var b31 = b[3*4+1];
  var b32 = b[3*4+2];
  var b33 = b[3*4+3];
  return [a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03,
          a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03,
          a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03,
          a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03,
          a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13,
          a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13,
          a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13,
          a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13,
          a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23,
          a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23,
          a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23,
          a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23,
          a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33,
          a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33,
          a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33,
          a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33];
};

/**
 * Multiplies two 4-by-4 matrices; assumes that the given matrices are 4-by-4.
 * @param {tdl.math.Matrix4} a The matrix on the left.
 * @param {tdl.math.Matrix4} b The matrix on the right.
 * @return {tdl.math.Matrix4} The matrix product of a and b.
 */
tdl.math.mulMatrixMatrix4 = null;

/**
 * Multiplies two matrices; assumes that the sizes of the matrices are
 * appropriately compatible; assumes matrix entries are accessed in
 * [row][column] fashion.
 * @param {tdl.math.Matrix} a The matrix on the left.
 * @param {tdl.math.Matrix} b The matrix on the right.
 * @return {tdl.math.Matrix} The matrix product of a and b.
 */
tdl.math.rowMajor.mulMatrixMatrix = function(a, b) {
  var r = [];
  for (var i = 0; i < 4; ++i) {
    for (var j = 0; j < 4; ++j) {
      r[i*4+j] = 0.0;
      for (var k = 0; k < 4; ++k)
        r[i*4+j] += a[i*4+k] * b[k*4+j]; // kth row, jth column.
    }
  }
  return r;
};

/**
 * Multiplies two matrices; assumes that the sizes of the matrices are
 * appropriately compatible; assumes matrix entries are accessed in
 * [row][column] fashion.
 * @param {tdl.math.Matrix} a The matrix on the left.
 * @param {tdl.math.Matrix} b The matrix on the right.
 * @return {tdl.math.Matrix} The matrix product of a and b.
 */
tdl.math.columnMajor.mulMatrixMatrix = function(a, b) {
  var r = [];
  for (var i = 0; i < 4; ++i) {
    for (var j = 0; j < 4; ++j) {
      r[i*4+j] = 0.0;
      for (var k = 0; k < 4; ++k)
        r[i*4+j] += b[i*4+k] * a[k*4+j]; // kth column, jth row.
    }
  }
  return r;
};

/**
 * Multiplies two matrices; assumes that the sizes of the matrices are
 * appropriately compatible.
 * @param {tdl.math.Matrix} a The matrix on the left.
 * @param {tdl.math.Matrix} b The matrix on the right.
 * @return {tdl.math.Matrix} The matrix product of a and b.
 */
tdl.math.mulMatrixMatrix = null;

/**
 * Gets the jth column of the given matrix m; assumes matrix entries are
 * accessed in [row][column] fashion.
 * @param {tdl.math.Matrix} m The matrix.
 * @param {number} j The index of the desired column.
 * @return {tdl.math.Vector} The jth column of m as a vector.
 */
tdl.math.rowMajor.column = function(m, j) {
  var r = [];
  for (var i = 0; i < 4; ++i) {
    r[i] = m[i*4+j];
  }
  return r;
};

/**
 * Gets the jth column of the given matrix m; assumes matrix entries are
 * accessed in [column][row] fashion.
 * @param {tdl.math.Matrix} m The matrix.
 * @param {number} j The index of the desired column.
 * @return {tdl.math.Vector} The jth column of m as a vector.
 */
tdl.math.columnMajor.column = function(m, j) {
  var r = [];
  for (var i = 0; i < 4; ++i) {
    r[i] = m[j*4+i];
  }
  return r;
};

/**
 * Gets the jth column of the given matrix m.
 * @param {tdl.math.Matrix} m The matrix.
 * @param {number} j The index of the desired column.
 * @return {tdl.math.Vector} The jth column of m as a vector.
 */
tdl.math.column = null;

/**
 * Gets the ith row of the given matrix m; assumes matrix entries are
 * accessed in [row][column] fashion.
 * @param {tdl.math.Matrix} m The matrix.
 * @param {number} i The index of the desired row.
 * @return {tdl.math.Vector} The ith row of m.
 */
tdl.math.rowMajor.row = function(m, i) {
  var r = [];
  for (var j = 0; j < 4; ++j) {
    r[i] = m[i*4+j];
  }
  return r;
};

/**
 * Gets the ith row of the given matrix m; assumes matrix entries are
 * accessed in [column][row] fashion.
 * @param {tdl.math.Matrix} m The matrix.
 * @param {number} i The index of the desired row.
 * @param {number} opt_size Unknown (to dkogan)
 * @return {tdl.math.Vector} The ith row of m.
 */
tdl.math.columnMajor.row = function(m, i, opt_size) {
  opt_size = opt_size || 4;
  var r = [];
  for (var j = 0; j < opt_size; ++j) {
    r[j] = m[j*opt_size+i];
  }
  return r;
};

/**
 * Gets the ith row of the given matrix m.
 * @param {tdl.math.Matrix} m The matrix.
 * @param {number} i The index of the desired row.
 * @return {tdl.math.Vector} The ith row of m.
 */
tdl.math.row = null;

/**
 * Takes the transpose of a matrix.
 * @param {tdl.math.Matrix} m The matrix.
 * @return {tdl.math.Matrix} The transpose of m.
 */
tdl.math.transpose = function(m) {
  var r = [];
  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];

  r[ 0] = m00;
  r[ 1] = m10;
  r[ 2] = m20;
  r[ 3] = m30;
  r[ 4] = m01;
  r[ 5] = m11;
  r[ 6] = m21;
  r[ 7] = m31;
  r[ 8] = m02;
  r[ 9] = m12;
  r[10] = m22;
  r[11] = m32;
  r[12] = m03;
  r[13] = m13;
  r[14] = m23;
  r[15] = m33;
  return r;
};

/**
 * Computes the trace (sum of the diagonal entries) of a square matrix;
 * assumes m is square.
 * @param {tdl.math.Matrix} m The matrix.
 * @return {number} The trace of m.
 */
tdl.math.trace = function(m) {
  var r = 0.0;
  for (var i = 0; i < 4; ++i)
    r += m[i*4+i];
  return r;
};

/**
 * Computes the determinant of a 1-by-1 matrix.
 * @param {tdl.math.Matrix1} m The matrix.
 * @return {number} The determinant of m.
 */
tdl.math.det1 = function(m) {
  return m[0];
};

/**
 * Computes the determinant of a 2-by-2 matrix.
 * @param {tdl.math.Matrix2} m The matrix.
 * @return {number} The determinant of m.
 */
tdl.math.det2 = function(m) {
  return m[0*2+0] * m[1*2+1] - m[0*2+1] * m[1*2+0];
};

/**
 * Computes the determinant of a 3-by-3 matrix.
 * @param {tdl.math.Matrix3} m The matrix.
 * @return {number} The determinant of m.
 */
tdl.math.det3 = function(m) {
  return m[2*3+2] * (m[0*3+0] * m[1*3+1] - m[0*3+1] * m[1*3+0]) -
         m[2*3+1] * (m[0*3+0] * m[1*3+2] - m[0*3+2] * m[1*3+0]) +
         m[2*3+0] * (m[0*3+1] * m[1*3+2] - m[0*3+2] * m[1*3+1]);
};

/**
 * Computes the determinant of a 4-by-4 matrix.
 * @param {tdl.math.Matrix4} m The matrix.
 * @return {number} The determinant of m.
 */
tdl.math.det4 = function(m) {
  var t01 = m[0*4+0] * m[1*4+1] - m[0*4+1] * m[1*4+0];
  var t02 = m[0*4+0] * m[1*4+2] - m[0*4+2] * m[1*4+0];
  var t03 = m[0*4+0] * m[1*4+3] - m[0*4+3] * m[1*4+0];
  var t12 = m[0*4+1] * m[1*4+2] - m[0*4+2] * m[1*4+1];
  var t13 = m[0*4+1] * m[1*4+3] - m[0*4+3] * m[1*4+1];
  var t23 = m[0*4+2] * m[1*4+3] - m[0*4+3] * m[1*4+2];
  return m[3*4+3] * (m[2*4+2] * t01 - m[2*4+1] * t02 + m[2*4+0] * t12) -
         m[3*4+2] * (m[2*4+3] * t01 - m[2*4+1] * t03 + m[2*4+0] * t13) +
         m[3*4+1] * (m[2*4+3] * t02 - m[2*4+2] * t03 + m[2*4+0] * t23) -
         m[3*4+0] * (m[2*4+3] * t12 - m[2*4+2] * t13 + m[2*4+1] * t23);
};

/**
 * Computes the inverse of a 1-by-1 matrix.
 * @param {tdl.math.Matrix1} m The matrix.
 * @return {tdl.math.Matrix1} The inverse of m.
 */
tdl.math.inverse1 = function(m) {
  return [[1.0 / m[0]]];
};

/**
 * Computes the inverse of a 2-by-2 matrix.
 * @param {tdl.math.Matrix2} m The matrix.
 * @return {tdl.math.Matrix2} The inverse of m.
 */
tdl.math.inverse2 = function(m) {
  var d = 1.0 / (m[0*2+0] * m[1*2+1] - m[0*2+1] * m[1*2+0]);
  return [d * m[1*2+1], -d * m[0*2+1], -d * m[1*2+0], d * m[0*2+0]];
};

/**
 * Computes the inverse of a 3-by-3 matrix.
 * @param {tdl.math.Matrix3} m The matrix.
 * @return {tdl.math.Matrix3} The inverse of m.
 */
tdl.math.inverse3 = function(m) {
  var t00 = m[1*3+1] * m[2*3+2] - m[1*3+2] * m[2*3+1];
  var t10 = m[0*3+1] * m[2*3+2] - m[0*3+2] * m[2*3+1];
  var t20 = m[0*3+1] * m[1*3+2] - m[0*3+2] * m[1*3+1];
  var d = 1.0 / (m[0*3+0] * t00 - m[1*3+0] * t10 + m[2*3+0] * t20);
  return [ d * t00, -d * t10, d * t20,
          -d * (m[1*3+0] * m[2*3+2] - m[1*3+2] * m[2*3+0]),
           d * (m[0*3+0] * m[2*3+2] - m[0*3+2] * m[2*3+0]),
          -d * (m[0*3+0] * m[1*3+2] - m[0*3+2] * m[1*3+0]),
           d * (m[1*3+0] * m[2*3+1] - m[1*3+1] * m[2*3+0]),
          -d * (m[0*3+0] * m[2*3+1] - m[0*3+1] * m[2*3+0]),
           d * (m[0*3+0] * m[1*3+1] - m[0*3+1] * m[1*3+0])];
};

/**
 * Computes the inverse of a 4-by-4 matrix.
 * @param {tdl.math.Matrix4} m The matrix.
 * @return {tdl.math.Matrix4} The inverse of m.
 */
tdl.math.inverse4 = function(m) {
  var tmp_0 = m[2*4+2] * m[3*4+3];
  var tmp_1 = m[3*4+2] * m[2*4+3];
  var tmp_2 = m[1*4+2] * m[3*4+3];
  var tmp_3 = m[3*4+2] * m[1*4+3];
  var tmp_4 = m[1*4+2] * m[2*4+3];
  var tmp_5 = m[2*4+2] * m[1*4+3];
  var tmp_6 = m[0*4+2] * m[3*4+3];
  var tmp_7 = m[3*4+2] * m[0*4+3];
  var tmp_8 = m[0*4+2] * m[2*4+3];
  var tmp_9 = m[2*4+2] * m[0*4+3];
  var tmp_10 = m[0*4+2] * m[1*4+3];
  var tmp_11 = m[1*4+2] * m[0*4+3];
  var tmp_12 = m[2*4+0] * m[3*4+1];
  var tmp_13 = m[3*4+0] * m[2*4+1];
  var tmp_14 = m[1*4+0] * m[3*4+1];
  var tmp_15 = m[3*4+0] * m[1*4+1];
  var tmp_16 = m[1*4+0] * m[2*4+1];
  var tmp_17 = m[2*4+0] * m[1*4+1];
  var tmp_18 = m[0*4+0] * m[3*4+1];
  var tmp_19 = m[3*4+0] * m[0*4+1];
  var tmp_20 = m[0*4+0] * m[2*4+1];
  var tmp_21 = m[2*4+0] * m[0*4+1];
  var tmp_22 = m[0*4+0] * m[1*4+1];
  var tmp_23 = m[1*4+0] * m[0*4+1];

  var t0 = (tmp_0 * m[1*4+1] + tmp_3 * m[2*4+1] + tmp_4 * m[3*4+1]) -
      (tmp_1 * m[1*4+1] + tmp_2 * m[2*4+1] + tmp_5 * m[3*4+1]);
  var t1 = (tmp_1 * m[0*4+1] + tmp_6 * m[2*4+1] + tmp_9 * m[3*4+1]) -
      (tmp_0 * m[0*4+1] + tmp_7 * m[2*4+1] + tmp_8 * m[3*4+1]);
  var t2 = (tmp_2 * m[0*4+1] + tmp_7 * m[1*4+1] + tmp_10 * m[3*4+1]) -
      (tmp_3 * m[0*4+1] + tmp_6 * m[1*4+1] + tmp_11 * m[3*4+1]);
  var t3 = (tmp_5 * m[0*4+1] + tmp_8 * m[1*4+1] + tmp_11 * m[2*4+1]) -
      (tmp_4 * m[0*4+1] + tmp_9 * m[1*4+1] + tmp_10 * m[2*4+1]);

  var d = 1.0 / (m[0*4+0] * t0 + m[1*4+0] * t1 + m[2*4+0] * t2 + m[3*4+0] * t3);

  return [d * t0, d * t1, d * t2, d * t3,
       d * ((tmp_1 * m[1*4+0] + tmp_2 * m[2*4+0] + tmp_5 * m[3*4+0]) -
          (tmp_0 * m[1*4+0] + tmp_3 * m[2*4+0] + tmp_4 * m[3*4+0])),
       d * ((tmp_0 * m[0*4+0] + tmp_7 * m[2*4+0] + tmp_8 * m[3*4+0]) -
          (tmp_1 * m[0*4+0] + tmp_6 * m[2*4+0] + tmp_9 * m[3*4+0])),
       d * ((tmp_3 * m[0*4+0] + tmp_6 * m[1*4+0] + tmp_11 * m[3*4+0]) -
          (tmp_2 * m[0*4+0] + tmp_7 * m[1*4+0] + tmp_10 * m[3*4+0])),
       d * ((tmp_4 * m[0*4+0] + tmp_9 * m[1*4+0] + tmp_10 * m[2*4+0]) -
          (tmp_5 * m[0*4+0] + tmp_8 * m[1*4+0] + tmp_11 * m[2*4+0])),
       d * ((tmp_12 * m[1*4+3] + tmp_15 * m[2*4+3] + tmp_16 * m[3*4+3]) -
          (tmp_13 * m[1*4+3] + tmp_14 * m[2*4+3] + tmp_17 * m[3*4+3])),
       d * ((tmp_13 * m[0*4+3] + tmp_18 * m[2*4+3] + tmp_21 * m[3*4+3]) -
          (tmp_12 * m[0*4+3] + tmp_19 * m[2*4+3] + tmp_20 * m[3*4+3])),
       d * ((tmp_14 * m[0*4+3] + tmp_19 * m[1*4+3] + tmp_22 * m[3*4+3]) -
          (tmp_15 * m[0*4+3] + tmp_18 * m[1*4+3] + tmp_23 * m[3*4+3])),
       d * ((tmp_17 * m[0*4+3] + tmp_20 * m[1*4+3] + tmp_23 * m[2*4+3]) -
          (tmp_16 * m[0*4+3] + tmp_21 * m[1*4+3] + tmp_22 * m[2*4+3])),
       d * ((tmp_14 * m[2*4+2] + tmp_17 * m[3*4+2] + tmp_13 * m[1*4+2]) -
          (tmp_16 * m[3*4+2] + tmp_12 * m[1*4+2] + tmp_15 * m[2*4+2])),
       d * ((tmp_20 * m[3*4+2] + tmp_12 * m[0*4+2] + tmp_19 * m[2*4+2]) -
          (tmp_18 * m[2*4+2] + tmp_21 * m[3*4+2] + tmp_13 * m[0*4+2])),
       d * ((tmp_18 * m[1*4+2] + tmp_23 * m[3*4+2] + tmp_15 * m[0*4+2]) -
          (tmp_22 * m[3*4+2] + tmp_14 * m[0*4+2] + tmp_19 * m[1*4+2])),
       d * ((tmp_22 * m[2*4+2] + tmp_16 * m[0*4+2] + tmp_21 * m[1*4+2]) -
          (tmp_20 * m[1*4+2] + tmp_23 * m[2*4+2] + tmp_17 * m[0*4+2]))];
};

/**
 * Computes the determinant of the cofactor matrix obtained by removal
 * of a specified row and column.  This is a helper function for the general
 * determinant and matrix inversion functions.
 * @param {tdl.math.Matrix} a The original matrix.
 * @param {number} x The row to be removed.
 * @param {number} y The column to be removed.
 * @return {number} The determinant of the matrix obtained by removing
 *     row x and column y from a.
 */
tdl.math.codet = function(a, x, y) {
  var size = 4;
  var b = [];
  var ai = 0;
  for (var bi = 0; bi < size - 1; ++bi) {
    if (ai == x)
      ai++;
    var aj = 0;
    for (var bj = 0; bj < size - 1; ++bj) {
      if (aj == y)
        aj++;
      b[bi*4+bj] = a[ai*4+aj];
      aj++;
    }
    ai++;
  }
  return tdl.math.det(b);
};

/**
 * Computes the determinant of an arbitrary square matrix.
 * @param {tdl.math.Matrix} m The matrix.
 * @return {number} the determinant of m.
 */
tdl.math.det = function(m) {
  var d = 4;
  if (d <= 4) {
    return tdl.math['det' + d](m);
  }
  var r = 0.0;
  var sign = 1;
  var row = m[0];
  var mLength = m.length;
  for (var y = 0; y < mLength; y++) {
    r += sign * row[y] * tdl.math.codet(m, 0, y);
    sign *= -1;
  }
  return r;
};

/**
 * Computes the inverse of an arbitrary square matrix.
 * @param {tdl.math.Matrix} m The matrix.
 * @return {tdl.math.Matrix} The inverse of m.
 */
tdl.math.inverse = function(m) {
  var d = 4;
  if (d <= 4) {
    return tdl.math['inverse' + d](m);
  }
  var r = [];
  var size = m.length;
  for (var j = 0; j < size; ++j) {
    r[j] = [];
    for (var i = 0; i < size; ++i)
      r[j][i] = ((i + j) % 2 ? -1 : 1) * tdl.math.codet(m, i, j);
  }
  return tdl.math.divMatrixScalar(r, tdl.math.det(m));
};

/**
 * Performs Graham-Schmidt orthogonalization on the vectors which make up the
 * given matrix and returns the result in the rows of a new matrix.  When
 * multiplying many orthogonal matrices together, errors can accumulate causing
 * the product to fail to be orthogonal.  This function can be used to correct
 * that.
 * @param {tdl.math.Matrix} m The matrix.
 * @return {tdl.math.Matrix} A matrix whose rows are obtained from the
 *     rows of m by the Graham-Schmidt process.
 */
tdl.math.orthonormalize = function(m) {
//  var r = [];
//  for (var i = 0; i < 4; ++i) {
//    var v = m[i];
//    for (var j = 0; j < i; ++j) {
//      v = tdl.math.subVector(v, tdl.math.mulScalarVector(
//          tdl.math.dot(r[j], m[i]), r[j]));
//    }
//    r[i] = tdl.math.normalize(v);
//  }
//  return r;
};

/**
 * Computes the inverse of a 4-by-4 matrix.
 * Note: It is faster to call this than tdl.math.inverse.
 * @param {tdl.math.Matrix4} m The matrix.
 * @return {tdl.math.Matrix4} The inverse of m.
 */
tdl.math.matrix4.inverse = function(m) {
  return tdl.math.inverse4(m);
};

/**
 * Multiplies two 4-by-4 matrices; assumes that the given matrices are 4-by-4.
 * Note: It is faster to call this than tdl.math.mul.
 * @param {tdl.math.Matrix4} a The matrix on the left.
 * @param {tdl.math.Matrix4} b The matrix on the right.
 * @return {tdl.math.Matrix4} The matrix product of a and b.
 */
tdl.math.matrix4.mul = function(a, b) {
  return tdl.math.mulMatrixMatrix4(a, b);
};

/**
 * Computes the determinant of a 4-by-4 matrix.
 * Note: It is faster to call this than tdl.math.det.
 * @param {tdl.math.Matrix4} m The matrix.
 * @return {number} The determinant of m.
 */
tdl.math.matrix4.det = function(m) {
  return tdl.math.det4(m);
};

/**
 * Copies a Matrix4.
 * Note: It is faster to call this than tdl.math.copy.
 * @param {tdl.math.Matrix4} m The matrix.
 * @return {tdl.math.Matrix4} A copy of m.
 */
tdl.math.matrix4.copy = function(m) {
  return tdl.math.copyMatrix(m);
};

tdl.math.matrix4.transpose = tdl.math.transpose;

/**
 * Sets the upper 3-by-3 block of matrix a to the upper 3-by-3 block of matrix
 * b; assumes that a and b are big enough to contain an upper 3-by-3 block.
 * @param {tdl.math.Matrix4} a A matrix.
 * @param {tdl.math.Matrix3} b A 3-by-3 matrix.
 * @return {tdl.math.Matrix4} a once modified.
 */
tdl.math.matrix4.setUpper3x3 = function(a, b) {
  a[0*4+0] = b[0*3+0];
  a[0*4+1] = b[0*3+1];
  a[0*4+2] = b[0*3+2];
  a[1*4+0] = b[1*3+0];
  a[1*4+1] = b[1*3+1];
  a[1*4+2] = b[1*3+2];
  a[2*4+0] = b[2*3+0];
  a[2*4+1] = b[2*3+1];
  a[2*4+2] = b[2*3+2];

  return a;
};

/**
 * Returns a 3-by-3 matrix mimicking the upper 3-by-3 block of m; assumes m
 * is big enough to contain an upper 3-by-3 block.
 * @param {tdl.math.Matrix4} m The matrix.
 * @return {tdl.math.Matrix3} The upper 3-by-3 block of m.
 */
tdl.math.matrix4.getUpper3x3 = function(m) {
  return [
    m[0*4+0],
    m[0*4+1],
    m[0*4+2],
    m[1*4+0],
    m[1*4+1],
    m[1*4+2],
    m[2*4+0],
    m[2*4+1],
    m[2*4+2]
  ];
};

/**
 * Sets the translation component of a 4-by-4 matrix to the given
 * vector.
 * @param {tdl.math.Matrix4} a The matrix.
 * @param {(tdl.math.Vector3|tdl.math.Vector4)} v The vector.
 * @return {tdl.math.Matrix4} a once modified.
 */
tdl.math.matrix4.setTranslation = function(a, v) {
  a[12] = v[0];
  a[13] = v[1];
  a[14] = v[2];
  a[15] = 1;
  return a;
};

/**
 * Returns the translation component of a 4-by-4 matrix as a vector with 3
 * entries.
 * @param {tdl.math.Matrix4} m The matrix.
 * @return {tdl.math.Vector3} The translation component of m.
 */
tdl.math.matrix4.getTranslation = function(m) {
  return [m[12], m[13], m[14], m[15]];
};

/**
 * Takes a 4-by-4 matrix and a vector with 3 entries,
 * interprets the vector as a point, transforms that point by the matrix, and
 * returns the result as a vector with 3 entries.
 * @param {tdl.math.Matrix4} m The matrix.
 * @param {tdl.math.Vector3} v The point.
 * @return {tdl.math.Vector3} The transformed point.
 */
tdl.math.matrix4.transformPoint = function(m, v) {
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];
  var d = v0 * m[0*4+3] + v1 * m[1*4+3] + v2 * m[2*4+3] + m[3*4+3];
  return [(v0 * m[0*4+0] + v1 * m[1*4+0] + v2 * m[2*4+0] + m[3*4+0]) / d,
          (v0 * m[0*4+1] + v1 * m[1*4+1] + v2 * m[2*4+1] + m[3*4+1]) / d,
          (v0 * m[0*4+2] + v1 * m[1*4+2] + v2 * m[2*4+2] + m[3*4+2]) / d];
};

/**
 * Takes a 4-by-4 matrix and a vector with 4 entries, transforms that vector by
 * the matrix, and returns the result as a vector with 4 entries.
 * @param {tdl.math.Matrix4} m The matrix.
 * @param {tdl.math.Vector4} v The point in homogenous coordinates.
 * @return {tdl.math.Vector4} The transformed point in homogenous
 *     coordinates.
 */
tdl.math.matrix4.transformVector4 = function(m, v) {
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];
  var v3 = v[3];

  return [v0 * m[0*4+0] + v1 * m[1*4+0] + v2 * m[2*4+0] + v3 * m[3*4+0],
          v0 * m[0*4+1] + v1 * m[1*4+1] + v2 * m[2*4+1] + v3 * m[3*4+1],
          v0 * m[0*4+2] + v1 * m[1*4+2] + v2 * m[2*4+2] + v3 * m[3*4+2],
          v0 * m[0*4+3] + v1 * m[1*4+3] + v2 * m[2*4+3] + v3 * m[3*4+3]];
};

/**
 * Takes a 4-by-4 matrix and a vector with 3 entries, interprets the vector as a
 * direction, transforms that direction by the matrix, and returns the result;
 * assumes the transformation of 3-dimensional space represented by the matrix
 * is parallel-preserving, i.e. any combination of rotation, scaling and
 * translation, but not a perspective distortion. Returns a vector with 3
 * entries.
 * @param {tdl.math.Matrix4} m The matrix.
 * @param {tdl.math.Vector3} v The direction.
 * @return {tdl.math.Vector3} The transformed direction.
 */
tdl.math.matrix4.transformDirection = function(m, v) {
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];

  return [v0 * m[0*4+0] + v1 * m[1*4+0] + v2 * m[2*4+0],
          v0 * m[0*4+1] + v1 * m[1*4+1] + v2 * m[2*4+1],
          v0 * m[0*4+2] + v1 * m[1*4+2] + v2 * m[2*4+2]];
};

/**
 * Takes a 4-by-4 matrix m and a vector v with 3 entries, interprets the vector
 * as a normal to a surface, and computes a vector which is normal upon
 * transforming that surface by the matrix. The effect of this function is the
 * same as transforming v (as a direction) by the inverse-transpose of m.  This
 * function assumes the transformation of 3-dimensional space represented by the
 * matrix is parallel-preserving, i.e. any combination of rotation, scaling and
 * translation, but not a perspective distortion.  Returns a vector with 3
 * entries.
 * @param {tdl.math.Matrix4} m The matrix.
 * @param {tdl.math.Vector3} v The normal.
 * @return {tdl.math.Vector3} The transformed normal.
 */
tdl.math.matrix4.transformNormal = function(m, v) {
  var mi = tdl.math.inverse4(m);
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];

  return [v0 * mi[0*4+0] + v1 * mi[0*4+1] + v2 * mi[0*4+2],
          v0 * mi[1*4+0] + v1 * mi[1*4+1] + v2 * mi[1*4+2],
          v0 * mi[2*4+0] + v1 * mi[2*4+1] + v2 * mi[2*4+2]];
};

/**
 * Creates a 4-by-4 identity matrix.
 * @return {tdl.math.Matrix4} The 4-by-4 identity.
 */
tdl.math.matrix4.identity = function() {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
};

/**
 * Sets the given 4-by-4 matrix to the identity matrix.
 * @param {tdl.math.Matrix4} m The matrix to set to identity.
 * @return {tdl.math.Matrix4} m once modified.
 */
tdl.math.matrix4.setIdentity = function(m) {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (i == j) {
        m[i*4+j] = 1;
      } else {
        m[i*4+j] = 0;
      }
    }
  }
  return m;
};

/**
 * Computes a 4-by-4 perspective transformation matrix given the angular height
 * of the frustum, the aspect ratio, and the near and far clipping planes.  The
 * arguments define a frustum extending in the negative z direction.  The given
 * angle is the vertical angle of the frustum, and the horizontal angle is
 * determined to produce the given aspect ratio.  The arguments near and far are
 * the distances to the near and far clipping planes.  Note that near and far
 * are not z coordinates, but rather they are distances along the negative
 * z-axis.  The matrix generated sends the viewing frustum to the unit box.
 * We assume a unit box extending from -1 to 1 in the x and y dimensions and
 * from 0 to 1 in the z dimension.
 * @param {number} angle The camera angle from top to bottom (in radians).
 * @param {number} aspect The aspect ratio width / height.
 * @param {number} zNear The depth (negative z coordinate)
 *     of the near clipping plane.
 * @param {number} zFar The depth (negative z coordinate)
 *     of the far clipping plane.
 * @return {tdl.math.Matrix4} The perspective matrix.
 */
tdl.math.matrix4.perspective = function(angle, aspect, zNear, zFar) {
  var f = Math.tan(Math.PI * 0.5 - 0.5 * angle);
  var rangeInv = 1.0 / (zNear - zFar);

  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (zNear + zFar) * rangeInv, -1,
    0, 0, zNear * zFar * rangeInv * 2, 0
  ];
};

/**
 * Computes a 4-by-4 orthographic projection matrix given the coordinates of the
 * planes defining the axis-aligned, box-shaped viewing volume.  The matrix
 * generated sends that box to the unit box.  Note that although left and right
 * are x coordinates and bottom and top are y coordinates, near and far
 * are not z coordinates, but rather they are distances along the negative
 * z-axis.  We assume a unit box extending from -1 to 1 in the x and y
 * dimensions and from 0 to 1 in the z dimension.
 * @param {number} left The x coordinate of the left plane of the box.
 * @param {number} right The x coordinate of the right plane of the box.
 * @param {number} bottom The y coordinate of the bottom plane of the box.
 * @param {number} top The y coordinate of the right plane of the box.
 * @param {number} near The negative z coordinate of the near plane of the box.
 * @param {number} far The negative z coordinate of the far plane of the box.
 * @return {tdl.math.Matrix4} The orthographic projection matrix.
 */
tdl.math.matrix4.orthographic =
    function(left, right, bottom, top, near, far) {
  return [
    2 / (right - left), 0, 0, 0,
    0, 2 / (top - bottom), 0, 0,
    0, 0, 1 / (near - far), 0,
    (left + right) / (left - right),
    (bottom + top) / (bottom - top),
    near / (near - far), 1
  ];
};

/**
 * Computes a 4-by-4 perspective transformation matrix given the left, right,
 * top, bottom, near and far clipping planes. The arguments define a frustum
 * extending in the negative z direction. The arguments near and far are the
 * distances to the near and far clipping planes. Note that near and far are not
 * z coordinates, but rather they are distances along the negative z-axis. The
 * matrix generated sends the viewing frustum to the unit box. We assume a unit
 * box extending from -1 to 1 in the x and y dimensions and from 0 to 1 in the z
 * dimension.
 * @param {number} left The x coordinate of the left plane of the box.
 * @param {number} right The x coordinate of the right plane of the box.
 * @param {number} bottom The y coordinate of the bottom plane of the box.
 * @param {number} top The y coordinate of the right plane of the box.
 * @param {number} near The negative z coordinate of the near plane of the box.
 * @param {number} far The negative z coordinate of the far plane of the box.
 * @return {tdl.math.Matrix4} The perspective projection matrix.
 */
tdl.math.matrix4.frustum = function(left, right, bottom, top, near, far) {
  var dx = (right - left);
  var dy = (top - bottom);
  var dz = (near - far);
  return [
    2 * near / dx, 0, 0, 0,
    0, 2 * near / dy, 0, 0,
    (left + right) / dx, (top + bottom) / dy, far / dz, -1,
    0, 0, near * far / dz, 0];
};

/**
 * Computes a 4-by-4 look-at transformation.  The transformation generated is
 * an orthogonal rotation matrix with translation component.  The translation
 * component sends the eye to the origin.  The rotation component sends the
 * vector pointing from the eye to the target to a vector pointing in the
 * negative z direction, and also sends the up vector into the upper half of
 * the yz plane.
 * @param {(tdl.math.Vector3|tdl.math.Vector4)} eye The position
 *     of the eye.
 * @param {(tdl.math.Vector3|tdl.math.Vector4)} target The
 *     position meant to be viewed.
 * @param {(tdl.math.Vector3|tdl.math.Vector4)} up A vector
 *     pointing up.
 * @return {tdl.math.Matrix4} The look-at matrix.
 */
tdl.math.matrix4.lookAt = function(eye, target, up) {
  return tdl.math.inverse(tdl.math.matrix4.cameraLookAt(
      eye, target, up));
};

/**
 * Computes a 4-by-4 camera look-at transformation. This is the
 * inverse of lookAt The transformation generated is an
 * orthogonal rotation matrix with translation component.
 * @param {(tdl.math.Vector3|tdl.math.Vector4)} eye The position
 *     of the eye.
 * @param {(tdl.math.Vector3|tdl.math.Vector4)} target The
 *     position meant to be viewed.
 * @param {(tdl.math.Vector3|tdl.math.Vector4)} up A vector
 *     pointing up.
 * @return {tdl.math.Matrix4} The camera look-at matrix.
 */
tdl.math.matrix4.cameraLookAt = function(eye, target, up) {
  var vz = tdl.math.normalize(
      tdl.math.subVector(eye, target));
  var vx = tdl.math.normalize(
      tdl.math.cross(up, vz));
  var vy = tdl.math.cross(vz, vx);

  return tdl.math.inverse([
     vx[0], vx[1], vx[2], 0,
     vy[0], vy[1], vy[2], 0,
     vz[0], vz[1], vz[2], 0,
     -tdl.math.dot(vx, eye),
     -tdl.math.dot(vy, eye),
     -tdl.math.dot(vz, eye), 1]);
};

/**
 * Takes two 4-by-4 matrices, a and b, and computes the product in the order
 * that pre-composes b with a.  In other words, the matrix returned will
 * transform by b first and then a.  Note this is subtly different from just
 * multiplying the matrices together.  For given a and b, this function returns
 * the same object in both row-major and column-major mode.
 * @param {tdl.math.Matrix4} a A 4-by-4 matrix.
 * @param {tdl.math.Matrix4} b A 4-by-4 matrix.
 * @return {tdl.math.Matrix4} the composition of a and b, b first then a.
 */
tdl.math.matrix4.composition = function(a, b) {
  var a00 = a[0*4+0];
  var a01 = a[0*4+1];
  var a02 = a[0*4+2];
  var a03 = a[0*4+3];
  var a10 = a[1*4+0];
  var a11 = a[1*4+1];
  var a12 = a[1*4+2];
  var a13 = a[1*4+3];
  var a20 = a[2*4+0];
  var a21 = a[2*4+1];
  var a22 = a[2*4+2];
  var a23 = a[2*4+3];
  var a30 = a[3*4+0];
  var a31 = a[3*4+1];
  var a32 = a[3*4+2];
  var a33 = a[3*4+3];
  var b00 = b[0*4+0];
  var b01 = b[0*4+1];
  var b02 = b[0*4+2];
  var b03 = b[0*4+3];
  var b10 = b[1*4+0];
  var b11 = b[1*4+1];
  var b12 = b[1*4+2];
  var b13 = b[1*4+3];
  var b20 = b[2*4+0];
  var b21 = b[2*4+1];
  var b22 = b[2*4+2];
  var b23 = b[2*4+3];
  var b30 = b[3*4+0];
  var b31 = b[3*4+1];
  var b32 = b[3*4+2];
  var b33 = b[3*4+3];
  return [a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03,
          a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03,
          a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03,
          a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03,
          a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13,
          a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13,
          a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13,
          a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13,
          a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23,
          a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23,
          a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23,
          a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23,
          a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33,
          a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33,
          a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33,
          a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33];
};

/**
 * Takes two 4-by-4 matrices, a and b, and modifies a to be the product in the
 * order that pre-composes b with a.  The matrix a, upon modification will
 * transform by b first and then a.  Note this is subtly different from just
 * multiplying the matrices together.  For given a and b, a, upon modification,
 * will be the same object in both row-major and column-major mode.
 * @param {tdl.math.Matrix4} a A 4-by-4 matrix.
 * @param {tdl.math.Matrix4} b A 4-by-4 matrix.
 * @return {tdl.math.Matrix4} a once modified.
 */
tdl.math.matrix4.compose = function(a, b) {
  var a00 = a[0*4+0];
  var a01 = a[0*4+1];
  var a02 = a[0*4+2];
  var a03 = a[0*4+3];
  var a10 = a[1*4+0];
  var a11 = a[1*4+1];
  var a12 = a[1*4+2];
  var a13 = a[1*4+3];
  var a20 = a[2*4+0];
  var a21 = a[2*4+1];
  var a22 = a[2*4+2];
  var a23 = a[2*4+3];
  var a30 = a[3*4+0];
  var a31 = a[3*4+1];
  var a32 = a[3*4+2];
  var a33 = a[3*4+3];
  var b00 = b[0*4+0];
  var b01 = b[0*4+1];
  var b02 = b[0*4+2];
  var b03 = b[0*4+3];
  var b10 = b[1*4+0];
  var b11 = b[1*4+1];
  var b12 = b[1*4+2];
  var b13 = b[1*4+3];
  var b20 = b[2*4+0];
  var b21 = b[2*4+1];
  var b22 = b[2*4+2];
  var b23 = b[2*4+3];
  var b30 = b[3*4+0];
  var b31 = b[3*4+1];
  var b32 = b[3*4+2];
  var b33 = b[3*4+3];
  a[ 0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
  a[ 1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
  a[ 2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
  a[ 3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
  a[ 4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
  a[ 5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
  a[ 6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
  a[ 7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
  a[ 8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
  a[ 9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
  a[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
  a[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
  a[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
  a[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
  a[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
  a[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;
  return a;
};

/**
 * Creates a 4-by-4 matrix which translates by the given vector v.
 * @param {(tdl.math.Vector3|tdl.math.Vector4)} v The vector by
 *     which to translate.
 * @return {tdl.math.Matrix4} The translation matrix.
 */
tdl.math.matrix4.translation = function(v) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    v[0], v[1], v[2], 1
  ];
};

/**
 * Modifies the given 4-by-4 matrix by translation by the given vector v.
 * @param {tdl.math.Matrix4} m The matrix.
 * @param {(tdl.math.Vector3|tdl.math.Vector4)} v The vector by
 *     which to translate.
 * @return {tdl.math.Matrix4} m once modified.
 */
tdl.math.matrix4.translate = function(m, v) {
  var m00 = m[0*4+0];
  var m01 = m[0*4+1];
  var m02 = m[0*4+2];
  var m03 = m[0*4+3];
  var m10 = m[1*4+0];
  var m11 = m[1*4+1];
  var m12 = m[1*4+2];
  var m13 = m[1*4+3];
  var m20 = m[2*4+0];
  var m21 = m[2*4+1];
  var m22 = m[2*4+2];
  var m23 = m[2*4+3];
  var m30 = m[3*4+0];
  var m31 = m[3*4+1];
  var m32 = m[3*4+2];
  var m33 = m[3*4+3];
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];

  m[12] = m00 * v0 + m10 * v1 + m20 * v2 + m30;
  m[13] = m01 * v0 + m11 * v1 + m21 * v2 + m31;
  m[14] = m02 * v0 + m12 * v1 + m22 * v2 + m32;
  m[15] = m03 * v0 + m13 * v1 + m23 * v2 + m33;

  return m;
};

/**
 * Creates a 4-by-4 matrix which scales in each dimension by an amount given by
 * the corresponding entry in the given vector; assumes the vector has three
 * entries.
 * @param {tdl.math.Vector3} v A vector of
 *     three entries specifying the factor by which to scale in each dimension.
 * @return {tdl.math.Matrix4} The scaling matrix.
 */
tdl.math.matrix4.scaling = function(v) {
  return [
    v[0], 0, 0, 0,
    0, v[1], 0, 0,
    0, 0, v[2], 0,
    0, 0, 0, 1
  ];
};

/**
 * Modifies the given 4-by-4 matrix, scaling in each dimension by an amount
 * given by the corresponding entry in the given vector; assumes the vector has
 * three entries.
 * @param {tdl.math.Matrix4} m The matrix to be modified.
 * @param {tdl.math.Vector3} v A vector of three entries specifying the
 *     factor by which to scale in each dimension.
 * @return {tdl.math.Matrix4} m once modified.
 */
tdl.math.matrix4.scale = function(m, v) {
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];

  m[0] = v0 * m[0*4+0];
  m[1] = v0 * m[0*4+1];
  m[2] = v0 * m[0*4+2];
  m[3] = v0 * m[0*4+3];
  m[4] = v1 * m[1*4+0];
  m[5] = v1 * m[1*4+1];
  m[6] = v1 * m[1*4+2];
  m[7] = v1 * m[1*4+3];
  m[8] = v2 * m[2*4+0];
  m[9] = v2 * m[2*4+1];
  m[10] = v2 * m[2*4+2];
  m[11] = v2 * m[2*4+3];

  return m;
};

/**
 * Creates a 4-by-4 matrix which rotates around the x-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.math.Matrix4} The rotation matrix.
 */
tdl.math.matrix4.rotationX = function(angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return [
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  ];
};

/**
 * Modifies the given 4-by-4 matrix by a rotation around the x-axis by the given
 * angle.
 * @param {tdl.math.Matrix4} m The matrix.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.math.Matrix4} m once modified.
 */
tdl.math.matrix4.rotateX = function(m, angle) {
  var m10 = m[1*4+0];
  var m11 = m[1*4+1];
  var m12 = m[1*4+2];
  var m13 = m[1*4+3];
  var m20 = m[2*4+0];
  var m21 = m[2*4+1];
  var m22 = m[2*4+2];
  var m23 = m[2*4+3];
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  m[4]  = c * m10 + s * m20;
  m[5]  = c * m11 + s * m21;
  m[6]  = c * m12 + s * m22;
  m[7]  = c * m13 + s * m23;
  m[8]  = c * m20 - s * m10;
  m[9]  = c * m21 - s * m11;
  m[10] = c * m22 - s * m12;
  m[11] = c * m23 - s * m13;

  return m;
};

/**
 * Creates a 4-by-4 matrix which rotates around the y-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.math.Matrix4} The rotation matrix.
 */
tdl.math.matrix4.rotationY = function(angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return [
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ];
};

/**
 * Modifies the given 4-by-4 matrix by a rotation around the y-axis by the given
 * angle.
 * @param {tdl.math.Matrix4} m The matrix.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.math.Matrix4} m once modified.
 */
tdl.math.matrix4.rotateY = function(m, angle) {
  var m00 = m[0*4+0];
  var m01 = m[0*4+1];
  var m02 = m[0*4+2];
  var m03 = m[0*4+3];
  var m20 = m[2*4+0];
  var m21 = m[2*4+1];
  var m22 = m[2*4+2];
  var m23 = m[2*4+3];
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  m[ 0] = c * m00 - s * m20;
  m[ 1] = c * m01 - s * m21;
  m[ 2] = c * m02 - s * m22;
  m[ 3] = c * m03 - s * m23;
  m[ 8] = c * m20 + s * m00;
  m[ 9] = c * m21 + s * m01;
  m[10] = c * m22 + s * m02;
  m[11] = c * m23 + s * m03;

  return m;
};

/**
 * Creates a 4-by-4 matrix which rotates around the z-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.math.Matrix4} The rotation matrix.
 */
tdl.math.matrix4.rotationZ = function(angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return [
    c, s, 0, 0,
    -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
};

/**
 * Modifies the given 4-by-4 matrix by a rotation around the z-axis by the given
 * angle.
 * @param {tdl.math.Matrix4} m The matrix.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.math.Matrix4} m once modified.
 */
tdl.math.matrix4.rotateZ = function(m, angle) {
  var m00 = m[0*4+0];
  var m01 = m[0*4+1];
  var m02 = m[0*4+2];
  var m03 = m[0*4+3];
  var m10 = m[1*4+0];
  var m11 = m[1*4+1];
  var m12 = m[1*4+2];
  var m13 = m[1*4+3];
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  m[ 0] = c * m00 + s * m10;
  m[ 1] = c * m01 + s * m11;
  m[ 2] = c * m02 + s * m12;
  m[ 3] = c * m03 + s * m13;
  m[ 4] = c * m10 - s * m00;
  m[ 5] = c * m11 - s * m01;
  m[ 6] = c * m12 - s * m02;
  m[ 7] = c * m13 - s * m03;

  return m;
};

/**
 * Creates a 4-by-4 rotation matrix.  Interprets the entries of the given
 * vector as angles by which to rotate around the x, y and z axes, returns a
 * a matrix which rotates around the x-axis first, then the y-axis, then the
 * z-axis.
 * @param {tdl.math.Vector3} v A vector of angles (in radians).
 * @return {tdl.math.Matrix4} The rotation matrix.
 */
tdl.math.matrix4.rotationZYX = function(v) {
  var sinx = Math.sin(v[0]);
  var cosx = Math.cos(v[0]);
  var siny = Math.sin(v[1]);
  var cosy = Math.cos(v[1]);
  var sinz = Math.sin(v[2]);
  var cosz = Math.cos(v[2]);

  var coszsiny = cosz * siny;
  var sinzsiny = sinz * siny;

  return [
    cosz * cosy, sinz * cosy, -siny, 0,
    coszsiny * sinx - sinz * cosx,
    sinzsiny * sinx + cosz * cosx,
    cosy * sinx,
    0,
    coszsiny * cosx + sinz * sinx,
    sinzsiny * cosx - cosz * sinx,
    cosy * cosx,
    0,
    0, 0, 0, 1
  ];
};

/**
 * Modifies a 4-by-4 matrix by a rotation.  Interprets the coordinates of the
 * given vector as angles by which to rotate around the x, y and z axes, rotates
 * around the x-axis first, then the y-axis, then the z-axis.
 * @param {tdl.math.Matrix4} m The matrix.
 * @param {tdl.math.Vector3} v A vector of angles (in radians).
 * @return {tdl.math.Matrix4} m once modified.
 */
tdl.math.matrix4.rotateZYX = function(m, v) {
  var sinX = Math.sin(v[0]);
  var cosX = Math.cos(v[0]);
  var sinY = Math.sin(v[1]);
  var cosY = Math.cos(v[1]);
  var sinZ = Math.sin(v[2]);
  var cosZ = Math.cos(v[2]);

  var cosZSinY = cosZ * sinY;
  var sinZSinY = sinZ * sinY;

  var r00 = cosZ * cosY;
  var r01 = sinZ * cosY;
  var r02 = -sinY;
  var r10 = cosZSinY * sinX - sinZ * cosX;
  var r11 = sinZSinY * sinX + cosZ * cosX;
  var r12 = cosY * sinX;
  var r20 = cosZSinY * cosX + sinZ * sinX;
  var r21 = sinZSinY * cosX - cosZ * sinX;
  var r22 = cosY * cosX;

  var m00 = m[0*4+0];
  var m01 = m[0*4+1];
  var m02 = m[0*4+2];
  var m03 = m[0*4+3];
  var m10 = m[1*4+0];
  var m11 = m[1*4+1];
  var m12 = m[1*4+2];
  var m13 = m[1*4+3];
  var m20 = m[2*4+0];
  var m21 = m[2*4+1];
  var m22 = m[2*4+2];
  var m23 = m[2*4+3];
  var m30 = m[3*4+0];
  var m31 = m[3*4+1];
  var m32 = m[3*4+2];
  var m33 = m[3*4+3];

  m[ 0] = r00 * m00 + r01 * m10 + r02 * m20;
  m[ 1] = r00 * m01 + r01 * m11 + r02 * m21;
  m[ 2] = r00 * m02 + r01 * m12 + r02 * m22;
  m[ 3] = r00 * m03 + r01 * m13 + r02 * m23;
  m[ 4] = r10 * m00 + r11 * m10 + r12 * m20;
  m[ 5] = r10 * m01 + r11 * m11 + r12 * m21;
  m[ 6] = r10 * m02 + r11 * m12 + r12 * m22;
  m[ 7] = r10 * m03 + r11 * m13 + r12 * m23;
  m[ 8] = r20 * m00 + r21 * m10 + r22 * m20;
  m[ 9] = r20 * m01 + r21 * m11 + r22 * m21;
  m[10] = r20 * m02 + r21 * m12 + r22 * m22;
  m[11] = r20 * m03 + r21 * m13 + r22 * m23;

  return m;
};

/**
 * Creates a 4-by-4 matrix which rotates around the given axis by the given
 * angle.
 * @param {(tdl.math.Vector3|tdl.math.Vector4)} axis The axis
 *     about which to rotate.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.math.Matrix4} A matrix which rotates angle radians
 *     around the axis.
 */
tdl.math.matrix4.axisRotation = function(axis, angle) {
  var x = axis[0];
  var y = axis[1];
  var z = axis[2];
  var n = Math.sqrt(x * x + y * y + z * z);
  x /= n;
  y /= n;
  z /= n;
  var xx = x * x;
  var yy = y * y;
  var zz = z * z;
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var oneMinusCosine = 1 - c;

  return [
    xx + (1 - xx) * c,
    x * y * oneMinusCosine + z * s,
    x * z * oneMinusCosine - y * s,
    0,
    x * y * oneMinusCosine - z * s,
    yy + (1 - yy) * c,
    y * z * oneMinusCosine + x * s,
    0,
    x * z * oneMinusCosine + y * s,
    y * z * oneMinusCosine - x * s,
    zz + (1 - zz) * c,
    0,
    0, 0, 0, 1
  ];
};

/**
 * Modifies the given 4-by-4 matrix by rotation around the given axis by the
 * given angle.
 * @param {tdl.math.Matrix4} m The matrix.
 * @param {(tdl.math.Vector3|tdl.math.Vector4)} axis The axis
 *     about which to rotate.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {tdl.math.Matrix4} m once modified.
 */
tdl.math.matrix4.axisRotate = function(m, axis, angle) {
  var x = axis[0];
  var y = axis[1];
  var z = axis[2];
  var n = Math.sqrt(x * x + y * y + z * z);
  x /= n;
  y /= n;
  z /= n;
  var xx = x * x;
  var yy = y * y;
  var zz = z * z;
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var oneMinusCosine = 1 - c;

  var r00 = xx + (1 - xx) * c;
  var r01 = x * y * oneMinusCosine + z * s;
  var r02 = x * z * oneMinusCosine - y * s;
  var r10 = x * y * oneMinusCosine - z * s;
  var r11 = yy + (1 - yy) * c;
  var r12 = y * z * oneMinusCosine + x * s;
  var r20 = x * z * oneMinusCosine + y * s;
  var r21 = y * z * oneMinusCosine - x * s;
  var r22 = zz + (1 - zz) * c;

  var m00 = m[0*4+0];
  var m01 = m[0*4+1];
  var m02 = m[0*4+2];
  var m03 = m[0*4+3];
  var m10 = m[1*4+0];
  var m11 = m[1*4+1];
  var m12 = m[1*4+2];
  var m13 = m[1*4+3];
  var m20 = m[2*4+0];
  var m21 = m[2*4+1];
  var m22 = m[2*4+2];
  var m23 = m[2*4+3];
  var m30 = m[3*4+0];
  var m31 = m[3*4+1];
  var m32 = m[3*4+2];
  var m33 = m[3*4+3];

  m[ 0] = r00 * m00 + r01 * m10 + r02 * m20;
  m[ 1] = r00 * m01 + r01 * m11 + r02 * m21;
  m[ 2] = r00 * m02 + r01 * m12 + r02 * m22;
  m[ 3] = r00 * m03 + r01 * m13 + r02 * m23;
  m[ 4] = r10 * m00 + r11 * m10 + r12 * m20;
  m[ 5] = r10 * m01 + r11 * m11 + r12 * m21;
  m[ 6] = r10 * m02 + r11 * m12 + r12 * m22;
  m[ 7] = r10 * m03 + r11 * m13 + r12 * m23;
  m[ 8] = r20 * m00 + r21 * m10 + r22 * m20;
  m[ 9] = r20 * m01 + r21 * m11 + r22 * m21;
  m[10] = r20 * m02 + r21 * m12 + r22 * m22;
  m[11] = r20 * m03 + r21 * m13 + r22 * m23;

  return m;
};

/**
 * Sets each function in the namespace tdl.math to the row major
 * version in tdl.math.rowMajor (provided such a function exists in
 * tdl.math.rowMajor).  Call this function to establish the row major
 * convention.
 */
tdl.math.installRowMajorFunctions = function() {
  for (var f in tdl.math.rowMajor) {
    tdl.math[f] = tdl.math.rowMajor[f];
  }
};

/**
 * Sets each function in the namespace tdl.math to the column major
 * version in tdl.math.columnMajor (provided such a function exists in
 * tdl.math.columnMajor).  Call this function to establish the column
 * major convention.
 */
tdl.math.installColumnMajorFunctions = function() {
  for (var f in tdl.math.columnMajor) {
    tdl.math[f] = tdl.math.columnMajor[f];
  }
};

/**
 * Sets each function in the namespace tdl.math to the error checking
 * version in tdl.math.errorCheck (provided such a function exists in
 * tdl.math.errorCheck).
 */
tdl.math.installErrorCheckFunctions = function() {
  for (var f in tdl.math.errorCheck) {
    tdl.math[f] = tdl.math.errorCheck[f];
  }
};

/**
 * Sets each function in the namespace tdl.math to the error checking free
 * version in tdl.math.errorCheckFree (provided such a function exists in
 * tdl.math.errorCheckFree).
 */
tdl.math.installErrorCheckFreeFunctions = function() {
  for (var f in tdl.math.errorCheckFree) {
    tdl.math[f] = tdl.math.errorCheckFree[f];
  }
}

// By default, install the row-major functions.
tdl.math.installRowMajorFunctions();

// By default, install prechecking.
tdl.math.installErrorCheckFunctions();

// return tdl.math;
// });


/** @license
 * --------------------------------------------------------------------------
 * glm-js | (c) humbletim | http://humbletim.github.io/glm-js
 * --------------------------------------------------------------------------
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2016 humbletim
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
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
// tdl fast.js GLM math adapter
// copyright(c) 2015 humbletim
// https://github.com/humbletim/glm-js
// MIT LICENSE
// ----------------------------------------------------------------------------

tdl.fast.exists;

glm = GLM;

var DLL = {
   vendor_name: "tdl-fast.js",
   vendor_version: "2009?",

   _name: 'glm.tdl-fast.js',
   _version: '0.0.2',

   prefix: 'glm-js[tdl-fast]: '
};

DLL['statics'] = {
   mat4_perspective: function(fov, aspect, near, far) {
      return glm.mat4(
         tdl.fast.matrix4.perspective(new Float32Array(16),
                                      fov, aspect, near, far)
      );
   },
   // NOTE: the original tdl.fast.matrix4.ortho didn't match up with GLM C++ results
   //    (not sure if an actual diff or just different way of expression same thing...
   //     for now using patched version below that matches GLM)
   _FIXME_mat4_ortho: function(left, right, bottom, top, near, far) {
      near = near || -1;
      far = far || 1;
      var tmp = new glm.mat4(
         tdl.fast.matrix4.ortho(new Float32Array(16),
                                left, right, bottom, top, near, far)
      );
      return tmp;
   },
   mat4_ortho: function(left, right, bottom, top, near, far) {
      near = near || -1;
      far = far || 1;
      var m = new glm.mat4(0),
          dst = m.elements;

       dst[0]  = 2 / (right - left);
       dst[5]  = 2 / (top - bottom);

       // was: dst[10] = -1 / (far - near);
       dst[10] = -2 / (far - near);

       dst[12] = (right + left) / (left - right);
       dst[13] = (top + bottom) / (bottom - top);

       // was: dst[14] = -near / (near - far);
       dst[14] = (far + near) / (near - far);

       dst[15] = 1;
       return m;
   },
   mat4_angleAxis: function(theta, axis) {
      return glm.mat4(
         tdl.fast.matrix4.axisRotation(new Float32Array(16), axis.elements, theta)
      );
   },
   quat_angleAxis: function(angle, axis) {
      var q = tdl.quaternions.axisRotation(axis.elements, angle);
      return new glm.quat(q);//throw new Error(q);
   },
   mat4_translation: function(v) {
      return glm.mat4(tdl.fast.matrix4.translation(new Float32Array(16), v.elements));
   },
   mat4_scale: function(v) {
      return glm.mat4(tdl.fast.matrix4.scaling(new Float32Array(16), v.elements));
   },
   //          _inverse_transpose: function(m) {
   //             return m;
   //             var m = tdl.fast.matrix4.transpose(
   //                new Float32Array(16),
   //                m
   //             );
   //             return tdl.fast.inverse4(new Float32Array(16),m);
   //          },
   mat4_array_from_quat: function(q) {
      return tdl.quaternions.quaternionToRotation(q.elements);
   },
   quat_array_from_mat4: function(o) {
      var arr = tdl.quaternions.rotationToQuaternion(o.elements);
      // FIXME: tdl doesn't handle the case of mat4(1) properly
      if (isNaN(arr[0]))
        return glm.quat.$.identity;
      return arr;
   }
}; //statics

DLL['declare<T,V,...>'] = {
   mul: {
      $op: '*',
      //note: tdl.fast has no mulQuaternionQuaternion(dst,a,b) yet
      _mulQuatQuat: tdl.quaternions.mulQuaternionQuaternion,
      'quat,quat': function(a,b) {
         return new glm.quat(this._mulQuatQuat(a.elements, b.elements));
      },
      'quat,vec<N>': function(a,b) { return this['mat4,vecN'](glm.toMat4(a), b); },
      'vec<N>,quat': function(a,b) { return this['quat,vecN'](glm.inverse(b), a); },
      _mulVecSca: tdl.fast.mulVectorScalar,
      'vec<N>,float': function(a,b) {
         return glm.vecN(
            this._mulVecSca(new Float32Array(N), a.elements, b));
      },
      'quat,float': function(a,b) { return new (a.constructor)(this['vec4,float'](a,b).elements); },
      'mat4,vec3': function(a,b) {
         b = new glm.vec4(b,1);
         var c = this['mat4,vec4'](a,b);
         return new glm.vec3(c);
      },
      _mulVecMat4: tdl.fast.rowMajor.mulVectorMatrix4,
      'mat4,vec4': function(a,b) {
         return glm.vec4(
            this._mulVecMat4(new Float32Array(4),
                             b.elements, a.elements)
         );
      },
      'vec4,mat4': function(a,b) { return this['mat4,vec4'](glm.inverse(b),a); },
      '_mulMatMat<N>': 'tdl.fast.columnMajor.mulMatrixMatrixN',
      'mat<N>,mat<N>': function(a,b) {
         return glm.matN(
            this._mulMatMatN(new Float32Array(N*N),
                            a.elements, b.elements)
         );
      }
   },
   mul_eq: {
      $op: '*=',
      'vec<N>,float': function(a,b) {
         tdl.fast.mulVectorScalar(a.elements, a.elements, b);
         return a;
      },
      '_mulMatMat<N>': 'tdl.fast.columnMajor.mulMatrixMatrixN',
      'mat<N>,mat<N>': function(a,b) {
         this._mulMatMatN(a.elements,a.elements, b.elements);
         return a;
      },
      //note: tdl.fast has no mulQuaternionQuaternion(dst,a,b) yet
      _mulQuatQuat: tdl.quaternions.mulQuaternionQuaternion,
      'quat,quat': function(a,b) {
         a.elements.set(this._mulQuatQuat(a.elements, b.elements));
         return a;
      },
      _mulVecMat4: tdl.fast.rowMajor.mulVectorMatrix4,

      // note: this can be referenced as: glm.mul_eq.link('inplace:vec3,quat');
      'inplace:vec3,quat': function(a,b) {
         var m4 = glm.toMat4(glm.inverse(b)).elements;
         var v4 = glm.vec4(a,1).elements;
         this._mulVecMat4(a.elements, v4, m4);
         return a;
      },
      // note: this can be referenced as: glm.mul_eq.link('inplace:vec3,quat');
      'inplace:vec4,mat4': function(a,b) {
         var m4 = glm.inverse(b);
         // note: tdl-fast has a bug in mulVectorMatrix4 --
         //  dst and the input vector can't be the same (hence the Float32Array)
         this._mulVecMat4(a.elements, new Float32Array(a.elements), m4.elements);
         return a;
      }
   },
   cross: {
      _cross: tdl.fast.cross,
      'vec3,vec3': function(a,b) {
         return new glm.vec3(this._cross( new Float32Array(3), a, b));
      }
   },
   dot: {
      _dot: tdl.fast.dot,
      'vec3,vec3': function(a,b) {
         return this._dot(a,b);
      },
      _slowdot: tdl.math.dot,
      'vec4,vec4': function(a,b) {
         return this._slowdot(a,b);
      }
   },
   lookAt: {
      _lookAt: tdl.fast.matrix4.lookAt,
      'vec3,vec3': function(eye,target,up) {
	 return new glm.mat4(
	    this._lookAt(
	       new Float32Array(16),
	       eye.elements, target.elements, up.elements
	    ));
      }
   }
}; //operations

DLL['declare<T,V,number>'] = {
   mix: {
      "quat,quat": function(a,b,t) {
         //var _a=a,_b=b;
         a = a.elements;
         b = b.elements;
         var o = glm.quat(new Float32Array(4));
         var out = o.elements;

         { //http://jsperf.com/quaternion-slerp-implementations
            var ax = a[0], ay = a[1], az = a[2], aw = a[3],
            bx = b[0], by = b[1], bz = b[2], bw = b[3];

            var cosHalfTheta = ax * bx + ay * by + az * bz + aw * bw,
            halfTheta,
            sinHalfTheta,
            ratioA,
            ratioB;

            if (Math.abs(cosHalfTheta) >= 1.0) {
               if (out !== a) {
                  //console.warn([_a,_b]+'');
                  out[0] = ax;
                  out[1] = ay;
                  out[2] = az;
                  out[3] = aw;
               }
               return o;
            }

            halfTheta = Math.acos(cosHalfTheta);
            sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

            /*if (Math.abs(sinHalfTheta) < 0.001) {
                  out[0] = (ax * 0.5 + bx * 0.5);
                  out[1] = (ay * 0.5 + by * 0.5);
                  out[2] = (az * 0.5 + bz * 0.5);
                  out[3] = (aw * 0.5 + bw * 0.5);
                  return out;
               }*/

            ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
            ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

            out[0] = (ax * ratioA + bx * ratioB);
            out[1] = (ay * ratioA + by * ratioB);
            out[2] = (az * ratioA + bz * ratioB);
            out[3] = (aw * ratioA + bw * ratioB);
         }//http://jsperf.com/quaternion-slerp-implementations
         return o;
      }
   }
};//functions
DLL['declare<T,V,number>'].slerp = DLL['declare<T,V,number>'].mix;

DLL['declare<T>'] = {
   normalize: {
      'vec<N>': function(v) {
         return glm.vecN(tdl.fast.normalize(new Float32Array(N), v.elements));
      },
      quat: function(q) {
         return new glm.quat(tdl.quaternions.normalize(q.elements));
      },
   },
   length: {
      "vec<N>": function(v) { return tdl.math.length(v.elements); },
      quat: function(q) { return tdl.quaternions.length(q.elements); },
   },
   length2: {
      "vec<N>": function(v) { return tdl.math.lengthSquared(v.elements); },
      quat: function(q) { return tdl.quaternions.lengthSquared(q.elements); },
   },
   inverse: {
      quat: function(q) { return new glm.quat(tdl.quaternions.inverse(q.elements)); },
      //xmat4: function(m) { return glm.mat4(tdl.fast.inverse4(new Float32Array(16), m.elements)); },
      mat4: function(m) {
	 m=m.clone();
	 if (isNaN(tdl.fast.inverse4(m.elements, m.elements)[0]))
	    m['='](glm.mat4()); // no determinant; reset to identity
	 return m;
      }
   },
   transpose: {
      //xmat4: function(m) { return glm.mat4(tdl.fast.transpose4(new Float32Array(16), m.elements)); },
      mat4: function(m) { m=m.clone(); tdl.fast.transpose4(m.elements, m.elements); return m; }
   }
};//calculators

glm.$outer.$import(DLL);

try { module.exports = glm; } catch(e) {}
