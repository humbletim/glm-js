try{ require.exists;}catch(e){require=function(x){load("./src/"+x+'.js');};}
try{
   glm.exists;
} catch(e) {
   try { glm = require("../src/glm-js") || glm; }
   catch(e) { try { load("src/glm-js.js"); } catch(E) { console.error('!load',e+'',E+''); throw e;} }
}
(function() {
function transform( 
    Orientation, 
    Translate, 
    Up) 
{   
   var Projection = glm.perspective(glm.radians(45.0), 4.0 / 3.0, 0.1, 100.0); 
   glm.$log("Projection",Projection);
   var ViewTranslate = glm.translate(glm.mat4(1.0), Translate); 
   var ViewRotateX = glm.rotate(ViewTranslate, Orientation.y, Up); 
   var View = glm.rotate(ViewRotateX, Orientation.x, Up); 
   var Model = glm.mat4(1.0); 
   glm.$log("Projection",Projection);
   glm.$log("ViewTranslate",ViewTranslate);
   glm.$log("ViewRotateX",ViewRotateX);
   glm.$log("View",View);
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
      if (log !== $GLM_log) alert(["log !== $GLM_log", "log:"+log, "$GLM_log:"+$GLM_log].join("\r\n"))
      $GLM_log('testing');
      log('ex-g-truc');
      describe('ex-g-truc', function() {
                  it('main:ex-g-truc should run without errors',function() {
                        _main(log);
                     });
               });
   };
} catch(e) {}

main(glm.$log);
})();
// outputs: fvec4(2.788964, 4.828427, -2.363051, -2.158529)