try{ require.exists;}catch(e){require=function(x){load("./src/"+x+'.js');};}
try{
   glm.exists;
} catch(e) {
   try { glm = require("../src/glm-js") || glm; }
   catch(e) { try { load("src/glm-js.js"); } catch(e) { throw new Error('!load')} }
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

function main(log) {
   log(
      glm.to_string(
         transform(
            glm.vec2(0.5, 0.5),
            glm.vec3(1.0, 2.0, 3.0),
            glm.vec3(0.0, 1.0, 0.0)
         ) ['*'] ( glm.vec4(1.0,0.0,0.0,1.0)) 
      )
   );
}

try {
   describe.exists;
   var _main = main;
   main = function(log) {
      try {
         document.location.exists;
         log = function() {
            var t = document.createElement("div");
            t.textContent = [].slice.call(arguments).join(" ");//sprintf.apply(this, arguments);
            document.getElementById('glmlog').appendChild(t);
         }
      } catch(e) {}
      describe('ex-g-truc', function() {
                  it('should run without errors',function() {
                        _main(log);
                     });
               });
   };
} catch(e) {}

main(glm.$log);

// outputs: fvec4(2.788964, 4.828427, -2.363051, -2.158529)