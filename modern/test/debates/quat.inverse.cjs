const Dusk = require('../../../build/glm-three.min.js');
const Day = require('../../dist/modern-glm-js.cjs');
const Dawn = require('../../implementation/index.js').default;

console.log('--- The Debaters: quat.inverse ---');

// A non-zero quaternion for a meaningful inverse
const w = 0.5, x = 0.5, y = 0.5, z = 0.5;

const q_dusk = new Dusk.quat(x, y, z, w);
const q_day = new Day.quat(w, x, y, z);
const q_dawn = new Dawn.quat(w, x, y, z);

try {
    const result = Dusk.inverse(q_dusk);
    console.log('Dusk says (array):', `[${result.x}, ${result.y}, ${result.z}, ${result.w}]`);
} catch (e) {
    console.log('Dusk throws:', e.message);
}

try {
    const result = Day.inverse(q_day);
    console.log('Day says (array): ', result.array);
} catch (e) {
    console.log('Day throws:', e.message);
}

try {
    const result = Dawn.inverse(q_dawn);
    console.log('Dawn says (array):', result.array);
} catch (e) {
    console.log('Dawn throws:', e.message);
}

// Edge case: Zero-length quaternion
const q_dusk_zero = new Dusk.quat(0, 0, 0, 0);
const q_day_zero = new Day.quat(0, 0, 0, 0);
const q_dawn_zero = new Dawn.quat(0, 0, 0, 0);

console.log('\\n--- Edge Case: Zero-length quaternion ---');
try {
    const result = Dusk.inverse(q_dusk_zero);
    console.log('Dusk says (array):', `[${result.x}, ${result.y}, ${result.z}, ${result.w}]`);
} catch (e) {
    console.log('Dusk throws:', e.message);
}

try {
    const result = Day.inverse(q_day_zero);
    console.log('Day says (array): ', result.array);
} catch (e) {
    console.log('Day throws:', e.message);
}

try {
    const result = Dawn.inverse(q_dawn_zero);
    console.log('Dawn says (array):', result.array);
} catch (e) {
    console.log('Dawn throws:', e.message);
}
