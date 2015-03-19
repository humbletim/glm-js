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
                        describe('.$outer', function() {
                                    it('.console', function() {
                                          // shameless invocations for code coverage testing
                                          "log,debug,info,warn,error,write"
                                          .split(',').forEach(function(p) { glm.$outer.console[p](p); });
                                       });
                                    
                                    it('._vec3_eulerAngles', function() {
                                          var q = glm.quat(glm.radians(glm.vec3(15,-16,170)));
                                          expect(glm.to_string(glm.degrees(glm.$outer._vec3_eulerAngles(q)),1))
                                             .to.equal('fvec3(15.0, -16.0, 170.0)');
                                          
                                          // this triggers the atan2 edge case
                                          var B=glm.quat(glm.radians(glm.vec3(45,90,-45)));
                                                B.y += glm.epsilon();
                                          B = glm.normalize(B);
                                          expect(glm.to_string(glm.degrees(glm.$outer._vec3_eulerAngles(B)),1))
                                             .to.equal('fvec3(0.0, 90.0, -90.0)');
                                       });
                                    it('.mat4_angleAxis', function() {
                                          expect(glm.$outer.mat4_angleAxis(glm.radians(45), glm.vec3(0,1,0)),
                                                 '$outer.mat4_angleAxis').to.be.instanceOf(glm.mat4);
                                          
                                       });
                                    it('.quat_array_from_xyz', function() {
                                          var mots=glm.radians(glm.vec3(15,15,15));
                                          expect(glm.to_string(
                                                    glm.quat(glm.$outer.quat_array_from_xyz(mots)),3)
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
                        it(".$getGLMType", function() {
                              var constructors = "vec2,vec3,vec4,uvec4,quat,mat3,mat4".split(',')
                                 .map(function(p){return glm[p]});
                              expect(constructors.map(function(p) { return glm.$getGLMType(p()); }))
                                 .to.eql(constructors);
                              expect(glm.$getGLMType({})).to.equal(false);
                           });
                        describe("Objectification", function() {
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
                                    it('.$inspect', function() {
                                          expect(glm.$inspect.call(glm.vec2(1,2))).to.equal('{\n  "x": 1,\n  "y": 2\n}');
                                          expect(glm.$inspect(glm.vec2())).to.equal('{\n  "x": 0,\n  "y": 0\n}');
                                          expect(glm.$inspect(glm.mat4())).to.equal('{\n  "0": {\n    "x": 1,\n    "y": 0,\n    "z": 0,\n    "w": 0\n  },\n  "1": {\n    "x": 0,\n    "y": 1,\n    "z": 0,\n    "w": 0\n  },\n  "2": {\n    "x": 0,\n    "y": 0,\n    "z": 1,\n    "w": 0\n  },\n  "3": {\n    "x": 0,\n    "y": 0,\n    "z": 0,\n    "w": 1\n  }\n}');
                                          expect(glm.vec3(1,2,3).inspect()).to.equal('{\n  "x": 1,\n  "y": 2,\n  "z": 3\n}');
                                       });

                                 });

                        describe("glsl", function() {
                                    it('$to_glsl', function() {
                                          expect(glm.$to_glsl(glm.vec3(1))).to.equal('vec3(1)');
                                          expect(glm.$to_glsl(glm.vec3(1,2,3))).to.equal('vec3(1,2,3)');
                                          expect(glm.$to_glsl(glm.uvec3(1,2,3))).to.equal('uvec3(1,2,3)');
                                          expect(glm.$to_glsl(glm.mat4(0))).to.equal('mat4(0)');
                                          expect(glm.$to_glsl(glm.mat3(1))).to.equal('mat3(1)');
                                          expect(glm.$to_glsl(glm.mat3(2))).to.equal('mat3(2)');
                                          expect(glm.$to_glsl(glm.mat3(-2))).to.equal('mat3(-2)');
                                          expect(glm.$to_glsl(glm.uvec4(0))).to.equal('uvec4(0)');
                                          expect(glm.$to_glsl(glm.quat(1))).to.equal('quat(1)');
                                          expect(glm.$to_glsl(glm.normalize(glm.angleAxis(glm.radians(30), glm.normalize(glm.vec3(1))))))
                                             .to.equal('quat(0.14942924678325653,0.14942924678325653,0.14942924678325653,0.9659258127212524)');

                                       });
                                    
                                    it('$from_glsl', function() {
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
                                 glm.to_string(glm.vec3(),0)
                              ).to.equal('fvec3(0, 0, 0)');
                              GLM.FAITHFUL = old;

                              expect(glm.to_string(5)).to.equal("float(5.000000)");
                              expect(glm.to_string(5,1)).to.equal("float(5.0)");
                              
                              var q = glm.quat(glm.radians(glm.vec3(15,-16,170)));
                              expect(glm.to_string(glm.degrees(glm.eulerAngles(q)),1))
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
                                    it('<mat4,angle,vec3>', function() {
                                          expect( 
                                             glm.rotate(glm.mat4(), glm.radians(45), UP)
                                          ).to.eql(ref)
                                       });
                                    it('<angle,vec3>', function() {
                                          expect( 
                                             glm.rotate(glm.radians(45), UP)
                                          ).to.eql(ref)
                                       });
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
                           });
                        it('.max', function() {
                              expect(glm.max(0,.5)).to.equal(.5);
                           });
                        it('._sign', function() {
                              // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
                              expect([ 3, -3, '-3', 0, -0, NaN, 'foo', undefined ]
                                     .map(glm._sign)).to.eql(
                                        [ 1, -1, -1, 0, -0, NaN, NaN, NaN ]);
                           });
                        if ("sign" in Math) {
                           it('Math.sign sanity check', function() {
                                 expect([ 3, -3, '-3', 0, -0, NaN, 'foo', undefined ]
                                        .map(Math.sign)).to.eql(
                                           [ 1, -1, -1, 0, -0, NaN, NaN, NaN ]);
                              });
                        }
                        it('.sign', function() {
                              var e = glm.epsilon();
                              expect([ e, -e, 3, -3, '-3', 0, -0, NaN, 'foo', undefined ]
                                     .map(glm.sign)).to.eql(
                                        [ 1, -1, 1, -1, -1, 0, -0, NaN, NaN, NaN ]);
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
                        it('$template', function() {
                              expect(glm.$template).to.be.an('object');
                              expect(glm.mul.link('mat4,mat4')(glm.mat4(2),glm.mat4(3))).to.eql(glm.mat4(2)['*'](glm.mat4(3)));
                              expect(function() {
                                        glm.mul.link('asdf')(glm.mat4(2),glm.mat4(3));
                                     }).to.throw("error linking");
                              expect(glm.translate.link('vec3')(glm.vec3(3))).to.eql(glm.translate(glm.vec3(3)));
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

                              expect(glm.$to_array(glm.vec4(2.5,-.5,Math.PI,0).add(glm.vec4(-2.5,.5,-Math.PI,-0)))).to.eql([0,0,0,0]);
                              expect(glm.vec3(1)['=='](glm.vec3(2))).to.be.equal(false);
                              expect(glm.vec4(1).eql(glm.vec4(1))).to.be.equal(true);
                              expect(glm.uvec4(0)['=='](glm.uvec4(-1))).to.be.equal(true);
                              expect(glm.mat4(1)['=='](glm.mat4(0))).to.be.equal(false);
                              expect(glm.quat(1)['=='](glm.quat(1))).to.be.equal(true);
                           });
                        it("= [array assignment]", function() {
                              var v3 = glm.vec3();
                              v3.xyz = [1,2,3];
                              expect(v3).to.glm_eq([1,2,3]);
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
               });
             });
             it('exceptions', function() {
                   expect(function() { glm.mat4({}); }).to['throw'](/unrecognized object passed to .*?\bmat4/);
                   expect(function() { glm.mat4(null); }).to['throw'](/unrecognized object passed to .*?\bmat4/);
                   expect(function() { glm.mat4(glm.vec4()); }).to['throw'](/unrecognized object passed to .*?\bmat4/);
                   expect(function() { glm.mat4([1,2,3,4]); }).to['throw'](/unrecognized object passed to .*?\bmat4/);
                   expect(function() { glm.mat4(undefined); }).to['throw'](/no template found for mat4[.][$][.]undefined1/);
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
                              expect(glm.axis(glm.angleAxis(glm.radians(45),0,1,0)))
                                 .to.approximate.glm_eq([0,1,0],glm.epsilon());
                              expect(glm.axis(glm.quat()))
                                 .to.glm_eq([0,0,1]);
                              expect((glm.angle(glm.angleAxis(glm.radians(45),0,1,0))))
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
                        it('lengthify', function(){ 
                              glm.length(glm.vec3(Math.PI)).should.be.approximately(5.44,.1);
                           });
                        it('normalize', function(){ 
                              glm.length(glm.normalize(glm.vec3(2,2,2))).should.be.approximately(1,glm.epsilon());
                              glm.$to_array(glm.normalize(glm.vec3(0,2,0))).should.eql([0,1,0]);
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
                              expect( function() { new glm.make_vec4(); } ).to.throw(/byteOffset/);
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
                         var a = new Float32Array(4*10);
                         var b = new Float32Array(4*10);
                         var dynamic = new glm.$vvec4(a, true);
                         var s = new glm.$vvec4(a);

                         dynamic[0].xyzw = s[0].xyzw = [1,2,3,4];

                         expect(dynamic[0]+'').to.equal(s[0]+'');
                         expect(dynamic[0]).to.glm_eq([].slice.call(s.elements,0,4));
                         expect(dynamic[0]).to.glm_eq([].slice.call(a,0,4));
                         expect(dynamic[0]).to.not.glm_eq([].slice.call(b,0,4));

                         dynamic.elements = b; // will affect dynamic[0] (existing and future)
                         s.elements = b; // is not dynamic, so this will NOT affect s[0]

                         expect(dynamic[0]+'').to.not.equal(s[0]+'');

                         expect(dynamic[0]).to.glm_eq([0,0,0,0]);
                         expect(s[0]).to.glm_eq([1,2,3,4]);
                         
                         dynamic[0] = glm.vec4(9,8,7,6);
                         expect(dynamic[0]).to.glm_eq([9,8,7,6]);
                         expect(s[0]).to.glm_eq([1,2,3,4]);

                         s['='](b); // this will re-arrayize (so will affect s[0] as a side-effect)
                         expect(s[0]).to.glm_eq([9,8,7,6]);
                          
                         dynamic[0]['*='](10);

                         expect(dynamic[0]).to.glm_eq([90,80,70,60]);
                         expect(s[0]).to.glm_eq([9,8,7,6]); // but still won't be affected by changes to b
                         
                         dynamic.elements = new Float32Array(dynamic.elements.length); // swap-out underlying buffer
                         s.elements = new Float32Array(s.elements.length);
                         
                         expect(dynamic[0]).to.glm_eq([0,0,0,0]); // dynamic is now all zeros (from the fresh buffer)
                         expect(s[0]).to.glm_eq([9,8,7,6]); // but s still references the cached buffer...

                         // note: there is an added overhead to support/detect dynamic mapping...
                         // (so only use when actually needed)
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
                              expect(glm.to_string(glm.uvec4(-1,-2,1,2))).to.equal("uvec4(0, 0, 1, 2)");

                              expect(glm.uvec4(2,3,4,5).x).to.equal(2);
                              expect(glm.uvec4(2,3,4,5)[3]).to.equal(5);

                              expect(glm.uvec4(glm.vec3(1,2,3),4)).to.glm_eq([1,2,3,4]);
                              expect(glm.uvec4(glm.vec2(-1,-2),3,4)).to.glm_eq([0,0,3,4]);
                              expect(glm.uvec4(glm.vec4(-1))).to.glm_eq([0,0,0,0]);
                              expect(glm.uvec4(glm.vec4(1.5,2.5,3.5,4.5))).to.glm_eq([1,2,3,4]);
                              
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
                              
                              var qa = glm.quat();
                              expect(function(){qa._x}).to['throw'](/erroneous quat._x/);

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
                              });
                           it('setters - regressiont tests', function() {
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
                              });
                           it('vector<uint16>', function() {
                                 expect(glm.$vuint16([-1,1.1,2.2,Math.PI])).to.glm_eq([0xffff,1,2,3]);
                                 expect(glm.$to_json(glm.$vuint16([-1,1.1,2.2,Math.PI]))).to.equal("[65535,1,2,3]");
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
                                 expect(glm.to_string(glm.quat(tq),3),'THREE')
                                    .to.equal(glm.to_string(glm.quat(glm.$outer.quat_array_from_xyz(mots)),3));
                              }
                           });

                        });
            
            describe(GLMJS_PREFIX+' info', function(){
                        it('...OK', function(){
                              if (typeof window === 'object') {
                                 Object.keys(glm.vendor).forEach(function(k) { glm.$log(k+": "+glm.vendor[k]); });
                              } else
                                 glm.$log(JSON.stringify(glm.vendor.vendor_version,0,2));
                           });
                     });
         });

cane.testMonkeyPatches(mocha_utils);
