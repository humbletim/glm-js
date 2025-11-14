import glm from '../implementation/index.js'
import Mocha from 'mocha';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';
import os from 'os';
import denylist from './legacy-test-denylist.js';
import chai from 'chai'
import self from '../../test/browser/cane.js'
import { toCppStringMat, toCppStringVec, toCppStringQuat } from "../implementation/format.js";

const mocha = new Mocha;

chai.use((chai, utils) => {
    self.flag = utils.flag;
    for(var p in self.properties)
        chai.Assertion.addProperty(p, self.properties[p]);
    for(var p in self.methods) {
        if (p in self.properties) // chainableMethod
            chai.Assertion.addChainableMethod(p, self.methods[p], self.properties[p]);
        else
            chai.Assertion.addMethod(p, self.methods[p]);
    }
});
self.patchChai(chai);

Object.assign(globalThis, {
    glm,
    expect: chai.expect,
    toCppStringMat,
    toCppStringVec,
    toCppStringQuat,
});

eval(readFileSync('./tests/__glm_tdd_stubs__.js', 'utf-8'))

const legacyTestPath = '../test/legacy-tests.cjs';
mocha.addFile(legacyTestPath);

const runner = mocha.run((failures) => {
  process.exit(failures > 0 ? 1 : 0);
});

function getFullTitle(suite) {
    let title = '';
    if (suite.parent) {
        title = getFullTitle(suite.parent) + ' ';
    }
    return title + suite.title;
}

runner.on('suite', function(suite) {
    suite.tests.forEach(function(test) {
        const fullTitle = getFullTitle(suite) + ' ' + test.title;
        if (denylist.has(fullTitle.trim())) {
            test.pending = true;
        }
    });
});
