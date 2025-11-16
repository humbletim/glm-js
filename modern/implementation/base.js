// modern/implementation/base.js
import { toCppStringVec, toCppStringMat, toCppStringQuat } from './format.js';

const GLMBaseMixin = (superclass) => class extends superclass {
    get array() {
        return Array.from(this.elements);
    }

    clone() {
        return new this.constructor(this);
    }

    equals(other) {
        if (this.elements.length !== other.elements.length) {
            return false;
        }

        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i] !== other.elements[i]) {
                return false;
            }
        }

        return true;
    }

    epsilonEqual(other, epsilon = 1e-6) {
        if (this.elements.length !== other.elements.length) {
            return false;
        }

        for (let i = 0; i < this.elements.length; i++) {
            if (Math.abs(this.elements[i] - other.elements[i]) > epsilon) {
                return false;
            }
        }

        return true;
    }

    // --- Operator Aliases ---
    '+'(other) { return this.add(other); }
    '-'(other) { return this.sub(other); }
    '*'(other) { return this.mul(other); }
    '/'(other) { return this.div(other); }
    '=='(other) { return this.equals(other); }
    '~='(other) { return this.epsilonEqual(other); }
    eql(other) { return this.equals(other); }
    eql_epsilon(other, epsilon) { return this.epsilonEqual(other, epsilon); }

    ['='](other) {
        this.elements.set(other.elements);
        return this;
    }

    ['+='](other) {
        return this['='](this.add(other));
    }

    ['-='](other) {
        return this['='](this.sub(other));
    }

    ['*='](other) {
        return this['='](this.mul(other));
    }

    ['/='](other) {
        return this['='](this.div(other));
    }

    toString() {
        switch (this._type) {
            case 'vec':
                return toCppStringVec(this);
            case 'mat':
                return toCppStringMat(this);
            case 'quat':
                return toCppStringQuat(this);
            default:
                throw new Error(`Unknown GLM type: ${this._type}`);
        }
    }
};

export { GLMBaseMixin };
