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
      if(v === undefined) v = 0;
      if (v && typeof v === 'object' && "elements" in v)
         v = v.elements;
      if (typeof v !== 'object') v = [v];
      this.elements = GLM.$cast_to_type32array(1, v, type32array);
   };

   GLM.$template._add_overrides(
      type, 
      {
         $to_string: function(v) { return type.replace(/[^a-z]/g,'')+'('+v.elements[0]+')';  },
         $to_object: function(v) { return v.elements[0]; },
         $to_glsl: function(v) { return type.replace(/[^a-z]/g,'')+'('+v.elements[0]+')';  }

      }
   );

   GLM.$template._add_overrides(
      type.substr(1),  // $float => float
      {
         $to_string: !(type.substr(1) in GLM.$to_string.$template) && function(v) { return type.replace(/[^a-z]/g,'')+'('+v.elements[0]+')';  },
         $to_object: function(v) { return v; },
         $to_glsl: function(v) { return type.replace(/[^a-z]/g,'')+'('+v+')';  }

      }
   );
   
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
GLM.$template.jstypes['boolean'] = 'float';
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
      this._set(GLM.$cast_to_type32array(glmtype.componentLength, sz, type32array));
   };
   $class.prototype = new GLM.$vector(glmtype, 0, type32array);

   GLM.$template._add_overrides(
      type, 
      {
         $to_string: function(what) { return "[GLM."+what.$type+" "+(what.elements&&what.elements[0])+"]"; },
         $to_object: function(v) { return v.map(GLM.$to_object);  },
         $to_glsl: function(v,name) { 
            var t = type.substr(2).replace(/[^a-z]/g,'');
            name=typeof name === 'string' ? name : 'example';
            var def = [];
            if (name)
               def.push(t+' '+name+'['+v.length+']');
            return def.concat(
               v.map(function(vv,_) { 
                        return name+'['+_+'] = '+vv; 
                     })).join(";")+";";
         }
      }
   );

   GLM.$types.push(type);

   GLM.$template.extend(
      $class.prototype,
      {
         $type: type,
         constructor: $class,
         _setup: function() { throw new GLM.GLMJSError("no ._setup on primitive vectors..."); },
         _set: function(e) {
            this.elements = e;//GLM.$cast_to_type32array(this.glmtype.componentLength, e, this.type32array);
            this.length = this.elements.length / this.glmtype.componentLength;
            this.arrayize();
            return this;
         },

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

GLM.$make_componentized_vector = function(type, glmtype, type32array) {
   type32array = type32array || new glmtype().elements.constructor;
   var $class = function(_sz, dynamic) {
      if (!(this instanceof $class))
         return new $class(_sz, dynamic);
      this._set(
         GLM.$cast_to_type32array(glmtype.componentLength, _sz, type32array)
            )._setup({ 
                        setters: true,
                        dynamic: dynamic,
                        container: 'self'
                     });                          
   };
   $class.prototype = new GLM.$vector(glmtype, 0, type32array);

   GLM.$template._add_overrides(
      type, 
      {
         $to_string: function(what) { return "[GLM."+what.$type+" "+(what.elements&&what.elements[0])+"]"; },
         $to_object: function(v) { return v.map(GLM.$to_object);  },
//         $to_glsl: function(v) { return type.substr(2)+'['+v.length+']('+v.map(GLM.$to_glsl)+')'; }
//         $to_glsl: function(v) { return v.map(GLM.$to_glsl);  }
         $to_glsl: function(v,name) { 
            var t = type.substr(2);
            name=typeof name === 'string' ? name : 'example';
            var def = [];
            if (name)
               def.push(t+' '+name+'['+v.length+']');
            return def.concat(
               v.map(GLM.$to_glsl)
                  .map(function(vv,_) { 
                          return name+'['+_+'] = '+vv;
                       })).join(";\n ")+";";
         }
      }
    );

   GLM.$template.extend($class.prototype,
                        {
                           $type: type,
                           constructor: $class
                        });
   if (!$class.prototype.componentLength) alert('!cmop '+p);
   GLM.$types.push(type);
   return $class;
};

(function(){
    var $makers = GLM.$template.deNify(
       {
          '$vvec<N>': function() {
             return GLM.$make_componentized_vector("$vvecN", glm.vecN, Float32Array);
          },
          '$vmat<N>': function(_sz) {
             return GLM.$make_componentized_vector("$vmatN", glm.matN, Float32Array);
          },
         '$vquat': function() {
            return GLM.$make_componentized_vector("$vquat", glm.quat, Float32Array);
         }
       });
    for(var p in $makers) {
       GLM[p] = $makers[p]();
    }
 })();
