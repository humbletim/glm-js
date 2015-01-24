#include "_glm.hpp"





int main() {
    static auto mrot = glm::angleAxis(glm::radians(45.0f), glm::vec3(0,1,0));

    auto m1 = glm::mat4(1.0f); 
    auto m2 = glm::mat4(2.0f);

    auto m3 = m1 * m2;
    log("m3", m3);

    m3 *= glm::toMat4(mrot);

    log("mrot", mrot);
    log("m3", m3);

    return 0;
}
