try {
   glm = require("../native-tests/_glm");
} catch(e) {
   load("native-tests/_glm.js");
}

function transform( 
    Orientation, 
    Translate, 
    Up) 
{   
   var Projection = glm.perspective(glm.radians(45.0), 4.0 / 3.0, 0.1, 100.0); 
   //console.log(glm.to_string(Projection));
   var ViewTranslate = glm.translate(glm.mat4(1.0), Translate); 
   var ViewRotateX = glm.rotate(ViewTranslate, Orientation.y, Up); 
   var View = glm.rotate(ViewRotateX, Orientation.x, Up); 
   var Model = glm.mat4(1.0); 
   return Projection ['*'] (View) ['*'] (Model); 
} 

function main() {
   glm.$log(
      glm.to_string(
         transform(
            glm.vec2(0.5, 0.5),
            glm.vec3(1.0, 2.0, 3.0),
            glm.vec3(0.0, 1.0, 0.0)
         ) ['*'] ( glm.vec4(1.0,0.0,0.0,1.0)) 
      )
   );
}

main();

// outputs: fvec4(2.788964, 4.828427, -2.363051, -2.158529)