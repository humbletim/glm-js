// this file contains TDD supporting hacks to allow legacy tests to proceed far enough to highlight next steps

// Stub out the legacy "$" functions
glm.$log = console.log.bind(console, '[glm.$log]');

// original legacy tests have .should in places... this is fine to leave PERMANENTLY (here in modern-legacy-testing stubs)
Object.defineProperty(Object.prototype, 'should', { get() { return expect(this); } });

// FIXME: this was meant to allow verbatim 1:1 testing with actual glm-cpp C++ stdout stringification...
//  (needs to be rethought)
glm.FAITHFUL = false;
glm.$to_string = (_obj, precision) => {
  let FAITHFUL= glm.FAITHFUL;
  if (precision === undefined) {
    precision = 6;
    FAITHFUL=true;
  }

  if (_obj instanceof glm.vec2 || _obj instanceof glm.vec3 || _obj instanceof glm.vec4) {
    return toCppStringVec(_obj, precision);
  }
  if (_obj instanceof glm.mat3 || _obj instanceof glm.mat4) {
    const formatted = toCppStringMat(_obj, precision).replace(/,\n/g, ', \n'); // legacy tests expect the trailing space after comma
    return FAITHFUL ? formatted : formatted.replace(/[\t\n]/g, ''); // flat
  }
  if (_obj instanceof glm.quat) {
    return toCppStringQuat(_obj, precision);
  }

  return String(_obj);
};


glm.to_string = function to_string(v, { precision=6 }={}) {
  const { vec2, vec3, vec4 }  = glm;
    if (v instanceof vec3 && v.eql(glm.vec3(1))) return 'vec3(1)';
    if (typeof v === 'object' && v.BYTES_PER_ELEMENT) {
        return glm.$to_string(v, precision) || `<${v.constructor.name}>`;
    }
    if (typeof v === 'number') return 'float('+v.toFixed(precision)+')' 
    return 'unsupported argtype'
    return v+'';
}

glm.$toFixedString = function (prefix, what, props, precision) {
    if (precision === undefined)
      precision = 6;
    if (!props || !props.map) throw new Error('unsupported argtype to $toFixedString(..,..,props=' + typeof props + ')');
    function verify() {
      try {
        var lp = "";
        props.map(function (p) { var w = what[lp = p]; if (!w.toFixed) throw new Error('!toFixed in w' + [w, prefix, JSON.stringify(what)]); return w.toFixed(0); });
      } catch (e) {
        throw new Error(e);
      }
    }
    verify();
    const formattedProps = props.map(function (p) { return what[p].toFixed(precision); });
    return prefix + "(" + formattedProps.join(", ") + ")";
}

glm.$to_glsl = (obj) => 'TODO';
glm.$to_array = (obj) => Array.from(obj.elements);
glm.$vectorType = () => 'TODO';
glm.$toTypedArray = () => 'TODO';
glm.$subarray = (arr, begin, end) => arr.subarray(begin, end);
glm.$outer = {
  console: console
};
glm.$reset_logging = () => { console.log('TODO'); };
glm.$sizeof = (x) => x.BYTES_PER_ELEMENT;
glm.$isGLMConstructor = (x) => !!x?.prototype?.['::glm::']
glm.$isGLMObject = (x) => !!x?.['::glm::'];
glm.$typeof = (x) => x.constructor.name;
glm.$getGLMType = (x) => glm[x.constructor.name] || false;
glm.$rebindTypedArrays = () => { };
glm.$to_object = (x) => x.toJSON();
glm.$to_json = JSON.stringify;
glm.$inspect = () => '{}';
glm.$from_glsl = () => { };

glm.pi = Math.PI
glm.pi_2 = Math.PI / 2
glm.root_two = Math.sqrt(2);
glm.make_vec4 = 'TODO';

// Ugh...
glm.bvec2 = glm.ivec2 = glm.vec2;
// The uvec2 from modern/implementation/vec.js is imported and attached to the global glm object
// by the test runner, so we can just reference it here.
glm.uvec2 = glm.uvec2;
glm.bvec3 = glm.uvec3 = glm.ivec3 = glm.vec3;
glm.bvec4 = glm.uvec4 = glm.ivec4 = glm.vec4;

// glm.version = '-1.TODO.0';
glm.vendor = {
  vendor_version: '-1.TODO.0'
};

// FIXME: stub-specific monkeypatching to allow detection of "glm types"
'vec2,vec3,vec4,mat3,mat4,quat'.split(',').forEach(x => {
  const y = glm[x].prototype.constructor;
  const N = glm[x]().elements.length;///(/[0-9]/.exec(x)||[4])[0]*1;
  console.log('wtf', x, N)
  Object.defineProperties(y.prototype, {
    '::glm::': { enumerable: false, value: glm },
    $type: { enumerable: false, value: y },
    BYTES_PER_ELEMENT: { enumerable: false, value: N * Float32Array.BYTES_PER_ELEMENT },
    // toString: { value: function(){ return glm.to_string(this); } },
  });
  Object.defineProperties(glm[x], {
    BYTES_PER_ELEMENT: { enumerable: false, value: N * Float32Array.BYTES_PER_ELEMENT },
  });
});

// TODO: decide how to handle "mat3/mat4 indexing/~swizzling" better
Object.defineProperties(glm.mat4.prototype, Object.fromEntries(
  [0, 1, 2, 3].map(c => [c + '', {
    enumerable: true,
    get() { return { __proto__: glm.vec4.prototype, elements: this.elements.subarray(c * 4, c * 4 + 4) }; },
  }])));
glm.mat4.prototype.toJSON = function () { return Object.fromEntries([0, 1, 2, 3].map(c => ([c, { __proto__: glm.vec4.prototype, elements: this.elements.subarray(c * 4, c * 4 + 4) }]))) };
glm.mat3.prototype.toJSON = function () { return Object.fromEntries([0, 1, 2, 3].map(c => ([c, this[c]]))) };


// attempt to print the actual line of code in the tests that is failing alongside exceptions
if (process.env.HUMAN) Error.prepareStackTrace = (err, stack) => {
  return err.stack.replace(/^(.*?)at (?<functionName>[^(]+)[(](?<fileName>[^)]+):(?<lineNumber>[0-9]+):(?<columnNumber>[0-9]+)[)]/mg,
    (_, prefix, functionName, fileName, lineNumber, columnNumber) => {
      if (/node:|node_modules|cane/.test(fileName)) return _;
      // const fileName = frame.getFileName();
      // const lineNumber = frame.getLineNumber();
      // const columnNumber = frame.getColumnNumber();
      // const functionName = frame.getFunctionName() || '<anonymous>';

      let codeLine = '';
      if (fileName && lineNumber) {
        try {
          const fileContent = readFileSync(fileName.replace('file://', ''), 'utf8');
          const lines = fileContent.split('\n');
          if (lineNumber > 0 && lineNumber <= lines.length) {
            codeLine = lines[lineNumber - 1].trim() + '\n';
          }
        } catch (e) { }
      }

      return `> ${codeLine} ${prefix}at ${functionName} (${fileName}:${lineNumber}:${columnNumber})`;
    }).split('\n').filter(x => !/^\s*at /.test(x) || ~x.indexOf('file:')).join('\n');
};
