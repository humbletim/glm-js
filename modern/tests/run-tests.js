// modern/tests/run-tests.js
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import test from 'node:test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

async function run() {
    let glm;
    if (process.env.GLM_IMPLEMENTATION_PATH) {
        // Legacy CJS path
        const resolvedPath = path.resolve(__dirname, '..', '..', process.env.GLM_IMPLEMENTATION_PATH);
        glm = require(resolvedPath);
    } else {
        // Modern ESM path
        const resolvedPath = path.resolve(__dirname, '../implementation/index.js');
        glm = (await import(resolvedPath)).default;
    }

    global.glm = glm;

    const testFiles = fs.readdirSync(__dirname)
        .filter(file => file.endsWith('.test.js'));

    for (const file of testFiles) {
        await import(path.join(__dirname, file));
    }
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
