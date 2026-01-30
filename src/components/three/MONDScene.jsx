import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import ParticleField from './ParticleField';

const MONDScene = ({ useMOND = true, onTelemetry }) => {
    return (
        <div className="absolute inset-0 bg-[#020617]">
            <Canvas
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance'
                }}
                style={{ background: '#020617' }}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={60} />

                <Suspense fallback={null}>
                    <ParticleField useMOND={useMOND} particleCount={600} onTelemetry={onTelemetry} />
                </Suspense>

                {/* Ambient glow */}
                <ambientLight intensity={0.1} />

                {/* Subtle orbit controls */}
                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.3}
                    minDistance={5}
                    maxDistance={25}
                    dampingFactor={0.05}
                />

                {/* Background grid */}
                <gridHelper
                    args={[50, 50, '#22d3ee', '#0f172a']}
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[0, 0, -10]}
                />
            </Canvas>
        </div>
    );
};

export default MONDScene;
