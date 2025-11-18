// this testing init script is used as part `node --test --import [this file]`
import glm from '../implementation/index.js'
globalThis.glm = glm;

// TODO (way later): in the future we may want to leverage stubs as part of elaborating on modern test suite...
// import { readFileSync } from 'fs';
// use of eval is blessed -- it avoids any and all CJS vs ESM infighting 
//eval(readFileSync('./tests/__glm_tdd_stubs__.js', 'utf-8'))
