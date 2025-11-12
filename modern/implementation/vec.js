// modern/implementation/vec.js
import { applySwizzling } from './swizzle.js';
import { GLMBaseMixin } from './base.js';

class vec2 extends GLMBaseMixin(class {}) {
    constructor(x, y) {
        super();
        Object.defineProperty(this, 'elements', { value: new Float32Array(2)});

        if (x instanceof vec2 || x instanceof vec3 || x instanceof vec4) {
            this.elements[0] = x.elements[0];
            this.elements[1] = x.elements[1];
        } else if (typeof x === 'number' && y === undefined) {
            this.elements[0] = x;
            this.elements[1] = x;
        } else {
            this.elements[0] = x || 0;
            this.elements[1] = y || 0;
        }
    }

    '+'(other) {
        const out = new vec2();
        out.elements[0] = this.elements[0] + other.elements[0];
        out.elements[1] = this.elements[1] + other.elements[1];
        return out;
    }

    '-'(other) {
        const out = new vec2();
        out.elements[0] = this.elements[0] - other.elements[0];
        out.elements[1] = this.elements[1] - other.elements[1];
        return out;
    }

    '*'(other) {
        const out = new vec2();
        if (typeof other === 'number') {
            out.elements[0] = this.elements[0] * other;
            out.elements[1] = this.elements[1] * other;
        } else {
            out.elements[0] = this.elements[0] * other.elements[0];
            out.elements[1] = this.elements[1] * other.elements[1];
        }
        return out;
    }

    '/'(scalar) {
        const out = new vec2();
        out.elements[0] = this.elements[0] / scalar;
        out.elements[1] = this.elements[1] / scalar;
        return out;
    }

    '=='(other) {
        return this.elements[0] === other.elements[0] &&
               this.elements[1] === other.elements[1];
    }

    '~='(other) {
        const epsilon = 1e-6;
        return Math.abs(this.elements[0] - other.elements[0]) < epsilon &&
               Math.abs(this.elements[1] - other.elements[1]) < epsilon;
    }

    get array() {
        return Array.from(this.elements);
    }

    mul(other) {
        return this['*'](other);
    }

    add(other) {
        return this['+'](other);
    }

    sub(other) {
        return this['-'](other);
    }

    div(other) {
        return this['/'](other);
    }

    eql(other) {
        return this['=='](other);
    }

    eql_epsilon(other) {
        return this['~='](other);
    }
}

class vec3 extends GLMBaseMixin(class {}) {
    constructor(x, y, z) {
        super();
        Object.defineProperty(this, 'elements', { value: new Float32Array(3)});

        if (x instanceof vec3 || x instanceof vec4) {
            this.elements[0] = x.elements[0];
            this.elements[1] = x.elements[1];
            this.elements[2] = x.elements[2];
        } else if (x instanceof vec2) {
            this.elements[0] = x.elements[0];
            this.elements[1] = x.elements[1];
            this.elements[2] = y || 0;
        } else if (typeof x === 'number' && y === undefined) {
            this.elements[0] = x;
            this.elements[1] = x;
            this.elements[2] = x;
        } else {
            this.elements[0] = x || 0;
            this.elements[1] = y || 0;
            this.elements[2] = z || 0;
        }
    }

    '+'(other) {
        const out = new vec3();
        out.elements[0] = this.elements[0] + other.elements[0];
        out.elements[1] = this.elements[1] + other.elements[1];
        out.elements[2] = this.elements[2] + other.elements[2];
        return out;
    }

    '-'(other) {
        const out = new vec3();
        out.elements[0] = this.elements[0] - other.elements[0];
        out.elements[1] = this.elements[1] - other.elements[1];
        out.elements[2] = this.elements[2] - other.elements[2];
        return out;
    }

    '*'(other) {
        const out = new vec3();
        if (typeof other === 'number') {
            out.elements[0] = this.elements[0] * other;
            out.elements[1] = this.elements[1] * other;
            out.elements[2] = this.elements[2] * other;
        } else {
            out.elements[0] = this.elements[0] * other.elements[0];
            out.elements[1] = this.elements[1] * other.elements[1];
            out.elements[2] = this.elements[2] * other.elements[2];
        }
        return out;
    }

    '/'(scalar) {
        const out = new vec3();
        out.elements[0] = this.elements[0] / scalar;
        out.elements[1] = this.elements[1] / scalar;
        out.elements[2] = this.elements[2] / scalar;
        return out;
    }

    '=='(other) {
        return this.elements[0] === other.elements[0] &&
               this.elements[1] === other.elements[1] &&
               this.elements[2] === other.elements[2];
    }

    '~='(other) {
        const epsilon = 1e-6;
        return Math.abs(this.elements[0] - other.elements[0]) < epsilon &&
               Math.abs(this.elements[1] - other.elements[1]) < epsilon &&
               Math.abs(this.elements[2] - other.elements[2]) < epsilon;
    }

    get array() {
        return Array.from(this.elements);
    }

    mul(other) {
        return this['*'](other);
    }

    add(other) {
        return this['+'](other);
    }

    sub(other) {
        return this['-'](other);
    }

    div(other) {
        return this['/'](other);
    }

    eql(other) {
        return this['=='](other);
    }

    eql_epsilon(other) {
        return this['~='](other);
    }
}

class vec4 extends GLMBaseMixin(class {}) {
    constructor(x, y, z, w) {
        super();
        Object.defineProperty(this, 'elements', { value: new Float32Array(4)});

        if (x instanceof vec4) {
            this.elements[0] = x.elements[0];
            this.elements[1] = x.elements[1];
            this.elements[2] = x.elements[2];
            this.elements[3] = x.elements[3];
        } else if (x instanceof vec3) {
            this.elements[0] = x.elements[0];
            this.elements[1] = x.elements[1];
            this.elements[2] = x.elements[2];
            this.elements[3] = y || 0;
        } else if (x instanceof vec2) {
            this.elements[0] = x.elements[0];
            this.elements[1] = x.elements[1];
            this.elements[2] = y || 0;
            this.elements[3] = z || 0;
        } else if (typeof x === 'number' && y === undefined) {
            this.elements[0] = x;
            this.elements[1] = x;
            this.elements[2] = x;
            this.elements[3] = x;
        } else {
            this.elements[0] = x || 0;
            this.elements[1] = y || 0;
            this.elements[2] = z || 0;
            this.elements[3] = w || 0;
        }
    }

    '+'(other) {
        const out = new vec4();
        out.elements[0] = this.elements[0] + other.elements[0];
        out.elements[1] = this.elements[1] + other.elements[1];
        out.elements[2] = this.elements[2] + other.elements[2];
        out.elements[3] = this.elements[3] + other.elements[3];
        return out;
    }

    '-'(other) {
        const out = new vec4();
        out.elements[0] = this.elements[0] - other.elements[0];
        out.elements[1] = this.elements[1] - other.elements[1];
        out.elements[2] = this.elements[2] - other.elements[2];
        out.elements[3] = this.elements[3] - other.elements[3];
        return out;
    }

    '*'(other) {
        const out = new vec4();
        if (typeof other === 'number') {
            out.elements[0] = this.elements[0] * other;
            out.elements[1] = this.elements[1] * other;
            out.elements[2] = this.elements[2] * other;
            out.elements[3] = this.elements[3] * other;
        } else {
            out.elements[0] = this.elements[0] * other.elements[0];
            out.elements[1] = this.elements[1] * other.elements[1];
            out.elements[2] = this.elements[2] * other.elements[2];
            out.elements[3] = this.elements[3] * other.elements[3];
        }
        return out;
    }

    '/'(scalar) {
        const out = new vec4();
        out.elements[0] = this.elements[0] / scalar;
        out.elements[1] = this.elements[1] / scalar;
        out.elements[2] = this.elements[2] / scalar;
        out.elements[3] = this.elements[3] / scalar;
        return out;
    }

    '=='(other) {
        return this.elements[0] === other.elements[0] &&
               this.elements[1] === other.elements[1] &&
               this.elements[2] === other.elements[2] &&
               this.elements[3] === other.elements[3];
    }

    '~='(other) {
        const epsilon = 1e-6;
        return Math.abs(this.elements[0] - other.elements[0]) < epsilon &&
               Math.abs(this.elements[1] - other.elements[1]) < epsilon &&
               Math.abs(this.elements[2] - other.elements[2]) < epsilon &&
               Math.abs(this.elements[3] - other.elements[3]) < epsilon;
    }

    get array() {
        return Array.from(this.elements);
    }

    mul(other) {
        return this['*'](other);
    }

    add(other) {
        return this['+'](other);
    }

    sub(other) {
        return this['-'](other);
    }

    div(other) {
        return this['/'](other);
    }

    eql(other) {
        return this['=='](other);
    }

    eql_epsilon(other) {
        return this['~='](other);
    }
}

applySwizzling(vec2, vec2, vec3, vec4);
applySwizzling(vec3, vec2, vec3, vec4);
applySwizzling(vec4, vec2, vec3, vec4);


export { vec2, vec3, vec4 };
