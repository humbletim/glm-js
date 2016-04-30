// ----------------------------------------------------------------------------
// glm.common.js - common math wrangler bits
// for full functionality this requires linking with a "math vendor" back-end
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

try { glm.exists && alert("glm.common.js loaded over exist glm instance: "+glm); } catch(e) {}

glm = null;

GLMJS_PREFIX = 'glm-js: ';

GLM = {
   $DEBUG: 'undefined' !== typeof $GLM_DEBUG && $GLM_DEBUG,
   version: "0.0.5",
   GLM_VERSION: 96,

   $outer: {
      polyfills: GLM_polyfills(),
      functions: {},
      intern: function(k,v) {
         if (!k) return;
         //console.warn("$GLM_intern", k,v);
         if (v === undefined && typeof k === 'object') {
            for(var p in k) GLM.$outer.intern(p, k[p]);
            return;
         }
         GLM.$DEBUG && GLM.$outer.console.debug("intern "+k, v && (v.name || typeof v));
         return GLM.$outer[k] = v;
      },
      $import: function(DLL) {
         GLM.$outer.$import = function() { throw new Error('glm.$outer.$import already called...'); };
         GLM.$outer.intern(DLL.statics);
         GLM.$template.extend(GLM,
            GLM.$template['declare<T,V,number>'](DLL['declare<T,V,number>']),
            GLM.$template['declare<T,V,...>'](DLL['declare<T,V,...>']),
            GLM.$template['declare<T,...>'](DLL['declare<T,...>']),
            GLM.$template['declare<T>'](DLL['declare<T>'])
         );
         GLM.$init(DLL);
      },
      console: $GLM_reset_logging(),
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
      },

      // so that people can work-around faulty TypedArray implementations
      ArrayBuffer: ArrayBuffer,
      Float32Array: Float32Array, Float64Array: Float64Array,
      Uint8Array:Uint8Array, Uint16Array: Uint16Array, Uint32Array: Uint32Array,
      Int8Array: Int8Array, Int16Array: Int16Array, Int32Array: Int32Array,
      DataView: typeof DataView !== 'undefined' && DataView,
      $rebindTypedArrays: function(alternator) {
         var ret = Object.keys(GLM.$outer)
            .filter(RegExp.prototype.test.bind(/Array$|^ArrayBuffer$|^DataView$/))
            .map(
               function(p) {
                  var rep = alternator.call(this, p, GLM.$outer[p]);
                  if (rep !== GLM.$outer[p]) {
                     GLM.$outer.console.warn("$rebindTypedArrays("+p+")... replacing");
                     GLM.$outer[p] = rep;
                  }
                  return rep;
               });
         GLM.$subarray = GLM.patch_subarray();
         return ret;
      }
   },
   $extern: $GLM_extern,

   $log: $GLM_log,

   GLMJSError: $GLM_GLMJSError('GLMJSError'),

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
   angleAxis: $GLM_extern('angleAxis'),
   rotate: $GLM_extern('rotate'),
   scale: $GLM_extern('scale'),
   translate: $GLM_extern('translate'),
   lookAt: $GLM_extern('lookAt'),
   cross: $GLM_extern('cross'),
   dot: $GLM_extern('dot'),

   perspective: function(fov, aspect, near, far) {
      return GLM.$outer.mat4_perspective(fov, aspect, near, far);
   },

   eulerAngles: function(q) {
      return GLM.$outer.vec3_eulerAngles(q);
   },
   angle: function(x) {
      return Math.acos(x.w) * 2;
   },
   axis: function(x) {
      var tmp1 = 1 - x.w * x.w;
      if(tmp1 <= 0)
         return glm.vec3(0, 0, 1);
      var tmp2 = 1 / Math.sqrt(tmp1);
      return glm.vec3(x.x * tmp2, x.y * tmp2, x.z * tmp2);
   },

   $from_ptr: function(typ, ptr, byteOffset) {
      if (this !== GLM) throw new GLM.GLMJSError("... use glm.make_<type>() (not new glm.make<type>())");
      var components = new GLM.$outer.Float32Array(ptr.buffer || ptr,byteOffset||0,typ.componentLength);
      var elements = new GLM.$outer.Float32Array(components);// ensure it's a clone
      return new typ(elements);
   },
   make_vec2: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.vec2, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_vec3: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.vec3, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_vec4: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.vec4, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_quat: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.quat, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_mat3: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.mat3, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_mat4: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.mat4, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },

   diagonal4x4: function(v) {
      if (GLM.$typeof(v) !== 'vec4') throw new GLM.GLMJSError('unsupported argtype to GLM.diagonal4x4: '+['type:' + GLM.$typeof(v)]);
      v = v.elements;
      return new GLM.mat4(
         [v[0], 0, 0, 0,
          0, v[1], 0, 0,
          0, 0, v[2], 0,
          0, 0, 0, v[3]]
      );
   },

   diagonal3x3: function(v) {
      if (GLM.$typeof(v) !== 'vec3') throw new GLM.GLMJSError('unsupported argtype to GLM.diagonal3x3: '+['type:' + GLM.$typeof(v)]);
      v = v.elements;
      return new GLM.mat3(
         [v[0], 0, 0,
          0, v[1], 0,
          0, 0, v[2]]
      );
   },

   toMat4: function toMat4(q) {
      return new GLM.mat4(GLM.$outer.mat4_array_from_quat(q));
   },

   FAITHFUL: true, // attempt to match GLM::to_string output ASCII-for-ASCII

   to_string: function to_string(o, opts) {
      try {
         var type = o.$type || typeof o;
         if (!GLM[type])
            throw new GLM.GLMJSError('unsupported argtype to GLM.to_string: '+['type:'+type,o]);
         if (!GLM.FAITHFUL)
            return GLM.$to_string(o, opts); // prettier-printed w/indentation
         else
            return GLM.$to_string(o, opts).replace(/[\t\n]/g,''); // flat
      } catch(e) {
         GLM.$DEBUG && GLM.$outer.console.error('to_string error: ',type,o+'',e);
         return e+'';
      }
   },

   $sizeof: function(o) { return o.BYTES_PER_ELEMENT; },
   $types: [],
   $isGLMConstructor: function(o) { return !!(o&&o.prototype instanceof GLM.$GLMBaseType); },
   $getGLMType: function(o) { return o instanceof GLM.$GLMBaseType && o.constructor || 'string' === typeof o && GLM[o] ; },
   $isGLMObject: function(o) { return !!(o instanceof GLM.$GLMBaseType && o.$type); },
   $typeof: function(o) { return o instanceof GLM.$GLMBaseType ? o.$type : 'undefined'; },

   $to_array: function(o) {
      return [].slice.call(o.elements);
   },

   $to_json: function(v,p,q) {
      if (this instanceof GLM.$GLMBaseType) { q=p, p=v, v=this; }
      return JSON.stringify(GLM.$to_object(v),p,q);
   },

   $inspect: function(v) {
      if (this instanceof GLM.$GLMBaseType)
         v = this;
      return GLM.$to_json(v,null,2);
   },

   _clamp: function (a,b,c) { return a<b?b:(a>c?c:a); },
   _abs: function(a) { return Math.abs(a); },
   _equal: function(a,b) { return a === b; },
   _epsilonEqual: function(x,y,e) { return Math.abs(x - y) < e; },
   _fract: function(a) { return a - Math.floor(a) },

   // adapted from Squeak.js (see ../lib/squeak.js)
    _frexp: (function define_frexp() {
        // mini-DataView emulator (polyfills _frexp's specific need)
        function _DataView(ab) {
            this.buffer = ab;
            this.setFloat64 = function(offset, value) {
                if (offset !== 0) throw new Error('...this is a very limited DataView emulator');
                // effectively writes the bigEndian encoding of the float...
                new Uint8Array(this.buffer).set([].reverse.call(new Uint8Array(new Float64Array([value]).buffer)), offset);
            };
            this.getUint32 = function(offset) {
                if (offset !== 0) throw new Error('...this is a very limited DataView emulator');
                return new Uint32Array(new Uint8Array([].slice.call(new Uint8Array(this.buffer)).reverse()).buffer)[1];
            };
        };
        _frexp._DataView = _DataView; // expose for unit testing
        function _frexp(value, arrptr) {
            // frexp separates a float into its mantissa and exponent
            var DV = GLM.$outer.DataView || _frexp._DataView;

            if (value == 0.0) { // zero is special
                if (arrptr && Array.isArray(arrptr)) {
                    arrptr[0] = arrptr[1] = 0;
                    return 0;
                }
                return [0,0];
            }
            var data = new DV(new GLM.$outer.ArrayBuffer(8));
            data.setFloat64(0, value);      // for accessing IEEE-754 exponent bits
            var bits = (data.getUint32(0) >>> 20) & 0x7FF;
            if (bits === 0) { // we have a subnormal float (actual zero was handled above)
                // make it normal by multiplying a large number
                data.setFloat64(0, value * Math.pow(2, 64));
                // access its exponent bits, and subtract the large number's exponent
                bits = ((data.getUint32(0) >>> 20) & 0x7FF) - 64;
            }
            var exponent = bits - 1022;                 // apply bias
            var mantissa = GLM.ldexp(value, -exponent)

            // no C pointers available; not sure which strategy is best yet...
            if (arrptr && Array.isArray(arrptr)) {
                arrptr[0] = exponent; // glm-ish behavior
                arrptr[1] = mantissa; // extra return value
                return mantissa;
            }
            return [mantissa, exponent]; // both values at once
        }
        return _frexp;
    })(),
   _ldexp: function(mantissa, exponent) {
      // construct a float from mantissa and exponent
      return exponent > 1023 // avoid multiplying by infinity
         ? mantissa * Math.pow(2, 1023) * Math.pow(2, exponent - 1023)
         : exponent < -1074 // avoid multiplying by zero
         ? mantissa * Math.pow(2, -1074) * Math.pow(2, exponent + 1074)
         : mantissa * Math.pow(2, exponent);
   }, /// Squeak.js

   _max: Math.max,
   _min: Math.min,
   sqrt: Math.sqrt,
   __sign: function(x) {
      return x > 0 ? 1 : x < 0 ? -1 : +x;
   },

    $constants: {
        epsilon: 1e-6,
        euler: 0.577215664901532860606,
        e: Math.E,
        ln_ten: Math.LN10,
        ln_two: Math.LN2,
        //Math.LOG10E,
        //Math.LOG2E,
        pi: Math.PI,
        half_pi: Math.PI/2,
        quarter_pi: Math.PI/4,
        one_over_pi: 1/Math.PI,
        two_over_pi: 2/Math.PI,
        root_pi: Math.sqrt(Math.PI),
        root_two: Math.sqrt(2),
        root_three: Math.sqrt(3),
        two_over_root_pi: 2/Math.sqrt(Math.PI),
        one_over_root_two: Math.SQRT1_2,
        root_two: Math.SQRT2
    },

   FIXEDPRECISION: 6,
   $toFixedString: function(prefix, what, props, precision) {
      if (precision === undefined)
         precision = GLM.FIXEDPRECISION;
      if (!props || !props.map) throw new Error('unsupported argtype to $toFixedString(..,..,props='+typeof props+')');
      try {
         // pre-check .toFixed conversion would work
         var lp = "";
         props.map(function(p) { var w=what[lp=p]; if (!w.toFixed)throw new Error('!toFixed in w'+[w,prefix,JSON.stringify(what)]); return w.toFixed(0); });
      } catch(e) {
         GLM.$DEBUG && GLM.$outer.console.error(
            "$toFixedString error", prefix, typeof what, Object.prototype.toString.call(what), lp
         );
         GLM.$DEBUG && glm.$log(
            "$toFixedString error", prefix, typeof what, Object.prototype.toString.call(what), lp);
         throw new GLM.GLMJSError(e);
      }
      props = props.map(function(p) { return what[p].toFixed(precision); });
      return prefix + "(" + props.join(", ") + ")";
   }
};

GLM._sign = Math.sign || GLM.__sign;

for(var p in GLM.$constants) {
    (function(v,k) {
        GLM[k] = function() { return v; };
        GLM[k].valueOf = GLM[k];
    })(GLM.$constants[p], p);
}
// ----------------------------------------------------------------------------

GLM.$GLMBaseType = (
   function()  {
      function $GLMBaseType($class, $type) {
         var $ = $class.$ || {};
         this.$type = $type;
         this.$type_name = $.name || '<'+$type+'>';

         if ($.components)
            this.$components = $.components[0];
         this.$len =
            this.components = $class.componentLength;
         this.constructor = $class;
         this.byteLength = $class.BYTES_PER_ELEMENT;

         //this.repr = function() { return "function $GLMBaseType<"+$type+">(){ [ GLMType@"+(GLM.$template.$_module_stamp)+" ] }"; };

         //GLM.$outer.console.debug("CREATED $class: "+this.repr());

         GLM.$types.push($type);
      }
      $GLMBaseType.prototype = {
         clone: function() { return new this.constructor(new this.elements.constructor(this.elements)); },
         toString: function() {
            return GLM.$to_string(this);
         },
         inspect: function() {
            return GLM.$inspect(this);
         },
         toJSON: function() {
            return GLM.$to_object(this);
         }
      };
      Object.defineProperty(
         $GLMBaseType.prototype, 'address',
         {
            get: function() {
               var r = this.elements.byteOffset.toString(16);
               return "0x00000000".substr(0,10-r.length)+r;
           }
         });
      return $GLMBaseType;
   })();

// ----------------------------------------------------------------------------

// SpiderMonkey ~1.8.5's TypedArray.subarray was broken; this is a workaround
/*
  var f = new Float32Array([0,1,2]);
  if(f.subarray(1).subarray(0) !== f[1]) throw "broken subarrays!"
*/

(function() {
    function native_subarray(o, a, b) {
       return o.subarray(a, b || o.length);
    }

    function workaround_broken_spidermonkey_subarray(o, a, b) {
       // re-calculate subarray offsets directly
       b = b || o.length;
       return new GLM.$outer.Float32Array(
          o.buffer, o.byteOffset +
             a * GLM.$outer.Float32Array.BYTES_PER_ELEMENT,
          (b-a));
    }

    //var ab = new ArrayBuffer(16*4);
    //var fb = new Float32Array(ab);
    //if (fb.length === ab.byteLength)
    //   GLM.$outer.console.error("BROKEN TypedArrays detected");
       
    Object.defineProperty(
       GLM, 'patch_subarray',
       {
          configurable: true,
          value: function patch_subarray() {
             var f = new GLM.$outer.Float32Array([0,0]);
             f.subarray(1).subarray(0)[0] = 1;
             var busted = 
                f[1] !== 1 || // SpiderMonkey
                4 !== new GLM.$outer.Float32Array(16).subarray(12,16).length; // QtScript

             var patch_subarray = busted ?
                workaround_broken_spidermonkey_subarray :
                native_subarray;
             patch_subarray.workaround_broken_spidermonkey_subarray = workaround_broken_spidermonkey_subarray;
             patch_subarray.native_subarray = native_subarray;
             return patch_subarray;
          }
       });
 })();
GLM.$subarray = GLM.patch_subarray();

// ----------------------------------------------------------------------------

var GLM_template = GLM.$template = {
   _genArgError: function(F, dbg, TV, args) {
      if (~args.indexOf(undefined)) {
         args = args.slice(0,args.indexOf(undefined));
      }
      var no_dollars = RegExp.prototype.test.bind(/^[^$_]/);
      return new GLM.GLMJSError(
         'unsupported argtype to '+dbg+' '+F.$sig+': [typ='+TV+"] :: "+
            'got arg types: '+args.map(GLM.$template.jstypes.get)+
            " // supported types: "+Object.keys(F).filter(no_dollars).join("||"));
   },
   jstypes: {
      get: function(x) {
         return x === null ? "null" :
            x === undefined ? "undefined" :
            (x.$type ||
             GLM.$template.jstypes[typeof x] ||
             GLM.$template.jstypes[x+''] ||
             (function auxiliary(x) {
                 if ('object' === typeof x) { // older versions of node
                    if (x instanceof GLM.$outer.Float32Array) return "Float32Array";
                    if (x instanceof GLM.$outer.ArrayBuffer) return "ArrayBuffer";
                    if (Array.isArray(x)) return 'array';
                 }
                 return "<unknown "+[typeof x, x]+">";
              })(x));
      },
      0: "float",
      "boolean": "bool",
      "number": "float",
      "string": "string",
      "[object Float32Array]": "Float32Array",
      "[object ArrayBuffer]": "ArrayBuffer",
      "function":"function"
   },
   _add_overrides: function(type, kvfuncs) {
      for(var p in kvfuncs)
         if(kvfuncs[p]) GLM[p].override(type, kvfuncs[p]);
   },
   _add_inline_override: function(dbg, type, func) {
      this[type] = /*TRACING*/ /*EVAL*/eval(GLM.$template._traceable("glm_"+dbg+"_"+type, func))();
      return this;
   },
   _inline_helpers: function(F,dbg) {
      return {
         $type: "built-in",
         $type_name: dbg,
         $template: F,
         F: F,
         dbg: dbg,
         override: this._add_inline_override.bind(F,dbg),
         link: function(sig) {
            var func = F[sig];
            if (!func)
               func = F[[sig,undefined+'']];
            if (!func)
               throw new GLM.GLMJSError("error linking direct function for "+dbg+"<"+sig+"> or "+dbg+"<"+[sig,undefined]+">");
            if (/\bthis\./.test(func+'')) return func.bind(F);
            return func;
         }
      };
   },
   "template<T>": function(F, dbg) {
      F.$sig = "template<T>";
      var types = GLM.$template.jstypes;
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         /*EVAL*/eval(this._traceable("Tglm_"+dbg,
         function(o) {
            //var F = arguments.callee.F;
            if (this instanceof GLM.$GLMBaseType) { o=this; }
            var T = [(o&&o.$type) || types[typeof o] || types.get(o) || "null"];
            if (!F[T])
               throw GLM.$template._genArgError(F, arguments.callee.dbg, T, [o]);
            return F[T](o);
         }))());
   },
   "template<T,...>": function(F, dbg) {
      F.$sig = "template<T,...>";
      var types = GLM.$template.jstypes;
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         /*EVAL*/eval(this._traceable("Tdotglm_"+dbg,
         function(o) {
            //var F = arguments.callee.F;
            //var types = GLM.$template.jstypes;
            var args = __VA_ARGS__;
            if (this instanceof GLM.$GLMBaseType) { args.unshift(o=this); }
            var T = [(o&&o.$type) || types[typeof o] || types.get(o) || "null"];
            if (!F[T])
               throw GLM.$template._genArgError(F, arguments.callee.dbg, T, args);
            return F[T].apply(F, args);
         }))());
   },
   "template<T,V,number>": function(F, dbg) {
      F.$sig = "template<T,V,number>";
      var types = GLM.$template.jstypes;
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         /*EVAL*/eval(this._traceable("TVnglm_"+dbg,
         function () {
            var args = __VA_ARGS__;
            if (this instanceof GLM.$GLMBaseType) { args.unshift(this); }
            var o=args[0], p=args[1], v=args[2];
            //if (this instanceof GLM.$GLMBaseType) { v=p, p=o, o=this; }
            var TV = [(o&&o.$type) || types[typeof o] || types[o+''] || "<unknown "+o+">",
                      (p&&p.$type) || types[typeof p] || types[p+''] || "<unknown "+p+">"];
            if (!F[TV])
               throw GLM.$template._genArgError(F, arguments.callee.dbg, TV, [o,p,v]);
            if (typeof v !== 'number')
               throw new GLM.GLMJSError(arguments.callee.dbg+F.$sig+': unsupported n type: '+[typeof v,v]);
            return F[TV](o,p,v);
         }))());
   },
   "template<T,V,...>": function(F, dbg) {
      F.$sig = 'template<T,V,...>';
      var types = GLM.$template.jstypes;
      var $GLMBaseType = GLM.$GLMBaseType;
      var _genArgError = GLM.$template._genArgError;

      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         /*EVAL*/eval(this._traceable("TVglm_"+dbg,
         function(/*o,p,a,b,c*/) {
            var args = __VA_ARGS__;
            if (this instanceof $GLMBaseType) { args.unshift(this); }
            //            if (this instanceof GLM.$GLMBaseType) { c=b, b=a, a=p, p=o, o=this; }
            var o=args[0], p=args[1];
            var TV = [(o&&o.$type) || types[typeof o],
                      (p&&p.$type) || types[typeof p] || types[p+''] || (Array.isArray(p) && "array"+p.length+"") || ""+p+""];
            if (!F[TV]) { //alert(this.constructor+'');
               throw _genArgError(F, arguments.callee.dbg, TV, args); }
            return F[TV].apply(F, args);
            //return F[TV](o,p,a,b,c);
         }))());
   },

   override: function(TV, p, TSP, ret, force) {
      GLM.$DEBUG && GLM.$outer.console.debug('glm.$template.override: ', TV, p, TSP.$op?'$op: ["'+TSP.$op+'"]':"");
      if (!ret) throw new Error('unspecified target group '+ret+' (expected override(<TV>, "p", {TSP}, ret={GROUP}))');
      var merge = ret[p];
      if (merge && merge.$op !== TSP.$op) {
         throw new Error('glm.$template.override: mismatch merging existing override: .$op "'+
                         [merge.$op,'!=',TSP.$op].join(" ")+'" '+
                         ' p='+[p,merge.$op,TSP.$op,
                                "||"+Object.keys(merge.$template).join("||")]);
      }
      var overlay = GLM.$template[TV](GLM.$template.deNify(TSP, p), p);

      if (merge && merge.F.$sig !== overlay.F.$sig) {
         throw new Error('glm.$template.override: mismatch merging existing override: .$sig "'+
                         [merge && merge.F.$sig,'!=',overlay.F.$sig].join(" ")+'" '+
                         ' p='+[p,merge && merge.F.$sig,overlay.F.$sig,
                                "||"+Object.keys(merge && merge.$template || {}).join("||")]);
      }
      overlay.$op = TSP.$op;
      if (!merge) {
         ret[p] = overlay;
         GLM.$DEBUG && log_override(ret[p], []);
      } else {
         for(var P in overlay.$template) {
            if (P === '$op' || P === '$sig') continue;
            var existing = P in merge.$template;
            if (!existing || force === true) {
               GLM.$DEBUG && GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+P+" merged");
               merge.$template[P] = overlay.$template[P];
            } else if (existing) {
               GLM.$DEBUG && GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+P+" skipped");
            }
         }

         if (GLM.$DEBUG) {
            var oldsigs = [];
            Object.keys(merge.$template).forEach(
               function(P) {
                  if (!(P in overlay.$template)) {
                     GLM.$DEBUG && GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+P+" carried-forward");
                     oldsigs.push(P);
                  }
               }
            );
            log_override(ret[p], oldsigs);
         }
      }

      function log_override(retp, oldsigs) {
         GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+
                                  (Object.keys(retp.$template)
                                   .filter(function(x){return !~x.indexOf('$')})
                                   .map(function(x){ return !~oldsigs.indexOf(x) ? "*"+x+"*" : x; })
                                   .join(" | ")));
      }
//       if (TSP.$op)
//          ret[TSP.$op] = ret[p];
      return ret;
   },

   _override: function(TV, TS, ret) {
      for(var p in TS) {
         //console.warn("_override", p);
         this.override(TV, p, TS[p], ret, true /*force / replace existing*/);
      }
      return ret;
   },
   slingshot: function() {
      return this.extend.apply(this, [].reverse.call(arguments));
   },
   extend: function(dest, sources) {
      [].slice.call(arguments,1)
         .forEach(function(source) {
                     if (!source) return;
                     for(var p in source)
                        if (source.hasOwnProperty(p))
                            dest[p] = source[p];
                  });
      return dest;
   },
   'declare<T,V,...>': function operations(TS) {
      //console.warn("operations", TS);
      if (!TS) return {};
      return this._override("template<T,V,...>",TS,GLM.$outer.functions);
   },
   'declare<T>': function calculators(TS) {
      //console.warn("FUNCTION_SOURCES", TS);
      if (!TS) return {};
      return this._override("template<T>",TS,GLM.$outer.functions);
   },
   'declare<T,...>': function varargs_functions(TS) {
      if (!TS) return {};
      //console.warn("FUNCTION_SOURCES", TS);
      return this._override("template<T,...>",TS,GLM.$outer.functions);
   },
   'declare<T,V,number>': function functions(TS) {
      if (!TS) return {};
      //console.warn("FUNCTION_SOURCES", TS);
      return this._override("template<T,V,number>",TS,GLM.$outer.functions);
   },
   _tojsname: function(hint) {
      return (hint || "_").replace(/[^$a-zA-Z0-9_]/g,'_');
   },
   _traceable: function(hint, _src) {
      var src = _src;
      if ('function' !== typeof src)
         throw new GLM.GLMJSError("_traceable expects tidy function as second arg "+src);
      if (!hint) throw new GLM.GLMJSError("_traceable expects hint or what's the point" + [src,hint]);
      hint = this._tojsname(hint||"_traceable");
      src = (src.toString()).replace(/^(\s*var\s*(\w+)\s*=\s*)__VA_ARGS__;/mg,
                             function(_,rep,varname) {
                                return rep+
                                   'new Array(arguments.length);for(var I=0;I<varname.length;I++)varname[I]=arguments[I];'.replace(/I/g,'__VA_ARGS__I').replace(/varname/g,varname);
                             })
         .replace(/\barguments[.]callee\b/g, hint);
       //if (/callee/.test(src))throw new Error(src);
      if (!/^function _traceable/.test(src)) { //src.split(/^\s*function\b/).length === 2) {
         // not already a factory; wrap it
         src = ('function _traceable(){ "use strict"; SRC; return HINT; }')
            .replace("HINT", hint.replace(/[$]/g,'$$$$'))
            .replace("SRC", src.replace(/[$]/g,'$$$$').replace(/^function\s*\(/,'function '+hint+'('));
      } else {
         throw new GLM.GLMJSError("already wrapped in a _traceable: "+[src,hint]);
      }
      src = "1,"+src;
      if (GLM.$DEBUG) {
         try {
            eval(src);
         } catch(e) {
            console.error('_traceable error', hint, src, _src,e);
            throw e;
         }
      }
      return src;
   },

   // this expands TSPs like { 'vec<N>': function(a) { return N; } }
   // ... into { vec2: function(a) { return 2; }, vec3: ..., vec4: ... }
   deNify: function(TSP, hint) {
      var rng = { vec: [2,3,4], mat: [3,4] };
      var _tojsname = this._tojsname.bind(this);
      for(var TN in TSP) {
         var bN = false;
         TN.replace(/([vV]ec|[mM]at)(?:\w*)<N>/,
            function(_, vorm) {
               bN = true;
               var tpl = TSP[TN];
               delete TSP[TN];
               rng[vorm.toLowerCase()].forEach(
                  function(N){
                     var kn = TN.replace(/<N[*]N>/g,N*N).replace(/<N>/g,N);
                     if (!( kn in TSP )) {
                        var fname = _tojsname("glm_"+hint+"_"+kn);
                        //GLM.$outer.console.warn("implicit "+kn);
                         TSP[kn] = /*EVAL*/eval(
                             "'use strict'; 1,"+(tpl+'')
                                 .replace(/^function\s*\(/,'function '+fname+'(')
                                 .replace(/N[*]N/g,N*N).replace(/N/g,N)
                         );
                        //console.error('TN:',TN,kn,TSP[kn]);
                     }
                  }
               );
            }.bind(this));
         if (/^[$]/.test(TN)) GLM.$DEBUG && GLM.$outer.console.debug("@ NOT naming "+TN);
         else if (!bN && 'function' === typeof TSP[TN] && !TSP[TN].name) {
            GLM.$DEBUG && GLM.$outer.console.debug("naming "+_tojsname(hint+"_"+TN));
            /*TRACING*/ TSP[TN] = /*EVAL*/eval(this._traceable("glm_"+hint+"_"+TN, TSP[TN]))();
         }
      }
      //GLM.$outer.console.warn(TN);
      return TSP;
   },
   $_module_stamp: +new Date(),

   // see also: http://stackoverflow.com/a/31194949
   _iso: '/[*][^/\*]*[*]/',
   _get_argnames: function $args(func) {
      return (func+'').replace(/\s+/g,'')  
         .replace(new RegExp(this._iso,'g'),'') // strip simple comments  
         .split('){',1)[0].replace(/^[^(]*[(]/,'') // extract the parameters  
         .replace(/=[^,]+/g,'') // strip any ES6 defaults  
         .split(',').filter(Boolean); // split & filter [""]  
   },

   GLMType: function ($type, $) {
      var $len = $.identity.length;

      if (1) {
         // make sure methods have a reasonable function name for profiling
         Object.keys($)
            .filter(function(p) { return 'function' === typeof $[p] && !$[p].name })
            .map(function(p) {
                    var hint = $type+"_"+p;
                    GLM.$DEBUG && GLM.$outer.console.debug("naming $."+p+" == "+hint, this._traceable(hint, $[p]));
                    /*TRACING*/ $[p] = /*EVAL*/eval(this._traceable("glm_"+hint,$[p]))();
                 }.bind(this));
      }

      var $class = /*TRACING*/ /*EVAL*/eval(this._traceable("glm_"+$type+"$class", function(n) {
         //var $class = arguments.callee;
         var $ = $class.$;
         var $type = $class.prototype.$type;
         var args = __VA_ARGS__;
         var sig = typeof n + args.length;
         var builder = $[sig];
         if (!builder) {
            var s = 'glm.'+$type;
            var provided = s + '('+args.map(function(_){return typeof _})+')';
            var hints = Object.keys($)
               .filter(
                  function(_) { 
                     return typeof $[_] === 'function' && /^\w+\d+$/.test(_); }
               )
               .map(function(_) {
                       return s+'('+GLM.$template._get_argnames($[_])+')';
                    });
            throw new GLM.GLMJSError(
               'no constructor found for: '+provided+'\n'+
                  'supported signatures:\n\t'+
                  hints.join('\n\t'));
         }             
         var elements;
         //GLM.$outer.console.warn(sig, $type, n, $type, this.$type, this.constructor);

         if (!(this instanceof $class)) {
            // if we're called as a regular function, redirect to "new $class()"
            // new $class(<Float32Array>) will use <Float32Array> by reference
            // $class(<Float32Array>) will use <Float32Array> by copy
             if (n instanceof GLM.$outer.Float32Array && n.length === $class.componentLength)
                 (elements = new GLM.$outer.Float32Array($class.componentLength)).set(n);
             else
                 elements = builder.apply($, args);
             return new $class(elements);
         } else {
            // called as "new $class()"
            if (n instanceof GLM.$outer.Float32Array) {
               // note: $class(<Float32Array>) is a special case in which we adopt the passed buffer
               //       (bypassing the builder / causing updates to the existing buffer instead)
               GLM.$DEBUG > 2 && GLM.$outer.console.info("adopting elements...", typeof n);
                if (n.length != $class.componentLength) {
                   GLM.$outer.console.error(
                      $type+' elements size mismatch: '+
                         ['wanted:'+$class.componentLength, 'handed:'+n.length]
                   );
                   var nn = GLM.$subarray(n,0,$class.componentLength);
                   throw new GLM.GLMJSError(
                      $type+' elements size mismatch: '+
                         ['wanted:'+$class.componentLength, 'handed:'+n.length,
                          'theoreticaly-correctable?:'+(nn.length ===  $class.componentLength)]
                );
                }
               elements = n;
            } else {
               (elements = new GLM.$outer.Float32Array( $class.componentLength ))
                  .set(builder.apply($, args));
            }
            Object.defineProperty(this, 'elements', { enumerable: false, configurable: true, value: elements });
         }
      }))();

      // resolve shorthand defs like $.components=['xyz',...] into [['x','y',z'], ...]
      $.components = $.components ?
         $.components.map(
            function(v) { return 'string' === typeof(v) ? v.split("") : v; }
         ) : [];

      $class.$ = $;
      $class.componentLength = $len;
      $class.BYTES_PER_ELEMENT = $len * GLM.$outer.Float32Array.BYTES_PER_ELEMENT,
      $class.prototype = new GLM.$GLMBaseType($class, $type);
      $class.toJSON = function() { var ob={ glm$type: $type, glm$class: $class.prototype.$type_name, glm$eg: new $class().object };for(var p in $class)if(!/function |^[$]/.test(p+$class[p]))ob[p]=$class[p]; return ob; return { glm$type_name: this.$type_name, glm$type: $type, BYTES_PER_ELEMENT: this.BYTES_PER_ELEMENT }; };

      return $class;
   }
};

GLM.$template['declare<T,V,...>'](
   {
      cross: {
         'vec2,vec2': function(a, b) {
            return glm.vec3(0,0,a.x * b.y - a.y * b.x);
         }
      }
   });
GLM.$template['declare<T,V,number>'](
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
      },
      epsilonEqual: {
         'float,float': GLM._epsilonEqual,
         'vec<N>,vec<N>': function(a,b,ep) {
            var eq = this['float,float'];
            var ret = glm.bvecN();
            for(var i=0; i < N; i++)
               ret[i] = eq(a[i],b[i],ep);
            return ret;
         },
         //'bvec<N>,bvec<N>': function(a,b,ep) { return this['vecN,vecN'](a,b,ep); },
         'ivec<N>,ivec<N>': function(a,b,ep) { return this['vecN,vecN'](a,b,ep); },
         'uvec<N>,uvec<N>': function(a,b,ep) { return this['vecN,vecN'](a,b,ep); },
         'quat,quat': function(a,b,ep) {
            var eq = this['float,float'];
            var ret = glm.bvec4();
            for(var i=0; i < 4; i++)
               ret[i] = eq(a[i],b[i],ep);
            return ret;
         },
         'mat<N>,mat<N>': function(a,b,ep) {
            throw new GLM.GLMJSError("error: 'epsilonEqual' only accept floating-point and integer scalar or vector inputs");
         }
      }

   });

GLM.$template.extend(
   GLM, GLM.$template['declare<T>'](
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
      sign: {
         "null":function() { return 0; },
         "undefined": function() { return NaN; },
         "string": function() { return NaN; },
         "float": function(n) { return GLM._sign(n); },
         "vec<N>": function(o) {
            return new GLM.vecN(GLM.$to_array(o).map(GLM._sign));
         },
         "ivec<N>": function(o) {
            return new GLM.ivecN(GLM.$to_array(o).map(GLM._sign));
         }
      },
      abs: {
         "float": function(n) { return GLM._abs(n); },
         "vec<N>": function(o) {
            return new GLM.vecN(GLM.$to_array(o).map(GLM._abs));
         }
      },
      fract: {
         "float": function(n) { return GLM._fract(n); },
         "vec<N>": function(o) {
            return new GLM.vecN(GLM.$to_array(o).map(GLM._fract));
         }
      },
      all: {
         "vec<N>": function(o) { return N === GLM.$to_array(o).filter(Boolean).length; },
         "bvec<N>": function(o) { return N === GLM.$to_array(o).filter(Boolean).length; },
         "ivec<N>": function(o) { return N === GLM.$to_array(o).filter(Boolean).length; },
         "uvec<N>": function(o) { return N === GLM.$to_array(o).filter(Boolean).length; },
         "quat": function(o) { return 4 === GLM.$to_array(o).filter(Boolean).length; }

      },

      $to_object: {
         "vec2": function(v) { return {x:v.x, y:v.y}; },
         "vec3": function(v) { return {x:v.x, y:v.y, z:v.z}; },
         "vec4": function(v) { return {x:v.x, y:v.y, z:v.z, w:v.w}; },
         "uvec2":function(v) { return {x:v.x, y:v.y}; },
         "uvec3":function(v) { return {x:v.x, y:v.y, z:v.z}; },
         "uvec4":function(v) { return {x:v.x, y:v.y, z:v.z, w:v.w}; },
         "ivec2":function(v) { return {x:v.x, y:v.y}; },
         "ivec3":function(v) { return {x:v.x, y:v.y, z:v.z}; },
         "ivec4":function(v) { return {x:v.x, y:v.y, z:v.z, w:v.w}; },
         "bvec2":function(v) { return {x:!!v.x, y:!!v.y}; },
         "bvec3":function(v) { return {x:!!v.x, y:!!v.y, z:!!v.z}; },
         "bvec4":function(v) { return {x:!!v.x, y:!!v.y, z:!!v.z, w:!!v.w}; },
         "quat": function(v) { return {w:v.w, x:v.x, y:v.y, z:v.z}; },
         "mat3": function(v) { return {0:this.vec3(v[0]),
                                       1:this.vec3(v[1]),
                                       2:this.vec3(v[2])}; },
         "mat4": function(v) { return {0:this.vec4(v[0]),
                                       1:this.vec4(v[1]),
                                       2:this.vec4(v[2]),
                                       3:this.vec4(v[3])}; }
      }
   }),
   GLM.$template['declare<T,...>'](
      {
         $from_glsl: {
            'string': function(v, returnType) {
               var ret;
               v.replace(/^([$\w]+)\(([-.0-9ef, ]+)\)$/,
                      function(_,what, dat) {
                         var type = glm[what] || glm['$'+what];
                         if (!type) throw new GLM.GLMJSError("glsl decoding issue: unknown type '"+what+"'");
                         ret = dat.split(',').map(parseFloat);
                         if (!returnType || returnType === type)
                            ret = type.apply(glm, ret);
                         else if (returnType === true || returnType === Array) {
                             while (ret.length < type.componentLength)
                                 ret.push(ret[ret.length-1]);
                             return ret;
                         } else throw new GLM.GLMJSError("glsl decoding issue: second argument expected to be undefined|true|Array");
                      });
               return ret;
            }
         },

         $to_glsl: {
            "vec<N>": function(v, opts) {
               var arr = GLM.$to_array(v);
               if (opts && typeof opts === 'object' && "precision" in opts)
                  arr = arr.map(function(_) { return _.toFixed(opts.precision); });
               // un-expand identical trailing values
               while(arr.length && arr[arr.length-2] === arr[arr.length-1])
                  arr.pop();
               return v.$type+"("+arr+")";
            },
            "uvec<N>": function(v, opts) { return this.vecN(v, opts); },// will pick up "uvecN" from $type
            "ivec<N>": function(v, opts) { return this.vecN(v, opts); },// will pick up "ivecN" from $type
            "bvec<N>": function(v, opts) { return this.vecN(v, opts); },// will pick up "bvecN" from $type
            quat: function(q, opts) { // note: quat()s aren't actually available in GLSL yet
               var precision;
               if (opts && typeof opts === 'object' && "precision" in opts) precision = opts.precision;
               if((q.x+q.y+q.z)===0)
                  return "quat("+(precision === undefined ? q.w : q.w.toFixed(precision))+")";
               return this.vec4(q, opts);
               //return "quat("+GLM.$to_array(q)+")";
            },
            'mat<N>': function(M, opts) {
               var precision;
               if (opts && typeof opts === 'object' && "precision" in opts) precision = opts.precision;
               // FIXME: this could fail on particular diagonals that sum to N
               var m=GLM.$to_array(M);
               if (precision !== undefined)
                  m = m.map(function(_) { return _.toFixed(precision); });
               var ss=m.reduce(function(s,e){return s+1*e; },0);
               if (ss === m[0]*N) return "matN("+m[0]+")";
               return "matN("+m+")";
            }
         },

         frexp: {
            "float": function(val,arrptr) {
               return arguments.length === 1 ?
                  this['float,undefined'](val) :
                  this['float,array'](val, arrptr);
            },
            "vec<N>": function(fvec, ivec) {
               if (arguments.length < 2)
                  throw new GLM.GLMJSError('frexp(vecN, ivecN) expected ivecN as second parameter');
               return GLM.vecN(
                  GLM.$to_array(fvec).map(
                     function(x,_) {
                        var mantissa_exp = GLM._frexp(x);
                        ivec[_] = mantissa_exp[1];
                        return mantissa_exp[0];
                     })
               );
            },
            // referenced here only (from float/vec<N>)
            "float,undefined": function(val) {
               return GLM._frexp(val);
            },
            "float,array": function(val,arr) {
               return GLM._frexp(val, arr);
            }
         },
         ldexp: {
            "float": GLM._ldexp,
            "vec<N>": function(fvec, ivec) {
               return GLM.vecN(
                  GLM.$to_array(fvec).map(
                     function(x,_) {
                        return GLM._ldexp(x,ivec[_]);
                     })
               );
            }
         }
      }
   )
);

GLM.$template['declare<T,V,...>'](
   {
      rotate: {
         'float,vec3': function(theta, axis) {
            return GLM.$outer.mat4_angleAxis(theta, axis);
         },
         'mat4,float': function(mat, theta, vec) {
            return mat.mul(GLM.$outer.mat4_angleAxis(theta, vec));
         }
      },
      scale: {
         'mat4,vec3': function(mat, v) {
            return mat.mul(GLM.$outer.mat4_scale(v));
         },
         'vec3,undefined': function(v) { return GLM.$outer.mat4_scale(v); }
      },
      translate: {
         'mat4,vec3': function(mat, v) {
            return mat.mul(GLM.$outer.mat4_translation(v));
         },
         'vec3,undefined': function(v) { return GLM.$outer.mat4_translation(v); }
      },
      angleAxis: {
         'float,vec3': function(angle, axis) {
            return GLM.$outer.quat_angleAxis(angle, axis);
         }
         // GLM 0.9.5 supported this signature, but 0.9.6 dropped it
         //'float,float':  function(angle,x,y,z) {
         //   return GLM.$outer.quat_angleAxis(angle, glm.vec3(x,y,z));
         //}
      },
      min: {
         "float,float": function(a,b) { return GLM._min(a,b); },
         "vec<N>,float": function(o,b) {
            return new GLM.vecN(GLM.$to_array(o).map(function(v){ return GLM._min(v,b); }));
         }
      },
      max: {
         "float,float": function(a,b) { return GLM._max(a,b); },
         "vec<N>,float": function(o,b) {
            return new GLM.vecN(GLM.$to_array(o).map(function(v){ return GLM._max(v,b); }));
         }
      },
      equal: {
         'float,float': GLM._equal,
         'vec<N>,vec<N>': function(a,b) {
            var eq = this['float,float'];
            var ret = glm.bvecN();
            for(var i=0; i < N; i++)
               ret[i] = eq(a[i],b[i]);
            return ret;
         },
         'bvec<N>,bvec<N>': function(a,b) { return this['vecN,vecN'](a,b); },
         'ivec<N>,ivec<N>': function(a,b) { return this['vecN,vecN'](a,b); },
         'uvec<N>,uvec<N>': function(a,b) { return this['vecN,vecN'](a,b); },
         'quat,quat': function(a,b) {
            var eq = this['float,float'];
            var ret = glm.bvec4();
            for(var i=0; i < 4; i++)
               ret[i] = eq(a[i],b[i]);
            return ret;
         }
      },

      // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtx/quaternion.inl
      rotation: {
         'vec3,vec3': function(orig, dest) {
            var cosTheta = glm.dot(orig, dest);
            var rotationAxis = glm.vec3();

            if(cosTheta >= 1 - glm.epsilon())
               return glm.quat();

            if(cosTheta < -1 + glm.epsilon())
               {
                  // special case when vectors in opposite directions :
                  // there is no "ideal" rotation axis
                  // So guess one; any will do as long as it's perpendicular to start
                  // This implementation favors a rotation around the Up axis (Y),
                  // since it's often what you want to do.
                  rotationAxis = glm.cross(glm.vec3(0, 0, 1), orig);
                  if(glm.length2(rotationAxis) < glm.epsilon()) // bad luck, they were parallel, try again!
                     rotationAxis = glm.cross(glm.vec3(1, 0, 0), orig);

                  rotationAxis = glm.normalize(rotationAxis);
                  return glm.angleAxis(glm.pi(), rotationAxis);
               }

            // Implementation from Stan Melax's Game Programming Gems 1 article
            rotationAxis = glm.cross(orig, dest);

            var s = glm.sqrt(((1) + cosTheta) * (2));
            var invs = (1) / s;

            return glm.quat(
               s * (0.5),
               rotationAxis.x * invs,
               rotationAxis.y * invs,
               rotationAxis.z * invs);
         }
      } /// glm/gtx/quaternion.inl

   });

// like glm.to_string; tho this also supports rounding to a precision
GLM.$to_string = GLM.$template['declare<T,...>'](
   {
      $to_string: {
         "function": function(func) {
            return "[function "+(func.name||"anonymous")+"]";
         },
         "ArrayBuffer": function(b) {
            return "[object ArrayBuffer "+JSON.stringify({byteLength: b.byteLength})+"]";
         },
         "Float32Array": function(b) {
            return "[object Float32Array "+JSON.stringify({length: b.length, byteOffset: b.byteOffset, byteLength: b.byteLength, BPE: b.BYTES_PER_ELEMENT})+"]";
         },
         "float": function(what, opts) {
            return GLM.$toFixedString("float", { value: what }, ['value'], opts && opts.precision);
         },
         string: function(what) { return what; },
         bool: function(what) { return 'bool('+what+')'; },
         'vec<N>': function(what, opts) {
            return GLM.$toFixedString(what.$type_name, what, what.$components, opts && opts.precision);
         },
         'uvec<N>': function(what, opts) {
            var prec = (opts && typeof opts === 'object' && opts.precision) || 0;
            return GLM.$toFixedString(what.$type_name, what, what.$components, prec);
            //return what.$type_name+"("+glm.$to_array(what)+")";
         },
         'ivec<N>': function(what, opts) {
            var prec = (opts && typeof opts === 'object' && opts.precision) || 0;
            return GLM.$toFixedString(what.$type_name, what, what.$components, prec);
         },
         'bvec<N>': function(what, opts) {
            return what.$type_name+'('+GLM.$to_array(what).map(Boolean).join(', ')+')';
         },
         'mat<N>': function(what, opts) {
            var ret = [0,1,2,3].slice(0,N)
            .map(function(_) { return what[_]; }) // into columns
            .map(function(wi) { // each column's vecN
                    return GLM.$toFixedString("\t", wi, wi.$components, opts && opts.precision);
                 });
            return what.$type_name + '(\n'+ ret.join(", \n") +"\n)";
         },
         quat: function(what, opts) {
            what = GLM.degrees(GLM.eulerAngles(what));
            return GLM.$toFixedString("<quat>"+what.$type_name, what, ['x','y','z'], opts && opts.precision);
         }
      }
   }).$to_string;

GLM.$template['declare<T,V,...>'](
   {
      copy: {
         $op: '=',
         'vec<N>,vec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'vec<N>,array<N>': function(me,you) { me.elements.set(you); return me; },
         'vec<N>,uvec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'vec<N>,ivec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'vec<N>,bvec<N>': function(me,you) { me.elements.set(you.elements); return me; },

         'uvec<N>,uvec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'uvec<N>,array<N>': function(me,you) { me.elements.set(you); return me; },
         'uvec<N>,vec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'uvec<N>,ivec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'uvec<N>,bvec<N>': function(me,you) { me.elements.set(you.elements); return me; },

         'ivec<N>,ivec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'ivec<N>,array<N>': function(me,you) { me.elements.set(you); return me; },
         'ivec<N>,vec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'ivec<N>,uvec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'ivec<N>,bvec<N>': function(me,you) { me.elements.set(you.elements); return me; },

         'bvec<N>,ivec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'bvec<N>,array<N>': function(me,you) { me.elements.set(you); return me; },
         'bvec<N>,vec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'bvec<N>,uvec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'bvec<N>,bvec<N>': function(me,you) { me.elements.set(you.elements); return me; },

         'quat,quat': function(me,you) { me.elements.set(you.elements); return me; },
         'mat<N>,mat<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'mat<N>,array<N>': function(me,you) {
            you = you.reduce(function(a,b) {
                                if (!a.concat) throw new GLM.GLMJSError("matN,arrayN -- [[.length===4] x 4] expected");
                                return a.concat(b);
                             });
            if (you === N) throw new GLM.GLMJSError("matN,arrayN -- [[N],[N],[N],[N]] expected");
            return me['='](you);
         },
         'mat<N>,array<N*N>': function(me,you) { me.elements.set(you); return me; },
         'mat4,array9': function(me,you) { me.elements.set(new GLM.mat4(you).elements); return me; }
      },
      sub: {
         $op: '-',
         _sub: function(me,you) {
            return (GLM.$to_array(me).map(function(v,_) { return v - you[_]; }));
         },
         'vec<N>,vec<N>': function(me,you) { return new GLM.vecN(this._sub(me,you)); },
         'vec<N>,uvec<N>': function(me,you) { return new GLM.vecN(this._sub(me,you)); },
         'uvec<N>,uvec<N>': function(me,you) { return new GLM.uvecN(this._sub(me,you)); },
         'uvec<N>,ivec<N>': function(me,you) { return new GLM.uvecN(this._sub(me,you)); },
         'vec<N>,ivec<N>': function(me,you) { return new GLM.vecN(this._sub(me,you)); },
         'ivec<N>,uvec<N>': function(me,you) { return new GLM.ivecN(this._sub(me,you)); },
         'ivec<N>,ivec<N>': function(me,you) { return new GLM.ivecN(this._sub(me,you)); }
      },
      sub_eq: {
         $op: '-=',
         'vec<N>,vec<N>': function(me,you) {
            GLM.$to_array(me).map(function(v,_) { return me.elements[_] = v - you[_]; });
            return me;
         },
         'vec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'uvec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'uvec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'vec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'ivec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'ivec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); }
      },
      add: {
         $op: '+',
         _add: function(me,you) {
            return (GLM.$to_array(me).map(function(v,_) { return v + you[_]; }));
         },
         'vec<N>,vec<N>': function(me,you) { return new GLM.vecN(this._add(me,you)); },
         'vec<N>,uvec<N>': function(me,you) { return new GLM.vecN(this._add(me,you)); },
         'uvec<N>,uvec<N>': function(me,you) { return new GLM.uvecN(this._add(me,you)); },
         'uvec<N>,ivec<N>': function(me,you) { return new GLM.uvecN(this._add(me,you)); },
         'vec<N>,ivec<N>': function(me,you) { return new GLM.vecN(this._add(me,you)); },
         'ivec<N>,ivec<N>': function(me,you) { return new GLM.ivecN(this._add(me,you)); },
         'ivec<N>,uvec<N>': function(me,you) { return new GLM.ivecN(this._add(me,you)); }
      },
      add_eq: {
         $op: '+=',
         'vec<N>,vec<N>': function(me,you) {
            GLM.$to_array(me).map(function(v,_) { return me.elements[_] = v + you[_]; });
            return me;
         },
         'vec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'uvec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'uvec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'vec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'ivec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'ivec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); }
      },
      div: {
         $op: '/',
         'vec<N>,float': function(me, k) {
            return new GLM.vecN(
               GLM.$to_array(me).map(function(v,_) { return v / k; })
            );
         }
      },
      div_eq: {
         $op: '/=',
         'vec<N>,float': function(me, k) {
            for(var i=0; i < N ; i++)
              me.elements[i] /= k;
            return me;
         }
      },
      eql_epsilon: (
         function(epsilonEqual) {
            return {
               $op: '~=',
               'vec<N>,vec<N>': epsilonEqual,
               'mat<N>,mat<N>': epsilonEqual,
               'quat,quat': epsilonEqual,
               'uvec<N>,uvec<N>': epsilonEqual,
               'ivec<N>,ivec<N>': epsilonEqual
            };
         }
      )(function epsilonEqualAB(a,b) { return GLM.all(GLM.epsilonEqual(a,b,GLM.epsilon())); }),
      eql: (
         function(equal) {
            return {
               $op: '==',
               'mat<N>,mat<N>': function(me,you) {
                  return you.elements.length === glm.$to_array(me)
                     .filter(function(v,_) { return v === you.elements[_]; }).length;
               },
               'vec<N>,vec<N>': equal,
               'quat,quat': equal,
               'uvec<N>,uvec<N>': equal,
               'ivec<N>,ivec<N>': equal,
               'bvec<N>,bvec<N>': equal
            };
         }
      )(function equalAB(a,b) { return GLM.all(GLM.equal(a,b)); })
   });

// ----------------------------------------------------------------------------
// typeof support for catch-all to_string()
GLM['string'] = {
   $type_name: "string", $: {  }
};
GLM['number'] = {
   $type_name: "float", $: {  }
};
GLM['boolean'] = {
   $type: 'bool', $type_name: "bool", $: {  }
};

// ----------------------------------------------------------------------------
GLM.vec2 = GLM.$template.GLMType(
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
         if (o!==null)
         switch(o.length){
         case 4: // vec4 -> vec2 reduction
         case 3: // vec3 -> vec2 reduction
         case 2: return [o[0], o[1]];
         default:
               if ("y" in o && "x" in o) {
                  if (typeof o.x !== typeof o.y)
                     throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.vec2: '+o);
                  if (typeof o.x === 'string') // coerce into numbers
                     return [o.x*1, o.y*1];
                  return [o.x, o.y];
               }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.vec2: '+o);
      }
   }); // GLM.vec2.$
// ----------------------------------------------------------------------------
GLM.uvec2 = GLM.$template.GLMType(
   'uvec2',
   {
      name: 'uvec2',
      identity: [0,0],
      components: [ 'xy', '01' ],
      _clamp: function(x) { return ~~x; }, // match observed GLM C++ behavior
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         x=this._clamp(x);
         return [x,x];
      },
      'number2': function(x,y) {
         x=this._clamp(x);
         y=this._clamp(y);
         return [x,y];
      },
      'object1': function(o) {
         switch(o.length){
         case 4: // vec4 -> vec2 reduction
         case 3: // vec3 -> vec2 reduction
         case 2: return [o[0], o[1]].map(this._clamp);
         default:
               if ("y" in o && "x" in o) {
                  if (typeof o.x !== typeof o.y) throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.'+this.name+': '+o);
                  return [o.x, o.y].map(this._clamp);
               }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+': '+o);
      }
   }); // GLM.uvec2.$

// ----------------------------------------------------------------------------
GLM.vec3 = GLM.$template.GLMType(
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
                        throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.vec3: '+o);
                     if (typeof o.x === 'string') // coerce into numbers
                        return [o.x*1, o.y*1, o.z*1];
                     return [o.x, o.y, o.z];
                  }
            }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.vec3: '+o);
      },
      'object2': function(o,z) {
         if (o instanceof GLM.vec2 || o instanceof GLM.uvec2 || o instanceof GLM.ivec2 || o instanceof GLM.bvec2)
            return [o.x, o.y, z];
         throw new GLM.GLMJSError('unrecognized object passed to GLM.vec3(o,z): '+[o,z]);
      }
   }); // GLM.vec3.$

// ----------------------------------------------------------------------------
GLM.uvec3 = GLM.$template.GLMType(
   'uvec3',
   {
      name: 'uvec3',
      identity: [0,0,0],
      components: [ 'xyz', '012' ],
      _clamp: GLM.uvec2.$._clamp,
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         x=this._clamp(x);
         return [x,x,x];
      },
      'number2': function(x,y) {
         x=this._clamp(x);
         y=this._clamp(y);
         return [x,y,y];
      },
      'number3': function(x,y,z) {
         x=this._clamp(x);
         y=this._clamp(y);
         z=this._clamp(z);
         return [x,y,z];
      },
      'object1': function(o) {
         if (o) {
            switch(o.length){
            case 4: // vec4 -> vec3 reduction
            case 3: return [o[0], o[1], o[2]].map(this._clamp);
            case 2: return [o[0], o[1], o[1]].map(this._clamp);
            default:
                  if ("z" in o /*&& "y" in o*/ && "x" in o) {
                     if (typeof o.x !== typeof o.y)
                        throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.'+this.name+': '+o);
                     return [o.x, o.y, o.z].map(this._clamp);
                  }
            }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+': '+o);
      },
      'object2': function(o,z) {
         if (o instanceof GLM.vec2)
            return [o.x, o.y, z].map(this._clamp);
         if (o instanceof GLM.uvec2 || o instanceof GLM.ivec2 || o instanceof GLM.bvec2)
            return [o.x, o.y, this._clamp(z)];

         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+'(o,z): '+[o,z]);
      }
   }); // GLM.uvec3.$

// ----------------------------------------------------------------------------

GLM.vec4 = GLM.$template.GLMType(
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
                        throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.vec4: '+o);
                     if (typeof o.x === 'string') // coerce into numbers
                        return [o.x*1, o.y*1, o.z*1, o.w*1];
                     return [o.x, o.y, o.z, o.w];
                  }
            }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.vec4: '+[o,o&&o.$type]);
      },
      'object2': function(o,w) {
         if (o instanceof GLM.vec3 || o instanceof GLM.uvec3 || o instanceof GLM.ivec3 || o instanceof GLM.bvec3)
            return [o.x, o.y, o.z, w];
         throw new GLM.GLMJSError('unrecognized object passed to GLM.vec4(o,w): '+[o,w]);
      },
      'object3': function(o,z,w) {
         if (o instanceof GLM.vec2 || o instanceof GLM.uvec2 || o instanceof GLM.ivec2 || o instanceof GLM.bvec2)
            return [o.x, o.y, z, w];
         throw new GLM.GLMJSError('unrecognized object passed to GLM.vec4(o,z,w): '+[o,z,w]);
      }
   }
); // GLM.vec4.$

// ----------------------------------------------------------------------------

GLM.uvec4 = GLM.$template.GLMType(
   'uvec4',
   {
      name: 'uvec4',
      identity: [0,0,0,0],
      components: [ 'xyzw', '0123' ],
      _clamp: GLM.uvec2.$._clamp,
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
                  if ("w" in o /*&& "z" in o && "y" in o*/ && "x" in o) {
                     if (typeof o.x !== typeof o.y)
                        throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.'+this.name+': '+o);
                     return [o.x, o.y, o.z, o.w].map(this._clamp);
                  }
            }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+': '+[o,o&&o.$type]);
      },
      'object2': function(o,w) {
         if (o instanceof GLM.vec3)
            return [o.x, o.y, o.z, w].map(this._clamp);
         if (o instanceof GLM.uvec3 || o instanceof GLM.ivec3 || o instanceof GLM.bvec3)
            return [o.x, o.y, o.z, this._clamp(w)];
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+'(o,w): '+[o,w]);
      },
      'object3': function(o,z,w) {
         if (o instanceof GLM.vec2)
            return [o.x, o.y, z, w].map(this._clamp);
         if (o instanceof GLM.uvec2 || o instanceof GLM.ivec2 || o instanceof GLM.bvec2)
            return [o.x, o.y, this._clamp(z), this._clamp(w)];
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+'(o,z,w): '+[o,z,w]);
      }
   }
); // GLM.uvec4.$

// ----------------------------------------------------------------------------
// observed GLM behavior is that ivec2 and uvec2 seem to behave identically
GLM.ivec2 = GLM.$template.GLMType(
   'ivec2', GLM.$template.extend({}, GLM.uvec2.$, { name: 'ivec2' })
);
GLM.ivec3 = GLM.$template.GLMType(
   'ivec3', GLM.$template.extend({}, GLM.uvec3.$, { name: 'ivec3' })
);
GLM.ivec4 = GLM.$template.GLMType(
   'ivec4', GLM.$template.extend({}, GLM.uvec4.$, { name: 'ivec4' })
);
// first-pass at bvec emulation
GLM.bvec2 = GLM.$template.GLMType(
   'bvec2', GLM.$template.extend(
      {}, GLM.uvec2.$, { name: 'bvec2',
                         'boolean1': GLM.uvec2.$.number1,
                         'boolean2': GLM.uvec2.$.number2
                       })
);
GLM.bvec3 = GLM.$template.GLMType(
   'bvec3', GLM.$template.extend(
      {}, GLM.uvec3.$, { name: 'bvec3',
                         'boolean1': GLM.uvec3.$.number1,
                         'boolean2': GLM.uvec3.$.number2,
                         'boolean3': GLM.uvec3.$.number3
                       })
);
GLM.bvec4 = GLM.$template.GLMType(
   'bvec4', GLM.$template.extend(
      {}, GLM.uvec4.$, { name: 'bvec4',
                         'boolean1': GLM.uvec4.$.number1,
                         'boolean2': GLM.uvec4.$.number2,
                         'boolean3': GLM.uvec4.$.number3,
                         'boolean4': GLM.uvec4.$.number4
                       })
);
GLM.bvec2.$._clamp = GLM.bvec3.$._clamp = GLM.bvec4.$._clamp =
    function _bclamp(x) { return !!x; };
// ----------------------------------------------------------------------------
GLM.mat3 = GLM.$template.GLMType(
   'mat3',
   {
      name: 'mat3x3',
      identity : [1, 0, 0,
                  0, 1, 0,
                  0, 0, 1],
      'undefined0' : function(M) { return this.identity; },
      'number1': function(n) {
         if (n === 1) {
            return this.identity;
         }
         return [n, 0, 0,
                 0, n, 0,
                 0, 0, n];
      },
      'number9': function(
         c1r1, c1r2, c1r3,
         c2r1, c2r2, c2r3,
         c3r1, c3r2, c3r3
      ) {
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
            // JSON-encoded objects may arrive this way: {"0":{"x": ...
            if (0 in m4 && 1 in m4 && 2 in m4  &&
                !(3 in m4) && typeof m4[2] === 'object' )
               return [
                  m4[0],m4[1],m4[2]
               ].map(GLM.vec3.$.object1)
                .reduce(function(a,b) { return a.concat(b); });
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.mat3: '+o);
      },
      'object3': function(c1,c2,c3) {
         return [c1,c2,c3].map(glm.$to_array)
            .reduce(function(a,b) { return a.concat(b); });
      }

   }); // GLM.mat3.$

// ----------------------------------------------------------------------------
GLM.mat4 = GLM.$template.GLMType(
   'mat4',
   {
      name: 'mat4x4',
      identity: [1, 0, 0, 0,
                 0, 1, 0, 0,
                 0, 0, 1, 0,
                 0, 0, 0, 1],
      'undefined0' : function() { return this.identity; },
      'number16': function(
         c1r1, c1r2, c1r3, c1r4,
         c2r1, c2r2, c2r3, c2r4,
         c3r1, c3r2, c3r3, c3r4,
         c4r1, c4r2, c4r3, c4r4
      ) {
         return arguments;
      },
      'number1' : function(n) {
         if (n === 1)
            return this.identity;
         return [n, 0, 0, 0,
                 0, n, 0, 0,
                 0, 0, n, 0,
                 0, 0, 0, n];
      },
      'object1' : function(o) {
         var m4;
         if (o) {
            m4 = o.elements || o;
            if (m4.length === 9) {
               // mat3 -> mat4
               return [
                  m4[0+0], m4[0+1], m4[0+2], 0,
                  m4[3+0], m4[3+1], m4[3+2], 0,
                  m4[6+0], m4[6+1], m4[6+2], 0,
                  0      , 0      , 0      , 1
               ];
            }
            if (m4.length === 4 && m4[0] && m4[0].length === 4) {
               return m4[0].concat(m4[1],m4[2],m4[3]);
            }
            if (m4.length === 16)
               return m4;

            // JSON-encoded objects may arrive this way: {"0":{"x": ...
            if (0 in m4 && 1 in m4 && 2 in m4 && 3 in m4 &&
                !(4 in m4) && typeof m4[3] === 'object' )
               return [
                  m4[0],m4[1],m4[2],m4[3]
               ].map(GLM.vec4.$.object1)
                .reduce(function(a,b) { return a.concat(b); });
      }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.mat4: '+[o,m4&&m4.length]);
      },
      'object4': function(c1,c2,c3,c4) {
         return [c1,c2,c3,c4].map(glm.$to_array)
            .reduce(function(a,b) { return a.concat(b); });
      }

   }); // GLM.mat4.$


// ----------------------------------------------------------------------------

GLM.quat = GLM.$template.GLMType(
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

            if ("w" in o && "x" in o) {
               if (typeof o.x === 'string') // coerce into numbers
                  return [o.x*1, o.y*1, o.z*1, o.w*1];
               return [o.x, o.y, o.z, o.w];
            }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.quat.object1: '+[o,o&&o.$type, typeof o, o&&o.constructor]);
      }
   });


// ----------------------------------------------------------------------------
// indexers and swizzles
(function() {

    var rigswizzle = function(o, arr, visible, noswizzles) {
       var default_properties = {
           def: function(k,v) {
             //console.warn("okv", o.prototype, k, v);
             this[k] = v;
             Object.defineProperty(o.prototype, k, v);
          }
       };
       o.$properties = o.$properties || default_properties;
       var def = o.$properties.def.bind(o.$properties);

       //console.warn("rigswizzle", o.prototype.$type_name, arr);

       // indexer templates
       var indexers = [0,1,2,3].map(
          function(_) {
             return {
                enumerable: visible,
                get: function getter() { return this.elements[_]; },
                set: function setter(v) { this.elements[_] = v; }
             };
          });

       // wire-up new o.x, o.y etc.
       arr.forEach(function(a,_) { def(a, indexers[_]); });

       // swizzle (non-numeric, non-_) prop sets
       if (isNaN(arr[0]) && !/^_/.test(arr[0])) {

          var _arr = arr.slice();//clone
          // like .xyzw, ,.xyz, .xy
          do {
             (function(p,vn,n) {
                 if (vn === 'quat') vn = 'vec'+n;
                 def(p, {
                        enumerable: false,
                        get: function getter() { return new GLM[vn](GLM.$subarray(this.elements,0*n,(0+1)*n)); },//this.elements.subarray(0*n,(0+1)*n)); },
                        set: function setter(val) { return new GLM[vn](GLM.$subarray(this.elements,0*n,(0+1)*n))['='](val); }
                     });
              })(_arr.join(""), o.prototype.$type.replace(/[1-9]$/, _arr.length), _arr.length);
          } while(_arr[1] != _arr.pop());

          if (noswizzles) return o.$properties;

          _arr = arr.slice();//clone

          // like .yz, .yzw, .zw
          // TODO: algorithmize
          var other = ({
                          'xyz': { yz: 1 },
                          'xyzw': { yzw: 1, yz: 1, zw: 2 }
                       })[_arr.join("")];
          if (other) {
             for(var p in other) {
                (function(p, vn, n, offset) {
                    def(p, {
                           enumerable: false,
                           get: function getter() { return new GLM[vn](GLM.$subarray(this.elements,0*n+offset,(0+1)*n+offset)); },
                           set: function setter(val) { return new GLM[vn](GLM.$subarray(this.elements,0*n+offset,(0+1)*n+offset))['='](val); }
                        });
                 })(p, o.prototype.$type.replace(/[1-9]$/, p.length), p.length, other[p]);
             }
          }
       };
       return o.$properties;
    };

    rigswizzle(GLM.vec2, GLM.vec2.$.components[0] /*xy*/, true);
    rigswizzle(GLM.vec2, GLM.vec2.$.components[1] /*01*/);

    rigswizzle(GLM.vec3, GLM.vec3.$.components[0] /*xyz*/, true);
    rigswizzle(GLM.vec3, GLM.vec3.$.components[1] /*012*/);
    rigswizzle(GLM.vec3, GLM.vec3.$.components[2] /*rgb*/);

    rigswizzle(GLM.vec4, GLM.vec4.$.components[0] /*xyzw*/, true);
    rigswizzle(GLM.vec4, GLM.vec4.$.components[1] /*0123*/);
    rigswizzle(GLM.vec4, GLM.vec4.$.components[2] /*rgba*/);

    // quat .wxyz
    rigswizzle(GLM.quat, GLM.quat.$.components[0] /*xyzw*/, true, "noswizzles");
    rigswizzle(GLM.quat, GLM.quat.$.components[1] /*0123*/);

    GLM.quat.$properties
       .def('wxyz', {
              enumerable: false,
              get: function() { return new GLM.vec4(this.w,this.x,this.y,this.z); },
              set: function(v) { v=GLM.vec4(v); return this['='](GLM.quat(v.x,v.y,v.z,v.w)); }
           });

    ['uvec2','uvec3','uvec4','ivec2','ivec3','ivec4','bvec2','bvec3','bvec4'].forEach(
       function(_vecN) {
          rigswizzle(GLM[_vecN], GLM[_vecN].$.components[0] /*xy[z][w]*/, true);
          rigswizzle(GLM[_vecN], GLM[_vecN].$.components[1] /*01[2][3]*/);
       });

    // rigswizzle(GLM.uvec2, GLM.uvec2.$.components[0] /*xy*/, true);
    // rigswizzle(GLM.uvec2, GLM.uvec2.$.components[1] /*01*/);
    // rigswizzle(GLM.uvec3, GLM.uvec3.$.components[0] /*xyz*/, true);
    // rigswizzle(GLM.uvec3, GLM.uvec3.$.components[1] /*012*/);
    // rigswizzle(GLM.uvec4, GLM.uvec4.$.components[0] /*xyzw*/, true);
    // rigswizzle(GLM.uvec4, GLM.uvec4.$.components[1] /*0123*/);

    // legacy THREE.js interop detection
    Object.defineProperty(GLM.quat.prototype, '_x', { get: function() { throw new Error('erroneous quat._x access'); } });

    // less common swizzle patterns
    var lesscommon = {
        2: {
            yx: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.y,this.x); },
                set: function(v) { v=GLM.vec2(v); this.y = v[0]; this.x = v[1]; }
            }
        },
        3: {
            xz: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.x,this.z); },
                set: function(v) { v=GLM.vec2(v); this.x = v[0]; this.z = v[1]; }
            },
            zx: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.z,this.x); },
                set: function(v) { v=GLM.vec2(v); this.z = v[0]; this.x = v[1]; }
            },
            xzy: {
                enumerable: false,
                get: function() { return new GLM.vec3(this.x,this.z,this.y); },
                set: function(v) { v=GLM.vec3(v); this.x = v[0]; this.z = v[1]; this.y = v[2]; }
            }
        },
        4: {
            xw: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.x,this.w); },
                set: function(v) { v=GLM.vec2(v); this.x = v[0]; this.w = v[1]; }
            },
            wz: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.w,this.z); },
                set: function(v) { v=GLM.vec2(v); this.w = v[0]; this.z = v[1]; }
            },
            xzw: {
                enumerable: false,
                get: function() { return new GLM.vec3(this.x,this.z,this.w); },
                set: function(v) { v=GLM.vec3(v); this.x = v[0]; this.z = v[1]; this.w = v[2]; }
            }
        }
    };
    for(var N in lesscommon) {
        for(var p in lesscommon[N]) {
            if (N <= 2)
                GLM.vec2.$properties.def(p, lesscommon[N][p])
            if (N <= 3)
                GLM.vec3.$properties.def(p, lesscommon[N][p])
            if (N <= 4)
                GLM.vec4.$properties.def(p, lesscommon[N][p])
        }
    }

    // cached NxN matrix column accessors
    var szfloat = GLM.$outer.Float32Array.BYTES_PER_ELEMENT;
    GLM.$partition = function cols(mat_prototype, vec, nrows, cache_prefix) {
       if (nrows === undefined) throw new GLM.GLMJSError('nrows is undefined');
       // mat column accessors -- eg: mat[0] as a read/write vec
       var vec_length = vec.$.identity.length;

       // if unspecified then assume square
       nrows = nrows || vec_length;

       //GLM.$outer.console.info("GLM.$partition", [vec_length,nrows].join("x"));
       var CACHEDBG = function(x) { GLM.$DEBUG > 3 && GLM.$outer.console.debug('CACHEDBG: '+x); };
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
                     set: function setter(o) {
                        if (o instanceof vec)
                           this.elements.set(o.elements, _index);
                        else if (o && o.length === vec_length) {
                           this.elements.set(o, _index);
                        } else
                        throw new GLM.GLMJSError("unsupported argtype to "+
                                             (mat_prototype&&mat_prototype.$type)+"["+index+'] setter: '+
                                             [typeof o,o]);
                     },
                     get: function getter() {
                        if (cache_prefix) {
                           if (this[cache_index]) {
                              if (!index) { CACHEDBG("cache hit "+cache_index); }
                              //Object.defineProperty(this, index, {configurable: true, enumerable: false, get: function() { return this[cache_index] }});
                              return this[cache_index];
                           }
                           if (!index) { CACHEDBG("cache miss "+cache_index); }
                        }
                        var t;
                        // this.elements.subarray (which can be reentrant)
                        // didn't work as reliably as new Float32Array(.buffer,...)
                        var v = new vec(
                           t = GLM.$subarray(this.elements, _index, _index + vec_length)
                        );
                        if(!(v.elements === t)) throw new GLM.GLMJSError("v.elements !== t");
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
   GLM.$types.forEach(
      function(p) {
         if (GLM[p].componentLength) {
            out("GLM."+p, JSON.stringify(
                   {
                      '#type': GLM[p].prototype.$type_name,
                      '#floats': GLM[p].componentLength,
                      '#bytes': GLM[p].BYTES_PER_ELEMENT
                   }));
         }
      });
};

GLM.$init = function(hints) {
   if (hints.prefix)
      GLMJS_PREFIX = hints.prefix;

   GLM.$prefix = GLMJS_PREFIX;

   var DBG = hints.log || function() {};

   try { DBG("GLM-js: ENV: "+_ENV._VERSION); } catch(e) {}

   DBG("GLM-JS: initializing: "+JSON.stringify(hints,0,2));
   DBG(JSON.stringify({'functions':Object.keys(GLM.$outer.functions)}));

   GLM.$outer.vec3_eulerAngles = GLM.$outer.vec3_eulerAngles || GLM.$outer._vec3_eulerAngles;
   // augmented metadata
   GLM.$symbols = [];
   for(var p in GLM) {
      if (typeof GLM[p] === 'function') {
         if (/^[a-z]/.test(p)) // for glm.using_namespace and other metaprog
            GLM.$symbols.push(p);
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
    GLM.using_namespace.$tmp = {
        ret: undefined,
        tpl: tpl,
        names: GLM.$symbols,
        saved: {},
        evals: [],
        restore: [],
        before: [],
        after: []
    };

    eval(GLM.using_namespace.$tmp.names
         .map(function(x,_) { return "GLM.using_namespace.$tmp.saved['"+x+"'] = GLM.using_namespace.$tmp.before["+_+"] = 'undefined' !== typeof "+x+";" }).join("\n")
        );
   GLM.$DEBUG && console.warn("GLM.using_namespace before #globals: "+GLM.using_namespace.$tmp.before.length);

   GLM.using_namespace.$tmp.names.map(function(x) {
                var cme = "GLM.using_namespace.$tmp.saved['"+x+"']=undefined;"+
                   "delete GLM.using_namespace.$tmp.saved['"+x+"'];";

                //try {
                   GLM.using_namespace.$tmp.restore.push(x+"=GLM.using_namespace.$tmp.saved['"+x+"'];"+cme);
                //} catch(e) {
                //   restore.push(x+"=undefined;delete "+x+";"+cme);
                //}
                GLM.using_namespace.$tmp.evals.push(x+"=GLM."+x+";");
             });
   eval(GLM.using_namespace.$tmp.evals.join("\n"));

   GLM.using_namespace.$tmp.ret = tpl();

   eval(GLM.using_namespace.$tmp.restore.join("\n"));
   eval(GLM.using_namespace.$tmp.names.map(function(x,_) { return "GLM.using_namespace.$tmp.after["+_+"] = 'undefined' !== typeof "+x+";" }).join("\n"));
    GLM.$DEBUG && console.warn("GLM.using_namespace after #globals: "+GLM.using_namespace.$tmp.after.length);
    var ret = GLM.using_namespace.$tmp.ret;
    delete GLM.using_namespace.$tmp;
   // if ((before.length+after.length) !== 0) {
   //    throw new Error(JSON.stringify({before:before,after:after, usn: Object.keys(GLM.using_namespace)}));
   // }
   // if (before.length !== after.length) {
   //    throw new Error(JSON.stringify({before:before,after:after, usn: Object.keys(GLM.using_namespace)}));
   // }
   return ret;
};

function $GLM_extern(func, local) {
   //try { console.debug("extern "+func, local||""); } catch(e){}
   local = local || func;
   return function() {
      GLM[local] = GLM.$outer.functions[func] || GLM.$outer[func];
      if (!GLM[local]) throw new GLM.GLMJSError('$GLM_extern: unresolved external symbol: '+func);
      GLM.$DEBUG && GLM.$outer.console.debug('$GLM_extern: resolved external symbol '+func+' '+typeof GLM[local]);
      return GLM[local].apply(this, arguments);
   };
}

function GLM_polyfills() {
    var filled = {};
    if (!( "bind" in Function.prototype )) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill
        filled.bind = Function.prototype.bind = function(b){
            if(typeof this!=="function"){throw new TypeError("not callable");}
            function c(){}var a=[].slice,f=a.call(arguments,1),e=this,
            d=function(){
                return e.apply(this instanceof c?this:b||global,f.concat(a.call(arguments)));
            };
            c.prototype=this.prototype||c.prototype;d.prototype=new c();return d;};
    }
    return filled;
}

$GLM_reset_logging.current = function() {
   return {
      $GLM_log: typeof $GLM_log !== 'undefined' && $GLM_log,
      $GLM_console_log: typeof $GLM_console_log !== 'undefined' && $GLM_console_log,
      $GLM_console_prefixed: typeof $GLM_console_prefixed !== 'undefined' && $GLM_console_prefixed,
      console: GLM.$outer.console
   };
};

function $GLM_reset_logging(force) {
   if (force && typeof force === 'object') {
      $GLM_log = force.$GLM_log;
      $GLM_console_log = force.$GLM_console_log;
      $GLM_console_factory = force.$GLM_console_factory;
      GLM.$outer.console = force.console;
      force = false; // fall-thru for any missing values
   }
   // support glm.$log being injected for easier testing
   if (force || 'undefined' === typeof $GLM_log)
      $GLM_log = function(x,y) {
         GLM.$outer.console.log.apply(
            GLM.$outer.console,
            [].slice.call(arguments).map(
               function(x){
                  var jstype = typeof x;
                  if (jstype === 'xboolean' || jstype === 'string')
                     return x+'';
                  if (GLM.$isGLMObject(x) || !isNaN(x))
                     return GLM.to_string(x);
                  return x+'';
               })
         );
      };

   // ditto for consolidated console writes
   if (force || 'undefined' === typeof $GLM_console_log) {
      $GLM_console_log = function(prefix, args) {
         (console[prefix]||function(){}).apply(
            console,
            [].slice.call(arguments,1)
         );
      };
   }
   if (force || 'undefined' === typeof $GLM_console_factory) {
      $GLM_console_factory = function(prefix) { return $GLM_console_log.bind($GLM_console_log, prefix); };
   }

   var con = (
      function(factory) {
         var ret = {};
         "debug,warn,info,error,log,write"
         .replace(/\w+/g,
                  function(prop) {
                     ret[prop] = factory(prop);
                  });
         return ret;
      })($GLM_console_factory);
     if ('object' === typeof GLM) {
         if (GLM.$outer)
             GLM.$outer.console = con;
         GLM.$log = $GLM_log;
     }
   return con;
}//$GLM_reset_logging
try{ window.$GLM_reset_logging = this.$GLM_reset_logging = $GLM_reset_logging; }catch(e){}
GLM.$reset_logging = $GLM_reset_logging;
GLM.$log = GLM.$log || $GLM_log;
//http://stackoverflow.com/a/27925672/1684079
function $GLM_GLMJSError(name, init) {
   function E(message) {
      this.name = name;
      this.stack = (new Error()).stack;
      if (Error.captureStackTrace)
         Error.captureStackTrace(this, this.constructor);
      this.message = message;
      init && init.apply(this, arguments);
   }
   E.prototype = new Error();
   E.prototype.name = name;
   E.prototype.constructor = E;
   return E;
}

//try { module.exports = GLM; } catch(e) {}
