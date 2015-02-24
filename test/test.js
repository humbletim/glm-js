try { chai.exists; } catch(e) {
   chai = require('chai') ;
}

should = chai.should();
expect = chai.expect;

glm = require("../src/glm-js") || glm;
//require("../src/glm.buffers");
//glm.$log(glm.$vector.version);

glm.$log('glm: '+glm);
glm.$log('chai: '+chai);
glm.$log('should: '+should);

// workaround to enable direct invocation via node cli
var atexit;
try {
   describe.exists;
} catch(e) {
   var Mocha = require('mocha');
   var mocha = new Mocha();
   mocha.ui('bdd');
   var api={};
   mocha.suite.emit('pre-require', api);
   //for(var p in api)eval(p+"=api[p]");
   describe = api.describe, it = api.it;
   atexit = function() {
      mocha.run(function(failures) { console.warn(failures); });
   };
}
glm.vec3.prototype.toJSON=function() { return {x: this.x, y: this.y, z: this.z}; };

// tested with Mocha version 2.1.0
var mocha_utils = 
   (function(utils) {
       utils.stringify = (
          function(original) {
             return function(obj) {
                if (glm.$isGLMObject(obj)) return obj+'';
                return original(obj);
             };
          })(utils.stringify);
       return utils;
    })(this.Mocha ? this.Mocha.utils : require("mocha").utils);

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
if(1)chai.config.toDisplayObject = function(obj) {
   if (obj instanceof Array)
      return obj+'';
   if (glm.$isGLMObject(obj))
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
                  obj = _chai.config.toDisplayObject(obj);
               return original(obj);
            };
         })(utils.objDisplay);
   });

describe('monkey-patches', function() {
            it('mocha_utils.stringify', function() {
                  expect(mocha_utils.stringify(glm.vec3())).to.equal('fvec3(0.000000, 0.000000, 0.000000)');
                 });
            if (chai.config.toDisplayObject) it('chai.config.toDisplayObject', function() {
                  expect(function() {
                            expect(glm.vec3()).to.equal(null);
                         }).to['throw']("expected 'fvec3(0.000000, 0.000000, 0.000000)' to equal null");
                 });
         });
//console.warn('mocha: ',mocha);
//console.warn('describe: ',describe);

var cane = {
   properties: {
      approximate: function() {
         cane.flag(this, 'glm_epsilon', true);
      },
      flatten: function(){
         cane.flag(this, 'glm_flatten', true);
      },
      euler: function() { cane.flag(this, "glm_eulers", true); }
   },
   methods: {
      euler: function(g) { return new chai.Assertion(glm.degrees(glm.eulerAngles(cane.flag(this, 'object')))[g]); },
      approximately: function (value, delta) {
         return this.closeTo(value, delta);
         //return expect(this._obj, 'to be approximately ' + value + " ±" + delta)
         //.within(value-delta, value+delta);
      },
      degrees: function(d) { 
         return this.to.be.approximately(d, glm.degrees(glm.epsilon()));
      },
      
      into: function (s) { 
         expect(glm.$to_array(this._obj).join("")).to.equal(s);
      },
      glm_eq: function (arr) {
         var obj = cane.flag(this,'object');
         expect(obj).to.have.property("$type");
         if (cane.flag(this, "glm_eulers")) {
            obj = glm.degrees(glm.eulerAngles(obj));
            var ss = JSON.stringify(glm.$to_array(obj));
            expect(obj[0],ss+"[0]").to.be.degrees(arr[0]);
            expect(obj[1],ss+"[1]").to.be.degrees(arr[1]);
            expect(obj[2],ss+"[2]").to.be.degrees(arr[2]);
            return;
         }
         
         if (cane.flag(this,'negate'))
            return expect(glm.$to_array(obj)).to.not.eql(arr);
         return expect(glm.$to_array(obj)).to.eql(arr);
      },

      roughly: function(d) { 
         return this.to.be.approximately(d, glm.epsilon());
      },
      glsl: function(g) { 
         return expect(glm.to_glsl(this._obj)).to.equal(g);
      }
   },
   sugar: function(_chai, utils) {
      var self = cane;
      self.flag = utils.flag;
      for(var p in self.properties)
         _chai.Assertion.addProperty(p, self.properties[p]);
      for(var p in self.methods) {
         console.warn("addMethod", p);
         if (p in self.properties) // chainableMethod
            _chai.Assertion.addChainableMethod(p, self.methods[p], self.properties[p]);
         else
            _chai.Assertion.addMethod(p, self.methods[p]);
      }
      return _chai;
   }
};

chai.use(cane.sugar);

describe('glm', function(){
            describe('common', function(){
                        it('module props', function(){
                              expect(glm.version).to.be.a('string');
                              expect(glm.version).to.match(/\d\.\d\.\d/);
                              expect(glm.vendor).to.be.an('object');
                              expect(glm.vendor.vendor_version).to.be.a('string');
                           });
                        it('.$outer', function() {
                              
                              var q = glm.quat(glm.radians(glm.vec3(15,-16,170)));
                              expect(glm.to_string(glm.degrees(glm.$outer._vec3_eulerAngles(q)),1))
                                 .to.equal('fvec3(15.0, -16.0, 170.0)');

                              // this triggers the atan2 edge case
                              var B=glm.quat(glm.radians(glm.vec3(45,90,-45)));
                              B.y += glm.epsilon();
                              B = glm.normalize(B);
                              expect(glm.to_string(glm.degrees(glm.$outer._vec3_eulerAngles(B)),1))
                                 .to.equal('fvec3(0.0, 90.0, -90.0)');
                              
                              // shameless invocations for code coverage testing
                              "log,debug,info,warn,error,write"
                              .split(',').forEach(function(p) { glm.$outer.console[p](p); });

                              expect(glm.$outer.mat4_angleAxis(glm.radians(45), glm.vec3(0,1,0)),
                                     '$outer.mat4_angleAxis').to.be.instanceOf(glm.mat4);

                           });
                        it('$toString(s,s,s) exception', function() {
                              expect(function() {
                                        glm.$toString("prefix","what","props");
                                     }).to['throw'](/unsupported argtype/);
                           });
                        it('$toString(s,s,[s]) exception', function() {
                              expect(function() {
                                        glm.$toString("prefix","what",["substr"]);
                                     }).to['throw'](/!toFixed/);
                           });
                        it('$toString(s,s,[len],N) exception', function() {
                              expect(glm.$toString("prefix","what",["length"],0)).to.equal('prefix(4)');
                              expect(glm.$toString("prefix","what",["length"],1)).to.equal('prefix(4.0)');
                              expect(glm.$toString("prefix","what",["length"],3)).to.equal('prefix(4.000)');
                              expect(glm.$toString("prefix","what",["length"],4)).to.equal('prefix(4.0000)');
                              expect(glm.$toString("prefix",{e:glm.epsilon()},["e"],7)).to.equal('prefix(0.0000010)');
                           });
                        it('$sizeof', function() {
                              expect("vec2,vec3,vec4,quat,mat3,mat4".split(',')
                                     .map(function(p){return glm[p]})
                                     .map(glm.$sizeof)
                                    ).to.eql( [ 8, 12, 16, 16, 36, 64 ]);
                           });
                        it('.BYTES_PER_ELEMENT', function() {
                              expect("vec2,vec3,vec4,quat,mat3,mat4".split(',')
                                     .map(function(p){return glm[p].BYTES_PER_ELEMENT})
                                    ).to.eql( [ 8, 12, 16, 16, 36, 64 ]);
                           });
                        it('$isGLMConstructor', function() {
                              expect("vec2,vec3,vec4,uvec4,quat,mat3,mat4".split(',')
                                     .map(function(p){return glm[p]})
                                     .map(glm.$isGLMConstructor)
                                     .map(Boolean)
                                     .join(",")
                                    ).to.equal( "true,true,true,true,true,true,true" );
                              expect([ Object, Array, [], 0, null, this, true, "" ]
                                     .map(glm.$isGLMConstructor)
                                     .join(",")
                                    ).to.equal( "false,false,false,false,false,false,false,false" );
                           });
                        it('$isGLMObject', function() {
                              expect("vec2,vec3,vec4,uvec4,quat,mat3,mat4".split(',')
                                     .map(function(p){return glm[p]()})
                                     .map(glm.$isGLMObject)
                                     .map(Boolean)
                                     .join(",")
                                    ).to.equal( "true,true,true,true,true,true,true" );
                              expect([ Object, Array, [], 0, null, this, true, "" ]
                                     .map(glm.$isGLMObject)
                                     .join(",")
                                    ).to.equal( "false,false,false,false,false,false,false,false" );

                              // not sure if i'll switch to just return a boolean,
                              // or let it continue return the type like it does currently...
                              expect("vec2,vec3,vec4,quat,mat3,mat4".split(',')
                                     .map(function(p){return glm[p]()})
                                     .map(glm.$isGLMObject)
                                     .join(",")
                                    ).to.equal( "vec2,vec3,vec4,quat,mat3,mat4" );
                           });
                        describe("JSON", function() {
                                    it('$to_object', function() {
                                          expect(glm.$to_object(glm.vec2())).to.eql({"x":0,"y":0});
                                          expect(glm.$to_object(glm.uvec4(1,2,3,4))).to.eql({"x":1,"y":2,"z":3,"w":4});
                                          expect(glm.$to_object(glm.mat3(2))).to.eql({"0":{"x":2,"y":0,"z":0},"1":{"x":0,"y":2,"z":0},"2":{"x":0,"y":0,"z":2}});
                                          expect(glm.$to_object(glm.quat(1,2,3,4))).to.eql({ w: 1, x: 2, y: 3, z: 4 });
                                          expect(glm.$to_object(glm.quat())).to.eql({ w: 1, x: 0, y: 0, z: 0 });
                                       });
                                    it('$to_json', function() {
                                          expect(glm.$to_json(glm.vec3())).to.equal('{"x":0,"y":0,"z":0}');
                                          expect(glm.$to_json(glm.vec4(1,2,3,4))).to.equal('{"x":1,"y":2,"z":3,"w":4}');
                                          expect(glm.$to_json(glm.mat4(2))).to.equal('{"0":{"x":2,"y":0,"z":0,"w":0},"1":{"x":0,"y":2,"z":0,"w":0},"2":{"x":0,"y":0,"z":2,"w":0},"3":{"x":0,"y":0,"z":0,"w":2}}');
                                       });
                                 });

                        describe("glsl", function() {
                                    it('to_glsl', function() {
                                          expect(glm.to_glsl(glm.vec3(1))).to.equal('vec3(1)');
                                          expect(glm.to_glsl(glm.vec3(1,2,3))).to.equal('vec3(1,2,3)');
                                          expect(glm.to_glsl(glm.mat4(0))).to.equal('mat4(0)');
                                          expect(glm.to_glsl(glm.mat3(1))).to.equal('mat3(1)');
                                          expect(glm.to_glsl(glm.mat3(2))).to.equal('mat3(2)');
                                          expect(glm.to_glsl(glm.mat3(-2))).to.equal('mat3(-2)');
                                          expect(glm.to_glsl(glm.uvec4(0))).to.equal('uvec4(0)');
                                       });
                                    
                                    it('from_glsl', function() {
                                          expect(glm.from_glsl('vec3(1)')).to.glm_eq([1,1,1]);
                                          expect(glm.from_glsl('mat4(1)')).to.glm_eq(glm.$to_array(glm.mat4(1)));
                                          expect(glm.from_glsl('vec2(0,3)')).to.glm_eq(glm.$to_array(glm.vec2(0,3)));
                                          expect(glm.from_glsl('vec4(0,3,2)')).to.glm_eq(glm.$to_array(glm.vec4(0,3,2,2)));
                                          expect(glm.from_glsl("mat3(1,2,3,4,5,6,7,8,9)"))
                                             .to.glm_eq("123456789".split('').map(Number));
                                          expect(glm.from_glsl("mat4(1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6)"))
                                             .to.glm_eq("1234567890123456".split('').map(Number));

                                       });
                                 });
                        it('to_string', function() {
                              expect(
                                 glm.to_string({$type:'asdf'})
                              ).to.match(/unsupported argtype/);
                              expect(
                                 glm.to_string({$type:'version'})
                              ).to.match(/missing [.][$]/);
                              var old = GLM.FAITHFUL;
                              GLM.FAITHFUL = !GLM.FAITHFUL;
                              expect(
                                 glm.to_string(glm.vec3())
                              ).to.equal('fvec3(0.000000, 0.000000, 0.000000)');
                              expect(
                                 glm.to_string(glm.vec3(),0)
                              ).to.equal('fvec3(0, 0, 0)');
                              GLM.FAITHFUL = old;

                              expect(glm.to_string(5)).to.equal("float(5.000000)");
                              expect(glm.to_string(5,1)).to.equal("float(5.0)");
                              
                              var q = glm.quat(glm.radians(glm.vec3(15,-16,170)));
                              expect(glm.to_string(glm.degrees(glm.eulerAngles(q)),1))
                                 .to.equal('fvec3(15.0, -16.0, 170.0)');
                              
                              expect(glm.to_string("cheese")).to.equal("cheese");
                           });
                     });

            var qq;
            describe('...', function() {
                        it('.epsilon', function() {
                              glm.epsilon().should.be.lessThan(1e-5);
                           });
                        it('.degrees', function() {
                              expect(glm.degrees(Math.PI/6)).to.be.degrees(30);
                              var v = glm.vec3([1,2,3].map(glm.radians));
                              expect(glm.degrees(v)).to.glm_eq([1,2,3]);
                           });
                        it('.radians', function() {
                              expect(glm.radians(45)).to.be.roughly(0.7853981633974483);
                              var v = glm.vec3([1,2,3].map(glm.degrees));
                              expect(v).not.to.glm_eq([1,2,3]);
                              expect(glm.radians(v)).to.glm_eq([1,2,3]);
                              expect(glm.radians(0)).to.equal(0);
                           });
                        it('.rotate<mat4>', function() {
                              var UP = glm.vec3(0,1,0);
                              var angle = glm.radians(45);
                              var ref = glm.toMat4(glm.angleAxis(angle, UP));
                              //ref[0].x++;
                              expect( 
                                 glm.rotate(glm.mat4(), glm.radians(45), UP)
                              )
                                 .to.eql(ref);//glm_eq(glm.$to_array(glm.toMat4()));
                           });
                        it('.scale', function() {
                              expect(glm.scale(glm.mat4(), glm.vec3(1,2,3)))
                                 .to.flatten.into('1000020000300001')
                           });
                        it('.angleAxis', function() {
                              qq = glm.angleAxis(glm.radians(45.0), glm.vec3(0,1,0));
                              expect(qq).to.glm_eq([ 0, 0.3826834261417389, 0, 0.9238795042037964 ]);
                              expect(glm.degrees(glm.eulerAngles(qq)[1])).to.approximate.degrees(45.0);
                              expect(qq).euler.to.glm_eq([0,45,0]);
                           });
                        it('.mix<float>', function() {
                              expect(glm.mix(0,.5,.25)).to.equal(.125);
                              expect(glm.mix(0,0,0)).to.equal(0);
                           });
                        it('.clamp<float>', function() {
                              expect(glm.clamp(0,.25,.5)).to.equal(.25);
                              expect(glm.clamp(1,.25,.5)).to.equal(.5);
                           });
                        it('.clamp<vec2>', function() {
                              expect(glm.clamp(glm.vec2(0),.25,.5)).to.glm_eq([.25,.25]);
                           });
                        it('.min', function() {
                              expect(glm.min(0,.5)).to.equal(0);
                           });
                        it('.max', function() {
                              expect(glm.max(0,.5)).to.equal(.5);
                           });
                        it('._sign', function() {
                              var e = glm.epsilon();
                              // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
                              expect([ 3, -3, '-3', 0, -0, NaN, 'foo', undefined ]
                                     .map(glm._sign)).to.eql(
                                        [ 1, -1, -1, 0, -0, NaN, NaN, NaN ]);
                           });
                        if ("sign" in Math) {
                           it('Math.sign sanity check', function() {
                                 var e = glm.epsilon();
                                 expect([ 3, -3, '-3', 0, -0, NaN, 'foo', undefined ]
                                        .map(Math.sign)).to.eql(
                                           [ 1, -1, -1, 0, -0, NaN, NaN, NaN ]);
                              });
                        }
                        it('.sign', function() {
                              var e = glm.epsilon();
                              expect([ 3, -3, '-3', 0, -0, NaN, 'foo', undefined ]
                                     .map(glm.sign)).to.eql(
                                        [ 1, -1, -1, 0, -0, NaN, NaN, NaN ]);
                           });
                        
                        it('.mix<vec2>', function() {
                              expect(glm.mix(glm.vec2(1,2), glm.vec2(2,1), .5)).to.be.glsl('vec2(1.5)');
                           });
                        it('.mix<quat>', function() {
                              var qa = glm.angleAxis(glm.radians(45), glm.vec3(0,1,0));
                              var qb = glm.angleAxis(glm.radians(-35), glm.vec3(0,1,0));
                              var x = expect(function(){qa._x}).to['throw'](/erroneous quat._x/);
                              expect(glm.mix(qa, qb, .5)).euler.to.be.glm_eq([0,(45-35)/2,0]);
                              expect(glm.mix(qa, qb, .1)).euler.to.be.glm_eq([0,(45*.9+-35*.1),0]);

                              var qc = qa['*'](qb);
                              expect(qa).euler.to.glm_eq([0,45,0]);
                              expect(qb).euler.to.glm_eq([0,-35,0]);
                              expect(qc).euler.to.glm_eq([0,10,0]);
                              expect(qc['*'](qa)).euler.to.glm_eq([0,55,0]);
                              A=glm.quat(glm.radians(glm.vec3(45,90,45)));
                              B=glm.quat(glm.radians(glm.vec3(45,90,45)));
                              B.y+=glm.epsilon();
                              B = glm.normalize(B);
                              expect(glm.mix(A,B,.5)).euler(1).to.be.approximately(90,.02);
                           });

                        it('.using_namespace<func>', function() {
                              uvec4 = 5;
                              glm.using_namespace(
                                 function(){
                                    vec3().should.be.instanceOf(vec3);
                                    uvec4().should.be.instanceOf(uvec4);
                                    length(vec4(1)).should.equal(2);
                                 });
                              delete uvec4;
                           });
                     });

            describe('meta', function() {
                        it('$to_array', function() {
                              glm.$to_array({elements:[]}).length.should.equal(0);
                              glm.$to_array({elements:[1]}).length.should.equal(1);
                              glm.$to_array({elements:[1,2,3,4,5]}).length.should.equal(5);
                           });
                        it('$template', function() {
                              expect(glm.$template).to.be.an('object');
                           });
                        it('operators', function() {
                              expect(glm.$to_array(glm.vec3(1).sub(glm.vec3(2,1,2)))).to.eql([-1,0,-1]);
                              expect(glm.$to_array(glm.vec2(1)['-'](glm.vec2(2,2)))).to.eql([-1,-1]);
                              expect(glm.$to_array(glm.vec3(1)['+'](glm.vec3(2)))).to.eql([3,3,3]);
                              expect(glm.$to_array(glm.vec4(2.5,-.5,Math.PI,0).add(glm.vec4(-2.5,.5,-Math.PI,-0)))).to.eql([0,0,0,0]);
                           });
                     });
            
            describe('mat3', function() {
                        it('core operations', function() {
                              expect(glm.mat3()).to.flatten.into('100010001');
                              var a = glm.mat3(1);
                              var b = glm.mat3(2);
                              a.copy(b);
                              expect(a).to.flatten.into('200020002');
                              expect(b).to.flatten.into('200020002');
                              expect(function() { glm.mat3({}); }).to['throw'](/unrecognized object passed to .*?\bmat3/);
                              expect(function() { glm.mat3(null); }).to['throw'](/unrecognized object passed to .*?\bmat3/);
                              expect(glm.mat3([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]))
                                 .to.glm_eq([ 0, 1, 2, 
                                              4, 5, 6, 
                                              8, 9, 10 ]);
                              expect(glm.to_string(glm.mat3(4))).to.equal('mat3x3((4.000000, 0.000000, 0.000000), (0.000000, 4.000000, 0.000000), (0.000000, 0.000000, 4.000000))');
                           });
                        it('clone', function() {
                              var a = glm.mat3(1);
                              var b = a.clone();
                              expect(a).not.to.equal(b);
                              expect(a).to.eql(b);
                           });
                     });


            //var qspin = glm.angleAxis(Math.PI,glm.vec3(0,1,0));
            var qspin = new glm.quat([ 0, 1, 0, 6.123031769111886e-17 ]);
            describe('mat4', function() {
                        it('core operations', function() {
                              expect( glm.mat4() ).to.flatten.into('1000010000100001');
                              glm.$to_array(glm.mat4(glm.mat3(3))).join("").should.equal('3000030000300001');
                              expect( glm.mat4(glm.mat3(3)) ).to.flatten.into('3000030000300001');
                              //expect( glm.toMat4(qspin) ).to.be.glsl("234");
                              glm.toMat4(qspin).toString().should.equal('mat4x4(\n\t(-1.000000, 0.000000, -0.000000, 0.000000), \n\t(0.000000, 1.000000, 0.000000, 0.000000), \n\t(0.000000, 0.000000, -1.000000, 0.000000), \n\t(0.000000, 0.000000, 0.000000, 1.000000)\n)');

                              glm.to_string(glm.toMat4(qq)).should.equal('mat4x4((0.707107, 0.000000, -0.707107, 0.000000), (0.000000, 1.000000, 0.000000, 0.000000), (0.707107, 0.000000, 0.707107, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');

                              glm.mat4().mul(glm.mat4()).should.be.instanceOf(glm.mat4);

                              expect(function() { glm.mat4({}); }).to['throw'](/unrecognized object passed to .*?\bmat4/);
                              expect(function() { glm.mat4(null); }).to['throw'](/unrecognized object passed to .*?\bmat4/);
                              expect(function() { glm.mat4(undefined); }).to['throw'](/no template found for mat4[.][$][.]undefined1/);
                              expect(glm.mat4(0,1,2,3,
                                              4,5,6,7,
                                              8,9,10,11,
                                              12,13,14,15))
                                 .to.glm_eq([0,1,2,3,
                                             4,5,6,7,
                                             8,9,10,11,
                                             12,13,14,15]);
                              
                              expect(glm.mat4([0,1,2,3,
                                              4,5,6,7,
                                              8,9,10,11,
                                              12,13,14,15]))
                                 .to.glm_eq([0,1,2,3,
                                             4,5,6,7,
                                             8,9,10,11,
                                             12,13,14,15]);
                              
                           });
                        it('invert tranpose', function() {
                              glm.to_string(glm.transpose(glm.inverse(glm.mat4(qq)))).should.equal('mat4x4((0.707107, 0.000000, -0.707107, 0.000000), (0.000000, 1.000000, 0.000000, 0.000000), (0.707107, 0.000000, 0.707107, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');
                           });
                       
                        it('multiply neatly', function() {
                              var a = glm.toMat4(glm.angleAxis(glm.radians(60), glm.vec3(0,0,1)));
                              var b = glm.toMat4(glm.angleAxis(glm.radians(45), glm.vec3(0,1,0)));
                              expect(glm.to_string(a)).to.equal('mat4x4((0.500000, 0.866025, 0.000000, 0.000000), (-0.866025, 0.500000, 0.000000, 0.000000), (0.000000, 0.000000, 1.000000, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');
                              expect(glm.to_string(b)).to.equal('mat4x4((0.707107, 0.000000, -0.707107, 0.000000), (0.000000, 1.000000, 0.000000, 0.000000), (0.707107, 0.000000, 0.707107, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');
                              expect(glm.to_string(a['*'](b)), 'normal mul').to.equal( 'mat4x4((0.353553, 0.612372, -0.707107, 0.000000), (-0.866025, 0.500000, 0.000000, 0.000000), (0.353553, 0.612372, 0.707107, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))' );
                              a['*='](b);
                              expect(glm.to_string(a),'mul_eq').to.equal( 'mat4x4((0.353553, 0.612372, -0.707107, 0.000000), (-0.866025, 0.500000, 0.000000, 0.000000), (0.353553, 0.612372, 0.707107, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');
                              expect(glm.to_string(b)).to.equal('mat4x4((0.707107, 0.000000, -0.707107, 0.000000), (0.000000, 1.000000, 0.000000, 0.000000), (0.707107, 0.000000, 0.707107, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');
                           });
                     });


            describe('quat', function() {
                        it('THREE', function() {
                              var mots=glm.radians(glm.vec3(15,15,15));
                              if (typeof THREE === 'object') {
                                 var te = new THREE.Euler(mots[0],mots[1],mots[2]);
                                 var tq = new THREE.Quaternion().setFromEuler(te);
                                 //expect(glm.to_string(q,3),'asdf').to.equal(glm.to_string(glm.quat(tq),3));
                                 expect(glm.to_string(glm.quat(tq),3),'THREE').to.equal(glm.to_string(glm.quat(glm.$outer.quat_array_from_xyz(mots)),3));
                              }
                              expect(glm.to_string(
                                        glm.quat(glm.$outer.quat_array_from_xyz(mots)),3)
                                    ).to.equal(
                                       '<quat>fvec3(18.639, 10.049, 18.639)'
                                    );

                           });
                        it('core operations', function() {
                              expect(glm.quat()).to.glm_eq([0,0,0,1]);
                              glm.$to_array(glm.quat()).should.eql([0,0,0,1]);
                              glm.to_string(glm.quat()).should.equal('<quat>fvec3(0.000000, 0.000000, 0.000000)');
                              expect(glm.quat()).to.euler(1).be.degrees(0);
                              expect(glm.quat(glm.quat())).to.glm_eq([0,0,0,1]);
                              expect(function(){glm.quat({})}).to['throw'](/unrecognized object passed to.*?\bquat/);
                              expect(function(){glm.quat(null)}).to['throw'](/unrecognized object passed to.*?\bquat/);
                              expect(function(){glm.quat(0)}).to['throw'](/only quat.1. syntax supported/);
                              expect(glm.quat(glm.vec3())).to.glm_eq([0,0,0,1]);
                              expect(glm.quat(glm.vec3(glm.radians(3)))).euler.to.glm_eq([3,3,3]);
                              expect(glm.quat(glm.radians(glm.vec3(15,30,45)))).euler.to.glm_eq([15,30,45]);
                              expect(glm.normalize(glm.quat({w:.8,x:.2,y:.2,z:.2}))).euler.to.glm_eq([33.69006,18.40848,33.69006]);
                              
                           });
                        it('core operations, more', function(){
                              var aa = glm.angleAxis(glm.radians(45.0),glm.vec3(0,1,0));;
                              glm.length(aa).should.be.approximately(1,.1);
                              glm.to_string(glm.toMat4(aa)).should.equal('mat4x4((0.707107, 0.000000, -0.707107, 0.000000), (0.000000, 1.000000, 0.000000, 0.000000), (0.707107, 0.000000, 0.707107, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))')
                              var q = glm.quat(glm.toMat4(aa));
                              glm.to_string(glm.eulerAngles(q)).should.equal('fvec3(0.000000, 0.785398, 0.000000)');
                              expect(q).euler.to.glm_eq([0,45,0]);
                           });
                        it('core operations, yet more', function(){
                              glm.to_string(glm.toMat4(glm.normalize(glm.quat(1,0,1,0)))).should.equal('mat4x4((0.000000, 0.000000, -1.000000, 0.000000), (0.000000, 1.000000, 0.000000, 0.000000), (1.000000, 0.000000, 0.000000, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');

                           });
                        it('core operations, as a mat4 too', function() { 
                              glm.to_string(glm.toMat4(qq)[0]).should.equal('fvec4(0.707107, 0.000000, -0.707107, 0.000000)');
                              glm.to_string(glm.toMat4(qq)[2]).should.equal('fvec4(0.707107, 0.000000, 0.707107, 0.000000)');
                              glm.to_string(glm.toMat4(qq).mul(glm.vec4(1,2,3,1)))
                                 .should.equal('fvec4(2.828427, 2.000000, 1.414214, 1.000000)');
                           });
                        it('length2ify', function(){ 
                              glm.length2(glm.angleAxis(Math.PI/3,glm.vec3(0,1,0))).should.be.approximately(1,.001);
                           });
                        it('inversify', function(){ 
                              var Q = glm.angleAxis(Math.PI/3,glm.vec3(0,1,0));
                              glm.degrees(glm.eulerAngles(Q)[1]).should.be.approximately(60,glm.degrees(glm.epsilon()));
                              expect(Q).euler.to.glm_eq([0,60,0]);
                              glm.inverse(Q);
                              // ^^ should not modify Q
                              expect(Q).euler.to.glm_eq([0,60,0]);
                              //glm.degrees(glm.eulerAngles(Q)[1]).should.be.approximately(60,glm.degrees(glm.epsilon()));
                              Q=glm.inverse(Q);
                              expect(Q).euler.to.glm_eq([0,-60,0]);
                              //glm.degrees(glm.eulerAngles(Q)[1]).should.be.approximately(-60,glm.degrees(glm.epsilon()));
                              glm.degrees(glm.eulerAngles(Q)[1]).should.be.approximately(-60,glm.degrees(glm.epsilon()));
                              Q.should.be.instanceOf(glm.quat);
                           });
                        it('multiply', function() {
                              var a = glm.angleAxis(glm.radians(45), glm.vec3(0,1,0));
                              var b = glm.angleAxis(glm.radians(-45), glm.vec3(0,1,0));
                              expect(a['*'](b)).euler.to.glm_eq([0,0,0]);
                              expect(a).euler.to.glm_eq([0,45,0]);
                              expect(a['*='](a)).euler(1).to.be.approximately(90,.1);
                              expect(a).euler(1).to.be.approximately(90,.1);

                           });
                        it('copy/assign', function() {
                              expect(glm.quat(1)['='](glm.angleAxis(glm.radians(45), glm.vec3(0,0,1))))
                                 .euler.to.glm_eq([0,0,45]);
                           });
                     });

            describe('vec2', function(){
                        it('core operations', function(){
                              glm.vec2().should.be.instanceOf(glm.vec2);
                              expect(glm.vec2(1,2)).to.glm_eq([1,2]);
                              expect(glm.vec2(1,1)).to.glm_eq([1,1]);
                              glm.vec2(1,2).toString().should.equal('fvec2(1.000000, 2.000000)');
                              glm.vec2(1).toString().should.equal('fvec2(1.000000, 1.000000)');
                              glm.vec2().toString().should.equal('fvec2(0.000000, 0.000000)');
                              expect(glm.vec2(glm.vec3(3,2,1))).to.glm_eq([3,2]);
                              expect(glm.vec2(glm.vec4(3,2,1,0))).to.glm_eq([3,2]);
                           });
                        it('multiply by a scalar', function(){
                              glm.vec2(1).mul(2).should.be.instanceOf(glm.vec2);
                              glm.$to_array(glm.vec2(1,2).mul(2)).should.eql([2,4]);
                              expect(glm.vec2(1,2).mul(2)).to.glm_eq([2,4]);
                              var v = glm.vec2(2,3);
                              expect(v).to.glm_eq([2,3]);
                              expect(v['*'](3)).to.glm_eq([6,9]);
                              expect(v).to.glm_eq([2,3]);
                              glm.$to_array(v['*'](3)).should.eql([6,9]);
                              expect(v['*='](3)).to.glm_eq([6,9]);
                              expect(v).to.glm_eq([6,9]);
                           });
                        it('inplace multiply by a scalar', function(){ 
                              var v2 = glm.vec2(Math.PI);
                              glm.$to_array(v2['*'](1/Math.PI)).should.eql([1,1]);
                              expect(v2).to.not.glm_eq([1,1]);
                              glm.$to_array(v2['*='](1/Math.PI)).should.eql([1,1]);
                              glm.$to_array(v2).should.eql([1,1]);
                           });
                        it('lengthify', function(){ 
                              glm.length(glm.vec2(Math.PI)).should.be.approximately(4.44,.1);
                           });
                        it('length2ify', function(){ 
                              glm.length2(glm.vec2(Math.PI)).should.be.approximately(19.7392,.1);
                           });
                     });

            describe('vec3', function(){
                        it('core operations', function(){
                              glm.vec3().should.be.instanceOf(glm.vec3);
                              glm.vec3(1,2).toString().should.equal('fvec3(1.000000, 2.000000, 2.000000)');
                              glm.vec3(1).toString().should.equal('fvec3(1.000000, 1.000000, 1.000000)');
                              glm.vec3().toString().should.equal('fvec3(0.000000, 0.000000, 0.000000)');
                              expect(glm.vec3([3,2])).to.glm_eq([3,2,2]);
                              expect(glm.vec3([3,2,1])).to.glm_eq([3,2,1]);
                              expect(glm.vec3([3,2,1,0])).to.glm_eq([3,2,1]);
                              expect(glm.vec3(glm.vec2(3,2),1)).to.glm_eq([3,2,1]);

                              expect(function(){glm.vec3({},0)}).to['throw'](/unrecognized object passed to.*?[(]o,z[)]/);
                              expect(function(){glm.vec3(null,0)}).to['throw'](/unrecognized object passed to.*?vec3/);
                              expect(function(){glm.vec3(null)}).to['throw'](/unrecognized object passed to.*?vec3/);
                           });
                        it('multiply by a scalar', function(){
                              glm.vec3(1).mul(2).should.be.instanceOf(glm.vec3);
                              glm.$to_array(glm.vec3(1,2).mul(2)).should.eql([2,4,4]);
                              glm.$to_array(glm.vec3(2,3,4)['*'](3)).should.eql([6,9,12]);
                              glm.$to_array(glm.vec3(10,4,2)['*'](1/2)).should.eql([5,2,1]);
                              glm.$to_array(glm.vec3(1,2,3)['*'](2)['*'](.5)).should.eql([1,2,3]);
                           });
                        it('inplace multiply by a scalar', function(){ 
                              var v3 = glm.vec3(Math.PI);
                              glm.$to_array(v3['*'](1/Math.PI)).should.eql([1,1,1]);
                              glm.$to_array(v3).should.not.eql([1,1,1]);
                              glm.$to_array(v3['*='](1/Math.PI)).should.eql([1,1,1]);
                              glm.$to_array(v3).should.eql([1,1,1]);
                           });
                        it('lengthify', function(){ 
                              glm.length(glm.vec3(Math.PI)).should.be.approximately(5.44,.1);
                           });
                        it('normalize', function(){ 
                              glm.length(glm.normalize(glm.vec3(2,2,2))).should.be.approximately(1,glm.epsilon());
                              glm.$to_array(glm.normalize(glm.vec3(0,2,0))).should.eql([0,1,0]);
                           });
                        it('spin about a quat', function() {
                              glm.$to_array(glm.vec3(100).mul(qspin)).should.eql([-100,100,-100]);
                              glm.$to_array(qspin.mul(glm.vec3(100))).should.eql([-100,100,-100]);
                           });
                        it('mixify', function(){ 
                              glm.to_glsl(glm.mix(glm.vec3(1),glm.vec3(2),1/Math.PI)).should.equal('vec3(1.3183099031448364)');
                           });
                     });

            describe('vec4', function(){
                        it('core operations', function(){
                              glm.vec4().should.be.instanceOf(glm.vec4);
                              glm.vec4(1,2).toString().should.equal('fvec4(1.000000, 2.000000, 2.000000, 2.000000)');
                              glm.vec4(1).toString().should.equal('fvec4(1.000000, 1.000000, 1.000000, 1.000000)');
                              glm.vec4().toString().should.equal('fvec4(0.000000, 0.000000, 0.000000, 0.000000)');
                              expect(glm.vec4([3,2])).to.glm_eq([3,2,2,2]);
                              expect(glm.vec4([3,2,1])).to.glm_eq([3,2,1,1]);
                              expect(glm.vec4([3,2,1,0])).to.glm_eq([3,2,1,0]);
                              expect(glm.vec4(glm.vec2(3,2),1,0)).to.glm_eq([3,2,1,0]);
                              expect(glm.vec4(glm.vec3(3,2,1),0)).to.glm_eq([3,2,1,0]);
                              expect(function(){glm.vec4({},0)}).to['throw'](/unrecognized object passed to.*?[(]o,w[)]/);
                              expect(function(){glm.vec4({},0,0)}).to['throw'](/unrecognized object passed to.*?[(]o,z,w[)]/);
                              expect(function(){glm.vec4(null,0,0)}).to['throw'](/unrecognized object passed to.*?[(]o,z,w[)]/);
                              expect(function(){glm.vec4(null,0)}).to['throw'](/unrecognized object passed to.*?[(]o,w[)]/);
                              expect(function(){glm.vec4(null)}).to['throw'](/unrecognized object passed to.*?vec4/);
                           });
                        it('multiply by a scalar', function(){
                              glm.vec4(1).mul(2).should.be.instanceOf(glm.vec4);
                              glm.$to_array(glm.vec4(1,2).mul(2)).should.eql([2,4,4,4]);
                              glm.$to_array(glm.vec4(2,3,4)['*'](3)).should.eql([6,9,12,12]);
                              glm.$to_array(glm.vec4(10,4,2)['*'](1/2)).should.eql([5,2,1,1]);
                              glm.$to_array(glm.vec4(1,2,3)['*'](2)['*'](.5)).should.eql([1,2,3,3]);
                           });
                        it('inplace multiply by a scalar', function(){ 
                              var v4 = glm.vec4(Math.PI);
                              glm.$to_array(v4['*'](1/Math.PI)).should.eql([1,1,1,1]);
                              glm.$to_array(v4).should.not.eql([1,1,1,1]);
                              glm.$to_array(v4['*='](1/Math.PI)).should.eql([1,1,1,1]);
                              glm.$to_array(v4).should.eql([1,1,1,1]);
                           });
                        it('lengthify', function(){ 
                              glm.length(glm.vec4(Math.PI)).should.be.approximately(6.28,.1);
                           });
                        it('normalize', function(){ 
                              glm.length(glm.normalize(glm.vec4(2,2,2,2))).should.be.approximately(1,glm.epsilon());
                              glm.normalize(glm.vec4(2)).should.be.instanceOf(glm.vec4);
                              glm.$to_array(glm.normalize(glm.vec4(0,0,0,2))).should.eql([0,0,0,1]);
                           });
                        //var qspin = glm.angleAxis(Math.PI,glm.vec3(0,1,0));
                        var qspin = new glm.quat([ 0, 1, 0, 6.123031769111886e-17 ]);
                        it('spin about a quat', function() {
                              glm.$to_array(glm.vec4(100,100,100,1).mul(qspin)).should.eql([-100,100,-100,1]);
                           });
                        var M = glm.toMat4(qspin);
                        it('matrixify', function() {
                              glm.$to_array(M['*'](glm.vec4(1,2,3,1))).should.eql([-1,2,-3,1]);
                              glm.$to_array(M['*'](glm.vec4(-1,-1,2,2))).should.eql([1,-1,-2,2]);
                           });
                        it('length2ify', function(){ 
                              glm.length2(glm.vec4(Math.PI)).should.be.approximately(39.4784,.1);
                           });
                        it('mixify', function(){ 
                              glm.to_glsl(glm.mix(glm.vec4(Math.PI),glm.vec4(),.5)).should.equal('vec4(1.5707963705062866)' );
                           });
                     });
            
            describe('other', function() {
                        it('$dumpTypes', function() {
                              var arr = [];
                              glm.$dumpTypes(arr.push.bind(arr));
                              expect(arr.length).to.equal(14);
                           });

                        it('glm.$partition', function() {
                              var x = {
                                 elements: new Float32Array(2 * 8)
                              };
                              expect(x.elements, 'x.elements');
                              x.elements.set(glm.mat4(1).elements);
                              glm.$partition(x,glm.vec2,8);
                              expect(x[0],'x[0] is vec2').to.be.instanceOf(glm.vec2);
                              expect(x[0],'x[0] value').to.glm_eq([1,0]);
                              expect(x[1]).to.glm_eq([0,0]);
                              expect(x[2]).to.glm_eq([0,1]);
                              expect(x[2]=(glm.vec2(3,4))).to.glm_eq([3,4]);
                              x[2]=[5,6];
                              expect(x[2]).to.glm_eq([5,6]);
                              x[2]=[4,5];
                              expect(x[2]).to.glm_eq([4,5]);
                              x[1]=[2,3];
                              expect(x[1]).to.glm_eq([2,3]);
                              x[4].xy['='](glm.vec2([8,9]));
                              x[0].x = 0; x[0].y = 1;
                              new glm.vec4(x.elements.subarray(6,6+4))[0] = 6;
                              new glm.vec4(x.elements.subarray(5,5+4))[2] = 7;
                              new glm.mat4(x.elements.subarray(0,16))[2][2] = 0;
                              new glm.mat4(x.elements.subarray(0,16))[2][3] = 1;
                              expect(new glm.mat4(x.elements)).to.flatten.into('0123456789010001');
                           });
                     });
            describe('buffers', function(){
                        it('regression tests', function(){
                              var b = new ArrayBuffer(glm.mat4.BYTES_PER_ELEMENT * 4);
                              var f = new Float32Array(b);
                              var m4a = new glm.vec4(f.subarray(glm.vec4.componentLength,
                                                                glm.vec4.componentLength*2));
                              var xxxx = [1,2,3,4];
                              m4a.elements.set(xxxx);
                              glm.$to_array(m4a).should.eql(xxxx);              //0000111122223333
                              expect(glm.make_mat4(f)).to.flatten.into('0000123400000000');
                              glm.$to_array(new glm.mat4(f.subarray(0,16))).join("").should.eql("0000123400000000");
                              new glm.mat4(f.subarray(16,16+16)).elements.set("0000111122223333".split(""));
                              [].join.call(f.subarray(16),"").should.equal('000011112222333300000000000000000000000000000000');
                              var m = new glm.mat4(f.subarray(16,16+16));
                              var rr = glm.rotate(glm.mat4(), glm.radians(90), glm.vec3(0,0,1));
                              rr.should.be.instanceOf(glm.mat4);
                              m['='](rr);//toMat4(new glm.quat([ 0, 1, 0, 6.123031769111886e-17 ])));
                              glm.to_string(m).should.be.equal( 'mat4x4((0.000000, 1.000000, 0.000000, 0.000000), (-1.000000, 0.000000, 0.000000, 0.000000), (0.000000, 0.000000, 1.000000, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');
                              var qq = new glm.quat([ -0.25, 0.5, -0.25, 1 ]);
                              //[].slice.call(m.elements).join("").should.equal('9000090000900009');
                              glm.length(glm.quat(m)).should.be.approximately(1, glm.epsilon());//toString().should.equal('<quat>fvec3(0.000000, 0.000000, 89.999992)');
                              glm.degrees(glm.eulerAngles(glm.normalize(glm.quat(m)))[2]).should.be.approximately(90,glm.degrees(glm.epsilon()));

                              glm.length(glm.degrees(glm.eulerAngles(glm.quat(new glm.mat4(f.subarray(16,16+16)))))).should.be.approximately(90, glm.degrees(glm.epsilon()));
                              glm.$to_array({elements:f}).map(function(x) {return Math.abs(x.toFixed(5)); }).join("").should.eql("0000123400000000010010000010000100000000000000000000000000000000");
                              
                              expect(new glm.vec4(f.subarray(16,20)).address).to.equal("0x00000040");
                           });
                        if(glm.$vecor) it('GLMVector', function() {
                              var vv = new glm.$vector(glm.vec4, 4).arrayize(true);
                              expect(vv).to.be.instanceOf(glm.$vector);

                              expect(vv['->'].map(function(x) { return glm.to_string(x); }))
                                 .to.eql(",,,,".split('').map(function(){return glm.vec4()+''}));

                              vv['->'][3] = glm.vec4(1,2,3,1);

                              //vv['->'].map(function(x) { console.warn(glm.to_string(x)); });
                              
                              expect(vv['->'].map(function(x) { return glm.to_string(x); }))
                                 .to.eql("   ".split('').map(function(){return glm.vec4()+''})
                                         .concat([glm.vec4(1,2,3,1)+'']));
                              [].slice.call(vv.elements).forEach(function(v,_) {
                                                                    vv.elements[_] = _;
                                                                 });
                              expect(new glm.vec4(vv.elements.subarray(4,8))).to.glm_eq([4,5,6,7]);
                              expect(new glm.mat4(vv.elements)[3]).to.glm_eq([12,13,14,15]);
                              vv['->'][0] = glm.vec4(0);
                              vv['->'][1] = glm.vec4(1);
                              vv['->'][2] = glm.vec4(2);
                              vv['->'][3] = glm.vec4(3);
                              //throw new Error([].slice.call(vv.elements));
                              //throw new Error([].slice.call(vv.elements)+'');
                              expect(new glm.mat4(vv.elements)).to.flatten.into('0000111122223333');
                           });
                     });

            describe('to_glsl', function() {
                        it('serialization tests', function() {
                              glm.to_glsl(glm.vec4()).should.equal("vec4(0)");
                              glm.to_glsl(glm.vec4(1)).should.equal("vec4(1)");
                              glm.to_glsl(glm.vec4(2)).should.equal("vec4(2)");
                              glm.to_glsl(glm.vec4(3)).should.equal("vec4(3)");
                              glm.to_glsl(glm.vec2(3)).should.equal("vec2(3)");
                              glm.to_glsl(glm.vec3(1,2,3)).should.equal("vec3(1,2,3)");
                              glm.to_glsl(glm.vec4(1,2,3)).should.equal("vec4(1,2,3)");
                              glm.to_glsl(glm.quat()).should.equal("quat(1)");
                              glm.to_glsl(glm.quat(1)).should.equal("quat(1)");
                              glm.to_glsl(glm.mat4(2)).should.equal("mat4(2)");
                              glm.to_glsl(glm.mat4(0)).should.equal("mat4(0)");
                              glm.to_glsl(glm.mat4(-1)).should.equal("mat4(-1)");
                              glm.to_glsl(glm.mat3(-1)).should.equal("mat3(-1)");
                              expect(glm.to_glsl(glm.mat3("123456789".split('').map(Number))))
                                 .to.equal("mat3(1,2,3,4,5,6,7,8,9)");
                              expect(glm.to_glsl(glm.mat4("1234567890123456".split('').map(Number))))
                                 .to.equal("mat4(1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6)");
                              //glm.uvec4(-1).toString().should.equal("mat3(-1)");
                           });
                     });

            describe('uvec4', function(){
                        it('core operations', function(){
                              glm.uvec4().should.be.instanceOf(glm.uvec4);
                              glm.$to_array(glm.uvec4(-2)).should.eql([0,0,0,0]);
                              glm.$to_array(glm.uvec4(.5)).should.eql([0,0,0,0]);
                              glm.$to_array(glm.uvec4(1)).should.eql([1,1,1,1]);
                              glm.$to_array(glm.uvec4(-.5)).should.eql([0,0,0,0]);
                              glm.$to_array(glm.uvec4(glm.vec3(-1),1)).should.eql([0,0,0,1]);
                              glm.$to_array(glm.uvec4(-1,-1,-1,1)).should.eql([0,0,0,1]);
                              glm.$to_array(glm.uvec4(-1,-1,-1)).should.eql([0,0,0,0]);
                              glm.$to_array(glm.uvec4(-1,-1)).should.eql([0,0,0,0]);
                              glm.$to_array(glm.uvec4([-1,-1,-1,-1])).should.eql([0,0,0,0]);
                              glm.$to_array(glm.uvec4([-1,-1,-1])).should.eql([0,0,0,0]);
                              glm.$to_array(glm.uvec4([-1,1])).should.eql([0,1,1,1]);
                              glm.$to_array(glm.uvec4({x:-1,y:1,z:-1,w:1})).should.eql([0,1,0,1]);
                              expect(function() { glm.uvec4({}); }).to['throw'](/unrecognized object passed to .*?uvec4/);
                              expect(function() { glm.uvec4({},1); }).to['throw'](/unrecognized object passed to .*?uvec4/);
                              expect(glm.to_string(glm.uvec4(-1,-2,1,2))).to.equal("uvec4(0,0,1,2)");

                              expect(glm.uvec4(2,3,4,5).x).to.equal(2);
                              expect(glm.uvec4(2,3,4,5)[3]).to.equal(5);
                           });
                     });

            describe('exceptions', function() {
                        it('exceptions 0', function() {
                              expect(function(){
                                        new glm.vec3(new Float32Array(4))
                                     }).to['throw'](/vec3 elements size mismatch/);
                              expect(function(){
                                        glm.vec3(new Float32Array(4))
                                     }).to.not['throw']();
                              expect(function() {
                                        glm.$template.operations(
                                           {
                                              'mul': {
                                                 op:'x'
                                              }
                                           });
                                     }).to['throw'](/mismatch merging existing override/);

                           });
                        it('exceptions 1', function() {
                              expect(function(){
                                        glm.vec3()['*'](null);
                                     }).to['throw'](/unsupported argtype/);
                              expect(function(){
                                        glm.mat4()[3] = null;
                                     }).to['throw'](/unsupported argtype/);
                              expect(function(){
                                        glm.normalize(null);
                                     }).to['throw'](/unsupported argtype/);
                              expect(function(){
                                        glm.mix(null,null,null);
                                     }).to['throw'](/unsupported argtype/);
                              expect(function(){
                                        glm.mix(glm.vec3(),glm.vec3(),null);
                                     }).to['throw'](/unsupported n type/);

                              expect(function(){
                                        glm.$to_string([],[])
                                     }).to['throw'](/unsupported argtype/);
                           });

                        [2,3,4].forEach(
                           function(_) {
                              var typ = 'vec'+_;
                              it(typ, function() {
                                    expect(function() {
                                              glm[typ]({x:1,y:2,z:3,w:4});
                                              glm[typ](glm.vec4({x:1,y:2,z:3,w:4}));
                                           }, typ).not.to['throw']();
                                    expect(function() {
                                              glm[typ]('hi');
                                           }, typ).to['throw'](/no template found for vec....string1/);
                                    expect(function() {
                                              glm[typ]({});
                                           }, typ).to['throw'](/unrecognized object/);
                                    expect(function() {
                                              glm[typ]({y: 5});
                                           },typ).to['throw'](/unrecognized object/);
                                    expect(function() {
                                              glm[typ]({x: 'x', y: 5, z:'z', w:5});
                                           },typ).to['throw'](/unrecognized .x-ish object/);
                                 });
                           });
                     });
            describe(GLMJS_PREFIX+' info', function(){
                        it('...OK', function(){});
                     });
         });


atexit && atexit();