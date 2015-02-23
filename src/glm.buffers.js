// ----------------------------------------------------------------------------
// glm.buffers.js - GLM ArrayBuffer / data views
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

function GLMVector(typ, sz, type32array) {
   type32array = type32array || Float32Array;
   this.type32array = type32array;
   if (!(this instanceof GLMVector)) throw new GLM.GLMJSError('use new');
   if (!('function' === typeof typ) || !GLM.$isGLMConstructor(typ)) 
      throw new GLM.GLMJSError('GLMVector.GLMJSError(<class>,...) clazz='+
                               [typeof typ, (typ?typ.$type:typ)]+" // "+
                               GLM.$isGLMConstructor(typ));
   this.glmtype = typ;
   if (!this.glmtype.componentLength) throw new Error('need .componentLength '+[typ, sz, type32array]);
   this.elements = sz && new type32array(sz * typ.componentLength);
   this.length = sz;
}


GLM.$vector = GLMVector;
GLM.$vector.version = '0.0.0';
GLM.$vector.$ = {
   to_string: function(what) { return "$vector<.glmtype="+glm.$isGLMConstructor(what.glmtype)+", .length="+what.length+">"; }
};

GLMVector.prototype = {
   $type: '$vector',
   toString: function() {
      return "[GLMVector .elements=#"+(this.elements&&this.elements.length)+" .elements[0]="+(this.elements&&this.elements[0])+" ->[0]"+(this['->']&&this['->'][0])+"]";
   },
   set: function(elements) { return this.setFromFloats(elements); },
   setFromFloats: function(elements) {
      console.warn("GLMVector.prototype.set..." + [this.elements&&this.elements.constructor.name,
                                                   this.elements&&this.elements.length], 
                   [elements.constructor.name,
                    elements.length]);
//       if (this.elements.length === elements.length) {
//          console.info("REUSE... chrome bug, setting via buffers");
//          var arr = [];
//          for(var i=0; i < elements.length; i+= 16384) {
//             console.warn(i, elements.subarray(i,16384).length);
//             arr.push(elements.subarray(i, 16384));
//          }
//          this.fromBuffers(arr);
//          //this.elements.set(elements);
//       } else {
      {
         this.elements = elements;
      }
      this.length = elements.length / this.glmtype.componentLength;
      if (this.length !== Math.round(this.length))
         throw new Error('$vector.length mismatch '+[this.glmtype.componentLength, this.length, Math.round(this.length), elements]);
      if ("->" in this)
         this.arrayize();
      return this;
   },
   arrayize: function(bSetters) {
      return this._setup({
                            //stride: this.glmtype.BYTES_PER_ELEMENT,
                            //offset: ele.byteOffset,
                            //ele: this.elements,
                            //container: [],
                            setters: bSetters
                         });
   },
   _setup: function(kv) {
      var vec = this.glmtype;
      var type32array = this.type32array;
      var n = this.length;

      var stride = kv.stride || this.glmtype.BYTES_PER_ELEMENT,
      offset = kv.offset || this.elements.byteOffset,
      ele = kv.elements || this.elements,
      container = kv.container || [],
      bSetters = kv.setters || false;
      
//       var ele = this.elements;
      console.warn("ele",typeof ele,ele, this.glmtype.componentLength);
      if (!ele) throw new GLMVector("GLMVector._setup - neither kv.elements nor this.elements...");
      // cleanup
      var arr;
      if (1) {
         arr = this.arr;
         this.arr = [];
         if (arr) {
            for(var i=0;i < arr.length; i++) {
               arr[i] = null;
            }
            arr.length = 0;
            arr = null;
         }
      }
      arr = this.arr = this['->'] = container;
      var cl = this.glmtype.componentLength;
      arr.assign = [function(offset, x,y) {
         var off = cl*offset;
         ele[off+0] = x;
         ele[off+1] = y;
      },function(offset, x,y,z) {
         var off = cl*offset;
         ele[off+0] = x;
         ele[off+1] = y;
         ele[off+2] = z;
      },function(offset, x,y,z,w) {
         var off = cl*offset;
         ele[off+0] = x;
         ele[off+1] = y;
         ele[off+2] = z;
         ele[off+3] = w;
      }][cl-2];

      var last = ele.buffer.byteLength;
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
         var ti = arr[i] = (
            function(i,ele) {
               return new vec(
                  new type32array(
                     ele.buffer,
                     off,
                     cl)
               );
            })(i, ele);
         //ti._index = i;

         if (bSetters) {
            (function(ti,_) {
               Object.defineProperty(
                  arr, i, 
                  {
                     enumerable: true,
                     configurable: false,
                     get: function() { return ti; },//new Function("", "return this["+i+"]"),
                     set: function(v,_) { 
                        //console.warn("setter" + JSON.stringify({i:i,ti:ti,v:v},0,2));
                        ti.copy(v); return;
                        //return ti.elements.set(v.elements);   },//.bind(ti)//new Function("v", "return this["+i+"].copy(v);")
                     }
                  });
             })(ti,i);
         }
      }
      return this;
   },
   setFromBuffers: function(DATA) { // [type32array(),type32array()] buffers
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
               throw new Error('$vector.fromBuffers mismatch '+[off,sl,fa.length]);
            
            fa.set(seg,off);
            off += seg.length;
            //this.elements = fa;
         });
      return off;
   },
   setFromPointer: function(ptr) {
      if(!(ptr instanceof ArrayBuffer)) throw new glm.GLMJSError("unsupported argtype "+[typeof ptr]+" - GLMVector.setFromPointer");
      return this.setFromFloats(new Float32Array(ptr));
   }

      
};

