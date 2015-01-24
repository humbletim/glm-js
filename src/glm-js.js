if (typeof glm !== 'object') {
   _ENV = require('../xjs._ENV');
   _glm = require('./glm.common');
   IMPLEMENTATIONS = {
      'gl-matrix': function() {
         GLMAT = require('../lib/gl-matrix');
         glm = require('./glm.gl-matrix');
      },
      'three': function() {
         THREE = require('../lib/three');
         glm = require('./glm.three');
      },
      'tdl-fast': function() {
         tdl = require('../lib/tdl-fast');
         glm = require('./glm.tdl-fast');
      }
   };
   var G = process.env.GLM;
   if (!(G in IMPLEMENTATIONS))
      G = 'three';
      
   IMPLEMENTATIONS[G]();
   
}

glm.toString = function() { return "glm-js["+this.version+"]["+this._+"]"; };

// Module systems magic dance
'use chuck norris;'
with("module,{exports:exports},window,global,self,this".split(','))
   do{try{eval("new Function('ECMAScript3'),"+(glm._=shift())).exports=glm;splice(0,Infinity);}catch(e){}}while(length);

glm.$DLL.console.warn(glm+'');
glm.$DLL.console.warn(_ENV._VERSION+' / glm.vec4(1) = '+glm.vec4(1)+'');
