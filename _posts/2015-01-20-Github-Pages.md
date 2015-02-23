---
title: glm-js second working draft
---

<style>button.subtle { border: none; outline: none; }</style>
##### Status

**glm-js** is an experimental JavaScript implementation of the [OpenGL Mathematics (GLM) C++ Library](http://glm.g-truc.net/).

By design glm-js, GLM and GLSL could almost be called siblings.  Here's a fancy table to help illustrate:

| Library | Language   | PU   | Link                    |
|---------|------------|------|-------------------------|
| GLSL    | C (like)   | GPU  | [OpenGL Shading Language](https://www.opengl.org/documentation/glsl/) |
| GLM     | C++        | CPU  | [OpenGL Mathematics](http://glm.g-truc.net/)      |
| glm-js  | JavaScript | JSPU* | [&infin;](#) |

_* JavaScript Processing Unit (or something like that)_

If your JSPU can run WebGL, then it can also run glm-js.

#### Implementation

For now glm-js is implemented as a library wrangler -- stretching existing "backend" math modules into the shape of GLM.  It does this dynamically for the most part, so that the underlying modules can be upgraded and replaced as they continue to evolve separately.
 
Currently-supported backends include:

* [three.js](https://github.com/mrdoob/three.js/) - JavaScript 3D library.
* [glMatrix](https://github.com/toji/gl-matrix) - Javascript Matrix and Vector library for High Performance WebGL apps
* [tdl-fast](https://github.com/greggman/tdl) - A low-level WebGL library

#### Examples

*(soon)*

For now here is one way to tinker with the latest glm-js builds in a console, with node:

```sh
$ git clone https://github.com/humbletim/glm-js.git
$ cd glm-js
> glm = require("./build/glm-three.min");

# the build/*.min.js files contain everything needed bundled-in
#   to tinker with src/ instead, try:
$ env GLM=three node  # or GLM=tdl-fast / GLM=gl-matrix
> glm = require("./src/glm-js");

```

Probably easiest to use glm-js object inspections with the REPL; here's a snippet for that:

```javascript
> glm.$types.forEach(function(p) { glm[p].prototype.inspect = glm.$inspect; });
```

And here are some random, relevant things to type:

```javascript
> glm.vec4(3,2,1,0)
{
  "x": 3,
  "y": 2,
  "z": 1,
  "w": 0
}

> glm.angleAxis(glm.radians(45.0), glm.vec3(0,1,0));
{
  "w": 0.9238795042037964,
  "x": 0,
  "y": 0.3826834261417389,
  "z": 0
}

> glm.perspective(glm.radians(45.0), 4.0 / 3.0, 0.1, 100.0)
{
  "0": {
    "x": 1.8106601238250732,
    "y": 0,
    "z": 0,
    "w": 0
  },
  "1": {
    "x": 0,
    "y": 2.4142136573791504,
    "z": 0,
    "w": 0
  },
  "2": {
    "x": 0,
    "y": 0,
    "z": -1.0020020008087158,
    "w": -1
  },
  "3": {
    "x": 0,
    "y": 0,
    "z": -0.20020020008087158,
    "w": 0
  }
}

```

#### GLMenetics

[GLM](http://glm.g-truc.net/) encourages *mindset* and *code* re-use by substantially adopting the GLSL specification as a basis; to quote from the project's home page:

> GLM provides classes and functions designed and implemented with the same naming conventions and functionalities than GLSL so that when a programmer knows GLSL, he knows GLM as well which makes it really easy to use.

Similarly, **glm-js** provides interfaces designed and implemented with the same naming conventions and functionalities as GLM.

#### Because, 3D math can be portable

The following three examples are roughly the same, despite spanning three different "host" languages (C++, GLSL and JavaScript, respectively).

----------------------
###### <b>*GLM* and *C++11*</b> (typically this would run on one of your main processor cores):

<button class=subtle onclick='with(_gist24f5ce7029b29aa096bd.style)display=display==="block"?"none":"block";'>click for unabridged C++ example</button>
<div style=display:none id=_gist24f5ce7029b29aa096bd>
bonus points: try compiling/running using `c++ -std=c++0x -I/path/to/GLM example.cpp`
{% gist 24f5ce7029b29aa096bd %}</div>


```cpp
#include <glm/glm.hpp>

static auto mrot = glm::angleAxis(glm::radians(45.0f), glm::vec3(0,1,0));

auto m1 = glm::mat4(1.0f); 
auto m2 = glm::mat4(2.0f);

auto m3 = m1 * m2;

m3 *= glm::toMat4(mrot);
```

######&nbsp;
----------------------
###### <b>*GLSL*</b> (typically this would run on your graphics card):

<button class=subtle onclick='with(_gist848e9069c943dd110d5d.style)display=display==="block"?"none":"block";'>click for unabridged GLSL example</button>        
<div style=display:none id=_gist848e9069c943dd110d5d>
bonus points: try pasting this into https://www.shadertoy.com/new
{% gist 848e9069c943dd110d5d %}
</div>

```glsl
mat4 rotationMatrix(vec3 axis, float angle); // forward declaration

mat4 mrot = rotationMatrix(vec3(0.0,1.0,0.0), radians(45.0));

mat4 m1 = mat4(1.0); 
mat4 m2 = mat4(2.0);

mat4 m3 = m1 * m2;

m3 *= mrot;
```
 
######&nbsp;
----------------------
###### <b>*glm-js* and *JavaScript*</b> (typically this would run in your web browser or on node):

<button class=subtle onclick='with(_gist43ffd612a609659dd7a9.style)display=display==="block"?"none":"block";'>click for unabridged JavaScript example</button>
<div style=display:none id=_gist43ffd612a609659dd7a9>
bonus points: try pasting into node (from cloned project directory)
{% gist 43ffd612a609659dd7a9 %}</div>

```javascript
var glm = require('./glm');

this.mrot = this.mrot ||
    glm.angleAxis(glm.radians(45.0), glm.vec3(0,1,0));

var m1 = glm.mat4(1.0); 
var m2 = glm.mat4(2.0);

var m3 = m1['*'](m2);

m3['*='](glm.toMat4(this.mrot));
```

######&nbsp;
----------------------
... and for contrast, consider the same math as above implemented using <b>stock *three.js*</b>:

```javascript
var THREE = require('./three');

this.mrot = this.mrot ||
    new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0,1,0), THREE.Math.degToRad(45.0));  

var m1 = new THREE.Matrix4();  
var m2 = new THREE.Matrix4();
// ... note: we just want a diagonal mat4(2) here, maybe there's a leaner way??
m2.scale(new THREE.Vector3(2.0,2.0,2.0)).elements[15] = 2.0;
 
var m3 = m1.clone().multiply(m2); 
m3.multiply(new THREE.Matrix4().makeRotationFromQuaternion(this.mrot));  
```

#### ...
--------------------

... to be continued!

#### License

* glm-js itself is released under the MIT license - see [glm-js/LICENSE](https://github.com/humbletim/glm-js/blob/master/LICENSE)
* "math vendor" backends are included per individual licenses - see [glm-js/lib/LICENSE.*](https://github.com/humbletim/glm-js/tree/master/lib)

