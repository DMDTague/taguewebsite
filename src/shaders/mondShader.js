/**
 * MOND Physics Shaders
 * Ported from mond_physics_engine.c
 * 
 * ν(y) = 0.5 + sqrt(0.25 + 1/y) — Simple interpolation function
 */

export const mondVertexShader = `
  uniform float uTime;
  uniform float uA0;           // MOND acceleration scale
  uniform float uCentralMass;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;
  uniform bool uUseMOND;
  uniform vec3 uCenterPosition;
  
  attribute float aVelocityX;
  attribute float aVelocityY;
  attribute float aVelocityZ;
  attribute float aSize;
  
  varying float vAccelerationRatio;
  varying vec3 vColor;
  varying float vAlpha;
  
  // MOND interpolation function: ν(y) = 0.5 + sqrt(0.25 + 1/y)
  float nuSimple(float y) {
    float safeY = max(y, 0.0001);
    return 0.5 + sqrt(0.25 + 1.0 / safeY);
  }
  
  // Calculate MOND acceleration
  float calculateMONDAcceleration(float aN, float a0) {
    float y = abs(aN) / a0;
    float nu = nuSimple(y);
    return aN / nu;
  }
  
  void main() {
    vec3 pos = position;
    
    // Distance to center
    vec3 toCenter = uCenterPosition - pos;
    float dist = length(toCenter);
    float safeDist = max(dist, 1.0);
    
    // Newtonian acceleration: a = GM/r²
    float aN = uCentralMass / (safeDist * safeDist);
    
    // Apply MOND if enabled
    float aMag;
    if (uUseMOND) {
      aMag = calculateMONDAcceleration(aN, uA0);
    } else {
      aMag = aN;
    }
    
    // Calculate acceleration ratio for coloring
    vAccelerationRatio = aN / uA0;
    
    // Color based on regime
    // Deep MOND (low a): cyan, High a (Newtonian): white
    float regime = smoothstep(0.1, 2.0, vAccelerationRatio);
    vec3 mondColor = vec3(0.133, 0.827, 0.933);    // Electric Cyan #22d3ee
    vec3 newtonColor = vec3(0.886, 0.910, 0.941);  // Slate-200
    vColor = mix(mondColor, newtonColor, regime);
    
    // Alpha based on distance and acceleration
    vAlpha = smoothstep(500.0, 50.0, dist) * (0.5 + 0.5 * (1.0 - regime));
    
    // Slight orbital motion simulation
    float angle = uTime * 0.1 * (1.0 / safeDist);
    float s = sin(angle);
    float c = cos(angle);
    pos.x = position.x * c - position.z * s;
    pos.z = position.x * s + position.z * c;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Point size based on distance and attribute
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
  }
`;

export const mondFragmentShader = `
  varying float vAccelerationRatio;
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    // Circular point shape
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // Soft edge glow
    float alpha = smoothstep(0.5, 0.2, dist) * vAlpha;
    
    // Add core glow
    float core = smoothstep(0.3, 0.0, dist) * 0.5;
    
    gl_FragColor = vec4(vColor, alpha + core);
  }
`;

// Line shader for connections
export const lineVertexShader = `
  attribute float aOpacity;
  varying float vOpacity;
  
  void main() {
    vOpacity = aOpacity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const lineFragmentShader = `
  uniform vec3 uColor;
  varying float vOpacity;
  
  void main() {
    gl_FragColor = vec4(uColor, vOpacity * 0.3);
  }
`;

export default {
    mondVertexShader,
    mondFragmentShader,
    lineVertexShader,
    lineFragmentShader
};
