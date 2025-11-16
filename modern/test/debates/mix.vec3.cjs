
const Dusk = require('../../../build/glm-three.min.js');
const Day = require('../../dist/modern-glm-js.cjs');
const Dawn = require('../../implementation/index.js').default;

console.log('--- The Debaters ---');
console.log({
  Dusk_version: Dusk.version,
  Day_version: Day.version,
  Dawn_version: Dawn.version,
});
console.log('\\n--- Topic: mix(v1, v2, t) ---');

const v1_dusk = new Dusk.vec3(0, 0, 0);
const v2_dusk = new Dusk.vec3(10, 20, 30);
const t_dusk = 0.5;

const v1_day = new Day.vec3(0, 0, 0);
const v2_day = new Day.vec3(10, 20, 30);
const t_day = 0.5;

const v1_dawn = new Dawn.vec3(0, 0, 0);
const v2_dawn = new Dawn.vec3(10, 20, 30);
const t_dawn = 0.5;

try {
    console.log('Dusk says:', Dusk.mix(v1_dusk, v2_dusk, t_dusk).toString());
} catch (e) {
    console.log('Dusk throws:', e.message);
}

try {
    console.log('Day says:', Day.mix(v1_day, v2_day, t_day).toString());
} catch (e) {
    console.log('Day throws:', e.message);
}

try {
    console.log('Dawn says:', Dawn.mix(v1_dawn, v2_dawn, t_dawn).toString());
} catch (e) {
    console.log('Dawn throws:', e.message);
}
