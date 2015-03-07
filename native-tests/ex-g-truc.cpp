#include "_glm.hpp"





glm::mat4 transform( 
    glm::vec2 const & Orientation, 
    glm::vec3 const & Translate, 
    glm::vec3 const & Up) 
{   
    glm::mat4 Projection = glm::perspective(glm::radians(45.0f), 4.0f / 3.0f, 0.1f, 100.0f); 
    //printf("%s\n",glm::to_string(Projection).c_str());
    glm::mat4 ViewTranslate = glm::translate(glm::mat4(1.0f), Translate); 
    glm::mat4 ViewRotateX = glm::rotate(ViewTranslate, Orientation.y, Up); 
    glm::mat4 View = glm::rotate(ViewRotateX, Orientation.x, Up); 
    glm::mat4 Model = glm::mat4(1.0f); 
    return Projection * View * Model; 
} 

int main() {
    printf("GLM C++: %d.%d.%d\n", GLM_VERSION_MAJOR, GLM_VERSION_MINOR, GLM_VERSION_PATCH);
    printf("%s\n",
      glm::to_string(
          transform(
              glm::vec2(0.5f, 0.5f),
              glm::vec3(1.0f, 2.0f, 3.0f),
              glm::vec3(0.0f, 1.0f, 0.0f)
              ) 
          * glm::vec4(1.0f,0.0f,0.0f,1.0f)
          ).c_str());
    return 0;
}

// outputs: fvec4(2.788964, 4.828427, -2.363051, -2.158529)
