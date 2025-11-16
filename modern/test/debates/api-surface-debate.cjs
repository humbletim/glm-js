const Dusk = require('../../../build/glm-js.js');
const Dawn = require('../../implementation/index.js').default;

console.log('--- The Debaters: API Surface Area ---');

const duskAPI = Object.keys(Dusk).filter(key => !key.startsWith('$') && !key.startsWith('_'));
const dawnAPI = Object.keys(Dawn).filter(key => !key.startsWith('$') && !key.startsWith('_'));

const duskOnly = duskAPI.filter(key => !dawnAPI.includes(key));
const dawnOnly = dawnAPI.filter(key => !duskAPI.includes(key));
const common = duskAPI.filter(key => dawnAPI.includes(key));

console.log(`
Dusk to Dawn: A Friendly Chat About Our API Surfaces

Hey Dawn,

I was just looking at our APIs and noticed a few things. Here's a little summary:

--- Summary ---

- I have ${duskAPI.length} public APIs, and you have ${dawnAPI.length}.
- We share ${common.length} APIs in common.
- There are ${duskOnly.length} APIs that I have and you don't.
- There are ${dawnOnly.length} APIs that you have and I don't.

--- APIs I Have That You Don't ---

${duskOnly.map(key => `- ${key}`).join('\n')}

--- APIs You Have That I Don't ---

${dawnOnly.map(key => `- ${key}`).join('\n')}

---

Just thought you'd like to know!

Cheers,
Dusk
`);
