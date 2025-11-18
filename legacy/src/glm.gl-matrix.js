// ----------------------------------------------------------------------------
// glMatrix GLM math adapter
// copyright(c) 2015 humbletim
// https://github.com/humbletim/glm-js
// MIT LICENSE
// ----------------------------------------------------------------------------

GLMAT.mat4.exists;

glm = GLM;

var DLL = {
   _version: '0.0.2',
   _name: 'glm.gl-matrix.js',
   _glm_version: glm.version,
   prefix: 'glm-js[glMatrix]: ',

   vendor_version: GLMAT.VERSION,
   vendor_name: "glMatrix"
};

DLL['statics'] = {
   $outer: GLM.$outer,
   $typeArray: function(n) { return new this.$outer.Float32Array(n); },
   $mat4: GLM.mat4,
   $quat: GLM.quat,
   $mat4$perspective: GLMAT.mat4.perspective,
   $mat4$ortho: GLMAT.mat4.ortho,
   mat4_perspective: function(fov, aspect, near, far) {
      return new this.$mat4(
         this.$mat4$perspective(this.$typeArray(16), fov, aspect, near, far)
      );
   },
   mat4_ortho: function(left, right, bottom, top, near, far) {
      near = near || -1;
      far = far || 1;
      return new this.$mat4(
         this.$mat4$ortho(this.$typeArray(16), left, right, bottom, top, near, far)
      );
   },
   $quat$setAxisAngle: GLMAT.quat.setAxisAngle,
   $mat4$fromQuat: GLMAT.mat4.fromQuat,
   mat4_angleAxis: function(theta, axis) {
      var Q = this.$quat$setAxisAngle(this.$typeArray(4), axis, theta);
      return new this.$mat4(this.$mat4$fromQuat(this.$typeArray(16), Q));
   },
   quat_angleAxis: function(angle, axis) {
      return new this.$quat(
         this.$quat$setAxisAngle(this.$typeArray(4), axis, angle)
      );
   },
   $mat4$translate: GLMAT.mat4.translate,
   mat4_translation: function(v) {
      var m = new this.$mat4;
      this.$mat4$translate(m.elements, m.elements, v.elements);
      return m;
   },
   $mat4$scale: GLMAT.mat4.scale,
   mat4_scale: function(v) {
      var m = new this.$mat4;
      this.$mat4$scale(m.elements, m.elements, v.elements);
      return m;
   },
   //$mat4$fromQuat: GLMAT.mat4.fromQuat,
   toJSON: function() {
       var ob = {};
       for(var p in this)
           0 !== p.indexOf('$') && (ob[p]=this[p]);
       return ob;
   },
   $vec3: GLM.vec3,
   $clamp: GLM.clamp,
   // vec3_eulerAngles: function(q) {
   //    // adapted from three.js
   //    var te = this.$typeArray(16);
   //    this.$mat4$fromQuat(te, q.elements);
   //    var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
   //    m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
   //    m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

   //    var thiz = new this.$vec3;
   //    thiz.y = Math.asin( - this.$clamp( m31, - 1, 1 ) );

   //    if ( Math.abs( m31 ) < 0.99999 ) {
   //  	 thiz.x = Math.atan2( m32, m33 );
   //  	 thiz.z = Math.atan2( m21, m11 );
   //    } else {
   //  	 thiz.x = 0;
   //  	 thiz.z = Math.atan2( - m12, m22 );
   //    }
   //    return thiz;
   // },
   //$mat4$fromQuat: GLMAT.mat4.fromQuat,
   mat4_array_from_quat: function(q) {
      return this.$mat4$fromQuat(this.$typeArray(16), q.elements);
   },
   $qtmp: new GLM.$outer.Float32Array(9),
   $quat$fromMat3: GLMAT.quat.fromMat3,
   $mat3$fromMat4: GLMAT.mat3.fromMat4,
   quat_array_from_mat4: function(o) {
      return this.$quat$fromMat3(this.$typeArray(4), this.$mat3$fromMat4(this.$qtmp, o.elements));
   }
}; //statics

DLL['declare<T,V,...>'] = {
   'mul': {
      $op: '*',
      $typeArray: function(N) { return new this.GLM.$outer.Float32Array(N); },
      $vec3$transformQuat: GLMAT.vec3.transformQuat,
      'quat,vec3': function(a,b) {
         return new this.GLM.vec3(
            this.$vec3$transformQuat(this.$typeArray(3),
                                     b.elements, a.elements)
         );
      },
      'vec3,quat': function(a,b) { return this['quat,vec3'](this.GLM.inverse(b),a); },
      'quat,vec4': function(a,b) { return this['mat4,vec4'](this.GLM.toMat4(a), b); },
      'vec4,quat': function(a,b) { return this['quat,vec4'](this.GLM.inverse(b),a); },
      '$vec<N>$scale': 'GLMAT.vecN.scale',
      'vec<N>,float': function(a,b) {
          return new this.GLM.vecN(
              this.$vecN$scale(this.$typeArray(N), a.elements, b)
          );
      },
      'quat,float': function(a,b) { return new (a.constructor)(this['vec4,float'](a,b).elements); },
      $vec4$transformMat4: GLMAT.vec4.transformMat4,
      'mat4,vec4': function(a,b) {
         return new GLM.vec4(
            this.$vec4$transformMat4(this.$typeArray(4),
                                     b.elements, a.elements)
         );
      },
      'vec4,mat4': function(a,b) { return this['mat4,vec4'](GLM.inverse(b),a); },
      '$mat<N>mul': 'GLMAT.matN.mul',
      'mat<N>,mat<N>': function(a,b) {
         return new (a.constructor)(
            this.$matNmul(this.$typeArray(N*N),
                           a.elements, b.elements)
         );
      },
      $quat$multiply: GLMAT.quat.multiply,
      'quat,quat': function(a,b) {
         return new (a.constructor)(this.$quat$multiply(
                                this.$typeArray(4),
                                a.elements, b.elements));
      }
   },
   'mul_eq': {
       $op: '*=',
      '$mat<N>$multiply': 'GLMAT.matN.multiply',
      'mat<N>,mat<N>': function(a,b) {
         this.$matN$multiply(a.elements,a.elements,b.elements);
         return a;
      },
      '$vec<N>$scale': 'GLMAT.vecN.scale',
      'vec<N>,float': function(a,b) {
         this.$vecN$scale(a.elements,a.elements,b);
         return a;
      },
      $quat$multiply: GLMAT.quat.multiply,
      'quat,quat': function(a,b) {
         this.$quat$multiply(
            a.elements,
            a.elements, b.elements);
         return a;
      },

      $quat$invert: GLMAT.quat.invert,
      $vec3$transformQuat: GLMAT.vec3.transformQuat,
      // note: v3 *= q; is not supported by GLM C++
      //  but v3['*='](q); seems to perform slightly-better in JS
      //  and can be used as: glm.mul_eq.link('inplace:vec3,quat')(v3,q);
      'inplace:vec3,quat': function(a,b) {
         var Q = this.$quat$invert(new this.GLM.$outer.Float32Array(4), b.elements);
         this.$vec3$transformQuat(a.elements, a.elements, Q);
         return a;
      },

      $mat4$invert: GLMAT.mat4.invert,
      $vec4$transformMat4: GLMAT.vec4.transformMat4,
      'inplace:vec4,mat4': function(a,b) {
         var M = this.$mat4$invert(new this.GLM.$outer.Float32Array(16), b.elements);
         this.$vec4$transformMat4(a.elements, a.elements, M);
         return a;
      }
   },
   cross: {
      $vec2$cross: GLMAT.vec2.cross,
      'vec2,vec2': function(a,b) {
         return new this.GLM.vec3(this.$vec2$cross( new this.GLM.$outer.Float32Array(3), a, b));
      },
      $vec3$cross: GLMAT.vec3.cross,
      'vec3,vec3': function(a,b) {
         return new this.GLM.vec3(this.$vec3$cross( new this.GLM.$outer.Float32Array(3), a, b));
      }
   },
    dot: {
      '$vec<N>$dot': 'GLMAT.vecN.dot',
      'vec<N>,vec<N>': function(a,b) {
         return this.$vecN$dot(a, b);
      }
   },
    lookAt: {
      $mat4$lookAt: GLMAT.mat4.lookAt,
      'vec3,vec3': function(eye,target,up) {
             return new this.GLM.mat4(
	          this.$mat4$lookAt(
	              new this.GLM.$outer.Float32Array(16),
	              eye.elements, target.elements, up.elements
	          ));
      }
   }
}; //operations

DLL['declare<T,V,number>'] = {
    mix: {
      $quat$slerp: GLMAT.quat.slerp,
      "quat,quat": function(a,b,rt) {
         return new GLM.quat(this.$quat$slerp(new GLM.$outer.Float32Array(4), a.elements,b.elements,rt));
      }
   }
}; //function
DLL['declare<T,V,number>'].slerp = DLL['declare<T,V,number>'].mix;

DLL['declare<T>'] = {
    normalize: {
      '$vec<N>normalize': 'GLMAT.vecN.normalize',
       $typeArray: function(N) { return new this.GLM.$outer.Float32Array(N); },
      'vec<N>': function(q) {
          return new this.GLM.vecN(
              this.$vecNnormalize(this.$typeArray(N), q)
          );
      },
      $quat$normalize: GLMAT.quat.normalize,
      quat: function(q) {
         return new this.GLM.quat(
            this.$quat$normalize(new this.GLM.$outer.Float32Array(4), q.elements)
         );
      }
   },
    length: {
      $quat$length: GLMAT.quat.length,
      quat: function(q) {  return this.$quat$length(q.elements); },
      //vec3: function(v) { return GLMAT.vec3.length(v.elements); },
      '$vec<N>$length': 'GLMAT.vecN.length',
      'vec<N>': function(v) { return this.$vecN$length(v.elements); }
   },
    length2: {
      $quat$squaredLength: GLMAT.quat.squaredLength,
      quat: function(q) {  return this.$quat$squaredLength(q.elements); },
      '$vec<N>$squaredLength': 'GLMAT.vecN.squaredLength',
      'vec<N>': function(v) { return this.$vecN$squaredLength(v.elements); }
   },

    inverse: {
      $quatinvert: GLMAT.quat.invert,
      quat: function(q) {
         return this.GLM.quat(
            this.$quatinvert(new this.GLM.$outer.Float32Array(4), q.elements)
         );
      },
      /*xmat4: function(m) {
         return glm.mat4(
            GLMAT.mat4.invert(new GLM.$outer.Float32Array(16), m.elements)
         );
         },*/
      $mat4invert: GLMAT.mat4.invert,
      mat4: function(m) {
         m=m.clone();
	 // what should happen if no determinant?
	 // (note: THREE, tdl-fast and gl-matrix all behave differently)
         if (null === this.$mat4invert(m.elements, m.elements))
	    return m['='](this.GLM.mat4()); // identity
         return m;
      }
   },
   transpose: {
      /*xmat4: function(m) {
         return glm.mat4(
            GLMAT.mat4.transpose(new GLM.$outer.Float32Array(16), m.elements)
         );
         },*/
      $mat4$transpose: GLMAT.mat4.transpose,
      mat4: function(m) {
         m=m.clone();
         this.$mat4$transpose(m.elements, m.elements);
         return m;
      }
   }
}; //calculators

glm.$outer.$import(DLL);

try { module.exports = glm; } catch(e) {}
