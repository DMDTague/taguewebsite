import React, { useState, useEffect } from 'react';

const TelemetryWidget = ({ data, useMOND }) => {
    const [history, setHistory] = useState([]);
    const maxPoints = 50;

    useEffect(() => {
        if (data && data.avgAccelerationRatio !== undefined) {
            setHistory(prev => {
                const newHistory = [...prev, data.avgAccelerationRatio];
                if (newHistory.length > maxPoints) {
                    return newHistory.slice(-maxPoints);
                }
                return newHistory;
            });
        }
    }, [data]);

    // Normalize values for graph
    const maxVal = Math.max(...history, 10);
    const graphHeight = 60;
    const graphWidth = 200;

    // Create SVG path
    const pathData = history.map((val, i) => {
        const x = (i / maxPoints) * graphWidth;
        const y = graphHeight - (val / maxVal) * graphHeight;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
        <div className="bg-lab-surface/80 backdrop-blur-md border border-lab-border rounded-lg p-4 font-mono text-sm">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-lab-green animate-pulse"></div>
                <span className="text-lab-green text-xs uppercase tracking-wider">Live Telemetry</span>
            </div>

            {/* a/a₀ Graph */}
            <div className="mb-3">
                <div className="text-lab-text-muted text-xs mb-1">a/a₀ Ratio (Near Cursor)</div>
                <div className="bg-lab-black rounded border border-lab-border p-2">
                    <svg width={graphWidth} height={graphHeight} className="overflow-visible">
                        {/* Grid lines */}
                        <line x1="0" y1={graphHeight * 0.5} x2={graphWidth} y2={graphHeight * 0.5}
                            stroke="rgba(0, 242, 255, 0.1)" strokeDasharray="2" />
                        <line x1="0" y1={graphHeight * 0.25} x2={graphWidth} y2={graphHeight * 0.25}
                            stroke="rgba(0, 242, 255, 0.05)" strokeDasharray="2" />
                        <line x1="0" y1={graphHeight * 0.75} x2={graphWidth} y2={graphHeight * 0.75}
                            stroke="rgba(0, 242, 255, 0.05)" strokeDasharray="2" />

                        {/* Reference line at a = a₀ */}
                        <line x1="0" y1={graphHeight - (1 / maxVal) * graphHeight}
                            x2={graphWidth} y2={graphHeight - (1 / maxVal) * graphHeight}
                            stroke="rgba(251, 191, 36, 0.4)" strokeDasharray="4" />

                        {/* Data line */}
                        {history.length > 1 && (
                            <>
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke={useMOND ? "#00ff88" : "#38bdf8"}
                                    strokeWidth="2"
                                />
                                {/* Glow effect */}
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke={useMOND ? "#00ff88" : "#38bdf8"}
                                    strokeWidth="6"
                                    opacity="0.2"
                                />
                            </>
                        )}
                    </svg>
                </div>
            </div>

            {/* Current Values */}
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-lab-black/50 rounded p-2">
                    <div className="text-lab-text-muted">Current a/a₀</div>
                    <div className="text-lab-cyan text-lg font-bold">
                        {data?.avgAccelerationRatio?.toFixed(3) || '—'}
                    </div>
                </div>
                <div className="bg-lab-black/50 rounded p-2">
                    <div className="text-lab-text-muted">Particles</div>
                    <div className="text-lab-text text-lg font-bold">
                        {data?.particleCount || '—'}
                    </div>
                </div>
            </div>

            {/* Mode indicator */}
            <div className="mt-3 pt-3 border-t border-lab-border flex items-center justify-between">
                <span className="text-lab-text-muted text-xs">Active Physics</span>
                <span className={`text-xs font-bold ${useMOND ? 'text-lab-green' : 'text-lab-blue'}`}>
                    {useMOND ? 'MOND' : 'NEWTONIAN'}
                </span>
            </div>
        </div>
    );
};

export default TelemetryWidget;
