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

var glm = GLM;
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
//          mat4_perspective: function(fov, aspect, near, far) {
//          }, 
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

DLL.$operations = (
   function() {
      return {
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
         },
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
         inverse: {
//             quat: function(q) { 
//             },
            mat4: function(m) { return new glm.mat4(tdl.fast.inverse4(new Float32Array(16), m.elements)); }
         },
         transpose: {
            mat4: function(m) { return new glm.mat4(tdl.fast.transpose4(new Float32Array(16), m.elements)); }
         },
//          clamp: {
//             '': function() { assert(false) },
//          }
      };
   })();

glm.$intern(DLL.$functions);

for(x in DLL.$operations) {
   //console.warn("OPERATION", x, DLL.$operations[x]);
   if (DLL.$operations[x].op) {
      glm.$template.override("<T,V>", x, DLL.$operations[x], glm.$operations);
   } else {
      glm.$template.override("<T>", x, DLL.$operations[x], glm.$functions);
   }
}

glm.init({vendor_name:DLL.vendor_name}, 'glm-js[tdl-fast]: ');

try { module.exports = glm; } catch(e) {}



