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

int nearestInt(float value) {
    return int(round(value));
}

vec2 rotateAroundCenter(vec2 uv, float angle) {
    // Shift the origin to the center
    uv -= 0.5;

    // Apply rotation matrix
    float s = sin(angle);
    float c = cos(angle);
    mat2 rotation = mat2(c, -s, s, c);
    uv = rotation * uv;

    // Shift back
    uv += 0.5;

    return uv;
}

vec4 get_tileTexture(int tileId, sampler2D gridTexture, vec2 uv) {
    // Grid size: 3x3
    const float gridSize = 3.0;

    // Convert tileId to row/column
    float col = float(tileId % 3);
    float row = float(tileId / 3); // floor is automatic for int division

    // Tile UV offset
    vec2 tileOffset = vec2(col, row) / gridSize;

    // Scale down UV to tile space
    vec2 tileUV = uv / gridSize;

    // Final UV to sample from the correct tile
    vec2 finalUV = tileOffset + tileUV;

    return texture2D(gridTexture, finalUV);
}

vec2 get_tileUv1(int tileId, vec2 uv) {
    const float gridSize = 3.0; // 3x3 grid

    // Convert tileId to 2D grid coordinates
    float x = float(tileId % 3);
    float y = float(tileId / 3);

    // Calculate offset per tile
    vec2 tileOffset = vec2(x, y) / gridSize;

    // Scale uv to tile size and offset to the tile position
    vec2 tileUV = uv / gridSize + tileOffset;

    return tileUV;
}

vec2 get_tileUv(int tileId, vec2 uv, float radians) {
    // Grid size (3x3)
    const float tilesPerRow = 3.0;
    const float tileSize = 1.0 / tilesPerRow;

    // Compute tile's row and column
    float col = float(tileId % 3);
    float row = float(tileId / 3);

    // Offset for the tile
    vec2 tileOffset = vec2(col, row) * tileSize;

    // Local UV inside the tile
    vec2 localUv = (uv - tileOffset) / tileSize;

    // Centered UV for rotation
    vec2 centeredUv = localUv - 0.5;

    // Rotate around center
    float c = cos(radians);
    float s = sin(radians);
    mat2 rot = mat2(c, -s, s, c);
    vec2 rotatedUv = rot * centeredUv + 0.5;

    // Convert back to global UVs
    vec2 finalUv = rotatedUv * tileSize + tileOffset;
    return finalUv;
}

vec4 getPetalColor(int tileId, vec2 uv) {
    if (tileId == 0) return texture2D(uPetal_0, uv);
    else if (tileId == 1) return texture2D(uPetal_1, uv);
    else if (tileId == 2) return texture2D(uPetal_2, uv);
    else if (tileId == 3) return texture2D(uPetal_3, uv);
    else if (tileId == 4) return texture2D(uPetal_4, uv);
    else if (tileId == 5) return texture2D(uPetal_5, uv);
    else if (tileId == 6) return texture2D(uPetal_6, uv);
    else if (tileId == 7) return texture2D(uPetal_7, uv);
    else return texture2D(uPetal_8, uv); // default/fallback
}

void main() {
    int tileId = nearestInt(uTileId);
    vec4 finalColor = vec4(0.0, 0.0, 0.0, 1.0);

    vec4 positionTexture = texture2D(uPosTexture, vUv);
    vec4 velocityTexture = texture2D(uVelTexture, vUv);
    vec2 rotatedUv = rotateAroundCenter(vUv, 4.14);
    vec4 petalTexture = getPetalColor(tileId, rotatedUv);

    // finalColor = vec4(vUv, 0.0, 1.0);
    // vec4 tileTexture = get_tileTexture(tileId, uPetalTexture, rotatedUv);


    finalColor = petalTexture;
    // finalColor = texture2D(uPetalTexture, rotatedUv);

    if(finalColor.a < 0.6) {
        finalColor.a = 0.0;
        discard;
    }

    gl_FragColor = vec4(finalColor);

}