// modern/implementation/quat.js
import { vec3 } from './vec.js';
import { GLMBaseMixin } from './base.js';
import { dot, normalize } from './functions.js';

class quat extends GLMBaseMixin(class {}) {
    constructor(w, x, y, z) {
        super();
        this._type = 'quat';
        Object.defineProperty(this, 'elements', { value: new Float32Array([0,0,0,1])}); // Default to identity

        if (w instanceof quat) {
            this.elements.set(w.elements);
        } else if (typeof w === 'number' && typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
            this.elements[0] = x;
            this.elements[1] = y;
            this.elements[2] = z;
            this.elements[3] = w;
        }
    }

    mul(other) {
        const out = new quat();
        const ax = this.elements[0], ay = this.elements[1], az = this.elements[2], aw = this.elements[3];
        const bx = other.elements[0], by = other.elements[1], bz = other.elements[2], bw = other.elements[3];

        out.elements[0] = ax * bw + aw * bx + ay * bz - az * by;
        out.elements[1] = ay * bw + aw * by + az * bx - ax * bz;
        out.elements[2] = az * bw + aw * bz + ax * by - ay * bx;
        out.elements[3] = aw * bw - ax * bx - ay * by - az * bz;

        return out;
    }
}

function angleAxis(angle, axis) {
    const halfAngle = angle / 2;
    const s = Math.sin(halfAngle);
    const out = new quat();

    out.elements[0] = axis.elements[0] * s;
    out.elements[1] = axis.elements[1] * s;
    out.elements[2] = axis.elements[2] * s;
    out.elements[3] = Math.cos(halfAngle);

    return out;
}

export function inverse(q) {
    const out = new quat();
    const x = q.elements[0], y = q.elements[1], z = q.elements[2], w = q.elements[3];

    let dot = x * x + y * y + z * z + w * w;

    if (dot === 0) {
        return new quat(); // Return identity
    }

    dot = 1.0 / dot;

    out.elements[0] = -x * dot;
    out.elements[1] = -y * dot;
    out.elements[2] = -z * dot;
    out.elements[3] =  w * dot;

    return out;
}

export { quat, angleAxis };

export function slerp(q1, q2, t) {
    const out = new quat();
    let cosTheta = dot(q1, q2);

    if (cosTheta < 0.0) {
        q2 = new quat(-q2.elements[3], -q2.elements[0], -q2.elements[1], -q2.elements[2]);
        cosTheta = -cosTheta;
    }

    if (cosTheta > 0.9995) {
        out.elements[0] = (1 - t) * q1.elements[0] + t * q2.elements[0];
        out.elements[1] = (1 - t) * q1.elements[1] + t * q2.elements[1];
        out.elements[2] = (1 - t) * q1.elements[2] + t * q2.elements[2];
        out.elements[3] = (1 - t) * q1.elements[3] + t * q2.elements[3];
        return normalize(out);
    }

    const theta = Math.acos(cosTheta);
    const sinTheta = Math.sin(theta);

    if (sinTheta === 0) {
        out.elements.set(q1.elements);
        return out;
    }

    const ratioA = Math.sin((1 - t) * theta) / sinTheta;
    const ratioB = Math.sin(t * theta) / sinTheta;

    out.elements[0] = (q1.elements[0] * ratioA + q2.elements[0] * ratioB);
    out.elements[1] = (q1.elements[1] * ratioA + q2.elements[1] * ratioB);
    out.elements[2] = (q1.elements[2] * ratioA + q2.elements[2] * ratioB);
    out.elements[3] = (q1.elements[3] * ratioA + q2.elements[3] * ratioB);

    return out;
}
