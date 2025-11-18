// --- modern/test/debates/2025.11.14.eulerAngles.cjs ---
// (We may need to patch this if 'Day' tries to find a 'glm' global)
const Dusk = require('../../../legacy/build/glm-js.js');
const Day = require('../../../dist/modern-glm-js.cjs');
const Dawn = require('../../../implementation/index.js').default;

console.log('--- The Debaters ---');
console.log({
  Dusk_version: Dusk.version,
  Day_version: Day.version,
  Dawn_version: Dawn.version
});

// --- The Topic: e.g., eulerAngles with a specific quat ---
console.log('\\n--- Topic: eulerAngles(q) ---');
const q = new Dusk.quat(0, 0, 1, 0); // Example input
const q_day = new Day.quat(0, 0, 1, 0); // Need to use Day's constructor
const q_dawn = new Dawn.quat(0, 0, 1, 0); // Need to use Dawn's constructor

try {
  console.log('Dusk says (array):', Dusk.eulerAngles(q).array);
} catch (e) {
  console.log('Dusk: Error', e.message);
}

try {
  console.log('Day says (array):', Day.eulerAngles(q_day).array);
} catch (e) {
  console.log('Day: Error', e.message);
}

try {
  console.log('Dawn says (array):', Dawn.eulerAngles(q_dawn).array);
} catch (e) {
  console.log('Dawn: Error', e.message);
}
