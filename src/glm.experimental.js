// ----------------------------------------------------------------------------
// glm.experimental.js - glm-js experimental stuff
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

GLM.exists;

GLM.$vector.exists;

//GLM.$DEBUG = 1;
GLM.$make_primitive = function(type, type32array) {
   GLM[type] = function(v) {
      if (!(this instanceof glm[type]))
         return new glm[type](v);
      if (v && typeof v === 'object' && "elements" in v)
         v = v.elements;
      if (typeof v !== 'object') v = [v];
      this.elements = GLM.$cast_to_type32array(1, v, type32array);
   };
   var ts = { $to_string: {} };
   ts.$to_string[type] = function(what) { return "[GLM."+what.$type+" "+(what.elements&&what.elements[0])+"]"; };
   GLM.$template.varargs_functions(ts);
   
   GLM.$template.extend(
      GLM[type],
      {
         componentLength: 1,
         BYTES_PER_ELEMENT: type32array.BYTES_PER_ELEMENT,
         prototype: GLM.$template.extend(
            new GLM.$GLMBaseType(GLM[type], type),
            {
               copy: function(v) {
                  this.elements.set(GLM.$isGLMObject(v) ? v.elements : [v]);
               }
            })
      });
   GLM[type].prototype['='] = GLM[type].prototype.copy;

   return GLM[type];
};

GLM.$make_primitive("$boolean", Int32Array);
GLM.$make_primitive("$int32", Int32Array);
GLM.$make_primitive("$float", Float32Array);

GLM.$cast_to_type32array = function(cl, _sz, type32array) {
   var sz = _sz;
   if (!sz) 
      sz = 0;
   if (GLM.$isGLMObject(sz)) {
      var ref = sz.elements;
      sz = new Float32Array(ref.length);
      sz.set(ref);
   }

   if (typeof sz === 'number')
      sz = new type32array(sz * cl);
   if (sz instanceof ArrayBuffer || Array.isArray(sz))
      sz = new type32array(sz);

   if (!(sz instanceof type32array)) {
      if ("byteOffset" in sz && "buffer" in sz)
         sz = new type32array(sz.buffer, sz.byteOffset);
   }

   if (!(sz instanceof type32array))
      throw new GLM.GLMJSError("GLM.$cast_to_type32array: unsupported type32array argtype initializer: "+_sz);
   return sz;
};

GLM.$make_primitive_vector = function(type, glmtype, type32array) {
   type32array = type32array || new glmtype().elements.constructor;
   var $class = function(sz) {
      if (!(this instanceof $class)) 
         return new $class(sz);
      this.$type = type;
      //this.componentLength = glmtype.componentLength;
      this.$type_name = 'vector<'+type+'>';
      this.elements = GLM.$cast_to_type32array(glmtype.componentLength, sz, type32array);
      this.length = this.elements.length / glmtype.componentLength;
   };
   $class.prototype = new GLM.$vector(glmtype, 0, type32array);
   GLM.$template.extend(
      $class.prototype,
      {
         arrayize: function() {
            var elements = this.elements;
            var sprop = Object.defineProperty.bind(Object, this);
            for(var i=0; i < this.length; i++) {
               (function(_) {
                   sprop(_, 
                         {
                            configurable: true,
                            enumerable: true,
                            get: function() { 
                               return this.elements[_];
                            },
                            set: function(v) {
                               return this.elements[_] = v;
                            }
                         });
                })(i);
            }
            "map,slice,filter,join,reduce".split(",").forEach(
               function(k) { this[k] = Array.prototype[k]; }.bind(this));
            return this;
         },
         toString: function() {
            return "[vector<"+type+"> {"+[].slice.call(this.elements,0,5)+(this.elements.length > 5?",...":"")+"}]";
         }
      });
   
   return $class;
};

GLM.$vint32 = GLM.$make_primitive_vector('$vint32', GLM.$int32, Int32Array);
GLM.$vfloat = GLM.$make_primitive_vector('$vfloat', GLM.$float, Float32Array);

var $classes;
GLM.$template.extend(
   GLM,
   $classes = GLM.$template.deNify(
      {
         '$vvec<N>': function(_sz, dynamic) {
            if (!(this instanceof glm.$vvecN))
               return new glm.$vvecN(_sz, dynamic);
            this._set(
               GLM.$cast_to_type32array(glm.vecN.componentLength, _sz, Float32Array)
            )._setup({ 
                        setters: true,
                        dynamic: dynamic,
                        container: 'self'
                     });                          
         },
         '$vmat<N>': function(_sz) {
            if (!(this instanceof glm.$vmatN))
               return new glm.$vmatN(_sz);
            this._set(
               GLM.$cast_to_type32array(glm.matN.componentLength, _sz, Float32Array)
            )._setup({ 
                        setters: true,
                        container: 'self'
                     });                          
         },
         '$vquat': function(_sz) {
            if (!(this instanceof glm.$vquat))
               return new glm.$vquat(_sz);
            this._set(
               GLM.$cast_to_type32array(glm.quat.componentLength, _sz, Float32Array)
            )._setup({ 
                        setters: true,
                        container: 'self'
                     });                          
         }
      }
   ));

for(var p in $classes) {
   GLM[p].prototype = new glm.$vector(glm[p.substr(2)]);
   GLM[p].prototype.$type = p;
   if (!GLM[p].prototype.componentLength) alert('!cmop '+p);
   //GLM[p].prototype.componentLength = glm[p.substr(2)].componentLength;
   GLM[p].prototype.constructor = GLM[p];
   GLM.$types.push(p);
}


