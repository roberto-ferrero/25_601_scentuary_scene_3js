// vertex.glsl
precision mediump float;

uniform float uTime;
uniform float uShowProgress;

attribute float aAngle;
attribute float aRadius;
attribute float aSpeed;
attribute vec3 aRandomness;

varying float vAlpha;
varying vec2 vUv;

void main() {

    vUv = uv;

    vAlpha = 1.0 - (position.y / 1.5); // fade as it rises

    vec3 finalPosition = position;

    finalPosition.y = finalPosition.y * uShowProgress;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
    gl_PointSize = 10.0*aRandomness.x*vAlpha;
}