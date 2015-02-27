// ----------------------------------------------------------------------------
// glm.common.js - common math wrangler bits
// for full functionality this requires linking with a "math vendor" back-end
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

GLMJS_PREFIX = 'glm-js: ';

//http://stackoverflow.com/a/27925672/1684079
var GLMJSError = (
   function createErrorType(name, init) {
      function E(message) {
         this.name = name;
         if (!Error.captureStackTrace)
            this.stack = (new Error()).stack;
         else
            Error.captureStackTrace(this, this.constructor);
         this.message = message;
         init && init.apply(this, arguments);
      }
      E.prototype = new Error();
      E.prototype.name = name;
      E.prototype.constructor = E;
      return E;
   })('GLMJSError');

$GLM_extern = function(func, local) {
   //try { console.debug("extern "+func, local||""); } catch(e){}
   local = local || func;
   return function() { 
      GLM[local] = GLM.$outer.functions[func] || GLM.$outer[func]; 
      if (!GLM[local]) throw new GLMJSError('$GLM_extern: unresolved external symbol: '+func);
      GLM.$DEBUG && GLM.$outer.console.debug('$GLM_extern: resolved external symbol '+func+' '+typeof GLM[local]);
      return GLM[local].apply(this, arguments);
   };
};

// allow glm.$log to be injected easier for testing
if ('undefined' === typeof $GLM_log)
   $GLM_log = function(x,y) {
      GLM.$outer.console.log.apply(
         GLM.$outer.console,
         [].slice.call(arguments).map(function(x){return GLM.to_string(x); })
      );
   };

// ditto for consolidated console writes
if ('undefined' === typeof $GLM_console_log) {
   $GLM_console_log = function(prefix, args) {
      (console[prefix]||function(){}).apply(
         console,
         [].slice.call(arguments,1)
      );
   };
}
if ('undefined' === typeof $GLM_console_logger) {
   $GLM_console_logger = function(prefix) { return $GLM_console_log.bind($GLM_console_log, prefix); };
}

GLM = {
   $DEBUG: false,
   version: "0.0.2",
   GLM_VERSION: 95,

   $outer: {
      functions: {},
//       utilities: {},
//       operations: {},
//       calculators: {},
      intern: function(k,v) {
         //console.warn("$GLM_intern", k,v);
         if (v === undefined && typeof k === 'object') {
            for(var p in k) GLM.$outer.intern(p, k[p]);
            return;
         }
         GLM.$DEBUG && GLM.$outer.console.debug("intern "+k, v && (v.name || typeof v));
         return GLM.$outer[k] = v;
      },
      $import: function(DLL) {
         GLM.$outer.intern(DLL.statics);
         GLM.$template.extend(GLM,
            GLM.$template.functions(DLL.functions),
            GLM.$template.operations(DLL.operations),
            GLM.$template.calculators(DLL.calculators)
         );
         GLM.$init(DLL);
      },
      console: (function(mklogger) {
                   var ret = {};
                   "debug,warn,info,error,log,write"
                   .replace(/\w+/g,
                            function(prop) {
                               ret[prop] = mklogger(prop);
                            });
                   return ret;
                })($GLM_console_logger),
      quat_array_from_xyz: function(o) {
         var q = glm.quat();
         q['*='](glm.angleAxis(o.x, glm.vec3(1,0,0)));
         q['*='](glm.angleAxis(o.y, glm.vec3(0,1,0)));
         q['*='](glm.angleAxis(o.z, glm.vec3(0,0,1)));
         return q.elements;
      },
      quat_array_from_zyx: function(o) {
         //TODO: optimizations?
         var q = glm.quat();
         q['*='](glm.angleAxis(o.z, glm.vec3(0,0,1)));
         q['*='](glm.angleAxis(o.y, glm.vec3(0,1,0)));
         q['*='](glm.angleAxis(o.x, glm.vec3(1,0,0)));
         return q.elements;
      },
      _vec3_eulerAngles: function(q) {
         // adapted from three.js
         var te = this.mat4_array_from_quat(q);
		 var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
		 m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
		 m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];
         
		 var thiz = new glm.vec3();
         thiz.y = Math.asin( - glm._clamp( m31, - 1, 1 ) );

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
   $extern: $GLM_extern,

   $log: $GLM_log,

   GLMJSError: GLMJSError,

   _radians: function(n) { return n * Math.PI / 180; },
   _degrees: function(n) { return n * 180 / Math.PI; },

//    _degrees: $GLM_extern('degrees', '_degrees'),
//    radians: $GLM_extern("radians"),

   normalize: $GLM_extern('normalize'),
   inverse: $GLM_extern('inverse'),
   length: $GLM_extern('length'),
   length2: $GLM_extern('length2'),
   transpose: $GLM_extern('transpose'),
   mix: $GLM_extern("mix"),
   clamp: $GLM_extern('clamp'),

   rotate: function(mat, theta, axis) { 
      return mat.mul(GLM.$outer.mat4_angleAxis(theta, axis));
   },
   scale: function(mat, v) {
      return mat.mul(GLM.$outer.mat4_scale(v));
   },
   translate: function(mat, v) {
      return mat.mul(GLM.$outer.mat4_translation(v));
   },
   perspective: function(fov, aspect, near, far) {
      return GLM.$outer.mat4_perspective(fov, aspect, near, far);
   },
   eulerAngles: function(q) {
      return GLM.$outer.vec3_eulerAngles(q);
   },
   angleAxis: function(angle, axis) {
      return GLM.$outer.quat_angleAxis(angle, axis);
   },

   /*make_vec2: function(ptr) { return new GLM.vec2([].slice.call(ptr,0,2)); },
   make_vec3: function(ptr) { return new GLM.vec3([].slice.call(ptr,0,3)); },
   make_vec4: function(ptr) { return new GLM.vec4([].slice.call(ptr,0,4)); },
   make_quat: function(ptr) { return new GLM.quat([].slice.call(ptr,0,4)); },
   make_mat3: function(ptr) { return new GLM.mat3([].slice.call(ptr,0,9)); },*/
   make_mat4: function(ptr) { 
      return new GLM.mat4([].slice.call(ptr,0,16));
   },

   toMat4: function(q) { return new GLM.mat4(q); },

   FAITHFUL: true, // attempt to match GLM::to_string output ASCII-for-ASCII

   to_string: function(o, prec) {
      try {
         var type = o.$type || typeof o;
         if (!GLM[type])
            throw new GLMJSError('unsupported argtype to GLM.to_string: '+[o,type]);
         if (!GLM[type].$)
            throw new GLMJSError('missing .$... GLM.to_string: '+[o,type]);
         if (GLM.FAITHFUL)
            return GLM.$to_string(o, prec).replace(/[\t\n]/g,'');
         return GLM.$to_string(o, prec); // pretty-printed
      } catch(e) {
         GLM.$DEBUG && GLM.$outer.console.error('to_string error: ',type,o+'',e);
         return e+'';
      }
   },

   $isGLMConstructor: function(o) { return (o&&o.prototype&&~GLM.$types.indexOf(o.prototype.$type)) ? o.prototype.$type : false; },
   $getGLMType: function(o) { return ("$type" in o && ~GLM.$types.indexOf(o.$type)) ? GLM[o.$type] : false; },
   //$getGLMMeta: function(o) { return ("$type" in o && ~GLM.$types.indexOf(o.$type)) ? GLM[o.$type].$ : false; },
   $isGLMObject: function(o) { return ~GLM.$types.indexOf(o&&o.$type) ? o.$type : false; },
   $to_array: function(o) {
      return [].slice.call(o.elements);
   },
   $to_json: function(v,p,q) {
      if ("$type" in this) { q=p, p=v, v=this; }
      return JSON.stringify(GLM.$to_object(v),p,q);
   },
   $inspect: function(v) {
      if ("$type" in this) v = this;
      return GLM.$to_json(v,null,2);
   },

   $sizeof: function(o) { return o.BYTES_PER_ELEMENT; },

   _clamp: function (a,b,c) { return a<b?b:(a>c?c:a); },
   max: function(a,b) { return Math.max(a,b); },
   min: function(a,b) { return Math.min(a,b); },
   _sign: function(x) {
      return x > 0 ? 1 : x < 0 ? -1 : +x;
   },
   epsilon: function() { return 1e-6; },
   FIXEDPRECISION: 6,
   $toString: function(prefix, what, props, precision) {
      precision = precision === undefined ? GLM.FIXEDPRECISION : precision;
      if (!props || !props.map) throw new Error('unsupported argtype to $toString(..,..,props='+typeof props+')');
      try {
         var lp = "";
         props.map(function(p) { var w=what[lp=p]; if (!w.toFixed)throw new Error('!toFixed in w'); return w.toFixed(0); }); 
      } catch(e) {
         GLM.$DEBUG && GLM.$outer.console.error("$toString error", 
                                  prefix, typeof what, Object.prototype.toString.call(what), lp); 
         GLM.$DEBUG && glm.$log("$toString error", 
                  prefix, typeof what, Object.prototype.toString.call(what), lp);
        throw new GLMJSError(e);
      }
      return [prefix, "(",
              props.map(function(p) { return what[p].toFixed(precision); })
              .join(", "), ")" ].join("");
   }
};

GLM.sign = Math.sign || GLM._sign;

// ----------------------------------------------------------------------------

var GLM_template = GLM.$template = {
   _genArgError: function(F, dbg, TV, args) {
      if (~args.indexOf(undefined))
         args = args.slice(0,args.indexOf(undefined));
      var no_dollars = RegExp.prototype.test.bind(/^[^$_]/);
      return new GLMJSError(
         'unsupported argtype to '+dbg+''+F.$sig+': [typ='+TV+"] :: "+
            'got arg types: '+args.map(GLM_template.jstypes.get)+
            " // supported types: "+Object.keys(F).filter(no_dollars).join("||"));
   },
   jstypes: {
      get: function(x) { 
         return x === null ? "null" :
            x === undefined ? "undefined" :
            (x.$type || 
             GLM_template.jstypes[typeof x] || 
             GLM_template.jstypes[x+''] || 
             "<unknown "+[typeof x, x]+">" ); 
      },
      0: "float",
      "number": "float",
      "string": "string",
      "[object Float32Array]": "Float32Array"
   },
   "<T>": function(F, dbg) {
      var types = GLM_template.jstypes;
      F.$sig = "<T>";
      func.$template = F;
      function func(o) {
         if ("$type" in this) { o=this; }
         var T = [(o&&o.$type) || types[typeof o] || "null"];
         if (!F[T])
            throw GLM_template._genArgError(F, dbg, T, [o]);
         return F[T](o);
      };
      return func;
   },
   "<T,...>": function(F, dbg) {
      var types = GLM_template.jstypes;
      F.$sig = "<T,...>";
      func.$template = F;
      function func(o) {
         var args = [].slice.call(arguments);
         if ("$type" in this) { args.unshift(o=this); }
         var T = [(o&&o.$type) || types[typeof o] || "null"];
         if (!F[T])
            throw GLM_template._genArgError(F, dbg, T, args);
         return F[T].apply(F, args);
      };
      return func;
   },
   "<T,V,n>": function(F, dbg) {
      var types = GLM_template.jstypes;
      F.$sig = "<T,V,n>";
      func.$template = F;
      function func(o,p,v) {
         if ("$type" in this) { v=p, p=o, o=this; }
         var TV = [(o&&o.$type) || types[typeof p], 
                   (p&&p.$type) || types[typeof p] || types[p+''] || "<unknown "+p+">"];
         if (!F[TV])
            throw GLM_template._genArgError(F, dbg, TV, [o,p,v]);
         if (typeof v !== 'number') 
            throw new GLMJSError(dbg+F.$sig+': unsupported n type: '+[typeof v,v]);
         return F[TV](o,p,v);
      };
      return func;
   },
   "<T,V>": function(F, dbg) {
      var types = GLM_template.jstypes;
      F.$sig = '<T,V>';
      func.$template = F;
      function func(o,p,a,b,c) {
         if ("$type" in this) { c=b, b=a, a=p, p=o, o=this; }
         var TV = [(o&&o.$type) || types[typeof p], 
                   (p&&p.$type) || types[typeof p] || types[p+''] || (p instanceof Array && "array"+p.length+"") || "<unknown "+p+">"];
         if (!F[TV])
            throw GLM_template._genArgError(F, dbg, TV, [o,p,a,b,c]);
         return F[TV](o,p,a,b,c);
      };
      return func;
   },

   override: function(TV, p, TSP, ret) {
      GLM.$DEBUG && GLM.$outer.console.debug('glm.$template.override: ', TV, p, TSP.$op?'$op: ["'+TSP.$op+'"]':"");
      if (!ret) throw new Error('unspecified target group '+ret+' (expected override(<TV>, "p", {TSP}, ret={GROUP}))');
      var merge = ret[p] && ret[p];
      ret[p] = GLM_template[TV](GLM_template.deNify(TSP, p), p);
      ret[p].$op = TSP.$op;
      if (merge) {
         if (merge.$op !== ret[p].$op) {
            throw new Error('glm.$template.override: mismatch merging existing override: .$op "'+
                            [merge.$op,'!=',ret[p].$op].join(" ")+'" '+
                            ' p='+[p,merge.$op,ret[p].$op,
                                   "||"+Object.keys(merge.$template).join("||")]);
         }
         var oldsigs = [];
         for(var P in ret[p].$template) {
            if (!(P in merge.$template)) {
               GLM.$DEBUG && GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+P+" overlayed");
            }
         }
         
         for(var P in merge.$template) {
            if (!(P in ret[p].$template)) {
               GLM.$DEBUG && GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+P+" carried-forward");
               oldsigs.push(P);
               ret[p].$template[P] = merge.$template[P];
            } 
         }
         GLM.$DEBUG && GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+
                                  (Object.keys(ret[p].$template)
                                   .filter(function(x){return !~x.indexOf('$')})
                                   .map(function(x){ return !~oldsigs.indexOf(x) ? "*"+x+"*" : x; })
                                   .join(" | ")));
      } else {
         GLM.$DEBUG && GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+
                                  (Object.keys(ret[p].$template)
                                   .filter(function(x){return !~x.indexOf('$')})
                                   .map(function(x){ return "*"+x+"*"; })
                                   .join(" | ")));
      }

//       if (TSP.$op)
//          ret[TSP.$op] = ret[p];
      return ret;
   },

   _override: function(TV, TS, ret) {
      for(var p in TS) {
         //console.warn("_override", p);
         this.override(TV, p, TS[p], ret);
      }
      return ret;
   },

   extend: function(dest, sources) {
      [].slice.call(arguments,1)
         .forEach(function(source) {
                     for(var p in source) 
                        if (source.hasOwnProperty(p))
                        dest[p] = source[p];
                  });
      return dest;
   },
   operations: function(TS) { 
      //console.warn("operations", TS);
      return this._override("<T,V>",TS,GLM.$outer.functions); 
   },

   calculators: function(TS) { 
      //console.warn("FUNCTION_SOURCES", TS);
      return this._override("<T>",TS,GLM.$outer.functions);
   },
   varargs_functions: function(TS) { 
      //console.warn("FUNCTION_SOURCES", TS);
      return this._override("<T,...>",TS,GLM.$outer.functions);
   },
   functions: function(TS) { 
      //console.warn("FUNCTION_SOURCES", TS);
      return this._override("<T,V,n>",TS,GLM.$outer.functions);
   },

   deNify: function(TSP, hint) {
      hint = (hint || "").replace(/[^$a-zA-Z0-9_]/g,'_');
//       function renameFunction(name, fn) {
//          return (new Function("return function (call) { return function " + name +
//                               " () { return call(this, arguments) }; };")())(Function.apply.bind(fn));
//       }
//          renameFunction(
//             ((hint?hint+"::":"")+TN+"::"+kn).replace(/[^a-z0-9_]/g,'_'),
      var rng = { vec: [2,3,4], mat: [3,4] };
      for(var TN in TSP) {
         TN.replace(/(vec|mat)<N>/, 
            function(_, vorm) {
               var tpl = TSP[TN];
               delete TSP[TN];
               rng[vorm].forEach(
                  function(N){
                     var kn = TN.replace(/<N[*]N>/g,N*N).replace(/<N>/g,N);
                     if (!( kn in TSP )) {
                        var fname = (hint+"_"+kn).replace(/[^$a-z0-9_]/g,'_');
                        //GLM.$outer.console.warn("implicit "+kn);
                        TSP[kn] = new Function("", "return "+(tpl+'')
                                               .replace(/^function\s*\(/,'function '+fname+'(')
                                               .replace(/N[*]N/g,N*N).replace(/N/g,N))();
                        //console.error('TN:',TN,kn,TSP[kn]);
                     }
                  }
               );
            });
      }
      //GLM.$outer.console.warn(TN);
      return TSP;
   },
   GLMType: function ($type, $) {
      var $len = $.identity.length;
      var $class = function(n) { 
         var sig = typeof n + arguments.length;
         var builder = $[sig];
         if (!builder) 
            throw new GLMJSError('no template found for '+$type+'.$.'+sig);
         //GLM.$outer.console.warn(sig, $type, n, $type, this.$type, this.constructor);
         if (this instanceof $class) {
            if (n instanceof Float32Array) {
               // note: new $class(<Float32Array>) adopts the passed buffer (ie: will proxy changes into it)
               if (n.length > $len) {
                  glm.$outer.console.error($type+' elements size mismatch: '+ ['wanted:'+$len, 'handed:'+n.length]);
                  var nn = n.subarray(0,$len);
                  throw new Error($type+' elements size mismatch: '+ ['wanted:'+$len, 'handed:'+n.length, , 'correctable?:'+nn.length]);
               }
               elements = n;
            } else {
               (elements = new Float32Array( $len ))
                  .set(builder.apply($, arguments));
            }
            Object.defineProperty(this, 'elements', { enumerable: false, configurable: true, value: elements });
         } else {
            return new $class(builder.apply($, arguments));
         }
      };
      // resolve shorthand $.components=['xyz',...] etc. defs
      $.components = $.components ?
         $.components.map(function(v) { return 'string' === typeof(v) ? v.split("") : v; })
         : [];
      
      $class.$ = $;
      $class.componentLength = $len;
      $class.BYTES_PER_ELEMENT = $len * Float32Array.BYTES_PER_ELEMENT,
      $class.toString = function() { return "function GLM."+$type+"(){ [ GLMType ] }"; };

      $class.prototype = {
         $type: $type,
         $type_name: $.name || '<'+$type+'>',
         $components: $.components[0],
         $len: $len,
         constructor: $class,
         clone: function() { return new $class(this); },
         toString: function() {
            return GLM.$to_string(this);
         },
         byteLength: $class.BYTES_PER_ELEMENT,
         componentLength: $class.componentLength
      };
      Object.defineProperty($class.prototype, 'address', 
                            { get: function() {
                                 var r = this.elements.byteOffset.toString(16);
                                 return "0x00000000".substr(0,10-r.length)+r;
                              }});

      return $class;
   }
};

GLM.$template.functions(
   {
      mix: {
         "float,float": function(v,n,rt) {
            return n*rt+v*(1-rt);
         },
         "vec<N>,vec<N>": function(v,n,rt) {
            if (rt === undefined) throw new Error('glm.mix<vecN,vecN>(v,n,rt) requires 3 arguments');
            v = glm.$to_array(v);
            n = glm.$to_array(n);
            //console.warn("vecN,vecN", v,n,rt);
            var rtm1 = (1-rt);
            return new glm.vecN(
               v.map(function(x,_) { return n[_]*rt+x*rtm1; })
            );
         }
      },
      clamp: {
         "float,float": function(n,a,b) {
            return GLM._clamp(n,a,b);
         },
         "vec<N>,float": function(v,a,b) {
            return new GLM.vecN(GLM.$to_array(v).map(function(n){ return GLM._clamp(n,a,b); }));
         }
      }

   });

GLM.$template.extend(
   GLM, GLM.$template.calculators(
   {
      degrees: {
         "float": function(n) { return GLM._degrees(n); },
         "vec<N>": function(o) {
            return new GLM.vecN(GLM.$to_array(o).map(GLM._degrees));
         }
      },
      radians: {
         "float": function(n) { return GLM._radians(n); },
         "vec<N>": function(o) {
            return new GLM.vecN(GLM.$to_array(o).map(GLM._radians));
         }
      },

      $to_object: {
         "vec2": function(v) { return {x:v.x, y:v.y}; },
         "vec3": function(v) { return {x:v.x, y:v.y, z:v.z}; },
         "vec4": function(v) { return {x:v.x, y:v.y, z:v.z, w:v.w}; },
         "uvec4": function(v) { return {x:v.x, y:v.y, z:v.z, w:v.w}; },
         "quat": function(v) { return {w:v.w, x:v.x, y:v.y, z:v.z}; },
         "mat3": function(v) { return {0:this.vec3(v[0]),
                                       1:this.vec3(v[1]),
                                       2:this.vec3(v[2])}; },
         "mat4": function(v) { return {0:this.vec4(v[0]),
                                       1:this.vec4(v[1]),
                                       2:this.vec4(v[2]),
                                       3:this.vec4(v[3])}; }
      },

      $to_glsl: {
         "vec<N>": function(v) { 
            var arr = GLM.$to_array(v);
            while(arr.length && arr[arr.length-2] === arr[arr.length-1])
               arr.pop();
            //          if (arr.reduce(function(s,e){return s+e; },0) == v.x*v.componentLength)
            //             return v.$type+"("+v.x+")"; 
            
            return v.$type+"("+arr+")";
         },
         uvec4: function(v) { return this.vec4(v); },// will pick up uvec4 from $type
         quat: function(q) { if((q.x+q.y+q.z)===0) return "quat("+q.w+")"; return "quat("+GLM.$to_array(q)+")"; },//{ _: "glm.quat", w: q.w, x: q.x, y: q.y, z: q.z }; },
         mat3: function(M) { 
            var m=GLM.$to_array(M); var ss=m.reduce(function(s,e){return s+e; },0);
            if (ss === m[0]*3) return "mat3("+m[0]+")";
            return "mat3("+m+")";
         },
         mat4: function(M) { 
            var m=GLM.$to_array(M); var ss=m.reduce(function(s,e){return s+e; },0);
            if (ss === m[0]*4) return "mat4("+m[0]+")";
            return "mat4("+m+")";
         }
      },
      $from_glsl: {
         'string': function(v) {
            var ret;
            v.replace(/^(\w+)\(([-.0-9ef, ]+)\)$/,
                      function(_,what, dat) {
                         ret = glm[what].apply(glm, dat.split(',').map(parseFloat));
                      });
            return ret;
         }
      }
   })
);

GLM.$to_string = GLM.$template.varargs_functions(
   {
      $to_string: {
         "float": function(what,prec) { 
            return GLM.$toString("float", { value: what }, ['value'], prec);
         },
         string: function(what) { return what; },
         'vec<N>': function(what, prec) {
            return GLM.$toString(what.$type_name, what, what.$components, prec);
         },
         uvec4: function(what, prec) {
            return what.$type_name+"("+glm.$to_array(what)+")";
         },
         'mat<N>': function(what, prec) {
            var ret = [0,1,2,3].slice(0,N)
            .map(function(_) { return what[_]; }) // into columns
            .map(function(wi) { // each column's vecN
                    return GLM.$toString("\t", wi, wi.$components, prec);
                 });
            return what.$type_name + '(\n'+ ret.join(", \n") +"\n)";
         },
//          mat4: function(what, prec) {
//             var ret = [0,1,2,3]
//             .map(function(_) { return what[_]; }) // into columns
//             .map(function(wi) { // each column's vec4
//                     return GLM.$toString("\t", wi, ['x','y','z','w'], prec);
//                  });
//             return what.$type_name + '(\n'+ ret.join(", \n")+"\n)";
//          },
         quat: function(what, prec) {
            what = GLM.degrees(GLM.eulerAngles(what));
            return GLM.$toString("<quat>"+what.$type_name, what, ['x','y','z'], prec);
         }
      }
   }).$to_string;

GLM.$template.operations(
   {
      copy: {
         $op: '=',
         'vec<N>,vec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'vec<N>,array<N>': function(me,you) { me.elements.set(you); return me; },
         'quat,quat': function(me,you) { me.elements.set(you.elements); return me; },
         'mat<N>,mat<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'mat<N>,array<N>': function(me,you) {
            you = you.reduce(function(a,b) {
                                if (!a.concat) throw new GLMJSError("matN,arrayN -- [[.length===4] x 4] expected"); 
                                return a.concat(b);
                             });
            if (you === N) throw new GLMJSError("matN,arrayN -- [[N],[N],[N],[N]] expected");
            return me['='](you);
         },
         'mat<N>,array<N*N>': function(me,you) { me.elements.set(you); return me; },
         'mat4,array9': function(me,you) { me.elements.set(new glm.mat4(you).elements); return me; }
      },
      sub: {
         $op: '-',
         'vec<N>,vec<N>': function(me,you) { 
            return new glm.vecN(glm.$to_array(me).map(function(v,_) { return v - you[_]; }));
         }
      },
      add: { 
         $op: '+',
         'vec<N>,vec<N>': function(me,you) { 
            return new glm.vecN(glm.$to_array(me).map(function(v,_) { return v + you[_]; }));
         }
      }
   });
   
// ----------------------------------------------------------------------------
// typeof support for catch-all to_string()
GLM['string'] = {
   $type_name: "string", $: {  }
};
GLM['number'] = {
   $type_name: "float", $: {  }
};

// ----------------------------------------------------------------------------
GLM.vec2 = GLM_template.GLMType(
   'vec2',
   {
      name: 'fvec2',
      identity: [0,0],
      components: [ 'xy', '01' ],
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
               if ("y" in o && "x" in o) {
                  if (typeof o.x !== typeof o.y) throw new GLMJSError('unrecognized .x-ish object passed to GLM.vec2: '+o);
                  return [o.x, o.y];
               }
         }
         throw new GLMJSError('unrecognized object passed to GLM.vec2: '+o);
      }
   }); // GLM.vec2.$
// ----------------------------------------------------------------------------
GLM.vec3 = GLM_template.GLMType(
   'vec3',
   {
      name: 'fvec3',
      identity: [0,0,0],
      components: [ 'xyz', '012', 'rgb' ],
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
         if (o) {
            switch(o.length){
            case 4: // vec4 -> vec3 reduction
            case 3: return [o[0], o[1], o[2]];
            case 2: return [o[0], o[1], o[1]];
            default:
                  if ("z" in o /*&& "y" in o*/ && "x" in o) {
                     if (typeof o.x !== typeof o.y) 
                        throw new GLMJSError('unrecognized .x-ish object passed to GLM.vec3: '+o);
                     return [o.x, o.y, o.z];
                  }
            }
         }
         throw new GLMJSError('unrecognized object passed to GLM.vec3: '+o);
      },
      'object2': function(o,z) {
         if (o instanceof GLM.vec2)
            return [o.x, o.y, z];
         throw new GLMJSError('unrecognized object passed to GLM.vec3(o,z): '+[o,z]);
      }
   }); // GLM.vec3.$

// ----------------------------------------------------------------------------

GLM.vec4 = GLM_template.GLMType(
   'vec4',
   {
      name: 'fvec4',
      identity: [0,0,0,0],
      components: ['xyzw','0123','rgba'],
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
         if (o) {
            switch(o.length){
            case 4: return [o[0], o[1], o[2], o[3]];
            case 3: return [o[0], o[1], o[2], o[2]];
            case 2: return [o[0], o[1], o[1], o[1]];
            default:
                  if ("w" in o /*&& "z" in o && "y" in o*/ && "x" in o)  {
                     if (typeof o.x !== typeof o.w)
                        throw new GLMJSError('unrecognized .x-ish object passed to GLM.vec4: '+o);
                     return [o.x, o.y, o.z, o.w];
                  }
            }
         }
         throw new GLMJSError('unrecognized object passed to GLM.vec4: '+[o,o&&o.$type]);
      },
      'object2': function(o,w) {
         if (o instanceof GLM.vec3)
            return [o.x, o.y, o.z, w];
         throw new GLMJSError('unrecognized object passed to GLM.vec4(o,w): '+[o,w]);
      },
      'object3': function(o,z,w) {
         if (o instanceof GLM.vec2)
            return [o.x, o.y, z, w];
         throw new GLMJSError('unrecognized object passed to GLM.vec4(o,z,w): '+[o,z,w]);
      }
   }
); // GLM.vec4.$

// ----------------------------------------------------------------------------

GLM.uvec4 = GLM_template.GLMType(
   'uvec4',
   {
      name: 'uvec4',
      identity: [0,0,0,0],
      components: ['xyzw','0123','rgba'],
      _clamp: function(x) { return ~~glm._clamp(x,0,Infinity); },
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         x=this._clamp(x);
         return [x,x,x,x];
      },
      'number2': function(x,y) {
         x=this._clamp(x);
         y=this._clamp(y);
         return [x,y,y,y];
      },
      'number3': function(x,y,z) {
         x=this._clamp(x);
         y=this._clamp(y);
         z=this._clamp(z);
         return [x,y,z,z];
      },
      'number4': function(x,y,z,w) {
         return [x,y,z,w].map(this._clamp);
      },
      'object1': function(o) {
         if (o) {
            switch(o.length){
            case 4: return [o[0], o[1], o[2], o[3]].map(this._clamp);
            case 3: return [o[0], o[1], o[2], o[2]].map(this._clamp);
            case 2: return [o[0], o[1], o[1], o[1]].map(this._clamp);
            default:
                  if ("w" in o /*&& "z" in o && "y" in o*/ && "x" in o)
                  return [o.x, o.y, o.z, o.w].map(this._clamp);
            }
         }
         throw new GLMJSError('unrecognized object passed to GLM.uvec4: '+[o,o&&o.$type]);
      },
      'object2': function(o,w) {
         if (o instanceof GLM.vec3)
            return [o.x, o.y, o.z, w].map(this._clamp);
         throw new GLMJSError('unrecognized object passed to GLM.uvec4(o,w): '+[o,w]);
      }
   }
); // GLM.uvec4.$

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
      'number9': function() {
         return arguments;
      },
      'object1': function(o) {
         if (o) {
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
         }
         throw new GLMJSError('unrecognized object passed to GLM.mat3: '+o);
      },
      'object3': function(a,b,c) {
         return [a,b,c].map(glm.$to_array)
            .reduce(function(a,b) { return a.concat(b); });
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
      'number16': function() {
         return arguments;
      },
      'number1' : function(M) {
         if (M === 1) 
            return this.identity;
         return [M, 0, 0, 0,
                 0, M, 0, 0,
                 0, 0, M, 0,
                 0, 0, 0, M];
      },
      'object1' : function(M) {
         var m4;
         if (M) {
            if (M instanceof GLM.quat || M.$type === 'quat')
               return GLM.$outer.mat4_array_from_quat(M);
            m4 = M.elements || M;
            if (m4.length === 9) {
               // mat3 -> mat4
               return [
                  m4[0+0], m4[0+1], m4[0+2], 0,
                  m4[3+0], m4[3+1], m4[3+2], 0,
                  m4[6+0], m4[6+1], m4[6+2], 0,
                  0      , 0      , 0      , 1
               ];
            }
            if (m4.length === 16)
               return m4;
         }
         throw new GLMJSError('unrecognized object passed to GLM.mat4: '+[M,m4&&m4.length]);
      }
   }); // GLM.mat4.$


// ----------------------------------------------------------------------------

GLM.quat = GLM_template.GLMType(
   'quat',
   {
      identity: [0,0,0,1],
      components: ['xyzw','0123'],
      'undefined0': function() { return this.identity; },
      'number1': function(w) {
         if (w !== 1) 
            throw new Error('only quat(1) syntax supported for quat(number1 args)...');
         return this.identity;
      },
      'number4': function(w,x,y,z) {
         return [x,y,z,w];
      },
      'object1': function(o) {
         if (o) {
            if (o instanceof GLM.mat4)
               return GLM.$outer.quat_array_from_mat4(o);
            if (o.length === 4)
               return [o[0], o[1], o[2], o[3]];
            if (o instanceof GLM.quat)
               return [o.x, o.y, o.z, o.w];
            if (o instanceof GLM.vec3)
               return GLM.$outer.quat_array_from_zyx(o);

            if ("w" in o && "x" in o)
               return [o.x, o.y, o.z, o.w];
         }
         throw new GLMJSError('unrecognized object passed to GLM.quat.object1: '+[o,o&&o.$type, typeof o, o&&o.constructor]);
      }
   });


// ----------------------------------------------------------------------------
// indexers and swizzles
(function() {

    var rigswizzle = function(o, arr, visible) {
       // indexer templates
       var indexers = [0,1,2,3].map(
          function(_) {
             return { 
                enumerable: visible,
                get: function() { return this.elements[_]; },
                set: function(v) { this.elements[_] = v; }
             };
          });
       
       //console.warn("rigswizzle", o.prototype.$type_name, arr);
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
                 def(p, { 
                        enumerable: false, 
                        get: function() { return new GLM[vn](this.elements.subarray(0*n,(0+1)*n)); },
                        set: function(val) { return new GLM[vn](this.elements.subarray(0*n,(0+1)*n))['='](val); }
                     });
              })(arr.join(""), o.prototype.$type.replace(/[1-9]$/, arr.length), arr.length);
             /*(function(p,vn) {
                 def(p, { get: function() { return GLM[vn](this); } });
              })(arr.slice(0).reverse().join(""), 'vec'+arr.length);*/
          } while(arr[1] != arr.pop());
       };
    };

    rigswizzle(GLM.vec2, ['x','y'], true);

    rigswizzle(GLM.vec3, ['x','y','z'], true);
    rigswizzle(GLM.vec3, ['r','g','b']);

    rigswizzle(GLM.vec4, ['x','y','z','w'], true);
    rigswizzle(GLM.vec4, ['r','g','b','a']);

    rigswizzle(GLM.quat, ['x','y','z','w'], true);

    rigswizzle(GLM.uvec4, ['x','y','z','w'], true);
    rigswizzle(GLM.uvec4, ['0','1','2','3']);

    Object.defineProperty(GLM.quat.prototype, '_x', { get: function() { throw new Error('erroneous quat._x access'); } });

    // map numeric indexes for vec2, vec3, vec4
    [2,3,4].forEach(
       function(_) {
          var vecp = GLM['vec'+_];
          rigswizzle(vecp, vecp.$.identity.map(function(n,_) { return _; }));
       });
    
    // TODO: map numeric quat indexes to match with GLM's q[0] usage

    var szfloat = Float32Array.BYTES_PER_ELEMENT;
    GLM.$partition = function cols(mat_prototype, vec, nrows, cache_prefix) {
       if (nrows === undefined) throw new GLMJSError('nrows is undefined');
       // mat column accessors -- eg: mat[0] as a read/write vec
       var vec_length = vec.$.identity.length;

       // if unspecified then assume square 
       nrows = nrows || vec_length; 

       //GLM.$outer.console.info("GLM.$partition", [vec_length,nrows].join("x"));
       var CACHEDBG = function(x) { GLM.$DEBUG && GLM.$outer.console.debug('CACHEDBG: '+x); };
       //var elements = mat_prototype.elements;
       var bytesper = szfloat * vec_length;
       for(var i=0; i < nrows; i++) {
          (function(index) {
              var offset = index * bytesper;
              var cache_index = cache_prefix && cache_prefix + index;
              var _index = index * vec_length;
             Object.defineProperty(
                mat_prototype, index, 
                   { configurable: true,
                     enumerable: true,
                     set: function(o) {
                        if (o instanceof vec)
                           this.elements.set(o.elements, _index);
                        else if (o && o.length === vec_length) {
                           this.elements.set(o, _index);
                        } else
                        throw new GLMJSError("unsupported argtype to "+
                                             (mat_prototype&&mat_prototype.$type)+"["+index+'] setter: '+
                                             [typeof o,o]);
                     },
                     get: function() { 
                        if (cache_prefix) {
                           if (this[cache_index]) {
                              if (!index) { CACHEDBG("cache hit "+cache_index); }
                              Object.defineProperty(this, index, {configurable: true, enumerable: false, value:this[cache_index]});
                              return this[cache_index];
                           }
                           if (!index) { CACHEDBG("cache miss "+cache_index); }
                        }
                        var t;
                        // this.elements.subarray (which can be reentrant)
                        // didn't work as reliably as new Float32Array(.buffer,...)
                        var v = new vec(
                           t = new Float32Array(
                              this.elements.buffer, 
                              this.elements.byteOffset + offset,
                              vec_length
                           )
                        );
                        if(!(v.elements === t)) throw 5;
                        if (cache_prefix) {
                           // defineProperty to mask from enumeration
                           Object.defineProperty(
                              this, cache_index,
                              { 
                                 configurable: true,
                                 enumerable: false,
                                 value: v
                              });
                        }
                        return v;//this[cache_index];
                     } 
                   });
           })(i);
       }
    };//GLM.$partition
    GLM.$partition(GLM.mat4.prototype, GLM.vec4, 4, '_cache_');
    GLM.$partition(GLM.mat3.prototype, GLM.vec3, 3, '_cache_');
    
 })(); //indexers and swizzlers

GLM.$dumpTypes = function(out) {
   for(var p in GLM) 
      if (GLM[p].componentLength) {
         out("GLM."+p, JSON.stringify(
                { 
                   '#type': GLM[p].prototype.$type_name,
                   '#floats': GLM[p].componentLength,
                   '#bytes': GLM[p].BYTES_PER_ELEMENT
                }));
      }
};

GLM.$init = function(hints) {
   if (hints.prefix)
      GLMJS_PREFIX = hints.prefix;

   var DBG = hints.log || function() {};

   try { DBG("GLM-js: ENV: "+_ENV._VERSION); } catch(e) {}

   DBG("GLM-JS: initializing: "+JSON.stringify(hints,0,2));
   DBG(JSON.stringify({'functions':Object.keys(GLM.$outer.functions)}));

   GLM.$outer.vec3_eulerAngles = GLM.$outer.vec3_eulerAngles || GLM.$outer._vec3_eulerAngles;
   // augmented metadata
   GLM.$symbols = [];
   GLM.$types = [];
   for(var p in GLM) {
      if (typeof GLM[p] === 'function') {
         if (/^[a-z]/.test(p)) // for glm.using_namespace and other metaprog
            GLM.$symbols.push(p);
         
         if ("$type" in GLM[p].prototype)
            GLM.$types.push(p);
      }
   }

   GLM.$types.forEach(
      function(p) {
         var type = GLM[p].prototype.$type;
         for(var op in GLM.$outer.functions) {
            var theop = GLM.$outer.functions[op];
            if (theop.$op) { // mixin operator-likes
               GLM.$DEBUG && GLM.$outer.console.debug("mapping operator<"+type+"> "+op+" / "+theop.$op);
               GLM[p].prototype[op] = theop; // longform (eg: .mul)
               GLM[p].prototype[theop.$op] = theop; //shortform (eg: ['*'])
            }
         }
      });
   
   DBG("GLM-JS: "+GLM.version+" emulating "+
       "GLM_VERSION="+GLM.GLM_VERSION+" "+
       "vendor_name="+hints.vendor_name+" "+
       "vendor_version="+hints.vendor_version);
   glm.vendor = hints;
};

// yes, this is doing what you think
// (exporting GLM.$symbols to globals, invoking function, restoring old globals)
// (... currently only used for testing parity with C++ GLM...)
GLM.using_namespace = function(tpl) {
   GLM.$DEBUG && GLM.$outer.console.debug("GLM.using_namespace munges globals; it should probably not be used!");
   var restore = [];
   var names = GLM.$symbols;
   var before = names.filter(function(x) { return eval("1, 'undefined' !== typeof "+x); });
   names.map(function(x) { 
                var cme = "GLM.using_namespace."+x+"=undefined;"+
                   "delete GLM.using_namespace."+x+";";

                try {
                   GLM.using_namespace[x] = eval("1,"+x);
                   restore.push(new Function("", x+"=GLM.using_namespace."+x+";"+cme));
                } catch(e) {
                   restore.push(new Function("", x+"=undefined;delete "+x+";"+cme));
                }
                eval(x+"=GLM."+x);
             });
   var ret = tpl();
   restore.map(function(f){f()});
   var after = names.filter(function(x) { return eval("1, 'undefined' !== typeof "+x); });
//    if ((before.length+after.length) !== 0) {
//       throw new Error(JSON.stringify({before:before,after:after, usn: Object.keys(GLM.using_namespace)}));
//    }
   if (before.length !== after.length) {
      throw new Error(JSON.stringify({before:before,after:after, usn: Object.keys(GLM.using_namespace)}));
   }
   return ret;
//    new Function(names+'',"("+tpl+")();")
//       .apply(this, names.map(function(x){ return GLM[x]; }));
};

try { module.exports = GLM; } catch(e) {}
