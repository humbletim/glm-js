// src-wasm/glm-wasm-loader.js

(function(Module) {
    'use strict';

    const init_promise = new Promise(resolve => {
        const originalOnRuntimeInitialized = Module.onRuntimeInitialized;
        Module.onRuntimeInitialized = () => {
            if (originalOnRuntimeInitialized) {
                originalOnRuntimeInitialized();
            }

            function createV(C, V) {
              const VC = function(...args) {
                  // This allows for copy-constructor-like behavior, e.g. glm.vec2(v1)
                  if (args.length === 1 && (args[0] instanceof V || args[0] instanceof VC)) {
                      return args[0].clone();
                  }
                  // Allow calling as a function, which will return a new instance
                  return new V(...args);
              }
              // Make `new glm.vec2()` work, and `instanceof glm.vec2`
              VC.prototype = V.prototype;
              Object.defineProperty(VC, 'name', { value: C });
              return VC;
            }

            const V2 = Module.vec2;
            const V3 = Module.vec3;
            const V4 = Module.vec4;
            const M3 = Module.mat3;
            const M4 = Module.mat4;

            Module.vec2 = createV('vec2', V2);
            Module.vec3 = createV('vec3', V3);
            Module.vec4 = createV('vec4', V4);
            Module.mat3 = createV('mat3', M3);
            Module.mat4 = createV('mat4', M4);

            // Operator-like methods
            var originalVec2Proto = V2.prototype;
            originalVec2Proto['+'] = originalVec2Proto.add;
            originalVec2Proto['-'] = originalVec2Proto.sub;
            originalVec2Proto['*'] = originalVec2Proto.mul;
            originalVec2Proto['/'] = originalVec2Proto.div;

            var originalVec3Proto = V3.prototype;
            originalVec3Proto['+'] = originalVec3Proto.add;
            originalVec3Proto['-'] = originalVec3Proto.sub;
            originalVec3Proto['*'] = originalVec3Proto.mul;
            originalVec3Proto['/'] = originalVec3Proto.div;

            var originalVec4Proto = V4.prototype;
            originalVec4Proto['+'] = originalVec4Proto.add;
            originalVec4Proto['-'] = originalVec4Proto.sub;
            originalVec4Proto['*'] = originalVec4Proto.mul;
            originalVec4Proto['/'] = originalVec4Proto.div;

            resolve(Module);
        };
    });

    Module.init = () => init_promise;

})(Module);
