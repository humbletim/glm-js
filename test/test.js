try { chai.exists; } catch(e) { chai = require('chai') ; }

should = chai.should(),
  expect = chai.expect,
  cane = require('./browser/cane'),
  glm = require("../src/glm-js");

require("../src/glm.buffers");
require("../src/glm.experimental");
//glm.$log(glm.$vectorType.version);

glm.$log('glm: '+glm);
glm.$log('chai: '+chai);
glm.$log('should: '+should);
glm.$log('mocha: '+typeof mocha);
glm.$log('Mocha: '+typeof Mocha);
glm.$log('cane: '+cane);
if (!cane) throw new Error('cane expected');

chai.use(cane.sugar);

var mocha_utils = cane.patchMochaUtils(this.Mocha ? this.Mocha.utils : require("mocha").utils);

var examples = {
   "=== vec4(1,2,3,4)": function() {
      function _(v) { expect(v).to.eql(glm.vec4(1,2,3,4)); }

      _( glm.vec4(1,2,3,4) );

      {
         _( glm.vec4(glm.vec4(1,2,3,4)) );
         _( glm.vec4(glm.vec3(1,2,3),4) );
         _( glm.vec4(glm.vec2(1,2),3,4) );
      }
      
      {
         _( glm.vec4(glm.vec3(glm.vec2(1,2),3),4) );
      }
      
      {
         var buffer = new ArrayBuffer(glm.vec4.BYTES_PER_ELEMENT);
         new Float32Array(buffer).set([1,2,3,4]);
         _( glm.make_vec4(buffer) );
      }
      
      {
         _(       (glm.vec4(1,0,0,0)) 
            ['+'] (glm.vec4(0,2,0,0))
            ['+'] (glm.vec4(0,0,3,0))
            ['+'] (glm.vec4(0,0,0,4))
          );//         vec4(1,2,3,4)
      }

      {
         _(       (glm.vec4(11,21,31,41))
            ['-'] (glm.vec4(1)) 
            ['/'] (10)
          );//         vec4(1, 2, 3, 4 )
      }

      {
         var vx4 = glm.vec4(2,4,6,8);
                       vx4.div_eq(2);
         _( vx4 ); //  vec4(1,2,3,4)
      }

      {
         var v = glm.vec4(3,4,1,2);
         v.xy = v.zw;  // 1,2,1,2 
         v.zw['+='](
            glm.vec2(2)//+    2,2
         );
         _( v );       // 1,2,3,4
      }

      {
         _( glm.translate(
               glm.vec3(1,2,3).mul(1/4)
            ).mul( glm.diagonal4x4(glm.vec4(4)) )[3] );
      }
   }
};
function pseudoExportsUI(ob) {
   for (var p in ob) {
      if (ob[p].call)
         it(p, ob[p]);
      describe(p, pseudoExportsUI.bind(this, ob[p]));
   }
};

describe('glm', function(){
            describe('examples', function() {
                        pseudoExportsUI(examples);
                     });
            describe('common', function(){
                        it('module props', function(){
                              expect(glm.version).to.be.a('string');
                              expect(glm.version).to.match(/\d\.\d\.\d/);
                              expect(glm.vendor).to.be.an('object');
                              expect(glm.vendor.vendor_version).to.be.a('string');
                              glm.$log(glm.version);
                           });
                        describe('$subarray', function() {
                                    it('.subarray', function() {
                                          var f = new Float32Array([0,0]);
                                          f.subarray(1).subarray(0)[0] = 1;
                                          if (f[1] !== 1) glm.$log("spidermonkey broken subarray detected...");
                                          
                                          f.set([0,1]);
                                          expect([].slice.call(GLM.$subarray(f,0))).to.eql([0,1]);
                                          expect([].slice.call(GLM.$subarray(f,0,1))).to.eql([0]);
                                          expect([].slice.call(GLM.$subarray(f,0,2))).to.eql([0,1]);
                                          var g = GLM.$subarray(f,1);
                                          expect([].slice.call(GLM.$subarray(g,0))).to.eql([1]);
                                          expect([].slice.call(
                                                    new Float32Array(
                                                       GLM.$subarray(GLM.$subarray(f,1),0)
                                                    )
                                                 ))
                                             .to.eql([1]);
                                          var buf = new ArrayBuffer(16);
                                          var f = new Float32Array(buf, 4); // floats[1]
                                          f.set([1,2,3]);
                                          expect([].slice.call(f)).to.eql([1,2,3]);
                                          expect([].slice.call(new Float32Array(buf))).to.eql([0,1,2,3]);
                                          var sa = GLM.$subarray(GLM.$subarray(f,1,3),0);
                                          sa[0] = 5; sa[1] = 6;
                                          var v = new glm.vec3(new Float32Array(buf,4));
                                          v.xy['=']([55,66]);
                                          expect([].slice.call(new Float32Array(buf))).to.eql([0,55,66,6]);

                                          expect([].slice.call(glm.$subarray.workaround_broken_spidermonkey_subarray(sa,0,2))).to.eql([66,6]);
                                          expect([].slice.call(glm.$subarray.native_subarray(sa,0,2))).to.eql([66,6]);
                                       });
                                 });
                        describe('.$outer', function() {
                                    it('.console', function() {
                                          // shameless invocations for code coverage testing
                                          "log,debug,info,warn,error,write"
                                          .split(',').forEach(function(p) { glm.$outer.console[p](p); });
                                          glm.$log('test before reset');
                                          var current = glm.$reset_logging.current();
                                          glm.$reset_logging(true);
                                          glm.$log('test after reset', glm.vec3(), 1, NaN, true, {});
                                          $GLM_log('test after reset', glm.vec3(), 1, NaN, true, {});
                                          glm.$outer.console.info('info after reset');
                                          glm.$reset_logging(current);
                                          $GLM_log('test after restore');
                                          glm.$outer.console.debug('debug after restore');
                                          glm.$outer.console.warn('warn after restore');
                                       });
                                    
                                    it('._vec3_eulerAngles', function() {
                                          var q = glm.quat(glm.radians(glm.vec3(15,-16,170)));
                                          expect(glm.to_string(glm.degrees(glm.$outer._vec3_eulerAngles(q)),{precision:1}))
                                             .to.equal('fvec3(15.0, -16.0, 170.0)');
                                          
                                          // this triggers the atan2 edge case
                                          var B=glm.quat(glm.radians(glm.vec3(45,90,-45)));
                                                B.y += glm.epsilon();
                                          B = glm.normalize(B);
                                          expect(glm.to_string(glm.degrees(glm.$outer._vec3_eulerAngles(B)),{precision:1}))
                                             .to.equal('fvec3(0.0, 90.0, -90.0)');
                                       });
                                    it('.mat4_angleAxis', function() {
                                          expect(glm.$outer.mat4_angleAxis(glm.radians(45), glm.vec3(0,1,0)),
                                                 '$outer.mat4_angleAxis').to.be.instanceOf(glm.mat4);
                                          
                                       });
                                    it('.quat_array_from_xyz', function() {
                                          var mots=glm.radians(glm.vec3(15,15,15));
                                          expect(glm.to_string(
                                                    glm.quat(glm.$outer.quat_array_from_xyz(mots))
                                                       ,{precision:3}
                                                 )
                                                ).to.equal(
                                                   '<quat>fvec3(18.639, 10.049, 18.639)'
                                                );
                                       });

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
                              expect("vec2,vec3,vec4,uvec4,ivec4,quat,mat3,mat4".split(',')
                                     .map(function(p){return glm[p]})
                                     .map(glm.$isGLMConstructor)
                                     .map(Boolean)
                                     .join(",")
                                    ).to.equal( "true,true,true,true,true,true,true,true" );
                              expect([ Object, Array, [], 0, null, this, true, "" ]
                                     .map(glm.$isGLMConstructor)
                                     .join(",")
                                    ).to.equal( "false,false,false,false,false,false,false,false" );
                           });
                        it('$isGLMObject', function() {
                              expect("vec2,vec3,vec4,uvec4,ivec4,quat,mat3,mat4".split(',')
                                     .map(function(p){return glm[p]()})
                                     .map(glm.$isGLMObject)
                                     .map(Boolean)
                                     .join(",")
                                    ).to.equal( "true,true,true,true,true,true,true,true" );
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
                        it(".$getGLMType", function() {
                              var constructors = "vec2,vec3,vec4,uvec4,ivec4,quat,mat3,mat4".split(',')
                                 .map(function(p){return glm[p]});
                              expect(constructors.map(function(p) { return glm.$getGLMType(p()); }))
                                 .to.eql(constructors);
                              expect(glm.$getGLMType({})).to.equal(false);
                           });
                        it(".$rebindTypedArrays", function() {
                              expect(new glm.mat4(new Float32Array(16))).to.flatten.into("0000000000000000");

                              // note: 'new glm.mat4(Float32Array)` is a special case that adopts the existing typed array
                              //   as the backing store (instead of allocating another buffer)

                              var FLOAT32ARRAY = Float32Array;

                              var original = {};
                              for(var p in glm.$outer) original[p] = glm.$outer[p];

                              expect(original.Float32Array).to.eql(FLOAT32ARRAY);

                              // monkey-patch Float32Array
                              Float32Array = Uint32Array;

                              var fb = new Float32Array(16);
                              fb.set([1.5,2.1,3.999,4.0]);
                              var m = new glm.mat4(fb);
                              // glm won't recognize the patched Float32Array yet
                              expect(m.elements === fb).to.be['false']();
                              m[0].xyzw = [9,8,7,6];
                              expect([].slice.call(fb)).to.eql([1.5,2.1,3.999,4,0,0,0,0,0,0,0,0,0,0,0,0].map(Math.floor));

                              {
                                 var FB = new FLOAT32ARRAY(16);
                                 var m = new glm.mat4(FB);
                                 // at this point, glm should still pick up FB's ArrayBuffer
                                 expect(FB.buffer).to.equal(m.elements.buffer);
                              }

                              glm.$outer.$rebindTypedArrays(
                                 function(p, old) {
                                    if (p === 'Float32Array')
                                       return Float32Array;
                                    return old;
                                 });
                              
                              {
                                 var FB = new FLOAT32ARRAY(16);
                                 var m = new glm.mat4(FB);
                                 // since FLOAT32ARRAY !== Float32array, glm should no longer pick up FB's ArrayBuffer
                                 expect(FB.buffer).to.not.equal(m.elements.buffer);
                              }

                              var seq = [9.5, 8.1, 7.9, 6.6];
                              var m = new glm.mat4(fb);
                              // now glm should recognize the patched Float32Array
                              expect(m.elements === fb,'m.elements === fb').to.be['true']();
                              m[0].xyzw = seq;
                              expect(new glm.mat4(fb)).to.flatten.into("9876000000000000");

                              var fb = new Float32Array(16);
                              var m = new glm.mat4(fb);
                              expect(m.elements === fb,'m.elements === fb').to.be['true']();

                              m[0].xyzw = seq;
                              expect(new glm.mat4(fb)[0]).to.not.glm_eq(seq);
                              expect(new glm.mat4(fb)).to.flatten.into("9876000000000000");

                              expect(original.Float32Array).to.eql(FLOAT32ARRAY);
                              expect(glm.$outer.Float32Array).to.eql(Uint32Array);
                              expect(glm.$outer.Uint32Array).to.eql(Uint32Array);
                              expect(fb).to.be.instanceOf(Float32Array);
                              expect(fb).to.be.instanceOf(Uint32Array);


                              // restore original Float32Array...
                              Float32Array = FLOAT32ARRAY;
                              glm.$outer.Float32Array = FLOAT32ARRAY;

                              for(var p in glm.$outer) 
                                 expect(original[p], p).to.eql(glm.$outer[p]);

                              var fb = new Float32Array(16);
                              var m = new glm.mat4(fb);
                              expect(m.elements === fb,'m.elements === fb').to.be['true']();
                              m[0].xyzw = seq;
                              expect(new glm.mat4(fb)).to.glm_eq(seq.concat([0,0,0,0,0,0,0,0,0,0,0,0]),glm.epsilon());
                           });
                        describe("Objectification", function() {
                                    it('$to_object', function() {
                                          expect(glm.$to_object(glm.vec2())).to.eql({"x":0,"y":0});
                                          expect(glm.$to_object(glm.uvec4(1,2,3,4))).to.eql({"x":1,"y":2,"z":3,"w":4});
                                          expect(glm.$to_object(glm.ivec4(-1,2,-3,4))).to.eql({"x":-1,"y":2,"z":-3,"w":4});
                                          expect(glm.$to_object(glm.bvec4(-1,2,-3,4))).to.eql({"x":true,"y":true,"z":true,"w":true});
                                          expect(glm.$to_object(glm.bvec2(-1,2))).to.eql({"x":true,"y":true});
                                          expect(glm.$to_object(glm.bvec3(-1,2,0))).to.eql({"x":true,"y":true,"z":false});
                                          expect(glm.$to_object(glm.uvec4(-1,-2,-3,-4))).to.eql({"x":-1,"y":-2,"z":-3,"w":-4});
                                          
                                          expect(glm.$to_object(glm.mat3(2))).to.eql({"0":{"x":2,"y":0,"z":0},"1":{"x":0,"y":2,"z":0},"2":{"x":0,"y":0,"z":2}});
                                          expect(glm.$to_object(glm.quat(1,2,3,4))).to.eql({ w: 1, x: 2, y: 3, z: 4 });
                                          expect(glm.$to_object(glm.quat())).to.eql({ w: 1, x: 0, y: 0, z: 0 });
                                       });
                                    it('$to_json', function() {
                                          expect(glm.$to_json(glm.vec3())).to.equal('{"x":0,"y":0,"z":0}');
                                          expect(glm.$to_json(glm.vec4(1,2,3,4))).to.equal('{"x":1,"y":2,"z":3,"w":4}');
                                          expect(glm.$to_json(glm.mat4(2))).to.equal('{"0":{"x":2,"y":0,"z":0,"w":0},"1":{"x":0,"y":2,"z":0,"w":0},"2":{"x":0,"y":0,"z":2,"w":0},"3":{"x":0,"y":0,"z":0,"w":2}}');
                                       });
                                    it('.$inspect', function() {
                                          expect(glm.$inspect.call(glm.vec2(1,2))).to.equal('{\n  "x": 1,\n  "y": 2\n}');
                                          expect(glm.$inspect(glm.vec2())).to.equal('{\n  "x": 0,\n  "y": 0\n}');
                                          expect(glm.$inspect(glm.mat4())).to.equal('{\n  "0": {\n    "x": 1,\n    "y": 0,\n    "z": 0,\n    "w": 0\n  },\n  "1": {\n    "x": 0,\n    "y": 1,\n    "z": 0,\n    "w": 0\n  },\n  "2": {\n    "x": 0,\n    "y": 0,\n    "z": 1,\n    "w": 0\n  },\n  "3": {\n    "x": 0,\n    "y": 0,\n    "z": 0,\n    "w": 1\n  }\n}');
                                          expect(glm.vec3(1,2,3).inspect()).to.equal('{\n  "x": 1,\n  "y": 2,\n  "z": 3\n}');
                                       });
                                    it('JSON.stringify', function() {
                                          expect(JSON.stringify(glm.vec2())).to.equal('{"x":0,"y":0}');
                                       });

                                 });

                        describe("glsl", function() {
                                    it('$to_glsl', function() {
                                          expect(glm.$to_glsl(glm.vec3(1))).to.equal('vec3(1)');
                                          expect(glm.$to_glsl(glm.vec3(1,2,3))).to.equal('vec3(1,2,3)');
                                          expect(glm.$to_glsl(glm.uvec3(1,2,3))).to.equal('uvec3(1,2,3)');
                                          expect(glm.$to_glsl(glm.ivec3(-1,2,-3))).to.equal('ivec3(-1,2,-3)');
                                          expect(glm.$to_glsl(glm.mat4(0))).to.equal('mat4(0)');
                                          expect(glm.$to_glsl(glm.mat4(1),{precision:1})).to.equal('mat4(1.0)');
                                          expect(glm.$to_glsl(glm.mat3(1))).to.equal('mat3(1)');
                                          expect(glm.$to_glsl(glm.mat3(2))).to.equal('mat3(2)');
                                          expect(glm.$to_glsl(glm.mat3(-2))).to.equal('mat3(-2)');
                                          expect(glm.$to_glsl(glm.uvec4(0))).to.equal('uvec4(0)');
                                          expect(glm.$to_glsl(glm.ivec2(0))).to.equal('ivec2(0)');
                                          expect(glm.$to_glsl(glm.quat(1))).to.equal('quat(1)');
                                          expect(glm.$to_glsl(glm.normalize(glm.angleAxis(glm.radians(30), glm.normalize(glm.vec3(1))))))
                                             .to.equal('quat(0.14942924678325653,0.14942924678325653,0.14942924678325653,0.9659258127212524)');

                                       });
                                    
                                    it('$from_glsl', function() {
                                          expect(glm.$from_glsl('vec3(1)', true)).to.eql([1,1,1]);
                                          expect(glm.$from_glsl('vec3(1)', false)).to.be.instanceOf(glm.vec3);
                                          expect(glm.$from_glsl('vec3(1)')).to.glm_eq([1,1,1]);
                                          expect(glm.$from_glsl('mat4(1)')).to.glm_eq(glm.$to_array(glm.mat4(1)));
                                          expect(glm.$from_glsl('vec2(0,3)')).to.glm_eq(glm.$to_array(glm.vec2(0,3)));
                                          expect(glm.$from_glsl('vec4(0,3,2)')).to.glm_eq(glm.$to_array(glm.vec4(0,3,2,2)));
                                          expect(glm.$from_glsl("mat3(1,2,3,4,5,6,7,8,9)"))
                                             .to.glm_eq("123456789".split('').map(Number));
                                          expect(glm.$from_glsl("mat4(1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6)"))
                                             .to.glm_eq("1234567890123456".split('').map(Number));

                                       });
                                    
                                    it('additional glsl serialization tests', function() {
                                          glm.$to_glsl(glm.vec4()).should.equal("vec4(0)");
                                          glm.$to_glsl(glm.vec4(1)).should.equal("vec4(1)");
                                          glm.$to_glsl(glm.vec4(2)).should.equal("vec4(2)");
                                          glm.$to_glsl(glm.vec4(3)).should.equal("vec4(3)");
                                          glm.$to_glsl(glm.vec2(3)).should.equal("vec2(3)");
                                          glm.$to_glsl(glm.vec3(1,2,3)).should.equal("vec3(1,2,3)");
                                          glm.$to_glsl(glm.vec4(1,2,3)).should.equal("vec4(1,2,3)");
                                          glm.$to_glsl(glm.quat()).should.equal("quat(1)");
                                          glm.$to_glsl(glm.quat(1)).should.equal("quat(1)");
                                          glm.$to_glsl(glm.mat4(2)).should.equal("mat4(2)");
                                          glm.$to_glsl(glm.mat4(0)).should.equal("mat4(0)");
                                          glm.$to_glsl(glm.mat4(-1)).should.equal("mat4(-1)");
                                          glm.$to_glsl(glm.mat3(-1)).should.equal("mat3(-1)");
                                          expect(glm.$to_glsl(glm.mat3("123456789".split('').map(Number))))
                                             .to.equal("mat3(1,2,3,4,5,6,7,8,9)");
                                          expect(glm.$to_glsl(glm.mat4("1234567890123456".split('').map(Number))))
                                             .to.equal("mat4(1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6)");
                                          //glm.uvec4(-1).toString().should.equal("mat3(-1)");
                                       });
                                 });

                        it('to_string', function() {
                              expect(
                                 glm.to_string({$type:'asdf'})
                              ).to.match(/unsupported argtype/);
                              //expect(
                              //   glm.to_string({$type:'version'})
                              //).to.match(/missing [.][$]/);
                              expect(
                                 glm.to_string(glm.mat4())
                              ).to.equal('mat4x4((1.000000, 0.000000, 0.000000, 0.000000), (0.000000, 1.000000, 0.000000, 0.000000), (0.000000, 0.000000, 1.000000, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');
                              var old = GLM.FAITHFUL;
                              GLM.FAITHFUL = !GLM.FAITHFUL;
                              expect(
                                 glm.to_string(glm.vec3())
                              ).to.equal('fvec3(0.000000, 0.000000, 0.000000)');
                              expect(
                                 glm.to_string(glm.mat4())
                              ).to.equal('mat4x4(\n\t(1.000000, 0.000000, 0.000000, 0.000000), \n\t(0.000000, 1.000000, 0.000000, 0.000000), \n\t(0.000000, 0.000000, 1.000000, 0.000000), \n\t(0.000000, 0.000000, 0.000000, 1.000000)\n)');
                              expect(
                                 glm.to_string(glm.vec3(), {precision: 0})
                              ).to.equal('fvec3(0, 0, 0)');
                              GLM.FAITHFUL = old;

                              expect(glm.to_string(5)).to.equal("float(5.000000)");
                              expect(glm.to_string(5,{precision:1})).to.equal("float(5.0)");
                              
                              var q = glm.quat(glm.radians(glm.vec3(15,-16,170)));
                              expect(glm.to_string(glm.degrees(glm.eulerAngles(q)),{precision:1}))
                                 .to.equal('fvec3(15.0, -16.0, 170.0)');
                              
                              expect(glm.to_string("cheese")).to.equal("cheese");

                              expect(glm.$to_string(new Float32Array(new ArrayBuffer(16),4,3))).to.equal('[object Float32Array {"length":3,"byteOffset":4,"byteLength":12,"BPE":4}]');
                              expect(glm.$to_string(new ArrayBuffer(16))).to.equal('[object ArrayBuffer {"byteLength":16}]');
                              expect(glm.$to_string(function asdf(){})).to.equal('[function asdf]');

                           });
                     });

            var qq;
            describe('...', function() {
                        it('.epsilon', function() {
                              glm.epsilon().should.be.lessThan(1e-5).and.greaterThan(-1e-5);
                           });
                        it('.degrees', function() {
                              expect(Math.PI/6).to.be.degrees(30);
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
                        it('.perspective', function() {
                              var Projection = glm.perspective(glm.radians(45.0), 4.0 / 3.0, 0.1, 100.0);
                              var str = glm.$to_string(Projection);
                              expect(
                                 str
                              ).to.equal('mat4x4(\n\t(1.810660, 0.000000, 0.000000, 0.000000), \n\t(0.000000, 2.414214, 0.000000, 0.000000), \n\t(0.000000, 0.000000, -1.002002, -1.000000), \n\t(0.000000, 0.000000, -0.200200, 0.000000)\n)' );
                              var b = glm.perspective(glm.radians(30), 1, .1,10);
                              expect(b+'').not.to.equal(Projection+'');
                              expect(b+'').not.to.equal(str);
                           });
                        
                        describe('.rotate', function() {
                                    var UP = glm.vec3(0,1,0);
                                    var angle = glm.radians(45);
                                    var ref = glm.toMat4(glm.angleAxis(angle, UP));
                                    //it('<mat4,angle,vec3>', function() {
                                          expect(
                                             glm.rotate(glm.mat4(), glm.radians(45), UP)
                                          ).to.eql(ref)
                                    //   });
                                    //it('<angle,vec3>', function() {
                                          expect(
                                             glm.rotate(glm.radians(45), UP)
                                          ).to.eql(ref)
                                     //  });
                                 });
                        describe('.scale', function() {
                                    var ref = '1000020000300001';
                                    it('<mat4,vec3>', function() {
                                          expect( 
                                             glm.scale(glm.mat4(), glm.vec3(1,2,3))
                                          ).to.flatten.into(ref)
                                       });
                                    it('<vec3>', function() {
                                          expect( 
                                             glm.scale(glm.vec3(1,2,3))
                                          ).to.flatten.into(ref)
                                       });
                                 });
                        describe('.translate', function() {
                                    var ref = '1000010000101231';
                                    it('<mat4,vec3>', function() {
                                          expect( 
                                             glm.translate(glm.mat4(), glm.vec3(1,2,3))
                                          ).to.flatten.into(ref)
                                       });
                                    it('<vec3>', function() {
                                          expect( 
                                             glm.translate(glm.vec3(1,2,3))
                                          ).to.flatten.into(ref)
                                       });
                                 });
                        it('.angleAxis', function() {
                              qq = glm.angleAxis(glm.radians(45.0), glm.vec3(0,1,0));
                              expect(qq).to.glm_eq([ 0, 0.3826834261417389, 0, 0.9238795042037964 ]);
                              expect((glm.eulerAngles(qq)[1])).to.approximate.degrees(45.0);
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
                              expect(glm.min(glm.vec3(-1,0,1.5),1)).to.glm_eq([-1,0,1]);
                           });
                        it('.max', function() {
                              expect(glm.max(0,.5)).to.equal(.5);
                              expect(glm.max(glm.vec2(0,.5),1)).to.glm_eq([1,1]);
                           });
                        it('.abs', function() {
                              expect(glm.abs(-1)).to.equal(1);
                              expect(glm.abs(glm.vec3(-1,2,-3))).to.glm_eq([1,2,3]);
                           });
                        it('.frexp', function() {
                              expect(glm.frexp(Math.PI)).to.be.roughly([.78539816,2]);
                              expect(function(){
                                        glm.frexp(glm.vec2(0,.5))
                                     }).to.throw("expected ivec2");
                              var iv = glm.ivec2();
                              expect(glm.frexp(glm.vec2(Math.PI,Math.PI/2),iv)).to.be.roughly([.78539816,.78539816]);
                              expect(iv).to.glm_eq([2,1]);

                              var arr = [];
                              expect(glm.frexp(Math.PI/3, arr)).to.be.roughly(.52359877);
                              expect(arr[0]).to.equal(1);
                              expect(arr).to.be.roughly([1,.52359877]);
                              expect(glm.frexp(0, arr)).to.equal(0);
                              expect(arr).to.be.eql([0,0]);
                              expect(glm.frexp(glm.epsilon()/1e16, arr)).to.be.roughly(0.944473,.01);
                              expect(arr).to.be.roughly([-73,.944473]);
                              expect(glm.frexp(0)).to.eql([0,0]);
                              expect(glm.frexp(1e-323), "subnormal").to.eql([0.5, -1072]);
                           });
                        it('.all', function() {
                              expect(glm.all(glm.bvec4(1)),
                                     GLM.$to_array(glm.bvec4(1)).filter(Boolean).length).to.equal(true);
                              expect(glm.all(glm.bvec4(1,false))).to.equal(false);
                              expect(glm.all(glm.vec2(0,.5))).to.equal(false);
                              expect(glm.all(glm.quat(1))).to.equal(false);
                              expect(glm.all(glm.ivec3(3,2,1))).to.equal(true);
                              expect(glm.all(glm.uvec3(3,2,1))).to.equal(true);
                              expect(glm.all(glm.bvec4([1,2,3]))).to.equal(true);
                           });
                        it('._sign', function() {
                              // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
                              expect([ 3, -3, '-3', 0, -0, NaN, 'foo', undefined, null ]
                                     .map(glm._sign)).to.eql(
                                        [ 1, -1, -1, 0, -0, NaN, NaN, NaN, 0 ]);
                              expect([ 3, -3, '-3', 0, -0, NaN, 'foo', undefined, null ]
                                     .map(glm.__sign, '__sign')).to.eql(
                                        [ 1, -1, -1, 0, -0, NaN, NaN, NaN, 0 ]);
                           });
                        if ("sign" in Math) {
                           it('Math.sign sanity check', function() {
                                 expect([ 3, -3, '-3', 0, -0, NaN, 'foo', undefined, null ]
                                        .map(Math.sign)).to.eql(
                                           [ 1, -1, -1, 0, -0, NaN, NaN, NaN, 0 ]);
                              });
                        }
                        it('.sign', function() {
                              var e = glm.epsilon();
                              expect([ e, -e, 3, -3, '-3', 0, -0, NaN, 'foo', undefined, null ]
                                     .map(glm.sign)).to.eql(
                                        [ 1, -1, 1, -1, NaN, 0, -0, NaN, NaN, NaN, 0 ]);
                           });
                        it('.sign<vec>', function() {
                              expect(glm.sign(glm.vec2(1,-1))).to.eql(glm.vec2(1,-1));
                              expect(glm.sign(glm.vec2(0))).to.eql(glm.vec2(0));
                              expect(glm.sign(glm.vec4(-glm.epsilon(),glm.pi())))
                                 .to.eql(glm.vec4(-1,1));
                              expect(glm.sign(glm.ivec4(-glm.epsilon(),-5,4,3)))
                                 .to.eql(glm.ivec4(0,-1,1,1));
                              expect(glm.sign(glm.ivec4(-6,-5,4,3)))
                                 .to.eql(glm.ivec4(-1,-1,1,1));
                           });
                        
                        it('.mix<vec2>', function() {
                              expect(glm.mix(glm.vec2(1,2), glm.vec2(2,1), .5)).to.be.glsl('vec2(1.5)');
                           });
                        it('.mix<quat>', function() {
                              var qa = glm.angleAxis(glm.radians(45), glm.vec3(0,1,0));
                              var qb = glm.angleAxis(glm.radians(-35), glm.vec3(0,1,0));
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
                        it('$template link',function() {
                              expect(glm.mul.link('mat4,mat4')(glm.mat4(2),glm.mat4(3))).to.eql(glm.mat4(2)['*'](glm.mat4(3)));
                              expect(function() {
                                        glm.mul.link('asdf')(glm.mat4(2),glm.mat4(3));
                                     }).to.throw("error linking");
                              expect(glm.translate.link('vec3')(glm.vec3(3))).to.eql(glm.translate(glm.vec3(3)));

                              expect(function() { glm.$extern('nonexist')() }).to.throw("unresolved external symbol");
                              glm.$outer.intern({ newfunc: function() { glm.$log('newfunc!'); return Math.PI; }});
                              expect(glm.$extern('newfunc')()).to.equal(Math.PI);
                           });
                        it('$template', function() {
                              expect(glm.$template).to.be.an('object');
                              expect([Float32Array, new Float32Array(), new ArrayBuffer(),'hi',null,undefined,1,NaN,[],{},glm.vec3(),{toString: function() { return '[object Asdf]' }}].map(glm.$template.jstypes.get))
                                 .to.eql(["function", "Float32Array", "ArrayBuffer", "string","null","undefined","float","float","array","<unknown object,[object Object]>","vec3","<unknown object,[object Asdf]>"]);


                              expect(glm.$template._genArgError({$sig:'test','number,string':true}, 'dbg', 'TV', ['args',true,undefined,false])+'')
                                 .to.equal('GLMJSError: unsupported argtype to dbg test: [typ=TV] :: got arg types: string,bool // supported types: number,string');

                              expect(function(){ glm.$outer.$import(); }).to.throw("already called");
                           });
                        it('$template exceptions', function() {
                              if (1){
                                 var old = glm.$DEBUG;
                                 glm.$DEBUG = true;
                                 glm.$template.extend(
                                    glm,
                                    glm.$template['declare<T>'](
                                       {
                                          gettype: {
                                             'vec<N>': function(thing) { return glm.$isGLMObject(thing) && thing.$type; },
                                             'vec3':function(thing) { return "vec3-specific"; },
                                             'array': function(thing) { return 'array#'+thing.length; }
                                          }
                                       }
                                    )
                                 );
                                 expect(glm.gettype(glm.vec3())).to.equal('vec3-specific');
                                 expect(glm.gettype(glm.vec2())).to.equal('vec2');
                                 function override(replace) {
                                    glm.$template.extend(
                                       glm,
                                       glm.$template.override(
                                          'template<T>', 'gettype',
                                          {
                                             'vec<N>': function(thing) { return glm.$isGLMObject(thing) && 'xx'+thing.$type; }
                                          }, GLM.$outer.functions, replace /* skip existing? */
                                       )
                                    );
                                 }
                                 override(false);
                                 expect(glm.gettype([1,2,3])).to.equal('array#3');
                                 expect(glm.gettype(glm.vec4())).to.equal('vec4');
                                 expect(glm.gettype(glm.vec3())).to.equal('vec3-specific');
                                 expect(glm.gettype(glm.vec2())).to.equal('vec2');
                                 override(true);
                                 expect(glm.gettype([1,2,3])).to.equal('array#3');
                                 expect(glm.gettype(glm.vec4())).to.equal('xxvec4');
                                 expect(glm.gettype(glm.vec3())).to.equal('xxvec3');
                                 expect(glm.gettype(glm.vec2())).to.equal('xxvec2');
                                 glm.$DEBUG = old;
                              }

                              {
                                 var old = glm.$DEBUG;
                                 glm.$DEBUG = true;
                                 function t(){}
                                 t.toString = function() { return 'bogus/0*'; };
                                 expect(function() { glm.$template._traceable('hint', t)}).to.throw();
                                 glm.$DEBUG = old;
                              }

                           });
                        it('$template traceable function names', function() {
                              expect(function() { glm.$template._traceable('nonfunc', 5) }).to.throw("_traceable expects tidy function");
                              var src = glm.$template._traceable('hint',function(a,b,c) { return [a,b,c]; });
                              if(typeof mocha === 'object' && mocha && mocha._in_blanket_run)
                                 src=src.replace(/window[.][_][$]blanket.*?;\n/g,'');
                              expect(src).to.equal('1,function (){ "use strict"; function hint(a,b,c) { return [a,b,c]; }; return hint; "_traceable"; }');
                              expect(function(){glm.$template._traceable('rehint', eval(src))}).to.throw('already wrapped');
                              var func = eval(src)();
                              expect((func).toString().replace(/[\s\r\n;]/g,' ').replace(/\s+/g,' ')).to.equal('function hint(a,b,c) { return [a,b,c] }');
                              expect(glm.$template._get_argnames(func).toString()).to.equal("a,b,c");
                              expect(func.name).to.equal("hint");
                           });

                        it('operators', function() {
                              expect(glm.$to_array(glm.vec3(1).sub(glm.vec3(2,1,2)))).to.eql([-1,0,-1]);
                              expect(glm.$to_array(glm.vec2(1)['-'](glm.vec2(2,2)))).to.eql([-1,-1]);
                              expect(glm.$to_array(glm.vec3(1)['+'](glm.vec3(2)))).to.eql([3,3,3]);
                              var v = glm.vec3(1,2,3);
                              v['+'](glm.vec3(10));
                              expect(v).to.glm_eq([1,2,3]);
                              v['+='](glm.vec3(10));
                              expect(v).to.glm_eq([11,12,13]);
                              v['-='](v);
                              expect(v).to.glm_eq([0,0,0]);

                              {
                                 var v4 = glm.vec4(1,2,3,4);
                                 v4['+='](glm.uvec4(-10.5,-21.1,-3,0.5));
                                 v4['+='](glm.ivec4(2.5,3.1,-4,-8.5));
                                 v4.xyz['+='](glm.uvec3(3.1,2.1,12.1));
                                 v4.xyz['+='](glm.ivec3(-13.2,-2.2,-11.2));
                                 v4.xy['+='](glm.uvec2(9,8));
                                 v4.xy['+='](glm.ivec2(7,6));
                                 expect(v4).to.glm_eq([-1,-2,-3,-4]);
                              }
                              {
                                 var samples = {
                                    fvec: [0,0,glm.vec2(1,-2),glm.vec3(3,-4,5),glm.vec4(-6,7,-8,9)],
                                    ivec: [0,0,glm.ivec2(1,-2),glm.ivec3(3,-4,5),glm.ivec4(-6,7,-8,9)],
                                    uvec: [0,0,glm.uvec2(1,-2),glm.uvec3(3,-4,5),glm.uvec4(-6,7,-8,9)],
                                    bvec: [0,0,glm.bvec2(1,-2),glm.bvec3(3,-4,5),glm.bvec4(-6,7,-8,9)],
                                    '+': [0,0,'vec2(2,-4)','vec3(6,-8,10)','vec4(-12,14,-16,18)'],
                                    '-': [0,0,'vec2(0)','vec3(0)','vec4(0)'],
                                    test: function(t, u, _) {
                                       function compare(v,c) {
                                          var ex = samples[c][_].replace(/vec[2-4]/,a.$type);
                                          expect(glm.$to_glsl(v), [a.$type,c,b.$type].join(" "))
                                             .to.equal(ex);
                                       }
                                       var a = samples[t+'vec'][_];
                                       var b = samples[u+'vec'][_];

                                       compare(a['+'](b), '+');
                                       compare(a.clone()['+='](b), '+');
                                       
                                       compare(a['-'](b), '-');
                                       compare(a.clone()['-='](b), '-');
                                    }
                                 };
                                 ['f','u','i'].forEach(
                                    function(t) {
                                       ['u','i'].forEach(
                                          function(u) {
                                             [2,3,4].forEach(
                                                function(_) {
                                                   samples.test(t,u,_);
                                                });
                                          });
                                    });
                                 /* TODO:   uvecN + vecN / ivecN + uvecN / etc. */
                              }
                              
                              var bv = glm.bvec3(true);
                              bv['='](glm.vec3(1,0,0));
                              expect(bv.json).to.equal('{"x":true,"y":false,"z":false}');
                              expect(glm.$to_array(glm.vec4(2.5,-.5,Math.PI,0).add(glm.vec4(-2.5,.5,-Math.PI,-0)))).to.eql([0,0,0,0]);
                              expect(glm.vec3(1)['=='](glm.vec3(2))).to.be.equal(false);
                              expect(glm.vec2(1)['=='](glm.vec2(2))).to.be.equal(false);
                              expect(glm.vec4(1)['=='](glm.vec4(2))).to.be.equal(false);
                              expect(glm.vec4(1).eql(glm.vec4(1))).to.be.equal(true);
                              expect(glm.uvec4(-1.5)['=='](glm.uvec4(-1))).to.be.equal(true);
                              expect(glm.uvec3(-2.9)['=='](glm.uvec3(-2))).to.be.equal(true);
                              expect(glm.uvec2(-2.9)['=='](glm.uvec2(-2))).to.be.equal(true);
                              expect(glm.ivec4(-1.5)['=='](glm.ivec4(-1)),glm.ivec4(-1.5)).to.be.equal(true);
                              expect(glm.ivec3(-2.9)['=='](glm.ivec3(-2))).to.be.equal(true);
                              expect(glm.mat4(1)['=='](glm.mat4(0))).to.be.equal(false);
                              expect(glm.quat(1)['=='](glm.quat(1))).to.be.equal(true);

                              expect(function() {glm.epsilonEqual(glm.mat4(1),glm.mat4(1),glm.epsilon());})
                                 .to.throw("accept floating-point");

                              expect(glm.vec3(-3+glm.epsilon())['=='](glm.vec3(-3))).to.be.equal(false);
                              expect(glm.vec3(-3+glm.epsilon())['~='](glm.vec3(-3))).to.be.equal(true);
                              
                              expect(glm.equal(glm.ivec3(),glm.ivec3())).to.be.glsl('bvec3(1)');
                              expect(glm.equal(glm.uvec3(1.1),glm.uvec3(1))).to.be.glsl('bvec3(1)');
                              expect(glm.equal(glm.ivec4(-1.1),glm.ivec4(-1))).to.be.glsl('bvec4(1)');
                              expect(glm.equal(glm.vec2(1,2),glm.vec2(2,2))).to.be.glsl('bvec2(0,1)');
                              expect(glm.equal(glm.bvec2(true,false),glm.bvec2(true,false))).to.be.glsl('bvec2(1)');
                              expect(glm.equal(glm.bvec2(true,true),glm.bvec2(true,false))).to.be.glsl('bvec2(1,0)');
                              expect(glm.equal(glm.bvec3(true,true),glm.bvec3(true,false))).to.be.glsl('bvec3(1,0)');
                              expect(glm.equal(glm.bvec4(true,true,glm.epsilon(),1),glm.bvec4(true,false,-.25,0))).to.be.glsl('bvec4(1,0,1,0)');
                              expect(glm.epsilonEqual(glm.vec2(1,2),glm.vec2(1+glm.epsilon(),2),glm.epsilon())).to.be.glsl('bvec2(1)');
                              expect(glm.epsilonEqual(glm.uvec4(1,2),glm.uvec4(1+glm.epsilon(),2),glm.epsilon())).to.be.glsl('bvec4(1)');
                              expect(glm.epsilonEqual(glm.ivec4(1,-2),glm.ivec4(1+glm.epsilon(),-2),glm.epsilon())).to.be.glsl('bvec4(1)');
                           });
                        it("= [array assignment]", function() {
                              var v3 = glm.vec3();
                              v3.xyz = [1,2,3];
                              expect(v3).to.glm_eq([1,2,3]);

                              var bv3 = glm.bvec3();
                              bv3['=']([true,true,false]);
                              expect(bv3).to.be.glsl('bvec3(1,1,0)');
                              var m4 = glm.mat4();
                              m4[3] = [1,2,3,4];
                              expect(m4).to.flatten.into("1000010000101234");
                              m4['=']([
                                         [1,1,1,1],
                                         [2,2,2,2],
                                         [3,3,3,3],
                                         [4,4,4,4]
                                      ]);
                              expect(m4).to.flatten.into("1111222233334444");
                              m4['='](glm.$to_array(glm.mat3(glm.vec3(5),
                                                             glm.vec3(6),
                                                             glm.vec3(7))));
                              expect(m4).to.flatten.into("5550"+
                                                         "6660"+
                                                         "7770"+
                                                         "0001");
                              
                           });
                        it("swizzles", function() {
                              var v4 = glm.vec4();
                              v4.xyz = glm.vec3(1,2,3);
                              expect(v4).to.glm_eq([1,2,3,0]);
                              v4.yz = [8,9];
                              expect(v4.yz).to.be.instanceOf(glm.vec2);
                              expect(v4.yz).to.glm_eq([8,9]);
                              expect(v4).to.glm_eq([1,8,9,0]);
                              v4.zw = [4,5];
                              expect(v4).to.glm_eq([1,8,4,5]);
                              v4.yzw = glm.vec3(2,3,4);
                              expect(v4).to.glm_eq([1,2,3,4]);

                              expect(glm.uvec4(1,2,3,4).zw).to.be.instanceOf(glm.uvec2);
                              expect(glm.uvec4(1,2,3,4).zw).to.eql(glm.uvec2(3,4));
                              expect(glm.uvec3(1,2,3).xyz).to.glm_eq([1,2,3]);
                              expect(glm.uvec2(2).xy).to.glm_eq([2,2]);

                              expect(glm.ivec4(1,2,3,4).zw).to.be.instanceOf(glm.ivec2);
                              expect(glm.ivec4(1,2,-3,4).zw).to.eql(glm.ivec2(-3,4));
                              expect(glm.ivec3(-1,2,3).xyz).to.glm_eq([-1,2,3]);
                              expect(glm.ivec2(-2).xy).to.glm_eq([-2,-2]);
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

                              var m = glm.mat3(2);
                              expect(m['*'](glm.mat3(3))).to.flatten.into('600060006');
                              m['*='](glm.mat3(3));
                              expect(m).to.flatten.into('600060006');
                              expect( glm.mat3(glm.$to_object(glm.mat3())) ).to.be.glsl("mat3(1)");
                           });
                        it('clone', function() {
                              var a = glm.mat3(1);
                              var b = a.clone();
                              expect(a).not.to.equal(b);
                              expect(a).to.eql(b);
                           });
                     });


            describe('mat4', function() {
              describe('core operations', function() {
                it("construction by reference", 
               function() {
                  var ref = glm.mat4(2);
                  expect(ref).to.be.glsl("mat4(2)");
                  var byref = glm.mat4(ref);
                  expect(ref.elements).to.equal(byref.elements);
                  var bycopy = new glm.mat4(ref);
                  expect(ref.elements).not.to.equal(bycopy.elements);
               });
                it("construction by n", 
               function() {
                  // mat4(undefined) == identity
                  expect( glm.mat4() )
                     .to.glm_eq([ 1, 0, 0, 0,
                                  0, 1, 0, 0,
                                  0, 0, 1, 0,
                                  0, 0, 0, 1 ]);
                  expect( glm.mat4(0) )
                     .to.glm_eq([ 0, 0, 0, 0,
                                  0, 0, 0, 0,
                                  0, 0, 0, 0,
                                  0, 0, 0, 0 ]);

                  expect( glm.mat4(-2) )
                     .to.glm_eq([-2, 0, 0, 0,
                                 0,-2, 0, 0,
                                 0, 0,-2, 0,
                                 0, 0, 0,-2 ]);

                  expect(glm.mat4(0,  1,  2,  3,
                                  4,  5,  6,  7,
                                  8,  9,  10, 11,
                                  12, 13, 14, 15))
                     .to.glm_eq([ 0,  1,  2,  3,
                                  4,  5,  6,  7,
                                  8,  9,  10, 11,
                                  12, 13, 14, 15 ]);
               });
               it("construction by arrays", 
               function() {
                  expect(glm.mat4([ 0,  1,  2,  3,
                                    4,  5,  6,  7,
                                    8,  9,  10, 11,
                                    12, 13, 14, 15 ]))
                     .to.glm_eq([ 0,  1,  2,  3,
                                  4,  5,  6,  7,
                                  8,  9,  10, 11,
                                  12, 13, 14, 15 ]);
               });
               it("construction by objects",
               function() {
                  expect( glm.mat4(glm.mat3(3)) )
                     .to.flatten.into('3000030000300001');

                  var qspin = glm.quat([ 0, 1, 0, 6.123031769111886e-17 ]);

                  expect( glm.toMat4(qspin) )
                     .to.glm_eq([-1, 0,-0, 0,
                                  0, 1, 0, 0,
                                 -0, 0,-1, 0,
                                  0, 0, 0, 1 ], glm.epsilon());

                  var qq = glm.angleAxis(glm.radians(45.0), glm.vec3(0,1,0));

                  var s = Math.sin(glm.radians(45.0));
                  expect( glm.toMat4(qq) )
                     .to.glm_eq([ s, 0,-s, 0,
                                  0, 1, 0, 0,
                                  s, 0, s, 0,
                                  0, 0, 0, 1 ], glm.epsilon() );

                  expect( glm.mat4(glm.$to_object(glm.mat4())) ).to.be.glsl("mat4(1)");
               });
               it('lookAt', function() {
                  expect(glm.lookAt(glm.vec3(0), glm.vec3(1), glm.vec3(0,1,0)))
                        .euler.to.approximate.glm_eq([-135, 35.264389, -150]);
               });
             });
             it('exceptions', function() {
                   expect(function() { glm.mat4({}); }).to['throw'](/unrecognized object passed to .*?\bmat4/);
                   expect(function() { glm.mat4(null); }).to['throw'](/unrecognized object passed to .*?\bmat4/);
                   expect(function() { glm.mat4(glm.vec4()); }).to['throw'](/unrecognized object passed to .*?\bmat4/);
                   expect(function() { glm.mat4([1,2,3,4]); }).to['throw'](/unrecognized object passed to .*?\bmat4/);
                   expect(function() { glm.mat4(undefined); }).to['throw']("no constructor found for: glm.mat4(undefined)");
                });
             it('mat3-partial assignment', function() {
                   var m4 = glm.mat4("1111222233334444".split(""));
                   m4['='](glm.mat4(glm.mat3(glm.vec3(5),
                                             glm.vec3(6),
                                             glm.vec3(7))));
                   expect(m4).to.flatten.into("5550"+
                                              "6660"+
                                              "7770"+
                                              "0001");
                });
             it('invert tranpose', function() {
                   glm.to_string(glm.transpose(glm.inverse(glm.toMat4(qq)))).should.equal('mat4x4((0.707107, 0.000000, -0.707107, 0.000000), (0.000000, 1.000000, 0.000000, 0.000000), (0.707107, 0.000000, 0.707107, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');
                });
        
                it('inverse', function() {
                      expect(glm.inverse(glm.diagonal4x4(glm.vec4(2)))).to.be.eql(glm.mat4(.5));
                      expect(glm.inverse(glm.diagonal4x4(glm.vec4(1)))).to.be.eql(glm.mat4(1));
                      var nodeterminant = glm.diagonal4x4(glm.vec4(0));
                      expect(glm.inverse(nodeterminant)).to.eql(glm.mat4(1));

                   });
                it('multiply neatly', function() {
                   expect(glm.mat4().mul(glm.mat4())).to.be.instanceOf(glm.mat4);

                   var a = glm.toMat4(glm.angleAxis(glm.radians(60), glm.vec3(0,0,1)));
                   var b = glm.toMat4(glm.angleAxis(glm.radians(45), glm.vec3(0,1,0)));
                   var bstr = 'mat4x4((0.707107, 0.000000, -0.707107, 0.000000), (0.000000, 1.000000, 0.000000, 0.000000), (0.707107, 0.000000, 0.707107, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))';
                   expect(glm.to_string(a))
                     .to.equal('mat4x4((0.500000, 0.866025, 0.000000, 0.000000), (-0.866025, 0.500000, 0.000000, 0.000000), (0.000000, 0.000000, 1.000000, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');
                   expect(glm.to_string(b)).to.equal(bstr);

                   expect(glm.to_string(
                             a['*'](b)
                          ), 'normal mul')
                         .to.equal( 'mat4x4((0.353553, 0.612372, -0.707107, 0.000000), (-0.866025, 0.500000, 0.000000, 0.000000), (0.353553, 0.612372, 0.707107, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))' );

                   a['*='](b);
                   expect(glm.to_string(b)).to.equal(bstr);
                   expect(glm.to_string(a),'mul_eq')
                     .to.equal( 'mat4x4((0.353553, 0.612372, -0.707107, 0.000000), (-0.866025, 0.500000, 0.000000, 0.000000), (0.353553, 0.612372, 0.707107, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');

                   });
               });

            describe('quat', function() {
                        it('core operations', function() {
                              expect(glm.quat()).to.glm_eq([0,0,0,1]);
                              glm.$to_array(glm.quat()).should.eql([0,0,0,1]);
                              glm.to_string(glm.quat()).should.equal('<quat>fvec3(0.000000, 0.000000, 0.000000)');
                              expect(glm.quat()).to.euler(1).be.degrees(0);
                              expect(glm.quat(glm.quat())).to.glm_eq([0,0,0,1]);
                              expect(glm.quat(glm.vec3())).to.glm_eq([0,0,0,1]);
                              expect(glm.quat(glm.vec3(glm.radians(3)))).euler.to.glm_eq([3,3,3]);
                              expect(glm.quat(glm.radians(glm.vec3(15,30,45)))).euler.to.glm_eq([15,30,45]);
                              expect(glm.normalize(glm.quat({w:.8,x:.2,y:.2,z:.2}))).euler.to.glm_eq([33.69006,18.40848,33.69006]);

                              expect(glm.normalize(glm.quat(1.01,2.02,3.03,4.04))[0]).to.be.approximately(.365,.001);

                              var q = glm.normalize(glm.angleAxis(glm.radians(30), glm.normalize(glm.vec3(1))));
                              expect(q).euler.to.glm_eq([20.1039,14.1237,20.1039]);
                              
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

                              var q = glm.angleAxis(glm.radians(45.0),glm.vec3(0,1,0));;
                              var m=glm.toMat4(q);
                              var n=glm.toMat4(q);
                              n[3].xyz = [1,2,3];
                              expect(n).to.not.eql(m);

//                               var q = glm.angleAxis(glm.radians(45.0),glm.vec3(0,1,0));;
//                               var m=glm.mat4(q);
//                               var n=glm.mat4(q);
//                               n[3].xyz = [1,2,3];
//                               expect(n).to.not.eql(m);
                              
                              var q = glm.quat();
                              q.xyzw = [0,0,0,9];
                              expect(q.w).to.equal(9);
                              expect(q).to.eql(glm.quat(9,0,0,0));

                              q.wxyz = [8,0,0,0];
                              expect(q).to.eql(glm.quat(8,0,0,0));
                              expect(q.wxyz).to.glm_eq([8,0,0,0]);
                              expect(q.wxyz).to.be.instanceOf(glm.vec4);
                              expect(q.w).to.equal(8);

                              expect(function() { glm.quat("1","2","3","4"); })
                                 .to['throw'](/no constructor found for: glm.quat.string/);
                              expect(glm.quat({"w":"1","x":"0","y":"0","z":"0"})).to.be.glsl("quat(1)");
                           });
                        it('core operations, as a mat4 too', function() { 
                              glm.to_string(glm.toMat4(qq)[0]).should.equal('fvec4(0.707107, 0.000000, -0.707107, 0.000000)');
                              glm.to_string(glm.toMat4(qq)[2]).should.equal('fvec4(0.707107, 0.000000, 0.707107, 0.000000)');
                              glm.to_string(glm.toMat4(qq).mul(glm.vec4(1,2,3,1)))
                                 .should.equal('fvec4(2.828427, 2.000000, 1.414214, 1.000000)');
                           });
                        it('from mat4', function() {
                              var m = glm.mat4();
                              expect(glm.quat(m)).to.glm_eq([0,0,0,1]);
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
                        it('angle/axis', function() {
                              expect(glm.axis(glm.angleAxis(glm.radians(45),glm.vec3(0,1,0))))
                                 .to.approximate.glm_eq([0,1,0],glm.epsilon());
                              expect(glm.axis(glm.quat()))
                                 .to.glm_eq([0,0,1]);
                              expect((glm.angle(glm.angleAxis(glm.radians(45),glm.vec3(0,1,0)))))
                                 .to.be.degrees(45);
                           });
                        it('exceptions', function() {
                              expect(function(){glm.quat({})}).to['throw'](/unrecognized object passed to.*?\bquat/);
                              expect(function(){glm.quat(null)}).to['throw'](/unrecognized object passed to.*?\bquat/);
                              expect(function(){glm.quat(0)}).to['throw'](/only quat.1. syntax supported/);
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

                              expect(function() { glm.vec2("1","2"); })
                                 .to['throw'](/no constructor found for: glm.vec2.string/);
                              expect(glm.vec2({"x":"1","y":"1"})).to.be.glsl("vec2(1)");
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
                              var v3 = glm.vec3();
                              v3['='](glm.bvec3(true));
                              expect(v3).to.glm_eq([1,1,1]);

                              expect(function() { glm.vec3("1","2","3"); })
                                 .to['throw'](/no constructor found for: glm.vec3.string/);
                              expect(glm.vec3({"x":"1.1","y":"2.2","z":"3.3"})).to.be.glsl("vec3(1.1,2.2,3.3)",{precision:1});
                           });
                        it('exceptions', function(){
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
                        it('inplace multiply by a quat (experimental)', function(){ 
                              var v3 = glm.vec3(100,-200,300);
                              var qspin = glm.angleAxis(glm.radians(30), glm.vec3(0,1,0));
                              var vq_mul_eq = glm.mul_eq.link('inplace:vec3,quat');
                              var ref = glm.$to_array(v3['*'](qspin));
                              vq_mul_eq(v3, qspin);
                              expect(v3, 'ref').to.glm_eq(ref);
                              expect(
                                 v3,
                                 "vec3 * quat"
                              ).to.glm_eq([-63.4,-200,309.8], .05);
                           });
                        it('lengthify', function(){ 
                              glm.length(glm.vec3(Math.PI)).should.be.approximately(5.44,.1);
                           });
                        it('normalize', function(){ 
                              glm.length(glm.normalize(glm.vec3(2,2,2))).should.be.approximately(1,glm.epsilon());
                              glm.$to_array(glm.normalize(glm.vec3(0,2,0))).should.eql([0,1,0]);
                           });
                        it('cross', function(){ 
                              var v1 = glm.vec3(1.0, 2.0, 3.0);
                              var v2 = glm.vec3(4.0, 5.0, 6.0);
                              expect(glm.cross(v1, v2)).to.glm_eq([-3.0, 6.0, -3.0]);

                              expect(glm.cross(glm.vec3(1,0,0), glm.vec3(0,1,0))).to.glm_eq([0,0,1]);

                              expect(glm.cross(glm.vec2(1,0), glm.vec2(0,1))).to.glm_eq([0,0,1]);
                           });
                        it('dot', function(){ 
                              var v1 = glm.vec3(1.0, 2.0, 3.0);
                              var v3 = glm.vec3(0.0, 3.0, 4.0);
                              expect(glm.dot(v1, v3)).to.equal(18.0);

                              expect(glm.dot(glm.vec3(1,2,3), glm.vec3(3,2,1))).to.equal(10);
                              expect(glm.dot(glm.vec3(1), glm.vec3(2))).to.equal(6);
                              expect(glm.dot(glm.vec3(-1,1,1), glm.vec3(1,-1,1))).to.equal(-1);
                           });
                        it('spin about a quat', function() {
                              var qspin = glm.quat([ 0, 1, 0, 6.123031769111886e-17 ]);
                              expect(
                                 glm.vec3(100).mul(qspin),
                                 "vec3 * quat"
                              ).to.glm_eq([-100,100,-100]);

                              expect(
                                 qspin.mul(glm.vec3(100)),
                                 "quat * vec3"
                              ).to.glm_eq([-100,100,-100]);
                           });
                        it('mixify', function(){ 
                              expect(
                                 glm.mix( glm.vec3(1), glm.vec3(2), 1/Math.PI )
                              ).to.be.glsl('vec3(1.3183099031448364)');
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

                              expect(glm.vec4()['='](glm.uvec4(-1.5,2,3,4))).to.glm_eq([-1,2,3,4]);
                              expect(glm.vec4()['='](glm.ivec4(-1.5,2,-3,4))).to.glm_eq([-1,2,-3,4]);

                              expect(function() { glm.vec4("1","2","3","4"); })
                                 .to['throw'](/no constructor found for: glm.vec4.string/);
                              expect(function() { glm.vec4({a:1,b:2,c:3,d:4}); })
                                 .to['throw'](/unrecognized object passed to GLM.vec4/i);
                              expect(glm.vec4({"x":"1.1","y":"2.2","z":"3.3","w":"4.4"})).to.be.glsl("vec4(1.1,2.2,3.3,4.4)",{precision:1});
                              
                           });
                        it('exceptions', function() {
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

                              expect(
                                 glm.vec4(100)['*'](qspin),
                                 "vec4 * quat"
                              ).to.glm_eq([-100,100,-100,100]);

                              expect(
                                 qspin['*'](glm.vec4(100)),
                                 "quat * vec4"
                              ).to.glm_eq([-100,100,-100,100]);

                           });
                        var M = glm.toMat4(qspin);
                        it('apply mat4', function() {
                              glm.$to_array(glm.vec4(1,2,3,1)['*'](M)).should.eql([-1,2,-3,1]);
                              glm.$to_array(M['*'](glm.vec4(1,2,3,1))).should.eql([-1,2,-3,1]);
                              glm.$to_array(M['*'](glm.vec4(-1,-1,2,2))).should.eql([1,-1,-2,2]);
                           });
                        it('inplace multiply by a mat4 (experimental)', function(){ 
                              var v = glm.vec4(1,2,3,1);
                              var m4 = glm.toMat4(glm.angleAxis(glm.radians(30), glm.vec3(0,1,0)));
                              var vm_mul_eq = glm.mul_eq.link('inplace:vec4,mat4');
                              var ref = glm.$to_array(v['*'](m4));
                              vm_mul_eq(v, m4);
                              expect(v, 'ref').to.glm_eq(ref);
                              expect(v, 'abs').to.glm_eq([-0.63,2,3.09,1],.05);

                              v = glm.vec4(100,-200,300,1);
                              ref = glm.$to_array(v['*'](m4));
                              vm_mul_eq(v, m4);
                              expect(v, 'ref').to.glm_eq(ref);
                           });
                        it('length2ify', function(){ 
                              glm.length2(glm.vec4(Math.PI)).should.be.approximately(39.4784,.1);
                           });
                        it('mixify', function(){ 
                              glm.$to_glsl(glm.mix(glm.vec4(Math.PI),glm.vec4(),.5)).should.equal('vec4(1.5707963705062866)' );
                           });
                     });
            
            describe('other', function() {
                        it('$dumpTypes', function() {
                              var arr = [];
                              glm.$dumpTypes(function(k,v) {
                                                arr.push(k+": "+v);
                                             });
                              glm.$log('arr:'+arr.join("\n"));
                              if(glm.$vectorType) expect(arr.length).to.be.gte(7);
                              if(glm.$int32) expect(arr.length).to.be.gte(10);
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
                        it('.make_<type>(elements)', function(){
                              var bytes = new ArrayBuffer(glm.mat4.BYTES_PER_ELEMENT);
                              var floats = new Float32Array(bytes);
                              [].forEach.call(floats, function(f,_) { floats[_] = _; });
                              expect(glm.make_vec2(floats))
                                 .to.glm_eq([0,1]);
                              expect(glm.make_vec2(bytes))
                                 .to.glm_eq([0,1]);
                              
                              // should not modify bytes...
                              glm.make_vec4(bytes).xyzw = [4,4,4,4];

                              expect(glm.make_vec3(bytes))
                                 .to.glm_eq([0,1,2]);
                              expect(glm.make_quat(floats))
                                 .to.glm_eq([0,1,2,3]);

                              {
                                 expect([].slice.call(floats,0,4)).to.eql([0,1,2,3]);
                                 // new glm.vec<N>(Float32Array) is special case that adopts the typed array
                                 // (and will therefore modify the underlying bytes)
                                 new glm.vec4(floats.subarray(0,4)).xyzw = [4,4,4,4];
                                 expect([].slice.call(floats,0,4)).to.eql([4,4,4,4]);
                              }

                              expect(function() { new glm.mat4(bytes); }).to.throw();

                              expect( glm.make_mat4(bytes)[0]).to.flatten.into("4444");
                              expect( glm.make_mat4(bytes)[1]).to.flatten.into("4567");

                              expect( glm.make_mat3(bytes)[2]).to.flatten.into("678");

                              {
                                 // make_mat4 regression test
                                 var Projection = glm.perspective(glm.radians(45.0), 4.0 / 3.0, 0.1, 100.0);
                                 var m4 = glm.make_mat4(Projection.elements.buffer);
                                 m4[0].xyzw = [1,2,3,4];
                                 expect(
                                    Projection+''
                                 ).to.equal('mat4x4(\n\t(1.810660, 0.000000, 0.000000, 0.000000), \n\t(0.000000, 2.414214, 0.000000, 0.000000), \n\t(0.000000, 0.000000, -1.002002, -1.000000), \n\t(0.000000, 0.000000, -0.200200, 0.000000)\n)' );
                              }

                              expect( function() { new glm.make_vec4({}); } ).to.throw(/not new/);
                              expect( function() { new glm.make_vec4(); } ).to.throw(/undefined/);
                           });
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

                              var b = new ArrayBuffer(100);
                              var mid = new Float32Array(b, 100-4*4);
                              mid[0] = 1;
                              expect(new glm.vec4(mid)).to.glm_eq([1,0,0,0]);
                              expect(glm.make_vec4(mid.buffer)).to.glm_eq([0,0,0,0]); // should this adopt the offset?? not sure yet
                              expect(glm.make_vec4(mid.buffer, mid.byteOffset), "offset: "+mid.byteOffset).to.glm_eq([1,0,0,0]); // should this adopt the offset?? not sure yet

                           });
          if(glm.$vectorType) {
             describe(
                '.$vectorType',
                function() {
                   it('+ / +=', function() {
                         var a = glm.$vvec2(2);
                         a[0] = [1,2];
                         a[1] = [3,4];
                         
                         var b = glm.$vvec2(2);
                         b[0] = glm.vec2(-1);
                         b[1] = glm.vec2(-2);
                         
                         function _(m) { return m.map(GLM.$to_glsl).join("|"); }

                         expect(_( a )).to.equal('vec2(1,2)|vec2(3,4)');
                         expect(_( b )).to.equal('vec2(-1)|vec2(-2)');

                         {
                            var c = a['+'](b);
                            
                            expect(_( a )).to.equal('vec2(1,2)|vec2(3,4)');
                            expect(_( b )).to.equal('vec2(-1)|vec2(-2)');
                            expect(_( c )).to.equal('vec2(1,2)|vec2(3,4)|vec2(-1)|vec2(-2)');
                         }

                         {
                            a['+='](a);
                            
                            expect(_( a )).to.equal('vec2(1,2)|vec2(3,4)|vec2(1,2)|vec2(3,4)');
                         }

                         expect(_( b )).to.equal('vec2(-1)|vec2(-2)');
                         expect(_( b['+'](glm.vec2(5,6)) )).to.equal('vec2(-1)|vec2(-2)|vec2(5,6)');

                         expect(function() { b['+']([1]); }).to.throw(/alignment mismatch/);
                      });
                   it('arrayize', function() {
                         var vv = new glm.$vectorType(glm.vec4, 4).arrayize(true);
                         expect(vv).to.be.instanceOf(glm.$vectorType);
                         
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
                         expect(new glm.mat4(vv.elements)).to.flatten.into('0000111122223333');
                      });
                   it('.setFromBuffers', function() {
                         var mm = new glm.$vmat4(2);
                         mm.setFromBuffers(
                            [ // for future socket.io-streaming support
                               new Float32Array([9,8,7,6]),
                               new Float32Array([5,4]),
                               new Float32Array([3,2,1,0,1,2,3,4,5,6,7,8,9]),
                               new Float32Array([0,1,2,3,4,5,6,7,8,9]),
                               new Float32Array([0,1,2,3,4,5,6,7,8,9].reverse()),
                               new Float32Array([10,11,12,13]),
                               new Float32Array([14,15,16,17]),
                               new Float32Array([18,19,20,21,22,23,24,25,26]),
                            ]);
                         expect(mm).to.flatten.into('98765432101234567890123456789987');
                      });
                   it('.$to_glsl', function() {
                         var mm = new glm.$vmat4(2);
                         mm[0] = glm.toMat4(glm.angleAxis(glm.radians(45), glm.vec3(0,1,0)));
                         expect(glm.$to_glsl(mm, 'mm')).to.equal('mat4 mm[2];\n mm[0] = mat4(0.7071067690849304,0,-0.7071067690849304,0,0,1,0,0,0.7071067690849304,0,0.7071067690849304,0,0,0,0,1);\n mm[1] = mat4(0);');
                         
                         var floats = new glm.$vfloat(2);
                         floats[0] = Math.PI;
                         floats[1] = Math.PI/2;
                         expect(glm.$to_glsl(floats, 'f')).to.equal('float f[2];f[0] = 3.1415927410125732;f[1] = 1.5707963705062866;');
                      });

                   it(
                      'dynamic mode', 
                      function() {
                         // note: there's a small overhead to support/detect dynamic remapping of the underlying Float32Array

                         var a = new Float32Array(4*10);
                         var b = new Float32Array(4*10);
                         b.set([-1,-2,-3,-4,
                                -10,-11,-12,-13]);

                         {
                            // allow .elements to be swapped-out
                            var dynamic = new glm.$vvec4(a, true);
                         }

                         {
                            // marginally-faster setup & access, but ignores future changes to .elements
                            var classic = new glm.$vvec4(a); 
                         }

                         { // initially these will be mutually-entangled (via shared, underlying buffer)

                            expect( dynamic[0].elements.buffer ).to.equal( classic[0].elements.buffer );

                            expect( dynamic[0].elements.buffer ).to.equal( a.buffer );
                            expect( classic[0].elements.buffer ).to.equal( a.buffer );

                            expect(dynamic[0]+'').to.equal(classic[0]+'');
                            expect(classic[1]+'').to.equal(dynamic[1]+'');
                            
                            dynamic[0].xyzw = [1, 2, 3, 4 ];
                            classic[1].xyzw = [10,11,12,13];

                            expect( dynamic[0] ).to.glm_eq( [1, 2, 3, 4 ] );
                            expect( dynamic[1] ).to.glm_eq( [10,11,12,13] );

                            expect( classic[0] ).to.glm_eq( [1, 2, 3, 4 ] );
                            expect( classic[1] ).to.glm_eq( [10,11,12,13] );

                            expect(dynamic[0]).to.glm_eq([].slice.call(classic.elements,0,4));
                            expect(dynamic[0]).to.glm_eq([].slice.call(a,0,4));

                            expect(dynamic[0]).to.not.glm_eq([].slice.call(b,0,4));
                         }

                         dynamic.elements = b; // dynamic[0] will now pull from updated .elements
                         classic.elements = b; // classic[0] will NOT pull from updated .elements

                         { // now unentangled

                            // classic unchanged (still refers to a)
                            expect( classic[0] ).to.glm_eq( [1, 2, 3, 4 ] );
                            expect( classic[1] ).to.glm_eq( [10,11,12,13] );
                            expect( classic[0].elements.buffer ).to.equal( a.buffer );

                            expect( dynamic[0] +'').to.not.equal(classic[0]+'');

                            // dynamic elements now refer to b
                            expect( dynamic[0].elements.buffer ).to.equal( b.buffer );

                            expect( dynamic[0] ).to.glm_eq( [-1, -2, -3, -4 ] );
                            expect( dynamic[1] ).to.glm_eq( [-10,-11,-12,-13] );
                         
                            dynamic[0] = glm.vec4(  9, 8, 7, 6 );
                            dynamic[1] = glm.vec4( -9,-8,-7,-6 );
                            expect( dynamic[0] ).to.glm_eq( [ 9, 8, 7, 6] );
                            expect( dynamic[1] ).to.glm_eq( [-9,-8,-7,-6] );

                            // unchanged
                            expect( classic[0] ).to.glm_eq( [ 1, 2, 3, 4] );
                            expect( classic[1] ).to.glm_eq( [10,11,12,13] );
                         }

                         classic['='](b); // this will re-arrayize, effectively cloning b
                         expect(classic.elements).not.to.equal(b);
                         expect(classic.elements).to.eql(b);

                         expect( classic[0] ).to.glm_eq( [ 9, 8, 7, 6] );
                         expect( classic[1] ).to.glm_eq( [-9,-8,-7,-6] );

                         expect( classic[0] ).to.eql( dynamic[0] );
                         expect( classic[1] ).to.eql( dynamic[1] );

                         dynamic[0]['*='](10);

                         expect(dynamic[0]).to.glm_eq([90,80,70,60]);

                         expect(classic[0]).to.glm_eq([9,8,7,6]); // but still won't be affected by changes to b

                         dynamic['='](a); // this effectively clones a (dynamic !== overwrite-on-copy)
                         expect(dynamic.elements).not.to.equal(a);
                         expect(dynamic.elements).to.eql(a);
                         expect(a).not.to.eql(b);
                         
                         // swap-out underlying buffer with zeros
                         dynamic.elements = new Float32Array(dynamic.elements.length); 
                         classic.elements = new Float32Array(classic.elements.length);
                         
                         expect( dynamic[0] ).to.glm_eq( [0, 0, 0, 0] ); // dynamic is now all zeros (from the fresh buffer)
                         expect( classic[0] ).to.glm_eq( [9, 8, 7, 6] ); // but classic still references its cached buffer...
                      });
                   it('exceptions', function() {
                         expect(function() {
                                   new glm.$vectorType(function() {}, 4);
                                }).to.throw(/expecting.*GLMConstructor/);
                         expect(function() {
                                   new glm.$vectorType(glm.$int32, 4);
                                }).to.throw("unsupported argtype");
                      });
                   it('misc', function() {
                         var i = glm.$int32();
                         expect(i['='](5)).to.equal(i);
                         expect(i['='](4)).to.glm_eq([4]);
                         expect(i['='](glm.$int32(3))).to.glm_eq([3]);
                      });
                });
          }//glm.$vectorType
                     });// buffers
            describe('uvecN', function(){
                        it('core operations', function(){
                              glm.uvec4().should.be.instanceOf(glm.uvec4);
                              glm.$to_array(glm.uvec4(-2.1,-2.5,-2.9,2.9)).should.eql([-2,-2,-2,2]);
                              glm.$to_array(glm.uvec4(.5)).should.eql([0,0,0,0]);
                              glm.$to_array(glm.uvec4(1)).should.eql([1,1,1,1]);
                              glm.$to_array(glm.uvec4(-.5)).should.eql([0,0,0,0]);
                              glm.$to_array(glm.uvec4(glm.vec3(-1,-1.1,-1.9),1)).should.eql([-1,-1,-1,1]);
                              glm.$to_array(glm.uvec4(-1,-1,-1,1)).should.eql([-1,-1,-1,1]);
                              glm.$to_array(glm.uvec4(-1,-1,-1)).should.eql([-1,-1,-1,-1]);
                              glm.$to_array(glm.uvec4(-1,-1)).should.eql([-1,-1,-1,-1]);
                              glm.$to_array(glm.uvec4([-1,-1,-1,-1])).should.eql([-1,-1,-1,-1]);
                              glm.$to_array(glm.uvec4([-1,-1,-1])).should.eql([-1,-1,-1,-1]);
                              glm.$to_array(glm.uvec4([-1,1])).should.eql([-1,1,1,1]);
                              glm.$to_array(glm.uvec4({x:-1,y:1,z:-.1,w:1})).should.eql([-1,1,0,1]);
                              expect(glm.to_string(glm.uvec4(-1.1,-2.2,1.1,2.2))).to.equal("uvec4(-1, -2, 1, 2)");

                              expect(glm.uvec4(2,3,4,5).x).to.equal(2);
                              var uv = glm.uvec4();
                              uv['=']([2,3,4,5]);
                              expect(uv[3]).to.equal(5);
                              uv['='](glm.uvec4(glm.uvec3(1),2));
                              expect(uv[3]).to.equal(2);
                              expect(uv['='](glm.vec4(9))[3]).to.equal(9);

                              expect(glm.uvec4(glm.vec3(1,2,3),4)).to.glm_eq([1,2,3,4]);
                              expect(glm.uvec4(glm.vec2(-1,-2),3,4)).to.glm_eq([-1,-2,3,4]);
                              expect(glm.uvec4(glm.vec4(-1))).to.glm_eq([-1,-1,-1,-1]);
                              expect(glm.uvec4(glm.vec4(1.5,2.5,3.5,4.5))).to.glm_eq([1,2,3,4]);

                              expect(glm.uvec4(glm.ivec4(-1.5,2.5,-3.5,4.5))).to.glm_eq([-1,2,-3,4]);// observed GLM 0.9.6 behavior
                              
                              expect(glm.uvec2()).to.glm_eq([0,0]);
                              expect(glm.$to_json(glm.uvec2({x:1,y:2}))).to.equal('{"x":1,"y":2}');
                              expect(glm.$to_json(glm.uvec3())).to.equal('{"x":0,"y":0,"z":0}');
                              expect(glm.$to_json(glm.uvec3(1))).to.equal('{"x":1,"y":1,"z":1}');
                              expect(glm.$to_json(glm.uvec3(1,2))).to.equal('{"x":1,"y":2,"z":2}');
                              expect(glm.$to_json(glm.uvec3([1,2]))).to.equal('{"x":1,"y":2,"z":2}');
                              expect(glm.$to_json(glm.uvec3([1,2,3,4]))).to.equal('{"x":1,"y":2,"z":3}');
                              expect(glm.$to_json(glm.uvec3(glm.$to_object(glm.vec3(9,8,7))))).to.equal('{"x":9,"y":8,"z":7}');
                              expect(glm.$to_json(glm.uvec3(glm.vec2(1),2))).to.equal('{"x":1,"y":1,"z":2}');
                              expect(glm.$to_json(glm.uvec3(glm.uvec2(1),2))).to.equal('{"x":1,"y":1,"z":2}');

                              expect(glm.uvec4(glm.uvec3(glm.uvec2(2),3),4)).to.glm_eq([2,2,3,4]);
                              expect(glm.uvec4(glm.uvec2(2),3,4)).to.glm_eq([2,2,3,4]);


                           });
                        it('exceptions', function() {
                              expect(function() { glm.uvec4({}); }).to['throw'](/unrecognized object passed to .*?uvec4/);
                              expect(function() { glm.uvec4({},1); }).to['throw'](/unrecognized object passed to .*?uvec4/);


                              expect(function() { glm.uvec3({}); }).to['throw'](/unrecognized object passed to .*?uvec3/);
                              expect(function() { glm.uvec2({}); }).to['throw'](/unrecognized object passed to .*?uvec2/);
                           });
                     });
            describe('ivecN', function(){
                        it('core operations', function(){
                              glm.ivec4().should.be.instanceOf(glm.ivec4);
                              glm.$to_array(glm.ivec4(-2.1,-2.5,-2.9,2.9)).should.eql([-2,-2,-2,2]);
                              glm.$to_array(glm.ivec4(.5)).should.eql([0,0,0,0]);
                              glm.$to_array(glm.ivec4(1)).should.eql([1,1,1,1]);
                              glm.$to_array(glm.ivec4(-.5)).should.eql([0,0,0,0]);
                              glm.$to_array(glm.ivec4(glm.vec3(-1,-1.1,-1.9),1)).should.eql([-1,-1,-1,1]);
                              glm.$to_array(glm.ivec4(-1,-1,-1,1)).should.eql([-1,-1,-1,1]);
                              glm.$to_array(glm.ivec4(-1,-1,-1)).should.eql([-1,-1,-1,-1]);
                              glm.$to_array(glm.ivec4(-1,-1)).should.eql([-1,-1,-1,-1]);
                              glm.$to_array(glm.ivec4([-1,-1,-1,-1])).should.eql([-1,-1,-1,-1]);
                              glm.$to_array(glm.ivec4([-1,-1,-1])).should.eql([-1,-1,-1,-1]);
                              glm.$to_array(glm.ivec4([-1,1])).should.eql([-1,1,1,1]);
                              glm.$to_array(glm.ivec4({x:-1,y:1,z:-.1,w:1})).should.eql([-1,1,0,1]);
                              expect(glm.to_string(glm.ivec4(-1.1,-2.2,1.1,2.2))).to.equal("ivec4(-1, -2, 1, 2)");

                              expect(glm.ivec4(2,3,4,5).x).to.equal(2);
                              var uv = glm.ivec4();
                              uv['=']([2,3,4,5]);
                              expect(uv[3]).to.equal(5);
                              uv['='](glm.ivec4(glm.ivec3(1),2));
                              expect(uv[3]).to.equal(2);
                              expect(uv['='](glm.vec4(9))[3]).to.equal(9);

                              expect(glm.ivec4(glm.vec3(1,2,3),4)).to.glm_eq([1,2,3,4]);
                              expect(glm.ivec4(glm.vec2(-1,-2),3,4)).to.glm_eq([-1,-2,3,4]);
                              expect(glm.ivec4(glm.vec4(-1))).to.glm_eq([-1,-1,-1,-1]);
                              expect(glm.ivec4(glm.vec4(1.5,2.5,3.5,4.5))).to.glm_eq([1,2,3,4]);
                              
                              expect(glm.ivec2()).to.glm_eq([0,0]);
                              expect(glm.$to_json(glm.ivec2({x:1,y:2}))).to.equal('{"x":1,"y":2}');
                              expect(glm.$to_json(glm.ivec3())).to.equal('{"x":0,"y":0,"z":0}');
                              expect(glm.$to_json(glm.ivec3(1))).to.equal('{"x":1,"y":1,"z":1}');
                              expect(glm.$to_json(glm.ivec3(1,2))).to.equal('{"x":1,"y":2,"z":2}');
                              expect(glm.$to_json(glm.ivec3([1,2]))).to.equal('{"x":1,"y":2,"z":2}');
                              expect(glm.$to_json(glm.ivec3([1,2,3,4]))).to.equal('{"x":1,"y":2,"z":3}');
                              expect(glm.$to_json(glm.ivec3(glm.$to_object(glm.vec3(9,8,7))))).to.equal('{"x":9,"y":8,"z":7}');
                              expect(glm.$to_json(glm.ivec3(glm.vec2(1),2))).to.equal('{"x":1,"y":1,"z":2}');
                              expect(glm.$to_json(glm.ivec3(glm.ivec2(1),2))).to.equal('{"x":1,"y":1,"z":2}');

                              expect(glm.ivec4(glm.ivec3(glm.ivec2(2),3),4)).to.glm_eq([2,2,3,4]);
                              expect(glm.ivec4(glm.ivec2(2),3,4)).to.glm_eq([2,2,3,4]);


                           });
                        it('exceptions', function() {
                              expect(function() { glm.ivec4({}); }).to['throw'](/unrecognized object passed to .*?ivec4/);
                              expect(function() { glm.ivec4({},1); }).to['throw'](/unrecognized object passed to .*?ivec4/);


                              expect(function() { glm.ivec3({}); }).to['throw'](/unrecognized object passed to .*?ivec3/);
                              expect(function() { glm.ivec2({}); }).to['throw'](/unrecognized object passed to .*?ivec2/);
                           });
                     });

            describe('exceptions', function() {
                        describe('.$toFixedString regression tests', function() {
                                    it('(s,s,s) exception', function() {
                                          expect(function() {
                                                    glm.$toFixedString("prefix","what","props");
                                                 }).to['throw'](/unsupported argtype/);
                                       });
                                    it('(s,s,[s]) exception', function() {
                                          expect(function() {
                                                    glm.$toFixedString("prefix","what",["substr"]);
                                                 }).to['throw'](/!toFixed/);
                                       });
                                    it('(s,s,[len],N) exception', function() {
                                          expect(glm.$toFixedString("prefix","what",["length"],0)).to.equal('prefix(4)');
                                          expect(glm.$toFixedString("prefix","what",["length"],1)).to.equal('prefix(4.0)');
                                          expect(glm.$toFixedString("prefix","what",["length"],3)).to.equal('prefix(4.000)');
                                          expect(glm.$toFixedString("prefix","what",["length"],4)).to.equal('prefix(4.0000)');
                                          expect(glm.$toFixedString("prefix",{e:glm.epsilon()},["e"],7)).to.equal('prefix(0.0000010)');
                                       });
                                 });

                        it('exceptions 0', function() {
                              expect(function(){
                                        new glm.vec3(new Float32Array(4))
                                     }).to['throw'](/vec3 elements size mismatch/);
                              expect(function(){
                                        glm.vec3(new Float32Array(4))
                                     }).to.not['throw']();
                              expect(function() {
                                        glm.$template['declare<T,V,...>'](
                                           {
                                              'mul': {
                                                 $op:'x'
                                              }
                                           });s
                                     }).to['throw'](/mismatch merging existing override/);
                              expect(function() {
                                        glm.$template['declare<T,...>'](
                                           {
                                              'mul': {
                                                 $op:'*'
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
                              
                              var qa = glm.quat();
                              expect(function(){qa._x}).to['throw'](/erroneous quat._x/);

                           });

                        [2,3,4].forEach(
                           function(_) {
                              ['','u','i','b'].forEach(
                                 function(__) {
                                    var typ = __+'vec'+_;
                                    it(typ, function() {
                                          expect(function() {
                                                    glm[typ]({x:1,y:2,z:3,w:4});
                                                    glm[typ](glm.vec4({x:1,y:2,z:3,w:4}));
                                                 }, typ).not.to['throw']();
                                          expect(function() {
                                                    glm[typ]('hi');
                                                 }, typ).to['throw']("no constructor found for: glm."+typ+"(string)");
                                          expect(function() {
                                                    glm[typ]({});
                                                 }, typ).to['throw'](/unrecognized object/);
                                          expect(function() {
                                                    glm[typ]({y: 5});
                                                 },typ).to['throw'](/unrecognized object/);
                                          expect(function() {
                                                    glm[typ]({x: 'x', y: 5, z:'z', w:5});
                                                 },typ).to['throw'](/unrecognized .x-ish object/);
                                          if (_ === 3)
                                             expect(function() {
                                                       glm[typ]({x: 'x', y: 5, z:'z', w:5},1);
                                                    },typ).to['throw'](/unrecognized object/);
                                          if (_ === 4)
                                             expect(function() {
                                                       glm[typ]({x: 'x', y: 5, z:'z', w:5},1,1);
                                                    },typ).to['throw'](/unrecognized object/);
                                       });
                                 });
                           });
                     });
            
            if(glm.$vfloat)
               describe("experimental", function() {
                           it('vector<float>', function() {
                                 var floats = glm.$vfloat(32);
                                 floats.arrayize(1);

                                 floats[16] = 1;
                                 new glm.vec4(
                                    floats.elements.subarray(32-4,32)
                                 ).xyzw = [2,3,4,5];
                                 
                                 expect(floats.join("")).to.equal("00000000000000001000000000002345");

                                 expect(JSON.stringify(floats)).to
                                   .eql("["+("00000000000000001000000000002345".split(""))+"]");

                                 expect(JSON.stringify(floats)).to.equal(glm.$to_json(floats));
                              });
                           it('setters - regression tests', function() {
                                 function testit(with_setters) {
                                    var tmp = glm.$vmat4();//new glm.$vectorType(glm.mat4);
                                    var v = glm.$vfloat(32);
                                    tmp.setFromPointer(v.elements.buffer);
                                    tmp.arrayize(with_setters);
                                    expect(tmp.arr.length).to.equal(2);
                                    var x = tmp.arr[0];
                                    glm.$log(with_setters, x[3]);
                                    tmp.arr[1] = tmp.arr[0];
                                    if (with_setters)
                                       expect(tmp.arr[1]).not.to.equal(tmp.arr[0]);
                                    else
                                    expect(tmp.arr[1]).to.equal(tmp.arr[0]);
                                    x[3] = [9,8,7,6];
                                    tmp.arr[1][0] = glm.vec4(2,3,4,5);
                                    glm.$log(with_setters, x);
                                    if (with_setters)
                                       expect(tmp.arr[0]).to.flatten.into("0000000000009876");
                                    else
                                    expect(tmp.arr[0]).to.flatten.into("2345000000009876");
                                 }
                                 testit(false);
                                 testit(true);
                              });
                           it('buffer tossing', function() {
                                 var x = glm.$vvec4(2);
                                 x[0].xyzw = [0,1,2,3];
                                 var y = x.clone();
                                 X=x;Y=y;
                                 expect(x[0]+'').to.equal(y[0]+'');
                                 x[0].xyzw = [9,8,7,6];
                                 expect(x[0]+'').to.not.equal(y[0]+'');
                                 glm.$log(x,y.elements);
                                 x._set(y);
                                 expect(x[0]+'').to.equal(y[0]+'');
                                 expect(x._set.bind(x,"string")).to.throw("unsupported argtype");

                                 expect(glm.$to_json(glm.$vvec4(y))).to.equal('[{"x":0,"y":1,"z":2,"w":3},{"x":0,"y":0,"z":0,"w":0}]');
                              });
                           it('buffer trimming', function() {                                 
                                 var x = glm.$vvec4(2);
                                 expect(x.length).to.equal(2);
                                 x[0].xyzw = [0,1,2,3];
                                 x[1].xyzw = [4,5,6,7];
                                 expect(x[1]).not.to.equal(undefined);
                                 x._set(glm.$vvec4([9,8,7,6])); // 1 x vec4
                                 expect(x.length).to.equal(1);
                                 expect(x[1]).to.equal(undefined);
                                 expect(x[0]).to.glm_eq([9,8,7,6]);
                              });
                           it('mat4[]', function() {
                                 var bones = glm.$vmat4(10);
                                 bones[0] = glm.translate(glm.vec3(0,1,0));
                                 expect(bones[0][3].xyz).to.glm_eq([0,1,0]);
                              });
                           it('vector<int32>', function() {
                                 expect(glm.$vint32([-10.1,1.1,2.2,Math.PI])).to.glm_eq([-10,1,2,3]);
                                 var x = new Uint8Array(16);
                                 x.set([0,1,0,0]);
                                 expect(glm.$vint32(x)).to.glm_eq([256,0,0,0]);
                                 x.set([0,0,0,0,1,0,0,0,-1,-1,-1,-1]);
                                 expect(glm.$vint32(x.buffer)).to.glm_eq([0,1,-1,0]);

                                 expect(JSON.stringify(glm.$vint32(2)._set([0,1]))).to.equal("[0,1]");
                              });
                           it('vector<uint16>', function() {
                                 expect(glm.$vuint16([-1,1.1,2.2,Math.PI])).to.glm_eq([0xffff,1,2,3]);
                                 expect(glm.$to_json(glm.$vuint16([-1,1.1,2.2,Math.PI]))).to.equal("[65535,1,2,3]");
                                 expect(glm.$to_array(glm.$vuint16([-1,1.1,2.2,Math.PI]))).to.eql([65535,1,2,3]);
                                 expect(glm.$to_string(glm.$vuint16([-1,1.1,2.2,Math.PI]))).to.equal('[GLM.$vuint16 elements[0]=65535]');
                                 expect(glm.$vuint16().BYTES_PER_ELEMENT).to.equal(2);
                                 var indices_A = glm.$vuint16([0,1,2,3]);
                                 var indices_B = glm.$vuint16([3,2,1,0]);
                                 expect(indices_A+'').to.equal('[vector<$vuint16> {0,1,2,3}]');
                                 indices_A['='](indices_B);
                                 expect(indices_A.elements).to.eql(indices_B.elements);
                                 expect(indices_A).to.eql(indices_B);
                                 expect(indices_A.elements.buffer).to.not.equal(indices_B.elements.buffer);

                                 expect(glm.$to_array(indices_A['+']([-1]))).to.eql([3,2,1,0,0xffff]);
                                 expect(glm.$to_array(indices_A)).to.eql([3,2,1,0]);

                                 indices_A['+=']([-1]);
                                 expect(glm.$to_array(indices_A)).to.eql([3,2,1,0,0xffff]);

                                 indices_A['+='](indices_A);
                                 expect(glm.$to_array(indices_A)).to.eql([3,2,1,0,0xffff,3,2,1,0,0xffff]);
                                 indices_B['+='](indices_A);
                                 expect(glm.$to_array(indices_B)).to.eql([3,2,1,0,3,2,1,0,0xffff,3,2,1,0,0xffff]);

                                 indices_A['='](glm.$vint32([9,8,7,6,5,4,3,2,1,0]));
                                 expect(glm.$to_array(indices_A)).to.eql([9,8,7,6,5,4,3,2,1,0]);
                                 expect(indices_A.elements).to.be.instanceOf(Uint16Array);

                                 indices_A['='](glm.$vfloat([9.8,7.6,5.4,3.2,1.0]));
                                 expect(glm.$to_array(indices_A)).to.eql([9,7,5,3,1]);
                                 expect(indices_A.elements).to.be.instanceOf(Uint16Array);
                              });
                           it('primitives', function() {
                                 expect(glm.$int32(5.5)).to.glm_eq([5]);
                                 expect(glm.$int32.BYTES_PER_ELEMENT).to.equal(4);
                                 expect(glm.$uint16(-1)).to.glm_eq([65535]);
                                 expect(glm.$uint16.BYTES_PER_ELEMENT).to.equal(2);
                                 expect(glm.$float(5.5)).to.glm_eq([5.5]);
                                 expect(glm.to_string(glm.$bool(true))).to.equal('bool(1)');
                                 expect(glm.to_string(glm.$int32(-5.5))).to.equal('int(-5)');
                                 expect(glm.to_string(glm.$float(5.5))).to.equal('float(5.5)');

                                 expect(glm.$float(5.5) * 10).to.equal(5.5*10);

                                 // this will coerce appropriately(?)
                                 expect(+glm.$uint16(2 * -2)).to.equal(65532);

                                 // but it's not actually a native uint
                                 expect(glm.$uint16(2) * -2).to.equal(-4);
                              });
                           it('.base64', function() {
                                 {
                                    var pipi = '2w9JQNsPSUA=';
                                    expect(glm.$to_base64(glm.vec2(Math.PI))).to.equal(pipi);
                                    expect(glm.vec2(Math.PI).base64).to.equal(pipi);
                                    var v = glm.vec2();
                                    v.base64 = pipi;
                                    expect(v.base64).to.equal(pipi);
                                    expect(v).to.glm_eq([Math.PI, Math.PI],glm.epsilon());
                                 }
                                 if (typeof atob === 'function') {
                                    var pipi =  "4pyTIMOgIGxhIG1vZGU=";
                                    expect(glm.$b64.b64_to_utf8(pipi)).to.equal('✓ à la mode');
                                    expect(glm.$b64.utf8_to_b64('✓ à la mode')).to.equal(pipi);
                                    expect(glm.$b64.b64_to_utf8('4pi74pyM\n4pi54pmh\n4pml4p2k\n4pqY4p2A\n4p2D4p2B\n')).to.equal('☻✌☹♡♥❤⚘❀❃❁');
                                 }
                                 
                                 {
                                    var vvec = glm.$vvec4([0,1,2,3,0,0,0,0,1,1,1,1,2,2,2,2]);
                                    expect(vvec.base64).to.equal(
                                       'AAAAAAAAgD8AAABAAABAQAAAAAAAAAAAAAAAAAAAAAAAAIA'+
                                          '/AACAPwAAgD8AAIA/AAAAQAAAAEAAAABAAAAAQA==');
                                    var vmat = glm.$vmat4(2);
                                    vmat.base64 = vvec.base64;
                                    expect(vmat[0].base64).to.equal(vvec.base64);
                                    expect(glm.$to_array(vmat[0])).to.eql(glm.$to_array(vvec));
                                    vmat[1][0].base64 = vvec[0].base64;
                                    vmat[1][1].xyz.base64 = glm.vec3([-1,-2,-3]).base64;
                                    expect(vmat[1]).to.glm_eq([0,1,2,3,-1,-2,-3,0,0,0,0,0,0,0,0,0]);
                                 }

                              });
                           it('.json', function() {
                                 var v = glm.vec2(1,2);
                                 expect(v.json).to.equal('{"x":1,"y":2}');
                                 v.json = glm.vec2(3,4).json;
                                 expect(v).to.glm_eq([3,4]);

                                 expect(glm.vec4().json).to.equal('{"x":0,"y":0,"z":0,"w":0}')
                                 expect(glm.mat3().json).to.equal('{"0":{"x":1,"y":0,"z":0},"1":{"x":0,"y":1,"z":0},"2":{"x":0,"y":0,"z":1}}');
                                 expect(glm.mat4().json).to.equal('{"0":{"x":1,"y":0,"z":0,"w":0},"1":{"x":0,"y":1,"z":0,"w":0},"2":{"x":0,"y":0,"z":1,"w":0},"3":{"x":0,"y":0,"z":0,"w":1}}');

                                 var m = glm.mat4(2);
                                 var m2 = glm.mat4(0);
                                 m2.json = m.json;
                                 expect(m2).to.glm_eq(glm.$to_array(m));
                              });
                           it('.glsl', function() {
                                 var v = glm.vec2(1,2);
                                 expect(v.glsl).to.equal('vec2(1,2)');
                                 v.glsl = glm.vec2(3,4).glsl;
                                 expect(v).to.glm_eq([3,4]);
                              });
                        });

            if(glm.$THREE) 
               describe('glm.$THREE', function() {
                           it('.to_glm', function() {
                                 var Q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.Math.degToRad(45));
                                 expect(glm.$THREE.to_glm(Q)).to.euler.glm_eq([0,45,0]);
                                 
                                 var E = new THREE.Euler().setFromQuaternion(Q);
                                 expect(glm.$THREE.to_glm(E)).to.degrees.glm_eq([0,45,0], .00001);
                                 
                                 var M = new THREE.Matrix4().setRotationFromQuaternion(Q);
                                 var m = glm.toMat4(glm.angleAxis(glm.radians(45), glm.vec3(0,1,0)));
                                 expect(glm.$THREE.to_glm(M)).to.glm_eq(glm.$to_array(m));

                                 var V = new THREE.Vector3(9,8,7);
                                 expect(glm.$THREE.to_glm(V)).to.be.glsl("vec3(9,8,7)");
                              });
                           it('.from_glm', function() {
                                 var q = glm.angleAxis(glm.radians(45), glm.vec3(0,1,0));
                                 expect(glm.$THREE.from_glm(q).toArray()).to.eql(glm.$to_array(q));
                                 
                                 var e = glm.eulerAngles(q);
                                 expect(glm.$THREE.from_glm(e).toArray()).to.eql(glm.$to_array(e));
                                 
                                 var v = glm.vec3(9,8,7);
                                 expect(glm.$THREE.from_glm(v).toArray()).to.eql(glm.$to_array(v));

                                 var m = glm.toMat4(q);
                                 [].map.call(m.elements, function(v,_) {
                                                m.elements[_] = _;
                                             });
                                 glm.$log('THREE:', glm.$THREE.from_glm(m).toArray());
                                 glm.$log('THREE.elements:', [].slice.call(glm.$THREE.from_glm(m).elements));
                                 glm.$log('glm:', glm.$to_array(m));
                                 glm.$log('glm.elements:', [].slice.call(m.elements));
                                 expect(glm.$THREE.from_glm(m).toArray()).to.be.approximately(glm.$to_array(m),glm.epsilon());

                              });
                        it('quat cross-check', function() {
                              var mots=glm.radians(glm.vec3(15,15,15));
                              if (typeof THREE === 'object') {
                                 var te = new THREE.Euler(mots[0],mots[1],mots[2]);
                                 var tq = new THREE.Quaternion().setFromEuler(te);
                                 //expect(glm.to_string(q,3),'asdf').to.equal(glm.to_string(glm.quat(tq),3));
                                 expect(glm.to_string(glm.quat(tq),{precision:3}),'THREE')
                                    .to.equal(glm.to_string(glm.quat(glm.$outer.quat_array_from_xyz(mots)),{precision:3}));
                              }
                           });

                        });
            
            describe(glm.$prefix + ' info', function(){
                        it('...OK', function(){
                              if (typeof window === 'object') {
                                 Object.keys(glm.vendor).forEach(function(k) { glm.$log(k+": "+glm.vendor[k]); });
                              } else
                                 glm.$log(JSON.stringify(glm.vendor.vendor_version,0,2));
                           });
                     });
         });

cane.testMonkeyPatches(mocha_utils);
