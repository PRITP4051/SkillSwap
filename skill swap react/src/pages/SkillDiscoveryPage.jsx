import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import SkillCard from '../components/SkillCard';
import { skills, categories } from '../data/mockData';
import './SkillDiscoveryPage.css';

const SkillDiscoveryPage = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Parse query parameters on load
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');
        const cat = params.get('category');

        if (q) setSearchQuery(q);
        if (cat) setSelectedCategory(cat);
    }, [location]);

    // Filter skills based on state
    const filteredSkills = skills.filter(skill => {
        const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill.wantsInReturn.some(w => w.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
        const matchesLevel = selectedLevel === 'all' || skill.level === selectedLevel;

        return matchesSearch && matchesCategory && matchesLevel;
    });

    return (
        <div className="container">
            <div className="discovery-layout">

                {/* Mobile Filter Toggle */}
                <button
                    className="btn btn-outline"
                    style={{ display: 'none' /* Will show on mobile via CSS later if needed, keeping simple for prototype */, marginBottom: '1rem' }}
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                >
                    <Filter size={18} /> Filters
                </button>

                {/* Sidebar Filters */}
                <aside className="discovery-sidebar">
                    <div className="card filter-card">
                        <div className="filter-group">
                            <h3 className="filter-title">Categories</h3>
                            <div className="filter-options">
                                <label className="filter-option">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === 'all'}
                                        onChange={() => setSelectedCategory('all')}
                                    />
                                    All Categories
                                </label>
                                {categories.map(cat => (
                                    <label key={cat.id} className="filter-option">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === cat.id}
                                            onChange={() => setSelectedCategory(cat.id)}
                                        />
                                        {cat.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <h3 className="filter-title">Skill Level</h3>
                            <div className="filter-options">
                                {['all', 'Beginner', 'Intermediate', 'Advanced', 'Native'].map(level => (
                                    <label key={level} className="filter-option">
                                        <input
                                            type="radio"
                                            name="level"
                                            checked={selectedLevel === level}
                                            onChange={() => setSelectedLevel(level)}
                                        />
                                        {level === 'all' ? 'All Levels' : level}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            className="btn btn-secondary"
                            style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}
                            onClick={() => { setSelectedCategory('all'); setSelectedLevel('all'); setSearchQuery(''); }}
                        >
                            Clear Filters
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="discovery-content">
                    <div className="discovery-header">
                        <div>
                            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Explore Skills</h1>
                            <p>Find the perfect partner to exchange knowledge with.</p>
                        </div>

                        <div className="search-bar">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search skills, users, or topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <X size={16} style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
                            )}
                        </div>
                    </div>

                    {/* Results Grid */}
                    {filteredSkills.length > 0 ? (
                        <div className="skills-grid">
                            {filteredSkills.map(skill => (
                                <SkillCard key={skill.id} skill={skill} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <h3 style={{ marginBottom: '0.5rem' }}>No skills found</h3>
                            <p>Try adjusting your search or filters to find what you're looking for.</p>
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: '1rem' }}
                                onClick={() => { setSelectedCategory('all'); setSelectedLevel('all'); setSearchQuery(''); }}
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SkillDiscoveryPage;
