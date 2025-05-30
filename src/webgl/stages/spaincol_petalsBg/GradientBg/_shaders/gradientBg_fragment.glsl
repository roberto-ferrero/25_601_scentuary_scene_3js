//#pragma glslify: blur1 = require('glsl-fast-gaussian-blur/13')
// varying vec3 vPosition;
// varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColorTouch;
uniform float uFooterProgress;

varying vec2 vUv;
varying vec3 v_position;
varying float v_noise;
varying float v_colorStrength1;
varying float v_colorStrength2;
varying float v_colorStrength3;

varying float vPulseNum_0;
varying float vPulseProgress_0;

//#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)


//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

float get_escalaNoise(float x, float y, float amplitudMapa, float progress){
    float valor = cnoise(vec3(x/amplitudMapa, y/amplitudMapa, progress));
    valor = -0.5+(valor*2.);
    //valor = valor*2.; // x2 Intesifica el contraste
    return valor;
}

float random2(vec2 c){
    // return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
    return 0.0;
}
// float randomNoise(vec2 p) {
//   return (random2(p - vec2(sin(time))) * 2.0 - 1.0) * max(length(acceleration), 0.08);
// }

void main() {

    float incr = 0.0;
    float random = random2(vec2(v_position.x+incr, v_position.y+incr));
    vec3 rndColor = vec3(random/1., random/1., random/1.);
    float randomStrength = (v_colorStrength1+v_colorStrength2+v_colorStrength3)/3.;

    vec3 colorBlanco = vec3(1.0, 1.0, 1.0);
    vec3 mixColor = uColor0;

    vec2 noiseUv = vUv;
    float colorStrength1 = get_escalaNoise(noiseUv.x, noiseUv.y, 0.4, uTime*0.5);
    colorStrength1 = clamp(colorStrength1, 0., 0.9 ); // clamp(valor, min, max)
    colorStrength1 *= 0.4;
    mixColor = mix(mixColor, uColor1, colorStrength1);
    // mixColor = mix(mixColor, uColor2, v_colorStrength2);
    // mixColor = mix(mixColor, uColor3, v_colorStrength3*0.5);
    // mixColor = mix(mixColor, rndColor, 0.03+(randomStrength*0.3));
    // mixColor = mix(mixColor, uColorTouch, uFooterProgress);


    //mixColor = mix(mixColor, vec3(v_noise, v_noise, v_noise), 1.);

    //mixColor = mix(mixColor, uColor0, centralColor);
    //gl_FragColor = vec4(v_noise, 0.0, 0.0, 1.0);
    //gl_FragColor = vec4(mixColor, 1.0);
    gl_FragColor = vec4(mixColor, 1.0);
}

