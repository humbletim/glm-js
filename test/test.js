var should = require('should');
var expect = require('expect');

glm = require("../src/glm-js");

describe('glm', function(){

            describe('common', function(){
                        it('should have a version', function(){
                              glm.version.should.have.type('string');
                              glm.version.should.match(/\d\.\d\.\d/);
                           });
                     });
            
            var qq;
            describe('common', function() {
                        it('.epsilon', function() {
                              glm.epsilon().should.be.lessThan(1e-5);
                           });
                        it('.radians', function() {
                              glm.radians(45).should.be.approximately(0.7853981633974483,glm.epsilon());
                           });
                        it('.angleAxis', function() {
                              qq = glm.angleAxis(glm.radians(45.0),glm.vec3(0,1,0));
                              glm.$to_array(qq).should.eql([ 0, 0.3826834261417389, 0, 0.9238795042037964 ]);
                              glm.degrees(glm.eulerAngles(qq)[1]).should.be.approximately(45.0, glm.degrees(glm.epsilon()));
                           });
                     });

            describe('meta', function() {
                        it('$DLL.mat4_angleAxis', function() {
                              glm.$DLL.mat4_angleAxis(glm.radians(45), glm.vec3(0,1,0)).should.be.instanceOf(glm.mat4);
                           });
                        it('$to_array', function() {
                              glm.$to_array({elements:[]}).length.should.equal(0);
                              glm.$to_array({elements:[1]}).length.should.equal(1);
                              glm.$to_array({elements:[1,2,3,4,5]}).length.should.equal(5);
                           });
                        it('$template', function() {
                              glm.$template.should.have.type('object');
                           });
                     });
            
            describe('mat3', function() {
                        it('should work', function() {
                              glm.$to_array(glm.mat3()).join("").should.equal('100010001');
                           });
                     });


            //var qspin = glm.angleAxis(Math.PI,glm.vec3(0,1,0));
            var qspin = new glm.quat([ 0, 1, 0, 6.123031769111886e-17 ]);
            describe('mat4', function() {
                        it('should work', function() {
                              glm.$to_array(glm.mat4()).join("").should.equal('1000010000100001');
                              glm.$to_array(glm.mat4(glm.mat3(3))).join("").should.equal('3000030000300001');
                              glm.toMat4(qspin).toString().should.equal('mat4x4(\n\t(-1.000000, 0.000000, -0.000000, 0.000000), \n\t(0.000000, 1.000000, 0.000000, 0.000000), \n\t(0.000000, 0.000000, -1.000000, 0.000000), \n\t(0.000000, 0.000000, 0.000000, 1.000000)\n)');

                              glm.to_string(glm.toMat4(qq)).should.equal('mat4x4((0.707107, 0.000000, -0.707107, 0.000000), (0.000000, 1.000000, 0.000000, 0.000000), (0.707107, 0.000000, 0.707107, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');

                              glm.mat4().mul(glm.mat4()).should.be.instanceOf(glm.mat4);
                           });
                        it('should invert tranpose', function() {
                              glm.to_string(glm.transpose(glm.inverse(glm.mat4(qq)))).should.equal('mat4x4((0.707107, 0.000000, -0.707107, 0.000000), (0.000000, 1.000000, 0.000000, 0.000000), (0.707107, 0.000000, 0.707107, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');
                           });
                       
                     });


            describe('quat', function() {
                        it('should work', function() {
                              glm.$to_array(glm.quat()).should.eql([0,0,0,1]);
                              glm.to_string(glm.quat()).should.equal('<quat>fvec3(0.000000, 0.000000, 0.000000)');
                           });
                        it('should work, yo', function(){
                              var aa = glm.angleAxis(glm.radians(45.0),glm.vec3(0,1,0));;
                              glm.length(aa).should.be.approximately(1,.1);
                              glm.to_string(glm.toMat4(aa)).should.equal('mat4x4((0.707107, 0.000000, -0.707107, 0.000000), (0.000000, 1.000000, 0.000000, 0.000000), (0.707107, 0.000000, 0.707107, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))')
                              var q = glm.quat(glm.toMat4(aa));
                              glm.to_string(glm.eulerAngles(q)).should.equal('fvec3(0.000000, 0.785398, 0.000000)');
                           });
                        it('should work, seriously', function(){
                              glm.to_string(glm.toMat4(glm.normalize(glm.quat(1,0,1,0)))).should.equal('mat4x4((0.000000, 0.000000, -1.000000, 0.000000), (0.000000, 1.000000, 0.000000, 0.000000), (1.000000, 0.000000, 0.000000, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');

                           });
                        it('should work as a mat4 too', function() { 
                              glm.to_string(glm.toMat4(qq)[0]).should.equal('fvec4(0.707107, 0.000000, -0.707107, 0.000000)');
                              glm.to_string(glm.toMat4(qq)[2]).should.equal('fvec4(0.707107, 0.000000, 0.707107, 0.000000)');
                              glm.to_string(glm.toMat4(qq).mul(glm.vec4(1,2,3,1)))
                                 .should.equal('fvec4(2.828427, 2.000000, 1.414214, 1.000000)');
                           });
                     });

            describe('vec2', function(){
                        it('should work', function(){
                              glm.vec2().should.be.instanceOf(glm.vec2);
                              glm.vec2(1,2).toString().should.equal('fvec2(1.000000, 2.000000)');
                              glm.vec2(1).toString().should.equal('fvec2(1.000000, 1.000000)');
                              glm.vec2().toString().should.equal('fvec2(0.000000, 0.000000)');
                           });
                        it('should multiply by a scalar', function(){
                              glm.vec2(1).mul(2).should.be.instanceOf(glm.vec2);
                              glm.$to_array(glm.vec2(1,2).mul(2)).should.eql([2,4]);
                              glm.$to_array(glm.vec2(2,3)['*'](3)).should.eql([6,9]);
                           });
                        it('should inplace multiply by a scalar', function(){ 
                              var v2 = glm.vec2(Math.PI);
                              glm.$to_array(v2['*='](1/Math.PI)).should.eql([1,1]);
                           });
                        it('should lengthify', function(){ 
                              glm.length(glm.vec2(Math.PI)).should.be.approximately(4.44,.1);
                           });
                     });

            describe('vec3', function(){
                        it('should work', function(){
                              glm.vec3().should.be.instanceOf(glm.vec3);
                              glm.vec3(1,2).toString().should.equal('fvec3(1.000000, 2.000000, 2.000000)');
                              glm.vec3(1).toString().should.equal('fvec3(1.000000, 1.000000, 1.000000)');
                              glm.vec3().toString().should.equal('fvec3(0.000000, 0.000000, 0.000000)');
                           });
                        it('should multiply by a scalar', function(){
                              glm.vec3(1).mul(2).should.be.instanceOf(glm.vec3);
                              glm.$to_array(glm.vec3(1,2).mul(2)).should.eql([2,4,4]);
                              glm.$to_array(glm.vec3(2,3,4)['*'](3)).should.eql([6,9,12]);
                              glm.$to_array(glm.vec3(10,4,2)['*'](1/2)).should.eql([5,2,1]);
                              glm.$to_array(glm.vec3(1,2,3)['*'](2)['*'](.5)).should.eql([1,2,3]);
                           });
                        it('should inplace multiply by a scalar', function(){ 
                              var v3 = glm.vec3(Math.PI);
                              glm.$to_array(v3['*='](1/Math.PI)).should.eql([1,1,1]);
                           });
                        it('should lengthify', function(){ 
                              glm.length(glm.vec3(Math.PI)).should.be.approximately(5.44,.1);
                           });
                        it('should normalize', function(){ 
                              glm.length(glm.normalize(glm.vec3(2,2,2))).should.be.approximately(1,glm.epsilon());
                              glm.$to_array(glm.normalize(glm.vec3(0,2,0))).should.eql([0,1,0]);
                           });
                        it('should spin about a quat', function() {
                              glm.$to_array(glm.vec3(100).mul(qspin)).should.eql([-100,100,-100]);
                           });
                     });

            describe('vec4', function(){
                        it('should work', function(){
                              glm.vec4().should.be.instanceOf(glm.vec4);
                              glm.vec4(1,2).toString().should.equal('fvec4(1.000000, 2.000000, 2.000000, 2.000000)');
                              glm.vec4(1).toString().should.equal('fvec4(1.000000, 1.000000, 1.000000, 1.000000)');
                              glm.vec4().toString().should.equal('fvec4(0.000000, 0.000000, 0.000000, 0.000000)');
                           });
                        it('should multiply by a scalar', function(){
                              glm.vec4(1).mul(2).should.be.instanceOf(glm.vec4);
                              glm.$to_array(glm.vec4(1,2).mul(2)).should.eql([2,4,4,4]);
                              glm.$to_array(glm.vec4(2,3,4)['*'](3)).should.eql([6,9,12,12]);
                              glm.$to_array(glm.vec4(10,4,2)['*'](1/2)).should.eql([5,2,1,1]);
                              glm.$to_array(glm.vec4(1,2,3)['*'](2)['*'](.5)).should.eql([1,2,3,3]);
                           });
                        it('should inplace multiply by a scalar', function(){ 
                              var v4 = glm.vec4(Math.PI);
                              glm.$to_array(v4['*='](1/Math.PI)).should.eql([1,1,1,1]);
                           });
                        it('should lengthify', function(){ 
                              glm.length(glm.vec4(Math.PI)).should.be.approximately(6.28,.1);
                           });
                        it('should normalize', function(){ 
                              glm.length(glm.normalize(glm.vec4(2,2,2,2))).should.be.approximately(1,glm.epsilon());
                              glm.normalize(glm.vec4(2)).should.be.instanceOf(glm.vec4);
                              glm.$to_array(glm.normalize(glm.vec4(0,0,0,2))).should.eql([0,0,0,1]);
                           });
                        //var qspin = glm.angleAxis(Math.PI,glm.vec3(0,1,0));
                        var qspin = new glm.quat([ 0, 1, 0, 6.123031769111886e-17 ]);
                        it('should spin about a quat', function() {
                              glm.$to_array(glm.vec4(100,100,100,1).mul(qspin)).should.eql([-100,100,-100,1]);
                           });
                        var M = glm.toMat4(qspin);
                        it('should matrixify', function() {
                              glm.$to_array(M['*'](glm.vec4(1,2,3,1))).should.eql([-1,2,-3,1]);
                              glm.$to_array(M['*'](glm.vec4(-1,-1,2,2))).should.eql([1,-1,-2,2]);
                           });
                     });
            
            describe('buffer', function(){
                        it('should work', function(){
                              var b = new ArrayBuffer(glm.mat4.BYTES_PER_ELEMENT * 4);
                              var f = new Float32Array(b);
                              var m4a = new glm.vec4(f.subarray(glm.vec4.componentLength,
                                                                glm.vec4.componentLength*2));
                              var xxxx = [1,2,3,4];
                              m4a.elements.set(xxxx);
                              glm.$to_array(m4a).should.eql(xxxx);              //0000111122223333
                              glm.$to_array(new glm.mat4(f)).join("").should.eql("0000123400000000");
                              new glm.mat4(f.subarray(16)).elements.set("0000111122223333".split(""));
                              [].join.call(f.subarray(16),"").should.equal('000011112222333300000000000000000000000000000000');
                              var m = new glm.mat4(f.subarray(16));
                              var rr = glm.rotate(glm.mat4(), glm.radians(90), glm.vec3(0,0,1));
                              rr.should.be.instanceOf(glm.mat4);
                              m['='](rr);//toMat4(new glm.quat([ 0, 1, 0, 6.123031769111886e-17 ])));
                              glm.to_string(m).should.be.equal( 'mat4x4((0.000000, 1.000000, 0.000000, 0.000000), (-1.000000, 0.000000, 0.000000, 0.000000), (0.000000, 0.000000, 1.000000, 0.000000), (0.000000, 0.000000, 0.000000, 1.000000))');
                              var qq = new glm.quat([ -0.25, 0.5, -0.25, 1 ]);
                              //[].slice.call(m.elements).join("").should.equal('9000090000900009');
                              glm.length(glm.quat(m)).should.be.approximately(1, glm.epsilon());//toString().should.equal('<quat>fvec3(0.000000, 0.000000, 89.999992)');
                              glm.degrees(glm.eulerAngles(glm.normalize(glm.quat(m)))[2]).should.be.approximately(90,glm.degrees(glm.epsilon()));

                              glm.length(glm.degrees(glm.eulerAngles(glm.quat(new glm.mat4(f.subarray(16)))))).should.be.approximately(90, glm.degrees(glm.epsilon()));
                              glm.$to_array({elements:f}).map(function(x) {return Math.abs(x.toFixed(5)); }).join("").should.eql("0000123400000000010010000010000100000000000000000000000000000000");
                              
                           });
                     });


            describe(GLMJS_PREFIX+' info', function(){
                        it('...OK', function(){});
                     });


         });
