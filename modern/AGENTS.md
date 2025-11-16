# Agent Insights

This file contains insights and suggestions for agents working on this repository.

## Modernization Scope

The following is a refined summary of the remaining work required to modernize the `glm-js` library.

### High-Priority 1:1 GLM-CPP Methods

These are core GLM features that are missing from the modern implementation. They are essential for achieving parity with the C++ GLM library.

*   **`toString` for all vector and matrix types:** The `toString` method is used extensively in the tests for debugging and verification. Implementing this feature will help to resolve a large number of failing tests.
*   **Vector and Matrix Constructors:** The constructors for `vec2`, `vec3`, `vec4`, `mat3`, and `mat4` need to be able to handle a wider range of input types, including single numeric values and other vector/matrix types.
*   **Core Functions:** The following core functions are missing and should be implemented:
    *   `min`
    *   `max`
    *   `abs`
    *   `fract`
    *   `all`
    *   `sign`
    *   `frexp`
    *   `rotation`

### Lower-Priority Features

These features are part of the GLM API but are less critical for typical use cases. They should be implemented after the high-priority features.

*   **`uvec`, `ivec`, and `bvec` types:** The unsigned, integer, and boolean vector types are used in several tests and are a core part of the GLM API. However, their use in JavaScript is less common, so they are a lower priority.
*   **Buffer-related functions:** The `make_*` and `$vectorType` functions are used for creating and manipulating buffers of vectors and matrices. These are advanced features that are not essential for most users.

### Legacy-Specific Functionalities

These features are specific to the legacy `glm-js` implementation and may not be a good fit for the modern library. They should be considered for deprecation.

*   **`$toFixedString`:** This function is used for formatting floating-point numbers to a fixed precision, which is important for ensuring consistent output in the tests. However, it is not a standard GLM feature and could be replaced with a more modern approach.
*   **`$outer`:** This is an internal function that is not part of the public API. It should not be included in the modern implementation.
*   **`$template`:** This is an internal function that is not part of the public API. It should not be included in the modern implementation.
*   **`$dumpTypes`:** This is an internal function that is not part of the public API. It should not be included in the modern implementation.
*   **`$partition`:** This is an internal function that is not part of the public API. It should not be included in the modern implementation.

### Observed Bugs

The following bugs have been observed in the modern implementation:

*   **`mix` function:** The `mix` function is not working correctly for scalars and vectors.
*   **`clamp` function:** The `clamp` function is not working correctly for scalars.
*   **`slerp` function:** The `slerp` function is not working correctly for quaternions.
*   **`ortho` function:** The `ortho` function is not producing the correct matrix.
*   **`perspective` function:** The `perspective` function is not producing the correct matrix.
*   **`lookAt` function:** The `lookAt` function is not producing the correct matrix.

### Legacy Test Suite Coupling

The following legacy tests are too tightly coupled with the old implementation and should be modernized:

*   **`glm common .$rebindTypedArrays`:** This test relies on the internal implementation of the `mat4` constructor.
*   **`glm common $subarray .subarray`:** This test uses a non-standard assignment operator.
*   **`glm meta swizzles`:** This test relies on the `copy` method, which is not part of the modern API.
*   **`glm mat3 core operations`:** This test relies on the `copy` method, which is not part of the modern API.
*   **`glm mat3 clone`:** This test relies on the `clone` method, which is not part of the modern API.

## Well Known Dissonances

The following are known dissonances between the legacy (`Dusk`), modern CJS (`Day`), and modern ESM (`Dawn`) implementations.

*   **`eulerAngles`:** `Dusk` returns positive values, while `Day` and `Dawn` return negative values for the same quaternion. This is likely due to a difference in the underlying mathematical implementation of the `eulerAngles` function.
*   **`quat` constructor:** All three implementations (`Dusk`, `Day`, and `Dawn`) correctly use the `(w, x, y, z)` constructor signature, with an internal memory layout of `[x, y, z, w]`. The previous documentation stating otherwise was incorrect.
*   **`quat.inverse` (zero-length):** `Dusk` returns `[-0, -0, -0, 0]`, while `Day` and `Dawn` return `[0, 0, 0, 1]` (the identity quaternion). The modern implementation's behavior is generally considered more desirable, as it avoids division by zero and returns a sensible default.
*   **`quat.slerp` (zero-length and close quaternions):** There are minor floating point differences between the `Dusk` and `Day`/`Dawn` implementations. These are likely due to differences in the underlying mathematical implementations and are not considered to be a major issue.

## Agent Ideas

This section is for brainstorming and capturing new ideas for future agent-led development sprints.

### Visualization Debates

The following are ideas for future visual "tri-debate" scripts, similar to the ray-tracer debate. These can be used to visually verify the correctness of the modern implementation and identify any remaining dissonances.

*   **Mandelbrot Set Explorer:** A classic fractal that can be generated using complex number arithmetic. This would be a good test of the vector and matrix operations in `glm-js`.
*   **Simple Particle System:** A system of particles that are affected by gravity and other forces. This would be a good test of the physics-related functions in `glm-js`, such as `dot`, `cross`, and `normalize`.
*   **Procedural Terrain Generator:** A script that generates a 3D terrain using noise functions. This would be a good test of the `noise` functions in `glm-js`, as well as the vector and matrix operations.
*   **OBJ Model Viewer:** A simple viewer for `.obj` files. This would be a good test of the transformation functions in `glm-js`, such as `translate`, `rotate`, and `scale`.
