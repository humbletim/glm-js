// modern/implementation/base.js

const GLMBaseMixin = (superclass) => class extends superclass {
    clone() {
        return new this.constructor(this);
    }

    ['='](other) {
        this.elements.set(other.elements);
        return this;
    }

    ['+='](other) {
        return this['='](this['+'](other));
    }

    ['-='](other) {
        return this['='](this['-'](other));
    }

    ['*='](other) {
        return this['='](this['*'](other));
    }

    ['/='](other) {
        return this['='](this['/'](other));
    }

    toString() {
        const className = this.constructor.name;
        const elements = Array.from(this.elements.slice(0, 4)).join(', ');
        const ellipsis = this.elements.length > 4 ? ', ...' : '';
        return `${className}.elements=[${elements}${ellipsis}]`;
    }
};

export { GLMBaseMixin };
