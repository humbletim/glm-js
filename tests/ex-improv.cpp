#include "_glm.hpp"





int main() {
    auto t = glm::vec4(1,2,3,4);
    log("", t);
    log("t * 2.0", (t) * (2.0f));
    log("t *= 2.0", t *= (2.0f));
    log("t.xy", t.xy());

    auto q = glm::quat(glm::rotate(glm::mat4(), glm::radians(30.0f), glm::vec3(0.0f,1,0)));
    log("q:",glm::vec4(q.w,q.x,q.y,q.z));
    log("30 degrees:", glm::degrees(glm::eulerAngles(q)));

    auto v3 = glm::vec3(3.0f,3,3);
    log("v3:",v3);
    log("q * v3: ", q * (v3));

    q = glm::quat();
    log("q:",glm::vec4(q.w,q.x,q.y,q.z));
    v3 = glm::vec3(1.0f,2,3);
    log("v3:", v3);
    log("q * v3: ", q * (v3));

    log("mat3(2): ", glm::mat3(2));
    log("mat4(2): ", glm::mat4(2));

    log("vec2(200,300)", glm::vec2(200,300));
    log("vec3(200,300,400)", glm::vec3(200,300,400));
    log("vec3(vec4(5))", glm::vec3(glm::vec4(5)));

    log("translate(1,2,3)", glm::translate(glm::mat4(), glm::vec3(1,2,3)));

    v3 = glm::vec3(7,8,9);
    q = (glm::quat(1.0f,.2,.3,.4));
    log("q length", glm::length(q));
    q = glm::normalize(q);
    log("q normalized", glm::eulerAngles(q));
    log("q * v3: ", q * (v3));

    return 0;
}
