// FRAGMENT SHADER

uniform float uTime;
uniform sampler2D uPosTexture;
uniform sampler2D uPetalTexture;
uniform vec2 uAtlasSize; // e.g., vec2(4.0, 4.0) for a 4x4 grid

varying vec2 vUv;
// varying vec3 v_position;


void main() {
    vec2 atlasSize = vec2(1.0, 1.0); // e.g., vec2(4.0, 4.0) for a 4x4 grid
    vec2 tileUV = (gl_PointCoord / atlasSize);
    vec4 finalColor = vec4(0.0, 0.0, 0.0, 1.0);

    // finalColor = vec4(gl_PointCoord, 0.0, 1.0);
    finalColor = vec4(tileUV, 0.0, 1.0);
    // finalColor = texture2D(uPetalTexture, gl_PointCoord);
    finalColor = texture2D(uPetalTexture, tileUV);

    gl_FragColor = vec4(finalColor);

}


