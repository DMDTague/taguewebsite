import React from 'react';
import { Github, Linkedin, Mail, Terminal, Zap, Atom } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#010409] border-t border-cyan-500/10 py-16">
            <div className="container">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Terminal size={24} className="text-cyan-400" />
                        </div>
                        <div>
                            <span className="font-mono text-lg text-slate-200 font-bold tracking-wide">DYLAN.TAGUE</span>
                            <span className="font-mono text-xs text-slate-600 block mt-1">// Insight Architect</span>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-8">
                        <a
                            href="https://github.com/DMDTague"
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-600 hover:text-cyan-400 transition-all hover:scale-110"
                        >
                            <Github size={22} />
                        </a>
                        <a
                            href="#"
                            className="text-slate-600 hover:text-cyan-400 transition-all hover:scale-110"
                        >
                            <Linkedin size={22} />
                        </a>
                        <a
                            href="mailto:contact@dylantague.com"
                            className="text-slate-600 hover:text-amber-400 transition-all hover:scale-110"
                        >
                            <Mail size={22} />
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="font-mono text-xs text-slate-600">
                        <span className="text-cyan-400">©</span> {new Date().getFullYear()} All systems operational
                    </div>
                </div>

                {/* Status Bar */}
                <div className="glass-panel-sm p-5 flex items-center justify-center gap-8">
                    <div className="font-mono text-[10px] text-slate-600 flex items-center gap-8 uppercase tracking-[0.15em]">
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                            PHYSICS_ENGINE: <span className="text-emerald-400">ACTIVE</span>
                        </span>
                        <span className="text-slate-700">•</span>
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                            DATA_PIPELINE: <span className="text-cyan-400">RUNNING</span>
                        </span>
                        <span className="text-slate-700">•</span>
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                            INSIGHTS: <span className="text-amber-400">GENERATING</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
