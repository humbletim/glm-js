// make chai a little sweeter (and smarter about glm-js objects)
if(typeof chai === 'object' || typeof module.exports === 'object') {
   cane = {
      version: '0.0.0',
      properties: {
         approximate: function() {
            cane.flag(this, 'glm_epsilon', glm.epsilon());
         },
         flatten: function(){
            cane.flag(this, 'glm_flatten', true);
         },
         euler: function() { cane.flag(this, "glm_eulers", true); },
         degrees: function() { cane.flag(this,'object', glm.degrees(cane.flag(this,'object'))); }
      },
      methods: {
         euler: function(g) { return new chai.Assertion(glm.degrees(glm.eulerAngles(cane.flag(this, 'object')))[g]); },
         approximately: function (value, delta) {
            var obj = cane.flag(this,'object');
            if (typeof value === 'number') {
               value = [value];
               obj = [obj];
            }
            if (!value) throw new Error('!value '+value);
            return value.map(
               function(value,_) { 
                  //glm.$log(this,Array.isArray(value), value, delta);
                  return expect(this[_]).to.be.closeTo(value, delta);
               }.bind(obj)
            );
         },
         degrees: function(d) { 
            return this.to.be.approximately(d, glm.degrees(glm.epsilon()));
         },
         into: function (s) { 
            expect(glm.$to_array(this._obj).join("")).to.equal(s);
         },
         glm_eq: function (arr, ep) {
            var obj = cane.flag(this,'object');
            var message = cane.flag(this,"message") || "";
            var not = cane.flag(this,'negate');
            ep = ep || cane.flag(this, 'glm_epsilon');

            expect(obj).to.have.property("$type");
            if (cane.flag(this, "glm_eulers")) {
               obj = (glm.eulerAngles(obj));
               var ss = JSON.stringify(glm.$to_array(obj));
               expect(obj[0],message+" "+ss+"[0]").to.be.degrees(arr[0]);
               expect(obj[1],message+" "+ss+"[1]").to.be.degrees(arr[1]);
               expect(obj[2],message+" "+ss+"[2]").to.be.degrees(arr[2]);
               return;
            }
            //          if (cane.flag(this, "glm_degrees")) {
            //             obj = glm.degrees(obj);
            //          }
            
            if (ep) {
               glm.$to_array(obj).map(
                  function(v, _) {
                     expect(v,message).to[not ? 'not' : 'be'].be.closeTo(arr[_],ep);
                  });
               return true;
            }
            if (not)
               return expect(glm.$to_array(obj),message).to.not.eql(arr);
            return expect(glm.$to_array(obj),message).to.eql(arr);
         },

         roughly: function(d) { 
            return this.to.be.approximately(d, glm.epsilon());
         },
         glsl: function(g, precision) { 
            return expect(glm.$to_glsl(this._obj, precision)).to.equal(g);
         }
      },
      sugar: function(_chai, utils) {
         var self = cane;
         self.flag = utils.flag;
         if (typeof glm === 'object') {
            for(var p in self.properties)
               _chai.Assertion.addProperty(p, self.properties[p]);
            for(var p in self.methods) {
               //console.debug("addMethod", p);
               if (p in self.properties) // chainableMethod
                  _chai.Assertion.addChainableMethod(p, self.methods[p], self.properties[p]);
               else
                  _chai.Assertion.addMethod(p, self.methods[p]);
            }
         } // glm
         self.checkForDirectInvocation();
         return self.patchChai(_chai);
      },
      patchMochaUtils: function(utils) {
         // mocha patches to make exception reports prettier
         if (typeof glm !== 'object')
            return utils;
         // tested with Mocha version 2.1.0
         return (function(utils) {
                    utils.stringify = (
                       function(original) {
                          return function(obj) {
                             if (glm.$isGLMObject(obj)) return obj+'';
                             return original(obj);
                          };
                       })(utils.stringify);
                    return utils;
                 })(utils);
      },
      patchChai: function(chai) {
/**
 * ### config.toDisplayObject
 *
 * User configurable property, influences rendered object
 * as part of `getMessage` / `.objDisplay` processing.
 * eg: config.toDisplayObject = 
 *        function(obj) { return obj.repr ? obj.repr() : obj; }
 *
 * @param {Function}
 * @api public
 */
         chai.config.toDisplayObject = function(obj) {
            if (obj instanceof Array)
               return obj+'';
            if (typeof glm === 'object' && glm.$isGLMObject(obj))
               return glm.to_string(obj);
            return obj;
         };

         // tested with Chai version 1.10.0
         chai.use(
            function(_chai, utils) {
               // "re-compile" utils.getMessage to use utils.* refs
               with(utils)
                  getMessage = eval('1,'+getMessage);
               
               // monkey-patch utils.objDisplay(obj) function...
               utils.objDisplay = (
                  function(original) {
                     return function(obj) {
                        if (_chai.config.toDisplayObject)
                           obj = _chai.config.toDisplayObject(obj);// + "#####\n" + original(obj);
                        return original(obj);
                     };
                  })(utils.objDisplay);
            });
      },
      testMonkeyPatches: function(mocha_utils) {
         describe('monkey-patches', function() {
                     it('mocha_utils.stringify', function() {
                           expect(mocha_utils.stringify(glm.vec3())).to.equal('fvec3(0.000000, 0.000000, 0.000000)');
                        });
                     if (chai.config.toDisplayObject) 
                        it('chai.config.toDisplayObject', function() {
                              expect(function() {
                                        expect(glm.vec3()).to.equal(null);
                                     }).to['throw'](/expected \'fvec3.0.00000.*? to equal.*?null/);
                           });
                  });
      },
      checkForDirectInvocation: function(force) {
         // workaround to enable direct invocation via node/spidermonkey cli
         if (force || 
             (typeof process === 'object' && 
              process.versions && 
              process.versions.node) ||
             (typeof _ENV === 'object' && 
              /spidermonkey/.test(_ENV._VERSION))
            ) {
            try {
               describe.exists;
            } catch(e) {
               console.warn("... direct invocation detected; rigging Mocha run");
               var _Mocha = typeof Mocha === 'function' ? Mocha : require('mocha');
               var mocha = new Mocha();
               mocha.ui('bdd').enableTimeouts(false).reporter("list").bail(true);
               var api={};
               mocha.suite.emit('pre-require', api);
               describe = api.describe, it = api.it;
               setTimeout(
                  function() {
                     mocha.run(function(failures) { console.warn(failures); });
                  });
            }
         }
      }
   };

   console.warn("glm chai cane sugar: "+cane.version);
   try { module.exports = cane; } catch(e) { }
}
