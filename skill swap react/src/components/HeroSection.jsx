import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/discover?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <section className="hero-wrapper">
            <div className="hero-bg-shape hero-shape-1"></div>
            <div className="hero-bg-shape hero-shape-2"></div>

            <div className="container">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={16} />
                        <span>Join 10,000+ happy learners</span>
                    </div>

                    <h1 className="hero-title">
                        Exchange Skills. <br />
                        <span className="text-gradient">Grow Together.</span>
                    </h1>

                    <p className="hero-subtitle">
                        A peer-to-peer learning platform where money isn't required. Trade your expertise for the skills you've always wanted to learn.
                    </p>

                    <div className="hero-actions">
                        <Link to="/discover" className="btn btn-primary">Explore Skills</Link>
                        <Link to="/profile" className="btn btn-outline">Join SkillSwap</Link>
                    </div>

                    <form className="hero-search" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="What do you want to learn today?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button type="submit" className="hero-search-btn" aria-label="Search">
                            <Search size={20} />
                        </button>
                    </form>

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-value">5k+</span>
                            <span className="hero-stat-label">Active Users</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-value">12k+</span>
                            <span className="hero-stat-label">Skills Listed</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-value">8k+</span>
                            <span className="hero-stat-label">Successful Swaps</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
