import React from 'react';
import { MapPin, Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import './SkillCard.css';

const SkillCard = ({ skill }) => {
    return (
        <div className="card skill-card">
            <div className="skill-card-header">
                <div className="skill-card-user">
                    <img src={skill.avatar} alt={skill.user} className="skill-card-avatar" />
                    <div className="skill-card-user-info">
                        <span className="skill-card-username">{skill.user}</span>
                        <div className="skill-card-rating">
                            <Star size={12} fill="currentColor" />
                            <span>{skill.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                <div className="skill-card-category-icon">
                    {skill.category === 'tech' && '💻'}
                    {skill.category === 'design' && '🎨'}
                    {skill.category === 'languages' && '🌍'}
                    {skill.category === 'business' && '📈'}
                    {skill.category === 'music' && '🎵'}
                    {skill.category === 'fitness' && '🏃‍♂️'}
                </div>
            </div>

            <div className="skill-card-body">
                <div className="skill-card-meta">
                    <span className={`badge badge-${skill.level === 'Beginner' ? 'blue' :
                        skill.level === 'Intermediate' ? 'green' :
                            skill.level === 'Advanced' ? 'purple' : 'orange'
                        }`}>{skill.level}</span>
                </div>

                <h3 className="skill-card-title">{skill.title}</h3>

                <div className="skill-card-meta-item">
                    <MapPin size={14} />
                    <span>{skill.location}</span>
                </div>
            </div>

            <div className="skill-card-exchange">
                <div className="skill-card-exchange-title">Wants in return</div>
                <div className="skill-card-tags">
                    {skill.wantsInReturn.map((wanted, index) => (
                        <span key={index} className="skill-tag">{wanted}</span>
                    ))}
                </div>
                <Link to={`/profile/${skill.userId || 'u2'}`} className="btn btn-outline skill-card-action">View Profile</Link>
            </div>
        </div>
    );
};

export default SkillCard;
