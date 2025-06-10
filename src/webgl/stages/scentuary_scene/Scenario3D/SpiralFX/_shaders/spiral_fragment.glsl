// fragment.glsl
precision mediump float;

uniform sampler2D uTexture;
uniform float uShowProgress;

varying float vAlpha;
varying vec2 vUv;

void main() {
    vec4 texColor = texture2D(uTexture, gl_PointCoord);

    float d = distance(gl_PointCoord, vec2(0.5));
    float falloff = smoothstep(0.5, 0.0, d);
    // falloff = 1.0;
    vec3 color = vec3(1.0, 0.8, 1.0); // pinkish-white

    float alpha = texColor.a * vAlpha;
    alpha =1.0*uShowProgress;

    gl_FragColor = vec4(color, falloff * alpha);
}