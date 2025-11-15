// modern/implementation/functions.js
import { mat3, mat4, inverse } from './mat.js';
import { vec3, vec4 } from './vec.js';

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
    if (typeof a === 'number') {
        return a * (1 - t) + b * t;
    }

    const out = new (a.constructor)();
    for (let i = 0; i < a.elements.length; i++) {
        const tVal = (typeof t === 'number') ? t : t.elements[i];
        out.elements[i] = a.elements[i] * (1 - tVal) + b.elements[i] * tVal;
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

export { dot, cross, normalize, translate, rotate, scale, length, length2, distance, mix, clamp, toMat4, add, sub, mul, div, unProject, project, diagonal3x3, diagonal4x4, angle, axis, eulerAngles };
