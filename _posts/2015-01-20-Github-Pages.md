---
title: glm-js working draft
---

<style>button.subtle { border: none; outline: none; }</style>

**glm-js** is an experimental JavaScript implementation of the [OpenGL Mathematics (GLM) C++ Library](http://glm.g-truc.net/).

#### Introduction

glm-js is imagined with generative qualities in mind &mdash; accessible, easy to learn, easy to master, provides good leverage and adaptable.

Rather than re-inventing the wheel, its lowest-level math functionality is delegated to existing libraries &mdash; which makes room to focus on higher-level abstractions like GLM and GLSL.

A limited (but growing) subset of GLM features are currently supported.  Several "backend" math vendors have been integrated simultaneously &mdash; which makes glm-js one of the most consistent and verifiable ways to access math functionality from JavaScript to date.

* [three.js](https://github.com/mrdoob/three.js/) - JavaScript 3D library. *([&#x2611;](code/test/index.html#three))*
* [glMatrix](https://github.com/toji/gl-matrix) - Javascript Matrix and Vector library for High Performance WebGL apps *([&#x2611;](code/test/index.html#gl-matrix))*
* [tdl-fast](https://github.com/greggman/tdl) - A low-level WebGL library *([&#x2611;](code/test/index.html#tdl-fast))*

#### Jump Start

To use the latest 'kitchen sink' build of **glm-js** (everything needed @ ~97k minified):

###### From the Browser:

* `http://humbletim.github.io/glm-js/code/build/glm-js.min.js` *&mdash; github pages*
* `https://git.io/glm-js.min.js` *&mdash; same, but shortened with git.io*
* `https://cdn.rawgit.com/humbletim/glm-js/31fd034b/build/glm-js.min.js` *&mdash; rawgit CDN*

```html
<script src='https://git.io/glm-js.min.js'></script>
<script>
  console.log('loaded glm-js version: ', glm.version);
  console.log('vec3 example: ', glm.vec3(1,2,3));
</script>
```

*(note: glm-js is also accessible from the current page you're viewing &mdash; just open browser's debug console and see `glm` global)*

###### From Node.js:

```sh
$ npm install glm-js
```

```javascript
var glm = require('glm-js');

console.log('glm-js version: ', glm.version);
console.log('glm.vec3 example: ', glm.vec3(1,2,3));
```

#### Performance

Comparing performance across different JavaScript math libraries can easily lead to both false positives and false negatives, since testing artificial scenarios tends to differ wildly from later practical applications.

But glm-js offers a unique way to conduct such experiments &mdash; instead of hand-crafting test cases three times (across three different backends), you could write your scenarios once and then compare and contrast automatically across multiple, different glm-js backends.

For example, all of the testing (&#x2611;) links above go to the same page and differ only in terms of location hash, which just-in-time selects a backend to run the glm-js [unit tests](https://github.com/humbletim/glm-js/blob/master/test/test.js) live against in your browser.

<a id=GLMenetics></a>
#### "GLMenetics"

A significant inspiration for glm-js is the original [GLM](http://glm.g-truc.net/) C++ project, which effectively encourages *mindset* and *code* re-use by adopting the GLSL specification with purpose &mdash; or in the author's words:

> GLM provides classes and functions designed and implemented with the same naming conventions and functionalities than GLSL so that when a programmer knows GLSL, he knows GLM as well which makes it really easy to use.

Similarly, **glm-js** aims to provide interfaces designed and implemented with the same naming conventions and functionalities as GLM &mdash; extending the reach of GLMenetics to JavaScript:

<a id=glm-js-table></a>

| Library | Language   | PU   | Link                    |
|---------|------------|------|-------------------------|
| GLSL    | C (like)   | GPU  | [OpenGL Shading Language](https://www.opengl.org/documentation/glsl/) |
| GLM     | C++        | CPU  | [OpenGL Mathematics](http://glm.g-truc.net/)      |
| glm-js  | JavaScript | JSPU* | [glm-js](#glm-js-table) |

_* JavaScript Processing Unit_

By using consistent conventions, math code be crafted in a more portable way across space, time, platform and environment.

<a id=examples></a>
#### Examples

To explore the latest glm-js at the shell prompt / using **node**:

```sh
$ git clone https://github.com/humbletim/glm-js.git
$ cd glm-js
$ node # or maybe: rlwrap -a node
> glm = require("./build/glm-js.min");
```

<button class=subtle onclick='with(_altnode.style)display=display==="block"?"none":"block";'>instructions for non-minified glm-js</button>
<div style=display:none id=_altnode>

```sh
# ... specify which backend to use with an environment variable:
$ env GLM=three node  # or GLM=tdl-fast / GLM=gl-matrix
> glm = require("./test/glm-js");

```

</div>

You can also open a browser debug console while on this web page &mdash; glm-js <span data-bind='text: glm.version'></span> has been loaded for you, and can be accessed via browser global `glm` [&equest;](javascript:alert(glm.$symbols.join("\\n")); "inline test").

Depending on browser you might need to append an .inspect() or .toString() for pretty-printed results &mdash; eg: `glm.vec2(window.innerWidth,window.innerHeight).inspect()` [&equest;](javascript:alert(glm.vec2(innerWidth,innerHeight).inspect()); "inline test").


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
