// modern/implementation/swizzle.js

// This is a simplified swizzle implementation for demonstration.
// A production-ready version would generate all permutations.

const componentMap = { 'x': 0, 'y': 1, 'z': 2, 'w': 3 };

function applySwizzling(vecClass, vec2, vec3, vec4) {
    const instance = new vecClass();
    const components = ['x', 'y', 'z', 'w'].slice(0, instance.elements.length);

    // Read operations
    for (const c1 of components) {
        Object.defineProperty(vecClass.prototype, c1, {
            get: function() { return this.elements[componentMap[c1]]; },
            set: function(val) { this.elements[componentMap[c1]] = val; }
        });

        for (const c2 of components) {
            const prop = c1 + c2;
            Object.defineProperty(vecClass.prototype, prop, {
                get: function() {
                    return new vec2(this.elements[componentMap[c1]], this.elements[componentMap[c2]]);
                },
                set: function(val) {
                    this.elements[componentMap[c1]] = val.elements ? val.elements[0] : val[0];
                    this.elements[componentMap[c2]] = val.elements ? val.elements[1] : val[1];
                }
            });

            for (const c3 of components) {
                 const prop = c1 + c2 + c3;
                 Object.defineProperty(vecClass.prototype, prop, {
                    get: function() {
                        return new vec3(this.elements[componentMap[c1]], this.elements[componentMap[c2]], this.elements[componentMap[c3]]);
                    },
                    set: function(val) {
                        this.elements[componentMap[c1]] = val.elements ? val.elements[0] : val[0];
                        this.elements[componentMap[c2]] = val.elements ? val.elements[1] : val[1];
                        this.elements[componentMap[c3]] = val.elements ? val.elements[2] : val[2];
                    }
                });
            }
        }
    }
}


export { applySwizzling };
