import React from 'react';
import { Github, ExternalLink, Activity, Wrench, Lightbulb } from 'lucide-react';

const ProjectCard = ({ project }) => {
    return (
        <div className="card project-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{project.title}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" title="View Code" style={{ color: 'var(--text-secondary)' }}>
                        <Github size={20} />
                    </a>
                    {project.demoUrl !== '#' && (
                        <a href={project.demoUrl} target="_blank" rel="noreferrer" title="Live Demo" style={{ color: 'var(--text-secondary)' }}>
                            <ExternalLink size={20} />
                        </a>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: '1rem', flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <Activity size={16} color="var(--accent-secondary)" />
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>The Challenge:</strong>
                </div>
                <p style={{ fontSize: '0.9rem' }}>{project.challenge}</p>
            </div>

            <div style={{ marginBottom: '1rem', flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <Lightbulb size={16} color="var(--highlight)" />
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Key Insight:</strong>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{project.insight}</p>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Wrench size={14} color="var(--text-secondary)" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Stack</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {project.toolstack.map((tool, index) => (
                        <span key={index} style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.75rem',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '1rem',
                            color: 'var(--accent-primary)'
                        }}>
                            {tool}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
