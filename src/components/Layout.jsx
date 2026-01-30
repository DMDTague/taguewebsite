import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion, useScroll, useSpring } from 'framer-motion';

const Layout = ({ children }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Track mouse movement for global spotlight effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            // Update state for React components if needed
            setMousePosition({ x: e.clientX, y: e.clientY });

            // Update CSS variables for performant styling
            if (containerRef.current) {
                containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
                containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen bg-[#010409] text-slate-200 overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200"
        >
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-purple-500 origin-left z-[101]"
                style={{ scaleX }}
            />

            {/* 1. Global Effects Layer */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 grid-bg opacity-30" />

                {/* Mouse Spotlight */}
                <div className="spotlight-overlay" />

                {/* Noise Texture */}
                <div className="bg-noise" />
            </div>

            {/* 2. Content Layer */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                <main className="flex-grow">
                    {children}
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default Layout;
