/**
 * @module format
 * @description Provides functions for serializing GLM types to strings in a style that mimics the GLM-C++ library.
 */

/**
 * Converts a vector-like object to a GLM-C++ style string representation.
 *
 * @param {object} v - The vector-like object. It should have an `elements` property which is an array-like structure.
 * @param {number} [precision=6] - The number of decimal places for each component.
 * @returns {string} The string representation of the vector.
 */
export function toCppStringVec(v, precision = 6) {
  const elements = v.elements || v;
  const dim = elements.length;
  const prefix = `fvec${dim}`;

  const components = Array.from(elements).map(c => c.toFixed(precision));

  return `${prefix}(${components.join(', ')})`;
}

/**
 * Converts a matrix-like object to a GLM-C++ style string representation.
 *
 * @param {object} m - The matrix-like object. It should have an `elements` property which is an array-like structure.
 * @param {number} [precision=6] - The number of decimal places for each component.
 * @returns {string} The string representation of the matrix.
 */
export function toCppStringMat(m, precision = 6) {
  const elements = m.elements || m;
  const dim = Math.sqrt(elements.length);
  const prefix = `mat${dim}x${dim}`;

  const columns = [];
  for (let i = 0; i < dim; i++) {
    const start = i * dim;
    const end = start + dim;
    const columnElements = Array.from(elements.slice(start, end));
    const columnStrings = columnElements.map(c => c.toFixed(precision));
    columns.push(`(${columnStrings.join(', ')})`);
  }

  return `${prefix}(\n\t${columns.join(',\n\t')}\n)`;
}

/**
 * Converts a quaternion-like object to a GLM-C++ style string representation.
 *
 * @param {object} q - The quaternion-like object. It should have `w`, `x`, `y`, and `z` properties.
 * @param {number} [precision=6] - The number of decimal places for each component.
 * @returns {string} The string representation of the quaternion.
 */
export function toCppStringQuat(q, precision = 6) {
  const w = q.w.toFixed(precision);
  const x = q.x.toFixed(precision);
  const y = q.y.toFixed(precision);
  const z = q.z.toFixed(precision);

  return `quat(${w}, {${x}, ${y}, ${z}})`;
}
