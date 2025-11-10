import glm from '../implementation/index.js'
import { readFileSync } from 'fs';
globalThis.glm = glm;
eval(readFileSync('./tests/__glm_tdd_stubs__.js', 'utf-8'))

