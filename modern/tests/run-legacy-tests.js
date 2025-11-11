import glm from '../implementation/index.js'
//require.cache[require('path').resolve('test', 'glm-js')] = { loaded: true, exports: glm };
import Mocha from 'mocha';
const mocha = new Mocha;
import { readFileSync } from 'fs';

import chai from 'chai'

chai.Assertion.addMethod('roughly', function (d) {
    const obj = this._obj;
    this.to.be.closeTo(d, glm.epsilon());
});

Object.assign(globalThis, { glm, expect: chai.expect });
eval(readFileSync('./tests/__glm_tdd_stubs__.js', 'utf-8'))

mocha.addFile("../test/legacy-tests.cjs");
mocha.run();
