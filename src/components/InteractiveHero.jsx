import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', value: 400, insight: 'Raw Data' },
    { name: 'Feb', value: 300, insight: 'Cleaning' },
    { name: 'Mar', value: 550, insight: 'Analysis' },
    { name: 'Apr', value: 480, insight: 'Modeling' },
    { name: 'May', value: 690, insight: 'Optimization' },
    { name: 'Jun', value: 850, insight: 'Impact' },
];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                padding: '0.5rem 1rem',
                border: '1px solid var(--accent-primary)',
                borderRadius: '0.5rem',
                color: 'var(--text-primary)'
            }}>
                <p className="label">{`${payload[0].payload.name}: ${payload[0].payload.insight}`}</p>
                <p className="intro" style={{ color: 'var(--accent-primary)' }}>{`Value: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const InteractiveHero = () => {
    return (
        <div className="hero-visual" style={{ height: '300px', width: '100%', maxWidth: '600px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#38bdf8"
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                * Hover to explore the analytical process
            </p>
        </div>
    );
};

export default InteractiveHero;
