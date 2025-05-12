uniform float uTime;
uniform float uTileId;
uniform vec2 uReference; 
uniform sampler2D uPosTexture;
uniform sampler2D uVelTexture;
// uniform sampler2D uDecalsTexture;
uniform sampler2D uPetalTexture;
uniform sampler2D uPetal9Texture;

uniform sampler2D uPetal_0;
uniform sampler2D uPetal_1;
uniform sampler2D uPetal_2;
uniform sampler2D uPetal_3;
uniform sampler2D uPetal_4;
uniform sampler2D uPetal_5;
uniform sampler2D uPetal_6;
uniform sampler2D uPetal_7;
uniform sampler2D uPetal_8;

varying vec2 vUv;
varying vec3 v_position;

void main() {
    vec4 finalColor = vec4(1.0, 1.0, 1.0, 0.1);
    gl_FragColor = vec4(finalColor);

}