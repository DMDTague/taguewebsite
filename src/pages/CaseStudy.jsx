import React from 'react';
import { ArrowDown, CheckCircle, Database, Cpu, TrendingUp } from 'lucide-react';

const CaseStudy = () => {
    return (
        <div className="case-study-container">
            {/* Header */}
            <header style={{ marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--bg-secondary)' }}>
                <p style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Featured Case Study</p>
                <h1 style={{ fontSize: '3rem', marginTop: '0.5rem' }}>Retail Churn Prediction Model</h1>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    <span><strong>Role:</strong> Lead Analyst</span>
                    <span><strong>Timeline:</strong> 4 Weeks</span>
                    <span><strong>Tools:</strong> Python, SQL, Tableau</span>
                </div>
            </header>

            {/* STAR: Situation / The Raw Data */}
            <section style={{ marginBottom: '6rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '50%' }}>
                        <Database size={24} color="var(--accent-primary)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: 0 }}>The Raw Data (Situation/Task)</h2>
                </div>
                <div className="grid">
                    <div className="card">
                        <h3>The Problem</h3>
                        <p>Customer retention rates dropped by 8% in Q3. Marketing needed to identify at-risk users but lacked predictive capabilities.</p>
                    </div>
                    <div className="card">
                        <h3>Data Cleaning</h3>
                        <ul>
                            <li>Ingested 500k+ rows from CRM & Transaction logs.</li>
                            <li>Handled 15% missing values in demographic data.</li>
                            <li>Engineered features: "Days Since Last Purchase", "Avg Basket Size".</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* STAR: Action / The Logic */}
            <section style={{ marginBottom: '6rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '50%' }}>
                        <Cpu size={24} color="var(--highlight)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: 0 }}>The Logic (Action)</h2>
                </div>
                <p style={{ maxWidth: '800px', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    Selected Random Forest Classifier for its interpretability and ability to handle non-linear relationships.
                </p>
                <div className="card" style={{ padding: '2rem', background: 'var(--bg-secondary)', borderLeft: '4px solid var(--highlight)' }}>
                    <h3>Model decision process:</h3>
                    <p>Compared Logistic Regression (72% accuracy) vs Random Forest (85% accuracy).</p>
                    <p>Prioritized Recall over Precision to catch as many at-risk customers as possible.</p>
                </div>
            </section>

            {/* STAR: Result / The Outcome */}
            <section>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '50%' }}>
                        <TrendingUp size={24} color="var(--accent-secondary)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: 0 }}>The Outcome (Result)</h2>
                </div>
                <div style={{ background: 'linear-gradient(135deg, var(--bg-secondary), rgba(56, 189, 248, 0.1))', padding: '3rem', borderRadius: '1rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>Saved $120k Monthly</h3>
                    <p style={{ fontSize: '1.25rem' }}>Marketing campaigns targeting the identified segments saw a 22% conversion uplift.</p>
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={20} color="var(--highlight)" />
                            <span>Model deployed to production</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={20} color="var(--highlight)" />
                            <span>Dashboard adoption +40%</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CaseStudy;
