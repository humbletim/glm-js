---
title: glm-js working draft
---

<style>button.subtle { border: none; outline: none; }</style>

**glm-js** is an experimental JavaScript implementation of the [OpenGL Mathematics (GLM) C++ Library](http://glm.g-truc.net/).

#### Introduction

glm-js is being designed with several *generative qualities* in mind:

* accessible
* easy to learn
* easy to master
* provides good leverage
* adaptable

And instead of re-inventing the wheels of math, the lowest-level aspects are delegated to existing math libraries -- making room for the higher-level abstractions of GLM and GLSL to emerge.

Using an advanced "dynamic linking" approach, glm-js is able to efficiently adapt several "backend" math vendors simultaneously, including selection of a math backend at runtime. 

* [three.js](https://github.com/mrdoob/three.js/) - JavaScript 3D library. *([&#x2611;](code/test/index.html#three))*
* [glMatrix](https://github.com/toji/gl-matrix) - Javascript Matrix and Vector library for High Performance WebGL apps *([&#x2611;](code/test/index.html#gl-matrix))*
* [tdl-fast](https://github.com/greggman/tdl) - A low-level WebGL library *([&#x2611;](code/test/index.html#tdl-fast))*

#### Performance

Comparing performance across different JavaScript math libraries can be like comparing the juicing of oranges to the baking of apple pies.

But glm-js offers a different way to run those experiments -- instead of hand-crafting test cases three times across three backends, you write your test cases once and then glm-js does the rest. 

For example, all of the testing (&#x2611;) links above go to the exact same page and differ only in the location hash, which identfies a particular back-end to run the live glm-js [unit tests](https://github.com/humbletim/glm-js/blob/master/test/test.js) against in your browser.

<a id=GLMenetics></a>
#### GLMenetics?

[GLM](http://glm.g-truc.net/) seems to encourage a great deal of *mindset* and *code* re-use, in part by substantially adopting the GLSL specification; or to quote from the project's home page:

> GLM provides classes and functions designed and implemented with the same naming conventions and functionalities than GLSL so that when a programmer knows GLSL, he knows GLM as well which makes it really easy to use.

Similarly, **glm-js** aims to provide interfaces designed and implemented with the same naming conventions and functionalities as GLM -- extending the reach of GLMenetics out into JavaScript:

<a id=glm-js-table></a>

| Library | Language   | PU   | Link                    |
|---------|------------|------|-------------------------|
| GLSL    | C (like)   | GPU  | [OpenGL Shading Language](https://www.opengl.org/documentation/glsl/) |
| GLM     | C++        | CPU  | [OpenGL Mathematics](http://glm.g-truc.net/)      |
| glm-js  | JavaScript | JSPU* | [glm-js](#glm-js-table) |

_* JavaScript Processing Unit_

Coding along these lines, math code can be crafted more portably across space, time, platform and environment.

<a id=examples></a>
#### Examples

To explore the latest glm-js at the shell prompt / using **node**:

```sh
$ git clone https://github.com/humbletim/glm-js.git
$ cd glm-js
$ node # or maybe: rlwrap -a node
> glm = require("./build/glm-three.min");
```

<button class=subtle onclick='with(_altnode.style)display=display==="block"?"none":"block";'>instructions for non-minified glm-js</button>
<div style=display:none id=_altnode>

```sh
# ... specify which backend to use with an environment variable:
$ env GLM=three node  # or GLM=tdl-fast / GLM=gl-matrix
> glm = require("./src/glm-js");

```

</div>

You can also open a browser debug console while on this web page -- glm-js <span data-bind='text: glm.version'></span> has been loaded for you, and can be accessed via browser global `glm` [&equest;](javascript:alert(glm.$symbols.join("\\n")); "inline test").

Depending on browser you might need to append an .inspect() or .toString() for pretty-printed results -- eg: `glm.vec2(window.innerWidth,window.innerHeight).inspect()` [&equest;](javascript:alert(glm.vec2(innerWidth,innerHeight).inspect()); "inline test").


And here are some relevant things to try typing [&equest;](javascript:(function(str){console.warn(str);return alert(str);})("glm.vec4(3,2,1,0);v = glm.vec4(1), v.xyz = [.1,.2,.3], v.toString();v['*='](5);q = glm.angleAxis(glm.radians(45.0), glm.vec3(0,1,0));glm.degrees(glm.eulerAngles(q));v['*'](q);glm.perspective(glm.radians(45.0), 4.0 / 3.0, 0.1, 100.0).toString();glm.perspective(glm.radians(45.0), 4.0 / 3.0, 0.1, 100.0)".split(";").map(function(js) { var V = eval("1,"+js); return js+"\\n\\t"+("string"===typeof(V)?V:glm.$inspect(V)); }).join("\\n")); "inline test"):

```javascript
> glm.vec4(3,2,1,0)
{
  "x": 3,
  "y": 2,
  "z": 1,
  "w": 0
}

> v = glm.vec4(1), v.xyz = [.1,.2,.3], v.toString()
'fvec4(0.100000, 0.200000, 0.300000, 1.000000)'

> v['*='](5) // or v.mul_eq(5)
{
  "x": 0.5,
  "y": 1,
  "z": 1.5,
  "w": 5
}

> q = glm.angleAxis(glm.radians(45.0), glm.vec3(0,1,0));
{
  "w": 0.9238795042037964,
  "x": 0,
  "y": 0.3826834261417389,
  "z": 0
}

> glm.degrees(glm.eulerAngles(q))
{
  "x": 0,
  "y": 44.999996185302734,
  "z": 0
}

> v['*'](q) // or v.mul(q)
{
  "x": 1.4142135381698608,
  "y": 1,
  "z": 0.7071067690849304,
  "w": 5
}

> glm.perspective(glm.radians(45.0), 4.0 / 3.0, 0.1, 100.0).toString()
mat4x4(
    (1.810660, 0.000000, 0.000000, 0.000000), 
    (0.000000, 2.414214, 0.000000, 0.000000), 
    (0.000000, 0.000000, -1.002002, -1.000000), 
    (0.000000, 0.000000, -0.200200, 0.000000)
)

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

######&nbsp;
----------------------
#### Trans-Porting 3D Math

The following three snippets are roughly the same despite spanning different "host" languages ([GLSL](#glsl), [C++](#cxx) and [JavaScript](#js), respectively).

----------------------
###### <b id=glsl>*GLSL*</b> (typically this would run on your graphics card):
<font style=float:right size=-2>[GLSL](#glsl) | [GLM C++](#cxx) | [glm-js](#js) | [three-js](#three-js)</font>

<button class=subtle onclick='with(_gist848e9069c943dd110d5d.style)display=display==="block"?"none":"block";'>click for unabridged GLSL example</button>        
<div style=display:none id=_gist848e9069c943dd110d5d>
*bonus points: try pasting this code into https://www.shadertoy.com/new*
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
###### <b id=cxx>*GLM* and *C++11*</b> (typically this would run on one of your main processor cores):
<font style=float:right size=-2>[GLSL](#glsl) | [GLM C++](#cxx) | [glm-js](#js) | [three-js](#three-js)</font>

<button class=subtle onclick='with(_gist24f5ce7029b29aa096bd.style)display=display==="block"?"none":"block";'>click for unabridged C++ example</button>
<div style=display:none id=_gist24f5ce7029b29aa096bd>
*bonus points: try compiling/running using `c++ -std=c++0x -I/path/to/GLM example.cpp && ./a.out`*
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
###### <b id=js>*glm-js* and *JavaScript*</b> (typically this would run in your web browser or on node):
<font style=float:right size=-2>[GLSL](#glsl) | [GLM C++](#cxx) | [glm-js](#js) | [three-js](#three-js)</font>

<button class=subtle onclick='with(_gist43ffd612a609659dd7a9.style)display=display==="block"?"none":"block";'>click for unabridged JavaScript example</button>
<div style=display:none id=_gist43ffd612a609659dd7a9>
*bonus points: try pasting into node (from cloned project directory)*
{% gist 43ffd612a609659dd7a9 %}</div>

```javascript
var glm = require('./glm');

this.mrot = this.mrot || glm.angleAxis(glm.radians(45.0), glm.vec3(0,1,0));

var m1 = glm.mat4(1.0); 
var m2 = glm.mat4(2.0);

var m3 = m1['*'](m2);

m3['*='](glm.toMat4(this.mrot));
```

######&nbsp;
----------------------
###### <span id=three-js>*three-js* and *JavaScript*</span>:
<font style=float:right size=-2>[GLSL](#glsl) | [GLM C++](#cxx) | [glm-js](#js) | [three-js](#three-js)</font>

... here's the same math as above, implemented here using stock *three.js*:

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

<script>
  [].forEach.call(document.querySelectorAll("*[id]"), function(n) { window[n.id] = n; });
</script>
