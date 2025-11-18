#include "_glm.hpp"

int main() {
    printf("GLM C++: %d.%d.%d\n", GLM_VERSION_MAJOR, GLM_VERSION_MINOR, GLM_VERSION_PATCH);
    auto t = glm::vec4(1,2,3,4);
    log("", t);
    log("t * 2.0", (t) * (2.0f));
    log("t *= 2.0", t *= (2.0f));
    log("t.xy", t.xy());
    log("t.wxz", t.wxz());
    log("t.xyw", t.xyw());
    log("t.xzw", t.xzw());
    log("t.wxyz", t.wxyz());

    {
        auto r = glm::rotate(glm::radians(30.0f), glm::vec3(0.0f,1,0));
        log("r:",glm::quat(r));
        r = glm::rotate(glm::mat4(), glm::radians(30.0f), glm::vec3(0.0f,1.0f,0.0f) );
        log("r:",glm::quat(r));
    }

    {
        auto s = glm::scale(glm::vec3(3.0,1,0));
//         log("s:",s);
//         s = glm::scale(3.0f,1.0f,0.0f);
        log("s:",s);
        s = glm::scale(glm::mat4(), glm::vec3(3.0,1.0,0.1) );
        log("s:",s);
    }

    auto q = glm::quat(glm::rotate(glm::mat4(), glm::radians(30.0f), glm::vec3(0.0f,1,0)));
    log("q:",glm::vec4(q.w,q.x,q.y,q.z));
    log("30 degrees:", glm::degrees(glm::eulerAngles(q)));

    auto v3 = glm::vec3(3.0f,3,3);
    log("v3:",v3);
    log("glm.quat(v3):", glm::quat(v3));
    log("q * v3: ", q * (v3));

    q = glm::quat();
    log("q:",glm::vec4(q.w,q.x,q.y,q.z));
    v3 = glm::vec3(1.0f,2,3);
    log("v3:", v3);
    log("q * v3: ", q * (v3));

    q = glm::angleAxis(glm::radians(45.0f), glm::vec3(0.0f,1,0));
    log("angle(q)", glm::degrees(glm::angle(q)));
    log("axis(q)", glm::axis(q));

    log("diagonal4x4(vec4(1,2,3,4)): ", glm::diagonal4x4(glm::vec4(1,2,3,4)));
    log("diagonal3x3(vec3(1,2,3)): ", glm::diagonal3x3(glm::vec3(1,2,3)));
    log("mat3(2): ", glm::mat3(2));
    log("mat4(2): ", glm::mat4(2));
    auto m4a = glm::mat4(glm::vec4(1),
                         glm::vec4(2),
                         glm::vec4(3),
                         glm::vec4(4));
    log("mat4(vec4 x 4): ", m4a);
    auto m4 = glm::fmat4(1,1,1,1,
                         2,2,2,2,
                         3,3,3,3,
                         4,4,4,4);
    log("mat4(1..,2..,3..,4..): ", m4);
    log("m4 == m4a", m4 == m4a ? "true" : "false");

    auto m4b = glm::mat4(glm::mat3(2));
    log("mat4(mat3(2)): ", m4b);
    log("m4 == m4b", ( m4 ) == ( m4b ) ? "true" : "false");

    auto m4c = glm::mat4({
            { 1, 2, 3, 4 },
            { 4, 3, 2, 1 },
            { 1, 2, 3, 4 },
            { 4, 3, 2, 1 }
        });
    log("mat4({{...} x 4}}: ", m4c);

    auto m4d = glm::mat4({
             1, 2, 3, 4,
             4, 3, 2, 1 ,
             1, 2, 3, 4 ,
             4, 3, 2, 1 
        });
    log("mat4({ float x 16}}: ", m4d);

    log("vec2(200,300)", glm::vec2(200,300));
    log("uvec2(2.99,3.99)", glm::uvec2(2.99,3.99));
    log("uvec2(-2.1,0.01)", glm::uvec2(-2.1,0.01));
    log("uvec2(-2.5,0).x", glm::uvec2(-2.5,0).x);
    log("ivec2(2.99,3.99)", glm::ivec2(2.99,3.99));
    log("ivec2(-2.1,0.01)", glm::ivec2(-2.1,0.01));
    log("ivec2(-2.5,0).x", glm::ivec2(-2.5,0).x);
    log("vec3(200,300,400)", glm::vec3(200,300,400));
    log("vec3(vec4(5))", glm::vec3(glm::vec4(5)));
    log("vec3(bvec4(true))", glm::vec3(glm::bvec4(true)));
    log("bvec3(vec4(1,1,0,1))", glm::bvec3(glm::vec4(1,1,0,1)));
    log("ivec3(uvec4(-5.5,4.6,-3.7,2))", glm::ivec3(glm::uvec4(-5.5,4.6,-3.7,2)));
    log("uvec4(ivec3(-5.5,4.6,-3.7),.5)", glm::uvec4(glm::ivec3(-5.5,4.6,-3.7),.5));
    {
       auto v3 = glm::ivec3();
       v3 = (glm::uvec3(-5.5,4.6,-3.7));
       log("ivec3 = uvec3", v3);
       v3 = (glm::bvec3(1,0,1));
       log("ivec3 = bvec3", v3);
    }
    {
       auto v2 = glm::uvec2();
       v2 = (glm::ivec2(-5.5,4.6));
       log("uvec2 = ivec2", v2);
       v2 = (glm::bvec2(true,false));
       log("uvec2 = bvec2", v2);
    }
    {
       auto v4 = glm::bvec4();
       v4 = (glm::ivec4(-5.5,4.6,-3.7,0.0));
       log("bvec4 = ivec4", v4);
       v4 = (glm::bvec4(true,false,true,false));
       log("bvec4 = bvec4", v4);
       v4 = (glm::uvec4(0,1,2,3));
       log("bvec4 = uvec4", v4);
    }

    log("translate(1,2,3)", glm::translate(glm::mat4(), glm::vec3(1,2,3)));

    v3 = glm::vec3(7,8,9);
    q = (glm::quat(1.0f,.2,.3,.4));
    log("q length", glm::length(q));
    q = glm::normalize(q);
    log("q normalized", glm::eulerAngles(q));
    log("q[0,1,2,3]", glm::vec4(q[0],q[1],q[2],q[3]));
    log("q(e(q))", glm::quat(glm::eulerAngles(q)));
    log("q * v3: ", q * (v3));

    log("glm.length2(q * v3): ", glm::length2(q * (v3)));
    log("glm.length(q * v3): ", glm::length(q * (v3)));

    log("glm.inverse(q)", glm::inverse(q));
    log("glm.quat(glm.inverse(glm.toMat4(m)))", glm::quat(glm::inverse(glm::toMat4(q))));

    auto qq = glm::angleAxis(glm::radians(30.0f), glm::normalize(glm::vec3(1.0)));
    log("qq", qq);
    log("qq * v3: ", qq * (v3));
    log("v3 * q: ", v3 * (q));
    auto qq2 = (qq * (2.0f));
    log("qq2 * 2.0: ", glm::make_vec4(&qq2[0]));
    log("qq2 * 2.0: ", glm::vec4(qq2.x, qq2.y, qq2.z, qq2.w));
    log("qq2 * 2.0: ", glm::degrees(glm::eulerAngles(qq2)));

    v3 = v3 * q;
    log("v3 = v3 * q: ", v3);

    auto qqq = glm::angleAxis(glm::radians(30.0f), glm::vec3(0.0, 1.0, 0.0));
    log("qqq", qqq);
    log("qqq * v4: ", qqq * (glm::vec4(1.0)));
    log("v4 * qqq: ", glm::vec4(1.0) * (qqq));

    glm::vec3 u = glm::vec3(1,0,0);
    log("glm.rotation(u * qqq, u): ", glm::rotation(u*qqq,u));

    m4 = glm::toMat4(qqq);
    auto v4 = glm::vec4(1.0);
    log("m4", m4);
    log("v4", v4);
    log("v4 * m4: ", v4 * (m4));
    log("m4 * v4: ", m4 * (v4));

    v4 = v4 * (m4);
    log("v4 = v4 * m4: ", v4);

    {
        using namespace glm;

        auto qa = angleAxis(radians(45.0f), vec3(0,1,0));
        auto qb = angleAxis(radians(-35.0f), vec3(0,1,0));
        log("glm.mix(qa,qb,.5)", mix(qa,qb,.1f));

    }

    {
        glm::quat qa = glm::angleAxis(glm::radians(45.0f), glm::vec3(0,1,0));
        glm::quat qb = glm::angleAxis(glm::radians(-35.0f), glm::vec3(0,1,0));
        float f = .1f;
        log("glm.slerp(qa,qb,.1)", glm::slerp(qa, qb, f));
        log("glm.slerp(qa,qb,.9)", glm::slerp(qa, qb, .9f));
        log("glm.mix(qa,qb,.9)", glm::mix(qa, qb, .9f));
    }

    {
	log("glm.fract(3.14)", glm::fract(3.14f));
	log("glm.abs(-3.14)", glm::abs(-3.14f));
	auto v = glm::vec3(-1.5f,2,3);
	log("glm.radians(v)", glm::radians(v));
	log("glm.fract(v)", glm::fract(v));
	log("glm.abs(v)", glm::abs(v));
	log("glm.sign(v)", glm::sign(v));
	log("glm.max(v,2.5)", glm::max(v,2.5f));
	log("glm.min(v,2.5)", glm::min(v,2.5f));
	log("glm.clamp(v,-1.0,1.0)", glm::clamp(v,-1.0f,1.0f));
    }
    
    {
       float x, m;
       int n;
       x = 16.4f;
       m = glm::frexp(x, n);
       log("glm.frexp(x,n[]) fraction:", m);
       log("glm.frexp(x,n[]) exponent:", n);
       x = -16.4;
       m = glm::frexp(x, n);
       log("glm.frexp(x,n[]) fraction:", m);
       log("glm.frexp(x,n[]) exponent:", n);

       {
           glm::vec3 x(1024.0f, 0.24f, glm::epsilon<float>());
           glm::ivec3 exp;
           glm::vec3 A = glm::frexp(x, exp);
           log("A = glm.frexp(vec3,ivec3); A == ", A);
           log("A = glm.frexp(vec3,ivec3); ivec3 == ",  exp);
	   log("glm.ldexp(A,ivec3) == ", glm::ldexp(A,exp));
       }
    }

    {
	float ep = glm::epsilon<float>();
	auto v = glm::equal(glm::vec3(1+ep), glm::vec3(1));
	log("glm.equal(glm.vec3(1+ep),glm.vec3(1))",v);
	log("glm.all(v)", glm::all(v));

	v = glm::epsilonEqual(glm::vec3(1+ep/2.0), glm::vec3(1), ep);
	log("glm.epsilonEqual(glm.vec3(1+ep),glm.vec3(1),ep)",v);
	log("glm.all(v+-ep)", glm::all(v));

	glm::quat q = glm::angleAxis(glm::radians(45.0f), glm::vec3(0.0f,1,0));
	glm::quat q2 = glm::angleAxis(glm::radians(45.0f+ep), glm::vec3(0.0f,1,0));
        auto v2 = glm::epsilonEqual(q,q2,ep);
        log("glm.epsilonEqual(glm.q(45+ep),glm.quat(45),ep)",v2);
	log("glm.all(v2+-ep)", glm::all(v2));

	glm::mat4 m = glm::toMat4(glm::angleAxis(glm::radians(45.0f), glm::vec3(0.0f,1,0)));
	glm::mat4 m2 = glm::toMat4(glm::angleAxis(glm::radians(45.0f+1.0f), glm::vec3(0.0f,1,0)));
        log("m == m2", m == m2);
    }

    {
        float i = glm::radians(45.f);
        glm::mat4 D = glm::mat4();
        glm::mat4 E = glm::translate(D, glm::vec3(1.4f, 1.2f, 1.1f));
        glm::mat4 F = glm::perspective(i, 1.5f, 0.1f, 1000.f);
        glm::mat4 G = glm::inverse(F * E);
        glm::vec3 H = glm::unProject(glm::vec3(i), G, F, E[3]);
        log("unProject", H);
        log("project", glm::project(H, G, F, E[3]));
    }

    log("lookAt(vec(0), vec3(1), vec3(0,1,0))", glm::lookAt(glm::vec3(0), glm::vec3(1), glm::vec3(0,1,0)));

    {
        log("ortho(l,r,b,t,n,f)", glm::ortho(-16.0f * 2.0f, 16.0f * 2.0f, 9.0f * 2.0f, -9.0f * 2.0f, -2.0f, 2.0f));
        glm::mat4 m = glm::ortho(-16.0f * 2.0f, 16.0f * 2.0f, 9.0f * 2.0f, -9.0f * 2.0f);
        log("ortho(l,r,b,t):", "");
        log("\t[0]", m[0]);
        log("\t[1]", m[1]);
        log("\t[2]", m[2]);
        log("\t[3]", m[3]);
        log("ortho(0,1,0,1)", glm::ortho(0.f,1.0f,0.f,1.0f));
    }

    {
        using namespace glm;
        auto x = normalize(vec3(0.0f,1,0));
        auto y = normalize(vec3(-0.007486011367291212f,-0.25215944647789,-5.470575332641602));
        auto ref = normalize(vec3(0.003699185326695442f,-0.2452484667301178,-5.7250776290893555));
        auto Angle = acos(clamp(dot(x, y), 0.0f, 1.0f));
        log("dot(x,y)", dot(x,y));
        log("clamp(dot(x,y), 0, 1)", clamp(dot(x, y), 0.0f, 1.0f));
        log("Angle = acos(clamp(dot(x,y), 0, 1))", Angle);
        log("cross(x,y)", cross(x,y));
        log("dot(ref, cross(x,y))", dot(ref, cross(x,y)));
        auto drcxy = dot(ref, cross(x, y)) < 0.0f;
        log("drcxy = dot(ref, cross(x, y)) < T(0)", 1.0f*drcxy);
        log("mix(Angle, -Angle, drcxy)", mix(Angle, -Angle, drcxy));
        log("glm.orientedAngle", orientedAngle(vec3(1,0,0), vec3(.5,.5,.5), vec3(0,1,0)));
        log("glm.orientedAngle", degrees(orientedAngle(x,y,ref)));
    }
    return 0;
}
