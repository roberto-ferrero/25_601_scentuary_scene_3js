uniform float uTime;
uniform sampler2D uPosTexture;
uniform sampler2D uVelTexture;
uniform vec2 uStageDimensions;

varying vec2 vUv;
varying vec4 v_randoms;


// Hash function for randomness
float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

// Time-based random function
float randomFromTime(float scale) {
    return hash(uTime * scale);
}

void main() {


    vec3 finalColor = vec3(0.0, 0.0, 0.0);

    vec4 velocityTexture = texture2D(uVelTexture, vUv);
    vec4 positionTexture = texture2D(uPosTexture, vUv);

    vec2 position = positionTexture.xy;
    vec2 velocity = velocityTexture.xy;

    float rotation = velocityTexture.z;

    position += velocity;

    float margin = 100.0;
    float min_x_limit = -((uStageDimensions.x*0.5)+margin);
    float max_x_limit = ((uStageDimensions.x*0.5)+margin);
    float min_y_limit = -((uStageDimensions.y*0.5)+margin);
    float max_y_limit = ((uStageDimensions.y*0.5)+margin);

    float rnd = randomFromTime(0.1);
    if(position.x < min_x_limit || position.x > max_x_limit) {
        position.x = -position.x;
        // position.x = mix(min_x_limit, max_x_limit, v_randoms.x);
    } else if(position.y < min_y_limit) {
        position.y = -position.y*0.95;
        position.x = mix(min_x_limit*0.9, max_x_limit*0.9, rnd);
    } else if(position.y > max_y_limit) {
        position.y = -position.y*0.95;
        position.x = mix(min_x_limit*0.9, max_x_limit*0.9, rnd);
    }


    finalColor = vec3(position.x, position.y, rotation);
    float finalAlpha = 1.0;

    gl_FragColor = vec4(finalColor.rgb, finalAlpha);

}