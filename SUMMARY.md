# Summary: The `glm-js` Tribute Project

This document provides a high-level executive summary of the `glm-js` project.

## The Philosophy: "GLMenetics"

`glm-js` is a modern JavaScript library for 3D mathematics. It is designed as a "tribute" to the highly respected C++ OpenGL Mathematics (GLM) library and the OpenGL Shading Language (GLSL).

The core philosophy, or **"GLMenetics,"** is to create a spiritual and semantic alignment between the math code you write in JavaScript and the code you would write in C++ or on the GPU. This provides a familiar, intuitive, and powerful mental model for graphics programming.

## Project Structure and Status

The repository is structured to prioritize the modern, ES6+ implementation while preserving the original `glm-js` for historical and comparative purposes.

-   **Modern Implementation (`/implementation`):** A ground-up rewrite using modern JavaScript. This is the focus of all current and future development.
-   **Legacy `glm-js` (`/legacy`):** The original library and its test suite, memorialized in a self-contained directory. It serves as a valuable "mentor" and reference point, but is not the ultimate source of truth.

The modernization is an ongoing effort. For the most detailed, up-to-date, and canonical information on the status of every API function, please refer to our comprehensive manifest.

## Navigating the Documentation

We have structured our documentation to guide you based on your needs:

-   **For the vision and philosophy:** Start with the [**README.md**](./README.md). It's the "album cover" and sets the stage for the project.
-   **For the deep technical details:** Consult the [**GLMenetics.md**](./GLMenetics.md). This is the definitive manifest of the entire API surface, its status, and its alignment with C++/GLSL ("Spirit").
-   **For contribution guidelines:** Please read our [**CONTRIBUTING.md**](./CONTRIBUTING.md) to understand our "source-open" development model.
