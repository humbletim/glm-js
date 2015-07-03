// ----------------------------------------------------------------------------
// glMatrix GLM math adapter
// copyright(c) 2015 humbletim
// https://github.com/humbletim/glm-js
// MIT LICENSE
// ----------------------------------------------------------------------------

GLMAT.mat4.exists;

glm = GLM;

var DLL = {
   _version: '0.0.1',
   _name: 'glm.gl-matrix.js',
   _glm_version: glm.version,
   prefix: 'glm-js[glMatrix]: ',

   vendor_version: GLMAT.VERSION,
   vendor_name: "glMatrix"
};
   
DLL.statics = {
   mat4_perspective: function(fov, aspect, near, far) {
      return new glm.mat4(
         GLMAT.mat4.perspective(new Float32Array(16), fov, aspect, near, far)
      );
   }, 
   mat4_angleAxis: function(theta, axis) {
      var Q = GLMAT.quat.setAxisAngle(new Float32Array(4), axis, theta);
      return new glm.mat4(GLMAT.mat4.fromQuat(new Float32Array(16), Q));
   },
   quat_angleAxis: function(angle, axis) {
      return new glm.quat(
         GLMAT.quat.setAxisAngle(new Float32Array(4), axis, angle)
      );
   },
   mat4_translation: function(v) {
      var m = new glm.mat4();
      GLMAT.mat4.translate(m.elements, m.elements, v.elements);
      return m;
   },
   mat4_scale: function(v) {
      var m = new glm.mat4();
      GLMAT.mat4.scale(m.elements, m.elements, v.elements);
      return m;
   },
   vec3_eulerAngles: function(q) {
      // adapted from three.js
      var te = new Float32Array(16);
      GLMAT.mat4.fromQuat(te, q.elements);
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
   },
   mat4_array_from_quat: function(q) {
      return GLMAT.mat4.fromQuat(new Float32Array(16), q.elements);
   },
   $qtmp: new Float32Array(9),
   quat_array_from_mat4: function(o) {
      return GLMAT.quat.fromMat3(new Float32Array(4), GLMAT.mat3.fromMat4(this.$qtmp, o.elements));
   }
}; //statics

DLL.operations = {
   'mul': {
      $op: '*',
      'quat,vec3': function(a,b) {
         return new glm.vec3(
            GLMAT.vec3.transformQuat(new Float32Array(3), 
                                     b.elements, a.elements)
         );
      },
      'vec3,quat': function(a,b) { return this['quat,vec3'](glm.inverse(b),a); },
      'quat,vec4': function(a,b) { return this['mat4,vec4'](glm.toMat4(a), b); },
      'vec4,quat': function(a,b) { return this['quat,vec4'](glm.inverse(b),a); },
      'vec<N>,float': function(a,b) {
         return new glm.vecN(
            GLMAT.vecN.scale(new Float32Array(N),
                             a.elements, b)
         );
      },
      'mat4,vec4': function(a,b) {
         return new glm.vec4(
            GLMAT.vec4.transformMat4(new Float32Array(4), 
                                     b.elements, a.elements)
         );
      },
      'vec4,mat4': function(a,b) { return this['mat4,vec4'](glm.inverse(b),a); },
      'mat<N>,mat<N>': function(a,b) {
         return new glm.matN(
            GLMAT.matN.mul(new Float32Array(N*N), 
                           a.elements, b.elements)
         );
      },
      'quat,quat': function(a,b) {
         return new glm.quat(GLMAT.quat.multiply(
                                new Float32Array(4),
                                a.elements, b.elements));
      }
   },
   'mul_eq': {
      $op: '*=',
      'mat<N>,mat<N>': function(a,b) {
         GLMAT.matN.multiply(a.elements,a.elements,b.elements);
         return a;
      },
      'vec<N>,float': function(a,b) {
         GLMAT.vecN.scale(a.elements,a.elements,b);
         return a;
      },
      'quat,quat': function(a,b) {
         GLMAT.quat.multiply(
            a.elements,
            a.elements, b.elements);
         return a;
      },

      // note: v3 *= q; is not supported by GLM C++
      //  but v3['*='](q); seems to perform slightly-better in JS
      //  and can be used as: glm.mul_eq.link('inplace:vec3,quat')(v3,q);
      'inplace:vec3,quat': function(a,b) {
         var Q = GLMAT.quat.invert(new Float32Array(4), b.elements);
         GLMAT.vec3.transformQuat(a.elements, a.elements, Q);
         return a;
      },

      'inplace:vec4,mat4': function(a,b) {
         var M = GLMAT.mat4.invert(new Float32Array(16), b.elements);
         GLMAT.vec4.transformMat4(a.elements, a.elements, M);
         return a;
      }

   }
}; //operations

DLL.functions = {
   mix: {
      "quat,quat": function(a,b,rt) {
         return new glm.quat(GLMAT.quat.slerp(new Float32Array(4), a.elements,b.elements,rt));
      }
   }
}; //function

DLL.calculators = {
   normalize: {
      'vec<N>': function(q) { 
         return new glm.vecN(
            GLMAT.vecN.normalize(new Float32Array(N), q)
         ); 
      },
      quat: function(q) { 
         return new glm.quat(
            GLMAT.quat.normalize(new Float32Array(4), q.elements)
         );
      }
   },
   length: {
      quat: function(q) {  return GLMAT.quat.length(q.elements); },
      //vec3: function(v) { return GLMAT.vec3.length(v.elements); },
      'vec<N>': function(v) { return GLMAT.vecN.length(v.elements); }
   },
   length2: {
      quat: function(q) {  return GLMAT.quat.squaredLength(q.elements); },
      'vec<N>': function(v) { return GLMAT.vecN.squaredLength(v.elements); }
   },

   inverse: {
      quat: function(q) { 
         return glm.quat(
            GLMAT.quat.invert(new Float32Array(4), q.elements)
         );
      },
      xmat4: function(m) { 
         return glm.mat4(
            GLMAT.mat4.invert(new Float32Array(16), m.elements)
         );
      },
      mat4: function(m) { 
         m=m.clone();
         GLMAT.mat4.invert(m.elements, m.elements);
         return m;
      }
   },
   transpose: {
      xmat4: function(m) { 
         return glm.mat4(
            GLMAT.mat4.transpose(new Float32Array(16), m.elements)
         );
      },
      mat4: function(m) { 
         m=m.clone();
         GLMAT.mat4.transpose(m.elements, m.elements);
         return m;
      }
   }
}; //calculators

glm.$outer.$import(DLL);

try { module.exports = glm; } catch(e) {}
