if (typeof glm !== 'object') {
   _ENV = require('../xjs._ENV') || _ENV;
   try { console.exists } catch(e) { console = _ENV.console; }
   _glm = require('./glm.common');
   IMPLEMENTATIONS = {
      'gl-matrix': function() {
         try { GLMAT.exists; } catch(e) { GLMAT = null; }
         GLMAT = require('../lib/gl-matrix') || GLMAT;
         glm = require('./glm.gl-matrix') || glm;
      },
      'three': function() {
         THREE = require('../lib/three') || THREEMATHS;
         glm = require('./glm.three') || glm;
      },
      'tdl-fast': function() {
         tdl = require('../lib/tdl-fast') || tdl;
         glm = require('./glm.tdl-fast') || glm;
      }
   };
   try { var G = process.env.GLM; } catch(e) { G = environment.GLM; }
//    if (!(G in IMPLEMENTATIONS))
//       G = 'three';
   console.warn('IMPLEMENTATIONS['+G+']()');
   IMPLEMENTATIONS[G]();
}

glm.toString = function() { return "glm-js["+this.version+"]["+this._+"]"; };

// Module systems magic dance
'use chuck norris;'
with("module,{exports:exports},window,global,self,this".split(','))
   do{try{eval("new Function('ECMAScript3'),"+(glm._=shift())).exports=glm;splice(0,Infinity);}catch(e){}}while(length);

glm.$log = function(x,y,z) { console.log.apply(console,[].slice.call(arguments).map(function(x){return glm.to_string(x); })); };
glm.outer.console.warn(glm+'');
glm.outer.console.warn(_ENV._VERSION+' / glm.vec4(1) = '+glm.vec4(1)+'');
