import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { mondVertexShader, mondFragmentShader } from '../../shaders/mondShader';

const ParticleField = ({ useMOND = true, particleCount = 800, onTelemetry }) => {
    const pointsRef = useRef();
    const linesRef = useRef();
    const mouseRef = useRef(new THREE.Vector2(0, 0));
    const { viewport } = useThree();

    // Physics constants
    const a0 = 0.0001;
    const centralMass = 500;

    // Generate initial positions in orbital rings
    const { positions, velocities, sizes } = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const ringIndex = Math.floor(i / (particleCount / 8));
            const baseRadius = 2 + ringIndex * 1.5 + Math.random() * 1;
            const theta = (i / particleCount) * Math.PI * 2 + Math.random() * 0.5;
            const phi = Math.PI / 2 + (Math.random() - 0.5) * 0.3;

            // Spherical to Cartesian
            positions[i * 3] = baseRadius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = baseRadius * Math.cos(phi) * (Math.random() - 0.5) * 0.5;
            positions[i * 3 + 2] = baseRadius * Math.sin(phi) * Math.sin(theta);

            // Orbital velocity (perpendicular to radius)
            const vMag = Math.sqrt(centralMass / baseRadius) * 0.01;
            velocities[i * 3] = -Math.sin(theta) * vMag;
            velocities[i * 3 + 1] = 0;
            velocities[i * 3 + 2] = Math.cos(theta) * vMag;

            sizes[i] = 1.5 + Math.random() * 2;
        }

        return { positions, velocities, sizes };
    }, [particleCount]);

    // Create line connections based on proximity
    const lineGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        // Pre-allocate for max possible connections (will be sparse)
        const maxConnections = particleCount * 5;
        const linePositions = new Float32Array(maxConnections * 6);
        const lineOpacities = new Float32Array(maxConnections * 2);

        geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        geometry.setAttribute('aOpacity', new THREE.BufferAttribute(lineOpacities, 1));
        geometry.setDrawRange(0, 0);

        return geometry;
    }, [particleCount]);

    // Shader uniforms
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uA0: { value: a0 },
        uCentralMass: { value: centralMass },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: 200 },
        uUseMOND: { value: useMOND },
        uCenterPosition: { value: new THREE.Vector3(0, 0, 0) },
    }), []);

    // Update useMOND uniform when prop changes
    useEffect(() => {
        if (pointsRef.current) {
            pointsRef.current.material.uniforms.uUseMOND.value = useMOND;
        }
    }, [useMOND]);

    // Mouse tracking
    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Animation loop
    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        const time = state.clock.elapsedTime;
        pointsRef.current.material.uniforms.uTime.value = time;
        pointsRef.current.material.uniforms.uMouse.value.copy(mouseRef.current);

        // Update line connections
        if (linesRef.current) {
            const posAttr = pointsRef.current.geometry.attributes.position;
            const linePos = linesRef.current.geometry.attributes.position;
            const lineOpacity = linesRef.current.geometry.attributes.aOpacity;

            let connectionCount = 0;
            const maxDist = 2.5;
            const positions = posAttr.array;

            // Simple proximity check (optimization: could use spatial hashing)
            for (let i = 0; i < particleCount && connectionCount < particleCount * 5; i++) {
                const ix = positions[i * 3];
                const iy = positions[i * 3 + 1];
                const iz = positions[i * 3 + 2];

                for (let j = i + 1; j < particleCount && connectionCount < particleCount * 5; j++) {
                    const jx = positions[j * 3];
                    const jy = positions[j * 3 + 1];
                    const jz = positions[j * 3 + 2];

                    const dx = ix - jx;
                    const dy = iy - jy;
                    const dz = iz - jz;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < maxDist && dist > 0.1) {
                        const idx = connectionCount * 6;
                        linePos.array[idx] = ix;
                        linePos.array[idx + 1] = iy;
                        linePos.array[idx + 2] = iz;
                        linePos.array[idx + 3] = jx;
                        linePos.array[idx + 4] = jy;
                        linePos.array[idx + 5] = jz;

                        // Opacity based on distance
                        const opacity = 1 - dist / maxDist;
                        lineOpacity.array[connectionCount * 2] = opacity;
                        lineOpacity.array[connectionCount * 2 + 1] = opacity;

                        connectionCount++;
                    }
                }
            }

            linesRef.current.geometry.setDrawRange(0, connectionCount * 2);
            linePos.needsUpdate = true;
            lineOpacity.needsUpdate = true;
        }

        // Send telemetry
        if (onTelemetry) {
            onTelemetry({
                particleCount,
                mode: useMOND ? 'MOND' : 'NEWTONIAN',
                time: time.toFixed(2)
            });
        }
    });

    return (
        <group>
            {/* Central attractor glow */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
            </mesh>

            {/* Outer glow */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} />
            </mesh>

            {/* Particle system */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        array={positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-aVelocityX"
                        count={particleCount}
                        array={velocities.filter((_, i) => i % 3 === 0)}
                        itemSize={1}
                    />
                    <bufferAttribute
                        attach="attributes-aSize"
                        count={particleCount}
                        array={sizes}
                        itemSize={1}
                    />
                </bufferGeometry>
                <shaderMaterial
                    uniforms={uniforms}
                    vertexShader={mondVertexShader}
                    fragmentShader={mondFragmentShader}
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
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                />
            </lineSegments>
        </group>
    );
};

export default ParticleField;
