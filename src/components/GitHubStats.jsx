import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Github, Code } from 'lucide-react';

const COLORS = ['#38bdf8', '#0ea5e9', '#2dd4bf', '#94a3b8', '#64748b'];

const GitHubStats = () => {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await fetch('https://api.github.com/users/DMDTague/repos');
                if (!response.ok) throw new Error('Failed to fetch GitHub data');
                const repos = await response.json();

                const langCounts = {};
                repos.forEach(repo => {
                    if (repo.language) {
                        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
                    }
                });

                const langData = Object.keys(langCounts)
                    .map(lang => ({ name: lang, value: langCounts[lang] }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 5); // Top 5

                setLanguages(langData);
                setLoading(false);
            } catch (err) {
                console.error(err);
                // Fallback mock data
                setLanguages([
                    { name: 'Python', value: 12 },
                    { name: 'SQL', value: 8 },
                    { name: 'JavaScript', value: 5 },
                    { name: 'R', value: 3 },
                    { name: 'HTML/CSS', value: 3 },
                ]);
                setLoading(false);
            }
        };

        fetchRepos();
    }, []);

    if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading GitHub stats...</div>;

    return (
        <div className="card github-stats" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Github size={24} color="var(--text-primary)" />
                <h3 style={{ fontSize: '1.25rem', marginBottom: 0 }}>GitHub Activity</h3>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Top Languages by Repo Count
            </p>

            <div style={{ width: '100%', height: '200px' }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={languages}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {languages.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
                {languages.map((entry, index) => (
                    <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GitHubStats;
