// modern/implementation/functions.js
import { mat3, mat4, inverse } from './mat.js';
import { vec2, vec3, vec4 } from './vec.js';
const bvec2 = vec2;
const bvec3 = vec3;
const bvec4 = vec4;

function dot(a, b) {
    let out = 0;
    for (let i = 0; i < a.elements.length; i++) {
        out += a.elements[i] * b.elements[i];
    }
    return out;
}

function cross(a, b) {
    const out = new (a.constructor)();
    const ax = a.elements[0], ay = a.elements[1], az = a.elements[2];
    const bx = b.elements[0], by = b.elements[1], bz = b.elements[2];

    out.elements[0] = ay * bz - az * by;
    out.elements[1] = az * bx - ax * bz;
    out.elements[2] = ax * by - ay * bx;
    return out;
}

function normalize(a) {
    const out = new (a.constructor)();
    const len = Math.sqrt(dot(a, a));
    if (len > 0) {
        for (let i = 0; i < a.elements.length; i++) {
            out.elements[i] = a.elements[i] / len;
        }
    }
    return out;
}

function translate(m, v) {
    let _m, _v;
    if (v === undefined) {
        // Overload: translate(v)
        _v = m;
        _m = new mat4();
    } else {
        // Overload: translate(m, v)
        _m = m;
        _v = v;
    }
    const out = new _m.constructor(_m);
    out.elements[12] += _v.elements[0];
    out.elements[13] += _v.elements[1];
    out.elements[14] += _v.elements[2];
    return out;
}

function rotate(m, angle, axis) {
    let _m, _angle, _axis;

    if (axis === undefined) {
        // Overload: rotate(angle, axis)
        _angle = m;
        _axis = angle;
        _m = new mat4();
    } else {
        // Overload: rotate(m, angle, axis)
        _m = m;
        _angle = angle;
        _axis = axis;
    }

    const out = new _m.constructor(_m);
    const c = Math.cos(_angle);
    const s = Math.sin(_angle);
    const C = 1 - c;
    const x = _axis.elements[0], y = _axis.elements[1], z = _axis.elements[2];

    const r00 = x * x * C + c;
    const r01 = y * x * C + z * s;
    const r02 = z * x * C - y * s;
    const r10 = x * y * C - z * s;
    const r11 = y * y * C + c;
    const r12 = z * y * C + x * s;
    const r20 = x * z * C + y * s;
    const r21 = y * z * C - x * s;
    const r22 = z * z * C + c;

    const m00 = _m.elements[0], m01 = _m.elements[1], m02 = _m.elements[2];
    const m04 = _m.elements[4], m05 = _m.elements[5], m06 = _m.elements[6];
    const m08 = _m.elements[8], m09 = _m.elements[9], m10 = _m.elements[10];

    out.elements[0] = r00 * m00 + r10 * m01 + r20 * m02;
    out.elements[1] = r01 * m00 + r11 * m01 + r21 * m02;
    out.elements[2] = r02 * m00 + r12 * m01 + r22 * m02;

    out.elements[4] = r00 * m04 + r10 * m05 + r20 * m06;
    out.elements[5] = r01 * m04 + r11 * m05 + r21 * m06;
    out.elements[6] = r02 * m04 + r12 * m05 + r22 * m06;

    out.elements[8] = r00 * m08 + r10 * m09 + r20 * m10;
    out.elements[9] = r01 * m08 + r11 * m09 + r21 * m10;
    out.elements[10] = r02 * m08 + r12 * m09 + r22 * m10;

    return out;
}

function scale(m, v) {
    let _m, _v;
    if (v === undefined) {
        // Overload: scale(v)
        _v = m;
        _m = new mat4();
    } else {
        // Overload: scale(m, v)
        _m = m;
        _v = v;
    }
    const out = new _m.constructor(_m);
    out.elements[0] *= _v.elements[0];
    out.elements[5] *= _v.elements[1];
    out.elements[10] *= _v.elements[2];
    return out;
}

function length2(a) {
    return dot(a, a);
}

function length(a) {
    return Math.sqrt(length2(a));
}

function distance(a, b) {
    const diff = new (a.constructor)();
    for (let i = 0; i < a.elements.length; i++) {
        diff.elements[i] = a.elements[i] - b.elements[i];
    }
    return length(diff);
}


function mix(a, b, t) {
    const out = new (a.constructor)();
    for (let i = 0; i < a.elements.length; i++) {
        out.elements[i] = a.elements[i] * (1 - t) + b.elements[i] * t;
    }
    return out;
}

function clamp(a, min, max) {
    if (typeof a === 'number') {
        return Math.max(min, Math.min(max, a));
    }

    const out = new (a.constructor)();
    for (let i = 0; i < a.elements.length; i++) {
        const minVal = (typeof min === 'number') ? min : min.elements[i];
        const maxVal = (typeof max === 'number') ? max : max.elements[i];
        out.elements[i] = Math.max(minVal, Math.min(maxVal, a.elements[i]));
    }
    return out;
}

function toMat4(q) {
    const out = new mat4();
    const x = q.elements[0], y = q.elements[1], z = q.elements[2], w = q.elements[3];

    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;

    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;

    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;

    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;

    out.elements[0] = 1 - (yy + zz);
    out.elements[1] = xy + wz;
    out.elements[2] = xz - wy;
    out.elements[3] = 0;

    out.elements[4] = xy - wz;
    out.elements[5] = 1 - (xx + zz);
    out.elements[6] = yz + wx;
    out.elements[7] = 0;

    out.elements[8] = xz + wy;
    out.elements[9] = yz - wx;
    out.elements[10] = 1 - (xx + yy);
    out.elements[11] = 0;

    out.elements[12] = 0;
    out.elements[13] = 0;
    out.elements[14] = 0;
    out.elements[15] = 1;

    return out;
}

function add(a, b) {
    return a['+'](b);
}

function sub(a, b) {
    return a['-'](b);
}

function mul(a, b) {
    return a['*'](b);
}

function div(a, b) {
    return a['/'](b);
}

function unProject(win, model, proj, viewport) {
    const inv = inverse(proj['*'](model));

    const tmp = new vec4(win, 1.0);

    tmp.elements[0] = (tmp.elements[0] - viewport[0]) / viewport[2];
    tmp.elements[1] = (tmp.elements[1] - viewport[1]) / viewport[3];

    for (let i = 0; i < 4; i++) {
        tmp.elements[i] = tmp.elements[i] * 2.0 - 1.0;
    }

    const obj = inv['*'](tmp);

    for (let i = 0; i < 4; i++) {
        obj.elements[i] /= obj.elements[3];
    }

    return new vec3(obj);
}

function project(obj, model, proj, viewport) {
    let tmp = new vec4(obj, 1.0);
    tmp = model['*'](tmp);
    tmp = proj['*'](tmp);

    for (let i = 0; i < 4; i++) {
        tmp.elements[i] /= tmp.elements[3];
    }

    for (let i = 0; i < 4; i++) {
        tmp.elements[i] = tmp.elements[i] * 0.5 + 0.5;
    }

    tmp.elements[0] = tmp.elements[0] * viewport[2] + viewport[0];
    tmp.elements[1] = tmp.elements[1] * viewport[3] + viewport[1];

    return new vec3(tmp);
}

function diagonal3x3(v) {
    const out = new mat3();
    out.elements[0] = v.elements[0];
    out.elements[4] = v.elements[1];
    out.elements[8] = v.elements[2];
    return out;
}

function diagonal4x4(v) {
    const out = new mat4();
    out.elements[0] = v.elements[0];
    out.elements[5] = v.elements[1];
    out.elements[10] = v.elements[2];
    out.elements[15] = v.elements[3];
    return out;
}

function angle(q) {
    return Math.acos(q.elements[3]) * 2;
}

function axis(q) {
    const tmp1 = 1.0 - q.elements[3] * q.elements[3];
    if (tmp1 <= 0) {
        return new vec3(0, 0, 1);
    }
    const tmp2 = 1.0 / Math.sqrt(tmp1);
    return new vec3(q.elements[0] * tmp2, q.elements[1] * tmp2, q.elements[2] * tmp2);
}

function eulerAngles(q) {
    const m = toMat4(q);
    const te = m.elements;
    const m11 = te[0], m12 = te[4], m13 = te[8];
    const m21 = te[1], m22 = te[5], m23 = te[9];
    const m31 = te[2], m32 = te[6], m33 = te[10];

    const angles = new vec3();

    angles.y = Math.asin(Math.max(-1, Math.min(1, m13)));

    if (Math.abs(m13) < 0.99999) {
        angles.x = Math.atan2(-m23, m33);
        angles.z = Math.atan2(-m12, m11);
    } else {
        angles.x = Math.atan2(m32, m22);
        angles.z = 0;
    }

    return angles;
}

function faceforward(N, I, Nref) {
    const dotNI = dot(Nref, I);
    return new N.constructor(dotNI < 0 ? N : N['*'](-1));
}

function reflect(I, N) {
    return I['-'](N['*'](2 * dot(N, I)));
}

function refract(I, N, eta) {
    const dotNI = dot(N, I);
    const k = 1.0 - eta * eta * (1.0 - dotNI * dotNI);

    if (k < 0.0) {
        return new I.constructor();
    }

    return I['*'](eta)['-'](N['*'](eta * dotNI + Math.sqrt(k)));
}

function any(a) {
    for (let i = 0; i < a.elements.length; i++) {
        if (a.elements[i]) {
            return true;
        }
    }
    return false;
}

function equal(x, y) {
    const out = new (eval(`bvec${x.elements.length}`))();
    for (let i = 0; i < x.elements.length; i++) {
        out.elements[i] = x.elements[i] === y.elements[i];
    }
    return out;
}

function notEqual(x, y) {
    const out = new (eval(`bvec${x.elements.length}`))();
    for (let i = 0; i < x.elements.length; i++) {
        out.elements[i] = x.elements[i] !== y.elements[i];
    }
    return out;
}

function lessThan(x, y) {
    const out = new (eval(`bvec${x.elements.length}`))();
    for (let i = 0; i < x.elements.length; i++) {
        out.elements[i] = x.elements[i] < y.elements[i];
    }
    return out;
}

function lessThanEqual(x, y) {
    const out = new (eval(`bvec${x.elements.length}`))();
    for (let i = 0; i < x.elements.length; i++) {
        out.elements[i] = x.elements[i] <= y.elements[i];
    }
    return out;
}

function greaterThan(x, y) {
    const out = new (eval(`bvec${x.elements.length}`))();
    for (let i = 0; i < x.elements.length; i++) {
        out.elements[i] = x.elements[i] > y.elements[i];
    }
    return out;
}

function greaterThanEqual(x, y) {
    const out = new (eval(`bvec${x.elements.length}`))();
    for (let i = 0; i < x.elements.length; i++) {
        out.elements[i] = x.elements[i] >= y.elements[i];
    }
    return out;
}

function not_(v) {
    const out = new (eval(`bvec${v.elements.length}`))();
    for (let i = 0; i < v.elements.length; i++) {
        out.elements[i] = !v.elements[i];
    }
    return out;
}

function packDouble2x32(v) {
    const buffer = new ArrayBuffer(8);
    const dataView = new DataView(buffer);
    dataView.setUint32(0, v.elements[0], true);
    dataView.setUint32(4, v.elements[1], true);
    return dataView.getFloat64(0, true);
}

function unpackDouble2x32(v) {
    const buffer = new ArrayBuffer(8);
    const dataView = new DataView(buffer);
    dataView.setFloat64(0, v, true);
    return new uvec2(dataView.getUint32(0, true), dataView.getUint32(4, true));
}

function packHalf2x16(v) {
    const p = new Uint16Array(2);
    p[0] = float32ToFloat16(v.elements[0]);
    p[1] = float32ToFloat16(v.elements[1]);
    const u = new Uint32Array(1);
    u[0] = (p[1] << 16) | p[0];
    return u[0];
}

function unpackHalf2x16(v) {
    const p = new Uint16Array(2);
    p[0] = v & 0xFFFF;
    p[1] = v >> 16;
    return new vec2(float16ToFloat32(p[0]), float16ToFloat32(p[1]));
}

function packSnorm2x16(v) {
    const x = Math.round(Math.max(-1, Math.min(1, v.elements[0])) * 32767);
    const y = Math.round(Math.max(-1, Math.min(1, v.elements[1])) * 32767);
    return (y << 16) | (x & 0xFFFF);
}

function unpackSnorm2x16(p) {
    const x = (p & 0xFFFF) << 16 >> 16;
    const y = p >> 16;
    return new vec2(Math.max(-1, x / 32767), Math.max(-1, y / 32767));
}

function packSnorm4x8(v) {
    const x = Math.round(Math.max(-1, Math.min(1, v.elements[0])) * 127);
    const y = Math.round(Math.max(-1, Math.min(1, v.elements[1])) * 127);
    const z = Math.round(Math.max(-1, Math.min(1, v.elements[2])) * 127);
    const w = Math.round(Math.max(-1, Math.min(1, v.elements[3])) * 127);
    return (w << 24) | ((z & 0xFF) << 16) | ((y & 0xFF) << 8) | (x & 0xFF);
}

function unpackSnorm4x8(p) {
    const x = (p & 0xFF) << 24 >> 24;
    const y = ((p >> 8) & 0xFF) << 24 >> 24;
    const z = ((p >> 16) & 0xFF) << 24 >> 24;
    const w = p >> 24;
    return new vec4(x / 127, y / 127, z / 127, w / 127);
}

function packUnorm2x16(v) {
    const x = Math.round(Math.max(0, Math.min(1, v.elements[0])) * 65535);
    const y = Math.round(Math.max(0, Math.min(1, v.elements[1])) * 65535);
    return (y << 16) | (x & 0xFFFF);
}

function unpackUnorm2x16(p) {
    const x = p & 0xFFFF;
    const y = p >>> 16;
    return new vec2(x / 65535, y / 65535);
}

function packUnorm4x8(v) {
    const x = Math.round(Math.max(0, Math.min(1, v.elements[0])) * 255);
    const y = Math.round(Math.max(0, Math.min(1, v.elements[1])) * 255);
    const z = Math.round(Math.max(0, Math.min(1, v.elements[2])) * 255);
    const w = Math.round(Math.max(0, Math.min(1, v.elements[3])) * 255);
    return (w << 24) | (z << 16) | (y << 8) | (x & 0xFF);
}

function unpackUnorm4x8(p) {
    const x = p & 0xFF;
    const y = (p >>> 8) & 0xFF;
    const z = (p >>> 16) & 0xFF;
    const w = p >>> 24;
    return new vec4(x / 255, y / 255, z / 255, w / 255);
}

function float32ToFloat16(f) {
    const sign = (f & 0x80000000) >> 31;
    let exp = (f & 0x7F800000) >> 23;
    const frac = f & 0x007FFFFF;

    if (exp === 0) {
        return sign << 15;
    } else if (exp === 255) {
        return (sign << 15) | 0x7C00 | (frac ? 0x200 : 0);
    }

    exp -= 127;

    if (exp < -14) {
        return sign << 15;
    } else if (exp > 15) {
        return (sign << 15) | 0x7C00;
    }

    exp += 15;

    return (sign << 15) | (exp << 10) | (frac >> 13);
}

function float16ToFloat32(h) {
    const sign = (h & 0x8000) >> 15;
    let exp = (h & 0x7C00) >> 10;
    const frac = h & 0x03FF;

    if (exp === 0) {
        return sign ? -0 : 0;
    } else if (exp === 31) {
        return (sign ? -1 : 1) * Infinity;
    }

    exp -= 15;

    if (exp < -24) {
        return sign ? -0 : 0;
    }

    exp += 127;

    return (sign << 31) | (exp << 23) | (frac << 13);
}

export { dot, cross, normalize, translate, rotate, scale, length, length2, distance, mix, clamp, toMat4, add, sub, mul, div, unProject, project, diagonal3x3, diagonal4x4, angle, axis, eulerAngles, faceforward, reflect, refract, any, equal, notEqual, lessThan, lessThanEqual, greaterThan, greaterThanEqual, not_, packDouble2x32, unpackDouble2x32, packHalf2x16, unpackHalf2x16, packSnorm2x16, unpackSnorm2x16, packSnorm4x8, unpackSnorm4x8, packUnorm2x16, unpackUnorm2x16, packUnorm4x8, unpackUnorm4x8 };
