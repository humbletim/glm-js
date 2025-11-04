#include <iostream>
#include <string>
#include <sstream>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include <emscripten/bind.h>

using namespace emscripten;

// vec2
class vec2 {
public:
    glm::vec2 v;

    vec2() : v(0.0f, 0.0f) {}
    vec2(float x) : v(x, x) {}
    vec2(float x, float y) : v(x, y) {}
    vec2(const vec2& other) : v(other.v) {}

    float get_x() const { return v.x; }
    void set_x(float val) { v.x = val; }
    float get_y() const { return v.y; }
    void set_y(float val) { v.y = val; }

    vec2 clone() const { return vec2(*this); }

    std::string toString() const {
        std::stringstream ss;
        ss << "vec2(" << v.x << ", " << v.y << ")";
        return ss.str();
    }

    vec2 add(const vec2& other) const { vec2 res; res.v = v + other.v; return res; }
    vec2 sub(const vec2& other) const { vec2 res; res.v = v - other.v; return res; }
    vec2 mul(float scalar) const { vec2 res; res.v = v * scalar; return res; }
    vec2 div(float scalar) const { vec2 res; res.v = v / scalar; return res; }
};

// vec3
class vec3 {
public:
    glm::vec3 v;

    vec3() : v(0.0f, 0.0f, 0.0f) {}
    vec3(float x) : v(x, x, x) {}
    vec3(float x, float y, float z) : v(x, y, z) {}
    vec3(const vec2& other, float z) : v(other.v.x, other.v.y, z) {}
    vec3(const vec3& other) : v(other.v) {}

    float get_x() const { return v.x; }
    void set_x(float val) { v.x = val; }
    float get_y() const { return v.y; }
    void set_y(float val) { v.y = val; }
    float get_z() const { return v.z; }
    void set_z(float val) { v.z = val; }

    vec3 clone() const { return vec3(*this); }

    std::string toString() const {
        std::stringstream ss;
        ss << "vec3(" << v.x << ", " << v.y << ", " << v.z << ")";
        return ss.str();
    }

    vec3 add(const vec3& other) const { vec3 res; res.v = v + other.v; return res; }
    vec3 sub(const vec3& other) const { vec3 res; res.v = v - other.v; return res; }
    vec3 mul(float scalar) const { vec3 res; res.v = v * scalar; return res; }
    vec3 div(float scalar) const { vec3 res; res.v = v / scalar; return res; }
};

// vec4
class vec4 {
public:
    glm::vec4 v;

    vec4() : v(0.0f, 0.0f, 0.0f, 0.0f) {}
    vec4(float x) : v(x, x, x, x) {}
    vec4(float x, float y, float z, float w) : v(x, y, z, w) {}
    vec4(const vec2& other, float z, float w) : v(other.v.x, other.v.y, z, w) {}
    vec4(const vec3& other, float w) : v(other.v.x, other.v.y, other.v.z, w) {}
    vec4(const vec4& other) : v(other.v) {}

    float get_x() const { return v.x; }
    void set_x(float val) { v.x = val; }
    float get_y() const { return v.y; }
    void set_y(float val) { v.y = val; }
    float get_z() const { return v.z; }
    void set_z(float val) { v.z = val; }
    float get_w() const { return v.w; }
    void set_w(float val) { v.w = val; }

    vec4 clone() const { return vec4(*this); }

    std::string toString() const {
        std::stringstream ss;
        ss << "vec4(" << v.x << ", " << v.y << ", " << v.z << ", " << v.w << ")";
        return ss.str();
    }

    vec4 add(const vec4& other) const { vec4 res; res.v = v + other.v; return res; }
    vec4 sub(const vec4& other) const { vec4 res; res.v = v - other.v; return res; }
    vec4 mul(float scalar) const { vec4 res; res.v = v * scalar; return res; }
    vec4 div(float scalar) const { vec4 res; res.v = v / scalar; return res; }
};

// mat3
class mat3 {
public:
    glm::mat3 m;

    mat3() : m(1.0f) {}
    mat3(float x) : m(x) {}
    mat3(const mat3& other) : m(other.m) {}

    mat3 clone() const { return mat3(*this); }

    std::string toString() const {
        std::stringstream ss;
        const float* p = glm::value_ptr(m);
        ss << "mat3(" << p[0] << ", " << p[1] << ", " << p[2] << "], ["
                      << p[3] << ", " << p[4] << ", " << p[5] << "], ["
                      << p[6] << ", " << p[7] << ", " << p[8] << "])";
        return ss.str();
    }
};

// mat4
class mat4 {
public:
    glm::mat4 m;

    mat4() : m(1.0f) {}
    mat4(float x) : m(x) {}
    mat4(const mat4& other) : m(other.m) {}

    mat4 clone() const { return mat4(*this); }

    std::string toString() const {
        std::stringstream ss;
        const float* p = glm::value_ptr(m);
        ss << "mat4([" << p[0] << ", " << p[1] << ", " << p[2] << ", " << p[3] << "], ["
                       << p[4] << ", " << p[5] << ", " << p[6] << ", " << p[7] << "], ["
                       << p[8] << ", " << p[9] << ", " << p[10] << ", " << p[11] << "], ["
                       << p[12] << ", " << p[13] << ", " << p[14] << ", " << p[15] << "])";
        return ss.str();
    }
};

EMSCRIPTEN_BINDINGS(glm_wasm) {
    class_<vec2>("vec2")
        .constructor<>()
        .constructor<float>()
        .constructor<float, float>()
        .function("clone", &vec2::clone)
        .function("toString", &vec2::toString)
        .function("add", &vec2::add)
        .function("sub", &vec2::sub)
        .function("mul", &vec2::mul)
        .function("div", &vec2::div)
        .property("x", &vec2::get_x, &vec2::set_x)
        .property("y", &vec2::get_y, &vec2::set_y)
        ;

    class_<vec3>("vec3")
        .constructor<>()
        .constructor<float>()
        .constructor<float, float, float>()
        .constructor<const vec2&, float>()
        .function("clone", &vec3::clone)
        .function("toString", &vec3::toString)
        .function("add", &vec3::add)
        .function("sub", &vec3::sub)
        .function("mul", &vec3::mul)
        .function("div", &vec3::div)
        .property("x", &vec3::get_x, &vec3::set_x)
        .property("y", &vec3::get_y, &vec3::set_y)
        .property("z", &vec3::get_z, &vec3::set_z)
        ;

    class_<vec4>("vec4")
        .constructor<>()
        .constructor<float>()
        .constructor<float, float, float, float>()
        .constructor<const vec2&, float, float>()
        .constructor<const vec3&, float>()
        .function("clone", &vec4::clone)
        .function("toString", &vec4::toString)
        .function("add", &vec4::add)
        .function("sub", &vec4::sub)
        .function("mul", &vec4::mul)
        .function("div", &vec4::div)
        .property("x", &vec4::get_x, &vec4::set_x)
        .property("y", &vec4::get_y, &vec4::set_y)
        .property("z", &vec4::get_z, &vec4::set_z)
        .property("w", &vec4::get_w, &vec4::set_w)
        ;

    class_<mat3>("mat3")
        .constructor<>()
        .constructor<float>()
        .function("clone", &mat3::clone)
        .function("toString", &mat3::toString)
        ;

    class_<mat4>("mat4")
        .constructor<>()
        .constructor<float>()
        .function("clone", &mat4::clone)
        .function("toString", &mat4::toString)
        ;
}
