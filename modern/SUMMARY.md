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

## Unimplemented Features

The following features from the legacy `glm-js` library have not yet been implemented in the modern version.

### Missing Core Functions

*   `to_string`
*   `sqrt`
*   `euler`
*   `sign`
*   `abs`
*   `fract`
*   `all`
*   `frexp`
*   `ldexp`
*   `min`
*   `max`
*   `rotation`
*   `orientedAngle`
*   `copy`
*   `toMat4`

### Missing Vector and Matrix Types

*   `uvec2`, `uvec3`, `uvec4`
*   `ivec2`, `ivec3`, `ivec4`
*   `bvec2`, `bvec3`, `bvec4`

### Missing Mathematical Constants

*   `e`
*   `ln_ten`
*   `ln_two`
*   `pi`
*   `half_pi`
*   `quarter_pi`
*   `one_over_pi`
*   `two_over_pi`
*   `root_pi`
*   `root_two`
*   `root_three`
*   `two_over_root_pi`
*   `one_over_root_two`
