/**
 * Converts degrees to radians.
 * @param {Number} degrees The angle in degrees.
 * @returns {Number} The angle in radians.
 */
export function radians(degrees) {
  return degrees * Math.PI / 180;
}

/**
 * Converts radians to degrees.
 * @param {Number} radians The angle in radians.
 * @returns {Number} The angle in degrees.
 */
export function degrees(radians) {
  return radians * 180 / Math.PI;
}
