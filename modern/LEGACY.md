| API | Purpose | Status |
|---|---|---|
| `version` | Returns the library version | `missing` |
| `normalize` | Normalizes a vector | `implemented` |
| `inverse` | Calculates the inverse of a matrix or quaternion | `implemented` |
| `distance` | Calculates the distance between two vectors | `implemented` |
| `length` | Calculates the length of a vector | `implemented` |
| `length2` | Calculates the squared length of a vector | `implemented` |
| `transpose` | Transposes a matrix | `implemented` |
| `slerp` | Spherical linear interpolation between two quaternions | `implemented` |
| `mix` | Linear interpolation between two values | `implemented` |
| `clamp` | Constrains a value to a range | `implemented` |
| `angleAxis` | Creates a quaternion from an angle and an axis | `implemented` |
| `rotate` | Rotates a vector or matrix | `implemented` |
| `scale` | Scales a matrix | `implemented` |
| `translate` | Translates a matrix | `implemented` |
| `lookAt` | Creates a view matrix | `implemented` |
| `cross` | Calculates the cross product of two vectors | `implemented` |
| `dot` | Calculates the dot product of two vectors | `implemented` |
| `perspective` | Creates a perspective projection matrix | `implemented` |
| `ortho` | Creates an orthographic projection matrix | `implemented` |
| `angle` | Calculates the angle between two vectors | `implemented` |
| `axis` | Extracts the axis of a quaternion | `implemented` |
| `make_vec2` | Creates a vec2 | `diverged` |
| `make_vec3` | Creates a vec3 | `diverged` |
| `make_vec4` | Creates a vec4 | `diverged` |
| `make_quat` | Creates a quat | `diverged` |
| `make_mat3` | Creates a mat3 | `diverged` |
| `make_mat4` | Creates a mat4 | `diverged` |
| `diagonal4x4` | Creates a 4x4 diagonal matrix | `implemented` |
| `diagonal3x3` | Creates a 3x3 diagonal matrix | `implemented` |
| `to_string` | Converts a vector, matrix, or quaternion to a string | `missing` |
| `sqrt` | Calculates the square root | `missing` |
| `epsilon` | A small constant for floating point comparisons | `implemented` |
| `euler` | Extracts Euler angles from a quaternion | `missing` |
| `e` | The mathematical constant e | `missing` |
| `ln_ten` | The natural logarithm of 10 | `missing` |
| `ln_two` | The natural logarithm of 2 | `missing` |
| `pi` | The mathematical constant pi | `missing` |
| `half_pi` | pi / 2 | `missing` |
| `quarter_pi` | pi / 4 | `missing` |
| `one_over_pi` | 1 / pi | `missing` |
| `two_over_pi` | 2 / pi | `missing` |
| `root_pi` | The square root of pi | `missing` |
| `root_two` | The square root of 2 | `missing` |
| `root_three` | The square root of 3 | `missing` |
| `two_over_root_pi`| 2 / sqrt(pi) | `missing` |
| `one_over_root_two`| 1 / sqrt(2) | `missing` |
| `epsilonEqual` | Epsilon equality comparison | `implemented` |
| `degrees` | Converts radians to degrees | `implemented` |
| `radians` | Converts degrees to radians | `implemented` |
| `sign` | Extracts the sign of a value | `missing` |
| `abs` | Calculates the absolute value | `missing` |
| `fract` | Calculates the fractional part of a number | `missing` |
| `all` | Checks if all components of a boolean vector are true | `missing` |
| `roll` | Extracts the roll from a quaternion | `implemented` |
| `pitch` | Extracts the pitch from a quaternion | `implemented` |
| `yaw` | Extracts the yaw from a quaternion | `implemented` |
| `eulerAngles` | Extracts the Euler angles from a quaternion | `implemented` |
| `frexp` | Splits a number into a significand and an exponent | `missing` |
| `ldexp` | Multiplies a number by an integral power of two | `missing` |
| `string` | Alias for to_string | `missing` |
| `number` | Type casting | `deprecated` |
| `boolean` | Type casting | `deprecated` |
| `vec2` | 2D vector | `implemented` |
| `uvec2` | Unsigned integer 2D vector | `missing` |
| `vec3` | 3D vector | `implemented` |
| `uvec3` | Unsigned integer 3D vector | `missing` |
| `vec4` | 4D vector | `implemented` |
| `uvec4` | Unsigned integer 4D vector | `missing` |
| `ivec2` | Integer 2D vector | `missing` |
| `ivec3` | Integer 3D vector | `missing` |
| `ivec4` | Integer 4D vector | `missing` |
| `bvec2` | Boolean 2D vector | `missing` |
| `bvec3` | Boolean 3D vector | `missing` |
| `bvec4` | Boolean 4D vector | `missing` |
| `mat3` | 3x3 matrix | `implemented` |
| `mat4` | 4x4 matrix | `implemented` |
| `quat` | Quaternion | `implemented` |
| `using_namespace` | Injects glm into the global namespace | `deprecated` |
| `min` | Returns the minimum of two values | `missing` |
| `max` | Returns the maximum of two values | `missing` |
| `equal` | Strict equality comparison | `implemented` |
| `rotation` | Creates a rotation matrix | `missing` |
| `project` | Projects a vector onto a screen | `implemented` |
| `unProject` | Un-projects a vector from a screen | `implemented` |
| `orientedAngle` | Calculates the oriented angle between two vectors | `missing` |
| `copy` | Copies a vector, matrix, or quaternion | `missing` |
| `sub` | Subtracts two vectors | `implemented` |
| `sub_eq` | Subtracts and assigns | `diverged` |
| `add` | Adds two vectors | `implemented` |
| `add_eq` | Adds and assigns | `diverged` |
| `div` | Divides a vector by a scalar | `implemented` |
| `div_eq` | Divides and assigns | `diverged` |
| `mul` | Multiplies a vector by a scalar or two matrices | `implemented` |
| `eql_epsilon` | Epsilon equality comparison | `deprecated` |
| `eql` | Strict equality comparison | `deprecated` |
| `mul_eq` | Multiplies and assigns | `diverged` |
| `toMat4` | Converts a quaternion to a 4x4 matrix | `missing` |
| `vendor` | Returns the underlying vendor library | `deprecated` |
