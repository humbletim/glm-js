// ----------------------------------------------------------------------------
// glm.buffers.js - glm-js ArrayBuffer / data views
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

function $GLMVector(typ, sz, type32array) {
   type32array = type32array || Float32Array;
   this.type32array = type32array;
   if (!(this instanceof $GLMVector)) throw new GLM.GLMJSError('use new');
   if (!('function' === typeof typ) || !GLM.$isGLMConstructor(typ)) 
      throw new GLM.GLMJSError('$GLMVector.GLMJSError(<class>,...) clazz='+
                               [typeof typ, (typ?typ.$type:typ)]+" // "+
                               GLM.$isGLMConstructor(typ));
   this.glmtype = typ;
   if (!this.glmtype.componentLength) throw new Error('need .componentLength '+[typ, sz, type32array]);
   this.componentLength = this.glmtype.componentLength;
   this.BYTES_PER_ELEMENT = this.glmtype.BYTES_PER_ELEMENT;
   this.elements = sz && new type32array(sz * typ.componentLength);
   this.length = sz;
}


GLM.$vector = $GLMVector;
GLM.$vector.version = '0.0.0';
GLM.$template.varargs_functions({
      $to_string: {
         $vector: function(what) { return "$vector<.glmtype="+glm.$isGLMConstructor(what.glmtype)+", .length="+what.length+">"; }
      }
   });

$GLMVector.prototype = GLM.$template.extend(
   new GLM.$GLMBaseType($GLMVector, '$vector'),
   {
      toString: function() {
         return "[$GLMVector .elements=#"+(this.elements&&this.elements.length)+
            " .elements[0]="+(this.elements&&this.elements[0])+
            " ->[0]"+(this['->']&&this['->'][0])+"]";
      },
      set: function(elements) { 
         return this._set(elements);
      },
      _set: function(elements) {
         if (!(elements instanceof this.type32array))
            throw new GLM.GLMJSError("unsupported argtype to $GLMVector._set "+(elements&&elements.constructor));
         GLM.$DEBUG && GLM.$outer.console.debug("$GLMVector.prototype.set..." + 
                      'this.elements:'+[this.elements&&this.elements.constructor.name,
                       this.elements&&this.elements.length]+
                      'elements:'+[elements.constructor.name,
                       elements.length]);
         this.length = elements.length / this.componentLength;
         if (this.length !== Math.round(this.length))
            throw new Error('$vector.length alignment mismatch '+[this.componentLength, this.length, Math.round(this.length), elements]);
         this.elements = elements;
         if (this._kv)
            this._setup(this._kv);
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
                            });
      },
      _destroy: function(arr) {
            if (arr) {
               var isArray = Array.isArray(arr);
               for(var i=0;i < arr.length; i++) {
                  if (i in arr) {
                     Object.defineProperty(arr, i, { enumerable: true, configurable: true, value: undefined });
                     delete arr[i];
                     if (!isArray) {
                        arr[i] = undefined; // dbl check... fires error if still prop-set
                        delete arr[i];
                     }
                  }
               }
               if (isArray)
                  arr.length = 0;
            }
      },
      _setup: function(kv) {
         var vec = this.glmtype;
         var type32array = this.type32array;
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
         
         this._destroy(this.arr);
         // cleanup
         var arr = this.arr = this['->'] = container;
         
         // add convenience methods to pseudo-Array containers
         if (!Array.isArray(arr)) {
            "forEach,map,slice,filter,join,reduce".split(",")
               .forEach(function(k) { arr[k] = Array.prototype[k]; });
            arr.toJSON = function() {
               return this.slice(0);
            };
         }
         
         var cl = this.componentLength;
         if (!cl) throw new GLM.GLMJSError("no componentLength!?"+Object.keys(this));
         var last = ele.buffer.byteLength;
         var thiz = this;
         for(var i=0; i < n; i++) {
            var off = offset + i*stride;
            var next = offset + (i+1)*stride;
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
               var ret = new vec(new type32array(ele.buffer,off,cl));
               if (dynamic) // to detect underlying .elements changes..
                  ret.$elements = ele;
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
                            function() { if (ti.$elements !== thiz.elements) ti = make_ti(thiz.elements,off); return ti; } :
                            function() { return ti; },
                         set: bSetters && (
                            dynamic ? 
                               function() { 
                                  console.warn("dynoset",i,off); 
                                  if (ti.$elements !== thiz.elements)
                                     ti = make_ti(thiz.elements,off); 
                                  return ti.copy(v);
                               } : 
                               function(v,_) { 
                                  //console.warn("setter" + JSON.stringify({i:i,ti:ti,v:v},0,2));
                                  ti.copy(v); 
                               }) || undefined
                      });
                })(ti,i,off);
            }
         }         
         return this;
      },
      // DATA is arg is a set of [type32array(),type32array()] buffers (eg: socket.io buffers)
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
                     seg = seg.subarray(0,mseg);
                     sl = seg.length;
                  }
               }
               
               if (off+sl > fa.length)
                  throw new glm.GLMJSError('$vector.fromBuffers mismatch '+[off,sl,fa.length]);
               
               fa.set(seg,off);
               off += seg.length;
            });
         return off;
      },
      setFromPointer: function(ptr) {
         if(!(ptr instanceof ArrayBuffer)) 
            throw new glm.GLMJSError("unsupported argtype "+[typeof ptr]+" - $GLMVector.setFromPointer");
         return this._set(new this.type32array(ptr));
      }
   });


