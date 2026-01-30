import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, FlaskConical, Database, Code, FileCode, Sparkles, Atom, Activity, Zap, Play, Eye, EyeOff } from 'lucide-react';
import AdvancedMONDScene from '../components/three/AdvancedMONDScene';
import AdvancedHUD from '../components/AdvancedHUD';
import PhysicsInfographic from '../components/PhysicsInfographic';

const Home = () => {
    const [useMOND, setUseMOND] = useState(true);
    const [mode, setMode] = useState('GALAXY');
    const [telemetry, setTelemetry] = useState(null);
    const [systemReady, setSystemReady] = useState(false);
    const [introFinished, setIntroFinished] = useState(false);

    const [showInfographic, setShowInfographic] = useState(false);
    const [showHUD, setShowHUD] = useState(true);

    const handleTelemetry = useCallback((data) => {
        setTelemetry(data);
    }, []);

    // Fake system initialization sequence
    useEffect(() => {
        const timer = setTimeout(() => {
            setSystemReady(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleEnterSystem = () => {
        setIntroFinished(true);
    };

    const handleObjectClick = () => {
        setShowInfographic(true);
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#010409]">

            {/* PHYSICS INFOGRAPHIC MODAL */}
            <AnimatePresence>
                {showInfographic && (
                    <PhysicsInfographic
                        mode={mode}
                        onClose={() => setShowInfographic(false)}
                    />
                )}
            </AnimatePresence>

            {/* INTRO SCREEN - Geometric Loading */}
            <AnimatePresence>
                {!introFinished && (
                    <motion.div
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#010409] grid-bg"
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        {/* Spinning Geometric Element */}
                        <div className="relative mb-12">
                            <motion.div
                                className="w-32 h-32 border border-cyan-500/30 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute inset-4 border border-emerald-500/30 rounded-full"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Atom size={32} className="text-cyan-400 animate-pulse" />
                            </div>

                            {/* Scanning line */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-1 bg-cyan-400/50 blur-sm"
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>

                        <h1 className="font-mono text-2xl md:text-3xl font-bold text-slate-100 tracking-[0.2em] mb-2">
                            INSIGHT ARCHITECT
                        </h1>
                        <p className="font-mono text-xs text-slate-500 tracking-[0.3em] mb-12">
                            SYSTEM INITIALIZATION SEQUENCE
                        </p>

                        {/* Status Indicators */}
                        <div className="flex flex-col gap-2 w-64 mb-12">
                            <div className="flex justify-between font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                                <span>Core Physics</span>
                                <span className="text-emerald-400">ONLINE</span>
                            </div>
                            <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-emerald-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 0.8 }}
                                />
                            </div>

                            <div className="flex justify-between font-mono text-[10px] text-slate-400 uppercase tracking-widest mt-2">
                                <span>WebGL Context</span>
                                <span className={systemReady ? "text-emerald-400" : "text-amber-400"}>
                                    {systemReady ? "READY" : "LOADING..."}
                                </span>
                            </div>
                            <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-cyan-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: systemReady ? "100%" : "60%" }}
                                    transition={{ duration: 1.2 }}
                                />
                            </div>
                        </div>

                        {/* Enter Button */}
                        <motion.button
                            onClick={handleEnterSystem}
                            disabled={!systemReady}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: systemReady ? 1 : 0.5, y: 0 }}
                            whileHover={systemReady ? { scale: 1.05, letterSpacing: "0.25em" } : {}}
                            whileTap={{ scale: 0.95 }}
                            className={`
                relative px-12 py-4 font-mono text-xs font-bold tracking-[0.2em] uppercase 
                border transition-all duration-300
                ${systemReady
                                    ? "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] cursor-pointer"
                                    : "border-slate-800 text-slate-600 cursor-not-allowed"}
              `}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {systemReady ? <Play size={12} fill="currentColor" /> : <Activity size={12} className="animate-spin" />}
                                Initialize System
                            </span>

                            {/* Corner brackets */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-50" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-50" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-50" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-50" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT */}
            {/* 3D Advanced MOND Scene (Only renders after intro) */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${introFinished ? 'opacity-100' : 'opacity-0'}`}>
                {introFinished && (
                    <AdvancedMONDScene
                        useMOND={useMOND}
                        mode={mode}
                        onTelemetry={handleTelemetry}
                        onObjectClick={handleObjectClick}
                    />
                )}
            </div>

            {/* Geometric Overlay Lines */}
            <div className="absolute inset-0 pointer-events-none z-[4] opacity-30">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    {/* Golden rectangle lines approximation */}
                    <line x1="38.2%" y1="0" x2="38.2%" y2="100%" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.3" />
                    <line x1="61.8%" y1="0" x2="61.8%" y2="100%" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.3" />
                    <line x1="0" y1="61.8%" x2="100%" y2="61.8%" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.3" />

                    {/* Crosshairs */}
                    <g>
                        <line x1="10%" y1="10%" x2="12%" y2="10%" stroke="#22d3ee" strokeWidth="1" />
                        <line x1="10%" y1="10%" x2="10%" y2="14%" stroke="#22d3ee" strokeWidth="1" />
                    </g>
                    <g>
                        <line x1="90%" y1="10%" x2="88%" y2="10%" stroke="#22d3ee" strokeWidth="1" />
                        <line x1="90%" y1="10%" x2="90%" y2="14%" stroke="#22d3ee" strokeWidth="1" />
                    </g>
                    <g>
                        <line x1="10%" y1="90%" x2="12%" y2="90%" stroke="#22d3ee" strokeWidth="1" />
                        <line x1="10%" y1="90%" x2="10%" y2="86%" stroke="#22d3ee" strokeWidth="1" />
                    </g>
                    <g>
                        <line x1="90%" y1="90%" x2="88%" y2="90%" stroke="#22d3ee" strokeWidth="1" />
                        <line x1="90%" y1="90%" x2="90%" y2="86%" stroke="#22d3ee" strokeWidth="1" />
                    </g>
                </svg>
            </div>

            {/* Gradient Overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#010409]/90 pointer-events-none z-[5]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.05)_0%,transparent_60%)] pointer-events-none z-[5]" />

            {/* Content Layer */}
            <div className={`relative z-20 transition-opacity duration-1000 ${introFinished ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

                {/* Advanced HUD Overlay - with Visibility Toggle */}
                <AnimatePresence>
                    {showHUD && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 pointer-events-none"
                        >
                            <AdvancedHUD
                                useMOND={useMOND}
                                onToggle={setUseMOND}
                                mode={mode}
                                onModeChange={setMode}
                                telemetry={telemetry}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* HUD Toggle Button */}
                <div className="absolute bottom-10 right-10 pointer-events-auto z-50">
                    <button
                        onClick={() => setShowHUD(!showHUD)}
                        className="glass-panel-sm p-3 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300 group"
                        title={showHUD ? "Hide Physics HUD" : "Show Physics HUD"}
                    >
                        {showHUD ? (
                            <EyeOff size={20} className="group-hover:scale-110 transition-transform" />
                        ) : (
                            <Eye size={20} className="group-hover:scale-110 transition-transform" />
                        )}
                    </button>
                </div>

                {/* Hero Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={introFinished ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center px-8 max-w-6xl mx-auto"
                    >
                        {/* Top coordinate markers */}
                        <div className="flex justify-between w-full mb-12 text-[10px] font-mono text-cyan-500/40 tracking-widest">
                            <span>N. 40.7128°</span>
                            <span>W. 74.0060°</span>
                        </div>

                        {/* Decorative top element */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={introFinished ? { opacity: 1 } : {}}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="flex items-center justify-center gap-6 mb-8"
                        >
                            <div className="w-32 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                            <div className="border border-cyan-500/30 px-3 py-1 bg-slate-900/40 rounded">
                                <span className="font-mono text-[10px] text-cyan-400 tracking-[0.2em] uppercase">System Online</span>
                            </div>
                            <div className="w-32 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                        </motion.div>

                        {/* Main Title - Geometric Layout */}
                        <h1 className="relative font-mono font-bold leading-none tracking-tighter mb-10">
                            <span className="block text-6xl md:text-8xl text-slate-100 opacity-90 mb-2">INSIGHT</span>
                            <span className="block text-7xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-[length:200%_auto] animate-[gradient-shift_8s_ease-in-out_infinite] filter drop-shadow-[0_0_25px_rgba(34,211,238,0.2)]">
                                ARCHITECT
                            </span>

                            {/* Decorative lines around title */}
                            <div className="absolute -left-12 top-0 h-full w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent opacity-50 hidden md:block" />
                            <div className="absolute -right-12 top-0 h-full w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent opacity-50 hidden md:block" />
                        </h1>

                        {/* Subtitle with mathematical notation style */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={introFinished ? { opacity: 1 } : {}}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="space-y-8 mb-16 relative"
                        >
                            <p className="font-mono text-lg md:text-xl text-slate-400 tracking-wide max-w-3xl mx-auto">
                                Building data stories <span className="text-cyan-400">beyond headline numbers</span>
                                <span className="block text-xs text-slate-600 mt-2 uppercase tracking-widest">
                  // Methodology: Rigorous • Design: Precision • Impact: Measured
                                </span>
                            </p>

                            {/* Physics mode indicator pill */}
                            <div className="inline-flex items-center gap-4 px-6 py-2 border border-slate-800 rounded-full bg-slate-900/50 backdrop-blur-sm">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${useMOND ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                                    Current Simulation: <span className="text-slate-200">{mode}</span>
                                </span>
                            </div>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={introFinished ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="flex flex-wrap items-center justify-center gap-8 pointer-events-auto mb-20"
                        >
                            <a href="/lab" className="btn-primary group relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                                <FlaskConical size={18} />
                                <span className="tracking-widest">ENTER LAB</span>
                            </a>
                            <a
                                href="https://github.com/DMDTague"
                                target="_blank"
                                rel="noreferrer"
                                className="btn-secondary group"
                            >
                                <FileCode size={18} />
                                <span className="tracking-widest">VIEW SOURCE</span>
                            </a>
                        </motion.div>

                        {/* Credentials - Technical Readout Style */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={introFinished ? { opacity: 1 } : {}}
                            transition={{ delay: 1.4, duration: 0.8 }}
                            className="glass-panel-sm inline-flex items-center gap-10 px-12 py-6 border-t border-cyan-500/20"
                        >
                            <div className="flex flex-col items-start gap-1">
                                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Role</span>
                                <div className="flex items-center gap-2 text-slate-300 font-mono text-xs uppercase tracking-wider">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    Data Analyst
                                </div>
                            </div>

                            <div className="w-px h-8 bg-slate-700/50" />

                            <div className="flex flex-col items-start gap-1">
                                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Specialty</span>
                                <div className="flex items-center gap-2 text-slate-300 font-mono text-xs uppercase tracking-wider">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                    Physics Engines
                                </div>
                            </div>

                            <div className="w-px h-8 bg-slate-700/50" />

                            <div className="flex flex-col items-start gap-1">
                                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Stack</span>
                                <div className="flex items-center gap-2 text-slate-300 font-mono text-xs uppercase tracking-wider">
                                    <Sparkles size={10} className="text-amber-400" />
                                    MOND / SPH / Cosmology
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={introFinished ? { opacity: 1 } : {}}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute bottom-12"
                    >
                        <div className="flex flex-col items-center gap-2 opacity-50">
                            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-cyan-400">System Ready</span>
                            <div className="h-12 w-px bg-gradient-to-b from-cyan-400 to-transparent" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Home;
