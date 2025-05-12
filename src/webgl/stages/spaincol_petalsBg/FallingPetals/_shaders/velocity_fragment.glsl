uniform float uTime;
uniform float uTimeDelta;
uniform sampler2D uVelTexture;
uniform sampler2D uPosTexture;
uniform vec3 uMouseIntersectPosition;
uniform float uMouseIntersectSpeed;
uniform vec2 uWind;

varying vec2 vUv;
varying vec4 v_randoms;

void main() {
    // Parameters
    float repulseStrength = 600.0*v_randoms.x; // try between 0.5 - 2.0
    // float repulseStrength = 300.3; // try between 0.5 - 2.0
    float friction = 0.96+(0.03*v_randoms.x);       // try between 0.9 - 0.99

    // Current velocity and position
    vec3 velocity = texture2D(uVelTexture, vUv).xyz;
    vec3 position = texture2D(uPosTexture, vUv).xyz;

    vec2 position2D = position.xy;
    vec2 intersectPosition2D = uMouseIntersectPosition.xy;
    vec2 toParticle2D = position2D - intersectPosition2D;
    float dist2D = length(toParticle2D);
    float falloff2D = 1.0 / (dist2D * dist2D + 0.01); // inverse square falloff
    vec2 repulseForce2D = normalize(toParticle2D) * repulseStrength * falloff2D;

    //-----------------
    vec2 gravity = vec2(0.0, -0.1); // Gravity force
    vec2 wind = vec2(0.0, 0.0); // Wind force
    wind = uWind; // Wind force from uniform
    //-----------------



    velocity.xy += wind.xy * 0.0001; // Apply wind to velocity
    velocity.xy += gravity.xy * 0.1; // Apply gravity to velocity
    velocity.xy += repulseForce2D.xy * 1.0;
    velocity.xy *= friction;

    //-----------------
    // Stop Velocity
    float stopVelocity = 0.01;
    if(length(velocity.xy) < stopVelocity) {
        // velocity.xy = vec2(0.0, 0.0);
    }
    //-----------------

    //-----------------
    // Clamp Max Velocity
    float maxVelocity = 5.0;
    if(length(velocity.xy) > maxVelocity) {
        velocity.xy = normalize(velocity.xy) * maxVelocity;
    }
    //-----------------


    // float zFoo = length(velocity.xy);
    // velocity.z -= zFoo*0.06;
    // velocity.xy += uTime*0.01;
    
    // velocity = v_randoms.xyz;

    gl_FragColor = vec4(velocity, 1.0);


    // vec3 finalColor = vec3(0.0, 0.0, 0.0);
    // finalColor = texture2D(uVelTexture, vUv).xyz;
    // float finalAlpha = 1.0;

    // gl_FragColor = vec4(finalColor.rgb, finalAlpha);

}