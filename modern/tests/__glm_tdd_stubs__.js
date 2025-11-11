
    // Stub out the legacy "$" functions
    glm.$log = console.log.bind(console, '[glm.$log]');
    glm.$to_string = (obj) => String(obj);
    glm.$to_glsl = (obj) => String(obj);
    glm.$to_array = (obj) => Array.from(obj.elements);
    glm.$vectorType = () => {};
    glm.$toTypedArray = () => {};
    glm.$subarray = (arr, begin, end) => arr.subarray(begin, end);
    glm.$outer = {
        console: console
    };
    glm.$reset_logging = () => {};
    glm.$sizeof = () => 0;
    glm.$isGLMConstructor = () => true;
    glm.$isGLMObject = () => true;
    glm.$typeof = () => 'vec';
    glm.$getGLMType = () => {};
    glm.$rebindTypedArrays = () => {};
    glm.$to_object = () => ({});
    glm.$to_json = () => '{}';
    glm.$inspect = () => '{}';
    glm.$from_glsl = () => {};
    glm.version = '1.0.0';
    glm.vendor = {
        vendor_version: '1.0.0'
    };
