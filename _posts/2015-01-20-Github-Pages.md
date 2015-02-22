##### Status

This is a work in progress.

As a starting point I've imported [three.js](https://github.com/mrdoob/three.js/)'s `Vertex`, `Quaternion` and `Matrix` implementations and then stretched them onto the desired GLM interfaces (using brute force and polyfill superglue).

#### Demos

*(jsfiddles etc. coming soon)*

#### Background

I like how [GLM](http://glm.g-truc.net/) encourages both *mindset* and *code* re-use by adopting the GLSL specification. To quote from the project's home page:

> GLM provides classes and functions designed and implemented with the same naming conventions and functionalities than GLSL so that when a programmer knows GLSL, he knows GLM as well which makes it really easy to use.

Similarly, **glm-js** provides interfaces designed and implemented with the same naming conventions and functionalities as GLM and GLSL in mind. 

And for the brave -- I'm also implementing several GLM/GLSL operators, overloads and swizzles. :boom:

#### Shadow Table

<table align=center>
<thead>
<tr>
<th>Library</th>
<th>Language</th>
<th title='(computer|graphics|virtual) processing unit'>PU</th>
<th>Link</th>
</tr>
</thead>
<tbody>
<tr>
<td>GLSL</td>
<td>C (like)</td>
<td>GPU</td>
<td><a href="https://www.opengl.org/documentation/glsl/">OpenGL Shading Language</a></td>
</tr>
<tr>
<td>GLM</td>
<td>C++</td>
<td>CPU</td>
<td><a href="http://glm.g-truc.net/">OpenGL Mathematics</a></td>
</tr>
<tr>
<td>glm-js</td>
<td>JavaScript</td>
<td>JSPU</td>
<td>&infin;</td>
</tr>
</tbody>
</table>


#### Code

*(better JavaScript code examples to follow)*

For now here is a set of examples that all do the same thing -- to demonstrate how similar three of them are and how different stock *three.js* conventions are by comparison.

*GLM* and *C++11*:
```cpp
    #include <glm/glm.hpp>
    //...
    static auto mrot = glm::angleAxis(glm::radians(45.0f), glm::vec3(0,1,0));

    auto m1 = glm::mat4(1.0f); 
    auto m2 = glm::mat4(2.0f);

    auto m3 = m1 * m2;

    m3 *= glm::toMat4(mrot);
```

*GLSL*:

```glsl
    uniform mat4 mrot; // perhaps an incoming glUniform4fv

    mat4 m1 = mat4(1.0); 
    mat4 m2 = mat4(2.0);

    mat4 m3 = m1 * m2;

    //...
    m3 *= mrot;
```

... **glm-js** and *JavaScript*:
```javascript
    var glm = require('./glm');

    this.mrot = this.mrot ||
        glm.angleAxis(glm.radians(45.0), glm.vec3(0,1,0));
    // ...
    var m1 = glm.mat4(1.0); 
    var m2 = glm.mat4(2.0);
    
    var m3 = m1['*'](m2); // operator sugars
    
    m3['*='](glm.toMat4(this.mrot)); // three.js-style inplace mutation
```

Looks at least a little similar, right?  To me all three of those are OpenGL-like, which can be useful to consider when solving complex matrix problems across varying contexts.

And for completeness, here is the same math implemented using stock *three.js* calls:
```javascript
    var THREE = require('./three');

    this.mrot = this.mrot ||
        new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0,1,0), THREE.Math.degToRad(45.0));  
    //...  
    var m1 = new THREE.Matrix4();  
    var m2 = new THREE.Matrix4();
    // ... just want a diagonal mat4(2) here, is there an easier way??
    m2.scale(new THREE.Vector3(2.0,2.0,2.0)).elements[15] = 2.0;
     
    var m3 = m1.clone().multiply(m2); 
    m3.multiply(new THREE.Matrix4().makeRotationFromQuaternion(this.mrot));  
```

#### ... a work in progress

*three.js* includes a comprehensive (and verbose and evolving) set of math interfaces that with effort can be adapted into GLM-style semantics. However, there are other (MIT-licensed) JS math libraries to choose from, and it's possible one or more of them might work better for this.  A few that look promising so far are:

* [Sylvester](https://github.com/jcoglan/sylvester)
* [glMatrix](https://github.com/toji/gl-matrix)
* [Numeric JavaScript](https://github.com/sloisel/numeric)
 
#### License
glm-js itself is released under the MIT license (see LICENSE for details)

