import React, { useRef, useEffect, useState, useCallback } from 'react';
import { initializeParticles, MOND_CONSTANTS } from '../utils/mondPhysics';

const MONDParticleField = ({ useMOND = true, onTelemetryUpdate }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: null, y: null, active: false });
    const constantsRef = useRef({ ...MOND_CONSTANTS });

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [fps, setFps] = useState(60);
    const lastFrameTime = useRef(performance.now());
    const frameCount = useRef(0);

    // Initialize particles
    const initParticles = useCallback((width, height) => {
        const centerX = width / 2;
        const centerY = height / 2;
        const particleCount = Math.min(600, Math.floor((width * height) / 3000));
        particlesRef.current = initializeParticles(particleCount, centerX, centerY, constantsRef.current);
    }, []);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const rect = canvasRef.current.parentElement.getBoundingClientRect();
                setDimensions({ width: rect.width, height: rect.height });
                initParticles(rect.width, rect.height);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [initParticles]);

    // Handle mouse movement
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                mouseRef.current = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                    active: true
                };
            }
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Animation loop
    useEffect(() => {
        if (!canvasRef.current || dimensions.width === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;
        const dt = 0.5; // Time step

        const animate = () => {
            // Calculate FPS
            frameCount.current++;
            const now = performance.now();
            if (now - lastFrameTime.current >= 1000) {
                setFps(frameCount.current);
                frameCount.current = 0;
                lastFrameTime.current = now;
            }

            // Clear with fade effect for trails
            ctx.fillStyle = 'rgba(5, 5, 8, 0.15)';
            ctx.fillRect(0, 0, dimensions.width, dimensions.height);

            // Draw grid
            ctx.strokeStyle = 'rgba(0, 242, 255, 0.03)';
            ctx.lineWidth = 1;
            const gridSize = 48;
            for (let x = 0; x < dimensions.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, dimensions.height);
                ctx.stroke();
            }
            for (let y = 0; y < dimensions.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(dimensions.width, y);
                ctx.stroke();
            }

            // Draw center attractor
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
            gradient.addColorStop(0, 'rgba(0, 255, 136, 0.8)');
            gradient.addColorStop(0.5, 'rgba(0, 255, 136, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
            ctx.fill();

            // Update and draw particles
            let nearMouseParticles = [];

            particlesRef.current.forEach((particle) => {
                particle.leapfrogStep(
                    dt,
                    centerX,
                    centerY,
                    mouseRef.current.x,
                    mouseRef.current.y,
                    useMOND,
                    mouseRef.current.active,
                    constantsRef.current
                );

                // Draw trail
                if (particle.trail.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
                    for (let i = 1; i < particle.trail.length; i++) {
                        ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
                    }
                    ctx.strokeStyle = particle.color.replace(')', ', 0.3)').replace('hsl', 'hsla');
                    ctx.lineWidth = particle.size * 0.5;
                    ctx.stroke();
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();

                // Collect telemetry for particles near mouse
                if (mouseRef.current.active) {
                    const dx = particle.x - mouseRef.current.x;
                    const dy = particle.y - mouseRef.current.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        nearMouseParticles.push(particle.getAccelerationRatio(constantsRef.current));
                    }
                }
            });

            // Send telemetry data
            if (onTelemetryUpdate && nearMouseParticles.length > 0) {
                const avgRatio = nearMouseParticles.reduce((a, b) => a + b, 0) / nearMouseParticles.length;
                onTelemetryUpdate({
                    avgAccelerationRatio: avgRatio,
                    particleCount: nearMouseParticles.length,
                    mode: useMOND ? 'MOND' : 'NEWTONIAN'
                });
            }

            // Draw mouse influence zone (EFE)
            if (mouseRef.current.active && mouseRef.current.x && mouseRef.current.y) {
                const efeGradient = ctx.createRadialGradient(
                    mouseRef.current.x, mouseRef.current.y, 0,
                    mouseRef.current.x, mouseRef.current.y, 150
                );
                efeGradient.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
                efeGradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
                ctx.fillStyle = efeGradient;
                ctx.beginPath();
                ctx.arc(mouseRef.current.x, mouseRef.current.y, 150, 0, Math.PI * 2);
                ctx.fill();

                // EFE indicator ring
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.arc(mouseRef.current.x, mouseRef.current.y, 150, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [dimensions, useMOND, onTelemetryUpdate]);

    return (
        <div className="absolute inset-0 overflow-hidden" style={{ background: '#050508' }}>
            <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                className="w-full h-full"
            />
            {/* FPS Counter */}
            <div className="absolute bottom-4 left-4 font-mono text-xs text-lab-text-muted opacity-50">
                {fps} FPS | {particlesRef.current.length} particles
            </div>
        </div>
    );
};

export default MONDParticleField;
