// ----------------------------------------------------------------------------
// tdl fast.js GLM math adapter
// copyright(c) 2015 humbletim
// https://github.com/humbletim/glm-js
// MIT LICENSE
// ----------------------------------------------------------------------------

try {
   tdl.fast.exists;
} catch(e) {
   tdl.fast.exists;
}

glm = GLM;
//throw new glm.GLMJSError(glm.degrees(5));

var DLL = glm.$DLL['tdl-fast.js'] = {
   vendor_name: "tdl-fast.js",
   vendor_version: "2009?",
   
   _name: 'glm.tdl-fast.js',
   _version: '0.0.0',

};
   
DLL.$functions = (
   function() {
      return {
         mat4_perspective: function(fov, aspect, near, far) {
            return new glm.mat4(tdl.fast.matrix4.perspective(new Float32Array(16),
                                                             fov, aspect, near, far));
         }, 
         mat4_angleAxis: function(theta, axis) {
            return new glm.mat4(tdl.fast.matrix4.axisRotation(new Float32Array(16), axis, theta));
         },
         quat_angleAxis: function(angle, axis) {
            var q = tdl.quaternions.axisRotation(axis.elements, angle);
            return new glm.quat(q);//throw new Error(q);
         },
//          mat4_translation: function(v) {
//          },
//          mat4_scale: function(v) {
//          },
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
            return tdl.quaternions.rotationToQuaternion(o.elements);
         }
      };
   })();

glm.$template.operations(
   {
      'mul': {
         op: '*',
         'quat,vec<N>': function(a,b) {
            //TODO: map to tdl-fast 'native' quat*vecN
            return glm.toMat4(a).mul(b);
         },
         'vec<N>,quat': function(a,b) {
            //TODO: map to tdl-fast 'native' vecN*quat
            return glm.toMat4(b).mul(a);
         },
         'vec<N>,float': function(a,b) {
            return new glm.vecN(
               tdl.fast.mulVectorScalar(new Float32Array(N), a.elements, b));
         },
         'mat4,vec3': function(a,b) { 
            return new glm.vec3(
               this['mat4,vec4'](a,new glm.vec4(b,1)).elements); 
         },
         'mat4,vec4': function(a,b) {
            return new glm.vec4(tdl.fast.rowMajor.mulVectorMatrix4(
                                   new Float32Array(4), b, a.elements));
         },
         'mat4,mat4': function(a,b) {
            return new glm.mat4(
               tdl.fast.rowMajor.mulMatrixMatrix4(
                  new Float32Array(16), a.elements, b.elements)
            );
         }
      },
      'mul_eq': {
         op: '*=',
         'vec<N>,float': function(a,b) {
            tdl.fast.mulVectorScalar(a.elements, a.elements, b);
            return a;
         },
         //             'mat4,mat4': function(a,b) {
         //             },
      }
   });

glm.$template.functions(
   {
      mix: {
         "quat,quat": function(a,b,t) {
            a = a.elements;
            b = b.elements;
            var o = new glm.quat(new Float32Array(4));
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
                     out[0] = ax;
                     out[1] = ay;
                     out[2] = az;
                     out[3] = aw;
                  }
                  return o;
               }

               halfTheta = Math.acos(cosHalfTheta);
               sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
               /*
    if (Math.abs(sinHalfTheta) < 0.001) {
        out[0] = (ax * 0.5 + bx * 0.5);
        out[1] = (ay * 0.5 + by * 0.5);
        out[2] = (az * 0.5 + bz * 0.5);
        out[3] = (aw * 0.5 + bw * 0.5);
        return out;
    }
*/
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
   });

glm.$template.calculators(
   {
      normalize: {
         'vec<N>': function(v) { 
            return new glm.vecN(tdl.fast.normalize(new Float32Array(N), v.elements));
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
         mat4: function(m) { return new glm.mat4(tdl.fast.inverse4(new Float32Array(16), m.elements)); }
      },
      transpose: {
         mat4: function(m) { return new glm.mat4(tdl.fast.transpose4(new Float32Array(16), m.elements)); }
      },
      //          clamp: {
      //             '': function() { assert(false) },
      //          }
   });

glm.$intern(DLL.$functions);

glm.init({vendor_name:DLL.vendor_name}, 'glm-js[tdl-fast]: ');

try { module.exports = glm; } catch(e) {}



