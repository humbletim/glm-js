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

var DLL = {
   vendor_name: "three.js",
   vendor_version: THREE.REVISION,
   
   _name: 'glm.three.js',
   _version: '0.0.2',

   prefix: 'glm-js[three]: '
};
   
DLL['statics'] = {
   $mat4: new THREE.Matrix4(),
   mat4_perspective: function(fov, aspect, near, far) {
      fov = glm.degrees(fov);
      return new glm.mat4(
         new Float32Array(this.$mat4.makePerspective( fov, aspect, near, far ).elements)
      );
   }, 
   mat4_angleAxis: function(theta, axis) {
      return new glm.mat4(
         this.$mat4.makeRotationAxis(axis,theta)
      );
//      return glm.make_mat4(
//          this.$mat4.makeRotationAxis(axis,theta).elements
//       );
   },
   quat_angleAxis: function(angle, axis) {
      return new glm.quat(
         this.$quat.setFromAxisAngle(glm.normalize(axis), angle)
      );
   },
   mat4_translation: function(v) {
      return new glm.mat4(
         this.$mat4.makeTranslation(v.x,v.y,v.z)
      );
//       return glm.make_mat4(
//          this.$mat4.makeTranslation(v.x,v.y,v.z).elements
//       );
   },
   mat4_scale: function(v) {
      return new glm.mat4(
         this.$mat4.makeScale(v.x,v.y,v.z)
      );
//       return glm.make_mat4(
//          this.$mat4.makeScale(v.x,v.y,v.z).elements
//       );
   },
   $euler: new THREE.Euler(),
   vec3_eulerAngles: function(q) {
      return new glm.vec3(this.$euler.setFromQuaternion(q, 'ZYX'));
   },
   mat4_array_from_quat: function(q) {
      return this.$mat4.makeRotationFromQuaternion(q).toArray();
   },
   $quat: new THREE.Quaternion(),
   quat_array_from_mat4: function(o) {
      return this.$quat.setFromRotationMatrix(o).toArray();
   }
};

DLL['declare<T,V,...>'] = 
   {
      'mul': {
         $op: '*',
         '$vec<N>': 'new THREE.VectorN()',
         $quat: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
         $quat2: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
         'quat,quat': function(a,b) {
            a = this.$quat(a.elements);
            b = this.$quat2(b.elements);
            return new glm.quat(a.multiply(b));
         },
         'quat,vec3': function(a,b) {
            return this.$vec3.applyQuaternion.call(
               b.clone(), this.$quat(a.elements)
            );
         },
         'quat,vec4': function(a,b) {
            return this.$vec4.applyMatrix4.call(b.clone(), glm.toMat4(a));
         },
         'vec4,quat': function(a,b) { return this['quat,vec4'](glm.inverse(b),a); },
         'vec3,quat': function(a,b) { return this['quat,vec3'](glm.inverse(b),a); },
         '$vec<N>_multiplyScalar': 'THREE.VectorN.prototype.multiplyScalar',
         'vec<N>,float': function(a,b) {
            return this.$vecN_multiplyScalar.call(a.clone(), b);
         },
         'mat4,vec4': function(a,b) {
            return this.$vec4.applyMatrix4.call(b.clone(), a);
         },
         'vec4,mat4': function(a,b) { return this['mat4,vec4'](glm.inverse(b),a); },
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
         '$vec<N>': 'new THREE.VectorN()',
         $quat: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
         $quat2: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
         'quat,quat': function(a,b) {
            var A = this.$quat(a.elements);
            b = this.$quat2(b.elements);
            A.multiply(b);
            a.elements.set(A.toArray());
            return a;
         },

         '$vec<N>_multiplyScalar': 'THREE.VectorN.prototype.multiplyScalar',
         'vec<N>,float': function(a,b) {
            return this.$vecN_multiplyScalar.call(a, b);
         },
         $mat4_multiplyMatrices: THREE.Matrix4.prototype.multiplyMatrices,
         'mat4,mat4': function(a,b) {
            return this.$mat4_multiplyMatrices.call(a, a, b);
         },
         $mat4_copy_multiplyMatrices: THREE.Matrix4.prototype.multiplyMatrices.bind(new THREE.Matrix4()),
         'mat3,mat3': function(a,b) {
            // THREE has no mat3*mat3 function?
            return a.copy(
               new glm.mat3(
                  this.$mat4_copy_multiplyMatrices(new glm.mat4(a), new glm.mat4(b))
               ));
         },

         // note: v3 *= q; is not supported by GLM C++
         //  but v3['*='](q); seems to perform slightly-better in JS
         //  and can be used as: glm.mul_eq.link('inplace:vec3,quat')(v3,q);
         'inplace:vec3,quat': function(b,a) {
            return this.$vec3.applyQuaternion.call(
               b, this.$quat(a.elements).inverse()
            );
         },
         'inplace:vec4,mat4': function(b,a) {
            return this.$vec4.applyMatrix4.call(b, glm.inverse(a));
         }
      },
      cross: {
         $vec3_cross: THREE.Vector3.prototype.crossVectors,
         'vec3,vec3': function(a,b) {
            return this.$vec3_cross.call(glm.vec3(), a, b);
         }
      },
      dot: {
         $vec3_dot: THREE.Vector3.prototype.dot,
         'vec3,vec3': function(a,b) {
            return this.$vec3_dot.call(a, b);
         }
      },
      lookAt: {
	 $mat4_lookAt: THREE.Matrix4.prototype.lookAt,
	 'vec3,vec3': function(eye,target,up) {
	    return glm.inverse(this.$mat4_lookAt.call(glm.mat4(), eye, target, up));
	 }
      }
   };//operations

DLL['declare<T,V,number>'] = {
   mix: {
      $quat: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
      $quat2: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
      "quat,quat": function(a,b,rt) {
         return new glm.quat(
            this.$quat(a.elements)
               .slerp(this.$quat2(b.elements),rt)
         );
      }
   }
}; // functions

DLL['declare<T>'] = {
   normalize: {
      '$vec<N>': 'new THREE.VectorN()',
      'vec<N>': function(q) { 
         return new glm.vecN(this.$vecN.copy(q).normalize());
      },
      $quat: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
      quat: function(q) { 
         return new glm.quat(this.$quat(q.elements).normalize());
      },
   },
   length2: {
      '$vec<N>': 'new THREE.VectorN()',
      "vec<N>": function(v) { return this.$vecN.lengthSq.call(v); },
      $quat: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
      quat: function(q) { return this.$quat(q.elements).lengthSq(); },
   },
   length: {
      '$vec<N>': 'new THREE.VectorN()',
      "vec<N>": function(v) { return this.$vecN.length.call(v); },
      $quat: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
      quat: function(q) { return this.$quat(q.elements).length(); },
   },
   inverse: {
      $quat: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
      $mat4: new THREE.Matrix4(),
      quat: function(q) { 
         //return new glm.quat(this.$quat.set(q.x,q.y,q.z,q.w).inverse());
         return new glm.quat(this.$quat(q.elements).inverse());
      },
      //slowmat4: function(m) { return new glm.mat4(this.$mat4.getInverse(m)); },
      _pm: { identity:function(){this.elements.set(glm.mat4.$.identity);return this;},
             multiplyScalar: function(n) { for(var i=0;i<16; i++)this.elements[i]*=n;}},
      mat4: function(m) { m=m.clone(); this._pm.elements=m.elements; this.$mat4.getInverse.call(this._pm,m); return m;},
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
