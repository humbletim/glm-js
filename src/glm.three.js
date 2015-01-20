// ----------------------------------------------------------------------------
// glm.three.js math wrangler / GLM adapter
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

// temporaries
var $tmp = {
   euler: new THREE.Euler(),
   mat4: new THREE.Matrix4(),
   quat: new THREE.Quaternion()
};

glm = {
   make_mat3: function(ptr) { return new glm.mat3(ptr); },
   make_mat4: function(ptr) { return new glm.mat4(ptr); },
   make_vec2: function(ptr) { return new glm.vec2(ptr); },
   make_vec3: function(ptr) { return new glm.vec3(ptr); },
   make_vec4: function(ptr) { return new glm.vec4(ptr); },
   make_quat: function(ptr) { return new glm.quat(ptr); },

   toMat4: function(q) { return new glm.mat4(glm.mat4.$.object1(q)); },

   FAITHFUL: true, // attempt to match glm::to_string output ASCII-for-ASCII

   to_string: function(o) {
      var type = o.$type || typeof o;
      if (!glm[type])
         throw new Error('unsupported argtype to glm.to_string -'+[o,type]);
      if (glm.FAITHFUL)
         return glm[type].$.to_string(o).replace(/[\t\n]/g,'');
      return glm[type].$.to_string(o); // pretty-printed
   },

   degrees: function(o) { 
      if (o instanceof glm.vec3) {
         return new glm.vec3(o.toArray().map(THREE.Math.radToDeg));
      }
      return THREE.Math.radToDeg(o);
   },

   radians: THREE.Math.degToRad,

   rotate: function(mat, theta, axis) { 
      return new glm.mat4(mat).multiply($tmp.mat4.makeRotationAxis(axis,theta));
   },
   scale: function(mat, v) {
      return new glm.mat4(mat).multiply($tmp.mat4.makeScale(v.x,v.y,v.z));
   },
   translate: function(mat, v) {
      return new glm.mat4(mat).multiply($tmp.mat4.makeTranslation(v.x,v.y,v.z));
   },
   perspective: function(fov, aspect, near, far) {
      return new glm.mat4(new Float32Array( 16 )).makePerspective( glm.degrees(fov), aspect, near, far ); 
   },
   normalize: function(o) {
      if (o instanceof glm.quat || o instanceof THREE.Quaternion) {
         var q = new glm.quat(o);
         var v = new glm.vec4(q.elements).normalize();
         return q;
      }
      if (o instanceof glm.vec3 || o instanceof THREE.Vector3)
         return new glm.vec3(o).normalize();
      throw new Error('unsupported argtype to glm.normalize - '+o);
   },
   inverse: function(o) {
      if (o instanceof glm.quat || o instanceof THREE.Quaternion)
         return new glm.quat(o).inverse();
      if (o instanceof glm.mat4 || o instanceof THREE.Matrix4)
         return new glm.mat4(new Float32Array( 16 )).getInverse(mat);
      throw new Error('unsupported argtype to glm.inverse - '+o);
   },
   clamp: THREE.Math.clamp,
   max: function(a,b) { return Math.max(a,b); },
   min: function(a,b) { return Math.min(a,b); },
   sign: Math.sign || function(x) {
      return x > 0 ? 1 : x < 0 ? -1 : 0;
   },
   lengthSq: function(x) { return x.lengthSq(); },
   length: function(x) {
      if (x instanceof THREE.Vector4 || x instanceof THREE.Vector3 || 
          x instanceof THREE.Vector2 || x instanceof THREE.Quaternion)
         return x.length();
      throw new Error('unsupported argtype to glm.length - '+o);
   },
   eulerAngles: function(q) {
      return new glm.vec3($tmp.euler.setFromQuaternion(q, 'ZYX'));
   },
   angleAxis: function(angle, axis) {
      return new glm.quat($tmp.quat.setFromAxisAngle(glm.normalize(axis), angle));
   },
   FIXEDPRECISION: 6,
   $toString: function(prefix, what, props) {
      return [prefix,
              "(",
              props.map(function(p) { return what[p].toFixed(glm.FIXEDPRECISION); })
              .join(", "),
              ")"
             ].join("");
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
glm.vec2 = function(n) { 
   var builder = glm.vec2.$[typeof n + arguments.length];
   if (!builder) 
      throw new Error('!glm.vec2.$.'+(typeof n + arguments.length));
   if (this instanceof glm.vec2) {
      if (n instanceof Float32Array) {
         this.elements = n;
      } else {
         var set = builder.apply(glm.vec2.$, arguments);
         //console.warn(builder, set, arguments, typeof n + arguments.length);
         (this.elements = new Float32Array( 2 )).set(set);
      }
   } else {
      return new glm.vec2(builder.apply(glm.vec2.$, arguments));
   }
};
glm.vec2.prototype = new THREE.Vector2;
glm.vec2.prototype.$type = 'vec2';
glm.vec2.prototype.$typeName = 'fvec2';
glm.vec2.prototype.clone = function() { return new glm.vec2(this); };
glm.vec2.$ = {
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
      throw new Error('unrecognized object passed to glm.vec2 - '+o);
   },
   to_string: function(what) {
      return glm.$toString(what.$typeName, what, ['x','y']);
   }
}; // glm.vec2.$

// ----------------------------------------------------------------------------
glm.vec3 = function(n) { 
   var builder = glm.vec3.$[typeof n + arguments.length];
   if (!builder) 
      throw new Error('!glm.vec3.$.'+(typeof n + arguments.length));
   if (this instanceof glm.vec3) {
      if (n instanceof Float32Array) {
         this.elements = n;
      } else {
         var set = builder.apply(glm.vec3.$, arguments);
         //console.warn(builder, set, arguments, typeof n + arguments.length);
         (this.elements = new Float32Array( 3 )).set(set);
      }
   } else {
      return new glm.vec3(builder.apply(glm.vec3.$, arguments));
   }
};
glm.vec3.prototype = new THREE.Vector3;
glm.vec3.prototype.$type = 'vec3';
glm.vec3.prototype.$typeName = 'fvec3';
glm.vec3.prototype.clone = function() { return new glm.vec3(this); };
glm.vec3.$ = {
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
      throw new Error('unrecognized object passed to glm.vec3 - '+o);
   },
   //TODO: glm.vec3(glm.vec2(),2) -- 'object2'
   to_string: function(what) {
      return glm.$toString(what.$typeName, what, ['x','y','z']);
   }
}; // glm.vec3.$

// ----------------------------------------------------------------------------
glm.vec4 = function(n) { 
   var builder = glm.vec4.$[typeof n + arguments.length];
   if (!builder) 
      throw new Error('!glm.vec4.$.'+(typeof n + arguments.length));
   if (this instanceof glm.vec4) {
      if (n instanceof Float32Array) {
         this.elements = n;
      } else {
         var set = builder.apply(glm.vec4.$, arguments);
         //console.warn(this.$typeName,builder, set, arguments, typeof n + arguments.length);
         (this.elements = new Float32Array( 4 )).set(set);
      }
   } else {
      return new glm.vec4(builder.apply(glm.vec4.$, arguments));
   }
};
glm.vec4.prototype = new THREE.Vector4;
glm.vec4.prototype.$type = 'vec4';
glm.vec4.prototype.$typeName = 'fvec4';
glm.vec4.prototype.clone = function() { return new glm.vec4(this); };

glm.vec4.prototype['*'] = function(o) {
   return this.clone().multiplyScalar(o);
};
glm.vec4.prototype['*='] = function(o) {
   return this.multiplyScalar(o);
};

glm.vec4.$ = {
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
      throw new Error('unrecognized object passed to glm.vec4 - '+o);
   },
   //TODO: glm.vec4(glm.vec3(),2) -- 'object2'
   //TODO: glm.vec4(glm.vec2(),2,3) -- 'object3'
   to_string: function(what) {
      return glm.$toString(what.$typeName, what, ['x','y','z','w']);
   }
}; // glm.vec4.$

// ----------------------------------------------------------------------------
glm.mat3 = function(n) { 
   var $ = glm.mat3.$;
   var builder = $[typeof n + arguments.length];
   if (!builder) 
      throw new Error('!glm.mat3.$.'+(typeof n + arguments.length));
   if (this instanceof glm.mat3) {
      if (n instanceof Float32Array) {
         this.elements = n;
      } else {
         (this.elements = new Float32Array( 9 ))
            .set(builder.apply($, arguments));
      }
   } else {
      return new glm.mat3(builder.apply($, arguments));
   }
};
glm.mat3.prototype = new THREE.Matrix3;
glm.mat3.prototype.$type = 'mat3';
glm.mat3.prototype.$typeName = 'mat3x3';
glm.mat3.prototype.clone = function() { return new glm.mat3(this); };
//TODO: mat3 operators
glm.mat3.$ = {
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
      throw new Error('unrecognized object passed to glm.mat3 - '+o);
   },
   to_string: function(what) {
      var ret = [0,1,2]
         .map(function(_) { return what[_]; }) // into columns
         .map(function(wi) { // each column's vec3
                 return glm.$toString("\t", wi, ['x','y','z']);
              });
      return what.$typeName + '(\n'+ ret.join(", \n") +"\n)";
   }

}; // glm.mat3.$

// ----------------------------------------------------------------------------
glm.mat4 = function(n) { 
   var $ = glm.mat4.$;
   var builder = $[typeof n + arguments.length];
   if (!builder) 
      throw new Error('!glm.mat4.$.'+(typeof n + arguments.length));
   if (this instanceof glm.mat4) {
      if (n instanceof Float32Array) {
         this.elements = n;
      } else {
         (this.elements = new Float32Array( 16 ))
            .set(builder.apply($, arguments));
      }
   } else {
      return new glm.mat4(builder.apply($, arguments));
   }
};
glm.mat4.prototype = new THREE.Matrix4;

glm.mat4.prototype.$type = 'mat4';
glm.mat4.prototype.$typeName = 'mat4x4';
glm.mat4.prototype.clone = function() { return new glm.mat4(this); };

glm.mat4.prototype['*'] = function(o) {
   if (o instanceof glm.vec4)
      return o.clone().applyMatrix4(this);
   return this.clone().multiply(o);
};
glm.mat4.prototype['*='] = function(o) {
   if (o instanceof glm.vec4)
      return o.applyMatrix4(this);
   return this.multiply(o);
};

glm.mat4.$ = {
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
      if (M instanceof glm.quat || M instanceof THREE.Quaternion)
         return $tmp.mat4.makeRotationFromQuaternion(M).elements;
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
         throw new Error('unrecognized object passed to glm.mat4 - '+o);
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
}; // glm.mat4.$
   

// ----------------------------------------------------------------------------
glm.quat = function(n) { 
   var $ = glm.quat.$;
   var builder = $[typeof n + arguments.length];
   if (!builder) 
      throw new Error('!glm.quat.$.'+(typeof n + arguments.length));
   if (this instanceof glm.quat) {
      if (n instanceof Float32Array) {
         this.elements = n;
      } else {
         (this.elements = new Float32Array( 4 ))
            .set(builder.apply($, arguments));
      }
   } else {
      return new glm.quat(builder.apply($, arguments));
   }
};
glm.quat.prototype = new THREE.Quaternion;
glm.quat.prototype.$type = 'quat';
glm.quat.prototype.$typeName = 'fquat';
glm.quat.prototype.clone = function() { return new glm.quat(this); };

glm.quat.prototype['*'] = function(o) {
   if (o instanceof glm.vec3)
      return o.clone().applyQuaternion(this);
   return this.clone().multiply(o);
};
glm.quat.prototype['*='] = function(o) {
   if (o instanceof glm.vec3)
      throw new Error('inappropriate .self_eq op - quat *= vec3');
   return this.multiply(o);
};

glm.quat.$ = {
   identity: [0,0,0,1],
   'undefined0': function() { return this.identity; },
   'number4': function(w,x,y,z) {
      return [x,y,z,w];
   },
   'object1': function(o) {
      if (o instanceof glm.mat4 ||
          o instanceof THREE.Matrix4)
         return $tmp.quat.setFromRotationMatrix(o).toArray();
      if (o.length === 4)
         return o;//[o[0], o[1], o[2], o[3]];
      if (o instanceof glm.quat)
         return [o.x, o.y, o.z, o.w];
      if (o instanceof THREE.Quaternion || "_w" in o)
         return [o._x, o._y, o._z, o._w];
      if ("w" in o && "x" in o)
         return [o.x, o.y, o.z, o.w];
      throw new Error('unrecognized object passed to glm.quat - '+o);
   },
   to_string: function(what) {
      what = glm.degrees(glm.eulerAngles(what));
      return glm.$toString("<quat>"+what.$typeName, what, ['x','y','z']);
   }
}; // glm.quat.$

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
             (function(p,vn) {
                 def(p, { get: function() { return glm[vn](this); } });
              })(arr.join(""), 'vec'+arr.length);
             (function(p,vn) {
                 def(p, { get: function() { return glm[vn](this); } });
              })(arr.slice(0).reverse().join(""), 'vec'+arr.length);
          } while(arr[1] != arr.pop());
       };
    };

    rigswizzle(glm.vec2, ['x','y']);

    rigswizzle(glm.vec3, ['x','y','z']);
    rigswizzle(glm.vec3, ['r','g','b']);

    rigswizzle(glm.vec4, ['x','y','z','w']);
    rigswizzle(glm.vec4, ['r','g','b','a']);

    rigswizzle(glm.quat, ['x','y','z','w']);
    rigswizzle(glm.quat, ['_x','_y','_z','_w']); // to overrule THREE.Quaternion

    // map numeric indexes for vec2, vec3, vec4
    [2,3,4].forEach(
       function(_) {
          var vecp = glm['vec'+_];
          rigswizzle(vecp, vecp.$.identity.map(function(n,_) { return _; }));
       });
    
    // TODO: map numeric quat indexes to match with GLM's q[0] usage

    // mat4 column accessors -- eg: mat4[0] as a read/write vec4
    [0,1,2,3].forEach(
       function(_) {
          Object.defineProperty(
             glm.mat4.prototype, _, 
             { get: function() { 
                  // spidermonkey seems to need a redundant new Float32Array()
                  // .. note: node/v8 worked without this
                  var elements = new Float32Array(this.elements);
                  return new glm.vec4(elements.subarray(_*4,(_+1)*4));
               } 
             });
       });
    
    // mat3 column accessors -- eg: mat3[0] as read/write vec3
    [0,1,2].forEach(
       function(_) {
          Object.defineProperty(
             glm.mat3.prototype, _, 
             { get: function() { 
                  // TODO: verify if new Float32Array() needed like above
                  return new glm.vec3(this.elements.subarray(_*3,(_+1)*3)) 
               } 
             });
       });
    
 })(); //indexers and swizzlers

// augment metadata onto glm types
(function() {
    var szfloat = Float32Array.BYTES_PER_ELEMENT;
    for(var p in glm)
       if (typeof glm[p] === 'function' && "$" in glm[p]) {
          glm[p].componentLength = glm[p].$.identity.length;
          glm[p].byteLength = glm[p].componentLength * szfloat;
          glm[p].prototype.toString = function() {
             return glm[this.$type].$.to_string(this);
          };

          // provide something like a "memory" address (to help with debugging)
          Object.defineProperty(
             glm[p].prototype, 'address', {
                get: function() {
                   var r = this.elements.byteOffset.toString(16);
                   return "0x00000000".substr(0,10-r.length)+r;
                }});
       }
 })();

glm.$dumpTypes = function(out) {
   for(var p in glm) 
      if (glm[p].componentLength) {
         out("glm."+p, JSON.stringify(
                { 
                   '#type': glm[p].prototype.$typeName,
                   '#floats': glm[p].componentLength,
                   '#bytes': glm[p].byteLength
                }));
      }
};

try { module.exports = glm; } catch(e) {}
