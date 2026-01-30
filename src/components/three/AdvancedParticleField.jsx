import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { advancedVertexShader, advancedFragmentShader } from '../../shaders/advancedShader';
import {
    SimulationMode,
    ParticleType,
    initializeCluster,
    initializeBulletCluster,
    initializeVoid,
    calculateMONDForces,
    applySPHForces,
    applyHubbleDrag,
    integrateParticles,
    getParticleStats,
    AdvancedParticle,
} from '../../utils/advancedPhysics';

const AdvancedParticleField = ({
    useMOND = true,
    mode = SimulationMode.GALAXY,
    particleCount = 400,
    onTelemetry,
    onObjectClick
}) => {
    const pointsRef = useRef();
    const linesRef = useRef();
    const particlesRef = useRef([]);
    const [scaleFactor, setScaleFactor] = useState(1);

    // Initialize particles based on mode
    useEffect(() => {
        let newParticles;

        switch (mode) {
            case SimulationMode.CLUSTER:
                newParticles = initializeCluster(particleCount, 8);
                break;
            case SimulationMode.BULLET:
                newParticles = initializeBulletCluster(particleCount, 8);
                break;
            case SimulationMode.VOID:
                newParticles = initializeVoid(particleCount, 8);
                break;
            case SimulationMode.GALAXY:
            default:
                // Simple galaxy mode (all baryons)
                newParticles = [];
                for (let i = 0; i < particleCount; i++) {
                    const ringIndex = Math.floor(i / (particleCount / 6));
                    const radius = 1.5 + ringIndex * 1.2 + Math.random() * 0.8;
                    const theta = (i / particleCount) * Math.PI * 2 + Math.random() * 0.5;

                    const x = radius * Math.cos(theta);
                    const y = (Math.random() - 0.5) * 0.3;
                    const z = radius * Math.sin(theta);

                    const p = new AdvancedParticle(x, y, z, ParticleType.BARYON);
                    const v = Math.sqrt(50 / radius) * 0.015;
                    p.vx = -Math.sin(theta) * v;
                    p.vy = 0;
                    p.vz = Math.cos(theta) * v;
                    p.size = 1.5 + Math.random() * 1.5;
                    newParticles.push(p);
                }
                break;
        }

        particlesRef.current = newParticles;
        setScaleFactor(1);
    }, [mode, particleCount]);

    // Create geometry attributes
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const types = new Float32Array(particleCount);
        const alphas = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
            sizes[i] = 2;
            types[i] = 0;
            alphas[i] = 1;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geo.setAttribute('aParticleType', new THREE.BufferAttribute(types, 1));
        geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

        return geo;
    }, [particleCount]);

    // Line geometry for connections
    const lineGeometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const maxConnections = particleCount * 4;
        const positions = new Float32Array(maxConnections * 6);
        const opacities = new Float32Array(maxConnections * 2);
        const colors = new Float32Array(maxConnections * 6);

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
        geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
        geo.setDrawRange(0, 0);

        return geo;
    }, [particleCount]);

    // Shader uniforms
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uA0: { value: 0.0001 },
        uCentralMass: { value: 500 },
        uUseMOND: { value: useMOND },
        uCenterPosition: { value: new THREE.Vector3(0, 0, 0) },
        uScaleFactor: { value: 1 },
    }), []);

    // Update MOND uniform
    useEffect(() => {
        if (pointsRef.current) {
            pointsRef.current.material.uniforms.uUseMOND.value = useMOND;
        }
    }, [useMOND]);

    // Animation loop
    useFrame((state, delta) => {
        if (!pointsRef.current || particlesRef.current.length === 0) return;

        const time = state.clock.elapsedTime;
        const particles = particlesRef.current;

        // Reset accelerations
        for (const p of particles) {
            p.ax = 0;
            p.ay = 0;
            p.az = 0;
        }

        // Apply MOND gravity
        calculateMONDForces(particles, 500, useMOND);

        // Apply mode-specific physics
        if (mode === SimulationMode.BULLET || mode === SimulationMode.CLUSTER) {
            applySPHForces(particles);
        }

        if (mode === SimulationMode.VOID) {
            const newScale = applyHubbleDrag(particles, time);
            setScaleFactor(1 + time * 0.001);
        }

        // Integrate
        integrateParticles(particles, delta * 0.5);

        // Update geometry
        const posAttr = pointsRef.current.geometry.attributes.position;
        const sizeAttr = pointsRef.current.geometry.attributes.aSize;
        const typeAttr = pointsRef.current.geometry.attributes.aParticleType;
        const alphaAttr = pointsRef.current.geometry.attributes.aAlpha;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            posAttr.array[i * 3] = p.x;
            posAttr.array[i * 3 + 1] = p.y;
            posAttr.array[i * 3 + 2] = p.z;
            sizeAttr.array[i] = p.size || 2;
            typeAttr.array[i] = p.type;
            alphaAttr.array[i] = p.alpha || 1;
        }

        posAttr.needsUpdate = true;
        sizeAttr.needsUpdate = true;
        typeAttr.needsUpdate = true;
        alphaAttr.needsUpdate = true;

        // Update uniforms
        pointsRef.current.material.uniforms.uTime.value = time;
        pointsRef.current.material.uniforms.uScaleFactor.value = scaleFactor;

        // Update line connections (only connect same-type particles)
        if (linesRef.current) {
            const linePos = linesRef.current.geometry.attributes.position;
            const lineOpacity = linesRef.current.geometry.attributes.aOpacity;
            const lineColor = linesRef.current.geometry.attributes.aColor;

            let connectionCount = 0;
            const maxDist = 2.0;

            for (let i = 0; i < particles.length && connectionCount < particleCount * 4; i++) {
                const pi = particles[i];
                if (pi.type === ParticleType.NEUTRINO) continue; // Don't connect neutrinos

                for (let j = i + 1; j < particles.length && connectionCount < particleCount * 4; j++) {
                    const pj = particles[j];
                    if (pj.type === ParticleType.NEUTRINO) continue;
                    if (pi.type !== pj.type) continue; // Only connect same types

                    const dx = pi.x - pj.x;
                    const dy = pi.y - pj.y;
                    const dz = pi.z - pj.z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < maxDist && dist > 0.1) {
                        const idx = connectionCount * 6;
                        linePos.array[idx] = pi.x;
                        linePos.array[idx + 1] = pi.y;
                        linePos.array[idx + 2] = pi.z;
                        linePos.array[idx + 3] = pj.x;
                        linePos.array[idx + 4] = pj.y;
                        linePos.array[idx + 5] = pj.z;

                        const opacity = (1 - dist / maxDist) * 0.5;
                        lineOpacity.array[connectionCount * 2] = opacity;
                        lineOpacity.array[connectionCount * 2 + 1] = opacity;

                        // Color based on type
                        const color = pi.getColor();
                        lineColor.array[idx] = color[0];
                        lineColor.array[idx + 1] = color[1];
                        lineColor.array[idx + 2] = color[2];
                        lineColor.array[idx + 3] = color[0];
                        lineColor.array[idx + 4] = color[1];
                        lineColor.array[idx + 5] = color[2];

                        connectionCount++;
                    }
                }
            }

            linesRef.current.geometry.setDrawRange(0, connectionCount * 2);
            linePos.needsUpdate = true;
            lineOpacity.needsUpdate = true;
            lineColor.needsUpdate = true;
        }

        // Send telemetry
        if (onTelemetry) {
            const stats = getParticleStats(particles);
            onTelemetry({
                ...stats,
                mode,
                useMOND,
                scaleFactor: scaleFactor.toFixed(3),
                time: time.toFixed(1),
            });
        }
    });

    return (
        <group>
            {/* Central attractor */}
            {/* Central attractor */}
            <mesh
                position={[0, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onObjectClick) onObjectClick();
                }}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.9} />
            </mesh>
            <mesh
                position={[0, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onObjectClick) onObjectClick();
                }}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.15} />
            </mesh>

            {/* Particles */}
            <points ref={pointsRef} geometry={geometry}>
                <shaderMaterial
                    uniforms={uniforms}
                    vertexShader={advancedVertexShader}
                    fragmentShader={advancedFragmentShader}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Connection lines */}
            <lineSegments ref={linesRef} geometry={lineGeometry}>
                <lineBasicMaterial
                    color="#22d3ee"
                    transparent
                    opacity={0.2}
                    blending={THREE.AdditiveBlending}
                />
            </lineSegments>
        </group>
    );
};

export default AdvancedParticleField;
