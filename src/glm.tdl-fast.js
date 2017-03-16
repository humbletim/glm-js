// ----------------------------------------------------------------------------
// tdl fast.js GLM math adapter
// copyright(c) 2015 humbletim
// https://github.com/humbletim/glm-js
// MIT LICENSE
// ----------------------------------------------------------------------------

tdl.fast.exists;

glm = GLM;

var DLL = {
   vendor_name: "tdl-fast.js",
   vendor_version: "2009?",
   
   _name: 'glm.tdl-fast.js',
   _version: '0.0.2',

   prefix: 'glm-js[tdl-fast]: '
};

DLL['statics'] = {
   mat4_perspective: function(fov, aspect, near, far) {
      return glm.mat4(
         tdl.fast.matrix4.perspective(new Float32Array(16),
                                      fov, aspect, near, far)
      );
   }, 
   mat4_angleAxis: function(theta, axis) {
      return glm.mat4(
         tdl.fast.matrix4.axisRotation(new Float32Array(16), axis.elements, theta)
      );
   },
   quat_angleAxis: function(angle, axis) {
      var q = tdl.quaternions.axisRotation(axis.elements, angle);
      return new glm.quat(q);//throw new Error(q);
   },
   mat4_translation: function(v) {
      return glm.mat4(tdl.fast.matrix4.translation(new Float32Array(16), v.elements));
   },
   mat4_scale: function(v) {
      return glm.mat4(tdl.fast.matrix4.scaling(new Float32Array(16), v.elements));
   },
   //          _inverse_transpose: function(m) {
   //             return m;
   //             var m = tdl.fast.matrix4.transpose(
   //                new Float32Array(16), 
   //                m
   //             );
   //             return tdl.fast.inverse4(new Float32Array(16),m);
   //          },
   mat4_array_from_quat: function(q) {
      return tdl.quaternions.quaternionToRotation(q.elements);
   },
   quat_array_from_mat4: function(o) {
      var arr = tdl.quaternions.rotationToQuaternion(o.elements);
      // FIXME: tdl doesn't handle the case of mat4(1) properly
      if (isNaN(arr[0]))
        return glm.quat.$.identity;
      return arr;
   }
}; //statics
      
DLL['declare<T,V,...>'] = {
   mul: {
      $op: '*',
      //note: tdl.fast has no mulQuaternionQuaternion(dst,a,b) yet
      _mulQuatQuat: tdl.quaternions.mulQuaternionQuaternion,
      'quat,quat': function(a,b) {
         return new glm.quat(this._mulQuatQuat(a.elements, b.elements));
      },
      'quat,vec<N>': function(a,b) { return this['mat4,vecN'](glm.toMat4(a), b); },
      'vec<N>,quat': function(a,b) { return this['quat,vecN'](glm.inverse(b), a); },
      _mulVecSca: tdl.fast.mulVectorScalar,
      'vec<N>,float': function(a,b) {
         return glm.vecN(
            this._mulVecSca(new Float32Array(N), a.elements, b));
      },
      'mat4,vec3': function(a,b) { 
         b = new glm.vec4(b,1);
         var c = this['mat4,vec4'](a,b);
         return new glm.vec3(c); 
      },
      _mulVecMat4: tdl.fast.rowMajor.mulVectorMatrix4,
      'mat4,vec4': function(a,b) {
         return glm.vec4(
            this._mulVecMat4(new Float32Array(4), 
                             b.elements, a.elements)
         );
      },
      'vec4,mat4': function(a,b) { return this['mat4,vec4'](glm.inverse(b),a); },
      '_mulMatMat<N>': 'tdl.fast.columnMajor.mulMatrixMatrixN',
      'mat<N>,mat<N>': function(a,b) {
         return glm.matN(
            this._mulMatMatN(new Float32Array(N*N), 
                            a.elements, b.elements)
         );
      }
   },
   mul_eq: {
      $op: '*=',
      'vec<N>,float': function(a,b) {
         tdl.fast.mulVectorScalar(a.elements, a.elements, b);
         return a;
      },
      '_mulMatMat<N>': 'tdl.fast.columnMajor.mulMatrixMatrixN',
      'mat<N>,mat<N>': function(a,b) {
         this._mulMatMatN(a.elements,a.elements, b.elements);
         return a;
      },
      //note: tdl.fast has no mulQuaternionQuaternion(dst,a,b) yet
      _mulQuatQuat: tdl.quaternions.mulQuaternionQuaternion,
      'quat,quat': function(a,b) {
         a.elements.set(this._mulQuatQuat(a.elements, b.elements));
         return a;
      },
      _mulVecMat4: tdl.fast.rowMajor.mulVectorMatrix4,

      // note: this can be referenced as: glm.mul_eq.link('inplace:vec3,quat');
      'inplace:vec3,quat': function(a,b) {
         var m4 = glm.toMat4(glm.inverse(b)).elements;
         var v4 = glm.vec4(a,1).elements;
         this._mulVecMat4(a.elements, v4, m4);
         return a;
      },
      // note: this can be referenced as: glm.mul_eq.link('inplace:vec3,quat');
      'inplace:vec4,mat4': function(a,b) {
         var m4 = glm.inverse(b);
         // note: tdl-fast has a bug in mulVectorMatrix4 --
         //  dst and the input vector can't be the same (hence the Float32Array)
         this._mulVecMat4(a.elements, new Float32Array(a.elements), m4.elements);
         return a;
      }
   },
   cross: {
      _cross: tdl.fast.cross,
      'vec3,vec3': function(a,b) {
         return new glm.vec3(this._cross( new Float32Array(3), a, b));
      }
   },
   dot: {
      _dot: tdl.fast.dot,
      'vec3,vec3': function(a,b) {
         return this._dot(a,b);
      }
   },
   lookAt: {
      _lookAt: tdl.fast.matrix4.lookAt,
      'vec3,vec3': function(eye,target,up) {
	 return new glm.mat4(
	    this._lookAt(
	       new Float32Array(16),
	       eye.elements, target.elements, up.elements
	    ));
      }
   }
}; //operations

DLL['declare<T,V,number>'] = {
   mix: {
      "quat,quat": function(a,b,t) {
         //var _a=a,_b=b;
         a = a.elements;
         b = b.elements;
         var o = glm.quat(new Float32Array(4));
         var out = o.elements;
         
         { //http://jsperf.com/quaternion-slerp-implementations
            var ax = a[0], ay = a[1], az = a[2], aw = a[3],
            bx = b[0], by = b[1], bz = b[2], bw = b[3];

            var cosHalfTheta = ax * bx + ay * by + az * bz + aw * bw,
            halfTheta,
            sinHalfTheta,
            ratioA,
            ratioB;

            if (Math.abs(cosHalfTheta) >= 1.0) {
               if (out !== a) {
                  //console.warn([_a,_b]+'');
                  out[0] = ax;
                  out[1] = ay;
                  out[2] = az;
                  out[3] = aw;
               }
               return o;
            }

            halfTheta = Math.acos(cosHalfTheta);
            sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
            
            /*if (Math.abs(sinHalfTheta) < 0.001) {
                  out[0] = (ax * 0.5 + bx * 0.5);
                  out[1] = (ay * 0.5 + by * 0.5);
                  out[2] = (az * 0.5 + bz * 0.5);
                  out[3] = (aw * 0.5 + bw * 0.5);
                  return out;
               }*/

            ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
            ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

            out[0] = (ax * ratioA + bx * ratioB);
            out[1] = (ay * ratioA + by * ratioB);
            out[2] = (az * ratioA + bz * ratioB);
            out[3] = (aw * ratioA + bw * ratioB);
         }//http://jsperf.com/quaternion-slerp-implementations
         return o;
      }
   }
};//functions

DLL['declare<T>'] = {
   normalize: {
      'vec<N>': function(v) { 
         return glm.vecN(tdl.fast.normalize(new Float32Array(N), v.elements));
      },
      quat: function(q) { 
         return new glm.quat(tdl.quaternions.normalize(q.elements));
      },
   },
   length: {
      "vec<N>": function(v) { return tdl.math.length(v.elements); },
      quat: function(q) { return tdl.quaternions.length(q.elements); },
   },
   length2: {
      "vec<N>": function(v) { return tdl.math.lengthSquared(v.elements); },
      quat: function(q) { return tdl.quaternions.lengthSquared(q.elements); },
   },
   inverse: {
      quat: function(q) { return new glm.quat(tdl.quaternions.inverse(q.elements)); },
      //xmat4: function(m) { return glm.mat4(tdl.fast.inverse4(new Float32Array(16), m.elements)); },
      mat4: function(m) {
	 m=m.clone();
	 if (isNaN(tdl.fast.inverse4(m.elements, m.elements)[0]))
	    m['='](glm.mat4()); // no determinant; reset to identity 
	 return m;
      }
   },
   transpose: {
      //xmat4: function(m) { return glm.mat4(tdl.fast.transpose4(new Float32Array(16), m.elements)); },
      mat4: function(m) { m=m.clone(); tdl.fast.transpose4(m.elements, m.elements); return m; }
   }
};//calculators

glm.$outer.$import(DLL);

try { module.exports = glm; } catch(e) {}



