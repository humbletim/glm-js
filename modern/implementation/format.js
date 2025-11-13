// modern/implementation/format.js

export function format(number) {
    return number.toFixed(6);
}

export function toCppStringVec(vec) {
    const className = 'f' + vec.constructor.name.toLowerCase();
    const elements = Array.from(vec.elements).map(format).join(', ');
    return `${className}(${elements})`;
}

export function toCppStringMat(mat) {
    const className = mat.constructor.name.toLowerCase();
    const elements = Array.from(mat.elements).map(format).join(', ');
    return `${className}(${elements})`;
}

export function toCppStringQuat(quat) {
    const className = quat.constructor.name.toLowerCase();
    const elements = Array.from(quat.elements).map(format).join(', ');
    return `${className}(${elements})`;
}
