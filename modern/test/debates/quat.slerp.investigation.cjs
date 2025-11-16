const Dusk = require('../../../build/glm-js.js');
const Day = require('../../dist/modern-glm-js.cjs');
const Dawn = require('../../implementation/index.js').default;

console.log('--- The Debaters: quat.slerp investigation ---');

// Case 1: Zero-length quaternion
const q1_dusk_zero = new Dusk.quat(0, 0, 0, 0);
const q1_day_zero = new Day.quat(0, 0, 0, 0);
const q1_dawn_zero = new Dawn.quat(0, 0, 0, 0);

const q2_dusk_identity = new Dusk.quat(0, 0, 0, 1);
const q2_day_identity = new Day.quat(1, 0, 0, 0);
const q2_dawn_identity = new Dawn.quat(1, 0, 0, 0);

const t = 0.5;

console.log('\\n--- Case 1: Zero-length quaternion ---');
try {
    const result = Dusk.slerp(q1_dusk_zero, q2_dusk_identity, t);
    console.log('Dusk says (array):', result.array);
} catch (e) {
    console.log('Dusk throws:', e.message);
}

try {
    const result = Day.slerp(q1_day_zero, q2_day_identity, t);
    console.log('Day says (array): ', result.array);
} catch (e) {
    console.log('Day throws:', e.message);
}

try {
    const result = Dawn.slerp(q1_dawn_zero, q2_dawn_identity, t);
    console.log('Dawn says (array):', result.array);
} catch (e) {
    console.log('Dawn throws:', e.message);
}

// Case 2: Quaternions are very close
const q1_dusk_close = new Dusk.quat(0, 0, 0, 1);
const q1_day_close = new Day.quat(1, 0, 0, 0);
const q1_dawn_close = new Dawn.quat(1, 0, 0, 0);

const q2_dusk_close = new Dusk.quat(0.000001, 0, 0, 0.999999);
const q2_day_close = new Day.quat(0.999999, 0.000001, 0, 0);
const q2_dawn_close = new Dawn.quat(0.999999, 0.000001, 0, 0);


console.log('\\n--- Case 2: Quaternions are very close ---');
try {
    const result = Dusk.slerp(q1_dusk_close, q2_dusk_close, t);
    console.log('Dusk says (array):', result.array);
} catch (e) {
    console.log('Dusk throws:', e.message);
}

try {
    const result = Day.slerp(q1_day_close, q2_day_close, t);
    console.log('Day says (array): ', result.array);
} catch (e) {
    console.log('Day throws:', e.message);
}

try {
    const result = Dawn.slerp(q1_dawn_close, q2_dawn_close, t);
    console.log('Dawn says (array):', result.array);
} catch (e) {
    console.log('Dawn throws:', e.message);
}
