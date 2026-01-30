import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check, AlertCircle, Scale, Brain } from 'lucide-react';
import { PHYSICS_DATA } from '../data/physicsExplanations';

const PhysicsInfographic = ({ mode, onClose }) => {
    const [activeTab, setActiveTab] = useState('mond'); // 'mond' or 'newton'
    const data = PHYSICS_DATA[mode];

    if (!data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#010409]/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl glass-panel corner-brackets overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Left Panel: Context */}
                <div className="w-full md:w-1/3 bg-slate-900/50 p-8 border-r border-cyan-500/10 flex flex-col relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-grid-bg opacity-20 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.2em] mb-4">
                            Object Analysis
                        </div>

                        <h2 className="font-mono text-3xl font-bold text-slate-100 mb-2 leading-tight">
                            {data.object}
                        </h2>
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                                {data.type}
                            </span>
                        </div>

                        <div className="mt-auto space-y-6">
                            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                                <div className="flex items-center gap-2 mb-2 text-amber-400">
                                    <Scale size={16} />
                                    <span className="font-mono text-xs uppercase tracking-wide font-bold">The Conflict</span>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {mode === 'GALAXY' && "Visible mass isn't enough to hold the galaxy together at these speeds."}
                                    {mode === 'CLUSTER' && "Clusters should fly apart without massive amounts of unseen matter."}
                                    {mode === 'BULLET' && "Collision geometry challenges standard dark matter collisionless models."}
                                    {mode === 'VOID' && "We appear to live in an impossible void causing expansion anomalies."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Comparison */}
                <div className="w-full md:w-2/3 p-8 flex flex-col bg-[#050b14]/90">
                    <h3 className="font-mono text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                        <Brain size={20} className="text-cyan-400" />
                        {data.title}
                    </h3>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 p-1 bg-slate-900/80 rounded-lg self-start">
                        <button
                            onClick={() => setActiveTab('newton')}
                            className={`px-4 py-2 rounded-md font-mono text-xs font-bold transition-all ${activeTab === 'newton'
                                    ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            STANDARD MODEL (NEWTON)
                        </button>
                        <button
                            onClick={() => setActiveTab('mond')}
                            className={`px-4 py-2 rounded-md font-mono text-xs font-bold transition-all ${activeTab === 'mond'
                                    ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            MODIFIED GRAVITY (MOND)
                        </button>
                    </div>

                    {/* Content Area */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-grow space-y-6"
                        >
                            <div className={`p-6 rounded-xl border ${activeTab === 'mond' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-blue-500/20 bg-blue-500/5'
                                }`}>
                                <div className="flex items-start justify-between mb-4">
                                    <h4 className={`font-mono text-lg font-bold ${activeTab === 'mond' ? 'text-emerald-400' : 'text-blue-400'
                                        }`}>
                                        {activeTab === 'mond' ? data.mond.title : data.newton.title}
                                    </h4>
                                    {/* Status Badge */}
                                    <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase font-bold border ${(activeTab === 'mond' ? data.mond.status : data.newton.status) === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                            (activeTab === 'mond' ? data.mond.status : data.newton.status) === 'fail' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                        }`}>
                                        {activeTab === 'mond' ? data.mond.status : data.newton.status}
                                    </span>
                                </div>

                                <p className="text-slate-300 leading-relaxed mb-4">
                                    {activeTab === 'mond' ? data.mond.desc : data.newton.desc}
                                </p>

                                <div className="flex items-start gap-3 mt-4 pt-4 border-t border-slate-700/30">
                                    <ArrowRight size={16} className={`mt-1 flex-shrink-0 ${activeTab === 'mond' ? 'text-emerald-500' : 'text-blue-500'
                                        }`} />
                                    <p className={`font-mono text-sm ${activeTab === 'mond' ? 'text-emerald-300/80' : 'text-blue-300/80'
                                        }`}>
                                        {activeTab === 'mond' ? data.mond.prediction : data.newton.prediction}
                                    </p>
                                </div>
                            </div>

                            {/* Footer Credibility */}
                            <div className="mt-auto pt-6 border-t border-slate-700/50">
                                <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-2">
                                    Why is this credible?
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed italic">
                                    "{data.credibility}"
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default PhysicsInfographic;
