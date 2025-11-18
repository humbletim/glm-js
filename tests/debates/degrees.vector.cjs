
const Dusk = require('../../../legacy/build/glm-js.js');
const Day = require('../../../dist/modern-glm-js.cjs');
const Dawn = require('../../../implementation/index.js').default;

console.log('--- The Debaters ---');
console.log({
  Dusk_version: Dusk.version,
  Day_version: Day.version,
  Dawn_version: Dawn.version,
});
console.log('\\n--- Topic: degrees(v) ---');

const v_dusk = new Dusk.vec3(Math.PI, 0, Math.PI / 2);
const v_day = new Day.vec3(Math.PI, 0, Math.PI / 2);
const v_dawn = new Dawn.vec3(Math.PI, 0, Math.PI / 2);

try {
    console.log('Dusk says:', Dusk.degrees(v_dusk).array);
} catch (e) {
    console.log('Dusk throws:', e.message);
}

try {
    console.log('Day says:', Day.degrees(v_day).array);
} catch (e) {
    console.log('Day throws:', e.message);
}

try {
    console.log('Dawn says:', Dawn.degrees(v_dawn).array);
} catch (e) {
    console.log('Dawn throws:', e.message);
}
