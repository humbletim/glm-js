var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
function applySwizzling(vecClass, vec22, vec32, vec42) {
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
            return new vec32(this.elements[componentMap[c1]], this.elements[componentMap[c2]], this.elements[componentMap[c3]]);
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

// implementation/base.js
var GLMBaseMixin;
var init_base = __esm({
  "implementation/base.js"() {
    GLMBaseMixin = (superclass) => class extends superclass {
      clone() {
        return new this.constructor(this);
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
        return this.equal(other);
      }
      "~="(other) {
        return this.epsilonEqual(other);
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
        const className = this.constructor.name;
        const elements = Array.from(this.elements.slice(0, 4)).join(", ");
        const ellipsis = this.elements.length > 4 ? ", ..." : "";
        return `${className}.elements=[${elements}${ellipsis}]`;
      }
    };
  }
});

// implementation/vec.js
var vec2, vec3, vec4;
var init_vec = __esm({
  "implementation/vec.js"() {
    init_swizzle();
    init_base();
    vec2 = class _vec2 extends GLMBaseMixin(class {
    }) {
      constructor(x, y) {
        super();
        Object.defineProperty(this, "elements", { value: new Float32Array(2) });
        if (x instanceof _vec2 || x instanceof vec3 || x instanceof vec4) {
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
    vec3 = class _vec3 extends GLMBaseMixin(class {
    }) {
      constructor(x, y, z) {
        super();
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
          this.elements[0] = x || 0;
          this.elements[1] = y || 0;
          this.elements[2] = z || 0;
        }
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
        Object.defineProperty(this, "elements", { value: new Float32Array(4) });
        if (x instanceof _vec4) {
          this.elements[0] = x.elements[0];
          this.elements[1] = x.elements[1];
          this.elements[2] = x.elements[2];
          this.elements[3] = x.elements[3];
        } else if (x instanceof vec3) {
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
          this.elements[0] = x || 0;
          this.elements[1] = y || 0;
          this.elements[2] = z || 0;
          this.elements[3] = w || 0;
        }
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
    applySwizzling(vec2, vec2, vec3, vec4);
    applySwizzling(vec3, vec2, vec3, vec4);
    applySwizzling(vec4, vec2, vec3, vec4);
  }
});

// implementation/functions.js
var functions_exports = {};
__export(functions_exports, {
  add: () => add,
  angle: () => angle,
  axis: () => axis,
  clamp: () => clamp,
  cross: () => cross,
  diagonal3x3: () => diagonal3x3,
  diagonal4x4: () => diagonal4x4,
  distance: () => distance,
  div: () => div,
  dot: () => dot,
  eulerAngles: () => eulerAngles,
  length: () => length,
  length2: () => length2,
  mix: () => mix,
  mul: () => mul,
  normalize: () => normalize,
  pitch: () => pitch,
  project: () => project,
  roll: () => roll,
  rotate: () => rotate,
  scale: () => scale,
  sub: () => sub,
  toMat4: () => toMat4,
  translate: () => translate,
  unProject: () => unProject,
  yaw: () => yaw
});
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
function clamp(a, min, max) {
  const out = new a.constructor();
  for (let i = 0; i < a.elements.length; i++) {
    out.elements[i] = Math.max(min, Math.min(max, a.elements[i]));
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
  return new vec3(obj);
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
  return new vec3(tmp);
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
    return new vec3(0, 0, 1);
  }
  const tmp2 = 1 / Math.sqrt(tmp1);
  return new vec3(q.elements[0] * tmp2, q.elements[1] * tmp2, q.elements[2] * tmp2);
}
function roll(q) {
  return Math.atan2(2 * (q.elements[0] * q.elements[1] + q.elements[3] * q.elements[2]), q.elements[3] * q.elements[3] + q.elements[0] * q.elements[0] - q.elements[1] * q.elements[1] - q.elements[2] * q.elements[2]);
}
function pitch(q) {
  return Math.atan2(2 * (q.elements[1] * q.elements[2] + q.elements[3] * q.elements[0]), q.elements[3] * q.elements[3] - q.elements[0] * q.elements[0] - q.elements[1] * q.elements[1] + q.elements[2] * q.elements[2]);
}
function yaw(q) {
  return Math.asin(Math.max(-1, Math.min(1, -2 * (q.elements[0] * q.elements[2] - q.elements[3] * q.elements[1]))));
}
function eulerAngles(q) {
  return new vec3(pitch(q), yaw(q), roll(q));
}
var init_functions = __esm({
  "implementation/functions.js"() {
    init_mat();
    init_vec();
  }
});

// implementation/mat.js
function transpose(m) {
  return m.transpose();
}
function inverse(m) {
  return m.inverse();
}
function lookAt(eye, center, up) {
  const out = new mat4();
  const f = normalize(center["-"](eye));
  const s = normalize(cross(f, up));
  const u = cross(s, f);
  out.elements[0] = s.elements[0];
  out.elements[1] = u.elements[0];
  out.elements[2] = -f.elements[0];
  out.elements[3] = 0;
  out.elements[4] = s.elements[1];
  out.elements[5] = u.elements[1];
  out.elements[6] = -f.elements[1];
  out.elements[7] = 0;
  out.elements[8] = s.elements[2];
  out.elements[9] = u.elements[2];
  out.elements[10] = -f.elements[2];
  out.elements[11] = 0;
  out.elements[12] = -dot(s, eye);
  out.elements[13] = -dot(u, eye);
  out.elements[14] = dot(f, eye);
  out.elements[15] = 1;
  return out;
}
function perspective(fovy, aspect, near, far) {
  const out = new mat4();
  const f = 1 / Math.tan(fovy / 2);
  out.elements[0] = f / aspect;
  out.elements[1] = 0;
  out.elements[2] = 0;
  out.elements[3] = 0;
  out.elements[4] = 0;
  out.elements[5] = f;
  out.elements[6] = 0;
  out.elements[7] = 0;
  out.elements[8] = 0;
  out.elements[9] = 0;
  out.elements[11] = -1;
  out.elements[12] = 0;
  out.elements[13] = 0;
  out.elements[15] = 0;
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
  const out = new mat4();
  const lr = 1 / (left - right);
  const bt = 1 / (bottom - top);
  const nf = 1 / (near - far);
  out.elements[0] = -2 * lr;
  out.elements[1] = 0;
  out.elements[2] = 0;
  out.elements[3] = 0;
  out.elements[4] = 0;
  out.elements[5] = -2 * bt;
  out.elements[6] = 0;
  out.elements[7] = 0;
  out.elements[8] = 0;
  out.elements[9] = 0;
  out.elements[10] = 2 * nf;
  out.elements[11] = 0;
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
function slerp(q1, q2, t) {
  const out = new quat();
  let cosTheta = q1.elements[0] * q2.elements[0] + q1.elements[1] * q2.elements[1] + q1.elements[2] * q2.elements[2] + q1.elements[3] * q2.elements[3];
  if (Math.abs(cosTheta) >= 1) {
    out.elements.set(q1.elements);
    return out;
  }
  if (cosTheta < 0) {
    q2.elements[0] = -q2.elements[0];
    q2.elements[1] = -q2.elements[1];
    q2.elements[2] = -q2.elements[2];
    q2.elements[3] = -q2.elements[3];
    cosTheta = -cosTheta;
  }
  const halfTheta = Math.acos(cosTheta);
  const sinHalfTheta = Math.sqrt(1 - cosTheta * cosTheta);
  if (Math.abs(sinHalfTheta) < 1e-3) {
    out.elements[0] = q1.elements[0] * 0.5 + q2.elements[0] * 0.5;
    out.elements[1] = q1.elements[1] * 0.5 + q2.elements[1] * 0.5;
    out.elements[2] = q1.elements[2] * 0.5 + q2.elements[2] * 0.5;
    out.elements[3] = q1.elements[3] * 0.5 + q2.elements[3] * 0.5;
    return out;
  }
  const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
  const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
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
    quat = class _quat extends GLMBaseMixin(class {
    }) {
      constructor(w, x, y, z) {
        super();
        Object.defineProperty(this, "elements", { value: new Float32Array([0, 0, 0, 1]) });
        if (typeof w === "number" && x === void 0) {
        } else if (w instanceof _quat) {
          this.elements.set(w.elements);
        } else if (typeof w === "number") {
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
  return degrees2 * Math.PI / 180;
}
function degrees(radians2) {
  return radians2 * 180 / Math.PI;
}
var init_common = __esm({
  "implementation/common.js"() {
  }
});

// implementation/index.js
var implementation_exports = {};
__export(implementation_exports, {
  default: () => implementation_default
});
var mat3Factory, mat4Factory, quatFactory, vec2Factory, vec3Factory, vec4Factory, glm, implementation_default;
var init_implementation = __esm({
  "implementation/index.js"() {
    init_vec();
    init_mat();
    init_quat();
    init_functions();
    init_common();
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
        return new vec3(...args);
      }
      return new vec3(...args);
    };
    vec3Factory.prototype = vec3.prototype;
    vec4Factory = function(...args) {
      if (this instanceof vec4Factory) {
        return new vec4(...args);
      }
      return new vec4(...args);
    };
    vec4Factory.prototype = vec4.prototype;
    glm = {
      vec2: vec2Factory,
      vec3: vec3Factory,
      vec4: vec4Factory,
      mat3: mat3Factory,
      mat4: mat4Factory,
      quat: quatFactory,
      angleAxis,
      epsilon: () => 1e-6,
      radians,
      degrees,
      inverse,
      transpose,
      lookAt,
      perspective,
      ortho,
      slerp,
      ...functions_exports
    };
    implementation_default = glm;
  }
});

// <stdin>
module.exports = (init_implementation(), __toCommonJS(implementation_exports)).default;
