// ----------------------------------------------------------------------------
// glm.experimental.js - glm-js experimental stuff
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

GLM.exists;

GLM.$vector.exists;

GLM.$make_primitive = function(type, elementer) {
   elementer = elementer || function() { return [].slice.call(arguments); };
   GLM[type] = function(v) {
      if (!(this instanceof glm[type]))
         return new glm[type](v);
      this.elements = elementer.apply(this, arguments);
   };
   GLM[type].$ = {
      to_string: function(what) { return "[GLM."+type+" "+(what.elements&&what.elements[0])+"]"; }
   };
   GLM[type].componentLength = elementer().length;

   GLM[type].prototype = {
      $type: type
   };
   GLM.$types.push(GLM[type].prototype.$type);
   return GLM[type];
};

GLM.$make_primitive("$boolean");
GLM.$make_primitive("$int32", function(i) { return new Int32Array([i]) });

// vector of int32's
GLM.$vint32 = function(sz) {
   if (!(this instanceof glm.$vint32)) 
      return new glm.$vint32(sz);
   sz = sz || 0;
   this.$type = '$vint32';
   this.componentLength = 1;
   this.$typeName = 'vector<int32>';
   this.elements = sz && new Int32Array( sz * this.componentLength );
};
GLM.$vint32.prototype = new GLM.$vector(GLM.$int32, 0, Int32Array);

(function() {
    var ob = GLM.$template.deNify(
       {
          '$vvec<N>': function() {
             GLM.$vvecN = function(sz) {
                if (!(this instanceof glm.$vvecN)) 
                   return new glm.$vvecN(sz);
                //if (sz === undefined) throw new Error('expected vector size');
                sz = sz || 0;
                this.$type = 'vvecN';
                this.componentLength = N;
                this.$typeName = 'vector<vecN>';
                this.elements = sz && new Float32Array( sz * this.componentLength );
             };
             GLM.$vvecN.prototype = new GLM.$vector(GLM.vecN, 0);
          }
       });
    for(var p in ob) {
       GLM.$log('GLM.experimental: '+p);
       ob[p]();
    }
 })();
