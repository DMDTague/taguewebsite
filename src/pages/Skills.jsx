import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Code, BarChart3, Cpu, Workflow, Brain, Info, Terminal, Layers, Box } from 'lucide-react';

const skillCategories = [
    {
        title: 'Data & Engineering',
        subtitle: 'INGEST → TRANSFORM → LOAD',
        icon: Database,
        color: '#22d3ee',
        bgColor: 'rgba(34,211,238,0.08)',
        skills: [
            { name: 'Python', level: 82, reason: "Moving towards heavy backend/ML logic (FastAPI, Scikit-Learn) beyond scripting." },
            { name: 'SQL / dbt', level: 78, reason: "Core data engineering pillar; essential for robust pipelines." },
        ]
    },
    {
        title: 'Full Stack & Systems',
        subtitle: 'ARCHITECT → BUILD → SCALE',
        icon: Layers,
        color: '#a855f7',
        bgColor: 'rgba(168,85,247,0.08)',
        skills: [
            { name: 'JavaScript / TS', level: 94, reason: "Dominant language (97% of repos). Next.js 14 App Router, complex UI logic." },
            { name: 'Next.js & React', level: 92, reason: "High-end architecture: Dynamic imports, SSR strategies, persistent contexts." },
            { name: 'C / Systems', level: 88, reason: "Validated by MOND engine (61.8% C repo). Low-level memory management." },
            { name: '3D Rendering', level: 85, reason: "Top-tier storytelling with R3F, Drei, and custom shaders." },
        ]
    }
];

const SkillBar = ({ name, level, color, reason }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="mb-5 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex justify-between mb-2 items-center">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-slate-300">{name}</span>
                    <Info size={12} className={`text-slate-600 transition-colors ${isHovered ? 'text-cyan-400' : ''}`} />
                </div>
                <span className="font-mono text-xs text-slate-600">{level}%</span>
            </div>
            <div className="h-2 bg-slate-900/80 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${level}%` }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="h-full rounded-full relative"
                    style={{ backgroundColor: color }}
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                </motion.div>
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 bottom-full mb-2 z-10 w-64 p-3 bg-slate-900/95 border border-slate-700/50 rounded-lg shadow-xl backdrop-blur-sm pointer-events-none"
                    >
                        <div className="text-[10px] text-slate-300 font-sans leading-tight">
                            <span className="text-cyan-400 font-mono block mb-1">EVIDENCE:</span>
                            {reason}
                        </div>
                        {/* Arrow */}
                        <div className="absolute bottom-[-4px] left-4 w-2 h-2 bg-slate-900/95 border-b border-r border-slate-700/50 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Skills = () => {
    return (
        <div className="min-h-screen bg-[#010409] grid-bg-subtle pt-32 pb-20 relative overflow-hidden">
            {/* Geometric Overlay Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="5,5" />
                    <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="5,5" />
                    <line x1="33%" y1="0" x2="33%" y2="100%" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="5,5" />
                    <line x1="66%" y1="0" x2="66%" y2="100%" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="5,5" />
                </svg>
            </div>

            <div className="container relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    {/* Decorative */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-20 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                        <Cpu size={20} className="text-cyan-400" />
                        <div className="w-20 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                    </div>

                    <h1 className="font-mono text-6xl md:text-8xl font-bold text-slate-100 mb-6 tracking-tight">
                        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">STACK</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Proficiency validated by distinct architectural patterns and repo analysis.
                        <span className="text-cyan-400/80 block mt-2 font-mono text-sm uppercase tracking-widest">
                            Hover skills for evidence
                        </span>
                    </p>
                </motion.div>

                {/* Skills Grid - Centered 2 Columns layout */}
                <div className="grid lg:grid-cols-2 gap-10 mb-20 max-w-5xl mx-auto">
                    {skillCategories.map((category, index) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.6 }}
                            className="glass-panel corner-brackets overflow-hidden hover:border-cyan-500/30 transition-colors duration-500"
                        >
                            {/* Category Header */}
                            <div
                                className="p-8 border-b border-slate-700/30 backdrop-blur-md"
                                style={{ backgroundColor: category.bgColor }}
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <category.icon size={28} style={{ color: category.color }} />
                                    <h3 className="font-mono text-xl text-slate-100 font-bold">{category.title}</h3>
                                </div>
                                <p className="font-mono text-[10px] text-slate-500 tracking-[0.2em]">
                                    {category.subtitle}
                                </p>
                            </div>

                            {/* Skills List */}
                            <div className="p-8 bg-slate-900/20">
                                {category.skills.map((skill) => (
                                    <SkillBar
                                        key={skill.name}
                                        name={skill.name}
                                        level={skill.level}
                                        color={category.color}
                                        reason={skill.reason}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Operational Parameters */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="font-mono text-3xl text-slate-100 tracking-tight flex items-center justify-center gap-4">
                            <span className="h-px w-12 bg-slate-800"></span>
                            <span>OPERATIONAL <span className="text-cyan-400">PARAMETERS</span></span>
                            <span className="h-px w-12 bg-slate-800"></span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { label: 'Primary Language', value: 'TypeScript', icon: Code, color: '#22d3ee' },
                            { label: 'System Logic', value: 'C / Low-level', icon: Terminal, color: '#10b981' },
                            { label: 'Viz Platform', value: 'R3F / WebGL', icon: Box, color: '#f59e0b' },
                            { label: 'Architecture', value: 'Next.js 14', icon: Layers, color: '#a855f7' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="glass-panel p-8 text-center group hover:scale-105 transition-transform relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div
                                    className="w-14 h-14 mx-auto mb-5 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/5"
                                    style={{ backgroundColor: `${item.color}10` }}
                                >
                                    <item.icon size={28} style={{ color: item.color }} />
                                </div>
                                <div className="font-mono text-[10px] text-slate-600 uppercase tracking-[0.2em] mb-2">{item.label}</div>
                                <div className="font-mono text-xl text-slate-200 font-bold">{item.value}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Skills;
