/**
 * Advanced MOND Physics - JavaScript Port
 * Based on mond_advanced.c implementation
 * 
 * Modules:
 * 1. Galaxy Cluster Dynamics (Neutrinos)
 * 2. Bullet Cluster (SPH Hydrodynamics)
 * 3. Cosmology (Hubble Expansion)
 */

// Physics Constants
export const CONSTANTS = {
    G: 6.67430e-11,           // Gravitational constant
    A0: 1.2e-10,              // MOND acceleration scale
    SOLAR_MASS: 1.989e30,     // kg
    PARSEC: 3.0857e16,        // meters

    // Neutrino parameters (Module 1)
    NEUTRINO_MASS: 11,        // eV (sterile neutrino mass)
    NEUTRINO_TEMP: 1e6,       // K (thermal temperature)
    THERMAL_VELOCITY: 1000,   // km/s thermal velocity

    // SPH parameters (Module 2)
    SMOOTHING_LENGTH: 0.15,   // Smoothing kernel radius
    GAS_PRESSURE: 0.8,        // Pressure coefficient
    GAS_VISCOSITY: 0.3,       // Viscosity for damping

    // Cosmology parameters (Module 3)
    H0: 70,                   // Hubble constant (km/s/Mpc)
    VOID_RADIUS: 0.3,         // KBC void radius (fraction of domain)
    VOID_DENSITY: 0.5,        // Density ratio inside void
};

// Particle Types
export const ParticleType = {
    BARYON: 0,    // Stars/Galaxies - cyan
    NEUTRINO: 1,  // Hot dark matter - purple, dim
    GAS: 2,       // X-ray emitting gas - orange
};

// Simulation Modes
export const SimulationMode = {
    GALAXY: 'GALAXY',       // Basic MOND rotation
    CLUSTER: 'CLUSTER',     // Galaxy cluster with neutrinos
    BULLET: 'BULLET',       // Bullet cluster collision
    VOID: 'VOID',           // KBC Void / Hubble expansion
};

/**
 * MOND interpolation function: ν(y) = 0.5 + sqrt(0.25 + 1/y)
 */
export function nuSimple(y) {
    const safeY = Math.max(y, 0.0001);
    return 0.5 + Math.sqrt(0.25 + 1.0 / safeY);
}

/**
 * Solve for MOND acceleration given Newtonian acceleration
 */
export function solveMONDAcceleration(aN, a0 = CONSTANTS.A0) {
    const y = Math.abs(aN) / a0;
    const nu = nuSimple(y);
    return aN / nu;
}

/**
 * Advanced Particle class with type support
 */
export class AdvancedParticle {
    constructor(x, y, z, type = ParticleType.BARYON) {
        // Position
        this.x = x;
        this.y = y;
        this.z = z;

        // Velocity
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;

        // Acceleration
        this.ax = 0;
        this.ay = 0;
        this.az = 0;

        // Properties
        this.type = type;
        this.mass = 1.0;
        this.density = 1.0;    // For SPH
        this.pressure = 0;      // For SPH

        // Visual
        this.size = type === ParticleType.NEUTRINO ? 1.0 : 2.0;
        this.alpha = type === ParticleType.NEUTRINO ? 0.3 : 1.0;
    }

    /**
     * Get color based on particle type
     * BARYON: Electric Cyan, NEUTRINO: Dim Purple, GAS: Orange
     */
    getColor() {
        switch (this.type) {
            case ParticleType.BARYON:
                return [0.133, 0.827, 0.933]; // #22d3ee
            case ParticleType.NEUTRINO:
                return [0.580, 0.330, 1.0];   // Purple
            case ParticleType.GAS:
                return [1.0, 0.5, 0.2];       // Orange
            default:
                return [1, 1, 1];
        }
    }
}

/**
 * MODULE 1: Galaxy Cluster Initialization
 * Creates mixed baryon + neutrino distribution
 */
export function initializeCluster(particleCount, bounds = 10) {
    const particles = [];
    const baryonFraction = 0.15;  // ~15% baryonic matter
    const neutrinoCount = Math.floor(particleCount * (1 - baryonFraction));
    const baryonCount = particleCount - neutrinoCount;

    // Initialize baryons (concentrated in center)
    for (let i = 0; i < baryonCount; i++) {
        const radius = (Math.random() ** 0.5) * bounds * 0.5; // Concentrated
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi) * 0.3; // Flattened

        const p = new AdvancedParticle(x, y, z, ParticleType.BARYON);

        // Orbital velocity (Keplerian-ish)
        const v = Math.sqrt(50 / Math.max(radius, 0.5)) * 0.02;
        p.vx = -Math.sin(theta) * v;
        p.vy = Math.cos(theta) * v;
        p.vz = 0;

        particles.push(p);
    }

    // Initialize neutrinos (HOT - high thermal velocity, spread out)
    for (let i = 0; i < neutrinoCount; i++) {
        const radius = (0.5 + Math.random() * 0.5) * bounds; // Outer regions
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        const p = new AdvancedParticle(x, y, z, ParticleType.NEUTRINO);

        // HIGH thermal velocity (prevents galaxy-scale collapse)
        const thermalSpeed = 0.05 + Math.random() * 0.05; // ~1000 km/s equivalent
        const vTheta = Math.random() * Math.PI * 2;
        const vPhi = Math.acos(2 * Math.random() - 1);
        p.vx = thermalSpeed * Math.sin(vPhi) * Math.cos(vTheta);
        p.vy = thermalSpeed * Math.sin(vPhi) * Math.sin(vTheta);
        p.vz = thermalSpeed * Math.cos(vPhi);

        particles.push(p);
    }

    return particles;
}

/**
 * MODULE 2: Bullet Cluster Initialization
 * Two clusters on collision course
 */
export function initializeBulletCluster(particleCount, bounds = 10) {
    const particles = [];
    const particlesPerCluster = Math.floor(particleCount / 2);

    // Cluster 1 (left, moving right)
    const offset1 = -bounds * 0.4;
    const velocity1 = 0.03;

    // Cluster 2 (right, moving left)
    const offset2 = bounds * 0.4;
    const velocity2 = -0.03;

    for (let cluster = 0; cluster < 2; cluster++) {
        const offset = cluster === 0 ? offset1 : offset2;
        const vel = cluster === 0 ? velocity1 : velocity2;

        for (let i = 0; i < particlesPerCluster; i++) {
            // Determine particle type: 20% gas, 15% baryon, 65% neutrino
            let type;
            const rand = Math.random();
            if (rand < 0.20) {
                type = ParticleType.GAS;
            } else if (rand < 0.35) {
                type = ParticleType.BARYON;
            } else {
                type = ParticleType.NEUTRINO;
            }

            // Position within cluster
            const radius = (Math.random() ** 0.5) * bounds * 0.25;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = offset + radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi) * 0.3;

            const p = new AdvancedParticle(x, y, z, type);

            // All particles moving toward center
            p.vx = vel;
            p.vy = (Math.random() - 0.5) * 0.01;
            p.vz = 0;

            // Neutrinos get extra thermal velocity
            if (type === ParticleType.NEUTRINO) {
                p.vx += (Math.random() - 0.5) * 0.02;
                p.vy += (Math.random() - 0.5) * 0.02;
                p.alpha = 0.25;
            }

            particles.push(p);
        }
    }

    return particles;
}

/**
 * MODULE 3: KBC Void Initialization
 * Central underdensity for Hubble tension study
 */
export function initializeVoid(particleCount, bounds = 10) {
    const particles = [];
    const voidRadius = bounds * CONSTANTS.VOID_RADIUS;

    for (let i = 0; i < particleCount; i++) {
        let x, y, z;

        // Create low-density central region
        if (Math.random() < CONSTANTS.VOID_DENSITY) {
            // Inside void (sparse)
            const radius = Math.random() * voidRadius;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            x = radius * Math.sin(phi) * Math.cos(theta);
            y = radius * Math.sin(phi) * Math.sin(theta);
            z = radius * Math.cos(phi) * 0.5;
        } else {
            // Outside void (dense shell)
            const radius = voidRadius + Math.random() * (bounds - voidRadius);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            x = radius * Math.sin(phi) * Math.cos(theta);
            y = radius * Math.sin(phi) * Math.sin(theta);
            z = radius * Math.cos(phi) * 0.5;
        }

        const p = new AdvancedParticle(x, y, z, ParticleType.BARYON);

        // Initial outward velocity (Hubble flow)
        const dist = Math.sqrt(x * x + y * y + z * z);
        if (dist > 0.1) {
            const hubbleVel = 0.005 * dist; // H0 * r
            p.vx = (x / dist) * hubbleVel;
            p.vy = (y / dist) * hubbleVel;
            p.vz = (z / dist) * hubbleVel * 0.5;
        }

        particles.push(p);
    }

    return particles;
}

/**
 * SPH Density Kernel (Cubic Spline)
 */
function sphKernel(r, h) {
    const q = r / h;
    if (q > 2) return 0;
    if (q > 1) return 0.25 * Math.pow(2 - q, 3);
    return 1 - 1.5 * q * q + 0.75 * q * q * q;
}

/**
 * SPH Kernel Gradient (for pressure force)
 */
function sphKernelGradient(r, h) {
    const q = r / h;
    if (q > 2 || q < 0.01) return 0;
    if (q > 1) return -0.75 * Math.pow(2 - q, 2);
    return -3 * q + 2.25 * q * q;
}

/**
 * MODULE 2: Apply SPH Hydrodynamics (Gas Pressure)
 * Gas particles collide and stop, others pass through
 */
export function applySPHForces(particles, h = CONSTANTS.SMOOTHING_LENGTH) {
    // Only apply to GAS particles
    const gasParticles = particles.filter(p => p.type === ParticleType.GAS);

    if (gasParticles.length < 2) return;

    // Calculate density for each gas particle
    for (const p of gasParticles) {
        let density = 0;
        for (const other of gasParticles) {
            if (p === other) continue;
            const dx = other.x - p.x;
            const dy = other.y - p.y;
            const dz = other.z - p.z;
            const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
            density += sphKernel(r, h);
        }
        p.density = Math.max(density, 0.1);
        p.pressure = CONSTANTS.GAS_PRESSURE * p.density;
    }

    // Calculate pressure forces
    for (const p of gasParticles) {
        for (const other of gasParticles) {
            if (p === other) continue;

            const dx = other.x - p.x;
            const dy = other.y - p.y;
            const dz = other.z - p.z;
            const r = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (r < h * 2 && r > 0.01) {
                // Pressure force (repulsive)
                const pressureTerm = (p.pressure / (p.density * p.density)) +
                    (other.pressure / (other.density * other.density));
                const gradW = sphKernelGradient(r, h);
                const forceMag = -pressureTerm * gradW / r;

                p.ax += forceMag * dx;
                p.ay += forceMag * dy;
                p.az += forceMag * dz;

                // Viscosity (damping relative velocity)
                const dvx = other.vx - p.vx;
                const dvy = other.vy - p.vy;
                const dvz = other.vz - p.vz;
                const dot = dx * dvx + dy * dvy + dz * dvz;

                if (dot < 0) {
                    const visc = CONSTANTS.GAS_VISCOSITY * dot / (r * r + 0.01);
                    p.ax += visc * dx;
                    p.ay += visc * dy;
                    p.az += visc * dz;
                }
            }
        }
    }
}

/**
 * MODULE 3: Apply Hubble Expansion (Cosmology)
 * Adds Hubble drag: a = a_grav - 2*H*v
 */
export function applyHubbleDrag(particles, time, H0 = 0.001) {
    // Scale factor grows with time
    const a = 1 + 0.0001 * time;
    const H = H0 / a; // Hubble parameter decreases

    for (const p of particles) {
        // Hubble drag: d²x/dt² + 2H dx/dt = ...
        p.ax -= 2 * H * p.vx;
        p.ay -= 2 * H * p.vy;
        p.az -= 2 * H * p.vz;
    }

    return a; // Return scale factor for visualization
}

/**
 * Calculate MOND Forces for all particles
 */
export function calculateMONDForces(particles, centralMass = 500, useMOND = true) {
    const a0 = 0.0001; // Scaled for visualization

    for (const p of particles) {
        // Vector to center
        const dx = -p.x;
        const dy = -p.y;
        const dz = -p.z;
        const r2 = dx * dx + dy * dy + dz * dz;
        const r = Math.sqrt(r2);

        if (r < 0.1) continue;

        // Newtonian acceleration
        const aN = centralMass / r2;

        // MOND acceleration
        const aMag = useMOND ? solveMONDAcceleration(aN, a0) : aN;

        // Apply acceleration
        p.ax += (aMag / r) * dx;
        p.ay += (aMag / r) * dy;
        p.az += (aMag / r) * dz;
    }
}

/**
 * Leapfrog Integration Step
 */
export function integrateParticles(particles, dt = 0.016) {
    for (const p of particles) {
        // Half-step velocity
        p.vx += 0.5 * p.ax * dt;
        p.vy += 0.5 * p.ay * dt;
        p.vz += 0.5 * p.az * dt;

        // Full position update
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;

        // Second half-step velocity
        p.vx += 0.5 * p.ax * dt;
        p.vy += 0.5 * p.ay * dt;
        p.vz += 0.5 * p.az * dt;

        // Reset acceleration for next frame
        p.ax = 0;
        p.ay = 0;
        p.az = 0;
    }
}

/**
 * Get particle statistics for telemetry
 */
export function getParticleStats(particles) {
    const stats = {
        total: particles.length,
        baryons: 0,
        neutrinos: 0,
        gas: 0,
        avgRadius: 0,
        avgVelocity: 0,
    };

    let totalRadius = 0;
    let totalVel = 0;

    for (const p of particles) {
        if (p.type === ParticleType.BARYON) stats.baryons++;
        else if (p.type === ParticleType.NEUTRINO) stats.neutrinos++;
        else if (p.type === ParticleType.GAS) stats.gas++;

        totalRadius += Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
        totalVel += Math.sqrt(p.vx * p.vx + p.vy * p.vy + p.vz * p.vz);
    }

    stats.avgRadius = totalRadius / particles.length;
    stats.avgVelocity = totalVel / particles.length;

    return stats;
}

export default {
    CONSTANTS,
    ParticleType,
    SimulationMode,
    nuSimple,
    solveMONDAcceleration,
    AdvancedParticle,
    initializeCluster,
    initializeBulletCluster,
    initializeVoid,
    applySPHForces,
    applyHubbleDrag,
    calculateMONDForces,
    integrateParticles,
    getParticleStats,
};
