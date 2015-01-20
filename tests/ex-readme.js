try {
   glm = require("../tests/_glm");
} catch(e) {
   load("tests/_glm.js");
}

(function(log) {
    this.mrot = this.mrot || glm.angleAxis(glm.radians(45.0), glm.vec3(0,1,0));
    //...
    var m1 = glm.mat4(1.0); 
    var m2 = glm.mat4(2.0);
    
    var m3 = m1['*'](m2); // operator sugars
    
    m3['*='](glm.toMat4(this.mrot)); // three.js-style inplace mutation still possible

    log("mrot", this.mrot);
    log("m3", m3);

 })(glm.$log)