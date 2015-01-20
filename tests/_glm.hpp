// temporary scaffolding (local GLM comparison testing)
#define GLM_FORCE_RADIANS 1
#define GLM_SWIZZLE 1
#include <glm/glm.hpp>
#include <glm/ext.hpp>

#define log(x,y) printf(x"%s%s\n", x[0]?" ":"", glm::to_string(y).c_str())

namespace glm {
    std::string to_string(const glm::quat &q) {
        return to_string(glm::degrees(glm::eulerAngles(q)));//glm::vec4(q.w, q.x, q.y, q.z));
    }
}
