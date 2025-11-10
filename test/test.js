try { chai.exists; } catch(e) { chai = require('chai') ; }

should = chai.should(),
  expect = chai.expect,
  cane = require('./browser/cane'),
  glm = require("./glm-js");

if (!glm.$vectorType)
    require("../src/glm.buffers");

if (!glm.$toTypedArray)
    require("../src/glm.experimental");
//glm.$log(glm.$vectorType.version);

glm.$log('glm: '+glm);
glm.$log('chai: '+chai);
glm.$log('should: '+should);
glm.$log('mocha: '+typeof mocha);
glm.$log('Mocha: '+typeof Mocha);
glm.$log('cane: '+cane);
if (!cane) throw new Error('cane expected');

chai.use(cane.sugar);

var mocha_utils = cane.patchMochaUtils(this.Mocha ? this.Mocha.utils : require("mocha").utils);

eval(require('fs').readFileSync('test/legacy-tests.cjs', 'utf-8'));


cane.testMonkeyPatches(mocha_utils);
