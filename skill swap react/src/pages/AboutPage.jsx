import React from 'react';

const AboutPage = () => {
    return (
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>About SkillSwap</h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                SkillSwap is a peer-to-peer platform where professionals turn their expertise into a currency.
                Learn new skills in exchange for teaching what you already know. No money involved, just knowledge.
            </p>
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '2rem' }}>
                <h3>Our Mission</h3>
                <p>We believe education should be accessible to everyone. By connecting passionate learners and skilled mentors, we're building a community of continuous growth.</p>
            </div>
        </div>
    );
};

export default AboutPage;
