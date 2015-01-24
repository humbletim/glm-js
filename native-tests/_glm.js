// temporary scaffolding (local node / spidermonkey CLI testing)
try { 
   load("./xjs._ENV.js");
   console = _ENV.console;
} catch(e) {
   try { console.error('xjs error:'+e); } catch(up) { WScript.Echo(e.message); }
   try {
      console = require(process.env.XJS_ENV+"/xjs._ENV").console;
   } catch(e) {
      try { console.warn('err:',e); } catch(up) { WScript.Echo(e.message); }
      console={warn: print, log: print};
   }
}

self = {}; // three.js references self somewhere

var IMPLEMENTATIONS = {
   THREE: function() {
      var glmthree = 1 ? 'src/glm.three' : 'build/glm.min';
      try {
         THREE = require('../lib/three');
         _glm = require('../'+glmthree.replace('three','common'));
         glm = require('../'+glmthree);
      } catch(e) {
         console.error('err',e);
         /* THREE = */ load('./lib/three.js');
         /* _glm */ load('./'+glmthree.replace('three','common')+".js");
         try { THREE = THREEMATHS; } catch(e) {}
         /* glm = */ load(glmthree+'.js');
      }
   },
   glMatrix: function() {
      try {
         GLMAT = require('../lib/gl-matrix');
         _glm = require('../src/glm.common');
         glm = require('../src/glm.gl-matrix');
      } catch(e) {
         console.error('ERRROR',e);
         GLMAT = exports = {};
         /* GLMAT = */ load('lib/gl-matrix.js');
         console.warn("GLMAT", GLMAT, GLMAT.VERSION);
         //delete exports;
         /* _glm = */ load('src/glm.common.js');
         /* glm = */ load('src/glm.gl-matrix.js');
      }
   }
};
var GLM="THREE";
try { GLM=process.env.GLM.toString(); } catch(e) { try { GLM=environment.GLM.toString(); } catch(e) {}}
console.warn("GLM="+GLM);
try {
   IMPLEMENTATIONS[GLM]();
} catch(e) {
   console.error('....',e);
   console.error("env GLM=["+Object.keys(IMPLEMENTATIONS).join("|")+"]");
   IMPLEMENTATIONS.THREE();
}

console.info('... _glm.js boostrapped', glm.version);
glm.$log = function(x,y,z) { console.log.apply(console,[].slice.call(arguments).map(function(x){return glm.to_string(x); })); };

try { module.exports = glm; } catch(e) {}

