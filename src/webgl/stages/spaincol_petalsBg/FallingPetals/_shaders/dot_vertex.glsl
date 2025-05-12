// VERTEX SHADER

uniform float uTime;            // Time uniform for animation
uniform sampler2D uPetalTexture; // Texture containing the petal image
uniform sampler2D uPosTexture;  // Texture containing the particle positions
uniform vec2 uAtlasSize; // e.g., vec2(4.0, 4.0) for a 4x4 grid

// Attributes
attribute vec2 a_uv;
attribute vec2 a_reference;  // Position of the particle in the reference texture

// Varyings
varying vec2 vUv;
// varying vec3 v_position;

//------------------
void main() {
    vUv = a_uv;

    vec4 posData = texture2D(uPosTexture, a_reference);
    vec3 finalPos = posData.rgb;

    // Set final position
    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 100.0;

    // v_position = finalPos;     
}



