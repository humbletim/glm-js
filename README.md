# glm-js
JavaScript adaptation of the OpenGL Mathematics (GLM) C++ library interfaces.
https://humbletim.github.io/glm-js

## Testing

### Modern Implementation

To run the test suite for the modern, ES Module-based implementation, navigate to the `modern` directory and run the test command:

```bash
cd modern
npm test
```

This will execute the test suite using the native Node.js test runner and will test the modern implementation by default.

To test the classic `glm-js` implementation, set the `GLM_IMPLEMENTATION_PATH` environment variable to the path of the classic implementation file before running the tests:

```bash
cd modern
GLM_IMPLEMENTATION_PATH=../build/glm-js.js npm test
```
