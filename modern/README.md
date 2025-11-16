# Modern `glm-js` Implementation

This directory contains a complete, ground-up rewrite of the `glm-js` library using modern ES6+ JavaScript. It is designed to be a drop-in replacement for the original, offering the same API while being more modular and maintainable.

## Architecture

-   **`implementation/`**: Contains the source code for the new library.
    -   `vec.js`: `vec2`, `vec3`, and `vec4` classes.
    -   `mat.js`: `mat3` and `mat4` classes.
    -   `quat.js`: `quat` class and related functions.
    -   `index.js`: The main entry point that aggregates and exports the `glm` object.
-   **`tests/`**: Contains a generalized test suite that can be run against any `glm-js` implementation.
-   **`TODO.md`**: A list of potential future enhancements, such as build tooling and linters.
-   **`GLMenetics.md`**: A detailed manifest of the library's API, its alignment with GLM C++/GLSL, and the current modernization status. This is the best place to start for a deep understanding of the library.

## Running the Tests

**Note:** Running the tests requires Node.js version 20.6.0 or higher.

The test suite in `modern/tests/` is implementation-agnostic. It uses a loader that can be configured via an environment variable to target different versions of the library.

### Testing the New Implementation

To run the tests against the new modern implementation, simply navigate to the test directory and run the native Node.js test runner:

```bash
cd modern/tests
node --test
```

### Testing the Original (Legacy) Implementation

As a "memorial," the original `test-modern` directory has been preserved as a test forwarder. Running the test command from that directory will execute the *new* generalized test suite against the *original* `build/glm-js.three.js` implementation.

```bash
cd test-modern
npm test
```

This setup ensures that the new implementation remains a true, drop-in replacement for the original by verifying that the exact same test suite passes against both.
