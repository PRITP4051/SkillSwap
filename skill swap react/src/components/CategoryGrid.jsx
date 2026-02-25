import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';
import { categories } from '../data/mockData';

const CategoryGrid = () => {
    return (
        <section className="section bg-gray-50">
            <div className="container" style={{ textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1rem' }}>Explore Popular Categories</h2>
                <p style={{ marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                    Find mentors and learners across a wide range of fields. From coding to cooking, there's always something new to learn.
                </p>

                <div className="category-grid">
                    {categories.map((cat) => (
                        <Link to={`/discover?category=${cat.id}`} key={cat.id} className="category-card">
                            <div className="category-icon">{cat.icon}</div>
                            <h3 className="category-name">{cat.name}</h3>
                            <span className="category-count">{cat.count} skills</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
