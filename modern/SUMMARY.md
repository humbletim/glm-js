# glm-js: Modern ES6 Implementation

This document provides a high-level overview of the modern, ES6-based implementation of `glm-js`, a JavaScript library for 3D mathematics inspired by GLM.

## Core Concepts

The modern `glm-js` library is designed to be a lightweight, zero-dependency, and high-performance library for 3D graphics applications. It is written in modern JavaScript and is intended to be a drop-in replacement for the original `glm-js` library.

### Key Features

*   **ES6 Modules:** The library is written using ES6 modules, making it easy to integrate into modern JavaScript projects.
*   **Zero Dependencies:** The library has no external dependencies, making it lightweight and easy to use.
*   **GLSL-like Syntax:** The library's API is designed to be similar to GLSL, making it familiar to graphics programmers.
*   **Operator Overloading:** The library uses operator overloading to provide a more intuitive and expressive API.

## Implemented Features

The following features have been implemented in the modern `glm-js` library:

*   **Vectors:** `vec2`, `vec3`, `vec4`
*   **Matrices:** `mat3`, `mat4`
*   **Quaternions:** `quat`
*   **Core Functions:**
    *   `normalize`
    *   `distance`
    *   `length`
    *   `length2`
    *   `mix`
    *   `clamp`
    *   `angleAxis`
    *   `rotate`
    *   `scale`
    *   `translate`
    *   `cross`
    *   `dot`
    *   `epsilon`
    *   `inverse`
    *   `transpose`
    *   `slerp`
    *   `lookAt`
    *   `perspective`
    *   `ortho`
    *   `degrees`
    *   `radians`
*   `angle`
*   `axis`
*   `diagonal4x4`
*   `diagonal3x3`
*   `roll`
*   `pitch`
*   `yaw`
*   `eulerAngles`
*   `project`
*   `unProject`
*   `min`
*   `max`
*   `abs`
*   `fract`
*   `all`
*   `sign`
*   `frexp`
*   `rotation`
*   `to_string`

## Unimplemented Features

The following features from the legacy `glm-js` library have not yet been implemented in the modern version.

### Missing Core Functions

*   `sqrt`
*   `euler`
*   `ldexp`
*   `orientedAngle`
*   `copy`
*   `toMat4`

### Missing Vector and Matrix Types

*   `uvec2`, `uvec3`, `uvec4`
*   `ivec2`, `ivec3`, `ivec4`
*   `bvec2`, `bvec3`, `bvec4`


## Feature Completion Status

A feature is considered "done" when it meets the following three criteria:

1.  **Legacy Test Suite Compliance:** The feature passes all relevant tests in the legacy test suite.
2.  **GLM-CPP/GLSL Alignment:** The feature's behavior aligns with the conventions of the C++ GLM library.
3.  **Modern Test Suite Coverage:** The feature has comprehensive test coverage in the modern test suite.

### Completed Features

As of this analysis, no features have been identified that meet all three criteria for completion. The modern test suite is still under development, and several features have known bugs or are missing functionality. This section will be updated as features are completed.
