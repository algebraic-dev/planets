precision highp float;
uniform float resolution;
uniform sampler2D u_image;
uniform float time;
varying vec2 v_texCoord;

const int SIZE = 3;

uniform vec2 stars[SIZE];
uniform vec4 colors[SIZE];

float atan2(in float y, in float x){
    if ( (abs(x) > abs(y))) {
      return (3.141592653589793238/2.0 - atan(x,y));
    } else {
      return atan(y,x);
    }
}

vec2 calc_force(vec2 uv, vec2 center){
  float dsquared = pow(length(uv-center), 2.);
  float angle = atan2(uv.y - center.y, uv.x - center.x);
  float force = (100.*(sin(time/10000.0)*0.1 + 1.))/(dsquared);
  float xv = cos(angle) * force;
  float yv = sin(angle) * force;

  return vec2(xv, yv);
}

void main() {
  vec2 uv = ((gl_FragCoord.xy) / 1360.)*50.;
  vec4 final = vec4(0.,0.,0.,1.);
  

  vec4 color = vec4(0. , 0., 0., 0.);
  vec2 force = vec2(0,0);

  for(int i = 0; i < SIZE; i++){
    force += calc_force(uv, stars[i]);  
    float dist = distance(uv, stars[i]);
    float inverse = 1./(dist*1.5);
    color += vec4(inverse, inverse, inverse, 1);
  }

  vec2 fractionary = fract((uv - force + .5)) - .5;
  float width = 0.05;
  float grid = clamp(max( 1.0 - abs((fractionary.y) / width),  1.0 - abs((fractionary.x) / width)), 0., 1.);
  color += vec4(grid * 0.3, grid * 0.3, grid * 0.3, 1.0);

  gl_FragColor = color;
}