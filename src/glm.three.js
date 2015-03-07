// ----------------------------------------------------------------------------
// three.js GLM math adapter
// copyright(c) 2015 humbletim
// https://github.com/humbletim/glm-js
// MIT LICENSE
// ----------------------------------------------------------------------------

if (typeof THREE === 'undefined')
   throw new Error('this adapter requires THREE to be availed...');

THREE.exists;

glm = GLM;

//throw new glm.GLMJSError(glm.degrees(5));
var DLL = {
   vendor_name: "three.js",
   vendor_version: THREE.REVISION,
   
   _name: 'glm.three.js',
   _version: '0.0.1',

   prefix: 'glm-js[three]: '
};
   
DLL.statics = {
   //          degrees: function(n) { return THREE.Math.radToDeg(n); },
   //          radians: function(n) { return THREE.Math.degToRad(n); },
   $mat4: new THREE.Matrix4(),
   mat4_perspective: function(fov, aspect, near, far) {
      fov = glm.degrees(fov);
      return glm.make_mat4(
         this.$mat4.makePerspective( fov, aspect, near, far ).elements
      );
   }, 
   mat4_angleAxis: function(theta, axis) {
      return glm.make_mat4(
         this.$mat4.makeRotationAxis(axis,theta).elements
      );
   },
   quat_angleAxis: function(angle, axis) {
      return new glm.quat(
         this.$quat.setFromAxisAngle(glm.normalize(axis), angle)
      );
   },
   mat4_translation: function(v) {
      return glm.make_mat4(
         this.$mat4.makeTranslation(v.x,v.y,v.z).elements
      );
   },
   mat4_scale: function(v) {
      return glm.make_mat4(
         this.$mat4.makeScale(v.x,v.y,v.z).elements
      );
   },
   $euler: new THREE.Euler(),
   vec3_eulerAngles: function(q) {
      return new glm.vec3(this.$euler.setFromQuaternion(q, 'ZYX'));
   },
   mat4_array_from_quat: function(q) {
      return this.$mat4.makeRotationFromQuaternion(q).elements;
   },
   $quat: new THREE.Quaternion(),
   quat_array_from_mat4: function(o) {
      return this.$quat.setFromRotationMatrix(o).toArray();
   }
};

DLL.operations = 
   {
      'mul': {
         $op: '*',
         '$vec<N>': 'new THREE.VectorN()',
         $mat4: new THREE.Matrix4(),
         $quat: new THREE.Quaternion(),
         $quat2: new THREE.Quaternion(),
         'quat,quat': function(a,b) {
            a = this.$quat.fromArray(a.elements);
            b = this.$quat2.fromArray(b.elements);
            return new glm.quat(a.multiply(b));
         },
         'quat,vec3': function(a,b) {
            return this.$vec3.applyQuaternion.call(
               b.clone(), this.$quat.fromArray(a.elements)
            );
         },
         'vec4,quat': function(a,b) {
            return this.$vec4.applyMatrix4.call(a.clone(), glm.toMat4(b));
         },
         'vec3,quat': function(a,b) { return this['quat,vec3'](b,a); },
         '$vec<N>_multiplyScalar': 'THREE.VectorN.prototype.multiplyScalar',
         'vec<N>,float': function(a,b) {
            return this.$vecN_multiplyScalar.call(a.clone(), b);
         },
         'mat4,vec4': function(a,b) {
            return this.$vec4.applyMatrix4.call(b.clone(), a);
         },
         $mat4_multiplyMatrices: THREE.Matrix4.prototype.multiplyMatrices,
         'mat<N>,mat<N>': function(a,b) {
            // THREE has no mat3*mat3 function?
            a = new glm.mat4(a);
            b = new glm.mat4(b);
            return new glm.matN(this.$mat4_multiplyMatrices.call(a, a, b));
         }
      },
      'mul_eq': {
         $op: '*=',
         '$vec<N>_multiplyScalar': 'THREE.VectorN.prototype.multiplyScalar',
         'vec<N>,float': function(a,b) {
            return this.$vecN_multiplyScalar.call(a, b);
         },
         $mat4: new THREE.Matrix4(),
         'mat4,mat4': function(a,b) {
            return this.$mat4.multiplyMatrices.call(a, a, b);
         },
         'mat3,mat3': function(a,b) {
            // THREE has no mat3*mat3 function?
            return a.copy(
               new glm.mat3(
                  this.$mat4.multiplyMatrices(new glm.mat4(a), new glm.mat4(b))
               ));
         },

         $quat: new THREE.Quaternion(),
         $quat2: new THREE.Quaternion(),
         'quat,quat': function(a,b) {
            var A = this.$quat.fromArray(a.elements);
            b = this.$quat2.fromArray(b.elements);
            A.multiply(b);
            a.elements.set(A.toArray());
            return a;
         },
      }
   };//operations

DLL.functions = {
   mix: {
      $quat: new THREE.Quaternion(),
      $quat2: new THREE.Quaternion(),
      "quat,quat": function(a,b,rt) {
         return new glm.quat(
            this.$quat.fromArray(a.elements)
               .slerp(this.$quat2.fromArray(b.elements),rt)
         );
      }
   }
}; // functions

DLL.calculators = {
   normalize: {
      '$vec<N>': 'new THREE.VectorN()',
      'vec<N>': function(q) { 
         return new glm.vecN(this.$vecN.copy(q).normalize());
      },
      $quat: new THREE.Quaternion(),
      quat: function(q) { 
         return new glm.quat(this.$quat.fromArray(q.elements).normalize());
      },
   },
   length2: {
      '$vec<N>': 'new THREE.VectorN()',
      "vec<N>": function(v) { return this.$vecN.lengthSq.call(v); },
      $quat: new THREE.Quaternion(),
      quat: function(q) { return this.$quat.fromArray(q.elements).lengthSq(); },
   },
   length: {
      '$vec<N>': 'new THREE.VectorN()',
      "vec<N>": function(v) { return this.$vecN.length.call(v); },
      $quat: new THREE.Quaternion(),
      quat: function(q) { return this.$quat.fromArray(q.elements).length(); },
      //             vec3: function(v) { return this.$vec3.length.call(v); },
      //             vec4: function(v) { return this.$vec4.length.call(v); },
   },
   inverse: {
      $quat: new THREE.Quaternion(),
      $mat4: new THREE.Matrix4(),
      quat: function(q) { 
         //return new glm.quat(this.$quat.set(q.x,q.y,q.z,q.w).inverse());
         return new glm.quat(this.$quat.fromArray(q.elements).inverse());
      },
      mat4: function(m) { return new glm.mat4(this.$mat4.getInverse(m)); },
   },
   transpose: {
      $mat4_transpose: THREE.Matrix4.prototype.transpose,
      mat4: function(m) { return this.$mat4_transpose.call(m.clone()); },
   }
};

glm.$outer.$import(DLL);

glm.$THREE = (
   function() {
      var map = {
         g2t: GLM.$template.deNify(
            {
               'vec<N>': function(g) {
                  var t = new THREE.VectorN();
                  return t.set.apply(t, glm.$to_array(g));
               },
               'mat<N>': function(g) {
                  var t = new THREE.MatrixN();
                  return t.copy(g);//(t, glm.$to_array(g));
               },
               'quat': function(g) {
                  var t = new THREE.Quaternion();
                  return t.set.apply(t, glm.$to_array(g));
               }
            }),
         t2g: GLM.$template.deNify(
            {
               'Vector<N>': function(t) {
                  return new glm.vecN(t);
               },
               'Matrix<N>': function(t) {
                  return new glm.matN(t);
               },
               'Quaternion': function(t) {
                  return new glm.quat(t._w,t._x,t._y,t._z);
               },
               'Euler': function(t) {
                  return new glm.vec3(t);
               }
            })
      };
      function mapper(keymap, ns) {
         var _key = keymap._key = Object.keys(keymap);
         var _ref = keymap._ref = keymap._key.map(function(k) { return ns[k]; });
         return keymap.byObject = (function(ob) {
            var idx = _ref.indexOf(ob.constructor);
            if (!~idx) throw new GLM.GLMJSError("unsupported argtype for remapping (index not found): "+ob);
            var redir = this[_key[idx]];
            if (!redir) throw new GLM.GLMJSError("unsupported argtype for remapping (key not found): "+ob);
            return redir.apply(this, arguments);
                 }.bind(keymap));
      }
      return {
         $map: map,
         to_glm: mapper(map.t2g, THREE),
         from_glm: mapper(map.g2t, glm)
      };
   }
)();

try { module.exports = glm; } catch(e) {}
