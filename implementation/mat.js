// modern/implementation/mat.js
import { vec3, vec4 } from './vec.js';
import { normalize, cross, dot } from './functions.js';
import { GLMBaseMixin } from './base.js';

class mat3 extends GLMBaseMixin(class {}) {
    constructor(arg) {
        super();
        this._type = 'mat';
        Object.defineProperty(this, 'elements', { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])});

        if (typeof arg === 'number') {
            this.elements[0] = arg;
            this.elements[4] = arg;
            this.elements[8] = arg;
        } else if (arg instanceof mat3) {
            this.elements.set(arg.elements);
        } else if (arg instanceof mat4) {
            this.elements[0] = arg.elements[0];
            this.elements[1] = arg.elements[1];
            this.elements[2] = arg.elements[2];
            this.elements[3] = arg.elements[4];
            this.elements[4] = arg.elements[5];
            this.elements[5] = arg.elements[6];
            this.elements[6] = arg.elements[8];
            this.elements[7] = arg.elements[9];
            this.elements[8] = arg.elements[10];
        }
    }

    mul(other) {
        const out = new mat3();
        const a = this.elements;
        const b = other.elements;

        out.elements[0] = b[0] * a[0] + b[1] * a[3] + b[2] * a[6];
        out.elements[1] = b[0] * a[1] + b[1] * a[4] + b[2] * a[7];
        out.elements[2] = b[0] * a[2] + b[1] * a[5] + b[2] * a[8];
        out.elements[3] = b[3] * a[0] + b[4] * a[3] + b[5] * a[6];
        out.elements[4] = b[3] * a[1] + b[4] * a[4] + b[5] * a[7];
        out.elements[5] = b[3] * a[2] + b[4] * a[5] + b[5] * a[8];
        out.elements[6] = b[6] * a[0] + b[7] * a[3] + b[8] * a[6];
        out.elements[7] = b[6] * a[1] + b[7] * a[4] + b[8] * a[7];
        out.elements[8] = b[6] * a[2] + b[7] * a[5] + b[8] * a[8];

        return out;
    }

    transpose() {
        const out = new mat3();
        const a = this.elements;

        out.elements[0] = a[0];
        out.elements[1] = a[3];
        out.elements[2] = a[6];
        out.elements[3] = a[1];
        out.elements[4] = a[4];
        out.elements[5] = a[7];
        out.elements[6] = a[2];
        out.elements[7] = a[5];
        out.elements[8] = a[8];

        return out;
    }

    determinant() {
        const a = this.elements;

        return a[0] * (a[4] * a[8] - a[5] * a[7]) -
               a[1] * (a[3] * a[8] - a[5] * a[6]) +
               a[2] * (a[3] * a[7] - a[4] * a[6]);
    }

    inverse() {
        const out = new mat3();
        const a = this.elements;
        const det = this.determinant();

        if (!det) { return null; }

        const invDet = 1.0 / det;

        out.elements[0] = (a[4] * a[8] - a[5] * a[7]) * invDet;
        out.elements[1] = (a[2] * a[7] - a[1] * a[8]) * invDet;
        out.elements[2] = (a[1] * a[5] - a[2] * a[4]) * invDet;
        out.elements[3] = (a[5] * a[6] - a[3] * a[8]) * invDet;
        out.elements[4] = (a[0] * a[8] - a[2] * a[6]) * invDet;
        out.elements[5] = (a[2] * a[3] - a[0] * a[5]) * invDet;
        out.elements[6] = (a[3] * a[7] - a[4] * a[6]) * invDet;
        out.elements[7] = (a[1] * a[6] - a[0] * a[7]) * invDet;
        out.elements[8] = (a[0] * a[4] - a[1] * a[3]) * invDet;

        return out;
    }
}
class mat4 extends GLMBaseMixin(class {}) {
    constructor(arg) {
        super();
        this._type = 'mat';
        Object.defineProperty(this, 'elements', { value: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])});

        if (typeof arg === 'number') {
            this.elements[0] = arg;
            this.elements[5] = arg;
            this.elements[10] = arg;
            this.elements[15] = arg;
        } else if (arg instanceof mat4) {
            this.elements.set(arg.elements);
        } else if (arg instanceof mat3) {
            this.elements[0] = arg.elements[0];
            this.elements[1] = arg.elements[1];
            this.elements[2] = arg.elements[2];
            this.elements[4] = arg.elements[3];
            this.elements[5] = arg.elements[4];
            this.elements[6] = arg.elements[5];
            this.elements[8] = arg.elements[6];
            this.elements[9] = arg.elements[7];
            this.elements[10] = arg.elements[8];
        }
    }

    mul(other) {
        const out = new mat4();
        const a = this.elements;
        const b = other.elements;

        out.elements[0] = b[0] * a[0] + b[1] * a[4] + b[2] * a[8] + b[3] * a[12];
        out.elements[1] = b[0] * a[1] + b[1] * a[5] + b[2] * a[9] + b[3] * a[13];
        out.elements[2] = b[0] * a[2] + b[1] * a[6] + b[2] * a[10] + b[3] * a[14];
        out.elements[3] = b[0] * a[3] + b[1] * a[7] + b[2] * a[11] + b[3] * a[15];
        out.elements[4] = b[4] * a[0] + b[5] * a[4] + b[6] * a[8] + b[7] * a[12];
        out.elements[5] = b[4] * a[1] + b[5] * a[5] + b[6] * a[9] + b[7] * a[13];
        out.elements[6] = b[4] * a[2] + b[5] * a[6] + b[6] * a[10] + b[7] * a[14];
        out.elements[7] = b[4] * a[3] + b[5] * a[7] + b[6] * a[11] + b[7] * a[15];
        out.elements[8] = b[8] * a[0] + b[9] * a[4] + b[10] * a[8] + b[11] * a[12];
        out.elements[9] = b[8] * a[1] + b[9] * a[5] + b[10] * a[9] + b[11] * a[13];
        out.elements[10] = b[8] * a[2] + b[9] * a[6] + b[10] * a[10] + b[11] * a[14];
        out.elements[11] = b[8] * a[3] + b[9] * a[7] + b[10] * a[11] + b[11] * a[15];
        out.elements[12] = b[12] * a[0] + b[13] * a[4] + b[14] * a[8] + b[15] * a[12];
        out.elements[13] = b[12] * a[1] + b[13] * a[5] + b[14] * a[9] + b[15] * a[13];
        out.elements[14] = b[12] * a[2] + b[13] * a[6] + b[14] * a[10] + b[15] * a[14];
        out.elements[15] = b[12] * a[3] + b[13] * a[7] + b[14] * a[11] + b[15] * a[15];

        return out;
    }

    transpose() {
        const out = new mat4();
        const a = this.elements;

        out.elements[0] = a[0];
        out.elements[1] = a[4];
        out.elements[2] = a[8];
        out.elements[3] = a[12];
        out.elements[4] = a[1];
        out.elements[5] = a[5];
        out.elements[6] = a[9];
        out.elements[7] = a[13];
        out.elements[8] = a[2];
        out.elements[9] = a[6];
        out.elements[10] = a[10];
        out.elements[11] = a[14];
        out.elements[12] = a[3];
        out.elements[13] = a[7];
        out.elements[14] = a[11];
        out.elements[15] = a[15];

        return out;
    }

    determinant() {
        const a = this.elements;

        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }

    inverse() {
        const out = new mat4();
        const a = this.elements;
        const det = this.determinant();

        if (!det) { return null; }

        const invDet = 1.0 / det;

        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        out.elements[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
        out.elements[1] = (a02 * b10 - a01 * b11 - a03 * b09) * invDet;
        out.elements[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
        out.elements[3] = (a22 * b04 - a21 * b05 - a23 * b03) * invDet;
        out.elements[4] = (a12 * b08 - a10 * b11 - a13 * b07) * invDet;
        out.elements[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
        out.elements[6] = (a32 * b02 - a30 * b05 - a33 * b01) * invDet;
        out.elements[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
        out.elements[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
        out.elements[9] = (a01 * b08 - a00 * b10 - a03 * b06) * invDet;
        out.elements[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
        out.elements[11] = (a21 * b02 - a20 * b04 - a23 * b00) * invDet;
        out.elements[12] = (a11 * b07 - a10 * b09 - a12 * b06) * invDet;
        out.elements[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
        out.elements[14] = (a31 * b01 - a30 * b03 - a32 * b00) * invDet;
        out.elements[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

        return out;
    }
}


export { mat3, mat4 };

export function transpose(m) {
    return m.transpose();
}

export function inverse(m) {
    return m.inverse();
}

export function determinant(m) {
    return m.determinant();
}

export function matrixCompMult(x, y) {
    const out = new x.constructor();
    for (let i = 0; i < x.elements.length; i++) {
        out.elements[i] = x.elements[i] * y.elements[i];
    }
    return out;
}

export function outerProduct(c, r) {
    if (c.elements.length === 3 && r.elements.length === 3) {
        const out = new mat3();
        out.elements[0] = c.elements[0] * r.elements[0];
        out.elements[1] = c.elements[1] * r.elements[0];
        out.elements[2] = c.elements[2] * r.elements[0];
        out.elements[3] = c.elements[0] * r.elements[1];
        out.elements[4] = c.elements[1] * r.elements[1];
        out.elements[5] = c.elements[2] * r.elements[1];
        out.elements[6] = c.elements[0] * r.elements[2];
        out.elements[7] = c.elements[1] * r.elements[2];
        out.elements[8] = c.elements[2] * r.elements[2];
        return out;
    } else if (c.elements.length === 4 && r.elements.length === 4) {
        const out = new mat4();
        out.elements[0] = c.elements[0] * r.elements[0];
        out.elements[1] = c.elements[1] * r.elements[0];
        out.elements[2] = c.elements[2] * r.elements[0];
        out.elements[3] = c.elements[3] * r.elements[0];
        out.elements[4] = c.elements[0] * r.elements[1];
        out.elements[5] = c.elements[1] * r.elements[1];
        out.elements[6] = c.elements[2] * r.elements[1];
        out.elements[7] = c.elements[3] * r.elements[1];
        out.elements[8] = c.elements[0] * r.elements[2];
        out.elements[9] = c.elements[1] * r.elements[2];
        out.elements[10] = c.elements[2] * r.elements[2];
        out.elements[11] = c.elements[3] * r.elements[2];
        out.elements[12] = c.elements[0] * r.elements[3];
        out.elements[13] = c.elements[1] * r.elements[3];
        out.elements[14] = c.elements[2] * r.elements[3];
        out.elements[15] = c.elements[3] * r.elements[3];
        return out;
    }

    throw new Error('outerProduct only supports vec3 and vec4');
}

export function lookAt(eye, center, up) {
    const f = normalize(eye.sub(center));
    const s = normalize(cross(up, f));
    const u = cross(f, s);

    const out = new mat4();
    out.elements[0] = s.x;
    out.elements[1] = u.x;
    out.elements[2] = f.x;
    out.elements[3] = 0;
    out.elements[4] = s.y;
    out.elements[5] = u.y;
    out.elements[6] = f.y;
    out.elements[7] = 0;
    out.elements[8] = s.z;
    out.elements[9] = u.z;
    out.elements[10] = f.z;
    out.elements[11] = 0;
    out.elements[12] = -dot(s, eye);
    out.elements[13] = -dot(u, eye);
    out.elements[14] = -dot(f, eye);
    out.elements[15] = 1;

    return out;
}

export function perspective(fovy, aspect, near, far) {
    const out = new mat4(0);
    const f = 1.0 / Math.tan(fovy / 2);

    out.elements[0] = f / aspect;
    out.elements[5] = f;
    out.elements[11] = -1;

    if (far != null && far !== Infinity) {
        const nf = 1 / (near - far);
        out.elements[10] = (far + near) * nf;
        out.elements[14] = 2 * far * near * nf;
    } else {
        out.elements[10] = -1;
        out.elements[14] = -2 * near;
    }

    return out;
}

export function ortho(left, right, bottom, top, near, far) {
    const out = new mat4(0);
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);

    out.elements[0] = -2 * lr;
    out.elements[5] = -2 * bt;
    out.elements[10] = 2 * nf;
    out.elements[12] = (left + right) * lr;
    out.elements[13] = (top + bottom) * bt;
    out.elements[14] = (far + near) * nf;
    out.elements[15] = 1;

    return out;
}
