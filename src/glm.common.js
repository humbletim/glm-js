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
   version: "0.0.6c",
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
         var q = glm.quat(), M=glm.mat3(1);
         q['*='](glm.angleAxis(o.x, M[0]));
         q['*='](glm.angleAxis(o.y, M[1]));
         q['*='](glm.angleAxis(o.z, M[2]));
         return q.elements;
      },
      // _vec3_eulerAngles: function(q) {
      //    // adapted from three.js
      //    var te = this.mat4_array_from_quat(q);
      //    var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
      //    m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
      //    m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

      //    var thiz = new glm.vec3();
      //    thiz.y = Math.asin( - glm._clamp( m31, - 1, 1 ) );

      //    if ( Math.abs( m31 ) < 0.99999 ) {
      //       thiz.x = Math.atan2( m32, m33 );
      //       thiz.z = Math.atan2( m21, m11 );
      //    } else {
      //       thiz.x = 0;
      //       thiz.z = Math.atan2( - m12, m22 );
      //    }
      //    return thiz;
      // },

       // so that people can work-around faulty TypedArray implementations
      Array: Array,
      ArrayBuffer: ArrayBuffer,
      Float32Array: Float32Array, Float64Array: Float64Array,
      Uint8Array:Uint8Array, Uint16Array: Uint16Array, Uint32Array: Uint32Array,
      Int8Array: Int8Array, Int16Array: Int16Array, Int32Array: Int32Array,
      DataView: typeof DataView !== 'undefined' && DataView,
      $rebindTypedArrays: function(alternator) {
         var ret = Object.keys(GLM.$outer)
            .filter(RegExp.prototype.test.bind(/.Array$|^ArrayBuffer$|^DataView$/))
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

   _radians: function(n) { return n * this.PI / 180; }.bind(Math),
   _degrees: function(n) { return n * 180 / this.PI; }.bind(Math),

//    _degrees: $GLM_extern('degrees', '_degrees'),
//    radians: $GLM_extern("radians"),

   normalize: $GLM_extern('normalize'),
   inverse: $GLM_extern('inverse'),
   distance: $GLM_extern('distance'),
   length: $GLM_extern('length'),
   length2: $GLM_extern('length2'),
   transpose: $GLM_extern('transpose'),
   slerp: $GLM_extern("slerp"),
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
   ortho: function(left, right, bottom, top, near, far) {
       return GLM.$outer.mat4_ortho(left, right, bottom, top, near, far);
   },

   _eulerAngles: function(q) {
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

   _toMat4: function toMat4(q) {
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
      function verify() {
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
      }
       verify();
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
       var typedArray = o.constructor;
       b = b || o.length;
       return new typedArray(
          o.buffer, o.byteOffset +
             a * typedArray.BYTES_PER_ELEMENT,
          (b-a));
    }

    //var ab = new ArrayBuffer(16*4);
    //var fb = new Float32Array(ab);
    //if (fb.length === ab.byteLength)
    //   GLM.$outer.console.error("BROKEN TypedArrays detected");

    function test_native_subarray() {
        var f = new GLM.$outer.Float32Array([0,0]);
        f.subarray(1).subarray(0)[0] = 1;
        var result = test_native_subarray.result = [ f[1], new GLM.$outer.Float32Array(16).subarray(12,16).length ];
        return !(
            f[1] !== result[0] || // SpiderMonkey
            4 !== result[1] // QtScript
        );
    }

    function test_patched_subarray(subarray) {
        var f = new GLM.$outer.Float32Array([0,0]);
        subarray(subarray(f,1), 0)[0] = 1;
        var result = test_patched_subarray.result = [ f[1], subarray(new GLM.$outer.Float32Array(16), 12, 16).length ];
        return !(
            f[1] !== result[0] || // SpiderMonkey
            4 !== result[1] // QtScript
        );
    }

    Object.defineProperty(
       GLM, 'patch_subarray',
       {
           configurable: true,
           value: function patch_subarray() {
               var busted = !test_native_subarray();
               var subarray = busted ?
                   workaround_broken_spidermonkey_subarray :
                   native_subarray;
               subarray.workaround_broken_spidermonkey_subarray = workaround_broken_spidermonkey_subarray;
               subarray.native_subarray = native_subarray;

               if (!test_patched_subarray(subarray))
                   throw new Error('failed to resolve working TypedArray.subarray implementation... '+test_patched_subarray.result);

               return subarray;
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
      Object.defineProperty(F, 'GLM', { value: GLM });
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
            if (/\bthis[\[.]/.test(func+'')) return func.bind(F);
            return func;
         }
      };
   },
   "template<T>": function(F, dbg) {
      F.$sig = "template<T>";
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         eval('1,'+this._traceable("Tglm_"+dbg,
         "function(o) {\n" +
         "   //var F = arguments.callee.F;\n" +
         "   var types = " + JSON.stringify(GLM.$template.jstypes) + ";\n" +
         "   var F = " + JSON.stringify(F) + ";\n" +
         "   if (this instanceof GLM.$GLMBaseType) { o=this; }\n" +
         "   var T = [(o&&o.$type) || types[typeof o] || types.get(o) || 'null'];\n" +
         "   if (!F[T])\n" +
         "      throw GLM.$template._genArgError(F, arguments.callee.dbg, T, [o]);\n" +
         "   return eval('1,'+F[T])()(o);\n" +
         "}\n"))());
   },
   "template<T,...>": function(F, dbg) {
      F.$sig = "template<T,...>";
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         eval('1,'+this._traceable("Tdotglm_"+dbg,
         "function(o) {\n" +
         "   //var F = arguments.callee.F;\n" +
         "   var types = " + JSON.stringify(GLM.$template.jstypes) + ";\n" +
         "   var F = " + JSON.stringify(F) + ";\n" +
         "   var args = __VA_ARGS__;\n" +
         "   if (this instanceof GLM.$GLMBaseType) { args.unshift(o=this); }\n" +
         "   var T = [(o&&o.$type) || types[typeof o] || types.get(o) || 'null'];\n" +
         "   if (!F[T])\n" +
         "      throw GLM.$template._genArgError(F, arguments.callee.dbg, T, args);\n" +
         "   return eval('1,'+F[T])().apply(F, args);\n" +
         "}\n"))());
   },
   "template<T,V,number>": function(F, dbg) {
      F.$sig = "template<T,V,number>";
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         eval('1,'+this._traceable("TVnglm_"+dbg,
         "function() {\n" +
         "   var args = __VA_ARGS__;\n" +
         "   var types = " + JSON.stringify(GLM.$template.jstypes) + ";\n" +
         "   var F = " + JSON.stringify(F) + ";\n" +
         "   if (this instanceof GLM.$GLMBaseType) { args.unshift(this); }\n" +
         "   var o=args[0], p=args[1], v=args[2];\n" +
         "   //if (this instanceof GLM.$GLMBaseType) { v=p, p=o, o=this; }\n" +
         "   var TV = [(o&&o.$type) || types[typeof o] || types[o+''] || '<unknown '+o+'>',\n" +
         "             (p&&p.$type) || types[typeof p] || types[p+''] || '<unknown '+p+'>'];\n" +
         "   if (!F[TV])\n" +
         "      throw GLM.$template._genArgError(F, arguments.callee.dbg, TV, [o,p,v]);\n" +
         "   if (typeof v !== 'number')\n" +
         "      throw (function(F, dbg, v) {\n" +
         "          return new GLM.GLMJSError(dbg+F.$sig+': unsupported n type: '+[typeof v,v]);\n" +
         "      })(F, arguments.callee.dbg, v);\n" +
         "   return eval('1,'+F[TV])()(o,p,v);\n" +
         "}\n"))());
   },
   "template<T,V,...>": function(F, dbg) {
      F.$sig = 'template<T,V,...>';
      var Array = GLM.$outer.Array;
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         eval('1,'+this._traceable("TVglm_"+dbg,
         "function() {\n" +
         "   var args = __VA_ARGS__;\n" +
         "   var types = " + JSON.stringify(GLM.$template.jstypes) + ";\n" +
         "   var F = " + JSON.stringify(F) + ";\n" +
         "   if (this instanceof GLM.$GLMBaseType) { args.unshift(this); }\n" +
         "   //            if (this instanceof GLM.$GLMBaseType) { c=b, b=a, a=p, p=o, o=this; }\n" +
         "   var o=args[0], p=args[1];\n" +
         "   var TV = [(o&&o.$type) || types[typeof o],\n" +
         "             (p&&p.$type) || types[typeof p] || types[p+''] ||\n" +
         "             (GLM.$outer.Array.isArray(p) && 'array'+p.length+'') || ''+p+''];\n" +
         "   if (!F[TV]) { //alert(this.constructor+'');\n" +
         "      throw GLM.$template._genArgError(F, arguments.callee.dbg, TV, args); }\n" +
         "   return eval('1,'+F[TV])().apply(F, args);\n" +
         "   //return F[TV](o,p,a,b,c);\n" +
         "}\n"))());
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
          if (p !== 'mat4_scale' && typeof TS[p] !== 'object')
              throw new GLM.GLMJSError('expect object property overrides: ' + [p,TS[p], Object.keys(ret)]);
          if (typeof TS[p] === 'object') {
              this.override(TV, p, TS[p], ret, true /*force / replace existing*/);
          } else
              ret_scale = 5;
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
      if ('function' !== typeof eval('1,'+src))
         throw new GLM.GLMJSError("_traceable expects tidy function as second arg "+src);
      if (!hint) throw new GLM.GLMJSError("_traceable expects hint or what's the point" + [src,hint]);
      hint = this._tojsname(hint||"_traceable");
      src = src.replace(/^(\s*var\s*(\w+)\s*=\s*)__VA_ARGS__;/mg,
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
      if (GLM.$DEBUG) {
         try {
            eval('1,'+src);
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
                        TSP[kn] = 'function _cheako(){ return ' + (tpl+'')
                                    .replace(/^function\s*\(/,'function '+fname+'(')
                                    .replace(/N[*]N/g,N*N).replace(/N/g,N) + '; }';
                        //console.error('TN:',TN,kn,TSP[kn]);
                     }
                  }
               );
            }.bind(this));
         if (/^[$]/.test(TN)) GLM.$DEBUG && GLM.$outer.console.debug("@ NOT naming "+TN);
         else if (!bN && 'function' === typeof eval('1,'+TSP[TN]) && !eval('1,'+TSP[TN]).name) {
            GLM.$DEBUG && GLM.$outer.console.debug("naming "+_tojsname(hint+"_"+TN));
            /*TRACING*/ TSP[TN] = this._traceable("glm_"+hint+"_"+TN, TSP[TN]);
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

    _fix_$_names: function($type, $) {
      if (1) {
         // make sure methods have a reasonable function name for profiling
         Object.keys($)
            .filter(function(p) {
                    var f;
                    try {
                            f = eval('1,'+$[p]);
                    } catch (e) {
                            return false;
                    } return 'function' !== typeof $[p] && 'function' === typeof f && !f.name; })
            .map(function(p) {
                    var hint = $type+"_"+p;
                    GLM.$DEBUG && GLM.$outer.console.debug("naming $."+p+" == "+hint, this._traceable(hint, $[p]));
                    /*TRACING*/ $[p] = /*EVAL*/eval('1,'+this._traceable("glm_"+hint,$[p]))();
                 }.bind(this));
      }
      return $;
    },
    _typedArrayMaker: function($len, Float32Array) {
        return function makeTypedArray(n) {
            if (n.length === $len)
                return new Float32Array( n );
            var elements = new Float32Array( $len );
            elements.set(n);
            return elements;
        };
    },

   GLMType: function ($type, _$) {
      var $ = this._fix_$_names($type, _$);
      var $len = $.identity.length;

       var getBuilder = (function(Object, GLM, $, $type, _get_argnames, GLMJSError) {
           var $$ = {}
           for(var p in $) {
               if (typeof $[p] === 'string')
                       try {
                               $[p] = eval('1,'+$[p]);
                               } catch(e) {}
               if (typeof $[p] === 'function') {
                   (function(builder) {
                       $$[p] = function(args) { return builder.apply($, args); };
                   })($[p]);
               }
           }
           return function getBuilder(args) {
               var n = args[0];
               var sig = typeof n + args.length;
               var builder = $$[sig];

               if (!builder) {
                   var s = 'glm.'+$type;
                   var provided = s + '('+args.map(function(_){return typeof _})+')';
                   var hints = Object.keys($)
                       .filter(
                           function(_) {
                               return typeof $[_] === 'function' && /^\w+\d+$/.test(_); }
                       )
                       .map(function(_) {
                           return s+'('+_get_argnames($[_])+')';
                       });
                   throw new GLMJSError(
                       'no constructor found for: '+provided+'\n'+
                           'supported signatures:\n\t'+
                           hints.join('\n\t'));
               }
               return builder;
           };
       })(Object, GLM, $, $type, GLM.$template._get_argnames.bind(GLM.$template), GLM.GLMJSError);

       var verifyLength = (function(Object, GLM, $, $type, _get_argnames, GLMJSError) {
           return function verifyLength(n, fail) {
               GLM.$DEBUG > 2 && GLM.$outer.console.info("adopting elements...", typeof n);
               if (n.length != $len) {
                   if (fail === false)
                       return fail;
                   GLM.$outer.console.error(
                       $type+' elements size mismatch: '+
                           ['wanted:'+$len, 'handed:'+n.length]
                   );
                   var nn = GLM.$subarray(n,0,$len);
                   throw new GLM.GLMJSError(
                       $type+' elements size mismatch: '+
                           ['wanted:'+$len, 'handed:'+n.length,
                            'theoreticaly-correctable?:'+(nn.length ===  $len)]
                   );
               }
               return n;
           }
       })(Object, GLM, $, $type, GLM.$template._get_argnames.bind(GLM.$template), GLM.GLMJSError);

       var makeTypedArray = this._typedArrayMaker($len, GLM.$outer.Float32Array);

       var isTypedArray = (function($outer) {
           return function isTypedArray(n) {
               return n instanceof $outer.Float32Array;
           };
       })(GLM.$outer);

       var $class = (function(Array, Object, GLM, $, $type, _get_argnames, GLMJSError, _traceable) {
           return /*TRACING*/ eval('1,'+_traceable("glm_"+$type+"$class",
      "function(n) {\n" +
      "   //var $class = arguments.callee;\n" +
      "   var args = __VA_ARGS__;\n" +
      "   var builder = getBuilder(args);\n" +
      "   var elements;\n" +
      "   //GLM.$outer.console.warn(sig, $type, n, $type, this.$type, this.constructor);\n" +
      "   var $class = getClass();\n" +
      "   if (!(this instanceof $class)) { //(!isASelf(this)) {\n" +
      "      // if we're called as a regular function, redirect to 'new $class()'\n" +
      "      // new $class(<Float32Array>) will use <Float32Array> by reference\n" +
      "      // $class(<Float32Array>) will use <Float32Array> by copy\n" +
      "        if (isTypedArray(n) && n.length === $len)\n" +
      "            elements = makeTypedArray(n);\n" +
      "        else\n" +
      "            elements = builder(args);\n" +
      "        return new $class(elements);\n" +
      "   } else {\n" +
      "      // called as 'new $class()''\n" +
      "       if (isTypedArray(n)) {\n" +
      "         // note: $class(<Float32Array>) is a special case in which we adopt the passed buffer\n" +
      "         //       (bypassing the builder / causing updates to the existing buffer instead)\n" +
      "          elements = verifyLength(n);\n" +
      "      } else {\n" +
      "          elements = makeTypedArray(builder(args));\n" +
      "      }\n" +
      "       //this.elements = elements;\n" +
      "       Object.defineProperty(this, 'elements', { enumerable: false, configurable: true, value: elements });\n" +
      "   }\n" +
      "}\n"))();
       })(Array, Object, GLM, $, $type, GLM.$template._get_argnames.bind(GLM.$template), GLM.GLMJSError, GLM.$template._traceable.bind(GLM.$template));

       function getClass() {
           return $class;
       }
       function isASelf(t) {
           return t instanceof getClass();
       }
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
         'vec2,vec2': "function(a, b) {\n" +
         "   return this.GLM.vec3(0,0,a.x * b.y - a.y * b.x);\n" +
         "}\n"
      },
      distance: {
          'vec<N>,vec<N>': "function(a, b) {\n" +
          "    return this.GLM.length(b.sub(a));\n" +
          "}\n"
      }
   });
GLM.$template['declare<T,V,number>'](
   {
      mix: {
         "float,float": "function(v,n,rt) {\n" +
         "   return n*rt+v*(1-rt);\n" +
         "}\n",
         "vec<N>,vec<N>": "function(v,n,rt) {\n" +
         "   //if (rt === undefined) throw new Error('glm.mix<vecN,vecN>(v,n,rt) requires 3 arguments');\n" +
         "   var rtm1 = (1-rt);\n" +
         "   var ret = new this.GLM.vecN(new (v.elements.constructor)(N));\n" +
         "   var re = ret.elements,\n" +
         "        ve = v.elements,\n" +
         "        ne = n.elements;\n" +
         "    for(var i = 0; i < N; i++)\n" +
         "        re[i] = ne[i]*rt+ve[i]*rtm1;\n" +
         "    return ret;\n" +
         "}\n"
      },
      clamp: {
         "float,float": "function(n,a,b) {\n" +
         "   return GLM._clamp(n,a,b);\n" +
         "}\n",
         "vec<N>,float": "function(v,a,b) {\n" +
         "   return new GLM.vecN(GLM.$to_array(v).map(function(n){ return GLM._clamp(n,a,b); }));\n" +
         "}\n"
      },
      epsilonEqual: {
         'float,float': "function(x,y,e) { return Math.abs(x - y) < e; }\n", // GLM._epsilonEqual
         'vec<N>,vec<N>': "function(a,b,ep) {\n" +
         "   var eq = this['float,float'];\n" +
         "   var ret = glm.bvecN();\n" +
         "   for(var i=0; i < N; i++)\n" +
         "      ret[i] = eq(a[i],b[i],ep);\n" +
         "   return ret;\n" +
         "}\n",
         //'bvec<N>,bvec<N>': "function(a,b,ep) { return this['vecN,vecN'](a,b,ep); }\n" +,
         'ivec<N>,ivec<N>': "function(a,b,ep) { return this['vecN,vecN'](a,b,ep); }\n",
         'uvec<N>,uvec<N>': "function(a,b,ep) { return this['vecN,vecN'](a,b,ep); }\n",
         'quat,quat': "function(a,b,ep) {\n" +
         "   var eq = this['float,float'];\n" +
         "   var ret = glm.bvec4();\n" +
         "   for(var i=0; i < 4; i++)\n" +
         "      ret[i] = eq(a[i],b[i],ep);\n" +
         "   return ret;\n" +
         "}\n",
         'mat<N>,mat<N>': "function(a,b,ep) {\n" +
         "   throw new GLM.GLMJSError(" + '"' + "error: 'epsilonEqual' only accept floating-point and integer scalar or vector inputs" + '"' + ");\n" +
         "}\n"
      }
   });

GLM.$template.extend(
   GLM, GLM.$template['declare<T>'](
   {
      degrees: {
         "float": "function(n) { return this.GLM._degrees(n); }\n",
         "vec<N>": "function(o) {\n" +
         "   return new this.GLM.vecN(this.GLM.$to_array(o).map(this.GLM._degrees));\n" +
         "}\n"
      },
      radians: {
         "float": "function(n) { return this.GLM._radians(n); }\n",
         "vec<N>": "function(o) {\n" +
         "   return new this.GLM.vecN(this.GLM.$to_array(o).map(this.GLM._radians));\n" +
         "}\n"
      },
      sign: {
         "null": "function() { return 0; }\n",
         "undefined": "function() { return NaN; }\n",
         "string": "function() { return NaN; }\n",
         "float": "function(n) { return GLM._sign(n); }\n",
         "vec<N>": "function(o) {\n" +
         "   return new GLM.vecN(GLM.$to_array(o).map(GLM._sign));\n" +
         "}\n",
         "ivec<N>": "function(o) {\n" +
         "   return new GLM.ivecN(GLM.$to_array(o).map(GLM._sign));\n" +
         "}\n"
      },
      abs: {
         "float": "function(n) { return GLM._abs(n); }\n",
         "vec<N>": "function(o) {\n" +
         "   return new GLM.vecN(GLM.$to_array(o).map(GLM._abs));\n" +
         "}\n"
      },
      fract: {
         "float": "function(n) { return GLM._fract(n); }\n",
         "vec<N>": "function(o) {\n" +
         "   return new GLM.vecN(GLM.$to_array(o).map(GLM._fract));\n" +
         "}\n"
      },
      all: {
         "vec<N>": "function(o) { return N === GLM.$to_array(o).filter(Boolean).length; }\n",
         "bvec<N>": "function(o) { return N === GLM.$to_array(o).filter(Boolean).length; }\n",
         "ivec<N>": "function(o) { return N === GLM.$to_array(o).filter(Boolean).length; }\n",
         "uvec<N>": "function(o) { return N === GLM.$to_array(o).filter(Boolean).length; }\n",
         "quat": "function(o) { return 4 === GLM.$to_array(o).filter(Boolean).length; }\n"
      },

      $to_object: {
         "vec2": "function(v) { return {x:v.x, y:v.y}; }\n",
         "vec3": "function(v) { return {x:v.x, y:v.y, z:v.z}; }\n",
         "vec4": "function(v) { return {x:v.x, y:v.y, z:v.z, w:v.w}; }\n",
         "uvec2":"function(v) { return {x:v.x, y:v.y}; }\n",
         "uvec3":"function(v) { return {x:v.x, y:v.y, z:v.z}; }\n",
         "uvec4":"function(v) { return {x:v.x, y:v.y, z:v.z, w:v.w}; }\n",
         "ivec2":"function(v) { return {x:v.x, y:v.y}; }\n",
         "ivec3":"function(v) { return {x:v.x, y:v.y, z:v.z}; }\n",
         "ivec4":"function(v) { return {x:v.x, y:v.y, z:v.z, w:v.w}; }\n",
         "bvec2":"function(v) { return {x:!!v.x, y:!!v.y}; }\n",
         "bvec3":"function(v) { return {x:!!v.x, y:!!v.y, z:!!v.z}; }\n",
         "bvec4":"function(v) { return {x:!!v.x, y:!!v.y, z:!!v.z, w:!!v.w}; }\n",
         "quat": "function(v) { return {w:v.w, x:v.x, y:v.y, z:v.z}; }\n",
         "mat3": "function(v) { return {0:this.vec3(v[0]),\n" +
                                   "    1:this.vec3(v[1]),\n" +
                                   "    2:this.vec3(v[2])}; }\n",
         "mat4": "function(v) { return {0:this.vec4(v[0]),\n" +
                                   "    1:this.vec4(v[1]),\n" +
                                   "    2:this.vec4(v[2]),\n" +
                                   "    3:this.vec4(v[3])}; }\n"
      },

       // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtc/quaternion.inl
       roll: {
           'quat': "function(q) {\n" +
                   "    return (Math.atan2((2) * (q.x * q.y + q.w * q.z), q.w * q.w + q.x * q.x - q.y * q.y - q.z * q.z));\n" +
               "}\n"
       },
       pitch: {
           'quat': "function(q) {\n" +
                   "    return (Math.atan2((2) * (q.y * q.z + q.w * q.x), q.w * q.w - q.x * q.x - q.y * q.y + q.z * q.z));\n" +
               "}\n"
       },
       yaw: {
           'quat': "function(q) {\n" +
                   "    //return Math.asin((-2) * (q.x * q.z - q.w * q.y));\n" +
           "    // GLM 0.9.8 fix for NaN\n" +
           "    return Math.asin(this.GLM.clamp((-2) * (q.x * q.z - q.w * q.y), (-1), (1)));\n" +
               "}\n"
       },
       eulerAngles: {
           'quat': "function(x) {\n" +
           "    return this.GLM.vec3(this.GLM.pitch(x), this.GLM.yaw(x), this.GLM.roll(x));\n" +
           "}\n"
       }
       /// glm/gtc/quaternion.inl
   }),
   GLM.$template['declare<T,...>'](
      {
         $from_glsl: {
            'string': "function(v, returnType) {\n" +
            "   var ret;\n" +
            "   v.replace(/^([$\w]+)\(([-.0-9ef, ]+)\)$/,\n" +
            "          function(_,what, dat) {\n" +
            "             var type = glm[what] || glm['$'+what];\n" +
            "             if (!type) throw new GLM.GLMJSError('glsl decoding issue: unknown type ('+what+')');\n" +
            "             ret = dat.split(',').map(parseFloat);\n" +
            "             if (!returnType || returnType === type)\n" +
            "                ret = type.apply(glm, ret);\n" +
            "             else if (returnType === true || returnType === Array) {\n" +
            "                 while (ret.length < type.componentLength)\n" +
            "                     ret.push(ret[ret.length-1]);\n" +
            "                 return ret;\n" +
            "             } else throw new GLM.GLMJSError('glsl decoding issue: second argument expected to be undefined|true|Array');\n" +
            "          });\n" +
            "   return ret;\n" +
            "}\n"
         },

         $to_glsl: {
            "vec<N>": "function(v, opts) {\n" +
            "   var arr = GLM.$to_array(v);\n" +
            "   if (opts && typeof opts === 'object' && 'precision' in opts)\n" +
            "      arr = arr.map(function(_) { return _.toFixed(opts.precision); });\n" +
            "   // un-expand identical trailing values\n" +
            "   while(arr.length && arr[arr.length-2] === arr[arr.length-1])\n" +
            "      arr.pop();\n" +
            "   return v.$type+'('+arr+')';\n" +
            "}\n",
            "uvec<N>": "function(v, opts) { return this.vecN(v, opts); }\n",// will pick up 'uvecN' from $type
            "ivec<N>": "function(v, opts) { return this.vecN(v, opts); }\n",// will pick up 'ivecN' from $type
            "bvec<N>": "function(v, opts) { return this.vecN(v, opts); }\n",// will pick up 'bvecN' from $type
            quat: "function(q, opts) { // note: quat()s aren't actually available in GLSL yet\n" +
            "   var precision;\n" +
            "   if (opts && typeof opts === 'object' && 'precision' in opts) precision = opts.precision;\n" +
            "   if((q.x+q.y+q.z)===0)\n" +
            "      return 'quat('+(precision === undefined ? q.w : q.w.toFixed(precision))+')';\n" +
            "   return this.vec4(q, opts);\n" +
            "   //return 'quat('+GLM.$to_array(q)+')';\n" +
            "}\n",
            'mat<N>': "function(M, opts) {\n" +
            "   var precision;\n" +
            "   if (opts && typeof opts === 'object' && 'precision' in opts) precision = opts.precision;\n" +
            "   // FIXME: this could fail on particular diagonals that sum to N\n" +
            "   var m=GLM.$to_array(M);\n" +
            "   if (precision !== undefined)\n" +
            "      m = m.map(function(_) { return _.toFixed(precision); });\n" +
            "   var ss=m.reduce(function(s,e){return s+1*e; },0);\n" +
            "   if (ss === m[0]*N) return 'matN('+m[0]+')';\n" +
            "   return 'matN('+m+')';\n" +
            "}\n"
         },

         frexp: {
            "float": "function(val,arrptr) {\n" +
            "   return arguments.length === 1 ?\n" +
            "      this['float,undefined'](val) :\n" +
            "      this['float,array'](val, arrptr);\n" +
            "}\n",
            "vec<N>": "function(fvec, ivec) {\n" +
            "   if (arguments.length < 2)\n" +
            "      throw new GLM.GLMJSError('frexp(vecN, ivecN) expected ivecN as second parameter');\n" +
            "   return GLM.vecN(\n" +
            "      GLM.$to_array(fvec).map(\n" +
            "         function(x,_) {\n" +
            "            var mantissa_exp = GLM._frexp(x);\n" +
            "            ivec[_] = mantissa_exp[1];\n" +
            "            return mantissa_exp[0];\n" +
            "         })\n" +
            "   );\n" +
            "}\n",
            // referenced here only (from float/vec<N>)
            "float,undefined": "function(val) {\n" +
            "   return GLM._frexp(val);\n" +
            "}\n",
            "float,array": "function(val,arr) {\n" +
            "   return GLM._frexp(val, arr);\n" +
            "}\n"
         },
         ldexp: {
            "float": "function(x,_) {\n" +
            "   return GLM._ldexp(x,_);\n" +
            "}\n",
            "vec<N>": "function(fvec, ivec) {\n" +
            "   return GLM.vecN(\n" +
            "      GLM.$to_array(fvec).map(\n" +
            "         function(x,_) {\n" +
            "            return GLM._ldexp(x,ivec[_]);\n" +
            "         })\n" +
            "   );\n" +
            "}\n"
         }
      }
   )
);

GLM.$template['declare<T,V,...>'](
   {
      rotate: {
         'float,vec3': "function(theta, axis) {\n" +
         "   return this.GLM.$outer.mat4_angleAxis(theta, axis);\n" +
         "}\n",
         'mat4,float': "function(mat, theta, vec) {\n" +
         "   return mat.mul(this.GLM.$outer.mat4_angleAxis(theta, vec));\n" +
         "}\n"
      },
      scale: {
           $outer: "GLM.$outer",
           'mat4,vec3': "function(mat, v) {\n" +
           "    return mat.mul("+this.$outer+".mat4_scale(v));\n" +
           "}\n",
           'vec3,undefined': "function(v) { return "+this.$outer+".mat4_scale(v); }\n"
      },
      translate: {
         'mat4,vec3': "function(mat, v) {\n" +
         "   return mat.mul(this.GLM.$outer.mat4_translation(v));\n" +
         "}\n",
         'vec3,undefined': "function(v) { return this.GLM.$outer.mat4_translation(v); }\n"
      },
      angleAxis: {
       // GLM 0.9.5 supported this signature, but 0.9.6 dropped it\n" +
       //'float,float': "function(angle,x,y,z) {\n" +
       //"   return GLM.$outer.quat_angleAxis(angle, glm.vec3(x,y,z));\n" +
       //"}\n",
         'float,vec3': "function(angle, axis) {\n" +
         "   return this.GLM.$outer.quat_angleAxis(angle, axis);\n" +
         "}\n"
      },
      min: {
         "float,float": "function(a,b) { return this.GLM._min(a,b); }\n",
         "vec<N>,float": "function(o,b) {\n" +
         "    return new this.GLM.vecN(this.GLM.$to_array(o).map(function(v){ return this.GLM._min(v,b); }.bind(this)));\n" +
         "}\n"
      },
      max: {
         "float,float": "function(a,b) { return this.GLM._max(a,b); }\n",
         "vec<N>,float": "function(o,b) {\n" +
         "   return new this.GLM.vecN(this.GLM.$to_array(o).map(function(v){ return this.GLM._max(v,b); }.bind(this)));\n" +
         "}\n"
      },
      equal: {
         'float,float': "function(a,b) { GLM._equal(a,b); }\n",
         'vec<N>,vec<N>': "function(a,b) {\n" +
         "   var eq = this['float,float'];\n" +
         "   var ret = glm.bvecN();\n" +
         "   for(var i=0; i < N; i++)\n" +
         "      ret[i] = eq(a[i],b[i]);\n" +
         "   return ret;\n" +
         "}\n",
         'bvec<N>,bvec<N>': "function(a,b) { return this['vecN,vecN'](a,b); }\n",
         'ivec<N>,ivec<N>': "function(a,b) { return this['vecN,vecN'](a,b); }\n",
         'uvec<N>,uvec<N>': "function(a,b) { return this['vecN,vecN'](a,b); }\n",
         'quat,quat': "function(a,b) {\n" +
         "   var eq = this['float,float'];\n" +
         "   var ret = glm.bvec4();\n" +
         "   for(var i=0; i < 4; i++)\n" +
         "      ret[i] = eq(a[i],b[i]);\n" +
         "   return ret;\n" +
         "}\n"
      },

       // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtx/quaternion.inl
       _slerp: {
           'quat,quat': "function(x, y, a) {\n" +
                "       var z = y;\n" +
                "       \n" +
                "       var cosTheta = glm.dot(glm.vec4(x), glm.vec4(y));\n" +
                "       \n" +
                "       // If cosTheta < 0, the interpolation will take the long way around the sphere.\n" +
                "       // To fix this, one quat must be negated.\n" +
                "       if (cosTheta < (0))\n" +
                "       {\n" +
                "               z        = y.mul(-1);\n" +
                "               cosTheta = -cosTheta;\n" +
                "       }\n" +
                "       \n" +
                "       // Perform a linear interpolation when cosTheta is close to 1 to avoid side effect of sin(angle) becoming a zero denominator\n" +
                "       if(cosTheta > (1) - glm.epsilon())\n" +
                "           {\n" +
                "                   // Linear interpolation\n" +
                "                   return glm.quat(\n" +
                "                           glm.mix(x.w, z.w, a),\n" +
                "                           glm.mix(x.x, z.x, a),\n" +
                "                           glm.mix(x.y, z.y, a),\n" +
                "                           glm.mix(x.z, z.z, a));\n" +
                "           }\n" +
                "           else\n" +
                "       {\n" +
                "               // Essential Mathematics, page 467\n" +
                "               var angle = Math.acos(cosTheta);\n" +
                "               return (x.mul(Math.sin((1 - a) * angle))  + z.mul(Math.sin(a * angle))) / Math.sin(angle);\n" +
                   "    }\n" +
               "}\n"
       },
       rotation: {
         'vec3,vec3': "function(orig, dest) {\n" +
         "   var cosTheta = this.$dot(orig, dest);\n" +
         "    var rotationAxis = new (orig.constructor)(new (orig.elements.constructor)(3));\n" +
         "    \n" +
         "   if(cosTheta >= 1 - this.$epsilon)\n" +
         "      return this.$quat();\n" +
         "   \n" +
         "   if(cosTheta < -1 + this.$epsilon)\n" +
         "      {\n" +
         "         // special case when vectors in opposite directions :\n" +
         "         // there is no 'ideal' rotation axis\n" +
         "         // So guess one; any will do as long as it's perpendicular to start\n" +
         "         // This implementation favors a rotation around the Up axis (Y),\n" +
         "         // since it's often what you want to do.\n" +
         "         rotationAxis = this.$cross(this.$m[2], orig); //glm.vec3(0, 0, 1)\n" +
         "         if(this.$length2(rotationAxis) < this.$epsilon) // bad luck, they were parallel, try again!\n" +
         "            rotationAxis = this.$cross(this.$m[0], orig);//glm.vec3(1, 0, 0)\n" +
         "         \n" +
         "         rotationAxis = this.$normalize(rotationAxis);\n" +
         "         return this.$angleAxis(this.$pi, rotationAxis);\n" +
         "      }\n" +
         "   \n" +
         "   // Implementation from Stan Melax's Game Programming Gems 1 article\n" +
         "   rotationAxis = this.$cross(orig, dest);\n" +
         "   \n" +
         "   var s = this.$sqrt(((1) + cosTheta) * (2));\n" +
         "   var invs = (1) / s;\n" +
         "   \n" +
         "   return this.$quat(\n" +
         "      s * (0.5),\n" +
         "      rotationAxis.x * invs,\n" +
         "      rotationAxis.y * invs,\n" +
         "      rotationAxis.z * invs);\n" +
         "}\n"
       }, /// glm/gtx/quaternion.inl

       project: {
           // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtc/matrix_transform.inl
           'vec3,mat4': "function project(obj, model, proj, viewport) {\n" +
                   "    var tmp = glm.vec4(obj, (1));\n" +
                   "    tmp = model ['*']( tmp );\n" +
                   "    tmp = proj ['*']( tmp );\n" +
                   "    \n" +
                   "    tmp ['/=']( tmp.w );\n" +
                   "    tmp = tmp ['*'] (0.5) ['+'] (0.5);\n" +
                   "    tmp[0] = tmp[0] * (viewport[2]) + (viewport[0]);\n" +
                   "    tmp[1] = tmp[1] * (viewport[3]) + (viewport[1]);\n" +
                   "    \n" +
                   "    return glm.vec3(tmp);\n" +
               "}\n" /// glm/gtc/matrix_transform.inl
       },
       unProject: {
           // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtc/matrix_transform.inl
           'vec3,mat4': "function unProject(win, model, proj, viewport) {\n" +
                   "    var Inverse = glm.inverse(proj ['*']( model ));\n" +
                   "    \n" +
                   "    var tmp = glm.vec4(win, (1));\n" +
                   "    tmp.x = (tmp.x - (viewport[0])) / (viewport[2]);\n" +
                   "    tmp.y = (tmp.y - (viewport[1])) / (viewport[3]);\n" +
                   "    tmp = tmp ['*']( (2) ) ['-'](glm.vec4(1));\n" +
                   "    \n" +
                   "    var obj = Inverse ['*']( tmp );\n" +
                   "    obj['/=']( obj.w );\n" +
                   "    \n" +
                   "    return glm.vec3(obj);\n" +
               "}\n" /// glm/gtc/matrix_transform.inl
       },
       orientedAngle: {
           // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtx/vector_angle.inl
           'vec3,vec3': "function orientedAngle(x,y,ref) {\n" +
                   "    var Angle = Math.acos(glm.clamp(glm.dot(x, y), (0), (1)));\n" +
                   "    return glm.mix(Angle, -Angle, glm.dot(ref, glm.cross(x, y)) < 0 ? 1 : 0);\n" +
           "}\n" /// glm/gtx/vector_angle.inl
       }
   });

// like glm.to_string; tho this also supports rounding to a precision
GLM.$to_string = GLM.$template['declare<T,...>'](
   {
      $to_string: {
         "function": "function(func) {\n" +
         "   return '[function '+(func.name||'anonymous')+']';\n" +
         "}\n",
         "ArrayBuffer": "function(b) {\n" +
         "   return '[object ArrayBuffer '+JSON.stringify({byteLength: b.byteLength})+']';\n" +
         "}\n",
         "Float32Array": "function(b) {\n" +
         "   return '[object Float32Array '+JSON.stringify({length: b.length, byteOffset: b.byteOffset,\n" +
         "      byteLength: b.byteLength, BPE: b.BYTES_PER_ELEMENT})+']';\n" +
         "}\n",
         "float": "function(what, opts) {\n" +
         "   return GLM.$toFixedString('float', { value: what }, ['value'], opts && opts.precision);\n" +
         "}\n",
         string: "function(what) { return what; }\n",
         bool: "function(what) { return 'bool('+what+')'; }\n",
         'vec<N>': "function(what, opts) {\n" +
         "   return GLM.$toFixedString(what.$type_name, what, what.$components, opts && opts.precision);\n" +
         "}\n",
         'uvec<N>': "function(what, opts) {\n" +
         "   var prec = (opts && typeof opts === 'object' && opts.precision) || 0;\n" +
         "   return GLM.$toFixedString(what.$type_name, what, what.$components, prec);\n" +
         "   //return what.$type_name+'('+glm.$to_array(what)+')';\n" +
         "}\n",
         'ivec<N>': "function(what, opts) {\n" +
         "   var prec = (opts && typeof opts === 'object' && opts.precision) || 0;\n" +
         "   return GLM.$toFixedString(what.$type_name, what, what.$components, prec);\n" +
         "}\n",
         'bvec<N>': "function(what, opts) {\n" +
         "   return what.$type_name+'('+GLM.$to_array(what).map(Boolean).join(', ')+')';\n" +
         "}\n",
         'mat<N>': "function(what, opts) {\n" +
         "   var ret = [0,1,2,3].slice(0,N)\n" +
         "   .map(function(_) { return what[_]; }) // into columns\n" +
         "   .map(function(wi) { // each column's vecN\n" +
         '           return GLM.$toFixedString("\\t", wi, wi.$components, opts && opts.precision);' + "\n" +
         "        });\n" +
         '   return what.$type_name+"(\\n"+ret.join(", \\n")+"\\n)";' + "\n" +
         "}\n",
         quat: "function(what, opts) {\n" +
         "   what = GLM.degrees(GLM.eulerAngles(what));\n" +
         "   return GLM.$toFixedString('<quat>'+what.$type_name, what, ['x','y','z'], opts && opts.precision);\n" +
         "}\n"
      }
   }).$to_string;

GLM.$template['declare<T,V,...>'](
   {
      copy: {
         $op: '=',
         'vec<N>,vec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",
         'vec<N>,array<N>': "function(me,you) { me.elements.set(you); return me; }\n",
         'vec<N>,uvec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",
         'vec<N>,ivec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",
         'vec<N>,bvec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",

         'uvec<N>,uvec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",
         'uvec<N>,array<N>': "function(me,you) { me.elements.set(you); return me; }\n",
         'uvec<N>,vec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",
         'uvec<N>,ivec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",
         'uvec<N>,bvec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",

         'ivec<N>,ivec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",
         'ivec<N>,array<N>': "function(me,you) { me.elements.set(you); return me; }\n",
         'ivec<N>,vec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",
         'ivec<N>,uvec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",
         'ivec<N>,bvec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",

         'bvec<N>,ivec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",
         'bvec<N>,array<N>': "function(me,you) { me.elements.set(you); return me; }\n",
         'bvec<N>,vec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",
         'bvec<N>,uvec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",
         'bvec<N>,bvec<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",

         'quat,quat': "function(me,you) { me.elements.set(you.elements); return me; }\n",
         'mat<N>,mat<N>': "function(me,you) { me.elements.set(you.elements); return me; }\n",
         'mat<N>,array<N>': "function(me,you) {\n" +
         "   you = you.reduce(function(a,b) {\n" +
         "                       if (!a.concat) throw new GLM.GLMJSError(\n" +
         "                           'matN,arrayN -- [[.length===4] x 4] expected');\n" +
         "                       return a.concat(b);\n" +
         "                    });\n" +
         "   if (you === N) throw new GLM.GLMJSError('matN,arrayN -- [[N],[N],[N],[N]] expected');\n" +
         "   return me['='](you);\n" +
         "}\n",
         'mat<N>,array<N*N>': "function(me,you) { me.elements.set(you); return me; }\n",
         'mat4,array9': "function(me,you) { me.elements.set(new GLM.mat4(you).elements); return me; }\n"
      },
      sub: {
         $op: '-',
         _sub: "function(me,you) {\n" +
         "   return (this.GLM.$to_array(me).map(function(v,_) { return v - you[_]; }));\n" +
         "}\n",
         'vec<N>,vec<N>': "function(me,you) { return new this.GLM.vecN(this._sub(me,you)); }\n",
         'vec<N>,uvec<N>': "function(me,you) { return new this.GLM.vecN(this._sub(me,you)); }\n",
         'uvec<N>,uvec<N>': "function(me,you) { return new this.GLM.uvecN(this._sub(me,you)); }\n",
         'uvec<N>,ivec<N>': "function(me,you) { return new this.GLM.uvecN(this._sub(me,you)); }\n",
         'vec<N>,ivec<N>': "function(me,you) { return new this.GLM.vecN(this._sub(me,you)); }\n",
         'ivec<N>,uvec<N>': "function(me,you) { return new this.GLM.ivecN(this._sub(me,you)); }\n",
         'ivec<N>,ivec<N>': "function(me,you) { return new this.GLM.ivecN(this._sub(me,you)); }\n"
      },
      sub_eq: {
         $op: '-=',
          'vec<N>,vec<N>': "function(me,you) {\n" +
          "    var a = me.elements, b = you.elements;\n" +
          "    for(var i=0; i < N; i++)\n" +
          "        a[i] = a[i] - b[i];\n" +
          "    return me;\n" +
          "}\n",
         'vec<N>,uvec<N>': "function(me,you) { return this['vecN,vecN'](me,you); }\n",
         'uvec<N>,uvec<N>': "function(me,you) { return this['vecN,vecN'](me,you); }\n",
         'uvec<N>,ivec<N>': "function(me,you) { return this['vecN,vecN'](me,you); }\n",
         'vec<N>,ivec<N>': "function(me,you) { return this['vecN,vecN'](me,you); }\n",
         'ivec<N>,ivec<N>': "function(me,you) { return this['vecN,vecN'](me,you); }\n",
         'ivec<N>,uvec<N>': "function(me,you) { return this['vecN,vecN'](me,you); }\n"
      },
      add: {
         $op: '+',
         _add: "function(me,you) {\n" +
         "   return (this.GLM.$to_array(me).map(function(v,_) { return v + you[_]; }));\n" +
         "}\n",
         'vec<N>,float': "function(me,you) { return new this.GLM.vecN(this._add(me,[you,you,you,you])); }\n",
         'vec<N>,vec<N>': "function(me,you) { return new this.GLM.vecN(this._add(me,you)); }\n",
         'vec<N>,uvec<N>': "function(me,you) { return new this.GLM.vecN(this._add(me,you)); }\n",
         'uvec<N>,uvec<N>': "function(me,you) { return new this.GLM.uvecN(this._add(me,you)); }\n",
         'uvec<N>,ivec<N>': "function(me,you) { return new this.GLM.uvecN(this._add(me,you)); }\n",
         'vec<N>,ivec<N>': "function(me,you) { return new this.GLM.vecN(this._add(me,you)); }\n",
         'ivec<N>,ivec<N>': "function(me,you) { return new this.GLM.ivecN(this._add(me,you)); }\n",
         'ivec<N>,uvec<N>': "function(me,you) { return new this.GLM.ivecN(this._add(me,you)); }\n"
      },
      add_eq: {
         $op: '+=',
         'vec<N>,vec<N>': "function(me,you) {\n" +
         "    var a = me.elements, b = you.elements;\n" +
         "    for(var i=0; i < N; i++)\n" +
         "        a[i] = a[i] + b[i];\n" +
         "    return me;\n" +
         "  //this.GLM.$to_array(me).map(function(v,_) { return me.elements[_] = v + you[_]; });\n" +
         "}\n",
         'vec<N>,uvec<N>': "function(me,you) { return this['vecN,vecN'](me,you); }\n",
         'uvec<N>,uvec<N>': "function(me,you) { return this['vecN,vecN'](me,you); }\n",
         'uvec<N>,ivec<N>': "function(me,you) { return this['vecN,vecN'](me,you); }\n",
         'vec<N>,ivec<N>': "function(me,you) { return this['vecN,vecN'](me,you); }\n",
         'ivec<N>,ivec<N>': "function(me,you) { return this['vecN,vecN'](me,you); }\n",
         'ivec<N>,uvec<N>': "function(me,you) { return this['vecN,vecN'](me,you); }\n"
      },
      div: {
         $op: '/',
         'vec<N>,float': "function(me, k) {\n" +
         "   return new this.GLM.vecN(\n" +
         "      this.GLM.$to_array(me).map(function(v,_) { return v / k; })\n" +
         "   );\n" +
         "}\n"
      },
      div_eq: {
         $op: '/=',
         'vec<N>,float': "function(me, k) {\n" +
         "   for(var i=0; i < N ; i++)\n" +
         "     me.elements[i] /= k;\n" +
         "   return me;\n" +
         "}\n"
      },
      mul: {
         $op: '*',
         'vec<N>,vec<N>': "function(me, you) {\n" +
         "   return new this.GLM.vecN(\n" +
         "       this.GLM.$to_array(me).map(function(v,_) { return v  * you[_]; })\n" +
         "   );\n" +
         "}\n"
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
      )('function epsilonEqualAB(a,b) { return this.GLM.all(this.GLM.epsilonEqual(a,b,this.GLM.epsilon())); }'),
      eql: (
         function(equal) {
            return {
               $op: '==',
               'mat<N>,mat<N>': "function(me,you) {\n" +
               "   return you.elements.length === glm.$to_array(me)\n" +
               "      .filter(function(v,_) { return v === you.elements[_]; }).length;\n" +
               "}\n",
               'vec<N>,vec<N>': equal,
               'quat,quat': equal,
               'uvec<N>,uvec<N>': equal,
               'ivec<N>,ivec<N>': equal,
               'bvec<N>,bvec<N>': equal
            };
         }
      )('function equalAB(a,b) { return GLM.all(GLM.equal(a,b)); }')
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
      'undefined0': "function() { return [0,0]; }",
      'number1': "function(x) {\n" +
      "   return [x,x];\n" +
      "}\n",
      'number2': "function(x,y) {\n" +
      "   return [x,y];\n" +
      "}\n",
      'object1': "function(o) {\n" +
      "   if (o!==null)\n" +
      "   switch(o.length){\n" +
      "   case 4: // vec4 -> vec2 reduction\n" +
      "   case 3: // vec3 -> vec2 reduction\n" +
      "   case 2: return [o[0], o[1]];\n" +
      "   default:\n" +
      "         if ('y' in o && 'x' in o) {\n" +
      "            if (typeof o.x !== typeof o.y)\n" +
      "               throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.vec2: '+o);\n" +
      "            if (typeof o.x === 'string') // coerce into numbers\n" +
      "               return [o.x*1, o.y*1];\n" +
      "            return [o.x, o.y];\n" +
      "         }\n" +
      "   }\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.vec2: '+o);\n" +
      "}\n"
   }); // GLM.vec2.$
// ----------------------------------------------------------------------------
GLM.uvec2 = GLM.$template.GLMType(
   'uvec2',
   {
      name: 'uvec2',
      identity: [0,0],
      components: [ 'xy', '01' ],
      _clamp: function(x) { return ~~x; }, // match observed GLM C++ behavior
      'undefined0': "function() { return [0,0]; }\n",
      'number1': "function(x) {\n" +
      "   x=~~x;\n" +
      "   return [x,x];\n" +
      "}\n",
      'number2': "function(x,y) {\n" +
      "   x=~~x;\n" +
      "   y=~~y;\n" +
      "   return [x,y];\n" +
      "}\n",
      'object1': "function(o) {\n" +
      "   switch(o.length){\n" +
      "   case 4: // vec4 -> vec2 reduction\n" +
      "   case 3: // vec3 -> vec2 reduction\n" +
      "   case 2: return [o[0], o[1]].map(function(x) { return ~~x; });\n" +
      "   default:\n" +
      "         if ('y' in o && 'x' in o) {\n" +
      "            if (typeof o.x !== typeof o.y) throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.uvec2: '+o);\n" +
      "            return [o.x, o.y].map(function(x) { return ~~x; });\n" +
      "         }\n" +
      "   }\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.uvec2: '+o);\n" +
      "}\n"
   }); // GLM.uvec2.$

// ----------------------------------------------------------------------------
GLM.vec3 = GLM.$template.GLMType(
   'vec3',
   {
      name: 'fvec3',
      identity: [0,0,0],
      components: [ 'xyz', '012', 'rgb' ],
      'undefined0': "function() { return GLM.vec3.$.identity; }\n",
      'number1': "function(x) {\n" +
      "   return [x,x,x];\n" +
      "}\n",
      'number2': "function(x,y) {\n" +
      "   return [x,y,y];\n" +
      "}\n",
      'number3': "function(x,y,z) {\n" +
      "   return [x,y,z];\n" +
      "}\n",
       Error: GLM.GLMJSError,
      'object1': "function(o) {\n" +
      "   if (o) {\n" +
      "      switch(o.length){\n" +
      "      case 4: // vec4 -> vec3 reduction\n" +
      "      case 3: return [o[0], o[1], o[2]];\n" +
      "      case 2: return [o[0], o[1], o[1]];\n" +
      "      default:\n" +
      "            if ('z' in o /*&& 'y' in o*/ && 'x' in o) {\n" +
      "               if (typeof o.x !== typeof o.y)\n" +
      "                  throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.vec3: '+o);\n" +
      "               if (typeof o.x === 'string') // coerce into numbers\n" +
      "                  return [o.x*1, o.y*1, o.z*1];\n" +
      "               return [o.x, o.y, o.z];\n" +
      "            }\n" +
      "      }\n" +
      "   }\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.vec3: '+o);\n" +
      "}\n",
      'object2': "function(o,z) {\n" +
      "   if (o instanceof GLM.vec2 || o instanceof GLM.uvec2 || o instanceof GLM.ivec2 || o instanceof GLM.bvec2)\n" +
      "      return [o.x, o.y, z];\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.vec3(o,z): '+[o,z]);\n" +
      "}\n"
   }); // GLM.vec3.$

// ----------------------------------------------------------------------------
GLM.uvec3 = GLM.$template.GLMType(
   'uvec3',
   {
      name: 'uvec3',
      identity: [0,0,0],
      components: [ 'xyz', '012' ],
      _clamp: GLM.uvec2.$._clamp,
      'undefined0': "function() { return [0,0,0]; }\n",
      'number1': "function(x) {\n" +
      "   x=GLM.uvec2.$._clamp(x);\n" +
      "   return [x,x,x];\n" +
      "}\n",
      'number2': "function(x,y) {\n" +
      "   x=GLM.uvec2.$._clamp(x);\n" +
      "   y=GLM.uvec2.$._clamp(y);\n" +
      "   return [x,y,y];\n" +
      "}\n",
      'number3': "function(x,y,z) {\n" +
      "   x=GLM.uvec2.$._clamp(x);\n" +
      "   y=GLM.uvec2.$._clamp(y);\n" +
      "   z=GLM.uvec2.$._clamp(z);\n" +
      "   return [x,y,z];\n" +
      "}\n",
      'object1': "function(o) {\n" +
      "   if (o) {\n" +
      "      switch(o.length){\n" +
      "      case 4: // vec4 -> vec3 reduction\n" +
      "      case 3: return [o[0], o[1], o[2]].map(GLM.uvec2.$._clamp);\n" +
      "      case 2: return [o[0], o[1], o[1]].map(GLM.uvec2.$._clamp);\n" +
      "      default:\n" +
      "            if ('z' in o /*&& 'y' in o*/ && 'x' in o) {\n" +
      "               if (typeof o.x !== typeof o.y)\n" +
      "                  throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.uvec3: '+o);\n" +
      "               return [o.x, o.y, o.z].map(GLM.uvec2.$._clamp);\n" +
      "            }\n" +
      "      }\n" +
      "   }\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.uvec3: '+o);\n" +
      "}\n",
      'object2': "function(o,z) {\n" +
      "   if (o instanceof GLM.vec2)\n" +
      "      return [o.x, o.y, z].map(GLM.uvec2.$._clamp);\n" +
      "   if (o instanceof GLM.uvec2 || o instanceof GLM.ivec2 || o instanceof GLM.bvec2)\n" +
      "      return [o.x, o.y, GLM.uvec2.$._clamp(z)];\n" +
      "\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.uvec3(o,z): '+[o,z]);\n" +
      "}\n"
   }); // GLM.uvec3.$

// ----------------------------------------------------------------------------

GLM.vec4 = GLM.$template.GLMType(
   'vec4',
   {
      name: 'fvec4',
      identity: [0,0,0,0],
      components: ['xyzw','0123','rgba'],
      'undefined0': "function() { return [0,0,0,0]; }\n",
      'number1': "function(x) {\n" +
      "   return [x,x,x,x];\n" +
      "}\n",
      'number2': "function(x,y) {\n" +
      "   return [x,y,y,y];\n" +
      "}\n",
      'number3': "function(x,y,z) {\n" +
      "   return [x,y,z,z];\n" +
      "}\n",
      'number4': "function(x,y,z,w) {\n" +
      "   return [x,y,z,w];\n" +
      "}\n",
      Error: GLM.GLMJSError,
      'object1': "function(o) {\n" +
      "   if (o) {\n" +
      "      switch(o.length){\n" +
      "      case 4: return [o[0], o[1], o[2], o[3]];\n" +
      "      case 3: return [o[0], o[1], o[2], o[2]];\n" +
      "      case 2: return [o[0], o[1], o[1], o[1]];\n" +
      "      default:\n" +
      "            if ('w' in o /*&& 'z' in o && 'y' in o*/ && 'x' in o)  {\n" +
      "               if (typeof o.x !== typeof o.w)\n" +
      "                  throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.vec4: '+o);\n" +
      "               if (typeof o.x === 'string') // coerce into numbers\n" +
      "                  return [o.x*1, o.y*1, o.z*1, o.w*1];\n" +
      "               return [o.x, o.y, o.z, o.w];\n" +
      "            }\n" +
      "      }\n" +
      "   }\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.vec4: '+[o,o&&o.$type]);\n" +
      "}\n",
      $GLM: GLM,
      'object2': "function(o,w) {\n" +
      "   if (o instanceof GLM.vec3 || o instanceof GLM.uvec3 || o instanceof GLM.ivec3 || o instanceof GLM.bvec3)\n" +
      "      return [o.x, o.y, o.z, w];\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.vec4(o,w): '+[o,w]);\n" +
      "}\n",
      'object3': "function(o,z,w) {\n" +
      "   if (o instanceof GLM.vec2 || o instanceof GLM.uvec2 || o instanceof GLM.ivec2 || o instanceof GLM.bvec2)\n" +
      "      return [o.x, o.y, z, w];\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.vec4(o,z,w): '+[o,z,w]);\n" +
      "}\n"
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
      'undefined0': "function() { return [0,0,0,0]; }\n",
      'number1': "function(x) {\n" +
      "   x=GLM.uvec2.$._clamp(x);\n" +
      "   return [x,x,x,x];\n" +
      "}\n",
      'number2': "function(x,y) {\n" +
      "   x=GLM.uvec2.$._clamp(x);\n" +
      "   y=GLM.uvec2.$._clamp(y);\n" +
      "   return [x,y,y,y];\n" +
      "}\n",
      'number3': "function(x,y,z) {\n" +
      "   x=GLM.uvec2.$._clamp(x);\n" +
      "   y=GLM.uvec2.$._clamp(y);\n" +
      "   z=GLM.uvec2.$._clamp(z);\n" +
      "   return [x,y,z,z];\n" +
      "}\n",
      'number4': "function(x,y,z,w) {\n" +
      "   return [x,y,z,w].map(GLM.uvec2.$._clamp);\n" +
      "}\n",
      Error: GLM.GLMJSError,
      'object1': "function(o) {\n" +
      "   if (o) {\n" +
      "      switch(o.length){\n" +
      "      case 4: return [o[0], o[1], o[2], o[3]].map(GLM.uvec2.$._clamp);\n" +
      "      case 3: return [o[0], o[1], o[2], o[2]].map(GLM.uvec2.$._clamp);\n" +
      "      case 2: return [o[0], o[1], o[1], o[1]].map(GLM.uvec2.$._clamp);\n" +
      "      default:\n" +
      "            if ('w' in o /*&& 'z' in o && 'y' in o*/ && 'x' in o) {\n" +
      "               if (typeof o.x !== typeof o.y)\n" +
      "                  throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.uvec4: '+o);\n" +
      "               return [o.x, o.y, o.z, o.w].map(GLM.uvec2.$._clamp);\n" +
      "            }\n" +
      "      }\n" +
      "   }\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.uvec4: '+[o,o&&o.$type]);\n" +
      "}\n",
      'object2': "function(o,w) {\n" +
      "   if (o instanceof GLM.vec3)\n" +
      "      return [o.x, o.y, o.z, w].map(GLM.uvec2.$._clamp);\n" +
      "   if (o instanceof GLM.uvec3 || o instanceof GLM.ivec3 || o instanceof GLM.bvec3)\n" +
      "      return [o.x, o.y, o.z, GLM.uvec2.$._clamp(w)];\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.uvec4(o,w): '+[o,w]);\n" +
      "}\n",
      'object3': "function(o,z,w) {\n" +
      "   if (o instanceof GLM.vec2)\n" +
      "      return [o.x, o.y, z, w].map(GLM.uvec2.$._clamp);\n" +
      "   if (o instanceof GLM.uvec2 || o instanceof GLM.ivec2 || o instanceof GLM.bvec2)\n" +
      "      return [o.x, o.y, GLM.uvec2.$._clamp(z), GLM.uvec2.$._clamp(w)];\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.uvec4(o,z,w): '+[o,z,w]);\n" +
      "}\n"
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
      'undefined0' : "function(M) { return [1, 0, 0, 0, 1, 0, 0, 0, 1]; }\n",
      'number1': "function(n) {\n" +
      "   if (n === 1) {\n" +
      "      return [1, 0, 0, 0, 1, 0, 0, 0, 1];\n" +
      "   }\n" +
      "   return [n, 0, 0,\n" +
      "           0, n, 0,\n" +
      "           0, 0, n];\n" +
      "}\n",
      'number9': "function(\n" +
      "   c1r1, c1r2, c1r3,\n" +
      "   c2r1, c2r2, c2r3,\n" +
      "   c3r1, c3r2, c3r3\n" +
      ") {\n" +
      "   return arguments;\n" +
      "}\n",
      Error: GLM.GLMJSError,
      $vec3: GLM.vec3,
      'object1': "function(o) {\n" +
      "   if (o) {\n" +
      "      var m4 = o.elements || o;\n" +
      "      if (m4.length === 16) {\n" +
      "         return [ // mat4 -> mat3\n" +
      "            m4[0+0], m4[0+1], m4[0+2],\n" +
      "            m4[4+0], m4[4+1], m4[4+2],\n" +
      "            m4[8+0], m4[8+1], m4[8+2]\n" +
      "         ];\n" +
      "      }\n" +
      "      if (m4.length === 9)\n" +
      "         return m4;\n" +
      "      // JSON-encoded objects may arrive this way: {'0':{'x': ...\n" +
      "      if (0 in m4 && 1 in m4 && 2 in m4  &&\n" +
      "          !(3 in m4) && typeof m4[2] === 'object' )\n" +
      "         return [\n" +
      "            m4[0],m4[1],m4[2]\n" +
      "         ].map(GLM.vec3.$.object1)\n" +
      "          .reduce(function(a,b) { return a.concat(b); });\n" +
      "   }\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.mat3: '+o);\n" +
      "}\n",
      'object3': "function(c1,c2,c3) {\n" +
      "   return [c1,c2,c3].map(glm.$to_array)\n" +
      "      .reduce(function(a,b) { return a.concat(b); });\n" +
      "}\n"

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
      'undefined0' : "function() { return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; }\n",
      'number16': "function(\n" +
      "   c1r1, c1r2, c1r3, c1r4,\n" +
      "   c2r1, c2r2, c2r3, c2r4,\n" +
      "   c3r1, c3r2, c3r3, c3r4,\n" +
      "   c4r1, c4r2, c4r3, c4r4\n" +
      ") {\n" +
      "   return arguments;\n" +
      "}\n",
      'number1' : "function(n) {\n" +
      "   if (n === 1)\n" +
      "      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];\n" +
      "   return [n, 0, 0, 0,\n" +
      "           0, n, 0, 0,\n" +
      "           0, 0, n, 0,\n" +
      "           0, 0, 0, n];\n" +
      "}\n",
      Error: GLM.GLMJSError,
      $vec4: GLM.vec4,
      'object1' : "function(o) {\n" +
      "   var m4;\n" +
      "   if (o) {\n" +
      "      m4 = o.elements || o;\n" +
      "      if (m4.length === 9) {\n" +
      "         // mat3 -> mat4\n" +
      "         return [\n" +
      "            m4[0+0], m4[0+1], m4[0+2], 0,\n" +
      "            m4[3+0], m4[3+1], m4[3+2], 0,\n" +
      "            m4[6+0], m4[6+1], m4[6+2], 0,\n" +
      "            0      , 0      , 0      , 1\n" +
      "         ];\n" +
      "      }\n" +
      "      if (m4.length === 4 && m4[0] && m4[0].length === 4) {\n" +
      "         return m4[0].concat(m4[1],m4[2],m4[3]);\n" +
      "      }\n" +
      "      if (m4.length === 16)\n" +
      "         return m4;\n" +
      "      \n" +
      "      // JSON-encoded objects may arrive this way: {'0':{'x': ...\n" +
      "      if (0 in m4 && 1 in m4 && 2 in m4 && 3 in m4 &&\n" +
      "          !(4 in m4) && typeof m4[3] === 'object' )\n" +
      "         return [\n" +
      "            m4[0],m4[1],m4[2],m4[3]\n" +
      "         ].map(GLM.vec4.$.object1)\n" +
      "          .reduce(function(a,b) { return a.concat(b); });\n" +
      "   }\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.mat4: '+[o,m4&&m4.length]);\n" +
      "}\n",
      'object4': "function(c1,c2,c3,c4) {\n" +
      "   return [c1,c2,c3,c4].map(glm.$to_array)\n" +
      "      .reduce(function(a,b) { return a.concat(b); });\n" +
      "}\n"

   }); // GLM.mat4.$


// ----------------------------------------------------------------------------

GLM.quat = GLM.$template.GLMType(
   'quat',
   {
      identity: [0,0,0,1],
      components: ['xyzw','0123'],
      'undefined0': "function() { return [0,0,0,1]; }\n",
      'number1': "function(w) {\n" +
      "   if (w !== 1)\n" +
      "      throw new Error('only quat(1) syntax supported for quat(number1 args)...');\n" +
      "   return [0,0,0,1];\n" +
      "}\n",
      'number4': "function(w,x,y,z) {\n" +
      "   return [x,y,z,w];\n" +
      "}\n",
      $GLM: GLM,
      $M3: GLM.mat3(),
      $quat_array_from_zyx: "function(o) {\n" +
      "   //TODO: optimizations?\n" +
      "   //var q = GLM.quat();\n" +
      "   var M3 = GLM.mat3();\n" +
      "    return (\n" +
      "           GLM.$outer.quat_angleAxis(o.z, M3[2])\n" +
      "      .mul(GLM.$outer.quat_angleAxis(o.y, M3[1]))\n" +
      "      .mul($GLM.$outer.quat_angleAxis(o.x, M3[0]))\n" +
      "    ).elements;\n" +
      "}\n",
      'object1': "function(o) {\n" +
      "   if (o) {\n" +
      "      if (o instanceof GLM.mat4)\n" +
      "         return GLM.$outer.quat_array_from_mat4(o);\n" +
      "      if (o.length === 4)\n" +
      "         return [o[0], o[1], o[2], o[3]];\n" +
      "      if (o instanceof GLM.quat)\n" +
      "         return [o.x, o.y, o.z, o.w];\n" +
      "      if (o instanceof GLM.vec3)\n" +
      "          return (\n" +
      "function(o) {\n" +
      "   //TODO: optimizations?\n" +
      "   //var q = GLM.quat();\n" +
      "   var M3 = GLM.mat3();\n" +
      "    return (\n" +
      "           GLM.$outer.quat_angleAxis(o.z, M3[2])\n" +
      "      .mul(GLM.$outer.quat_angleAxis(o.y, M3[1]))\n" +
      "      .mul($GLM.$outer.quat_angleAxis(o.x, M3[0]))\n" +
      "    ).elements;\n" +
      "}\n" +
      "                 )(o);\n" +
      "      if ('w' in o && 'x' in o) {\n" +
      "         if (typeof o.x === 'string') // coerce into numbers\n" +
      "            return [o.x*1, o.y*1, o.z*1, o.w*1];\n" +
      "         return [o.x, o.y, o.z, o.w];\n" +
      "      }\n" +
      "   }\n" +
      "   throw new GLM.GLMJSError('unrecognized object passed to GLM.quat.object1: '+[o,o&&o.$type, typeof o, o&&o.constructor]);\n" +
      "}\n"
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
          var $subarray = GLM.$subarray;
          do {
             (function(p,vn,n) {
                 if (vn === 'quat') vn = 'vec'+n;
                 var glmtype = GLM[vn];
                 def(p, {
                        enumerable: false,
                        get: function getter() { return new glmtype($subarray(this.elements,0*n,(0+1)*n)); },//this.elements.subarray(0*n,(0+1)*n)); },
                        set: function setter(val) { return new glmtype($subarray(this.elements,0*n,(0+1)*n))['='](val); }
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
            wxz: {
                enumerable: false,
                get: function() { return new GLM.vec3(this.w,this.x,this.z); },
                set: function(v) { v=GLM.vec3(v); this.w = v[0]; this.x = v[1]; this.z = v[2]; return this; }
            },
            xyw: {
                enumerable: false,
                get: function() { return new GLM.vec3(this.x,this.y,this.w); },
                set: function(v) { v=GLM.vec3(v); this.x = v[0]; this.y = v[1]; this.w = v[2]; return this; }
            },
            xzw: {
                enumerable: false,
                get: function() { return new GLM.vec3(this.x,this.z,this.w); },
                set: function(v) { v=GLM.vec3(v); this.x = v[0]; this.z = v[1]; this.w = v[2]; }
            },
            wxyz: {
                enumerable: false,
                get: function() { return new GLM.vec4(this.w,this.x,this.y,this.z); },
                set: function(v) { v=GLM.vec4(v); this.w = v[0]; this.x = v[1]; this.y = v[2]; this.z = v[3]; return this; }
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
                        if(!(v.elements === t)) throw new GLM.GLMJSError("v.elements !== t "+[GLM.$subarray, v.elements.constructor=== t.constructor, v.elements.buffer === t.buffer])
                        //if(!(v.elements === t)) throw new GLM.GLMJSError("v.elements !== t");
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

    //GLM.$outer.vec3_eulerAngles = GLM.$outer.vec3_eulerAngles || GLM.$outer._vec3_eulerAngles;
    //GLM.eulerAngles = GLM.$outer.vec3_eulerAngles.bind(GLM.$outer);
    GLM.toMat4 = (function(mat4, outer) { return function toMat4(q) { return new mat4(outer.mat4_array_from_quat(q)); } })(GLM.mat4, GLM.$outer);

    GLM.$template.extend(GLM.rotation.$template, {
        $quat: GLM.quat,
        $dot: GLM.dot.link('vec3,vec3'),
        $epsilon: GLM.epsilon(),
        $m: GLM.mat3(),
        $pi: GLM.pi(),
        $length2: GLM.length2.link('vec3'),
        $cross: GLM.cross.link('vec3,vec3'),
        $normalize: GLM.normalize.link('vec3'),
        $angleAxis: GLM.angleAxis.link('float,vec3'),
        $sqrt: GLM.sqrt
    });

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

/** TODO: Compile GLM.$outer.functions? */

//try { module.exports = GLM; } catch(e) {}
