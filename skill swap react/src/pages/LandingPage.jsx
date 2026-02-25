import React from 'react';
import HeroSection from '../components/HeroSection';
import CategoryGrid from '../components/CategoryGrid';
import { ShieldCheck, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <HeroSection />

            {/* How it Works Section */}
            <section className="section bg-white">
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '3rem' }}>How SkillSwap Works</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        <div className="card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
                            <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary-color)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>1</div>
                            <h3 style={{ marginBottom: '1rem' }}>List Your Skills</h3>
                            <p>Create a profile highlighting the skills you can teach and what you want to learn.</p>
                        </div>

                        <div className="card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
                            <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary-color)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>2</div>
                            <h3 style={{ marginBottom: '1rem' }}>Find a Match</h3>
                            <p>Browse our community or let our algorithm suggest perfect skill-swap partners.</p>
                        </div>

                        <div className="card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
                            <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary-color)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>3</div>
                            <h3 style={{ marginBottom: '1rem' }}>Connect & Learn</h3>
                            <p>Send a request, connect via chat, and start your mutual learning journey.</p>
                        </div>
                    </div>
                </div>
            </section>

            <CategoryGrid />

            {/* Trust & Safety Section */}
            <section className="section" style={{ background: 'var(--primary-color)', color: 'white' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>A community built on trust</h2>
                            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', fontSize: '1.125rem' }}>
                                We believe in the power of peer-to-peer education. That's why we've built tools to keep our community safe, respectful, and focused on growth.
                            </p>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><ShieldCheck fill="var(--secondary-color)" color="white" /> Verified profiles and secure messaging</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Users fill="var(--secondary-color)" color="white" /> Community-driven rating system</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Zap fill="var(--secondary-color)" color="white" /> Instant matching algorithms</li>
                            </ul>
                            <Link to="/profile" className="btn" style={{ background: 'white', color: 'var(--primary-color)' }}>Join Now</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Students learning together" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-float)', width: '100%', objectFit: 'cover' }} />
                            <div className="card" style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--secondary-light)', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Star fill="currentColor" /></div>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>4.9/5</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Average Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

// Need to import Star for that bottom image float card
import { Star } from 'lucide-react';
