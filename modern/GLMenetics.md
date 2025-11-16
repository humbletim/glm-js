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
| `sqrt` | Square root. | Not implemented. | `glm::sqrt` | `❌ Missing` |
| **Exponential Functions** | | | | |
| **Geometric Functions** | | | | |
| `cross` | Cross product of two vectors. | Implemented. | `glm::cross` | `✅ Fully Implemented` |
| `distance` | Distance between two vectors. | Implemented. | `glm::distance` | `✅ Fully Implemented` |
| `dot` | Dot product of two vectors. | Implemented. | `glm::dot` | `✅ Fully Implemented` |
| `length` | Length of a vector. | Implemented. | `glm::length` | `✅ Fully Implemented` |
| `length2` | Squared length of a vector. | Implemented. | `glm::length2` | `❌ Missing` |
| `normalize` | Normalizes a vector. | Implemented. | `glm::normalize` | `✅ Fully Implemented` |
| **Matrix Functions** | | | | |
| `inverse` | Calculates the inverse of a matrix. | Implemented. | `glm::inverse` | `✅ Fully Implemented` |
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
