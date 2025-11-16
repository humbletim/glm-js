// modern/implementation/base.js
import { toCppStringVec, toCppStringMat, toCppStringQuat } from './format.js';

const GLMBaseMixin = (superclass) => class extends superclass {
    get array() {
        return Array.from(this.elements);
    }

    clone() {
        return new this.constructor(this);
    }

    // --- Operator Aliases ---
    '+'(other) { return this.add(other); }
    '-'(other) { return this.sub(other); }
    '*'(other) { return this.mul(other); }
    '/'(other) { return this.div(other); }
    '=='(other) { return this.equal(other); }
    '~='(other) { return this.epsilonEqual(other); }

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
