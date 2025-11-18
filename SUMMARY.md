# glm-js: Modern ES6 Implementation

This document provides a high-level overview of the modern, ES6-based implementation of `glm-js`, a JavaScript library for 3D mathematics inspired by GLM.

## Core Concepts

The modern `glm-js` library is designed to be a lightweight, zero-dependency, and high-performance library for 3D graphics applications. It is written in modern JavaScript and is intended to be a drop-in replacement for the original `glm-js` library.

### Key Features

*   **ES6 Modules:** The library is written using ES6 modules, making it easy to integrate into modern JavaScript projects.
*   **Zero Dependencies:** The library has no external dependencies, making it lightweight and easy to use.
*   **GLSL-like Syntax:** The library's API is designed to be similar to GLSL, making it familiar to graphics programmers.
*   **Operator Overloading:** The library uses operator overloading to provide a more intuitive and expressive API.

## API and Feature Status

For a comprehensive breakdown of the API, including implementation status, dissonances between legacy and modern versions, and alignment with the GLM C++/GLSL standards, please see the definitive manifest:

**[./GLMenetics.md](./GLMenetics.md)**

## Feature Completion Criteria

A feature is considered "done" when it meets the following three criteria:

1.  **Legacy Test Suite Compliance:** The feature passes all relevant tests in the legacy test suite.
2.  **GLM-CPP/GLSL Alignment:** The feature's behavior aligns with the conventions of the C++ GLM library.
3.  **Modern Test Suite Coverage:** The feature has comprehensive test coverage in the modern test suite.
