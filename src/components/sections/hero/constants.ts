export const HERO_SHADER = `
// Function to generate pseudo-random noise
float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Smooth noise using interpolation
float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Generate fractal Brownian motion noise
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
        value += amplitude * smoothNoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// Main fragment shader
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;

    // Center UV coordinates and add a swirl effect
    vec2 p = uv - 0.5;
    float t = iTime * 0.05;
    float angle = fbm(p * 2.0 + t) * 6.28318;
    float radius = length(p);
    p = vec2(
        cos(angle) * p.x - sin(angle) * p.y,
        sin(angle) * p.x + cos(angle) * p.y
    );

    // Create a swirling effect with FBM noise
    float liquidPattern = fbm(p * 4.0 + t);

    // Combine noise and texture sample
    vec2 texCoord = uv / liquidPattern * 0.02;
    texCoord.y = 1.0 - texCoord.y; // Flip Y-coordinate for proper texture mapping
    vec4 textureColor = texture2D(iChannel0, texCoord);

    // Modulate texture with swirling noise
    float colorModulation = 0.5 + 0.5 * sin(liquidPattern * 10.0 + t);
    fragColor = vec4(textureColor.rgb * colorModulation * vec3(1.0, 0.5, 7.0), 1.0);
}
`;