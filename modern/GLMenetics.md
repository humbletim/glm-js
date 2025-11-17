# GLMenetics: A Deep Dive into glm-js API Harmony

## Philosophy

The term "GLMenetics" was coined in the original `glm-js` documentation to describe a core design principle: the faithful adaptation of the [OpenGL Shading Language (GLSL)](https://www.opengl.org/documentation/glsl/) and the [C++ OpenGL Mathematics (GLM)](http://glm.g-truc.net/) library into the JavaScript ecosystem. The goal is to create a "spiritual" and semantic alignment, allowing developers to leverage their existing knowledge of GLSL/GLM and write 3D math code that is portable, intuitive, and consistent across different environments (GPU, CPU, and JS).

This document serves as a detailed manifest of the modernization effort for `glm-js`. It goes beyond a simple "implemented" or "missing" status, providing a nuanced comparison of the legacy `glm-js` (`Dusk`), the modern ES6 implementation (`Day`/`Dawn`), and the C++/GLSL standards that serve as our source of truth.

## API Status and Parity Analysis

The following table provides a comprehensive breakdown of each API feature. The "Status" column uses the following key:

-   `✅ Fully Implemented`: Passes all legacy and modern tests, and aligns with GLM C++.
-   `⚠️ Partially Implemented`: Implemented, but with known bugs, missing overloads, or behavioral differences.
-   `❌ Missing`: Not yet implemented.
-   `➡️ Diverged`: Intentionally different from the legacy version, with a clear explanation.
-   `🚫 Deprecated`: Not part of the modern API.

| API | Legacy (`Dusk`) | Modern (`Day`/`Dawn`) | GLM C++/GLSL Parity | Status |
|---|---|---|---|---|
| **Core** | | | | |
| `version` | Returns library version string. | Not implemented. | `GLM_VERSION` macro. | `❌ Missing` |
| **Angle and Trigonometry** | | | | |
| `degrees` | Converts radians to degrees. | Implemented. | `glm::degrees` | `✅ Fully Implemented` |
| `radians` | Converts degrees to radians. | Implemented. | `glm::radians` | `✅ Fully Implemented` |
| `sin` | Sine of an angle. | Implemented. | `glm::sin` | `✅ Fully Implemented` |
| `cos` | Cosine of an angle. | Implemented. | `glm::cos` | `✅ Fully Implemented` |
| `tan` | Tangent of an angle. | Implemented. | `glm::tan` | `✅ Fully Implemented` |
| `asin` | Arc sine. | Implemented. | `glm::asin` | `✅ Fully Implemented` |
| `acos` | Arc cosine. | Implemented. | `glm::acos` | `✅ Fully Implemented` |
| `atan` | Arc tangent. | Implemented. | `glm::atan` | `✅ Fully Implemented` |
| `sinh` | Hyperbolic sine. | Implemented. | `glm::sinh` | `✅ Fully Implemented` |
| `cosh` | Hyperbolic cosine. | Implemented. | `glm::cosh` | `✅ Fully Implemented` |
| `tanh` | Hyperbolic tangent. | Implemented. | `glm::tanh` | `✅ Fully Implemented` |
| `asinh` | Inverse hyperbolic sine. | Implemented. | `glm::asinh` | `✅ Fully Implemented` |
| `acosh` | Inverse hyperbolic cosine. | Implemented. | `glm::acosh` | `✅ Fully Implemented` |
| `atanh` | Inverse hyperbolic tangent. | Implemented. | `glm::atanh` | `✅ Fully Implemented` |
| **Common Functions** | | | | |
| `abs` | Component-wise absolute value. | Implemented. | `glm::abs` | `✅ Fully Implemented` |
| `all` | Checks if all components are true. | Implemented. | `glm::all` | `✅ Fully Implemented` |
| `clamp` | Constrains a value to a range. | Implemented, but buggy for scalar inputs. | `glm::clamp` | `⚠️ Partially Implemented` |
| `fract` | Computes the fractional part. | Implemented. | `glm::fract` | `✅ Fully Implemented` |
| `frexp` | Splits a number into significand and exponent. | Implemented. | N/A (Standard C library function) | `✅ Fully Implemented` |
| `ldexp` | Multiplies a number by power of two. | Not implemented. | N/A (Standard C library function) | `❌ Missing` |
| `max` | Component-wise maximum. | Implemented. | `glm::max` | `✅ Fully Implemented` |
| `min` | Component-wise minimum. | Implemented. | `glm::min` | `✅ Fully Implemented` |
| `mix` | Linear interpolation. | Implemented, but buggy for scalar/vector mixes. | `glm::mix` | `⚠️ Partially Implemented` |
| `sign` | Extracts the sign of a value. | Implemented. | `glm::sign` | `✅ Fully Implemented` |
| `sqrt` | Square root. | Implemented. | `glm::sqrt` | `✅ Fully Implemented` |
| **Exponential Functions** | | | | |
| `pow` | Power of a number. | Implemented. | `glm::pow` | `✅ Fully Implemented` |
| `exp` | Natural exponentiation. | Implemented. | `glm::exp` | `✅ Fully Implemented` |
| `log` | Natural logarithm. | Implemented. | `glm::log` | `✅ Fully Implemented` |
| `exp2` | Base 2 exponentiation. | Implemented. | `glm::exp2` | `✅ Fully Implemented` |
| `log2` | Base 2 logarithm. | Implemented. | `glm::log2` | `✅ Fully Implemented` |
| `inversesqrt` | Inverse square root. | Implemented. | `glm::inversesqrt` | `✅ Fully Implemented` |
| **Floating-Point Pack and Unpack** | | | | |
| `packDouble2x32` | Packs a `uvec2` into a `double`. | Implemented. | `glm::packDouble2x32` | `✅ Fully Implemented` |
| `unpackDouble2x32` | Unpacks a `double` into a `uvec2`. | Implemented. | `glm::unpackDouble2x32` | `✅ Fully Implemented` |
| `packHalf2x16` | Packs a `vec2` into a 16-bit float. | Implemented. | `glm::packHalf2x16` | `✅ Fully Implemented` |
| `unpackHalf2x16` | Unpacks a 16-bit float into a `vec2`. | Implemented. | `glm::unpackHalf2x16` | `✅ Fully Implemented` |
| `packSnorm2x16` | Packs a normalized `vec2` into a 16-bit signed integer. | Implemented. | `glm::packSnorm2x16` | `✅ Fully Implemented` |
| `unpackSnorm2x16` | Unpacks a 16-bit signed integer into a normalized `vec2`. | Implemented. | `glm::unpackSnorm2x16` | `✅ Fully Implemented` |
| `packSnorm4x8` | Packs a normalized `vec4` into a 32-bit signed integer. | Implemented. | `glm::packSnorm4x8` | `✅ Fully Implemented` |
| `unpackSnorm4x8` | Unpacks a 32-bit signed integer into a normalized `vec4`. | Implemented. | `glm::unpackSnorm4x8` | `✅ Fully Implemented` |
| `packUnorm2x16` | Packs a normalized `vec2` into a 16-bit unsigned integer. | Implemented. | `glm::packUnorm2x16` | `✅ Fully Implemented` |
| `unpackUnorm2x16` | Unpacks a 16-bit unsigned integer into a normalized `vec2`. | Implemented. | `glm::unpackUnorm2x16` | `✅ Fully Implemented` |
| `packUnorm4x8` | Packs a normalized `vec4` into a 32-bit unsigned integer. | Implemented. | `glm::packUnorm4x8` | `✅ Fully Implemented` |
| `unpackUnorm4x8` | Unpacks a 32-bit unsigned integer into a normalized `vec4`. | Implemented. | `glm::unpackUnorm4x8` | `✅ Fully Implemented` |
| **Vector Relational Functions** | | | | |
| `any` | Checks if any component is true. | Implemented. | `glm::any` | `✅ Fully Implemented` |
| `all` | Checks if all components are true. | Implemented. | `glm::all` | `✅ Fully Implemented` |
| `equal` | Component-wise equality. | Implemented. | `glm::equal` | `✅ Fully Implemented` |
| `notEqual` | Component-wise inequality. | Implemented. | `glm::notEqual` | `✅ Fully Implemented` |
| `lessThan` | Component-wise less than. | Implemented. | `glm::lessThan` | `✅ Fully Implemented` |
| `lessThanEqual` | Component-wise less than or equal. | Implemented. | `glm::lessThanEqual` | `✅ Fully Implemented` |
| `greaterThan` | Component-wise greater than. | Implemented. | `glm::greaterThan` | `✅ Fully Implemented` |
| `greaterThanEqual` | Component-wise greater than or equal. | Implemented. | `glm::greaterThanEqual` | `✅ Fully Implemented` |
| `not_` | Component-wise logical complement. | Implemented. | `glm::not_` | `✅ Fully Implemented` |
| **Geometric Functions** | | | | |
| `cross` | Cross product of two vectors. | Implemented. | `glm::cross` | `✅ Fully Implemented` |
| `distance` | Distance between two vectors. | Implemented. | `glm::distance` | `✅ Fully Implemented` |
| `dot` | Dot product of two vectors. | Implemented. | `glm::dot` | `✅ Fully Implemented` |
| `faceforward` | Faceforward vector. | Implemented. | `glm::faceforward` | `✅ Fully Implemented` |
| `length` | Length of a vector. | Implemented. | `glm::length` | `✅ Fully Implemented` |
| `length2` | Squared length of a vector. | Implemented. | `glm::length2` | `✅ Fully Implemented` |
| `normalize` | Normalizes a vector. | Implemented. | `glm::normalize` | `✅ Fully Implemented` |
| `reflect` | Reflect vector. | Implemented. | `glm::reflect` | `✅ Fully Implemented` |
| `refract` | Refract vector. | Implemented. | `glm::refract` | `✅ Fully Implemented` |
| **Matrix Functions** | | | | |
| `determinant` | Determinant of a matrix. | Implemented. | `glm::determinant` | `✅ Fully Implemented` |
| `inverse` | Calculates the inverse of a matrix. | Implemented. | `glm::inverse` | `✅ Fully Implemented` |
| `matrixCompMult` | Component-wise matrix multiplication. | Implemented. | `glm::matrixCompMult` | `✅ Fully Implemented` |
| `outerProduct` | Outer product of two vectors. | Implemented. | `glm::outerProduct` | `✅ Fully Implemented` |
| `transpose` | Transposes a matrix. | Implemented. | `glm::transpose` | `✅ Fully Implemented` |
| **Quaternion Functions** | | | | |
| `angle` | Angle of a quaternion. | Implemented. | `glm::angle` | `✅ Fully Implemented` |
| `angleAxis` | Creates a quaternion from an angle and axis. | Implemented. | `glm::angleAxis` | `✅ Fully Implemented` |
| `axis` | Axis of a quaternion. | Implemented. | `glm::axis` | `✅ Fully Implemented` |
| `euler` | Extracts Euler angles from a quaternion. | Not implemented. | `glm::euler` | `❌ Missing` |
| `eulerAngles` | Extracts Euler angles from a quaternion. | Returns negative values, unlike Dusk. | `glm::eulerAngles` | `➡️ Diverged` |
| `inverse` | Calculates the inverse of a quaternion. | Implemented. `[0,0,0,1]` for zero-length, unlike Dusk. | `glm::inverse` | `➡️ Diverged` |
| `pitch` | Pitch of a quaternion. | Not Implemented. | `glm::pitch` | `❌ Missing` |
| `roll` | Roll of a quaternion. | Not Implemented. | `glm::roll` | `❌ Missing` |
| `slerp` | Spherical linear interpolation. | Minor floating point differences from Dusk. | `glm::slerp` | `⚠️ Partially Implemented` |
| `yaw` | Yaw of a quaternion. | Not Implemented. | `glm::yaw` | `❌ Missing` |
| **Transformation Functions** | | | | |
| `lookAt` | Creates a view matrix. | Implemented, but produces an incorrect matrix. | `glm::lookAt` | `⚠️ Partially Implemented` |
| `ortho` | Creates an orthographic projection matrix. | Implemented, but produces an incorrect matrix. | `glm::ortho` | `⚠️ Partially Implemented` |
| `perspective` | Creates a perspective projection matrix. | Implemented, but produces an incorrect matrix. | `glm::perspective` | `⚠️ Partially Implemented` |
| `project` | Projects a vector onto a screen. | Implemented. | `glm::project` | `✅ Fully Implemented` |
| `rotate` | Rotates a vector or matrix. | Implemented. | `glm::rotate` | `✅ Fully Implemented` |
| `scale` | Scales a matrix. | Implemented. | `glm::scale` | `✅ Fully Implemented` |
| `translate` | Translates a matrix. | Implemented. | `glm::translate` | `✅ Fully Implemented` |
| `unProject` | Un-projects a vector from a screen. | Implemented. | `glm::unProject` | `✅ Fully Implemented` |
| **Vector and Matrix Types** | | | | |
| `vec2` | 2D vector. | Implemented. | `glm::vec2` | `✅ Fully Implemented` |
| `vec3` | 3D vector. | Implemented. | `glm::vec3` | `✅ Fully Implemented` |
| `vec4` | 4D vector. | Implemented. | `glm::vec4` | `✅ Fully Implemented` |
| `mat3` | 3x3 matrix. | Implemented. | `glm::mat3` | `✅ Fully Implemented` |
| `mat4` | 4x4 matrix. | Implemented. | `glm::mat4` | `✅ Fully Implemented` |
| `quat` | Quaternion. | Implemented. | `glm::quat` | `✅ Fully Implemented` |
| `uvec2`, `uvec3`, `uvec4` | Unsigned integer vectors. | Not implemented. | `glm::uvec` | `❌ Missing` |
| `ivec2`, `ivec3`, `ivec4` | Integer vectors. | Not implemented. | `glm::ivec` | `❌ Missing` |
| `bvec2`, `bvec3`, `bvec4` | Boolean vectors. | Not implemented. | `glm::bvec` | `❌ Missing` |
| **Legacy & Deprecated** | | | | |
| `make_vec2`, `make_vec3`, `make_vec4` | Buffer creation functions. | Not implemented in modern API. | N/A | `➡️ Diverged` |
| `make_quat`, `make_mat3`, `make_mat4` | Buffer creation functions. | Not implemented in modern API. | N/A | `➡️ Diverged` |
| `copy` | Copies an object. | Replaced by `.clone()` method. | N/A | `➡️ Diverged` |
| `sub_eq`, `add_eq`, `div_eq`, `mul_eq` | In-place operators. | Replaced by standard operators. | N/A | `➡️ Diverged` |
| `toMat4` | Converts a quaternion to a 4x4 matrix. | Implemented. | `glm::toMat4` | `✅ Fully Implemented` |
| `using_namespace` | Injects glm into global scope. | Not applicable to ES modules. | N/A | `🚫 Deprecated` |
| `vendor` | Returns underlying vendor library. | No longer applicable. | N/A | `🚫 Deprecated` |
| `string` | Alias for `to_string`. | Not implemented. | N/A | `❌ Missing` |
| `to_string` | Converts a glm object to a string. | Not implemented. | `glm::to_string` | `❌ Missing` |
| `number`, `boolean` | Type casting. | Use standard JS type casting. | N/A | `🚫 Deprecated` |
| `eql_epsilon`, `eql` | Equality checks. | Use standard operators and `epsilonEqual`. | N/A | `🚫 Deprecated` |
