try {
   glm = require("../tests/_glm");
} catch(e) {
   load("tests/_glm.js");
}

(function(log) {
    //var THREE = require('./three');

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

    log("mrot", new glm.quat(this.mrot));
    log("m3", new glm.mat4(m3));
 })(glm.$log);