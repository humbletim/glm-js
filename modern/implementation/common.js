import { quat } from './quat.js';
/**
 * Converts degrees to radians.
 * @param {Number} degrees The angle in degrees.
 * @returns {Number} The angle in radians.
 */
export function radians(degrees) {
  // TODO support glm.vec3 input etc.
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

export const pi = Math.PI;
export const half_pi = Math.PI / 2;
export const quarter_pi = Math.PI / 4;
export const one_over_pi = 1 / Math.PI;
export const two_over_pi = 2 / Math.PI;
export const root_pi = Math.sqrt(Math.PI);
export const two_over_root_pi = 2 / Math.sqrt(Math.PI);

export const root_two = Math.sqrt(2);
export const one_over_root_two = 1 / Math.sqrt(2);
export const root_three = Math.sqrt(3);

export const e = Math.E;
export const ln_ten = Math.LN10;
export const ln_two = Math.LN2;

export function min(a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
        return Math.min(a, b);
    }

    const out = new a.constructor();
    for (let i = 0; i < a.elements.length; i++) {
        out.elements[i] = Math.min(a.elements[i], b.elements[i]);
    }
    return out;
}

export function max(a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
        return Math.max(a, b);
    }

    const out = new a.constructor();
    for (let i = 0; i < a.elements.length; i++) {
        out.elements[i] = Math.max(a.elements[i], b.elements[i]);
    }
    return out;
}

export function abs(a) {
    if (typeof a === 'number') {
        return Math.abs(a);
    }

    const out = new a.constructor();
    for (let i = 0; i < a.elements.length; i++) {
        out.elements[i] = Math.abs(a.elements[i]);
    }
    return out;
}

export function fract(a) {
    if (typeof a === 'number') {
        return a - Math.floor(a);
    }

    const out = new a.constructor();
    for (let i = 0; i < a.elements.length; i++) {
        out.elements[i] = a.elements[i] - Math.floor(a.elements[i]);
    }
    return out;
}

export function all(a) {
    for (let i = 0; i < a.elements.length; i++) {
        if (!a.elements[i]) {
            return false;
        }
    }
    return true;
}

export function sign(a) {
    if (typeof a === 'number') {
        return Math.sign(a);
    }

    const out = new a.constructor();
    for (let i = 0; i < a.elements.length; i++) {
        out.elements[i] = Math.sign(a.elements[i]);
    }
    return out;
}

export function frexp(a) {
    if (typeof a === 'number') {
        if (a === 0) {
            return { significand: 0, exponent: 0 };
        }
        const dataView = new DataView(new ArrayBuffer(8));
        dataView.setFloat64(0, a);
        const bits = dataView.getBigUint64(0);
        const exponent = Number((bits >> 52n) & 0x7FFn) - 1023;
        const mantissa = bits & 0xFFFFFFFFFFFFFn;
        const significand = 1 + Number(mantissa) / 2 ** 52;
        return { significand, exponent };
    }

    const out = new a.constructor();
    const exponents = new a.constructor();
    for (let i = 0; i < a.elements.length; i++) {
        const { significand, exponent } = frexp(a.elements[i]);
        out.elements[i] = significand;
        exponents.elements[i] = exponent;
    }
    return { significand: out, exponent: exponents };
}

export function rotation(angle, axis) {
    if (!(axis instanceof vec3)) {
        throw new Error('Axis must be a vec3');
    }

    const halfAngle = angle / 2;
    const s = Math.sin(halfAngle);
    const c = Math.cos(halfAngle);

    const out = new quat();
    out.elements[0] = axis.elements[0] * s;
    out.elements[1] = axis.elements[1] * s;
    out.elements[2] = axis.elements[2] * s;
    out.elements[3] = c;
    return out;
}
