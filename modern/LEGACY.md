# Legacy API Modernization Checklist

This document tracks the effort to modernize the original `glm-js` API. For a detailed breakdown of each feature, including implementation status, known dissonances, and alignment with GLM C++/GLSL, please refer to the [GLMenetics API manifest](./GLMenetics.md).

The table below provides a high-level overview of the modernization status of the legacy API surface.

| API | Status | Notes |
|---|---|---|
| `version` | `❌ Missing` | |
| `normalize` | `✅ Implemented` | |
| `inverse` | `✅ Implemented` | |
| `distance` | `✅ Implemented` | |
| `length` | `✅ Implemented` | |
| `length2` | `❌ Missing` | |
| `transpose` | `✅ Implemented` | |
| `slerp` | `⚠️ Partially Implemented` | See `GLMenetics.md` for details on floating point differences. |
| `mix` | `⚠️ Partially Implemented` | See `GLMenetics.md` for details on scalar/vector bugs. |
| `clamp` | `⚠️ Partially Implemented` | See `GLMenetics.md` for details on scalar bugs. |
| `angleAxis` | `✅ Implemented` | |
| `rotate` | `✅ Implemented` | |
| `scale` | `✅ Implemented` | |
| `translate` | `✅ Implemented` | |
| `lookAt` | `⚠️ Partially Implemented` | Produces an incorrect matrix. |
| `cross` | `✅ Implemented` | |
| `dot` | `✅ Implemented` | |
| `perspective` | `⚠️ Partially Implemented` | Produces an incorrect matrix. |
| `ortho` | `⚠️ Partially Implemented` | Produces an incorrect matrix. |
| `angle` | `✅ Implemented` | |
| `axis` | `✅ Implemented` | |
| `make_*` | `➡️ Diverged` | Buffer creation is handled differently in the modern API. |
| `diagonal*` | `✅ Implemented` | |
| `to_string` | `✅ Implemented` | |
| `sqrt` | `❌ Missing` | |
| `epsilon` | `✅ Implemented` | |
| `euler` | `❌ Missing` | |
| `eulerAngles` | `➡️ Diverged` | See `GLMenetics.md` for details on return value differences. |
| `constants` | `✅ Implemented` | Mathematical constants like `pi`. |
| `epsilonEqual` | `✅ Implemented` | |
| `degrees` | `✅ Implemented` | |
| `radians` | `✅ Implemented` | |
| `sign` | `✅ Implemented` | |
| `abs` | `✅ Implemented` | |
| `fract` | `✅ Implemented` | |
| `all` | `✅ Implemented` | |
| `roll` | `✅ Implemented` | |
| `pitch` | `✅ Implemented` | |
| `yaw` | `✅ Implemented` | |
| `frexp` | `✅ Implemented` | |
| `ldexp` | `❌ Missing` | |
| `string` | `❌ Missing` | Alias for `to_string`. |
| `number` | `🚫 Deprecated` | |
| `boolean` | `🚫 Deprecated` | |
| `*vec*` | `✅ Implemented` | Core vector types. |
| `uvec*` | `❌ Missing` | |
| `ivec*` | `❌ Missing` | |
| `bvec*` | `❌ Missing` | |
| `mat*` | `✅ Implemented` | Core matrix types. |
| `quat` | `✅ Implemented` | |
| `using_namespace` | `🚫 Deprecated` | |
| `min` | `✅ Implemented` | |
| `max` | `✅ Implemented` | |
| `equal` | `✅ Implemented` | |
| `rotation` | `✅ Implemented` | |
| `project` | `✅ Implemented` | |
| `unProject` | `✅ Implemented` | |
| `orientedAngle` | `❌ Missing` | |
| `copy` | `➡️ Diverged` | Replaced by `.clone()` method. |
| `*_eq` | `➡️ Diverged` | Replaced by standard operators. |
| `toMat4` | `❌ Missing` | |
| `vendor` | `🚫 Deprecated` | |
