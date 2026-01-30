import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import AdvancedParticleField from './AdvancedParticleField';

const AdvancedMONDScene = ({ useMOND = true, mode = 'GALAXY', onTelemetry, onObjectClick }) => {
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
                <PerspectiveCamera makeDefault position={[0, 8, 14]} fov={55} />

                <Suspense fallback={null}>
                    <AdvancedParticleField
                        useMOND={useMOND}
                        mode={mode}
                        particleCount={400}
                        onTelemetry={onTelemetry}
                        onObjectClick={onObjectClick}
                    />
                </Suspense>

                <ambientLight intensity={0.1} />

                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.2}
                    minDistance={5}
                    maxDistance={30}
                    dampingFactor={0.05}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2}
                />

                {/* Background grid */}
                <gridHelper
                    args={[60, 40, '#22d3ee', '#0f172a']}
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[0, 0, -15]}
                />
            </Canvas>
        </div>
    );
};

export default AdvancedMONDScene;
