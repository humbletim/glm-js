if (typeof glm !== 'object') {
   try { _ENV = require('../xjs._ENV') || _ENV; /* for cscript / old engine testing */ } catch(e) { }
   try { console.exists } catch(e) { console = _ENV.console; }
   IMPLEMENTATIONS = {
      'gl-matrix-min': function() { glm = require('../build/glm-gl-matrix.min.js'); },
      'gl-matrix': function() {
         try { GLMAT.exists; } catch(e) { GLMAT = null; }
         GLMAT = require('../lib/gl-matrix') || GLMAT;
         _glm = require('./glm.common');
         glm = require('./glm.gl-matrix') || glm;
      },
      'three-min': function() { glm = require('../build/glm-three.min.js'); },
      'three': function() {
         THREEMATHS = require('../lib/three') || THREEMATHS;
         THREE = THREEMATHS;
         _glm = require('./glm.common');
         glm = require('./glm.three') || glm;
      },
      'tdl-fast-min': function() { glm = require('../build/glm-tdl-fast.min.js'); },
      'tdl-fast': function() {
         tdl = require('../lib/tdl-fast') || tdl;
         _glm = require('./glm.common');
         glm = require('./glm.tdl-fast') || glm;
      }
   };
   try { var G = process.env.GLM; $GLM_DEBUG = process.env.DEBUG; } catch(e) { G = environment.GLM; }
   if (!(G in IMPLEMENTATIONS)) {
      console.error('example invocation:\n\tenv GLM=<'+Object.keys(IMPLEMENTATIONS).join("|")+"> node test/test.js\n");
      process.exit(-2);
   }
   console.warn('IMPLEMENTATIONS['+G+']()');
   IMPLEMENTATIONS[G]();
}

glm.toString = function() { return "glm-js["+this.version+"]["+this._+"]["+this.vendor.vendor_name+"]"; };

// Module systems magic dance
'use chuck norris;'
with("module,{exports:exports},window,global,self,this".split(','))
   do{try{eval("new Function('ECMAScript3'),"+(glm._=shift())).exports=glm;splice(0,Infinity);}catch(e){}}while(length);

glm.$log(glm+'');
