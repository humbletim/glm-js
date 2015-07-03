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
    log("vec3(200,300,400)", glm.vec3(200,300,400));
    log("vec3(vec4(5))", glm.vec3(glm.vec4(5)));

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