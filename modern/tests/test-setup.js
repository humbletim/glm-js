// modern/tests/test-setup.js
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

let glm;

if (process.env.GLM_IMPLEMENTATION_PATH) {
    // Legacy CJS path
    const modernDir = path.resolve(__dirname, '..');
    const resolvedPath = path.resolve(modernDir, process.env.GLM_IMPLEMENTATION_PATH);
    glm = require(resolvedPath);
} else {
    // Modern ESM path
    const resolvedPath = path.resolve(__dirname, '../implementation/index.js');
    glm = (await import(resolvedPath)).default;
}

global.glm = glm;

export default glm;
