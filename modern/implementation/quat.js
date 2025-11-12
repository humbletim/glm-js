// modern/implementation/quat.js
import { vec3 } from './vec.js';
import { GLMBaseMixin } from './base.js';

class quat extends GLMBaseMixin(class {}) {
    constructor(w, x, y, z) {
        super();
        Object.defineProperty(this, 'elements', { value: new Float32Array([0,0,0,1])}); // Default to identity

        if (typeof w === 'number' && x === undefined) {
            // In glm-js, quat(1) is identity, so we don't need to do anything
        } else if (w instanceof quat) {
            this.elements.set(w.elements);
        } else if (typeof w === 'number') {
            this.elements[0] = x;
            this.elements[1] = y;
            this.elements[2] = z;
            this.elements[3] = w;
        }
    }

    '*'(other) {
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

export { quat, angleAxis };

export function slerp(q1, q2, t) {
    const out = new quat();
    let cosTheta = q1.elements[0] * q2.elements[0] + q1.elements[1] * q2.elements[1] + q1.elements[2] * q2.elements[2] + q1.elements[3] * q2.elements[3];

    if (Math.abs(cosTheta) >= 1.0) {
        out.elements.set(q1.elements);
        return out;
    }

    if (cosTheta < 0.0) {
        q2.elements[0] = -q2.elements[0];
        q2.elements[1] = -q2.elements[1];
        q2.elements[2] = -q2.elements[2];
        q2.elements[3] = -q2.elements[3];
        cosTheta = -cosTheta;
    }

    const halfTheta = Math.acos(cosTheta);
    const sinHalfTheta = Math.sqrt(1.0 - cosTheta * cosTheta);

    if (Math.abs(sinHalfTheta) < 0.001) {
        out.elements[0] = (q1.elements[0] * 0.5 + q2.elements[0] * 0.5);
        out.elements[1] = (q1.elements[1] * 0.5 + q2.elements[1] * 0.5);
        out.elements[2] = (q1.elements[2] * 0.5 + q2.elements[2] * 0.5);
        out.elements[3] = (q1.elements[3] * 0.5 + q2.elements[3] * 0.5);
        return out;
    }

    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    out.elements[0] = (q1.elements[0] * ratioA + q2.elements[0] * ratioB);
    out.elements[1] = (q1.elements[1] * ratioA + q2.elements[1] * ratioB);
    out.elements[2] = (q1.elements[2] * ratioA + q2.elements[2] * ratioB);
    out.elements[3] = (q1.elements[3] * ratioA + q2.elements[3] * ratioB);

    return out;
}
