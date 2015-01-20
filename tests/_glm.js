// temporary scaffolding (local node / spidermonkey CLI testing)
try { 
   load(environment.XJS_ENV+"/xjs._ENV.js");
   console = _ENV.console;
} catch(e) {
   try { console.warn(e); } catch(up) {}
   try {
      console = require(process.env.XJS_ENV+"/xjs._ENV").console;
   } catch(e) {
      try { console.warn(e); } catch(up) {}
      console={warn: print, log: print};
   }
}

self = {}; // three.js references self somewhere

var glmthree = 'build/glm.min';//'src/glm.three';
try {
   THREE = require('../lib/three');
   glm = require('../'+glmthree);
} catch(e) {
   /* THREE = */ load('lib/three.js');
   /* glm = */ load(glmthree+'.js');
}
glm.$log = function(x,y,z) { console.log.apply(console,[].slice.call(arguments).map(function(x){return glm.to_string(x); })); };

try { module.exports = glm; } catch(e) {}