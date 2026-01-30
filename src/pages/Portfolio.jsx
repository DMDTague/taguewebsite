import React, { useState, useEffect } from 'react';
import projectsData from '../data/projects.json';
import ProjectCard from '../components/ProjectCard';

const categories = ["All", "Operational Efficiency", "Executive Dashboards", "Predictive Insights"];

const Portfolio = () => {
    const [filter, setFilter] = useState("All");
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setProjects(projectsData);
    }, []);

    const filteredProjects = filter === "All"
        ? projects
        : projects.filter(p => p.category === filter);

    return (
        <div className="portfolio-container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem' }}>Portfolio Gallery</h1>
                <p style={{ fontSize: '1.1rem' }}>Data solutions categorized by business impact.</p>
            </div>

            <div className="filter-bar" style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '3rem',
                flexWrap: 'wrap'
            }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        style={{
                            padding: '0.5rem 1.5rem',
                            borderRadius: '2rem',
                            border: '1px solid var(--accent-primary)',
                            background: filter === cat ? 'var(--accent-primary)' : 'transparent',
                            color: filter === cat ? 'var(--bg-primary)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid">
                {filteredProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>No projects found in this category.</p>
            )}
        </div>
    );
};

export default Portfolio;
