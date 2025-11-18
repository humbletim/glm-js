import { quat } from './quat.js';
/**
 * Converts degrees to radians.
 * @param {Number} degrees The angle in degrees.
 * @returns {Number|vec2|vec3|vec4} The angle in radians.
 */
export function radians(degrees) {
    if (degrees === null || (typeof degrees !== 'number' && !degrees?.elements)) { return undefined; }
    if (typeof degrees === 'number') {
        return degrees * Math.PI / 180;
    }

    const out = new degrees.constructor();
    for (let i = 0; i < degrees.elements.length; i++) {
        out.elements[i] = degrees.elements[i] * Math.PI / 180;
    }
    return out;
}

/**
 * Converts radians to degrees.
 * @param {Number|vec2|vec3|vec4} radians The angle in radians.
 * @returns {Number|vec2|vec3|vec4} The angle in degrees.
 */
export function degrees(radians) {
    if (radians === null || (typeof radians !== 'number' && !radians?.elements)) { return undefined; }
    if (typeof radians === 'number') {
        return radians * 180 / Math.PI;
    }

    const out = new radians.constructor();
    for (let i = 0; i < radians.elements.length; i++) {
        out.elements[i] = radians.elements[i] * 180 / Math.PI;
    }
    return out;
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

export const sin = (angle) => Math.sin(angle);
export const cos = (angle) => Math.cos(angle);
export const tan = (angle) => Math.tan(angle);
export const asin = (x) => Math.asin(x);
export const acos = (x) => Math.acos(x);
export const atan = (y, x) => (x !== undefined ? Math.atan(y, x) : Math.atan(y));
export const sinh = (angle) => Math.sinh(angle);
export const cosh = (angle) => Math.cosh(angle);
export const tanh = (angle) => Math.tanh(angle);
export const asinh = (x) => Math.asinh(x);
export const acosh = (x) => Math.acosh(x);
export const atanh = (x) => Math.atanh(x);

export const pow = (base, exp) => Math.pow(base, exp);
export const exp = (x) => Math.exp(x);
export const log = (x) => Math.log(x);
export const exp2 = (x) => Math.pow(2, x);
export const log2 = (x) => Math.log2(x);
export const sqrt = (x) => Math.sqrt(x);
export const inversesqrt = (x) => 1 / Math.sqrt(x);
