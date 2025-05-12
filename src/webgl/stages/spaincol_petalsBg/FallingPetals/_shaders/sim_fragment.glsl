uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uValueRange;


varying vec2 vUv;

void main() {
    vec3 finalColor = vec3(0.0, 0.0, 0.0);
    finalColor = texture2D(uTexture, vUv).xyz;
    float range = uValueRange.y - uValueRange.x;
    finalColor.x = (finalColor.x - uValueRange.x)/range;
    finalColor.y = (finalColor.y - uValueRange.x)/range;
    float finalAlpha = 1.0;

    gl_FragColor = vec4(finalColor.rgb, finalAlpha);

}