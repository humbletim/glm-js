// ----------------------------------------------------------------------------
// glMatrix GLM math adapter
// copyright(c) 2015 humbletim
// https://github.com/humbletim/glm-js
// MIT LICENSE
// ----------------------------------------------------------------------------

try {
   GLMAT.exists;
} catch(e) {
   try {
      GLMAT = exports;
   } catch(e) {
      GLMAT = this;
      GLMAT.mat4.exists;
   }
}

var glm = GLM;

var DLL = {
   _version: '0.0.0',
   _name: 'glm.gl-matrix.js',
   _glm_version: glm.version,
   vendor_version: GLMAT.VERSION,
   vendor_name: "glMatrix"
};
   
console.warn("... glm-js: DLL: ", JSON.stringify(DLL));

if (!glm.$template)
   throw new Error('glm-js: bring glm.$template in first (from glm.common.js)');

glm.$intern(
   {
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
      // mat4_scale: function(v) {
      // },
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
      quat_array_from_mat4: function(o) {
         var m3 = GLMAT.mat3.fromMat4(new Float32Array(9), o.elements);
         return GLMAT.quat.fromMat3(new Float32Array(4), m3);
      }
   });

glm.$template.operations(
   {
      'mul': {
         op: '*',
         'quat,vec3': function(a,b) {
            return new glm.vec3(
               GLMAT.vec3.transformQuat(new Float32Array(3), 
                                        b.elements, a.elements)
            );
         },
         'vec3,quat': function(a,b) { return this['quat,vec3'](b,a); },
         'vec4,quat': function(a,b) {
            return new glm.vec4(this['quat,vec3'](b,a), 1);
//                GLMAT.vec3.transformQuat(new Float32Array(3), 
//                                         a.elements, b.elements),
//                1 // glMatrix doesn't set .w appropriately; so return vec4(vec3*quat,1)
//             );
         },
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
         'mat4,mat4': function(a,b) {
            return new glm.mat4(
               GLMAT.mat4.mul(new Float32Array(16), 
                              a.elements, b.elements)
            );
         }
      },
      'mul_eq': {
         op: '*=',
         'mat4,mat4': function(a,b) {
            GLMAT.mat4.multiply(a.elements,a.elements,b.elements);
            return a;
         },
         'vec<N>,float': function(a,b) {
            return GLMAT.vecN.scale(a,a,b);
         }
      }
   });

glm.$template.functions(
   {
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
         vec3: function(v) { return GLMAT.vec3.length(v.elements); },
         'vec<N>': function(v) { return GLMAT.vecN.length(v.elements); }
      },
      inverse: {
         quat: function(q) { 
            return new glm.quat(
               GLMAT.quat.invert(new Float32Array(4), q.elements)
            );
         },
         mat4: function(m) { 
            return new glm.mat4(
               GLMAT.mat4.invert(new Float32Array(16), m.elements)
            );
         }
      },
      transpose: {
         mat4: function(m) { 
            return new glm.mat4(
               GLMAT.mat4.transpose(new Float32Array(16), m.elements)
            );
         }
      }
   });

glm.init(DLL, 'glm-js[glMatrix]: ');

try { module.exports = glm; } catch(e) {}
