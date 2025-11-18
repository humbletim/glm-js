// modern/test/debates/quat_constructor_debate.js
import Dusk from '../../../legacy/build/glm-js.js';
import Day from '../../../dist/modern-glm-js.cjs';
import Dawn from '../../../implementation/index.js';

const w = 1, x = 2, y = 3, z = 4;

console.log('Debating quaternion constructor argument order...');
console.log('Arguments: (w, x, y, z) = (1, 2, 3, 4)');
console.log('Expected internal layout: [x, y, z, w] = [2, 3, 4, 1]');
console.log('-'.repeat(40));

const duskQuat = Dusk.quat(w, x, y, z);
// Dusk doesn't have a convenient .array getter, so we construct it manually
const duskArray = [duskQuat.x, duskQuat.y, duskQuat.z, duskQuat.w];
console.log('Dusk (legacy):', duskArray);

const dayQuat = new Day.quat(w, x, y, z);
console.log('Day (modern CJS):', dayQuat.array);

const dawnQuat = new Dawn.quat(w, x, y, z);
console.log('Dawn (modern ESM):', dawnQuat.array);
