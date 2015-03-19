// ----------------------------------------------------------------------------
// glm.experimental.js - glm-js experimental stuff
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

GLM.exists;
GLM.$vectorType.exists;

if (GLM.$toTypedArray) throw "error: glm.experimental.js double-included";

// coerces elementSource into the specified arrayType:
//   arrayType<typedarray constructor>, 
//   elementSource<glm-object|typedarray|arraybuffer|array|number*<componentLength>>,
//   componentLength<number> (only needed if elementSource is also a number)
GLM.$toTypedArray = function(arrayType, elementSource, componentLength) {
   var sz = elementSource || 0;
   var sztype = typeof sz;
   
   if (sztype === 'number') {
      if (typeof componentLength !== 'number')
         throw new GLM.GLMJSError("GLM.$toTypedArray: unsupported argtype for componentLength ("+typeof componentLength+")");
      return new arrayType(sz * componentLength);
   }
   if (sztype !== 'object')
      throw new GLM.GLMJSError("GLM.$toTypedArray: unsupported arrayType: "+[typeof arrayType, arrayType]);

   if (sz instanceof arrayType)
      return sz;

   if (sz instanceof ArrayBuffer || Array.isArray(sz))
      return new arrayType(sz);

   if (GLM.$isGLMObject(sz)) {
      var ref = sz.elements;
      sz = new Float32Array(ref.length);
      sz.set(ref);
      if (arrayType === Float32Array)
         return sz;
      // ... otherwise, fall-thru since may require manual coercion
   }

   if (!(sz instanceof arrayType)) {
      if ("byteOffset" in sz && "buffer" in sz) {
         GLM.$outer.console.warn("coercing "+sz.constructor.name+".buffer into "+[arrayType.name, sz.byteOffset]+"...");
         return new arrayType(sz.buffer, sz.byteOffset);
      }
   }

   if (sz instanceof arrayType)
      return sz;
   throw new GLM.GLMJSError("GLM.$toTypedArray: unsupported argtype initializers: "+[arrayType, elementSource, componentLength]);
};

//GLM.$DEBUG = 1;
GLM.$make_primitive = function(type, typearray) {
   GLM[type] = function(v) {
      if (!(this instanceof glm[type]))
         return new glm[type](v);
      if (typeof v !== 'object') v = [v];
      this.elements = GLM.$toTypedArray(typearray, v, 1);
   };
   /*TRACING*/ GLM[type] = eval(GLM.$template._traceable("glm_"+type+"$class", GLM[type]))();

   GLM.$template._add_overrides(
      type, 
      {
         $to_string: function(v) { return v.$type.replace(/[^a-z]/g,'')+'('+v.elements[0]+')';  },
         $to_object: function(v) { return v.elements[0]; },
         $to_glsl: function(v) { return v.$type.replace(/[^a-z]/g,'')+'('+v.elements[0]+')';  }
      }
   );

   GLM.$template._add_overrides(
      type.substr(1),  // $float => float
      {
         $to_string: !(type.substr(1) in GLM.$to_string.$template) && function(v) { return v.$type.replace(/[^a-z]/g,'')+'('+v.elements[0]+')';  },
         $to_object: function(v) { return v; },
         $to_glsl: function(v) { return v.$type.replace(/[^a-z]/g,'')+'('+v+')';  }

      }
   );
   
   GLM.$template.extend(
      GLM[type],
      {
         componentLength: 1,
         BYTES_PER_ELEMENT: typearray.BYTES_PER_ELEMENT,
         prototype: GLM.$template.extend(
            new GLM.$GLMBaseType(GLM[type], type),
            {
               copy: function(v) {
                  this.elements.set(GLM.$isGLMObject(v) ? v.elements : [v]);
                  return this;
               }
            })
      });
   GLM[type].prototype['='] = GLM[type].prototype.copy;

   return GLM[type];
};

GLM.$make_primitive("$bool", Int32Array);
GLM.$template.jstypes['boolean'] = 'float'; // internal representation
GLM.$make_primitive("$int32", Int32Array);
GLM.$make_primitive("$uint16", Uint16Array);
GLM.$make_primitive("$float", Float32Array);

GLM.$make_primitive_vector = function(type, glmtype, typearray) {
   typearray = typearray || new glmtype().elements.constructor;
   var $class = function(sz) {
      if (!(this instanceof $class)) 
         return new $class(sz);
      this.$type = type;
      //this.componentLength = glmtype.componentLength;
      this.$type_name = 'vector<'+type+'>';
      this._set(GLM.$toTypedArray(typearray, sz, glmtype.componentLength));
   };
   /*TRACING*/ $class = eval(GLM.$template._traceable("glm_"+type+"$class", $class))();

   $class.prototype = new GLM.$vectorType(glmtype, 0, typearray);

   GLM.$template._add_overrides(
      type, 
      {
         $to_string: function(what) { return "[GLM."+what.$type+" elements[0]="+(what.elements&&what.elements[0])+"]"; },
         $to_object: function(v) { return v.map(GLM.$to_object);  },
         $to_glsl: function(v,name) { 
            // eg: glm.$vvec4(4) ==> 'vec4 example[4];example[0]=vec4(...);example[1]=vec4(...);...'
            var t = v.$type.substr(2).replace(/[^a-z]/g,'');
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
         _setup: function() { throw new GLM.GLMJSError("._setup not available on primitive vectors yet..."); },
         _set: function(e) {
            this.elements = e;//GLM.$toTypedArray(this.typearray, e, this.glmtype.componentLength);
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
            "forEach,map,slice,filter,join,reduce".split(",").forEach(
               function(k) { this[k] = Array.prototype[k]; }.bind(this));
            return this;
         },
         toString: function() {
            return "[vector<"+type+"> {"+[].slice.call(this.elements,0,5)+(this.elements.length > 5?",...":"")+"}]";
         }
      });
   
   return $class;
};

GLM.$vint32 = GLM.$make_primitive_vector('$vint32', GLM.$int32);
GLM.$vfloat = GLM.$make_primitive_vector('$vfloat', GLM.$float);
GLM.$vuint16 = GLM.$make_primitive_vector('$vuint16', GLM.$uint16);

GLM.$make_componentized_vector = function(type, glmtype, typearray) {
   typearray = typearray || new glmtype().elements.constructor;
   var $class = function(_sz, dynamic) {
      if (!(this instanceof $class))
         return new $class(_sz, dynamic);
      this._set(
         GLM.$toTypedArray(typearray, _sz, glmtype.componentLength)
            )._setup({ 
                        setters: true,
                        dynamic: dynamic,
                        container: 'self'
                     });                          
   };
   /*TRACING*/ $class = eval(GLM.$template._traceable("glm_"+type+"$class", $class))();

   $class.prototype = new GLM.$vectorType(glmtype, 0, typearray);

   GLM.$template._add_overrides(
      type, 
      {
         $to_string: function(what) { return "[GLM."+what.$type+" elements[0]="+(what.elements&&what.elements[0])+"]"; },
         $to_object: function(v) { return v.map(GLM.$to_object);  },
//         $to_glsl: function(v) { return type.substr(2)+'['+v.length+']('+v.map(GLM.$to_glsl)+')'; }
//         $to_glsl: function(v) { return v.map(GLM.$to_glsl);  }
         $to_glsl: function(v,name) { 
            var t = v.$type.substr(2);
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

   GLM.$types.push(type);

   GLM.$template.extend($class.prototype,
                        {
                           $type: type,
                           constructor: $class
                        });
   if (!$class.prototype.componentLength) alert('!cmop '+p);
   return $class;
};

(function(){
    var $makers = GLM.$template.deNify(
       {
          '$vvec<N>': function() {
             return GLM.$make_componentized_vector("$vvecN", glm.vecN);
          },
          '$vmat<N>': function(_sz) {
             return GLM.$make_componentized_vector("$vmatN", glm.matN);
          },
          '$vquat': function() {
             return GLM.$make_componentized_vector("$vquat", glm.quat);
          }
       });
    for(var p in $makers) {
       GLM[p] = $makers[p]();
    }
 })();
