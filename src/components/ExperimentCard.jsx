import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

const ExperimentCard = ({ experiment }) => {
    const statusColors = {
        complete: 'text-lab-green bg-lab-green/10 border-lab-green/30',
        'in-progress': 'text-lab-amber bg-lab-amber/10 border-lab-amber/30',
        archived: 'text-lab-text-muted bg-lab-text-muted/10 border-lab-text-muted/30'
    };

    return (
        <div className="group relative bg-lab-surface border border-lab-border rounded-lg overflow-hidden transition-all duration-300 hover:border-lab-green/50 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)]">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-lab-green/50 group-hover:border-lab-green transition-colors" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-lab-green/50 group-hover:border-lab-green transition-colors" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-lab-green/50 group-hover:border-lab-green transition-colors" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-lab-green/50 group-hover:border-lab-green transition-colors" />

            {/* Header */}
            <div className="p-5 border-b border-lab-border">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <span className="font-mono text-xs text-lab-text-muted uppercase tracking-wider">SPEC:</span>
                        <h3 className="font-mono text-lg text-lab-green font-bold mt-1 group-hover:text-shadow-glow transition-all">
                            {experiment.title}
                        </h3>
                    </div>
                    <span className={`font-mono text-xs px-3 py-1 rounded border ${statusColors[experiment.status] || statusColors.complete}`}>
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-2" />
                        {experiment.status?.toUpperCase() || 'COMPLETE'}
                    </span>
                </div>

                {/* Toolstack */}
                <div className="flex flex-wrap gap-2">
                    {experiment.toolstack?.map((tool, i) => (
                        <span key={i} className="font-mono text-xs px-2 py-1 bg-lab-black/50 text-lab-cyan rounded">
                            {tool}
                        </span>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
                {/* Hypothesis */}
                <div>
                    <div className="font-mono text-xs text-lab-cyan uppercase tracking-wider mb-1">
                        HYPOTHESIS:
                    </div>
                    <p className="text-sm text-lab-text leading-relaxed">
                        {experiment.hypothesis}
                    </p>
                </div>

                {/* Methodology */}
                <div>
                    <div className="font-mono text-xs text-lab-amber uppercase tracking-wider mb-1">
                        METHODOLOGY:
                    </div>
                    <p className="text-sm text-lab-text-dim leading-relaxed">
                        {experiment.methodology}
                    </p>
                </div>

                {/* Delta */}
                <div className="bg-lab-black/30 rounded-lg p-4 border border-lab-green/20">
                    <div className="font-mono text-xs text-lab-green uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span>Δ DELTA</span>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                    </div>
                    <p className="text-sm text-lab-green font-medium">
                        {experiment.delta}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-lab-black/30 border-t border-lab-border flex items-center justify-between">
                <div className="font-mono text-xs text-lab-text-muted">
                    ID: {experiment.id?.toString().padStart(4, '0') || '0001'}
                </div>
                <div className="flex items-center gap-3">
                    {experiment.repoUrl && (
                        <a
                            href={experiment.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-lab-text-muted hover:text-lab-green transition-colors"
                        >
                            <Github size={18} />
                        </a>
                    )}
                    {experiment.demoUrl && experiment.demoUrl !== '#' && (
                        <a
                            href={experiment.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-lab-text-muted hover:text-lab-cyan transition-colors"
                        >
                            <ExternalLink size={18} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExperimentCard;
