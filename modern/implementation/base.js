// modern/implementation/base.js

const GLMBaseMixin = (superclass) => class extends superclass {
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
        const className = this.constructor.name;
        const elements = Array.from(this.elements.slice(0, 4)).join(', ');
        const ellipsis = this.elements.length > 4 ? ', ...' : '';
        return `${className}.elements=[${elements}${ellipsis}]`;
    }
};

export { GLMBaseMixin };
