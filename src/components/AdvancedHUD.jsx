import React from 'react';
import { Terminal, Activity, Gauge, Zap, Circle } from 'lucide-react';

const MODES = [
    { id: 'GALAXY', label: 'Galaxy', desc: 'Rotation curve', color: 'cyan' },
    { id: 'CLUSTER', label: 'Cluster', desc: '+ Neutrinos', color: 'emerald' },
    { id: 'BULLET', label: 'Bullet', desc: 'Collision', color: 'amber' },
    { id: 'VOID', label: 'Void', desc: 'Expansion', color: 'purple' },
];

const AdvancedHUD = ({ useMOND, onToggle, mode, onModeChange, telemetry }) => {
    return (
        <div className="absolute inset-0 pointer-events-none z-10">
            {/* Top Left - Telemetry Panel */}
            <div className="absolute top-32 left-10 pointer-events-auto">
                <div className="glass-panel p-8 min-w-[320px]">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-cyan-500/20">
                        <div className="relative">
                            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                            <div className="absolute inset-0 w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-50" />
                        </div>
                        <span className="font-mono text-sm text-cyan-400 uppercase tracking-[0.2em] font-medium">
                            MOND Telemetry
                        </span>
                    </div>

                    {/* Mode Display */}
                    <div className="mb-8 p-5 bg-slate-900/50 rounded-xl border border-slate-700/30">
                        <div className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-3">Active Simulation</div>
                        <div className="font-mono text-2xl text-cyan-400 font-bold tracking-wide">{mode}</div>
                        <div className="font-mono text-xs text-slate-500 mt-2 leading-relaxed">
                            {mode === 'GALAXY' && 'Observing flat rotation curves under MOND dynamics'}
                            {mode === 'CLUSTER' && 'Baryonic matter + hot sterile neutrinos (~11 eV)'}
                            {mode === 'BULLET' && 'SPH gas collision — neutrinos pass, gas stops'}
                            {mode === 'VOID' && 'KBC Void with Hubble drag: d²x/dt² + 2H dx/dt'}
                        </div>
                    </div>

                    {/* Particle Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-slate-900/30 rounded-xl border border-cyan-500/10">
                            <div className="w-3 h-3 rounded-full bg-cyan-400 mx-auto mb-3 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
                            <div className="font-mono text-[9px] text-slate-500 uppercase tracking-wider mb-1">Baryon</div>
                            <div className="font-mono text-xl text-cyan-400 font-bold">{telemetry?.baryons || 0}</div>
                        </div>
                        <div className="text-center p-4 bg-slate-900/30 rounded-xl border border-purple-500/10">
                            <div className="w-3 h-3 rounded-full bg-purple-400 mx-auto mb-3 opacity-50 shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
                            <div className="font-mono text-[9px] text-slate-500 uppercase tracking-wider mb-1">Neutrino</div>
                            <div className="font-mono text-xl text-purple-400 font-bold">{telemetry?.neutrinos || 0}</div>
                        </div>
                        <div className="text-center p-4 bg-slate-900/30 rounded-xl border border-orange-500/10">
                            <div className="w-3 h-3 rounded-full bg-orange-400 mx-auto mb-3 shadow-[0_0_10px_rgba(251,146,60,0.6)]" />
                            <div className="font-mono text-[9px] text-slate-500 uppercase tracking-wider mb-1">Gas</div>
                            <div className="font-mono text-xl text-orange-400 font-bold">{telemetry?.gas || 0}</div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-4 pt-4 border-t border-cyan-500/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-slate-400">
                                <Gauge size={16} />
                                <span className="font-mono text-xs tracking-wide">a₀ Scale</span>
                            </div>
                            <span className="font-mono text-sm text-cyan-400 font-medium">1.2×10⁻¹⁰ m/s²</span>
                        </div>
                        {mode === 'VOID' && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Zap size={16} />
                                    <span className="font-mono text-xs tracking-wide">Scale Factor</span>
                                </div>
                                <span className="font-mono text-sm text-emerald-400 font-medium">{telemetry?.scaleFactor || '1.000'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Right - Controls */}
            <div className="absolute top-32 right-10 pointer-events-auto space-y-6">
                {/* Physics Toggle */}
                <div className="glass-panel p-6">
                    <div className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-4">
                        Physics Engine
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/60 rounded-xl p-2">
                        <button
                            onClick={() => onToggle(false)}
                            className={`font-mono text-sm px-6 py-3 rounded-lg transition-all duration-400 ${!useMOND
                                    ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-blue-500/30'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            NEWTON
                        </button>
                        <button
                            onClick={() => onToggle(true)}
                            className={`font-mono text-sm px-6 py-3 rounded-lg transition-all duration-400 ${useMOND
                                    ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-500/30'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            MOND
                        </button>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${useMOND
                                ? 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                                : 'bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]'
                            }`} />
                        <span className="font-mono text-xs text-slate-500">
                            {useMOND ? 'Deep field regime active' : 'Classical mechanics'}
                        </span>
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="glass-panel p-6">
                    <div className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-4">
                        Simulation Mode
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {MODES.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => onModeChange(m.id)}
                                className={`font-mono text-xs p-4 rounded-xl transition-all duration-300 text-left ${mode === m.id
                                        ? `bg-${m.color}-500/15 text-${m.color}-400 border border-${m.color}-500/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]`
                                        : 'bg-slate-900/40 text-slate-500 border border-slate-700/30 hover:border-slate-600 hover:text-slate-400'
                                    }`}
                                style={mode === m.id ? {
                                    backgroundColor: m.color === 'cyan' ? 'rgba(34,211,238,0.1)' :
                                        m.color === 'emerald' ? 'rgba(16,185,129,0.1)' :
                                            m.color === 'amber' ? 'rgba(245,158,11,0.1)' :
                                                'rgba(168,85,247,0.1)',
                                    borderColor: m.color === 'cyan' ? 'rgba(34,211,238,0.4)' :
                                        m.color === 'emerald' ? 'rgba(16,185,129,0.4)' :
                                            m.color === 'amber' ? 'rgba(245,158,11,0.4)' :
                                                'rgba(168,85,247,0.4)',
                                    color: m.color === 'cyan' ? '#22d3ee' :
                                        m.color === 'emerald' ? '#10b981' :
                                            m.color === 'amber' ? '#f59e0b' :
                                                '#a855f7'
                                } : {}}
                            >
                                <div className="font-bold text-sm mb-1">{m.label}</div>
                                <div className="text-[10px] opacity-60">{m.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Center - Terminal */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto">
                <div className="glass-panel-sm px-8 py-4 flex items-center gap-4">
                    <Terminal size={18} className="text-cyan-400" />
                    <span className="font-mono text-sm text-slate-400">
                        dylan@mond-engine:~$ <span className="text-cyan-400">./simulate</span>{' '}
                        <span className="text-slate-600">--mode=</span>
                        <span className="text-emerald-400">{mode.toLowerCase()}</span>{' '}
                        <span className="text-slate-600">--physics=</span>
                        <span className={useMOND ? 'text-emerald-400' : 'text-blue-400'}>{useMOND ? 'mond' : 'newton'}</span>
                        <span className="w-2.5 h-5 bg-cyan-400 inline-block ml-2 animate-pulse" />
                    </span>
                </div>
            </div>

            {/* Legend - Bottom Left */}
            <div className="absolute bottom-10 left-10 pointer-events-none">
                <div className="glass-panel-sm px-6 py-4">
                    <div className="flex items-center gap-6 font-mono text-[11px]">
                        <div className="flex items-center gap-2">
                            <Circle size={10} className="text-cyan-400 fill-cyan-400" />
                            <span className="text-slate-500 uppercase tracking-wider">Baryon</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Circle size={10} className="text-purple-400 fill-purple-400 opacity-40" />
                            <span className="text-slate-500 uppercase tracking-wider">Neutrino</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Circle size={10} className="text-orange-400 fill-orange-400" />
                            <span className="text-slate-500 uppercase tracking-wider">Gas</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedHUD;
