// temporary scaffolding (local GLM comparison testing)
#pragma GCC diagnostic error "-Wfatal-errors"

#define MY_GLM_WANTED_GTE 95
#define GLM_FORCE_RADIANS 1
#define GLM_SWIZZLE 1
#include <glm/glm.hpp>

#define __STR2__(x) #x
#define __STR1__(x) __STR2__(x)
#define glm_found "GLM_VERSION == "  __STR1__(GLM_VERSION) " [" \
    __STR1__(GLM_VERSION_MAJOR)"."\
    __STR1__(GLM_VERSION_MINOR)"."\
    __STR1__(GLM_VERSION_PATCH)"."\
    __STR1__(GLM_VERSION_REVISION)"]"
#pragma message "[FOUND:  ] " glm_found
#if GLM_VERSION < MY_GLM_WANTED_GTE
#define glm_wanted "GLM_VERSION >= " __STR1__(MY_GLM_WANTED_GTE)
#pragma message "[WANTED: ] " glm_wanted
#pragma message "...erroring out"
#error MY_GLM_WANTED_GTE
#else

#if GLM_VERSION < 97

#if GLM_VERSION_MAJOR == 0 && GLM_VERSION_MINOR == 9 && GLM_VERSION_PATCH == 6 && GLM_VERSION_REVISION < 1
  #define slerp __slerp_quat__
  #include <glm/gtc/quaternion.hpp>
  #undef slerp
  #include <glm/gtx/quaternion.hpp>
#else
  #include <glm/gtx/quaternion.hpp>
#endif

#if GLM_VERSION_MAJOR == 0 && GLM_VERSION_MINOR == 9 && GLM_VERSION_PATCH == 6 && GLM_VERSION_REVISION < 1
namespace glm {
	template <typename T, precision P> detail::tquat<T, P> slerp(detail::tquat<T, P> const & x, detail::tquat<T, P> const & y, const T & a){return __slerp_quat__(x, y, a);} //!< \brief Returns the slurp interpolation between two quaternions.
	quat slerp(quat const & x, quat const & y, const float & a){return __slerp_quat__(x, y, a);} //!< \brief Returns the slurp interpolation between two quaternions.
};
#endif

#endif
#include <glm/ext.hpp>
#define log(x,y) printf(x"%s%s\n", (x[0]?" ":""), (glm::to_string(y).c_str()))

namespace glm {
    #if GLM_VERSION >= 97
    std::string to_string(const float& b) {
        return glm::detail::format("float(%f)", b);
    }
    template <> GLM_FUNC_DECL std::string to_string(fvec2 const & x)
    {
	return "f"+detail::compute_to_string<glm::tvec2, float, (glm::precision)0u>::call(x);
    }
    template <> GLM_FUNC_DECL std::string to_string(fvec3 const & x)
    {
	return "f"+detail::compute_to_string<glm::tvec3, float, (glm::precision)0u>::call(x);
    }
    template <> GLM_FUNC_DECL std::string to_string(fvec4 const & x)
    {
	return "f"+detail::compute_to_string<glm::tvec4, float, (glm::precision)0u>::call(x);
    }
    std::string to_string(const int32& b) {
        return glm::detail::format("int(%d)", b);
    }
    std::string to_string(const uint32& b) {
        return glm::detail::format("uint(%d)", b);
    }
    #endif

    std::string to_string(const glm::quat &q) {
        return "<quat>"+to_string(glm::degrees(glm::eulerAngles(q)));//glm::vec4(q.w, q.x, q.y, q.z));
    }
    std::string to_string(const char *s) {
        return s;
    }
    std::string to_string(const bool& b) {
        return glm::detail::format("bool(%s)", b ? "true" : "false");
    }
}
#endif // MY_GLM_WANTED_GTE
