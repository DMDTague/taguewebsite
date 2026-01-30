/**
 * MOND Physics Engine - Ported from mond_physics_engine.c
 * 
 * Implements Modified Newtonian Dynamics (Milgrom 1983)
 * Using the "simple" interpolation function: ν(y) = (0.5 + sqrt(0.25 + 1/y))
 * 
 * Key physics:
 * - a₀ (MOND acceleration constant) ≈ 1.2 × 10⁻¹⁰ m/s²
 * - In low-acceleration regime (a << a₀): a = √(aₙ × a₀)
 * - In high-acceleration regime (a >> a₀): a ≈ aₙ (Newtonian)
 */

// Physical constants (scaled for visualization)
const MOND_CONSTANTS = {
  a0: 0.0001,           // MOND acceleration scale (visualization units)
  G: 1.0,               // Gravitational constant (normalized)
  centralMass: 500,     // Central attractor mass
  mouseInfluence: 200,  // External field effect strength
  damping: 0.999,       // Velocity damping for stability
};

/**
 * Simple interpolation function ν(y) for MOND
 * ν(y) = 0.5 + sqrt(0.25 + 1/y)
 * where y = a/a₀
 */
function nuSimple(y) {
  if (y < 0.0001) y = 0.0001; // Prevent division issues
  return 0.5 + Math.sqrt(0.25 + 1.0 / y);
}

/**
 * Calculate MOND acceleration given Newtonian acceleration
 * a_MOND = a_N * ν(a_N / a₀)
 */
function calculateMONDAcceleration(aN, a0) {
  const y = Math.abs(aN) / a0;
  const nu = nuSimple(y);
  return aN / nu; // MOND acceleration is reduced by interpolation function
}

/**
 * Particle class with MOND physics
 */
class MONDParticle {
  constructor(x, y, vx = 0, vy = 0) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.ax = 0;
    this.ay = 0;
    this.trail = [];
    this.maxTrail = 15;
    this.color = `hsl(${160 + Math.random() * 40}, 100%, ${50 + Math.random() * 20}%)`;
    this.size = 1.5 + Math.random() * 1.5;
  }

  /**
   * Leapfrog integration step (symplectic integrator)
   * More stable than Euler for orbital mechanics
   */
  leapfrogStep(dt, centerX, centerY, mouseX, mouseY, useMOND, mouseActive, constants) {
    // Store trail
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }
    this.trail.push({ x: this.x, y: this.y });

    // Half-step velocity update
    this.vx += 0.5 * this.ax * dt;
    this.vy += 0.5 * this.ay * dt;

    // Full position update
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Calculate new acceleration
    this.calculateAcceleration(centerX, centerY, mouseX, mouseY, useMOND, mouseActive, constants);

    // Second half-step velocity update
    this.vx += 0.5 * this.ax * dt;
    this.vy += 0.5 * this.ay * dt;

    // Apply damping
    this.vx *= constants.damping;
    this.vy *= constants.damping;
  }

  calculateAcceleration(centerX, centerY, mouseX, mouseY, useMOND, mouseActive, constants) {
    // Vector to center
    const dx = centerX - this.x;
    const dy = centerY - this.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    
    if (r < 5) {
      this.ax = 0;
      this.ay = 0;
      return;
    }

    // Newtonian acceleration magnitude: a = GM/r²
    const aN = (constants.G * constants.centralMass) / (r * r);

    // Apply MOND if enabled
    let aMag;
    if (useMOND) {
      aMag = calculateMONDAcceleration(aN, constants.a0);
    } else {
      aMag = aN;
    }

    // Direction components
    this.ax = aMag * (dx / r);
    this.ay = aMag * (dy / r);

    // External Field Effect (mouse influence)
    if (mouseActive && mouseX !== null && mouseY !== null) {
      const mdx = mouseX - this.x;
      const mdy = mouseY - this.y;
      const mr = Math.sqrt(mdx * mdx + mdy * mdy);
      
      if (mr > 10 && mr < 400) {
        const mouseAcc = constants.mouseInfluence / (mr * mr);
        const finalMouseAcc = useMOND 
          ? calculateMONDAcceleration(mouseAcc, constants.a0 * 2)
          : mouseAcc;
        
        this.ax += finalMouseAcc * (mdx / mr);
        this.ay += finalMouseAcc * (mdy / mr);
      }
    }
  }

  /**
   * Get a/a₀ ratio for telemetry
   */
  getAccelerationRatio(constants) {
    const aMag = Math.sqrt(this.ax * this.ax + this.ay * this.ay);
    return aMag / constants.a0;
  }
}

/**
 * Initialize particles in circular orbits
 */
function initializeParticles(count, centerX, centerY, constants) {
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    // Distribute particles in orbital rings
    const ringIndex = Math.floor(i / (count / 6));
    const baseRadius = 80 + ringIndex * 60 + Math.random() * 40;
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    
    const x = centerX + Math.cos(angle) * baseRadius;
    const y = centerY + Math.sin(angle) * baseRadius;
    
    // Calculate circular orbit velocity
    // For MOND at low acceleration: v = (GMa₀)^(1/4)
    const r = baseRadius;
    const vCircular = Math.pow(constants.G * constants.centralMass * constants.a0, 0.25) * 
                      Math.pow(r, -0.25) * 0.8;
    
    // Perpendicular to radius for circular orbit
    const vx = -Math.sin(angle) * vCircular;
    const vy = Math.cos(angle) * vCircular;
    
    particles.push(new MONDParticle(x, y, vx, vy));
  }
  
  return particles;
}

export { 
  MONDParticle, 
  initializeParticles, 
  calculateMONDAcceleration, 
  nuSimple,
  MOND_CONSTANTS 
};
