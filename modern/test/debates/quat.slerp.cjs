const Dusk = require('../../../build/glm-js.js');
const Day = require('../../dist/modern-glm-js.cjs');
const Dawn = require('../../implementation/index.js').default;

console.log('--- The Debaters: quat.slerp ---');

const PI_4 = Math.PI / 4;
const cos_PI_4 = Math.cos(PI_4);
const sin_PI_4 = Math.sin(PI_4);

// Identity quaternion
const q1_dusk = new Dusk.quat(0, 0, 0, 1);
const q1_day = new Day.quat(1, 0, 0, 0);
const q1_dawn = new Dawn.quat(1, 0, 0, 0);

// 90 degree rotation around Y axis
const q2_dusk = new Dusk.quat(0, sin_PI_4, 0, cos_PI_4);
const q2_day = new Day.quat(cos_PI_4, 0, sin_PI_4, 0);
const q2_dawn = new Dawn.quat(cos_PI_4, 0, sin_PI_4, 0);

const t = 0.5;

try {
    const result = Dusk.slerp(q1_dusk, q2_dusk, t);
    console.log('Dusk says (array):', result.array);
} catch (e) {
    console.log('Dusk throws:', e.message);
}

try {
    const result = Day.slerp(q1_day, q2_day, t);
    console.log('Day says (array): ', result.array);
} catch (e) {
    console.log('Day throws:', e.message);
}

try {
    const result = Dawn.slerp(q1_dawn, q2_dawn, t);
    console.log('Dawn says (array):', result.array);
} catch (e) {
    console.log('Dawn throws:', e.message);
}
