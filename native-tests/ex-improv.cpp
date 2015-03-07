#include "_glm.hpp"






int main() {
    printf("GLM C++: %d.%d.%d\n", GLM_VERSION_MAJOR, GLM_VERSION_MINOR, GLM_VERSION_PATCH);
    auto t = glm::vec4(1,2,3,4);
    log("", t);
    log("t * 2.0", (t) * (2.0f));
    log("t *= 2.0", t *= (2.0f));
    log("t.xy", t.xy());

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
    log("vec3(200,300,400)", glm::vec3(200,300,400));
    log("vec3(vec4(5))", glm::vec3(glm::vec4(5)));

    log("translate(1,2,3)", glm::translate(glm::mat4(), glm::vec3(1,2,3)));

    v3 = glm::vec3(7,8,9);
    q = (glm::quat(1.0f,.2,.3,.4));
    log("q length", glm::length(q));
    q = glm::normalize(q);
    log("q normalized", glm::eulerAngles(q));
    log("q(e(q))", glm::quat(glm::eulerAngles(q)));
    log("q * v3: ", q * (v3));

    log("glm.length(q * v3): ", glm::length(q * (v3)));

    log("glm.inverse(q)", glm::inverse(q));
    log("glm.quat(glm.inverse(glm.toMat4(m)))", glm::quat(glm::inverse(glm::toMat4(q))));
    {
        using namespace glm;
        auto qa = angleAxis(radians(45.0f), vec3(0,1,0));
        auto qb = angleAxis(radians(-35.0f), vec3(0,1,0));
        log("glm.mix(qa,qb,.5)", mix(qa,qb,.1f));
    }

    return 0;
}
