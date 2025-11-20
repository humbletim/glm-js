// modern/implementation/format.js

export function format(number) {
    return number.toFixed(6);
}

export function toCppStringVec(vec) {
    const className = vec._type + vec.elements.length;
    const elements = Array.from(vec.elements).map(format).join(', ');
    return `${className}(${elements})`;
}

export function toCppStringMat(mat) {
    const className = mat._type + Math.sqrt(mat.elements.length);
    const elements = Array.from(mat.elements).map(format).join(', ');
    return `${className}(${elements})`;
}

export function toCppStringQuat(quat) {
    const className = quat._type;
    const w = format(quat.elements[3]);
    const x = format(quat.elements[0]);
    const y = format(quat.elements[1]);
    const z = format(quat.elements[2]);
    return `${className}(${w}, {${x}, ${y}, ${z}})`;
}

export function to_string(v) {
    if (v === null || v === undefined) {
        return "null";
    }
    if (typeof v._type !== 'undefined') {
        switch (v._type) {
            case 'vec':
                return toCppStringVec(v);
            case 'mat':
                return toCppStringMat(v);
            case 'quat':
                return toCppStringQuat(v);
            default:
                throw new Error(`Unknown GLM type: ${v._type}`);
        }
    }
    if (typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean') {
        return v.toString();
    }
    if (Array.isArray(v)) {
        return `[${v.map(to_string).join(', ')}]`;
    }
    return v.toString();
}
