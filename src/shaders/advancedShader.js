/**
 * Advanced MOND Shaders
 * Supports multiple particle types and visual modes
 */

export const advancedVertexShader = `
  uniform float uTime;
  uniform float uA0;
  uniform float uCentralMass;
  uniform bool uUseMOND;
  uniform vec3 uCenterPosition;
  uniform float uScaleFactor; // For cosmology mode
  
  attribute float aSize;
  attribute float aParticleType; // 0=BARYON, 1=NEUTRINO, 2=GAS
  attribute float aAlpha;
  
  varying float vAccelerationRatio;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vParticleType;
  
  // MOND interpolation function
  float nuSimple(float y) {
    float safeY = max(y, 0.0001);
    return 0.5 + sqrt(0.25 + 1.0 / safeY);
  }
  
  void main() {
    vec3 pos = position;
    
    // Apply scale factor for cosmology mode
    pos *= uScaleFactor;
    
    // Distance to center
    vec3 toCenter = uCenterPosition - pos;
    float dist = length(toCenter);
    float safeDist = max(dist, 1.0);
    
    // Newtonian acceleration
    float aN = uCentralMass / (safeDist * safeDist);
    
    // MOND acceleration
    float aMag = aN;
    if (uUseMOND) {
      float y = aN / uA0;
      float nu = nuSimple(y);
      aMag = aN / nu;
    }
    
    vAccelerationRatio = aN / uA0;
    vParticleType = aParticleType;
    
    // Color based on particle type
    // BARYON: Electric Cyan
    vec3 baryonColor = vec3(0.133, 0.827, 0.933);
    // NEUTRINO: Dim Purple
    vec3 neutrinoColor = vec3(0.580, 0.330, 1.0) * 0.5;
    // GAS: Orange
    vec3 gasColor = vec3(1.0, 0.5, 0.2);
    
    if (aParticleType < 0.5) {
      vColor = baryonColor;
    } else if (aParticleType < 1.5) {
      vColor = neutrinoColor;
    } else {
      vColor = gasColor;
    }
    
    // Modify color by acceleration regime
    float regime = smoothstep(0.1, 2.0, vAccelerationRatio);
    vColor = mix(vColor, vColor * 1.3, 1.0 - regime);
    
    vAlpha = aAlpha;
    
    // Subtle orbital motion
    float angle = uTime * 0.05 * (1.0 / safeDist);
    float s = sin(angle);
    float c = cos(angle);
    pos.x = position.x * c - position.z * s;
    pos.z = position.x * s + position.z * c;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Point size
    gl_PointSize = aSize * (400.0 / -mvPosition.z);
  }
`;

export const advancedFragmentShader = `
  varying float vAccelerationRatio;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vParticleType;
  
  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // Soft edge
    float alpha = smoothstep(0.5, 0.15, dist) * vAlpha;
    
    // Core glow for baryons and gas
    float core = 0.0;
    if (vParticleType < 0.5 || vParticleType > 1.5) {
      core = smoothstep(0.25, 0.0, dist) * 0.4;
    }
    
    gl_FragColor = vec4(vColor, alpha + core);
  }
`;

// Line shader for connections
export const connectionVertexShader = `
  attribute float aOpacity;
  attribute vec3 aColor;
  varying float vOpacity;
  varying vec3 vColor;
  
  void main() {
    vOpacity = aOpacity;
    vColor = aColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const connectionFragmentShader = `
  varying float vOpacity;
  varying vec3 vColor;
  
  void main() {
    gl_FragColor = vec4(vColor, vOpacity * 0.25);
  }
`;

export default {
    advancedVertexShader,
    advancedFragmentShader,
    connectionVertexShader,
    connectionFragmentShader,
};
