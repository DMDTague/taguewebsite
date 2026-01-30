import React from 'react';
import { Terminal, Activity, Gauge, Zap } from 'lucide-react';

const HUDOverlay = ({ useMOND, onToggle, telemetry }) => {
    return (
        <div className="absolute inset-0 pointer-events-none z-10">
            {/* Top Left - System Status */}
            <div className="absolute top-24 left-6 pointer-events-auto">
                <div className="backdrop-blur-xl bg-slate-950/60 border border-cyan-500/30 rounded-xl p-5 min-w-[280px] shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/20">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        <span className="font-mono text-xs text-cyan-400 uppercase tracking-[0.2em]">
                            System Telemetry
                        </span>
                    </div>

                    {/* Metrics Grid */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Activity size={14} />
                                <span className="font-mono text-xs">Particles</span>
                            </div>
                            <span className="font-mono text-sm text-slate-200 font-bold">
                                {telemetry?.particleCount || 600}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Gauge size={14} />
                                <span className="font-mono text-xs">a₀ Scale</span>
                            </div>
                            <span className="font-mono text-sm text-cyan-400 font-bold">
                                1.2×10⁻¹⁰ m/s²
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Zap size={14} />
                                <span className="font-mono text-xs">Physics</span>
                            </div>
                            <span className={`font-mono text-sm font-bold ${useMOND ? 'text-emerald-400' : 'text-blue-400'}`}>
                                {useMOND ? 'MOND' : 'NEWTONIAN'}
                            </span>
                        </div>
                    </div>

                    {/* a/a₀ Visualization */}
                    <div className="mt-4 pt-3 border-t border-cyan-500/20">
                        <div className="font-mono text-xs text-slate-500 mb-2">Acceleration Regime</div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                                style={{ width: useMOND ? '75%' : '40%' }}
                            />
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="font-mono text-[10px] text-cyan-400">a ≪ a₀</span>
                            <span className="font-mono text-[10px] text-slate-500">a ≫ a₀</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Right - Physics Toggle */}
            <div className="absolute top-24 right-6 pointer-events-auto">
                <div className="backdrop-blur-xl bg-slate-950/60 border border-cyan-500/30 rounded-xl p-4 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                    <div className="font-mono text-xs text-slate-500 uppercase tracking-wider mb-3">
                        Physics Engine
                    </div>

                    <div className="flex items-center gap-1 bg-slate-900/80 rounded-lg p-1">
                        <button
                            onClick={() => onToggle(false)}
                            className={`font-mono text-sm px-4 py-2 rounded-md transition-all duration-300 ${!useMOND
                                    ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            NEWTON
                        </button>
                        <button
                            onClick={() => onToggle(true)}
                            className={`font-mono text-sm px-4 py-2 rounded-md transition-all duration-300 ${useMOND
                                    ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            MOND
                        </button>
                    </div>

                    {/* Status indicator */}
                    <div className="mt-3 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${useMOND ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-blue-400'
                            }`} />
                        <span className="font-mono text-xs text-slate-400">
                            {useMOND ? 'Deep field regime active' : 'Classical mechanics'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Center - Terminal */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
                <div className="backdrop-blur-xl bg-slate-950/60 border border-cyan-500/30 rounded-xl px-6 py-3 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                    <div className="flex items-center gap-3">
                        <Terminal size={16} className="text-cyan-400" />
                        <span className="font-mono text-sm text-slate-300">
                            dylan@laboratory:~$ <span className="text-cyan-400">./insight_architect</span>
                            <span className="w-2 h-4 bg-cyan-400 inline-block ml-1 animate-pulse" />
                        </span>
                    </div>
                </div>
            </div>

            {/* Corner Decorations */}
            <div className="absolute top-20 left-0 w-32 h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
            <div className="absolute top-20 left-0 w-px h-32 bg-gradient-to-b from-cyan-500/50 to-transparent" />
            <div className="absolute top-20 right-0 w-32 h-px bg-gradient-to-l from-cyan-500/50 to-transparent" />
            <div className="absolute top-20 right-0 w-px h-32 bg-gradient-to-b from-cyan-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-32 h-px bg-gradient-to-r from-emerald-500/30 to-transparent" />
            <div className="absolute bottom-0 left-0 w-px h-32 bg-gradient-to-t from-emerald-500/30 to-transparent" />
            <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-emerald-500/30 to-transparent" />
            <div className="absolute bottom-0 right-0 w-px h-32 bg-gradient-to-t from-emerald-500/30 to-transparent" />
        </div>
    );
};

export default HUDOverlay;
