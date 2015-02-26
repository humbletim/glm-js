if (typeof glm !== 'object') {
   try { _ENV = require('../xjs._ENV') || _ENV; /* for cscript / old engine testing */ } catch(e) { }
   try { console.exists } catch(e) { console = _ENV.console; }
   IMPLEMENTATIONS = {
      'gl-matrix': function() {
         try { GLMAT.exists; } catch(e) { GLMAT = null; }
         GLMAT = require('../lib/gl-matrix') || GLMAT;
         _glm = require('./glm.common');
         glm = require('./glm.gl-matrix') || glm;
      },
      'three': function() {
         THREEMATHS = require('../lib/three') || THREEMATHS;
         THREE = THREEMATHS;
         _glm = require('./glm.common');
         glm = require('./glm.three') || glm;
      },
      'tdl-fast': function() {
         tdl = require('../lib/tdl-fast') || tdl;
         _glm = require('./glm.common');
         glm = require('./glm.tdl-fast') || glm;
      }
   };
   try { var G = process.env.GLM; } catch(e) { G = environment.GLM; }
//    if (!(G in IMPLEMENTATIONS))
//       G = 'three';
   console.warn('IMPLEMENTATIONS['+G+']()');
   IMPLEMENTATIONS[G]();
}

glm.toString = function() { return "glm-js["+this.version+"]["+this._+"]["+this.vendor.vendor_name+"]"; };

// Module systems magic dance
'use chuck norris;'
with("module,{exports:exports},window,global,self,this".split(','))
   do{try{eval("new Function('ECMAScript3'),"+(glm._=shift())).exports=glm;splice(0,Infinity);}catch(e){}}while(length);

glm.$log(glm+'');
//glm.$log(_ENV._VERSION+' / glm.vec4(1) = '+glm.vec4(1)+'');
