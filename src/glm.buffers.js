// ----------------------------------------------------------------------------
// glm.buffers.js - glm-js ArrayBuffer / data views
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

function $GLMVector(typ, sz, typearray) {
   typearray = typearray || GLM.$outer.Float32Array;
   this.typearray = typearray;
   if (!(this instanceof $GLMVector)) throw new GLM.GLMJSError('use new');
   if (!('function' === typeof typ) || !GLM.$isGLMConstructor(typ))
      throw new GLM.GLMJSError('expecting typ to be GLM.$isGLMConstructor: '+
                               [typeof typ, (typ?typ.$type:typ)]+" // "+
                               GLM.$isGLMConstructor(typ));
   if (typ.componentLength === 1 && GLM[typ.prototype.$type.replace("$","$$v")])
      throw new GLM.GLMJSError("unsupported argtype to glm.$vectorType - for single-value types use glm."+typ.prototype.$type.replace("$","$$v")+"..."+typ.prototype.$type);
   this.glmtype = typ;
   if (!this.glmtype.componentLength) throw new Error('need .componentLength '+[typ, sz, typearray]);
   this.componentLength = this.glmtype.componentLength;
   this.BYTES_PER_ELEMENT = this.glmtype.BYTES_PER_ELEMENT;

   this._set_$elements = function _set_$elements(elements) {
      Object.defineProperty(this, '$elements', { enumerable: false, configurable: true, value: elements });
      return this.$elements;
   };

   Object.defineProperty(
      this, 'elements',
      { enumerable: true,
        configurable: true,
        get: function() { return this.$elements; },
        set: function(elements) {
           if (this._kv && !this._kv.dynamic)
              GLM.$DEBUG && GLM.$outer.console.warn("WARNING: setting .elements on frozen (non-dynamic) GLMVector...");
           if (!elements) {
              this.length = this.byteLength = 0;
           } else {
              var oldlength = this.length;
              this.length = elements.length / this.componentLength;
              this.byteLength = elements.length * this.BYTES_PER_ELEMENT;
              if (this.length !== Math.round(this.length))
                 throw new GLM.GLMJSError(
                    '$vectorType.length alignment mismatch '+
                       JSON.stringify(
                          {componentLength:this.componentLength,
                           length:this.length,
                           rounded_length:Math.round(this.length),
                           elements_length: elements.length,
                           old_length: oldlength
                          }));
           }
           return this._set_$elements(elements);
        }
      });

   this.elements = sz && new typearray(sz * typ.componentLength);

}

GLM.$vectorType = $GLMVector;
GLM.$vectorType.version = '0.0.2';

$GLMVector.prototype = GLM.$template.extend(
   new GLM.$GLMBaseType($GLMVector, '$vectorType'),
   {
      toString: function() {
         return "[$GLMVector .elements=#"+(this.elements&&this.elements.length)+
            " .elements[0]="+(this.elements&&this.elements[0])+
            " ->[0]"+(this['->']&&this['->'][0])+"]";
      },
      '=': function(elements) {
         if (elements instanceof this.constructor || glm.$isGLMObject(elements))
            elements = elements.elements;
         return this._set(new this.typearray(elements)); // makes a copy
      },
      _typed_concat: function(a,b,out) {
         var n = a.length + b.length;
         out = out || new a.constructor(n);
         out.set(a);
         out.set(b, a.length);
         return out;
      },
      '+': function(elements) {
         if (elements instanceof this.constructor || glm.$isGLMObject(elements))
            elements = elements.elements;
         return new this.constructor(this._typed_concat(this.elements, elements));
      },
      '+=': function(elements) {
         if (elements instanceof this.constructor || glm.$isGLMObject(elements))
            elements = elements.elements;
         return this._set(this._typed_concat(this.elements, elements));
      },
      _set: function(elements) {
         if (elements instanceof this.constructor)
            elements = new this.typearray(elements.elements);
         if (!(elements instanceof this.typearray))
            throw new GLM.GLMJSError("unsupported argtype to $GLMVector._set "+(elements&&elements.constructor));
         GLM.$DEBUG && GLM.$outer.console.debug("$GLMVector.prototype.set..." +
                      'this.elements:'+[this.elements&&this.elements.constructor.name,
                       this.elements&&this.elements.length]+
                      'elements:'+[elements.constructor.name,
                       elements.length]);
         var _kv = this._kv;
         this._kv = undefined;
         this.elements = elements;
         if (this.elements !== elements)
            throw new GLM.GLMJSError("err with .elements: "+ [this.glmtype.prototype.$type, this.elements,elements]);
         if (_kv)
            this._setup(_kv);
         return this;
      },
      arrayize: function(bSetters,bDynamic) {
         return this._setup({
                               //stride: this.glmtype.BYTES_PER_ELEMENT,
                               //offset: ele.byteOffset,
                               //ele: this.elements,
                               //container: [],
                               dynamic: bDynamic,
                               setters: bSetters
                            }, this.length);
      },
      $destroy: function(arr) {
         if (arr) {
            var isArray = Array.isArray(arr);
            function _destroy(i) {
               Object.defineProperty(arr, i, { enumerable: true, configurable: true, value: undefined });
               delete arr[i];
               if (!isArray) {
                  arr[i] = undefined; // dbl check... fires error if still prop-set
                  delete arr[i];
               }
            }
            for(var i=0;i < arr.length; i++) {
               if (i in arr)
                  _destroy(i);
            }
            while(i in arr) {
               GLM.$DEBUG && GLM.$outer.console.debug("$destroy", this.name, i);
               _destroy(i++);
            }
            if (isArray)
               arr.length = 0;
         }
      },
      _arrlike_toJSON: function() { return this.slice(0); },
      _mixinArray: function(arr) {
         arr.toJSON = this._arrlike_toJSON;
         "forEach,map,slice,filter,join,reduce".split(",")
            .forEach(function(k) { arr[k] = Array.prototype[k]; });
         return arr;
      },
      _setup: function(kv, oldlen) {
         var vec = this.glmtype;
         var typearray = this.typearray;
         var n = this.length;
         this._kv = kv;
         var stride = kv.stride || this.glmtype.BYTES_PER_ELEMENT,
         offset = kv.offset || this.elements.byteOffset,
         ele = kv.elements || this.elements,
         container = kv.container || this.arr || [],
         bSetters = kv.setters || false,
         dynamic = kv.dynamic || false;

         if (container === 'self')
            container = this;
         //console.warn("ele",typeof ele,ele, this.componentLength);

         if (!ele)
            throw new GLMJSError("GLMVector._setup - neither kv.elements nor this.elements...");

         this.$destroy(this.arr, oldlen);
         // cleanup
         var arr = this.arr = this['->'] = container;

         // add convenience methods to pseudo-Array containers
         if (!Array.isArray(arr)) {
            this._mixinArray(arr);
         }

         var cl = this.componentLength;
         if (!cl) throw new GLM.GLMJSError("no componentLength!?"+Object.keys(this));
         var last = ele.buffer.byteLength;
         var thiz = this;
         for(var i=0; i < n; i++) {
            var off = offset + i*stride;
            var next = off + this.glmtype.BYTES_PER_ELEMENT;//offset + (i+1)*stride;
            function dbg() {
               kv.i = i; kv.next = next; kv.last = last; kv.offset = kv.offset || offset; kv.stride = kv.stride || stride;
               return JSON.stringify(kv);//{i:i, eleO: ele.byteOffset, stride: stride, offset:offset, next:next, last:last});
            }
            if (off > last)
               throw new Error('['+i+'] off '+off+' > last '+last+' '+dbg());
            if (next > last)
               throw new Error('['+i+'] next '+next+' > last '+last+' '+dbg());

            arr[i] = null;
            var make_ti = function(ele,off) {
               ///if (!ele) { throw new Error('!ele ' + (+new Date())); onmessage({stop:1}); }
               var ret = new vec(new typearray(ele.buffer,off,cl));
               if (dynamic) // for detecting underlying .elements changes..
               Object.defineProperty(ret, '$elements', { value: ele });
               return ret;
            };
            var ti = make_ti(ele,off);

            if (!bSetters && !dynamic) {
               // read-only array elements
               arr[i] = ti;
            } else {
               // update-able array elements
               (function(ti,i,off) {
                   Object.defineProperty(
                      arr, i,
                      {
                         enumerable: true,
                         configurable: true,
                         get: dynamic ?
                            function() {
                               if (ti.$elements !== thiz.elements) {
                                  GLM.$log("dynoget rebinding ti",i,off,ti.$elements === thiz.elements);
                                  ti = make_ti(thiz.elements,off);
                               }
                               return ti;
                            } :
                            function() { return ti; },
                         set: bSetters && (
                            dynamic ?
                               function(v) {
                                  GLM.$log("dynoset",i,off,ti.$elements === thiz.elements);
                                  if (ti.$elements !== thiz.elements) {
                                     GLM.$log("dynoset rebinding ti",i,off,ti.$elements === thiz.elements);
                                     ti = make_ti(thiz.elements,off);
                                  }
                                  return ti.copy(v);
                               } :
                               function(v,_) {
                                  //console.warn("setter" + JSON.stringify({i:i,ti:ti,v:v},0,2));
                                  return ti.copy(v);
                               }) || undefined
                      });
                })(ti,i,off);
            }
         }
         return this;
      },
      // DATA is arg is a set of [typearray(),typearray()] buffers (eg: socket.io buffers)
      setFromBuffers: function(DATA) {
         var fa = this.elements;
         var off = 0;
         var fl = fa.length;
         DATA.forEach(
            function(seg) {
               var sl = seg.length;
               if (off+sl > fa.length) {
                  var mseg = Math.min(
                     fa.length - off,
                     seg.length);
                  if (mseg <= 0) {
                     return;
                  } else {
                     seg = glm.$subarray(seg,0,mseg);
                     sl = seg.length;
                  }
               }

               if (off+sl > fa.length)
                  throw new glm.GLMJSError('$vectorType.fromBuffers mismatch '+[off,sl,fa.length]);

               fa.set(seg,off);
               off += seg.length;
            });
         return off;
      },
      setFromPointer: function(ptr) {
         if(!(ptr instanceof GLM.$outer.ArrayBuffer))
            throw new glm.GLMJSError("unsupported argtype "+[typeof ptr]+" - $GLMVector.setFromPointer");
         return this._set(new this.typearray(ptr));
      }
   });

// Object.defineProperty(
//     $GLMVector.prototype, 'base64',
//     {
//         get: function() {
//             return GLM.$to_base64(this);
//         },
//         set: function(a) {
//             return this.elements.set(new this.typearray(GLM.$b64.decode(a)));
//         }
//     });



