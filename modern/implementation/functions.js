// modern/implementation/functions.js

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
    const out = new m.constructor(m);
    out.elements[12] += v.elements[0];
    out.elements[13] += v.elements[1];
    out.elements[14] += v.elements[2];
    return out;
}

function rotate(m, angle, axis) {
    const out = new m.constructor(m);
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const C = 1 - c;
    const x = axis.elements[0], y = axis.elements[1], z = axis.elements[2];

    const r00 = x * x * C + c;
    const r01 = y * x * C + z * s;
    const r02 = z * x * C - y * s;
    const r10 = x * y * C - z * s;
    const r11 = y * y * C + c;
    const r12 = z * y * C + x * s;
    const r20 = x * z * C + y * s;
    const r21 = y * z * C - x * s;
    const r22 = z * z * C + c;

    const m00 = m.elements[0], m01 = m.elements[1], m02 = m.elements[2];
    const m04 = m.elements[4], m05 = m.elements[5], m06 = m.elements[6];
    const m08 = m.elements[8], m09 = m.elements[9], m10 = m.elements[10];

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
    const out = new m.constructor(m);
    out.elements[0] *= v.elements[0];
    out.elements[5] *= v.elements[1];
    out.elements[10] *= v.elements[2];
    return out;
}


export { dot, cross, normalize, translate, rotate, scale };
