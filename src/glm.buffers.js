// ----------------------------------------------------------------------------
// glm.buffers.js - GLM ArrayBuffer / data views
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

function GLMVector(typ, sz, type32array) {
   type32array = type32array || Float32Array;
   this.type32array = type32array;
   if (!(this instanceof GLMVector)) throw new Error('use new');
   this.glmtype = typ;
   if (!this.glmtype.componentLength) throw new Error('need .componentLength '+[typ, sz, type32array]);
   this.elements = sz && new type32array(sz * typ.componentLength);
   this.length = sz;
}

GLM.$vector = GLMVector;

GLMVector.prototype = {
   set: function(elements) {
      console.warn("GLMVector.prototype.set..." + [this.elements.constructor.name,
                           this.elements.length], 
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
      if ("arr" in this)
         this.arrayize();
      return this;
   },
   arrayize: function() {
      var ele = this.elements;
      //console.warn("ele",typeof ele,ele, this.glmtype.componentLength);
      var arr = this.arr;
      this.arr = [];
      if (arr) {
         for(var i=0;i < arr.length; i++) {
            arr[i] = null;
         }
         arr.length = 0;
         arr = null;
      }
      this.arr = [];
      var cl = this.glmtype.componentLength;
      this.arr.set = [function(offset, x,y) {
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

      var vbs = this.glmtype.BYTES_PER_ELEMENT;
      var vec = this.glmtype;
      var last = ele.buffer.byteLength;
      var type32array = this.type32array;
      var n = this.length;
      for(var i=0; i < n; i++) {
         var offset = ele.byteOffset + i*vbs;
         var next = ele.byteOffset + (i+1)*vbs;
         function dbg() { 
            return JSON.stringify({i:i, eleO: ele.byteOffset, vbs: vbs, offset:offset, next:next, last:last});
         }
         if (offset > last)
            throw new Error('['+i+'] offset '+offset+' > last '+last+' '+dbg());
         if (next > last)
            throw new Error('['+i+'] next '+next+' > last '+last+' '+dbg());
         
         this.arr[i] = null;
         this.arr[i] = (
            function(i,ele) {
               return new vec(
                  new type32array(
                     ele.buffer,
                     offset,
                     cl)
               );
            })(i, this.elements);
      }
      return this;
   },
   fromBuffers: function(DATA) { // [type32array(),type32array()] buffers
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
   }      
};

