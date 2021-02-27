precision highp float;


const int SIZE = 3;
uniform float resolution;
uniform vec4 colors[SIZE];
uniform vec2 stars[SIZE];

attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
        
void main(){
    vec4 uv_resolution = vec4(1, -1, 1, 1)*resolution;
	gl_Position = uv_resolution * vec4(a_position, 1, 1);
	v_texCoord = a_texCoord;
}