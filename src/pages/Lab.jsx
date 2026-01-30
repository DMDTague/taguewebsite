import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Filter, Search, Github, X, ExternalLink, Atom } from 'lucide-react';
import experimentsData from '../data/experiments.json';

const statusColors = {
    complete: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
    'in-progress': { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
    archived: { bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)', text: '#64748b' }
};

const ExperimentCard = ({ experiment, onClick, index }) => {
    const status = statusColors[experiment.status] || statusColors.complete;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            onClick={onClick}
            className="glass-panel corner-brackets p-8 cursor-pointer group"
        >
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className="font-mono text-[10px] text-slate-600 uppercase tracking-[0.2em]">SPEC:</span>
                        <h3 className="font-mono text-xl text-cyan-400 font-bold mt-2 group-hover:glow-text-cyan transition-all">
                            {experiment.title}
                        </h3>
                    </div>
                    <span
                        className="font-mono text-[10px] px-4 py-2 rounded-lg border uppercase tracking-wider"
                        style={{
                            backgroundColor: status.bg,
                            borderColor: status.border,
                            color: status.text
                        }}
                    >
                        {experiment.status?.toUpperCase() || 'COMPLETE'}
                    </span>
                </div>

                {/* Toolstack */}
                <div className="flex flex-wrap gap-2">
                    {experiment.toolstack?.slice(0, 4).map((tool, i) => (
                        <span
                            key={i}
                            className="font-mono text-[10px] px-3 py-1.5 bg-slate-900/60 text-cyan-300/70 rounded-lg border border-slate-700/30"
                        >
                            {tool}
                        </span>
                    ))}
                </div>
            </div>

            {/* Delta Preview */}
            <div className="p-5 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <span>Δ DELTA</span>
                </div>
                <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">{experiment.delta}</p>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-700/30 flex justify-between items-center">
                <span className="font-mono text-[10px] text-slate-600 tracking-wider">
                    ID: {experiment.id?.toString().padStart(4, '0')}
                </span>
                <div className="flex gap-4">
                    {experiment.repoUrl && (
                        <a
                            href={experiment.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-slate-600 hover:text-cyan-400 transition-colors"
                        >
                            <Github size={16} />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const DetailModal = ({ experiment, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-[#010409]/95 backdrop-blur-xl"
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
            onClick={e => e.stopPropagation()}
            className="relative max-w-3xl w-full glass-panel corner-brackets overflow-hidden"
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-10"
            >
                <X size={24} />
            </button>

            {/* Header */}
            <div className="p-10 border-b border-cyan-500/10">
                <span className="font-mono text-[11px] text-slate-600 uppercase tracking-[0.2em]">Experiment Specification</span>
                <h2 className="font-mono text-3xl text-cyan-400 font-bold mt-3 glow-text-cyan">{experiment.title}</h2>
                <div className="flex flex-wrap gap-3 mt-5">
                    {experiment.toolstack?.map((tool, i) => (
                        <span
                            key={i}
                            className="font-mono text-xs px-4 py-2 bg-slate-900/60 text-cyan-300 rounded-lg border border-slate-700/30"
                        >
                            {tool}
                        </span>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="p-10 space-y-8">
                <div>
                    <div className="font-mono text-[11px] text-cyan-400 uppercase tracking-[0.2em] mb-3">Hypothesis</div>
                    <p className="text-slate-300 leading-relaxed text-lg">{experiment.hypothesis}</p>
                </div>
                <div>
                    <div className="font-mono text-[11px] text-amber-400 uppercase tracking-[0.2em] mb-3">Methodology</div>
                    <p className="text-slate-400 leading-relaxed">{experiment.methodology}</p>
                </div>
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                    <div className="font-mono text-[11px] text-emerald-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-3">
                        <span>Δ DELTA</span>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                    </div>
                    <p className="text-emerald-300 font-medium text-lg leading-relaxed">{experiment.delta}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-900/30 border-t border-cyan-500/10 flex justify-between items-center">
                <span className="font-mono text-xs text-slate-600">ID: {experiment.id?.toString().padStart(4, '0')}</span>
                <div className="flex gap-6">
                    {experiment.repoUrl && (
                        <a
                            href={experiment.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 font-mono text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                            <Github size={18} /> View Code
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    </motion.div>
);

const Lab = () => {
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExperiment, setSelectedExperiment] = useState(null);

    const filteredExperiments = experimentsData.filter(exp => {
        const matchesFilter = filter === 'All' || (exp.status || 'complete').toLowerCase().replace('-', ' ') === filter.toLowerCase();
        const matchesSearch = !searchQuery || exp.title.toLowerCase().includes(searchQuery.toLowerCase()) || exp.toolstack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#010409] grid-bg-subtle pt-32 pb-20">
            <div className="container">
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
                        <FlaskConical size={20} className="text-cyan-400" />
                        <div className="w-20 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                    </div>

                    <h1 className="font-mono text-6xl md:text-8xl font-bold text-slate-100 mb-6 tracking-tight">
                        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">LAB</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Each project is an experiment in extracting actionable insight from raw data.
                        <span className="text-slate-500 block mt-2">Methodology documented. Results verified.</span>
                    </p>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="glass-panel p-6 mb-16 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    {/* Search */}
                    <div className="relative flex-1 max-w-lg">
                        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input
                            type="text"
                            placeholder="Search experiments or tools..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl pl-14 pr-6 py-4 font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <Filter size={16} className="text-slate-600" />
                        <div className="flex gap-2 bg-slate-900/40 rounded-xl p-2">
                            {['All', 'Complete', 'In Progress'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`font-mono text-xs px-5 py-2.5 rounded-lg transition-all ${filter === status
                                            ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                                            : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    {status.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Grid */}
                <motion.div layout className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
                    <AnimatePresence mode="popLayout">
                        {filteredExperiments.map((experiment, index) => (
                            <ExperimentCard
                                key={experiment.id}
                                experiment={experiment}
                                index={index}
                                onClick={() => setSelectedExperiment(experiment)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredExperiments.length === 0 && (
                    <div className="text-center py-20">
                        <p className="font-mono text-slate-600 text-lg">No experiments match your criteria.</p>
                    </div>
                )}

                {/* Stats */}
                <div className="glass-panel p-10">
                    <div className="flex justify-center gap-16 font-mono">
                        <div className="text-center">
                            <div className="text-5xl text-cyan-400 font-bold mb-2">{experimentsData.length}</div>
                            <div className="text-slate-500 text-sm uppercase tracking-wider">Experiments</div>
                        </div>
                        <div className="w-px bg-slate-700/50" />
                        <div className="text-center">
                            <div className="text-5xl text-emerald-400 font-bold mb-2">
                                {experimentsData.filter(e => e.status === 'complete').length}
                            </div>
                            <div className="text-slate-500 text-sm uppercase tracking-wider">Complete</div>
                        </div>
                        <div className="w-px bg-slate-700/50" />
                        <div className="text-center">
                            <div className="text-5xl text-amber-400 font-bold mb-2">
                                {experimentsData.filter(e => e.status === 'in-progress').length}
                            </div>
                            <div className="text-slate-500 text-sm uppercase tracking-wider">In Progress</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedExperiment && (
                    <DetailModal experiment={selectedExperiment} onClose={() => setSelectedExperiment(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Lab;
