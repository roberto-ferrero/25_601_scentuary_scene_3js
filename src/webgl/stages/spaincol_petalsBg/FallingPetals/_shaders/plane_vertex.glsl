uniform float uTime;
uniform vec2 uReference; 
uniform sampler2D uPosTexture;
uniform sampler2D uDecalsTexture;
uniform float uIndex;

varying vec2 vUv;
varying vec3 v_position;


//------------------

void main() {
    vUv = uv;

    // Sample the position texture at the reference UV
    vec4 posData = texture2D(uPosTexture, uReference);

    // Use RGB as XYZ coordinates for final position
    vec3 finalPos = vec3(0.0, 0.0, 0.0);
    finalPos = position;
    finalPos += posData.rgb;
    //finalPos.xy += uIndex*10.0; // Adjust Z position based on index
    // finalPos.x += 10.0;
    // finalPos.x += posDsy*1.0; // Adjust X position based on mouse X
    

    // Set final position
    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);

    gl_Position = projectionMatrix * mvPosition;

    // gl_PointSize = 100.0;
    // gl_PointSize = 10000.0 / length(mvPosition.xyz); // or some other dynamic value


    v_position = finalPos;
     
}