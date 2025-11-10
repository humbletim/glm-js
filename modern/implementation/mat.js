// modern/implementation/mat.js
import { vec3, vec4 } from './vec.js';

class mat3 {
    constructor(arg) {
        this.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

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

    '*'(other) {
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
}
class mat4 {
    constructor(arg) {
        this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

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

    '*'(other) {
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
}


export { mat3, mat4 };
