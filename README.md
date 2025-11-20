# glm-js: A Tribute to GLM

This repository is a modern, ES6+ rewrite of the `glm-js` library. It's not just a port; it's a tribute.

Think of it as a faithful "tribute band" to the originals: the highly-respected [C++ OpenGL Mathematics (GLM)](http://glm.g-truc.net/) library and the [OpenGL Shading Language (GLSL)](https://www.opengl.org/documentation/glsl/) itself. The goal is to capture their spirit and ergonomics, providing a familiar mental model for anyone working with 3D math in JavaScript.

This philosophy is what we call **"GLMenetics"**: a dedication to the semantic and spiritual alignment between the GPU (GLSL), the CPU (C++), and the JavaScript runtime.

## Project Status & Philosophy

This is a solo-maintained, "source-open" project. The code is open for you to use, learn from, and fork, but we are not actively seeking contributions via pull requests. This allows the project to maintain a singular, focused vision. For more details, please see our [CONTRIBUTING.md](./CONTRIBUTING.md) guide.

The modernization effort is ongoing, and while many features are complete, some are still a work in progress or have known bugs. For a complete, transparent, and deeply detailed breakdown of the API, its alignment with C++/GLSL, and the current status of every function, please consult the **[GLMenetics API manifest](./GLMenetics.md)**. It is the single source of truth for this library.

## Key Documents

-   **[README.md](./README.md)** (You are here): The high-level vision and philosophy.
-   **[SUMMARY.md](./SUMMARY.md)**: A human-friendly executive summary of the project.
-   **[GLMenetics.md](./GLMenetics.md)**: The detailed, canonical API manifest and status.
-   **[CONTRIBUTING.md](./CONTRIBUTING.md)**: The project's "social contract" and contribution guidelines.
-   **[LEGACY.md](./LEGACY.md)**: A high-level checklist of the original library's features.

## Installation

This package is not yet available on NPM. To use it, you can clone the repository and link it to your project.

## Usage

The library is an ES6 module. You can import the default `glm` object like so:

```javascript
import glm from './implementation/index.js';

// Create a vec3
const v = glm.vec3(1, 0, 0);

// Create a mat4
const m = glm.mat4(1.0);

// Rotate the matrix
const rotated = glm.rotate(m, glm.radians(90), glm.vec3(0, 0, 1));
```

## Running Tests

**Note:** Running the tests requires Node.js version 20.6.0 or higher.

The modern test suite is located in the `tests/` directory and uses the native Node.js test runner.

```bash
npm test
```

To run "debate" scripts, which compare the behavior of different library versions side-by-side, set the `RUN_DEBATE` environment variable:

```bash
RUN_DEBATE=1 npm test
```
