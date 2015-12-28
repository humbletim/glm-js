try{ require.exists;}catch(e){require=function(x){load("./src/"+x+'.js');};}
try{
   glm.exists;
} catch(e) {
   try { glm = require("../src/glm-js") || glm; }
   catch(e) { require("../src/glm-js"); }
}
(function(){
 function main(log) {
    var t = new glm.vec4(1,2,3,4);
    log(t);
    log("t * 2.0", (t) ['*'] (2.0));
    log("t *= 2.0", (t) ['*='] (2.0));
    log("t.xy", t.xy);
    
    {
        var r = glm.rotate(glm.radians(30.0), glm.vec3(0.0,1,0));
        log("r:",glm.quat(r));
        r = glm.rotate(glm.mat4(), glm.radians(30.0), glm.vec3(0.0,1.0,0.0) );
        log("r:",glm.quat(r));
    }

    {
        var s = glm.scale(glm.vec3(3.0,1,0));
//         log("s:",s);
//         s = glm.scale(3.0,1,0);
        log("s:",s);
        s = glm.scale(glm.mat4(), glm.vec3(3.0,1.0,.1) );
        log("s:",s);
    }

    var q = glm.quat(glm.rotate(glm.mat4(), glm.radians(30.0), glm.vec3(0,1,0)));
    log("q:",glm.vec4(q.w,q.x,q.y,q.z));
    log("30 degrees:", glm.degrees(glm.eulerAngles(q)));

    var v3 = glm.vec3(3,3,3);
    log("v3:", v3);
    log("glm.quat(v3):", glm.quat(v3));
    log("q * v3: ", q['*'](v3));

    q = glm.quat();
    log("q:",glm.vec4(q.w,q.x,q.y,q.z));
    v3 = glm.vec3(1.0,2,3);
    log("v3:", v3);
    log("q * v3: ", q ['*'] (v3));

    q = glm.angleAxis(glm.radians(45.0), glm.vec3(0.0,1,0));
    log("angle(q)", glm.degrees(glm.angle(q)));
    log("axis(q)", glm.axis(q));

    log("diagonal4x4(vec4(1,2,3,4)): ", glm.diagonal4x4(glm.vec4(1,2,3,4)));
    log("mat3(2): ", glm.mat3(2));
    log("mat4(2): ", glm.mat4(2));
    var m4a = glm.mat4(  glm.vec4(1),
                         glm.vec4(2),
                         glm.vec4(3),
                         glm.vec4(4));
    log("mat4(vec4 x 4): ", m4a);
    var m4 =  glm.mat4(  1,1,1,1,
                         2,2,2,2,
                         3,3,3,3,
                         4,4,4,4);
    log("mat4(1..,2..,3..,4..): ", m4);
    log("m4 == m4a", ( m4 )['==']( m4a ) ? "true" : "false");

    var m4b = glm.mat4(glm.mat3(2));
    log("mat4(mat3(2)): ", m4b);
    log("m4 == m4b", ( m4 )['==']( m4b ) ? "true" : "false");

    var m4c = glm.mat4([
            [ 1, 2, 3, 4 ],
            [ 4, 3, 2, 1 ],
            [ 1, 2, 3, 4 ],
            [ 4, 3, 2, 1 ]
        ]);
    log("mat4({{...} x 4}}: ", m4c);

    var m4d = glm.mat4([
             1, 2, 3, 4,
             4, 3, 2, 1 ,
             1, 2, 3, 4 ,
             4, 3, 2, 1 
        ]);
    log("mat4({ float x 16}}: ", m4d);

    log("vec2(200,300)", glm.vec2(200,300));
    log("uvec2(2.99,3.99)", glm.uvec2(2.99,3.99));
    log("uvec2(-2.1,0.01)", glm.uvec2(-2.1,0.01));
    log("uvec2(-2.5,0).x", glm.uvec2(-2.5,0).x);
    log("ivec2(2.99,3.99)", glm.ivec2(2.99,3.99));
    log("ivec2(-2.1,0.01)", glm.ivec2(-2.1,0.01));
    log("ivec2(-2.5,0).x", glm.ivec2(-2.5,0).x);
    log("vec3(200,300,400)", glm.vec3(200,300,400));
    log("vec3(vec4(5))", glm.vec3(glm.vec4(5)));
    log("vec3(bvec4(true))", glm.vec3(glm.bvec4(true)));
    log("bvec3(vec4(1,1,0,1))", glm.bvec3(glm.vec4(1,1,0,1)));
    log("ivec3(uvec4(-5.5,4.6,-3.7,2))", glm.ivec3(glm.uvec4(-5.5,4.6,-3.7,2)));
    log("uvec4(ivec3(-5.5,4.6,-3.7),.5)", glm.uvec4(glm.ivec3(-5.5,4.6,-3.7),.5));
    {
       var v3 = glm.ivec3();
       v3['='](glm.uvec3(-5.5,4.6,-3.7));
       log("ivec3 = uvec3", v3);
       v3['='](glm.bvec3(1,0,1));
       log("ivec3 = bvec3", v3);
    }
    {
       var v2 = glm.uvec2();
       v2['='](glm.ivec2(-5.5,4.6));
       log("uvec2 = ivec2", v2);
       v2['='](glm.bvec2(true,false));
       log("uvec2 = bvec2", v2);
    }
    {
       var v4 = glm.bvec4();
       v4['='](glm.ivec4(-5.5,4.6,-3.7,0.0));
       log("bvec4 = ivec4", v4);
       v4['='](glm.bvec4(true,false,true,false));
       log("bvec4 = bvec4", v4);
       v4['='](glm.uvec4(0,1,2,3));
       log("bvec4 = uvec4", v4);
    }

    log("translate(1,2,3)", glm.translate(glm.mat4(), glm.vec3(1,2,3)));

    v3 = glm.vec3(7,8,9);
    q = glm.quat(1,.2,.3,.4);
    log("q length", glm.length(q));
    q = glm.normalize(q);
    log("q normalized", glm.eulerAngles(q));
    log("q[0,1,2,3]", glm.vec4(q[0],q[1],q[2],q[3]));
    log("q(e(q))", glm.quat(glm.eulerAngles(q)));
    log("q * v3: ", q ['*'] (v3));
    
    log("glm.length(q * v3): ", glm.length(q ['*'] (v3)));

    log("glm.inverse(q)", glm.inverse(q));
    log("glm.quat(glm.inverse(glm.toMat4(m)))", glm.quat(glm.inverse(glm.toMat4(q))));

    var qq = glm.angleAxis(glm.radians(30.0), glm.normalize(glm.vec3(1)));
    log("qq", qq);
    log("qq * v3", qq ['*'] (v3));
    log("v3 * q: ", v3 ['*'] (q));

    v3 = v3 ['*'] (q);
    log("v3 = v3 * q: ", v3);

    var qqq = glm.angleAxis(glm.radians(30.0), glm.vec3(0.0, 1.0, 0.0));
    log("qqq", qqq);
    log("qqq * v4: ", qqq ['*'] (glm.vec4(1.0)));
    log("v4 * qqq: ", glm.vec4(1.0) ['*'] (qqq));

    m4 = glm.toMat4(qqq);
    var v4 = glm.vec4(1.0);
    log("m4", m4);
    log("v4", v4);
    log("v4 * m4: ", v4 ['*'] (m4));
    log("m4 * v4: ", m4 ['*'] (v4));

    // v4 *= m4; // disallowed by GLM
    v4 = v4 ['*'] (m4);
    log("v4 = v4 * m4: ", v4);

    {
       glm.using_namespace(
          function() {
             var qa = angleAxis(radians(45.0), vec3(0,1,0));
             var qb = angleAxis(radians(-35.0), vec3(0,1,0));
             log("glm.mix(qa,qb,.5)", mix(qa,qb,.1));
          });
    }

    {
	log("glm.fract(3.14)", glm.fract(3.14));
	log("glm.abs(-3.14)", glm.abs(-3.14));
	var v = glm.vec3(-1.5,2,3);
	log("glm.radians(v)", glm.radians(v));
	log("glm.fract(v)", glm.fract(v));
	log("glm.abs(v)", glm.abs(v));
	log("glm.sign(v)", glm.sign(v));
	log("glm.max(v,2.5)", glm.max(v,2.5));
	log("glm.min(v,2.5)", glm.min(v,2.5));
	log("glm.clamp(v,-1.0,1.0)", glm.clamp(v,-1.0,1.0));
    }
    
    {
       var x, m;
       var n = [];
       x = 16.4;
       m = glm.frexp(x, n);
       log("glm.frexp(x,n[]) fraction:", m);
       log("glm.frexp(x,n[]) exponent:", n[0]+'');
       x = -16.4;
       m = glm.frexp(x, n);
       log("glm.frexp(x,n[]) fraction:", m);
       log("glm.frexp(x,n[]) exponent:", n[0]+'');

       {
           var x = glm.vec3(1024, 0.24, glm.epsilon());
           var exp = glm.ivec3();
           var A = glm.frexp(x, exp);
           log("A = glm.frexp(vec3,ivec3); A == ", A);
           log("A = glm.frexp(vec3,ivec3); ivec3 == ",  exp);
           log("glm.ldexp(A,ivec3) == ", glm.ldexp(A,exp));
       }
    }

    {
	var ep = glm.epsilon();
	var v = glm.equal(glm.vec3(1+ep), glm.vec3(1));
	log("glm.equal(glm.vec3(1+ep),glm.vec3(1))",v);
	log("glm.all(v)", glm.all(v));

	v = glm.epsilonEqual(glm.vec3(1+ep/2.0), glm.vec3(1), ep);
	log("glm.epsilonEqual(glm.vec3(1+ep),glm.vec3(1),ep)",v);
	log("glm.all(v+-ep)", glm.all(v));

        var q = glm.angleAxis(glm.radians(45.0), glm.vec3(0.0,1,0));
        var q2 = glm.angleAxis(glm.radians(45.0+ep), glm.vec3(0.0,1,0));
        var v2 = glm.epsilonEqual(q,q2,ep);
        log("glm.epsilonEqual(glm.q(45+ep),glm.quat(45),ep)",v2);
	log("glm.all(v2+-ep)", glm.all(v2));

        var m = glm.toMat4(glm.angleAxis(glm.radians(45.0), glm.vec3(0.0,1,0)));
        var m2 = glm.toMat4(glm.angleAxis(glm.radians(45.0+1.0), glm.vec3(0.0,1,0)));
        log("m == m2", m['=='](m2));
    }
}

try {
   describe.exists;
   var _main = main;
   main = function(log) {
      log('ex-improv');
      describe('ex-improv', function() {
                  it('should run without errors',function() {
                        _main(log);
                     });
               });
   };
} catch(e) {}

main(glm.$log);

})();