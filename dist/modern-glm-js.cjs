var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// implementation/swizzle.js
function applySwizzling(vecClass, vec22, vec33, vec42) {
  const instance = new vecClass();
  const components = ["x", "y", "z", "w"].slice(0, instance.elements.length);
  vecClass.prototype.toJSON = function() {
    return Object.fromEntries(components.map((c) => [c, this[c]]));
  };
  for (const c1 of components) {
    Object.defineProperty(vecClass.prototype, c1, {
      enumerable: true,
      get: function() {
        return this.elements[componentMap[c1]];
      },
      set: function(val) {
        this.elements[componentMap[c1]] = val;
      }
    });
    for (const c2 of components) {
      const prop = c1 + c2;
      Object.defineProperty(vecClass.prototype, prop, {
        get: function() {
          return new vec22(this.elements[componentMap[c1]], this.elements[componentMap[c2]]);
        },
        set: function(val) {
          this.elements[componentMap[c1]] = val.elements ? val.elements[0] : val[0];
          this.elements[componentMap[c2]] = val.elements ? val.elements[1] : val[1];
        }
      });
      for (const c3 of components) {
        const prop2 = c1 + c2 + c3;
        Object.defineProperty(vecClass.prototype, prop2, {
          get: function() {
            return new vec33(this.elements[componentMap[c1]], this.elements[componentMap[c2]], this.elements[componentMap[c3]]);
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
var componentMap;
var init_swizzle = __esm({
  "implementation/swizzle.js"() {
    componentMap = { "x": 0, "y": 1, "z": 2, "w": 3 };
  }
});

// implementation/format.js
function format(number) {
  return number.toFixed(6);
}
function toCppStringVec(vec) {
  const className = "f" + vec.constructor.name.toLowerCase();
  const elements = Array.from(vec.elements).map(format).join(", ");
  return `${className}(${elements})`;
}
function toCppStringMat(mat) {
  const className = mat.constructor.name.toLowerCase();
  const elements = Array.from(mat.elements).map(format).join(", ");
  return `${className}(${elements})`;
}
function toCppStringQuat(quat2) {
  const className = quat2.constructor.name.toLowerCase();
  const w = format(quat2.elements[3]);
  const x = format(quat2.elements[0]);
  const y = format(quat2.elements[1]);
  const z = format(quat2.elements[2]);
  return `${className}(${w}, {${x}, ${y}, ${z}})`;
}
function to_string(v) {
  if (v === null || v === void 0) {
    return "null";
  }
  if (typeof v._type !== "undefined") {
    switch (v._type) {
      case "vec":
        return toCppStringVec(v);
      case "mat":
        return toCppStringMat(v);
      case "quat":
        return toCppStringQuat(v);
      default:
        throw new Error(`Unknown GLM type: ${v._type}`);
    }
  }
  if (typeof v === "number" || typeof v === "string" || typeof v === "boolean") {
    return v.toString();
  }
  if (Array.isArray(v)) {
    return `[${v.map(to_string).join(", ")}]`;
  }
  return v.toString();
}
var init_format = __esm({
  "implementation/format.js"() {
  }
});

// implementation/base.js
var GLMBaseMixin;
var init_base = __esm({
  "implementation/base.js"() {
    init_format();
    GLMBaseMixin = (superclass) => class extends superclass {
      get array() {
        return Array.from(this.elements);
      }
      clone() {
        return new this.constructor(this);
      }
      equals(other) {
        if (this.elements.length !== other.elements.length) {
          return false;
        }
        for (let i = 0; i < this.elements.length; i++) {
          if (this.elements[i] !== other.elements[i]) {
            return false;
          }
        }
        return true;
      }
      epsilonEqual(other, epsilon = 1e-6) {
        if (this.elements.length !== other.elements.length) {
          return false;
        }
        for (let i = 0; i < this.elements.length; i++) {
          if (Math.abs(this.elements[i] - other.elements[i]) > epsilon) {
            return false;
          }
        }
        return true;
      }
      // --- Operator Aliases ---
      "+"(other) {
        return this.add(other);
      }
      "-"(other) {
        return this.sub(other);
      }
      "*"(other) {
        return this.mul(other);
      }
      "/"(other) {
        return this.div(other);
      }
      "=="(other) {
        return this.equals(other);
      }
      "~="(other) {
        return this.epsilonEqual(other);
      }
      eql(other) {
        return this.equals(other);
      }
      eql_epsilon(other, epsilon) {
        return this.epsilonEqual(other, epsilon);
      }
      ["="](other) {
        this.elements.set(other.elements);
        return this;
      }
      ["+="](other) {
        return this["="](this.add(other));
      }
      ["-="](other) {
        return this["="](this.sub(other));
      }
      ["*="](other) {
        return this["="](this.mul(other));
      }
      ["/="](other) {
        return this["="](this.div(other));
      }
      toString() {
        switch (this._type) {
          case "vec":
            return toCppStringVec(this);
          case "mat":
            return toCppStringMat(this);
          case "quat":
            return toCppStringQuat(this);
          default:
            throw new Error(`Unknown GLM type: ${this._type}`);
        }
      }
    };
  }
});

// implementation/vec.js
var vec2, vec32, vec4, uvec2;
var init_vec = __esm({
  "implementation/vec.js"() {
    init_swizzle();
    init_base();
    vec2 = class _vec2 extends GLMBaseMixin(class {
    }) {
      constructor(x, y) {
        super();
        this._type = "vec";
        Object.defineProperty(this, "elements", { value: new Float32Array(2) });
        if (x instanceof _vec2 || x instanceof vec32 || x instanceof vec4) {
          this.elements[0] = x.elements[0];
          this.elements[1] = x.elements[1];
        } else if (typeof x === "number" && y === void 0) {
          this.elements[0] = x;
          this.elements[1] = x;
        } else {
          const finalX = x || 0;
          const finalY = y === void 0 ? finalX : y || 0;
          this.elements[0] = finalX;
          this.elements[1] = finalY;
        }
        this._type = "vec";
      }
      add(other) {
        const out = new _vec2();
        out.elements[0] = this.elements[0] + other.elements[0];
        out.elements[1] = this.elements[1] + other.elements[1];
        return out;
      }
      sub(other) {
        const out = new _vec2();
        out.elements[0] = this.elements[0] - other.elements[0];
        out.elements[1] = this.elements[1] - other.elements[1];
        return out;
      }
      mul(other) {
        const out = new _vec2();
        if (typeof other === "number") {
          out.elements[0] = this.elements[0] * other;
          out.elements[1] = this.elements[1] * other;
        } else {
          out.elements[0] = this.elements[0] * other.elements[0];
          out.elements[1] = this.elements[1] * other.elements[1];
        }
        return out;
      }
      div(scalar) {
        const out = new _vec2();
        out.elements[0] = this.elements[0] / scalar;
        out.elements[1] = this.elements[1] / scalar;
        return out;
      }
      equal(other) {
        return this.elements[0] === other.elements[0] && this.elements[1] === other.elements[1];
      }
      eql(other) {
        return this.equal(other);
      }
      epsilonEqual(other) {
        const epsilon = 1e-6;
        return Math.abs(this.elements[0] - other.elements[0]) < epsilon && Math.abs(this.elements[1] - other.elements[1]) < epsilon;
      }
      eql_epsilon(other) {
        return this.epsilonEqual(other);
      }
      get array() {
        return Array.from(this.elements);
      }
    };
    vec32 = class _vec3 extends GLMBaseMixin(class {
    }) {
      constructor(x, y, z) {
        super();
        this._type = "vec";
        Object.defineProperty(this, "elements", { value: new Float32Array(3) });
        if (x instanceof _vec3 || x instanceof vec4) {
          this.elements[0] = x.elements[0];
          this.elements[1] = x.elements[1];
          this.elements[2] = x.elements[2];
        } else if (x instanceof vec2) {
          this.elements[0] = x.elements[0];
          this.elements[1] = x.elements[1];
          this.elements[2] = y || 0;
        } else if (typeof x === "number" && y === void 0) {
          this.elements[0] = x;
          this.elements[1] = x;
          this.elements[2] = x;
        } else {
          const finalX = x || 0;
          const finalY = y === void 0 ? finalX : y || 0;
          const finalZ = z === void 0 ? finalY : z || 0;
          this.elements[0] = finalX;
          this.elements[1] = finalY;
          this.elements[2] = finalZ;
        }
        this._type = "vec";
      }
      add(other) {
        const out = new _vec3();
        out.elements[0] = this.elements[0] + other.elements[0];
        out.elements[1] = this.elements[1] + other.elements[1];
        out.elements[2] = this.elements[2] + other.elements[2];
        return out;
      }
      sub(other) {
        const out = new _vec3();
        out.elements[0] = this.elements[0] - other.elements[0];
        out.elements[1] = this.elements[1] - other.elements[1];
        out.elements[2] = this.elements[2] - other.elements[2];
        return out;
      }
      mul(other) {
        const out = new _vec3();
        if (typeof other === "number") {
          out.elements[0] = this.elements[0] * other;
          out.elements[1] = this.elements[1] * other;
          out.elements[2] = this.elements[2] * other;
        } else {
          out.elements[0] = this.elements[0] * other.elements[0];
          out.elements[1] = this.elements[1] * other.elements[1];
          out.elements[2] = this.elements[2] * other.elements[2];
        }
        return out;
      }
      div(scalar) {
        const out = new _vec3();
        out.elements[0] = this.elements[0] / scalar;
        out.elements[1] = this.elements[1] / scalar;
        out.elements[2] = this.elements[2] / scalar;
        return out;
      }
      equal(other) {
        return this.elements[0] === other.elements[0] && this.elements[1] === other.elements[1] && this.elements[2] === other.elements[2];
      }
      eql(other) {
        return this.equal(other);
      }
      epsilonEqual(other) {
        const epsilon = 1e-6;
        return Math.abs(this.elements[0] - other.elements[0]) < epsilon && Math.abs(this.elements[1] - other.elements[1]) < epsilon && Math.abs(this.elements[2] - other.elements[2]) < epsilon;
      }
      eql_epsilon(other) {
        return this.epsilonEqual(other);
      }
      get array() {
        return Array.from(this.elements);
      }
    };
    vec4 = class _vec4 extends GLMBaseMixin(class {
    }) {
      constructor(x, y, z, w) {
        super();
        this._type = "vec";
        Object.defineProperty(this, "elements", { value: new Float32Array(4) });
        if (x instanceof _vec4) {
          this.elements[0] = x.elements[0];
          this.elements[1] = x.elements[1];
          this.elements[2] = x.elements[2];
          this.elements[3] = x.elements[3];
        } else if (x instanceof vec32) {
          this.elements[0] = x.elements[0];
          this.elements[1] = x.elements[1];
          this.elements[2] = x.elements[2];
          this.elements[3] = y || 0;
        } else if (x instanceof vec2) {
          this.elements[0] = x.elements[0];
          this.elements[1] = x.elements[1];
          this.elements[2] = y || 0;
          this.elements[3] = z || 0;
        } else if (typeof x === "number" && y === void 0) {
          this.elements[0] = x;
          this.elements[1] = x;
          this.elements[2] = x;
          this.elements[3] = x;
        } else {
          const finalX = x || 0;
          const finalY = y === void 0 ? finalX : y || 0;
          const finalZ = z === void 0 ? finalY : z || 0;
          const finalW = w === void 0 ? finalZ : w || 0;
          this.elements[0] = finalX;
          this.elements[1] = finalY;
          this.elements[2] = finalZ;
          this.elements[3] = finalW;
        }
        this._type = "vec";
      }
      add(other) {
        const out = new _vec4();
        out.elements[0] = this.elements[0] + other.elements[0];
        out.elements[1] = this.elements[1] + other.elements[1];
        out.elements[2] = this.elements[2] + other.elements[2];
        out.elements[3] = this.elements[3] + other.elements[3];
        return out;
      }
      sub(other) {
        const out = new _vec4();
        out.elements[0] = this.elements[0] - other.elements[0];
        out.elements[1] = this.elements[1] - other.elements[1];
        out.elements[2] = this.elements[2] - other.elements[2];
        out.elements[3] = this.elements[3] - other.elements[3];
        return out;
      }
      mul(other) {
        const out = new _vec4();
        if (typeof other === "number") {
          out.elements[0] = this.elements[0] * other;
          out.elements[1] = this.elements[1] * other;
          out.elements[2] = this.elements[2] * other;
          out.elements[3] = this.elements[3] * other;
        } else {
          out.elements[0] = this.elements[0] * other.elements[0];
          out.elements[1] = this.elements[1] * other.elements[1];
          out.elements[2] = this.elements[2] * other.elements[2];
          out.elements[3] = this.elements[3] * other.elements[3];
        }
        return out;
      }
      div(scalar) {
        const out = new _vec4();
        out.elements[0] = this.elements[0] / scalar;
        out.elements[1] = this.elements[1] / scalar;
        out.elements[2] = this.elements[2] / scalar;
        out.elements[3] = this.elements[3] / scalar;
        return out;
      }
      equal(other) {
        return this.elements[0] === other.elements[0] && this.elements[1] === other.elements[1] && this.elements[2] === other.elements[2] && this.elements[3] === other.elements[3];
      }
      eql(other) {
        return this.equal(other);
      }
      epsilonEqual(other) {
        const epsilon = 1e-6;
        return Math.abs(this.elements[0] - other.elements[0]) < epsilon && Math.abs(this.elements[1] - other.elements[1]) < epsilon && Math.abs(this.elements[2] - other.elements[2]) < epsilon && Math.abs(this.elements[3] - other.elements[3]) < epsilon;
      }
      eql_epsilon(other) {
        return this.epsilonEqual(other);
      }
      get array() {
        return Array.from(this.elements);
      }
    };
    applySwizzling(vec2, vec2, vec32, vec4);
    applySwizzling(vec32, vec2, vec32, vec4);
    applySwizzling(vec4, vec2, vec32, vec4);
    uvec2 = class _uvec2 extends GLMBaseMixin(class {
    }) {
      constructor(x, y) {
        super();
        this._type = "vec";
        Object.defineProperty(this, "elements", { value: new Uint32Array(2) });
        if (x instanceof _uvec2) {
          this.elements[0] = x.elements[0];
          this.elements[1] = x.elements[1];
        } else if (typeof x === "number" && y === void 0) {
          this.elements[0] = x;
          this.elements[1] = x;
        } else {
          this.elements[0] = x || 0;
          this.elements[1] = y || 0;
        }
      }
      get array() {
        return Array.from(this.elements);
      }
    };
  }
});

// implementation/functions.js
function dot(a, b) {
  let out = 0;
  for (let i = 0; i < a.elements.length; i++) {
    out += a.elements[i] * b.elements[i];
  }
  return out;
}
function cross(a, b) {
  const out = new a.constructor();
  const ax = a.elements[0], ay = a.elements[1], az = a.elements[2];
  const bx = b.elements[0], by = b.elements[1], bz = b.elements[2];
  out.elements[0] = ay * bz - az * by;
  out.elements[1] = az * bx - ax * bz;
  out.elements[2] = ax * by - ay * bx;
  return out;
}
function normalize(a) {
  const out = new a.constructor();
  const len = Math.sqrt(dot(a, a));
  if (len > 0) {
    for (let i = 0; i < a.elements.length; i++) {
      out.elements[i] = a.elements[i] / len;
    }
  }
  return out;
}
function translate(m, v) {
  let _m, _v;
  if (v === void 0) {
    _v = m;
    _m = new mat4();
  } else {
    _m = m;
    _v = v;
  }
  const out = new _m.constructor(_m);
  out.elements[12] += _v.elements[0];
  out.elements[13] += _v.elements[1];
  out.elements[14] += _v.elements[2];
  return out;
}
function rotate(m, angle2, axis2) {
  let _m, _angle, _axis;
  if (axis2 === void 0) {
    _angle = m;
    _axis = angle2;
    _m = new mat4();
  } else {
    _m = m;
    _angle = angle2;
    _axis = axis2;
  }
  const out = new _m.constructor(_m);
  const c = Math.cos(_angle);
  const s = Math.sin(_angle);
  const C = 1 - c;
  const x = _axis.elements[0], y = _axis.elements[1], z = _axis.elements[2];
  const r00 = x * x * C + c;
  const r01 = y * x * C + z * s;
  const r02 = z * x * C - y * s;
  const r10 = x * y * C - z * s;
  const r11 = y * y * C + c;
  const r12 = z * y * C + x * s;
  const r20 = x * z * C + y * s;
  const r21 = y * z * C - x * s;
  const r22 = z * z * C + c;
  const m00 = _m.elements[0], m01 = _m.elements[1], m02 = _m.elements[2];
  const m04 = _m.elements[4], m05 = _m.elements[5], m06 = _m.elements[6];
  const m08 = _m.elements[8], m09 = _m.elements[9], m10 = _m.elements[10];
  out.elements[0] = r00 * m00 + r10 * m01 + r20 * m02;
  out.elements[1] = r01 * m00 + r11 * m01 + r21 * m02;
  out.elements[2] = r02 * m00 + r12 * m01 + r22 * m02;
  out.elements[4] = r00 * m04 + r10 * m05 + r20 * m06;
  out.elements[5] = r01 * m04 + r11 * m05 + r21 * m06;
  out.elements[6] = r02 * m04 + r12 * m05 + r22 * m06;
  out.elements[8] = r00 * m08 + r10 * m09 + r20 * m10;
  out.elements[9] = r01 * m08 + r11 * m09 + r21 * m10;
  out.elements[10] = r02 * m08 + r12 * m09 + r22 * m10;
  return out;
}
function scale(m, v) {
  let _m, _v;
  if (v === void 0) {
    _v = m;
    _m = new mat4();
  } else {
    _m = m;
    _v = v;
  }
  const out = new _m.constructor(_m);
  out.elements[0] *= _v.elements[0];
  out.elements[5] *= _v.elements[1];
  out.elements[10] *= _v.elements[2];
  return out;
}
function length2(a) {
  return dot(a, a);
}
function length(a) {
  return Math.sqrt(length2(a));
}
function distance(a, b) {
  const diff = new a.constructor();
  for (let i = 0; i < a.elements.length; i++) {
    diff.elements[i] = a.elements[i] - b.elements[i];
  }
  return length(diff);
}
function mix(a, b, t) {
  const out = new a.constructor();
  for (let i = 0; i < a.elements.length; i++) {
    out.elements[i] = a.elements[i] * (1 - t) + b.elements[i] * t;
  }
  return out;
}
function clamp(a, min2, max2) {
  if (typeof a === "number") {
    return Math.max(min2, Math.min(max2, a));
  }
  const out = new a.constructor();
  for (let i = 0; i < a.elements.length; i++) {
    const minVal = typeof min2 === "number" ? min2 : min2.elements[i];
    const maxVal = typeof max2 === "number" ? max2 : max2.elements[i];
    out.elements[i] = Math.max(minVal, Math.min(maxVal, a.elements[i]));
  }
  return out;
}
function toMat4(q) {
  const out = new mat4();
  const x = q.elements[0], y = q.elements[1], z = q.elements[2], w = q.elements[3];
  const x2 = x + x;
  const y2 = y + y;
  const z2 = z + z;
  const xx = x * x2;
  const xy = x * y2;
  const xz = x * z2;
  const yy = y * y2;
  const yz = y * z2;
  const zz = z * z2;
  const wx = w * x2;
  const wy = w * y2;
  const wz = w * z2;
  out.elements[0] = 1 - (yy + zz);
  out.elements[1] = xy + wz;
  out.elements[2] = xz - wy;
  out.elements[3] = 0;
  out.elements[4] = xy - wz;
  out.elements[5] = 1 - (xx + zz);
  out.elements[6] = yz + wx;
  out.elements[7] = 0;
  out.elements[8] = xz + wy;
  out.elements[9] = yz - wx;
  out.elements[10] = 1 - (xx + yy);
  out.elements[11] = 0;
  out.elements[12] = 0;
  out.elements[13] = 0;
  out.elements[14] = 0;
  out.elements[15] = 1;
  return out;
}
function add(a, b) {
  return a["+"](b);
}
function sub(a, b) {
  return a["-"](b);
}
function mul(a, b) {
  return a["*"](b);
}
function div(a, b) {
  return a["/"](b);
}
function unProject(win, model, proj, viewport) {
  const inv = inverse(proj["*"](model));
  const tmp = new vec4(win, 1);
  tmp.elements[0] = (tmp.elements[0] - viewport[0]) / viewport[2];
  tmp.elements[1] = (tmp.elements[1] - viewport[1]) / viewport[3];
  for (let i = 0; i < 4; i++) {
    tmp.elements[i] = tmp.elements[i] * 2 - 1;
  }
  const obj = inv["*"](tmp);
  for (let i = 0; i < 4; i++) {
    obj.elements[i] /= obj.elements[3];
  }
  return new vec32(obj);
}
function project(obj, model, proj, viewport) {
  let tmp = new vec4(obj, 1);
  tmp = model["*"](tmp);
  tmp = proj["*"](tmp);
  for (let i = 0; i < 4; i++) {
    tmp.elements[i] /= tmp.elements[3];
  }
  for (let i = 0; i < 4; i++) {
    tmp.elements[i] = tmp.elements[i] * 0.5 + 0.5;
  }
  tmp.elements[0] = tmp.elements[0] * viewport[2] + viewport[0];
  tmp.elements[1] = tmp.elements[1] * viewport[3] + viewport[1];
  return new vec32(tmp);
}
function diagonal3x3(v) {
  const out = new mat3();
  out.elements[0] = v.elements[0];
  out.elements[4] = v.elements[1];
  out.elements[8] = v.elements[2];
  return out;
}
function diagonal4x4(v) {
  const out = new mat4();
  out.elements[0] = v.elements[0];
  out.elements[5] = v.elements[1];
  out.elements[10] = v.elements[2];
  out.elements[15] = v.elements[3];
  return out;
}
function angle(q) {
  return Math.acos(q.elements[3]) * 2;
}
function axis(q) {
  const tmp1 = 1 - q.elements[3] * q.elements[3];
  if (tmp1 <= 0) {
    return new vec32(0, 0, 1);
  }
  const tmp2 = 1 / Math.sqrt(tmp1);
  return new vec32(q.elements[0] * tmp2, q.elements[1] * tmp2, q.elements[2] * tmp2);
}
function eulerAngles(q) {
  const m = toMat4(q);
  const te = m.elements;
  const m11 = te[0], m12 = te[4], m13 = te[8];
  const m21 = te[1], m22 = te[5], m23 = te[9];
  const m31 = te[2], m32 = te[6], m33 = te[10];
  const angles = new vec32();
  angles.y = Math.asin(Math.max(-1, Math.min(1, m13)));
  if (Math.abs(m13) < 0.99999) {
    angles.x = Math.atan2(-m23, m33);
    angles.z = Math.atan2(-m12, m11);
  } else {
    angles.x = Math.atan2(m32, m22);
    angles.z = 0;
  }
  return angles;
}
function faceforward(N, I, Nref) {
  const dotNI = dot(Nref, I);
  return new N.constructor(dotNI < 0 ? N : N["*"](-1));
}
function reflect(I, N) {
  return I["-"](N["*"](2 * dot(N, I)));
}
function refract(I, N, eta) {
  const dotNI = dot(N, I);
  const k = 1 - eta * eta * (1 - dotNI * dotNI);
  if (k < 0) {
    return new I.constructor();
  }
  return I["*"](eta)["-"](N["*"](eta * dotNI + Math.sqrt(k)));
}
function any(a) {
  for (let i = 0; i < a.elements.length; i++) {
    if (a.elements[i]) {
      return true;
    }
  }
  return false;
}
function not_(v) {
  let out;
  switch (v.elements.length) {
    case 2:
      out = new bvec2();
      break;
    case 3:
      out = new bvec3();
      break;
    case 4:
      out = new bvec4();
      break;
    default:
      throw new Error(`Unsupported vector length: ${v.elements.length}`);
  }
  for (let i = 0; i < v.elements.length; i++) {
    out.elements[i] = !v.elements[i];
  }
  return out;
}
function packDouble2x32(v) {
  const buffer = new ArrayBuffer(8);
  const dataView = new DataView(buffer);
  dataView.setUint32(0, v.elements[0], true);
  dataView.setUint32(4, v.elements[1], true);
  return dataView.getFloat64(0, true);
}
function unpackDouble2x32(v) {
  const buffer = new ArrayBuffer(8);
  const dataView = new DataView(buffer);
  dataView.setFloat64(0, v, true);
  return new uvec2(dataView.getUint32(0, true), dataView.getUint32(4, true));
}
function packHalf2x16(v) {
  const p = new Uint16Array(2);
  p[0] = float32ToFloat16(v.elements[0]);
  p[1] = float32ToFloat16(v.elements[1]);
  const u = new Uint32Array(1);
  u[0] = p[1] << 16 | p[0];
  return u[0];
}
function unpackHalf2x16(v) {
  const p = new Uint16Array(2);
  p[0] = v & 65535;
  p[1] = v >> 16;
  return new vec2(float16ToFloat32(p[0]), float16ToFloat32(p[1]));
}
function packSnorm2x16(v) {
  const x = Math.round(Math.max(-1, Math.min(1, v.elements[0])) * 32767);
  const y = Math.round(Math.max(-1, Math.min(1, v.elements[1])) * 32767);
  return y << 16 | x & 65535;
}
function unpackSnorm2x16(p) {
  const x = (p & 65535) << 16 >> 16;
  const y = p >> 16;
  return new vec2(Math.max(-1, x / 32767), Math.max(-1, y / 32767));
}
function packSnorm4x8(v) {
  const x = Math.round(Math.max(-1, Math.min(1, v.elements[0])) * 127);
  const y = Math.round(Math.max(-1, Math.min(1, v.elements[1])) * 127);
  const z = Math.round(Math.max(-1, Math.min(1, v.elements[2])) * 127);
  const w = Math.round(Math.max(-1, Math.min(1, v.elements[3])) * 127);
  return w << 24 | (z & 255) << 16 | (y & 255) << 8 | x & 255;
}
function unpackSnorm4x8(p) {
  const x = (p & 255) << 24 >> 24;
  const y = (p >> 8 & 255) << 24 >> 24;
  const z = (p >> 16 & 255) << 24 >> 24;
  const w = p >> 24;
  return new vec4(x / 127, y / 127, z / 127, w / 127);
}
function packUnorm2x16(v) {
  const x = Math.round(Math.max(0, Math.min(1, v.elements[0])) * 65535);
  const y = Math.round(Math.max(0, Math.min(1, v.elements[1])) * 65535);
  return y << 16 | x & 65535;
}
function unpackUnorm2x16(p) {
  const x = p & 65535;
  const y = p >>> 16;
  return new vec2(x / 65535, y / 65535);
}
function packUnorm4x8(v) {
  const x = Math.round(Math.max(0, Math.min(1, v.elements[0])) * 255);
  const y = Math.round(Math.max(0, Math.min(1, v.elements[1])) * 255);
  const z = Math.round(Math.max(0, Math.min(1, v.elements[2])) * 255);
  const w = Math.round(Math.max(0, Math.min(1, v.elements[3])) * 255);
  return w << 24 | z << 16 | y << 8 | x & 255;
}
function unpackUnorm4x8(p) {
  const x = p & 255;
  const y = p >>> 8 & 255;
  const z = p >>> 16 & 255;
  const w = p >>> 24;
  return new vec4(x / 255, y / 255, z / 255, w / 255);
}
function float32ToFloat16(val) {
  const floatView = new DataView(new ArrayBuffer(4));
  floatView.setFloat32(0, val);
  const f32 = floatView.getUint32(0);
  const sign2 = f32 >> 31 & 1;
  let exp3 = f32 >> 23 & 255;
  const frac = f32 & 8388607;
  let newExp;
  if (exp3 === 0) {
    newExp = 0;
  } else if (exp3 === 255) {
    newExp = 31;
  } else {
    exp3 = exp3 - 127 + 15;
    if (exp3 >= 31) {
      newExp = 31;
    } else if (exp3 <= 0) {
      newExp = 0;
    } else {
      newExp = exp3;
    }
  }
  return sign2 << 15 | newExp << 10 | frac >> 13;
}
function float16ToFloat32(val) {
  const floatView = new DataView(new ArrayBuffer(4));
  const sign2 = val >> 15 & 1;
  let exp3 = val >> 10 & 31;
  const frac = val & 1023;
  let newExp;
  let newFrac;
  if (exp3 === 0) {
    if (frac === 0) {
      newExp = 0;
      newFrac = 0;
    } else {
      newExp = 1 - 15 + 127;
      newFrac = frac;
      while ((newFrac & 1024) === 0) {
        newFrac <<= 1;
        newExp--;
      }
      newFrac &= 1023;
    }
  } else if (exp3 === 31) {
    newExp = 255;
    newFrac = frac !== 0 ? 8388607 : 0;
  } else {
    newExp = exp3 - 15 + 127;
    newFrac = frac;
  }
  floatView.setUint32(0, sign2 << 31 | newExp << 23 | newFrac << 13);
  return floatView.getFloat32(0);
}
var bvec2, bvec3, bvec4, createVectorRelationalOperator, equal, notEqual, lessThan, lessThanEqual, greaterThan, greaterThanEqual;
var init_functions = __esm({
  "implementation/functions.js"() {
    init_mat();
    init_vec();
    bvec2 = vec2;
    bvec3 = vec32;
    bvec4 = vec4;
    createVectorRelationalOperator = (op) => {
      return (x, y) => {
        let out;
        switch (x.elements.length) {
          case 2:
            out = new bvec2();
            break;
          case 3:
            out = new bvec3();
            break;
          case 4:
            out = new bvec4();
            break;
          default:
            throw new Error(`Unsupported vector length: ${x.elements.length}`);
        }
        for (let i = 0; i < x.elements.length; i++) {
          out.elements[i] = op(x.elements[i], y.elements[i]);
        }
        return out;
      };
    };
    equal = createVectorRelationalOperator((a, b) => a === b);
    notEqual = createVectorRelationalOperator((a, b) => a !== b);
    lessThan = createVectorRelationalOperator((a, b) => a < b);
    lessThanEqual = createVectorRelationalOperator((a, b) => a <= b);
    greaterThan = createVectorRelationalOperator((a, b) => a > b);
    greaterThanEqual = createVectorRelationalOperator((a, b) => a >= b);
  }
});

// implementation/mat.js
function transpose(m) {
  return m.transpose();
}
function inverse(m) {
  return m.inverse();
}
function determinant(m) {
  return m.determinant();
}
function matrixCompMult(x, y) {
  const out = new x.constructor();
  for (let i = 0; i < x.elements.length; i++) {
    out.elements[i] = x.elements[i] * y.elements[i];
  }
  return out;
}
function outerProduct(c, r) {
  if (c.elements.length === 3 && r.elements.length === 3) {
    const out = new mat3();
    out.elements[0] = c.elements[0] * r.elements[0];
    out.elements[1] = c.elements[1] * r.elements[0];
    out.elements[2] = c.elements[2] * r.elements[0];
    out.elements[3] = c.elements[0] * r.elements[1];
    out.elements[4] = c.elements[1] * r.elements[1];
    out.elements[5] = c.elements[2] * r.elements[1];
    out.elements[6] = c.elements[0] * r.elements[2];
    out.elements[7] = c.elements[1] * r.elements[2];
    out.elements[8] = c.elements[2] * r.elements[2];
    return out;
  } else if (c.elements.length === 4 && r.elements.length === 4) {
    const out = new mat4();
    out.elements[0] = c.elements[0] * r.elements[0];
    out.elements[1] = c.elements[1] * r.elements[0];
    out.elements[2] = c.elements[2] * r.elements[0];
    out.elements[3] = c.elements[3] * r.elements[0];
    out.elements[4] = c.elements[0] * r.elements[1];
    out.elements[5] = c.elements[1] * r.elements[1];
    out.elements[6] = c.elements[2] * r.elements[1];
    out.elements[7] = c.elements[3] * r.elements[1];
    out.elements[8] = c.elements[0] * r.elements[2];
    out.elements[9] = c.elements[1] * r.elements[2];
    out.elements[10] = c.elements[2] * r.elements[2];
    out.elements[11] = c.elements[3] * r.elements[2];
    out.elements[12] = c.elements[0] * r.elements[3];
    out.elements[13] = c.elements[1] * r.elements[3];
    out.elements[14] = c.elements[2] * r.elements[3];
    out.elements[15] = c.elements[3] * r.elements[3];
    return out;
  }
  throw new Error("outerProduct only supports vec3 and vec4");
}
function lookAt(eye, center, up) {
  const f = normalize(eye.sub(center));
  const s = normalize(cross(up, f));
  const u = cross(f, s);
  const out = new mat4();
  out.elements[0] = s.x;
  out.elements[1] = u.x;
  out.elements[2] = f.x;
  out.elements[3] = 0;
  out.elements[4] = s.y;
  out.elements[5] = u.y;
  out.elements[6] = f.y;
  out.elements[7] = 0;
  out.elements[8] = s.z;
  out.elements[9] = u.z;
  out.elements[10] = f.z;
  out.elements[11] = 0;
  out.elements[12] = -dot(s, eye);
  out.elements[13] = -dot(u, eye);
  out.elements[14] = -dot(f, eye);
  out.elements[15] = 1;
  return out;
}
function perspective(fovy, aspect, near, far) {
  const out = new mat4(0);
  const f = 1 / Math.tan(fovy / 2);
  out.elements[0] = f / aspect;
  out.elements[5] = f;
  out.elements[11] = -1;
  if (far != null && far !== Infinity) {
    const nf = 1 / (near - far);
    out.elements[10] = (far + near) * nf;
    out.elements[14] = 2 * far * near * nf;
  } else {
    out.elements[10] = -1;
    out.elements[14] = -2 * near;
  }
  return out;
}
function ortho(left, right, bottom, top, near, far) {
  const out = new mat4(0);
  const lr = 1 / (left - right);
  const bt = 1 / (bottom - top);
  const nf = 1 / (near - far);
  out.elements[0] = -2 * lr;
  out.elements[5] = -2 * bt;
  out.elements[10] = 2 * nf;
  out.elements[12] = (left + right) * lr;
  out.elements[13] = (top + bottom) * bt;
  out.elements[14] = (far + near) * nf;
  out.elements[15] = 1;
  return out;
}
var mat3, mat4;
var init_mat = __esm({
  "implementation/mat.js"() {
    init_vec();
    init_functions();
    init_base();
    mat3 = class _mat3 extends GLMBaseMixin(class {
    }) {
      constructor(arg) {
        super();
        this._type = "mat";
        Object.defineProperty(this, "elements", { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) });
        if (typeof arg === "number") {
          this.elements[0] = arg;
          this.elements[4] = arg;
          this.elements[8] = arg;
        } else if (arg instanceof _mat3) {
          this.elements.set(arg.elements);
        } else if (arg instanceof mat4) {
          this.elements[0] = arg.elements[0];
          this.elements[1] = arg.elements[1];
          this.elements[2] = arg.elements[2];
          this.elements[3] = arg.elements[4];
          this.elements[4] = arg.elements[5];
          this.elements[5] = arg.elements[6];
          this.elements[6] = arg.elements[8];
          this.elements[7] = arg.elements[9];
          this.elements[8] = arg.elements[10];
        }
      }
      mul(other) {
        const out = new _mat3();
        const a = this.elements;
        const b = other.elements;
        out.elements[0] = b[0] * a[0] + b[1] * a[3] + b[2] * a[6];
        out.elements[1] = b[0] * a[1] + b[1] * a[4] + b[2] * a[7];
        out.elements[2] = b[0] * a[2] + b[1] * a[5] + b[2] * a[8];
        out.elements[3] = b[3] * a[0] + b[4] * a[3] + b[5] * a[6];
        out.elements[4] = b[3] * a[1] + b[4] * a[4] + b[5] * a[7];
        out.elements[5] = b[3] * a[2] + b[4] * a[5] + b[5] * a[8];
        out.elements[6] = b[6] * a[0] + b[7] * a[3] + b[8] * a[6];
        out.elements[7] = b[6] * a[1] + b[7] * a[4] + b[8] * a[7];
        out.elements[8] = b[6] * a[2] + b[7] * a[5] + b[8] * a[8];
        return out;
      }
      transpose() {
        const out = new _mat3();
        const a = this.elements;
        out.elements[0] = a[0];
        out.elements[1] = a[3];
        out.elements[2] = a[6];
        out.elements[3] = a[1];
        out.elements[4] = a[4];
        out.elements[5] = a[7];
        out.elements[6] = a[2];
        out.elements[7] = a[5];
        out.elements[8] = a[8];
        return out;
      }
      determinant() {
        const a = this.elements;
        return a[0] * (a[4] * a[8] - a[5] * a[7]) - a[1] * (a[3] * a[8] - a[5] * a[6]) + a[2] * (a[3] * a[7] - a[4] * a[6]);
      }
      inverse() {
        const out = new _mat3();
        const a = this.elements;
        const det = this.determinant();
        if (!det) {
          return null;
        }
        const invDet = 1 / det;
        out.elements[0] = (a[4] * a[8] - a[5] * a[7]) * invDet;
        out.elements[1] = (a[2] * a[7] - a[1] * a[8]) * invDet;
        out.elements[2] = (a[1] * a[5] - a[2] * a[4]) * invDet;
        out.elements[3] = (a[5] * a[6] - a[3] * a[8]) * invDet;
        out.elements[4] = (a[0] * a[8] - a[2] * a[6]) * invDet;
        out.elements[5] = (a[2] * a[3] - a[0] * a[5]) * invDet;
        out.elements[6] = (a[3] * a[7] - a[4] * a[6]) * invDet;
        out.elements[7] = (a[1] * a[6] - a[0] * a[7]) * invDet;
        out.elements[8] = (a[0] * a[4] - a[1] * a[3]) * invDet;
        return out;
      }
    };
    mat4 = class _mat4 extends GLMBaseMixin(class {
    }) {
      constructor(arg) {
        super();
        this._type = "mat";
        Object.defineProperty(this, "elements", { value: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) });
        if (typeof arg === "number") {
          this.elements[0] = arg;
          this.elements[5] = arg;
          this.elements[10] = arg;
          this.elements[15] = arg;
        } else if (arg instanceof _mat4) {
          this.elements.set(arg.elements);
        } else if (arg instanceof mat3) {
          this.elements[0] = arg.elements[0];
          this.elements[1] = arg.elements[1];
          this.elements[2] = arg.elements[2];
          this.elements[4] = arg.elements[3];
          this.elements[5] = arg.elements[4];
          this.elements[6] = arg.elements[5];
          this.elements[8] = arg.elements[6];
          this.elements[9] = arg.elements[7];
          this.elements[10] = arg.elements[8];
        }
      }
      mul(other) {
        const out = new _mat4();
        const a = this.elements;
        const b = other.elements;
        out.elements[0] = b[0] * a[0] + b[1] * a[4] + b[2] * a[8] + b[3] * a[12];
        out.elements[1] = b[0] * a[1] + b[1] * a[5] + b[2] * a[9] + b[3] * a[13];
        out.elements[2] = b[0] * a[2] + b[1] * a[6] + b[2] * a[10] + b[3] * a[14];
        out.elements[3] = b[0] * a[3] + b[1] * a[7] + b[2] * a[11] + b[3] * a[15];
        out.elements[4] = b[4] * a[0] + b[5] * a[4] + b[6] * a[8] + b[7] * a[12];
        out.elements[5] = b[4] * a[1] + b[5] * a[5] + b[6] * a[9] + b[7] * a[13];
        out.elements[6] = b[4] * a[2] + b[5] * a[6] + b[6] * a[10] + b[7] * a[14];
        out.elements[7] = b[4] * a[3] + b[5] * a[7] + b[6] * a[11] + b[7] * a[15];
        out.elements[8] = b[8] * a[0] + b[9] * a[4] + b[10] * a[8] + b[11] * a[12];
        out.elements[9] = b[8] * a[1] + b[9] * a[5] + b[10] * a[9] + b[11] * a[13];
        out.elements[10] = b[8] * a[2] + b[9] * a[6] + b[10] * a[10] + b[11] * a[14];
        out.elements[11] = b[8] * a[3] + b[9] * a[7] + b[10] * a[11] + b[11] * a[15];
        out.elements[12] = b[12] * a[0] + b[13] * a[4] + b[14] * a[8] + b[15] * a[12];
        out.elements[13] = b[12] * a[1] + b[13] * a[5] + b[14] * a[9] + b[15] * a[13];
        out.elements[14] = b[12] * a[2] + b[13] * a[6] + b[14] * a[10] + b[15] * a[14];
        out.elements[15] = b[12] * a[3] + b[13] * a[7] + b[14] * a[11] + b[15] * a[15];
        return out;
      }
      transpose() {
        const out = new _mat4();
        const a = this.elements;
        out.elements[0] = a[0];
        out.elements[1] = a[4];
        out.elements[2] = a[8];
        out.elements[3] = a[12];
        out.elements[4] = a[1];
        out.elements[5] = a[5];
        out.elements[6] = a[9];
        out.elements[7] = a[13];
        out.elements[8] = a[2];
        out.elements[9] = a[6];
        out.elements[10] = a[10];
        out.elements[11] = a[14];
        out.elements[12] = a[3];
        out.elements[13] = a[7];
        out.elements[14] = a[11];
        out.elements[15] = a[15];
        return out;
      }
      determinant() {
        const a = this.elements;
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      }
      inverse() {
        const out = new _mat4();
        const a = this.elements;
        const det = this.determinant();
        if (!det) {
          return null;
        }
        const invDet = 1 / det;
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;
        out.elements[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
        out.elements[1] = (a02 * b10 - a01 * b11 - a03 * b09) * invDet;
        out.elements[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
        out.elements[3] = (a22 * b04 - a21 * b05 - a23 * b03) * invDet;
        out.elements[4] = (a12 * b08 - a10 * b11 - a13 * b07) * invDet;
        out.elements[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
        out.elements[6] = (a32 * b02 - a30 * b05 - a33 * b01) * invDet;
        out.elements[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
        out.elements[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
        out.elements[9] = (a01 * b08 - a00 * b10 - a03 * b06) * invDet;
        out.elements[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
        out.elements[11] = (a21 * b02 - a20 * b04 - a23 * b00) * invDet;
        out.elements[12] = (a11 * b07 - a10 * b09 - a12 * b06) * invDet;
        out.elements[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
        out.elements[14] = (a31 * b01 - a30 * b03 - a32 * b00) * invDet;
        out.elements[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
        return out;
      }
    };
  }
});

// implementation/quat.js
function angleAxis(angle2, axis2) {
  const halfAngle = angle2 / 2;
  const s = Math.sin(halfAngle);
  const out = new quat();
  out.elements[0] = axis2.elements[0] * s;
  out.elements[1] = axis2.elements[1] * s;
  out.elements[2] = axis2.elements[2] * s;
  out.elements[3] = Math.cos(halfAngle);
  return out;
}
function inverse2(q) {
  const out = new quat();
  const x = q.elements[0], y = q.elements[1], z = q.elements[2], w = q.elements[3];
  let dot2 = x * x + y * y + z * z + w * w;
  if (dot2 === 0) {
    return new quat();
  }
  dot2 = 1 / dot2;
  out.elements[0] = -x * dot2;
  out.elements[1] = -y * dot2;
  out.elements[2] = -z * dot2;
  out.elements[3] = w * dot2;
  return out;
}
function slerp(q1, q2, t) {
  const out = new quat();
  let cosTheta = q1.elements[0] * q2.elements[0] + q1.elements[1] * q2.elements[1] + q1.elements[2] * q2.elements[2] + q1.elements[3] * q2.elements[3];
  if (cosTheta < 0) {
    q2 = new quat(-q2.elements[3], -q2.elements[0], -q2.elements[1], -q2.elements[2]);
    cosTheta = -cosTheta;
  }
  if (cosTheta > 0.9995) {
    out.elements[0] = (1 - t) * q1.elements[0] + t * q2.elements[0];
    out.elements[1] = (1 - t) * q1.elements[1] + t * q2.elements[1];
    out.elements[2] = (1 - t) * q1.elements[2] + t * q2.elements[2];
    out.elements[3] = (1 - t) * q1.elements[3] + t * q2.elements[3];
    return normalize(out);
  }
  const theta = Math.acos(cosTheta);
  const sinTheta = Math.sin(theta);
  if (sinTheta === 0) {
    out.elements.set(q1.elements);
    return out;
  }
  const ratioA = Math.sin((1 - t) * theta) / sinTheta;
  const ratioB = Math.sin(t * theta) / sinTheta;
  out.elements[0] = q1.elements[0] * ratioA + q2.elements[0] * ratioB;
  out.elements[1] = q1.elements[1] * ratioA + q2.elements[1] * ratioB;
  out.elements[2] = q1.elements[2] * ratioA + q2.elements[2] * ratioB;
  out.elements[3] = q1.elements[3] * ratioA + q2.elements[3] * ratioB;
  return out;
}
var quat;
var init_quat = __esm({
  "implementation/quat.js"() {
    init_vec();
    init_base();
    init_functions();
    quat = class _quat extends GLMBaseMixin(class {
    }) {
      constructor(w, x, y, z) {
        super();
        this._type = "quat";
        Object.defineProperty(this, "elements", { value: new Float32Array([0, 0, 0, 1]) });
        if (w instanceof _quat) {
          this.elements.set(w.elements);
        } else if (typeof w === "number" && typeof x === "number" && typeof y === "number" && typeof z === "number") {
          this.elements[0] = x;
          this.elements[1] = y;
          this.elements[2] = z;
          this.elements[3] = w;
        }
      }
      mul(other) {
        const out = new _quat();
        const ax = this.elements[0], ay = this.elements[1], az = this.elements[2], aw = this.elements[3];
        const bx = other.elements[0], by = other.elements[1], bz = other.elements[2], bw = other.elements[3];
        out.elements[0] = ax * bw + aw * bx + ay * bz - az * by;
        out.elements[1] = ay * bw + aw * by + az * bx - ax * bz;
        out.elements[2] = az * bw + aw * bz + ax * by - ay * bx;
        out.elements[3] = aw * bw - ax * bx - ay * by - az * bz;
        return out;
      }
    };
  }
});

// implementation/common.js
function radians(degrees2) {
  if (degrees2 === null || typeof degrees2 !== "number" && !degrees2?.elements) {
    return void 0;
  }
  if (typeof degrees2 === "number") {
    return degrees2 * Math.PI / 180;
  }
  const out = new degrees2.constructor();
  for (let i = 0; i < degrees2.elements.length; i++) {
    out.elements[i] = degrees2.elements[i] * Math.PI / 180;
  }
  return out;
}
function degrees(radians2) {
  if (radians2 === null || typeof radians2 !== "number" && !radians2?.elements) {
    return void 0;
  }
  if (typeof radians2 === "number") {
    return radians2 * 180 / Math.PI;
  }
  const out = new radians2.constructor();
  for (let i = 0; i < radians2.elements.length; i++) {
    out.elements[i] = radians2.elements[i] * 180 / Math.PI;
  }
  return out;
}
function min(a, b) {
  if (typeof a === "number" && typeof b === "number") {
    return Math.min(a, b);
  }
  const out = new a.constructor();
  for (let i = 0; i < a.elements.length; i++) {
    out.elements[i] = Math.min(a.elements[i], b.elements[i]);
  }
  return out;
}
function max(a, b) {
  if (typeof a === "number" && typeof b === "number") {
    return Math.max(a, b);
  }
  const out = new a.constructor();
  for (let i = 0; i < a.elements.length; i++) {
    out.elements[i] = Math.max(a.elements[i], b.elements[i]);
  }
  return out;
}
function abs(a) {
  if (typeof a === "number") {
    return Math.abs(a);
  }
  const out = new a.constructor();
  for (let i = 0; i < a.elements.length; i++) {
    out.elements[i] = Math.abs(a.elements[i]);
  }
  return out;
}
function fract(a) {
  if (typeof a === "number") {
    return a - Math.floor(a);
  }
  const out = new a.constructor();
  for (let i = 0; i < a.elements.length; i++) {
    out.elements[i] = a.elements[i] - Math.floor(a.elements[i]);
  }
  return out;
}
function all(a) {
  for (let i = 0; i < a.elements.length; i++) {
    if (!a.elements[i]) {
      return false;
    }
  }
  return true;
}
function sign(a) {
  if (typeof a === "number") {
    return Math.sign(a);
  }
  const out = new a.constructor();
  for (let i = 0; i < a.elements.length; i++) {
    out.elements[i] = Math.sign(a.elements[i]);
  }
  return out;
}
function frexp(a) {
  if (typeof a === "number") {
    if (a === 0) {
      return { significand: 0, exponent: 0 };
    }
    const dataView = new DataView(new ArrayBuffer(8));
    dataView.setFloat64(0, a);
    const bits = dataView.getBigUint64(0);
    const exponent = Number(bits >> 52n & 0x7FFn) - 1023;
    const mantissa = bits & 0xFFFFFFFFFFFFFn;
    const significand = 1 + Number(mantissa) / 2 ** 52;
    return { significand, exponent };
  }
  const out = new a.constructor();
  const exponents = new a.constructor();
  for (let i = 0; i < a.elements.length; i++) {
    const { significand, exponent } = frexp(a.elements[i]);
    out.elements[i] = significand;
    exponents.elements[i] = exponent;
  }
  return { significand: out, exponent: exponents };
}
function rotation(angle2, axis2) {
  if (!(axis2 instanceof vec3)) {
    throw new Error("Axis must be a vec3");
  }
  const halfAngle = angle2 / 2;
  const s = Math.sin(halfAngle);
  const c = Math.cos(halfAngle);
  const out = new quat();
  out.elements[0] = axis2.elements[0] * s;
  out.elements[1] = axis2.elements[1] * s;
  out.elements[2] = axis2.elements[2] * s;
  out.elements[3] = c;
  return out;
}
var pi, half_pi, quarter_pi, one_over_pi, two_over_pi, root_pi, two_over_root_pi, root_two, one_over_root_two, root_three, e, ln_ten, ln_two, sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, asinh, acosh, atanh, pow, exp, log, exp2, log2, sqrt, inversesqrt;
var init_common = __esm({
  "implementation/common.js"() {
    init_quat();
    pi = Math.PI;
    half_pi = Math.PI / 2;
    quarter_pi = Math.PI / 4;
    one_over_pi = 1 / Math.PI;
    two_over_pi = 2 / Math.PI;
    root_pi = Math.sqrt(Math.PI);
    two_over_root_pi = 2 / Math.sqrt(Math.PI);
    root_two = Math.sqrt(2);
    one_over_root_two = 1 / Math.sqrt(2);
    root_three = Math.sqrt(3);
    e = Math.E;
    ln_ten = Math.LN10;
    ln_two = Math.LN2;
    sin = (angle2) => Math.sin(angle2);
    cos = (angle2) => Math.cos(angle2);
    tan = (angle2) => Math.tan(angle2);
    asin = (x) => Math.asin(x);
    acos = (x) => Math.acos(x);
    atan = (y, x) => x !== void 0 ? Math.atan(y, x) : Math.atan(y);
    sinh = (angle2) => Math.sinh(angle2);
    cosh = (angle2) => Math.cosh(angle2);
    tanh = (angle2) => Math.tanh(angle2);
    asinh = (x) => Math.asinh(x);
    acosh = (x) => Math.acosh(x);
    atanh = (x) => Math.atanh(x);
    pow = (base, exp3) => Math.pow(base, exp3);
    exp = (x) => Math.exp(x);
    log = (x) => Math.log(x);
    exp2 = (x) => Math.pow(2, x);
    log2 = (x) => Math.log2(x);
    sqrt = (x) => Math.sqrt(x);
    inversesqrt = (x) => 1 / Math.sqrt(x);
  }
});

// package.json
var package_default;
var init_package = __esm({
  "package.json"() {
    package_default = {
      name: "glm-js-modern",
      version: "0.0.7c",
      description: "Modern implementation of glm-js",
      type: "module",
      main: "implementation/index.js",
      scripts: {
        test: "node --test --import ./tests/__init__.js 'tests/**/*.test.js'",
        "test:legacy": "node tests/__run-legacy-tests.js",
        "legacy:passfailcounts": "(node tests/__run-legacy-tests.js 2>&1 || true) | grep -E '^[[:space:]]+[0-9]+ (passing|failing)'",
        cjs: `echo '(function(exports) { if (/object/.test(typeof module)) module.exports = exports; else if (/object/.test(typeof window)) window.glm = exports; else globalThis.glm = exports; return exports; })(require("./implementation/index.js").default)' | npx esbuild --bundle --format=cjs --define:GLMJS_COMMIT="'$(git rev-parse --short HEAD)'" --outfile=dist/modern-glm-js.cjs`,
        esm: `echo 'module.exports = require("./implementation/index.js").default' | npx esbuild --bundle --format=esm --define:GLMJS_COMMIT="'$(git rev-parse --short HEAD)'" --outfile=dist/modern-glm-js.mjs`
      },
      engines: {
        node: ">=20.6.0"
      }
    };
  }
});

// implementation/index.js
var implementation_exports = {};
__export(implementation_exports, {
  default: () => implementation_default,
  mat3: () => mat3,
  mat4: () => mat4,
  vec2: () => vec2,
  vec3: () => vec32,
  vec4: () => vec4
});
function inverse3(m) {
  if (m instanceof mat3 || m instanceof mat4) {
    return inverse(m);
  } else if (m instanceof quat) {
    return inverse2(m);
  }
  throw new Error("inverse() not implemented for this type");
}
var mat3Factory, mat4Factory, quatFactory, vec2Factory, vec3Factory, vec4Factory, uvec2Factory, glm, implementation_default;
var init_implementation = __esm({
  "implementation/index.js"() {
    init_vec();
    init_mat();
    init_quat();
    init_format();
    init_functions();
    init_common();
    init_package();
    mat3Factory = function(arg) {
      if (arg instanceof mat3 && !(this instanceof mat3)) {
        return arg;
      }
      return new mat3(arg);
    };
    mat3Factory.prototype = mat3.prototype;
    mat4Factory = function(arg) {
      if (arg instanceof mat4 && !(this instanceof mat4)) {
        return arg;
      }
      return new mat4(arg);
    };
    mat4Factory.prototype = mat4.prototype;
    quatFactory = function(w, x, y, z) {
      return new quat(w, x, y, z);
    };
    quatFactory.prototype = quat.prototype;
    vec2Factory = function(...args) {
      if (this instanceof vec2Factory) {
        return new vec2(...args);
      }
      return new vec2(...args);
    };
    vec2Factory.prototype = vec2.prototype;
    vec3Factory = function(...args) {
      if (this instanceof vec3Factory) {
        return new vec32(...args);
      }
      return new vec32(...args);
    };
    vec3Factory.prototype = vec32.prototype;
    vec4Factory = function(...args) {
      if (this instanceof vec4Factory) {
        return new vec4(...args);
      }
      return new vec4(...args);
    };
    vec4Factory.prototype = vec4.prototype;
    uvec2Factory = function(...args) {
      if (this instanceof uvec2Factory) {
        return new uvec2(...args);
      }
      return new uvec2(...args);
    };
    uvec2Factory.prototype = uvec2.prototype;
    glm = {
      get version() {
        return `${package_default.version}-${false ? "(develop)" : "d0e4143"}`;
      },
      vec2: vec2Factory,
      vec3: vec3Factory,
      vec4: vec4Factory,
      uvec2: uvec2Factory,
      mat3: mat3Factory,
      mat4: mat4Factory,
      quat: quatFactory,
      angleAxis,
      epsilon: () => 1e-6,
      radians,
      degrees,
      min,
      max,
      abs,
      fract,
      all,
      sign,
      frexp,
      rotation,
      inverse: inverse3,
      transpose,
      lookAt,
      perspective,
      ortho,
      slerp,
      pi,
      half_pi,
      quarter_pi,
      one_over_pi,
      two_over_pi,
      root_pi,
      two_over_root_pi,
      root_two,
      one_over_root_two,
      root_three,
      e,
      ln_ten,
      ln_two,
      to_string,
      dot,
      cross,
      normalize,
      translate,
      rotate,
      scale,
      length,
      length2,
      distance,
      mix,
      clamp,
      toMat4,
      add,
      sub,
      mul,
      div,
      unProject,
      project,
      diagonal3x3,
      diagonal4x4,
      angle,
      axis,
      eulerAngles,
      faceforward,
      reflect,
      refract,
      determinant,
      matrixCompMult,
      outerProduct,
      sin,
      cos,
      tan,
      asin,
      acos,
      atan,
      sinh,
      cosh,
      tanh,
      asinh,
      acosh,
      atanh,
      pow,
      exp,
      log,
      exp2,
      log2,
      sqrt,
      inversesqrt,
      any,
      equal,
      notEqual,
      lessThan,
      lessThanEqual,
      greaterThan,
      greaterThanEqual,
      not_,
      packDouble2x32,
      unpackDouble2x32,
      packHalf2x16,
      unpackHalf2x16,
      packSnorm2x16,
      unpackSnorm2x16,
      packSnorm4x8,
      unpackSnorm4x8,
      packUnorm2x16,
      unpackUnorm2x16,
      packUnorm4x8,
      unpackUnorm4x8
    };
    implementation_default = glm;
  }
});

// <stdin>
(function(exports2) {
  if (/object/.test(typeof module)) module.exports = exports2;
  else if (/object/.test(typeof window)) window.glm = exports2;
  else globalThis.glm = exports2;
  return exports2;
})((init_implementation(), __toCommonJS(implementation_exports)).default);
