// ----------------------------------------------------------------------------
// glm.common.js - common math wrangler bits
// for full functionality this requires linking with a "math vendor" back-end
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

try { console.info("glm.common.js"); } catch(e) {}
$glm_error_prefix = 'glm-js: ';

$glm_extern = function(func, local) {
   try { console.debug("extern "+func, local); } catch(e){}
   local = local || func;
   return function() { 
      glm[local] = glm.$unary_ops[func] || glm.$DLL[func]; 
      if (!glm[local]) throw new Error($glm_error_prefix + '$glm_extern: unresolved external symbol: '+func);
      return glm[local].apply(this, arguments);
   };
};

$glm_intern = function(k,v) {
   if (v === undefined && typeof k === 'object') {
      for(var p in k) $glm_intern(p, k[p]);
      return;
   }
   //glm.$DLL.console.debug("intern "+k, v && (v.name || typeof v));
   return glm.$DLL[k] = v;
};

glm = {
   version: "0.0.1",
   GLM_VERSION: 95,

   $DLL: {
      console: {
         debug: function() {} || 
            (console.debug ? function() { console.debug([].slice.call(arguments)); } : 
             function() { console.warn([].slice.call(arguments)); }),
         warn: function() { console.warn([].slice.call(arguments)); },
         error: function() { console.error([].slice.call(arguments)); },
         write: function(x) { try{console.write(x)}catch(e){this.debug(x)} }
      }
   },
   $intern: $glm_intern,
   $extern: $glm_extern,

   _degrees: $glm_extern('degrees', '_degrees'),
   radians: $glm_extern("radians"),
   normalize: $glm_extern('normalize'),
   inverse: $glm_extern('inverse'),
   length: $glm_extern('length'),

   $binary_ops: {},
   $unary_ops: {},

   make_vec2: function(ptr) { return new glm.vec2([].slice.call(ptr,0,2)); },
   make_vec3: function(ptr) { return new glm.vec3([].slice.call(ptr,0,3)); },
   make_vec4: function(ptr) { return new glm.vec4([].slice.call(ptr,0,4)); },
   make_quat: function(ptr) { return new glm.quat([].slice.call(ptr,0,4)); },
   make_mat3: function(ptr) { return new glm.mat3([].slice.call(ptr,0,9)); },
   make_mat4: function(ptr) { return new glm.mat4([].slice.call(ptr,0,16)); },

   toMat4: function(q) { return new glm.mat4(q); },

   FAITHFUL: true, // attempt to match glm::to_string output ASCII-for-ASCII

   to_string: function(o) {
      try {
         var type = o.$type || typeof o;
         if (!glm[type])
            throw new Error($glm_error_prefix + '' + 'unsupported argtype to glm.to_string: '+[o,type]);
         if (!glm[type].$)
            throw new Error($glm_error_prefix + '' + 'missing .$... glm.to_string: '+[o,type]);
         if (glm.FAITHFUL)
            return glm[type].$.to_string(o).replace(/[\t\n]/g,'');
         return glm[type].$.to_string(o); // pretty-printed
      } catch(e) {
         glm.$error(type,o+'',e);
      }
   },

   $to_array: function(o) {
      return [].slice.call(o.elements);
   },
   degrees: function(o) { 
      if (o instanceof glm.vec3) {
         return new glm.vec3(glm.$to_array(o).map(glm.degrees));
      }
      return glm._degrees(o);
   },


   rotate: function(mat, theta, axis) { 
      return mat.mul(glm.$DLL.mat4_angleAxis(theta, axis));
   },
   scale: function(mat, v) {
      return mat.mul(glm.$DLL.mat4_scale(v));
   },
   translate: function(mat, v) {
      return mat.mul(glm.$DLL.mat4_translation(v));
   },
   perspective: function(fov, aspect, near, far) {
      return glm.$DLL.mat4_perspective(fov, aspect, near, far);
   },
   clamp: function (a,b,c) { return a<b?b:a>c?c:a; },
   max: function(a,b) { return Math.max(a,b); },
   min: function(a,b) { return Math.min(a,b); },
   sign: Math.sign || function(x) {
      return x > 0 ? 1 : x < 0 ? -1 : 0;
   },
   epsilon: function() { return 1e-6; },
   //lengthSq: function(x) { return x.lengthSq(); },
   eulerAngles: function(q) {
      return glm.$DLL.vec3_eulerAngles(q);
   },
   angleAxis: function(angle, axis) {
      return glm.$DLL.quat_angleAxis(angle, axis);
   },
   FIXEDPRECISION: 6,
   $toString: function(prefix, what, props) {
      try {
         var lp = "";
         props.map(function(p) { return what[lp=p].toFixed(0); }); 
      } catch(e) {
         glm.$DLL.console.error("$toString error", prefix, what, lp);
         throw new Error(e);
      }
      return [prefix, "(",
              props.map(function(p) { return what[p].toFixed(glm.FIXEDPRECISION); })
              .join(", "), ")" ].join("");
   }
};

// ----------------------------------------------------------------------------

var glm_template = glm.$template = {
   jstypes: {
      "number": "float"
   },
   "<T>": function(F, dbg) {
      var func = function(o) {
         if (!F[o.$type])
            throw new Error($glm_error_prefix + '' + 'unsupported argtype to glm.'+dbg+'<T>: '+[o.$type || typeof o]);
         //console.warn("template", o.$type, o+'',dbg, typeof F[o.$type]);
         return F[o.$type](o);
      };
      func['<T>'] = func.$template = F;
      return func;
   },
   "<T,V>": function(F, dbg) {
      var func = function(o,p) {
         if (this.$type) { p=o, o=this; }
         var TV = [o.$type, p.$type || glm_template.jstypes[typeof p] || "null"];
         if (!F[TV])
            throw new Error($glm_error_prefix + '' + 'unsupported argtype to '+dbg+'<T,V>: '+TV);
         return F[TV](o,p);
      };
      func['<T,V>'] = func.$template = F;
      return func;
   },

   binary_ops: function(TS) { return this.typedef("<T,V>",TS,glm.$binary_ops); },

   unary_ops: function(TS) { return this.typedef("<T>",TS,glm.$unary_ops); },

   typedef: function(TV, TS, ret) {
      for(var p in TS) {
         //glm.$DLL.console.debug(TV, p, TS[p].op);
         for(var TN in TS[p]) {
            //glm.$DLL.console.warn(TN);
            if (/vec<N>/.test(TN)) {
               var tpl = TS[p][TN];;
               delete TS[p][TN];
               [2,3,4].forEach(
                  function(N){
                     var kn = TN.replace(/<N>/,N);
                     if (!( kn in TS[p] )) {
                        //glm.$DLL.console.warn(p,"implicit "+kn);
                        TS[p][kn] = eval(("1,"+tpl).replace(/N/g,N));
                     }
                  }
               );
            }
         }
         ret[p] = glm_template[TV](TS[p], p);
         if (TS[p].op)
            ret[TS[p].op] = ret[p];
      }
      return ret;
   },

   glmType: function ($type, $) {
      var $len = $.identity.length;
      var $class = function(n) { 
         var sig = typeof n + arguments.length;
         var builder = $[sig];
         if (!builder) 
            throw new Error($glm_error_prefix + 'no template found for '+$type+'.$.'+sig);
         //glm.$DLL.console.warn(sig, $type, n, $type, this.$type, this.constructor);
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
      $class.toString = function() { return "function glm."+$type+"(){ [ glmType ] }"; };
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

// ----------------------------------------------------------------------------
// typeof support for catch-all to_string()
glm['string'] = {
   $typeName: "string",
   $: { to_string: function(what) { return what; } }
};
glm['number'] = {
   $typeName: "float",
   $: { 
      to_string: function(what) { 
         return glm.$toString("float", { value: what }, ['value']);
      }
   }
};

// ----------------------------------------------------------------------------
glm.vec2 = glm_template.glmType(
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
         throw new Error($glm_error_prefix + '' + 'unrecognized object passed to glm.vec2: '+o);
      },
      to_string: function(what) {
         return glm.$toString(what.$typeName, what, ['x','y']);
      }
   }); // glm.vec2.$
// ----------------------------------------------------------------------------
glm.vec3 = glm_template.glmType(
   'vec3',
   {
      name: 'fvec3',
      identity: [0,0,0],
      'undefined0': function() { return glm.vec3.$.identity; },
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
         throw new Error($glm_error_prefix + '' + 'unrecognized object passed to glm.vec3: '+o);
      },
      //TODO: glm.vec3(glm.vec2(),2) -- 'object2'
      to_string: function(what) {
         return glm.$toString(what.$typeName, what, ['x','y','z']);
      }
   }); // glm.vec3.$

// ----------------------------------------------------------------------------

glm.vec4 = glm_template.glmType(
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
         throw new Error($glm_error_prefix + '' + 'unrecognized object passed to glm.vec4: '+[o,o.$type]);
      },
      'object2': function(o,w) {
         if (o instanceof glm.vec3)
            return [o.x, o.y, o.z, w];
         throw new Error($glm_error_prefix + '' + 'unrecognized object passed to glm.vec4(o,w): '+[o,w]);
      },
      //TODO: glm.vec4(glm.vec2(),2,3) -- 'object3'
      to_string: function(what) {
         return glm.$toString(what.$typeName, what, ['x','y','z','w']);
      }
   }
); // glm.vec4.$

// ----------------------------------------------------------------------------
glm.mat3 = glm_template.glmType(
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
         throw new Error($glm_error_prefix + '' + 'unrecognized object passed to glm.mat3: '+o);
      },
      to_string: function(what) {
         var ret = [0,1,2]
         .map(function(_) { return what[_]; }) // into columns
         .map(function(wi) { // each column's vec3
                 return glm.$toString("\t", wi, ['x','y','z']);
              });
         return what.$typeName + '(\n'+ ret.join(", \n") +"\n)";
      }

   }); // glm.mat3.$

// ----------------------------------------------------------------------------
glm.mat4 = glm_template.glmType(
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
         if (M instanceof glm.quat)
            return glm.$DLL.mat4_array_from_quat(M);
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
            throw new Error($glm_error_prefix + '' + 'unrecognized object passed to glm.mat4: '+[M,m4.length]);
         return m4;
      },
      to_string: function(what) {
         var ret = [0,1,2,3]
         .map(function(_) { return what[_]; }) // into columns
         .map(function(wi) { // each column's vec4
                 return glm.$toString("\t", wi, ['x','y','z','w']);
              });
         return what.$typeName + '(\n'+ ret.join(", \n")+"\n)";
      }
   }); // glm.mat4.$


// ----------------------------------------------------------------------------

glm.quat = glm_template.glmType(
   'quat',
   {
      identity: [0,0,0,1],
      'undefined0': function() { return this.identity; },
      'number4': function(w,x,y,z) {
         return [x,y,z,w];
      },
      'object1': function(o) {
         if (o instanceof glm.mat4)
            return glm.$DLL.quat_array_from_mat4(o);
         if (o.length === 4)
            return o;//[o[0], o[1], o[2], o[3]];
            if (o instanceof glm.quat)
            return [o.x, o.y, o.z, o.w];
         if ("w" in o && "x" in o)
            return [o.x, o.y, o.z, o.w];
         throw new Error($glm_error_prefix + '' + 'unrecognized object passed to glm.quat.object1: '+[o,o.$type, typeof o, o.constructor]);
      },
      to_string: function(what) {
         what = glm.degrees(glm.eulerAngles(what));
         return glm.$toString("<quat>"+what.$typeName, what, ['x','y','z']);
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
                 def(p, { get: function() { return new glm[vn](this.elements.subarray(0*n,(0+1)*n)); } });
              })(arr.join(""), 'vec'+arr.length, arr.length);
             /*(function(p,vn) {
                 def(p, { get: function() { return glm[vn](this); } });
              })(arr.slice(0).reverse().join(""), 'vec'+arr.length);*/
          } while(arr[1] != arr.pop());
       };
    };

    rigswizzle(glm.vec2, ['x','y']);

    rigswizzle(glm.vec3, ['x','y','z']);
    rigswizzle(glm.vec3, ['r','g','b']);

    rigswizzle(glm.vec4, ['x','y','z','w']);
    rigswizzle(glm.vec4, ['r','g','b','a']);

    rigswizzle(glm.quat, ['x','y','z','w']);

    // map numeric indexes for vec2, vec3, vec4
    [2,3,4].forEach(
       function(_) {
          var vecp = glm['vec'+_];
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
                        throw new Error($glm_error_prefix + ''+"unsupported argtype to "+
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
    cols(glm.mat4, glm.vec4);
    cols(glm.mat3, glm.vec3);
   
    
 })(); //indexers and swizzlers

glm.$dumpTypes = function(out) {
   for(var p in glm) 
      if (glm[p].componentLength) {
         out("glm."+p, JSON.stringify(
                { 
                   '#type': glm[p].prototype.$typeName,
                   '#floats': glm[p].componentLength,
                   '#bytes': glm[p].BYTES_PER_ELEMENT
                }));
      }
};

glm.init = function(hint, prefix) {
   if (prefix)
      $glm_error_prefix = prefix;
   var DBG = function(x) { 
      glm.$DLL.console.write("\xe2\x9c\x94 "+x); 
      try { if (process.title === 'node')glm.$DLL.console.write("\n"); } catch(e) {}
   };
   try { DBG("glm-js: ENV: "+_ENV._VERSION); } catch(e) {}
   DBG("GLM-JS: initializing: "+JSON.stringify(hint,0,2));
   DBG(JSON.stringify({'unary_ops':Object.keys(glm.$unary_ops), 'binary_ops':Object.keys(glm.$binary_ops)}));
   // augment metadata onto glm types
   (function() {
       for(var p in glm)
          if (typeof glm[p] === 'function' && "$" in glm[p]) {
             var type = glm[p].prototype.$type;
             for(var op in glm.$binary_ops) {
                //glm.$DLL.console.debug("mapping binary operator<"+type+"> "+op);
                glm[p].prototype[op] = glm.$binary_ops[op];
             }
          }
    })();
   DBG("GLM-JS: "+glm.version+" emulating GLM_VERSION="+glm.GLM_VERSION);
};

var thiz = this;
glm.nuke = function() {
   for(var p in glm.$template.binary_ops)
      delete glm.$template.binary_ops[p];
   for(var p in glm_template)
      delete glm_template[p];
   glm_template = null;
   glm.$to_array =5;
   for(var p in glm)
      delete glm[p];
   for(var p in thiz)
      if (/^glm/i.test(p)) delete thiz[p];
   for(var p in global)
      if (/^glm/i.test(p)) delete global[p];
   glm = null;
};

try { module.exports = glm; } catch(e) {}
