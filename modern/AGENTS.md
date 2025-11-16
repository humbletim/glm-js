# Agent Insights

This file contains insights and suggestions for agents working on this repository.

## Modernization Scope and Status

For a complete and detailed breakdown of the modernization effort, including the status of all API features, dissonances between legacy and modern implementations, and alignment with GLM C++/GLSL, please refer to the **[GLMenetics API manifest](./GLMenetics.md)**. That file is the single source of truth for the API.

This document will now focus on higher-level insights, known issues, and future development ideas.

## Observed Bugs

The following bugs have been observed in the modern implementation. Please see `GLMenetics.md` for the specific API functions affected.

*   **`mix` function:** The `mix` function is not working correctly for scalars and vectors.
*   **`clamp` function:** The `clamp` function is not working correctly for scalars.
*   **`slerp` function:** There are minor floating point differences in the `slerp` function for quaternions.
*   **`ortho` function:** The `ortho` function is not producing the correct matrix.
*   **`perspective` function:** The `perspective` function is not producing the correct matrix.
*   **`lookAt` function:** The `lookAt` function is not producing the correct matrix.

## Well Known Dissonances

The following are known dissonances between the legacy (`Dusk`), modern CJS (`Day`), and modern ESM (`Dawn`) implementations. These are also documented in `GLMenetics.md`.

*   **`eulerAngles`:** `Dusk` returns positive values, while `Day` and `Dawn` return negative values for the same quaternion.
*   **`quat.inverse` (zero-length):** `Dusk` returns `[-0, -0, -0, 0]`, while `Day` and `Dawn` return `[0, 0, 0, 1]` (the identity quaternion).

## Legacy Test Suite Coupling

The following legacy tests are too tightly coupled with the old implementation and should be modernized:

*   **`glm common .$rebindTypedArrays`:** This test relies on the internal implementation of the `mat4` constructor.
*   **`glm common $subarray .subarray`:** This test uses a non-standard assignment operator.
*   **`glm meta swizzles`:** This test relies on the `copy` method, which is not part of the modern API.
*   **`glm mat3 core operations`:** This test relies on the `copy` method, which is not part of the modern API.
*   **`glm mat3 clone`:** This test relies on the `clone` method, which is not part of the modern API.

## Agent Ideas

This section is for brainstorming and capturing new ideas for future agent-led development sprints.

### Visualization Debates

The following are ideas for future visual "tri-debate" scripts, similar to the ray-tracer debate. These can be used to visually verify the correctness of the modern implementation and identify any remaining dissonances.

*   **Mandelbrot Set Explorer:** A classic fractal that can be generated using complex number arithmetic. This would be a good test of the vector and matrix operations in `glm-js`.
*   **Simple Particle System:** A system of particles that are affected by gravity and other forces. This would be a good test of the physics-related functions in `glm-js`, such as `dot`, `cross`, and `normalize`.
*   **Procedural Terrain Generator:** A script that generates a 3D terrain using noise functions. This would be a good test of the `noise` functions in `glm-js`, as well as the vector and matrix operations.
*   **OBJ Model Viewer:** A simple viewer for `.obj` files. This would be a good test of the transformation functions in `glm-js`, such as `translate`, `rotate`, and `scale`.
