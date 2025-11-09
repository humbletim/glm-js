### GLM-JS API Blueprint (The "Contract")

This blueprint defines the glm-js surface area that must be supported, based on `test/test.js` and `glm.common.js`.

#### 1. Constructors & Initialization
The API must support functional instantiation (no `new` required) with variadic arguments.

* **Empty Init (Identity/Zero):** `glm.vec3()` → `[0, 0, 0]`, `glm.mat4()` → Identity matrix.
* **Scalar Init:** `glm.vec4(1)` → `[1, 1, 1, 1]`, `glm.mat4(2)` → Diagonal scaled matrix.
* **Component Init:** `glm.vec3(1, 2, 3)`.
* **Copy/Demotion/Promotion Init:**
    * `glm.vec4(glm.vec3(1, 2, 3), 4)` → `[1, 2, 3, 4]`.
    * `glm.vec2(glm.vec4(1, 2, 3, 4))` → `[1, 2]` (demotion).

#### 2. The "Operator Sugar" (Critical for drop-in compatibility)
Your tests heavily rely on string-based operator emulation. The new implementation must provide these methods on the prototype.

* **Arithmetic:** `['+']`, `['-']`, `['*']`, `['/']`.
    * *Vector-Vector:* `glm.vec4(1,0,0,0)['+'](glm.vec4(0,2,0,0))`.
    * *Vector-Scalar:* `glm.vec4(10)['/'](2)`.
    * *Matrix-Vector:* `mat4['*'](vec4)` (transforms the vector).
    * *Matrix-Matrix:* `mat4['*'](mat4)` (multiplication).
* **In-Place Assignment operators:** `['+=']`, `['-='],` `['*=']`, `['/=']`.
    * Example: `v['+='](glm.vec3(10))` must mutate `v` and return it.
* **Equality:** `['==']` (exact) and `['~=']` (epsilon approximate).

#### 3. Accessors & Swizzling
Support for GLSL-style component access.

* **Basic Properties:** `.x`, `.y`, `.z`, `.w` AND `.r`, `.g`, `.b`, `.a` AND `.s`, `.t`, `.p`, `.q`.
* **Read Swizzles:** `.xyz` returns a *new* `vec3`, `.yx` returns a *new* `vec2`.
* **Write Swizzles:** Ability to assign to a swizzle view.
    * `v.xy = v.zw`.
    * `v.yz = [8, 9]` (accepting standard JS arrays on assignment).

#### 4. Core Math Library (Top-Level)
Standard GLM functions must be exposed at the top level and accept your vector/matrix types.

* **Transformations:** `glm.translate(m4, v3)`, `glm.rotate(m4, angle, axisV3)`, `glm.scale(m4, v3)`, `glm.lookAt(eye, center, up)`, `glm.perspective(fov, aspect, near, far)`, `glm.ortho(left, right, bottom, top, near, far)`.
* **Vector Math:** `glm.dot(v1, v2)`, `glm.cross(v1, v2)`, `glm.normalize(v)`, `glm.distance(v1, v2)`, `glm.length(v)`.
* **Utilities:** `glm.mix(v1, v2, t)`, `glm.clamp(v, min, max)`, `glm.radians(deg)`, `glm.degrees(rad)`.

#### 5. Types
The tests confirm support for these types:
* **Float:** `vec2`, `vec3`, `vec4`, `mat3`, `mat4`, `quat`.
* **Other:** `uvecN`, `ivecN`, `bvecN` (unsigned, integer, boolean variants).
