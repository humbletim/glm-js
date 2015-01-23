// ----------------------------------------------------------------------------
// glm.common.js - common math wrangler bits
// for full functionality this requires linking with a "math vendor" back-end
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

GLMJS_PREFIX = 'glm-js: ';
function GLMJSError(msg) { 
   function bomb(){
      tryasdf();
   }
   this.e=(function() {try {
                          bomb();
                       } catch(e) {
                          //console.error('ERERERER'+typeof e);
                          return e.stack.split(/\n/)[4];//{e:e+''};
                       }})();
   this.toString = function(){return "[GLMJSError "+GLMJS_PREFIX + msg + "]"+this.e; }
   wtf.prototype.message = msg;
};
function wtf() {}; wtf.prototype = new Error();
GLMJSError.prototype = new wtf();
//msg+"]"; };

$GLM_extern = function(func, local) {
   try { console.debug("extern "+func, local); } catch(e){}
   local = local || func;
   return function() { 
      GLM[local] = GLM.$functions[func] || GLM.$DLL[func]; 
      if (!GLM[local]) throw new GLMJSError('$GLM_extern: unresolved external symbol: '+func);
      return GLM[local].apply(this, arguments);
   };
};

$GLM_intern = function(k,v) {
   //console.warn("$GLM_intern", k,v);
   if (v === undefined && typeof k === 'object') {
      for(var p in k) $GLM_intern(p, k[p]);
      return;
   }
   GLM.$DLL.console.debug("intern "+k, v && (v.name || typeof v));
   return GLM.$DLL[k] = v;
};

GLM = {
   version: "0.0.1",
   GLM_VERSION: 95,

   $operations: {},
   $functions: {},
   $DLL: {
      console: {
         debug: function() {} || 
            (console.debug ? function() { console.debug([].slice.call(arguments)); } : 
             function() { console.warn([].slice.call(arguments)); }),
         warn: function() { console.warn([].slice.call(arguments)); },
         error: function() { console.error([].slice.call(arguments)); },
         write: function(x) { try{console.write(x)}catch(e){this.debug(x)} }
      },
      vec3_eulerAngles: function(q) {
         // adapted from three.js
         var te = this.mat4_array_from_quat(q);
		 var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
		 m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
		 m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];
         
		 var thiz = new glm.vec3();
         thiz.y = Math.asin( - glm.clamp( m31, - 1, 1 ) );

		 if ( Math.abs( m31 ) < 0.99999 ) {
			thiz.x = Math.atan2( m32, m33 );
			thiz.z = Math.atan2( m21, m11 );
		 } else {
			thiz.x = 0;
			thiz.z = Math.atan2( - m12, m22 );
		 }
         return thiz;
      }
   },
   $intern: $GLM_intern,
   $extern: $GLM_extern,

   GLMJSError: GLMJSError,

   _radians: function(n) { return n * Math.PI / 180; },
   _degrees: function(n) { return n * 180 / Math.PI; },

//    _degrees: $GLM_extern('degrees', '_degrees'),
//    radians: $GLM_extern("radians"),

   normalize: $GLM_extern('normalize'),
   inverse: $GLM_extern('inverse'),
   length: $GLM_extern('length'),

   rotate: function(mat, theta, axis) { 
      return mat.mul(GLM.$DLL.mat4_angleAxis(theta, axis));
   },
   scale: function(mat, v) {
      return mat.mul(GLM.$DLL.mat4_scale(v));
   },
   translate: function(mat, v) {
      return mat.mul(GLM.$DLL.mat4_translation(v));
   },
   perspective: function(fov, aspect, near, far) {
      return GLM.$DLL.mat4_perspective(fov, aspect, near, far);
   },
   eulerAngles: function(q) {
      return GLM.$DLL.vec3_eulerAngles(q);
   },
   angleAxis: function(angle, axis) {
      return GLM.$DLL.quat_angleAxis(angle, axis);
   },

   make_vec2: function(ptr) { return new GLM.vec2([].slice.call(ptr,0,2)); },
   make_vec3: function(ptr) { return new GLM.vec3([].slice.call(ptr,0,3)); },
   make_vec4: function(ptr) { return new GLM.vec4([].slice.call(ptr,0,4)); },
   make_quat: function(ptr) { return new GLM.quat([].slice.call(ptr,0,4)); },
   make_mat3: function(ptr) { return new GLM.mat3([].slice.call(ptr,0,9)); },
   make_mat4: function(ptr) { return new GLM.mat4([].slice.call(ptr,0,16)); },

   toMat4: function(q) { return new GLM.mat4(q); },

   FAITHFUL: true, // attempt to match GLM::to_string output ASCII-for-ASCII

   to_string: function(o) {
      try {
         var type = o.$type || typeof o;
         if (!GLM[type])
            throw new GLMJSError('unsupported argtype to GLM.to_string: '+[o,type]);
         if (!GLM[type].$)
            throw new GLMJSError('missing .$... GLM.to_string: '+[o,type]);
         if (GLM.FAITHFUL)
            return GLM[type].$.to_string(o).replace(/[\t\n]/g,'');
         return GLM[type].$.to_string(o); // pretty-printed
      } catch(e) {
         GLM.$DLL.console.error('to_string error: ',type,o+'',e);
      }
   },

   $to_array: function(o) {
      return [].slice.call(o.elements);
   },

   clamp: function (a,b,c) { return a<b?b:a>c?c:a; },
   max: function(a,b) { return Math.max(a,b); },
   min: function(a,b) { return Math.min(a,b); },
   sign: Math.sign || function(x) {
      return x > 0 ? 1 : x < 0 ? -1 : 0;
   },
   epsilon: function() { return 1e-6; },
   //lengthSq: function(x) { return x.lengthSq(); },
   FIXEDPRECISION: 6,
   $toString: function(prefix, what, props) {
      try {
         var lp = "";
         props.map(function(p) { return what[lp=p].toFixed(0); }); 
      } catch(e) {
         GLM.$DLL.console.error("$toString error", prefix, what, lp);
         throw new GLMJSError(e);
      }
      return [prefix, "(",
              props.map(function(p) { return what[p].toFixed(GLM.FIXEDPRECISION); })
              .join(", "), ")" ].join("");
   }
};

// ----------------------------------------------------------------------------

var GLM_template = GLM.$template = {
   jstypes: {
      "number": "float",
      "[object Float32Array]": "Float32Array"
   },
   "<T>": function(F, dbg) {
      var func = function(o) {
         var T = [o.$type || GLM_template.jstypes[typeof o] || "null"];
         if (!F[T])
            throw new GLMJSError('unsupported argtype to GLM.'+dbg+'<T>: '+[T || typeof o]);
         //console.warn("template", o.$type, o+'',dbg, typeof F[o.$type]);
         return F[T](o);
      };
      func['<T>'] = func.$template = F;
      return func;
   },
   "<T,V>": function(F, dbg) {
      var func = function(o,p) {
         if (this.$type) { p=o, o=this; }
         var TV = [o.$type, p.$type || GLM_template.jstypes[typeof p] || GLM_template.jstypes[p+''] || "<unknown "+p+">"];
         if (!F[TV])
            throw new GLMJSError('unsupported argtype to '+dbg+'<T,V>: '+TV);
         return F[TV](o,p);
      };
      func['<T,V>'] = func.$template = F;
      return func;
   },

   operations: function(TS) { 
      //console.warn("operations", TS);
      return this._override("<T,V>",TS,GLM.$operations); 
   },

   functions: function(TS) { 
      //console.warn("FUNCTION_SOURCES", TS);
      return this._override("<T>",TS,GLM.$functions);
   },

   _override: function(TV, TS, ret) {
      for(var p in TS) {
         //console.warn("_override", p);
         this.override(TV, p, TS[p], ret);
      }
      return ret;
   },

   denify: function(TSP) {
      for(var TN in TSP) {
         if (/vec<N>/.test(TN)) {
            var tpl = TSP[TN];;
            delete TSP[TN];
            [2,3,4].forEach(
               function(N){
                  var kn = TN.replace(/<N>/,N);
                  if (!( kn in TSP )) {
                     //GLM.$DLL.console.warn(p,"implicit "+kn);
                  TSP[kn] = eval(("1,"+tpl).replace(/N/g,N));
                  }
               }
            );
         }
         //GLM.$DLL.console.warn(TN);
      }
      return TSP;
   },
   override: function(TV, p, TSP, ret) {
      GLM.$DLL.console.debug('override', TV, p, TSP.op);
      ret[p] = GLM_template[TV](GLM_template.denify(TSP), p);
      if (TSP.op)
         ret[TSP.op] = ret[p];
      return ret;
   },
   GLMType: function ($type, $) {
      var $len = $.identity.length;
      var $class = function(n) { 
         var sig = typeof n + arguments.length;
         var builder = $[sig];
         if (!builder) 
            throw new GLMJSError('no template found for '+$type+'.$.'+sig);
         //GLM.$DLL.console.warn(sig, $type, n, $type, this.$type, this.constructor);
         if (this instanceof $class) {
            if (n instanceof Float32Array) {
               // new $class(<Float32Array>) adopts the passed elements
               if (n.length > $len) {
                  //throw new Error('elements size mismatch: '+ ['wanted:'+$len, n.length]);
                  n = n.subarray(0,$len);
               }
               this.elements = n;
               //Object.defineProperty(this, 'elements', { enumerable: false, configurable: true, value: n });//
            } else {
               //Object.defineProperty(this, 'elements', { enumerable: false, configurable: true, value: new Float32Array($len) });//this.elements = n;

               (this.elements = new Float32Array( $len ))
                  .set(builder.apply($, arguments));
            }
         } else {
            return new $class(builder.apply($, arguments));
         }
      };
      $class.$ = $;
      $class.componentLength = $len;
      $class.BYTES_PER_ELEMENT = $len * Float32Array.BYTES_PER_ELEMENT,
      $class.toString = function() { return "function GLM."+$type+"(){ [ GLMType ] }"; };
      $class.prototype = {
         $type: $type,
         $typeName: $.name || '<'+$type+'>',
         $len: $len,
         constructor: $class,
         __proto__: 5,
         clone: function() { return new $class(this); },
         toString: function() {
            return $.to_string(this);
         },
         byteLength: $class.BYTES_PER_ELEMENT,
         componentLength: $class.componentLength,
         get address () {
            var r = this.elements.byteOffset.toString(16);
            return "0x00000000".substr(0,10-r.length)+r;
         }
      };
      return $class;
   }
};

GLM.degrees = GLM.$template.override(
   "<T>", 'degrees', {
      "vec<N>": function(o) {
         return new GLM.vecN(GLM.$to_array(o).map(GLM._degrees));
      },
      "float": function(n) { return GLM._degrees(n); }
   }, GLM.$functions).degrees;

GLM.radians = GLM.$template.override(
   "<T>", 'radians', {
      "vec<N>": function(o) {
         return new GLM.vecN(GLM.$to_array(o).map(GLM._radians));
      },
      "float": function(n) { return GLM._radians(n); }
   }, GLM.$functions).radians;

GLM.$template.override("<T,V>", 'copy', {
                          op: '=',
                          'mat4,mat4': function(me,you) { 
                             me.elements.set(you.elements);
                             return me;
                          }
                       }, GLM.$operations);
                    
// ----------------------------------------------------------------------------
// typeof support for catch-all to_string()
GLM['string'] = {
   $typeName: "string",
   $: { to_string: function(what) { return what; } }
};
GLM['number'] = {
   $typeName: "float",
   $: { 
      to_string: function(what) { 
         return GLM.$toString("float", { value: what }, ['value']);
      }
   }
};

// ----------------------------------------------------------------------------
GLM.vec2 = GLM_template.GLMType(
   'vec2',
   {
      name: 'fvec2',
      identity: [0,0],
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         return [x,x];
      },
      'number2': function(x,y) {
         return [x,y];
      },
      'object1': function(o) {
         switch(o.length){
         case 4: // vec4 -> vec2 reduction
         case 3: // vec3 -> vec2 reduction
         case 2: return [o[0], o[1]];
         default:
               if ("y" in o && "x" in o)
               return [o.x, o.y];
         }
         throw new GLMJSError('unrecognized object passed to GLM.vec2: '+o);
      },
      to_string: function(what) {
         return GLM.$toString(what.$typeName, what, ['x','y']);
      }
   }); // GLM.vec2.$
// ----------------------------------------------------------------------------
GLM.vec3 = GLM_template.GLMType(
   'vec3',
   {
      name: 'fvec3',
      identity: [0,0,0],
      'undefined0': function() { return GLM.vec3.$.identity; },
      'number1': function(x) {
         return [x,x,x];
      },
      'number2': function(x,y) {
         return [x,y,y];
      },
      'number3': function(x,y,z) {
         return [x,y,z];
      },
      'object1': function(o) {
         switch(o.length){
         case 4: // vec4 -> vec3 reduction
         case 3: return [o[0], o[1], o[2]];
         case 2: return [o[0], o[1], o[1]];
         default:
               if ("z" in o /*&& "y" in o*/ && "x" in o)
               return [o.x, o.y, o.z];
         }
         throw new GLMJSError('unrecognized object passed to GLM.vec3: '+o);
      },
      //TODO: GLM.vec3(GLM.vec2(),2) -- 'object2'
      to_string: function(what) {
         return GLM.$toString(what.$typeName, what, ['x','y','z']);
      }
   }); // GLM.vec3.$

// ----------------------------------------------------------------------------

GLM.vec4 = GLM_template.GLMType(
   'vec4',
   {
      name: 'fvec4',
      identity: [0,0,0,0],
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         return [x,x,x,x];
      },
      'number2': function(x,y) {
         return [x,y,y,y];
      },
      'number3': function(x,y,z) {
         return [x,y,z,z];
      },
      'number4': function(x,y,z,w) {
         return [x,y,z,w];
      },
      'object1': function(o) {
         switch(o.length){
         case 4: return [o[0], o[1], o[2], o[3]];
         case 3: return [o[0], o[1], o[2], o[2]];
         case 2: return [o[0], o[1], o[1], o[1]];
         default:
               if ("w" in o /*&& "z" in o && "y" in o*/ && "x" in o)
               return [o.x, o.y, o.z, o.w];
         }
         throw new GLMJSError('unrecognized object passed to GLM.vec4: '+[o,o.$type]);
      },
      'object2': function(o,w) {
         if (o instanceof GLM.vec3)
            return [o.x, o.y, o.z, w];
         throw new GLMJSError('unrecognized object passed to GLM.vec4(o,w): '+[o,w]);
      },
      //TODO: GLM.vec4(GLM.vec2(),2,3) -- 'object3'
      to_string: function(what) {
         return GLM.$toString(what.$typeName, what, ['x','y','z','w']);
      }
   }
); // GLM.vec4.$

// ----------------------------------------------------------------------------
GLM.mat3 = GLM_template.GLMType(
   'mat3',
   {
      name: 'mat3x3',
      identity : [1, 0, 0,
                  0, 1, 0,
                  0, 0, 1],
      'undefined0' : function(M) { return this.identity; },
      'number1': function(M) {
         if (M === 1) {
            return this.identity;
         }
         return [M, 0, 0,
                 0, M, 0,
                 0, 0, M];
      },
      'object1': function(o) {
         var m4 = o.elements || o;
         if (m4.length === 16) {
            return [ // mat4 -> mat3
               m4[0+0], m4[0+1], m4[0+2],
               m4[4+0], m4[4+1], m4[4+2],
               m4[8+0], m4[8+1], m4[8+2]
            ];
         }
         if (m4.length === 9)
            return m4;
         throw new GLMJSError('unrecognized object passed to GLM.mat3: '+o);
      },
      to_string: function(what) {
         var ret = [0,1,2]
         .map(function(_) { return what[_]; }) // into columns
         .map(function(wi) { // each column's vec3
                 return GLM.$toString("\t", wi, ['x','y','z']);
              });
         return what.$typeName + '(\n'+ ret.join(", \n") +"\n)";
      }

   }); // GLM.mat3.$

// ----------------------------------------------------------------------------
GLM.mat4 = GLM_template.GLMType(
   'mat4',
   {
      name: 'mat4x4',
      identity: [1, 0, 0, 0,
                 0, 1, 0, 0,
                 0, 0, 1, 0,
                 0, 0, 0, 1],
      'undefined0' : function() { return this.identity; },
      'number1' : function(M) {
         if (M === 1) 
            return this.identity;
         return [M, 0, 0, 0,
                 0, M, 0, 0,
                 0, 0, M, 0,
                 0, 0, 0, M];
      },
      'object1' : function(M) {
         if (M instanceof GLM.quat)
            return GLM.$DLL.mat4_array_from_quat(M);
         var m4 = M.elements || M;
         if (m4.length === 9) {
            // mat3 -> mat4
            return [
               m4[0+0], m4[0+1], m4[0+2], 0,
               m4[3+0], m4[3+1], m4[3+2], 0,
               m4[6+0], m4[6+1], m4[6+2], 0,
               0      , 0      , 0      , 1
            ];
         }
         if (m4.length !== 16)
            throw new GLMJSError('unrecognized object passed to GLM.mat4: '+[M,m4.length]);
         return m4;
      },
      to_string: function(what) {
         var ret = [0,1,2,3]
         .map(function(_) { return what[_]; }) // into columns
         .map(function(wi) { // each column's vec4
                 return GLM.$toString("\t", wi, ['x','y','z','w']);
              });
         return what.$typeName + '(\n'+ ret.join(", \n")+"\n)";
      }
   }); // GLM.mat4.$


// ----------------------------------------------------------------------------

GLM.quat = GLM_template.GLMType(
   'quat',
   {
      identity: [0,0,0,1],
      'undefined0': function() { return this.identity; },
      'number4': function(w,x,y,z) {
         return [x,y,z,w];
      },
      'object1': function(o) {
         if (o instanceof GLM.mat4)
            return GLM.$DLL.quat_array_from_mat4(o);
         if (o.length === 4)
            return o;//[o[0], o[1], o[2], o[3]];
            if (o instanceof GLM.quat)
            return [o.x, o.y, o.z, o.w];
         if ("w" in o && "x" in o)
            return [o.x, o.y, o.z, o.w];
         throw new GLMJSError('unrecognized object passed to GLM.quat.object1: '+[o,o.$type, typeof o, o.constructor]);
      },
      to_string: function(what) {
         what = GLM.degrees(GLM.eulerAngles(what));
         return GLM.$toString("<quat>"+what.$typeName, what, ['x','y','z']);
      }
   });


// ----------------------------------------------------------------------------
// indexers and swizzles
(function() {

    // indexer templates
    var indexers = [0,1,2,3].map(
       function(_) {
          return { 
             get: function() { return this.elements[_]; },
             set: function(v) { this.elements[_] = v; }
          };
       });
    
    var rigswizzle = function(o, arr) {
       //console.warn("rigswizzle", o.prototype.$typeName, arr);
       var def = function(k,v) {
          //console.warn("okv", o.prototype, k, v);
          Object.defineProperty(o.prototype, k, v);
       };

       // wire-up new o.x, o.y etc.
       arr.forEach(function(a,_) { def(a, indexers[_]); });

       // swizzle (non-numeric, non-_) prop sets
       if (isNaN(arr[0]) && !/^_/.test(arr[0])) { 
          // like .xyzw, ,.xyz, .xy, .wzyx, .zyx, .yx
          do {
             (function(p,vn,n) {
                 def(p, { get: function() { return new GLM[vn](this.elements.subarray(0*n,(0+1)*n)); } });
              })(arr.join(""), 'vec'+arr.length, arr.length);
             /*(function(p,vn) {
                 def(p, { get: function() { return GLM[vn](this); } });
              })(arr.slice(0).reverse().join(""), 'vec'+arr.length);*/
          } while(arr[1] != arr.pop());
       };
    };

    rigswizzle(GLM.vec2, ['x','y']);

    rigswizzle(GLM.vec3, ['x','y','z']);
    rigswizzle(GLM.vec3, ['r','g','b']);

    rigswizzle(GLM.vec4, ['x','y','z','w']);
    rigswizzle(GLM.vec4, ['r','g','b','a']);

    rigswizzle(GLM.quat, ['x','y','z','w']);

    // map numeric indexes for vec2, vec3, vec4
    [2,3,4].forEach(
       function(_) {
          var vecp = GLM['vec'+_];
          rigswizzle(vecp, vecp.$.identity.map(function(n,_) { return _; }));
       });
    
    // TODO: map numeric quat indexes to match with GLM's q[0] usage

    var szfloat = Float32Array.BYTES_PER_ELEMENT;
    function cols(mat, vec) {
       // mat column accessors -- eg: mat[0] as a read/write vec
       var vec_length = vec.$.identity.length;
       [0,1,2,3].slice(0,vec_length) // assumes square matrix
       .forEach(
          function(index) {
             var offset = index * (szfloat * vec_length);
             var cache_index = '_cached_'+index;
             
             Object.defineProperty(
                mat.prototype, index, 
                   { configurable: true,
                     enumerable: true,
                     set: function(o) {
                        if (o instanceof vec)
                           return this[index].elements.set(o.elements);
                        if (o.length === vec_length)
                           return this[index].elements.set(o);
                        throw new GLMJSError("unsupported argtype to "+
                                        mat.prototype.$type+"["+index+'] setter: '+
                                        [typeof o,o]);
                     },
                     get: function() { 
                        if (this[cache_index])
                           return this[cache_index];
                        
                        // defineProperty to mask from enumeration
                        Object.defineProperty(
                           this, cache_index,
                           // this.elements.subarray (which can be reentrant)
                           // didn't work as reliably as new Float32Array(.buffer,...)
                           { 
                              configurable: true,
                              enumerable: false,
                              value: new vec(
                                new Float32Array(
                                   this.elements.buffer, 
                                   this.elements.byteOffset + offset
                                ))});
                        return this[cache_index];
                     } 
                   });
             });
    }
    cols(GLM.mat4, GLM.vec4);
    cols(GLM.mat3, GLM.vec3);
   
    
 })(); //indexers and swizzlers

GLM.$dumpTypes = function(out) {
   for(var p in GLM) 
      if (GLM[p].componentLength) {
         out("GLM."+p, JSON.stringify(
                { 
                   '#type': GLM[p].prototype.$typeName,
                   '#floats': GLM[p].componentLength,
                   '#bytes': GLM[p].BYTES_PER_ELEMENT
                }));
      }
};

GLM.init = function(hint, prefix) {
   if (prefix)
      GLMJS_PREFIX = prefix;
   var DBG = function(x) { 
      GLM.$DLL.console.write("\xe2\x9c\x94 "+x); 
      try { if (process.title === 'node')GLM.$DLL.console.write("\n"); } catch(e) {}
   };
   try { DBG("GLM-js: ENV: "+_ENV._VERSION); } catch(e) {}
   DBG("GLM-JS: initializing: "+JSON.stringify(hint,0,2));
   DBG(JSON.stringify({'functions':Object.keys(GLM.$functions), 'operations':Object.keys(GLM.$operations)}));
   // augment metadata onto GLM types
   (function() {
       for(var p in GLM)
          if (typeof GLM[p] === 'function' && "$" in GLM[p]) {
             var type = GLM[p].prototype.$type;
             for(var op in GLM.$operations) {
                //GLM.$DLL.console.debug("mapping binary operator<"+type+"> "+op);
                GLM[p].prototype[op] = GLM.$operations[op];
             }
          }
    })();
   DBG("GLM-JS: "+GLM.version+" emulating GLM_VERSION="+GLM.GLM_VERSION);
};

var thiz = this;
GLM.nuke = function() {
   for(var p in GLM.$template.binary_ops)
      delete GLM.$template.binary_ops[p];
   for(var p in GLM_template)
      delete GLM_template[p];
   GLM_template = null;
   GLM.$to_array =5;
   for(var p in GLM)
      delete GLM[p];
   for(var p in thiz)
      if (/^GLM/i.test(p)) delete thiz[p];
   for(var p in global)
      if (/^GLM/i.test(p)) delete global[p];
   GLM = null;
};

try { module.exports = GLM; } catch(e) {}
