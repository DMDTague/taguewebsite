import React from 'react';

const PhysicsToggle = ({ useMOND, onToggle }) => {
    return (
        <div className="flex items-center gap-3 bg-lab-surface/80 backdrop-blur-md border border-lab-border rounded-lg p-2 font-mono text-sm">
            <span className="text-lab-text-muted text-xs uppercase tracking-wider px-2">Physics</span>

            <div className="relative flex items-center bg-lab-black rounded-md overflow-hidden">
                {/* Sliding indicator */}
                <div
                    className={`absolute h-full w-1/2 transition-transform duration-300 ease-out rounded-md ${useMOND ? 'translate-x-full bg-lab-green/20' : 'translate-x-0 bg-lab-blue/20'
                        }`}
                />

                <button
                    onClick={() => onToggle(false)}
                    className={`relative z-10 px-4 py-2 transition-colors duration-200 ${!useMOND
                            ? 'text-lab-blue font-bold'
                            : 'text-lab-text-muted hover:text-lab-text'
                        }`}
                >
                    NEWTON
                </button>

                <div className="w-px h-6 bg-lab-border" />

                <button
                    onClick={() => onToggle(true)}
                    className={`relative z-10 px-4 py-2 transition-colors duration-200 ${useMOND
                            ? 'text-lab-green font-bold'
                            : 'text-lab-text-muted hover:text-lab-text'
                        }`}
                >
                    MOND
                </button>
            </div>

            {/* Status indicator */}
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${useMOND ? 'bg-lab-green animate-pulse' : 'bg-lab-blue'
                }`} />
        </div>
    );
};

export default PhysicsToggle;
