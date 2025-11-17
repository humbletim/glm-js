const Dusk = require('../../../build/glm-js.js');
const Day = require('../../dist/modern-glm-js.cjs');
const Dawn = require('../../implementation/index.js').default;

console.log('--- The Debaters: quat Constructor & Serialization ---');

// Use distinct values to clearly see the order
const w = 1, x = 2, y = 3, z = 4;

// --- DUSK (Legacy) ---
const q_dusk = new Dusk.quat(w, x, y, z);
console.log('\\n--- DUSK ---');
console.log('Signature: (w, x, y, z)');
console.log('.toString():      ', q_dusk.toString());
console.log('Dusk.to_string():  ', Dusk.to_string ? Dusk.to_string(q_dusk) : 'N/A');
console.log('.array getter:    ', q_dusk.array);
console.log('JSON.stringify:   ', JSON.stringify(q_dusk));


// --- DAY (Modern CJS) ---
// Per user feedback, modern ctors are likely w,x,y,z
const q_day = new Day.quat(w, x, y, z);
console.log('\\n--- DAY ---');
console.log('Signature: (w, x, y, z)');
console.log('.toString():      ', q_day.toString());
console.log('Day.to_string():  ', Day.to_string ? Day.to_string(q_day) : 'N/A');
console.log('.array getter:    ', q_day.array);
console.log('JSON.stringify:   ', JSON.stringify(q_day));


// --- DAWN (Modern ESM) ---
const q_dawn = new Dawn.quat(w, x, y, z);
console.log('\\n--- DAWN ---');
console.log('Signature: (w, x, y, z)');
console.log('.toString():      ', q_dawn.toString());
console.log('Dawn.to_string(): ', Dawn.to_string ? Dawn.to_string(q_dawn) : 'N/A');
console.log('.array getter:    ', q_dawn.array);
console.log('JSON.stringify:   ', JSON.stringify(q_dawn));
