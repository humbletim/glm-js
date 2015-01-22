try {
   glm = require("../tests/_glm");
} catch(e) {
   load("tests/_glm.js");
}

(function(log) {
    var t = new glm.vec4(1,2,3,4);
    log(t);
    log("t * 2.0", (t) ['*'] (2.0));
    log("t *= 2.0", (t) ['*='] (2.0));
    log("t.xy", t.xy);
    
    var q = glm.quat(glm.rotate(glm.mat4(), glm.radians(30.0), glm.vec3(0,1,0)));
    log("q:",glm.vec4(q.w,q.x,q.y,q.z));
    log("30 degrees:", glm.degrees(glm.eulerAngles(q)));

    var v3 = glm.vec3(3,3,3);
    log("v3:", v3);
    log("q * v3: ", q['*'](v3));

    q = glm.quat();
    log("q:",glm.vec4(q.w,q.x,q.y,q.z));
    v3 = glm.vec3(1.0,2,3);
    log("v3:", v3);
    log("q * v3: ", q ['*'] (v3));

    log("mat3(2): ", glm.mat3(2));
    log("mat4(2): ", glm.mat4(2));

    log("vec2(200,300)", glm.vec2(200,300));
    log("vec3(200,300,400)", glm.vec3(200,300,400));
    log("vec3(vec4(5))", glm.vec3(glm.vec4(5)));

    log("translate(1,2,3)", glm.translate(glm.mat4(), glm.vec3(1,2,3)));

    v3 = glm.vec3(7,8,9);
    q = glm.quat(1,.2,.3,.4);
    log("q length", glm.length(q));
    q = glm.normalize(q);
    log("q normalized", glm.eulerAngles(q));
    log("q * v3: ", q ['*'] (v3));

    log("glm.length(q * v3): ", glm.length(q ['*'] (v3)));

    log("glm.inverse(q)", glm.inverse(q));
    log("glm.quat(glm.inverse(glm.toMat4(m)))", glm.quat(glm.inverse(glm.toMat4(q))));
    
 })(glm.$log);


