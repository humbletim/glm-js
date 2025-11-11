import glm from '../implementation/index.js'
//require.cache[require('path').resolve('test', 'glm-js')] = { loaded: true, exports: glm };
import Mocha from 'mocha';
const mocha = new Mocha;
import { readFileSync } from 'fs';

import chai from 'chai'

globalThis.describe = {exists: true};
import self from '../../test/browser/cane.js'
chai.use((chai, utils) => {
    self.flag = utils.flag;
    for(var p in self.properties)
        chai.Assertion.addProperty(p, self.properties[p]);
    for(var p in self.methods) {
        //console.debug("addMethod", p);
        if (p in self.properties) // chainableMethod
            chai.Assertion.addChainableMethod(p, self.methods[p], self.properties[p]);
        else
            chai.Assertion.addMethod(p, self.methods[p]);
    }
});
cane.patchChai(chai);
// chai.Assertion.addMethod('roughly', function (d) {
//     const obj = this._obj;
//     this.to.be.closeTo(d, glm.epsilon());
// });

Object.assign(globalThis, { glm, expect: chai.expect });
// use of eval is blessed -- it avoids any and all CJS vs ESM infighting 
eval(readFileSync('./tests/__glm_tdd_stubs__.js', 'utf-8'))

mocha.addFile("../test/legacy-tests.cjs");
mocha.run();
