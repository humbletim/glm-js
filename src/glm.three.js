// ----------------------------------------------------------------------------
// three.js GLM math adapter
// copyright(c) 2015 humbletim
// https://github.com/humbletim/glm-js
// MIT LICENSE
// ----------------------------------------------------------------------------

try {
   THREE.exists;
} catch(e) {
   THREE = THREEMATHS;
}

var DLL = {
   _version: '0.0.0',
   _name: 'glm.three.js',
   _glm_version: glm.version,
   _vendor_version: THREE.REVISION,
   _vendor_name: "three.js"
};
   
console.warn("... glm-js: DLL: ", JSON.stringify(DLL));

if (!glm.$template)
   throw new Error('glm-js: bring glm.$template in first (from glm.common.js)');

// temporaries used during adaptations
var $tmp = {
   euler: new THREE.Euler(),
   mat4: new THREE.Matrix4(),
   quat: new THREE.Quaternion(),
   vec4: new THREE.Vector4(),
   vec3: new THREE.Vector3(),
   vec2: new THREE.Vector2()
};

glm.$intern(
   {
      degrees: function(n) { return THREE.Math.radToDeg(n); },
      radians: function(n) { return THREE.Math.degToRad(n); },
      mat4_perspective: function(fov, aspect, near, far) {
         fov = glm.degrees(fov);
         return glm.make_mat4(
            $tmp.mat4.makePerspective( fov, aspect, near, far ).elements
         );
      }, 
      mat4_angleAxis: function(theta, axis) {
         return glm.make_mat4(
            $tmp.mat4.makeRotationAxis(axis,theta).elements
         );
      },
      quat_angleAxis: function(angle, axis) {
         return new glm.quat(
            $tmp.quat.setFromAxisAngle(glm.normalize(axis), angle)
         );
      },
      mat4_translation: function(v) {
         return glm.make_mat4(
            $tmp.mat4.makeTranslation(v.x,v.y,v.z).elements
         );
      },
      mat4_scale: function(v) {
         return glm.make_mat4(
            $tmp.mat4.makeScale(v.x,v.y,v.z).elements
         );
      },
      vec3_eulerAngles: function(q) {
         return new glm.vec3($tmp.euler.setFromQuaternion(q, 'ZYX'));
      },
      mat4_array_from_quat: function(q) {
         return $tmp.mat4.makeRotationFromQuaternion(q).elements;
      },
      quat_array_from_mat4: function(o) {
         return $tmp.quat.setFromRotationMatrix(o).toArray();
      }
   });

glm.$template.binary_ops(
   {
      'mul': {
         op: '*',
         'quat,vec3': function(a,b) {
            // need $tmp.quat.copy(a) to entertain THREE.Quaternion
            return $tmp.vec3.applyQuaternion.call(b.clone(), $tmp.quat.copy(a));
         },
         'vec4,quat': function(a,b) {
            // need $tmp.quat.copy(a) to entertain THREE.Quaternion
            return $tmp.vec4.applyMatrix4.call(a.clone(), glm.toMat4(b));
         },
         'vec3,quat': function(a,b) { return this['quat,vec3'](b,a); },
         $tmp: $tmp,
         'vec<N>,float': function(a,b) {
            return this.$tmp.vecN.multiplyScalar.call(a.clone(), b);
         },
//          'vec3,float': function(a,b) {
//             return $tmp.vec3.multiplyScalar.call(a.clone(), b);
//          },
//          'vec2,float': function(a,b) {
//             return $tmp.vec2.multiplyScalar.call(a.clone(), b);
//          },
         'mat4,vec4': function(a,b) {
            return $tmp.vec4.applyMatrix4.call(b.clone(), a);
         },
         'mat4,mat4': function(a,b) {
            a = a.clone();
            return $tmp.mat4.multiplyMatrices.call(a, a, b);
         }
      },
      'mul_eq': {
         op: '*=',
         'mat4,mat4': function(a,b) {
            //a = a.clone();
            return $tmp.mat4.multiplyMatrices.call(a, a, b);
         },
         $tmp: $tmp,
         'vec<N>,float': function(a,b) {
            return this.$tmp.vecN.multiplyScalar.call(a, b);
         }
      }
   });

glm.$template.unary_ops(
   {
      normalize: {
         quat: function(q) { 
            return new glm.quat($tmp.quat.copy(q).normalize());
         },
         $tmp: $tmp,
         'vec<N>': function(q) { 
            return new glm.vecN(this.$tmp.vecN.copy(q).normalize());
         }
      },
      length: {
         quat: function(q) { return $tmp.quat.copy(q).length(); },
         $tmp: $tmp,
         "vec<N>": function(v) { return this.$tmp.vecN.length.call(v); },
         vec3: function(v) { return $tmp.vec3.length.call(v); },
         vec4: function(v) { return $tmp.vec4.length.call(v); }
      },
      inverse: {
         quat: function(q) { 
            return new glm.quat($tmp.quat.copy(q).inverse());
         },
         mat4: function(m) { return new glm.mat4($tmp.mat4.getInverse(m)); }
      },
      clamp: {
         
      }
   });

//$glm.clamp = THREE.Math.clamp;

glm.init(DLL, 'glm-js[three]: ');

try { module.exports = glm; } catch(e) {}
