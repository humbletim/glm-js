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


