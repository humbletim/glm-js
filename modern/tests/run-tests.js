// modern/tests/run-tests.js
import './test-setup.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
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
