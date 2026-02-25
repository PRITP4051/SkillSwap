import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Star, MessageSquare, Plus, BookOpen, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import './UserProfilePage.css';

const UserProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, isAuthenticated } = useAuth();
    const { getUserById, updateUser, addSwapRequest, addBooking } = useData();

    const targetId = id || currentUser;
    const user = targetId ? getUserById(targetId) : null;
    const isOwnProfile = isAuthenticated && currentUser === targetId;

    const [isAddingOffered, setIsAddingOffered] = useState(false);
    const [isAddingWanted, setIsAddingWanted] = useState(false);
    const [newSkillTitle, setNewSkillTitle] = useState('');
    const [newSkillLevel, setNewSkillLevel] = useState('Beginner');

    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingDate, setBookingDate] = useState('');

    if (!user) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>User not found</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Return Home</button>
            </div>
        );
    }

    const handleAddSkill = (type) => {
        if (!newSkillTitle.trim()) return;
        const newSkill = { id: Date.now(), title: newSkillTitle, level: newSkillLevel };
        const updatedUser = { ...user };

        if (type === 'offered') {
            updatedUser.skillsOffered = [...updatedUser.skillsOffered, newSkill];
            setIsAddingOffered(false);
        } else {
            updatedUser.skillsWanted = [...updatedUser.skillsWanted, newSkill];
            setIsAddingWanted(false);
        }

        updateUser(updatedUser);
        setNewSkillTitle('');
        setNewSkillLevel('Beginner');
    };

    const handleRemoveSkill = (skillId, type) => {
        const updatedUser = { ...user };
        if (type === 'offered') {
            updatedUser.skillsOffered = updatedUser.skillsOffered.filter(s => s.id !== skillId);
        } else {
            updatedUser.skillsWanted = updatedUser.skillsWanted.filter(s => s.id !== skillId);
        }
        updateUser(updatedUser);
    };

    const handleRequestSwap = () => {
        if (!isAuthenticated) return alert('Please log in first');
        addSwapRequest({
            id: `req_${Date.now()}`,
            type: 'sent',
            user: { name: user.name, avatar: user.avatar },
            offering: 'Various Skills',
            requesting: 'Skill Exchange',
            status: 'pending',
            date: 'Just now',
            message: 'I would like to swap skills!'
        });
        alert(`Swap request sent to ${user.name}!`);
    };

    const submitBooking = () => {
        if (!bookingDate) return alert('Select a date');
        addBooking({
            id: `book_${Date.now()}`,
            withUser: { name: user.name, avatar: user.avatar, id: user.id },
            date: bookingDate,
            status: 'upcoming'
        });
        setShowBookingModal(false);
        setBookingDate('');
        alert('Session Booked successfully!');
    };

    return (
        <div className="container">
            <div className="profile-layout">

                {/* Sidebar Info */}
                <aside className="profile-sidebar">
                    <div className="card profile-header-card">
                        <div className="profile-cover"></div>

                        <div className="profile-avatar-container">
                            <img src={user.avatar} alt={user.name} className="profile-avatar" />
                        </div>

                        <h1 className="profile-name">{user.name}</h1>
                        <p className="profile-handle">{user.handle}</p>

                        <div className="profile-stats">
                            <div className="profile-stat">
                                <div className="profile-stat-value">{user.stats.swapsCompleted}</div>
                                <div className="profile-stat-label">Swaps</div>
                            </div>
                            <div className="profile-stat">
                                <div className="profile-stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    {user.stats.rating} <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                </div>
                                <div className="profile-stat-label">Rating</div>
                            </div>
                            <div className="profile-stat">
                                <div className="profile-stat-value">{user.stats.reviews}</div>
                                <div className="profile-stat-label">Reviews</div>
                            </div>
                        </div>

                        <p className="profile-bio">{user.bio}</p>

                        <div className="profile-meta">
                            <div className="profile-meta-item">
                                <MapPin size={16} />
                                <span>{user.location}</span>
                            </div>
                            <div className="profile-meta-item">
                                <Calendar size={16} />
                                <span>Joined {user.joinedDate}</span>
                            </div>
                        </div>

                        {!isOwnProfile && isAuthenticated && (
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleRequestSwap}>
                                    <MessageSquare size={18} /> Request Swap
                                </button>
                                <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setShowBookingModal(true)}>
                                    <Calendar size={18} style={{ display: 'inline', verticalAlign: 'middle' }} /> Book Session
                                </button>
                                <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => navigate(`/chat/${user.id}`)}>
                                    Message
                                </button>
                            </div>
                        )}
                        {!isOwnProfile && !isAuthenticated && (
                            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => alert('Please log in to request a swap.')}>
                                Log in to Interact
                            </button>
                        )}
                    </div>
                </aside>

                {/* Main Content (Skills) */}
                <div className="profile-content">

                    <div className="card profile-section-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="profile-section-title" style={{ marginBottom: 0 }}>
                                <BookOpen size={24} color="var(--primary-color)" /> Skills Offered
                            </h2>
                            {isOwnProfile && (
                                <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => setIsAddingOffered(!isAddingOffered)}>
                                    {isAddingOffered ? 'Cancel' : 'Add Skill'}
                                </button>
                            )}
                        </div>

                        {isAddingOffered && (
                            <div style={{ background: 'var(--background-color)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Skill Name</label>
                                    <input type="text" value={newSkillTitle} onChange={e => setNewSkillTitle(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Level</label>
                                    <select value={newSkillLevel} onChange={e => setNewSkillLevel(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                        <option>Native</option>
                                    </select>
                                </div>
                                <button className="btn btn-primary" onClick={() => handleAddSkill('offered')}>Add</button>
                            </div>
                        )}

                        <div className="skill-list">
                            {user.skillsOffered.map(skill => (
                                <div key={skill.id} className="skill-list-item">
                                    <div className="skill-list-info">
                                        <span className="skill-list-title">{skill.title}</span>
                                        <span className="badge badge-purple" style={{ alignSelf: 'flex-start' }}>{skill.level}</span>
                                    </div>
                                    {isOwnProfile ? (
                                        <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)' }} onClick={() => handleRemoveSkill(skill.id, 'offered')}>
                                            <Trash2 size={16} />
                                        </button>
                                    ) : (
                                        <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={() => alert('Swap requested!')}>
                                            <Plus size={16} /> Select
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card profile-section-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="profile-section-title" style={{ marginBottom: 0 }}>
                                <Star size={24} color="var(--secondary-color)" /> Skills Wanted
                            </h2>
                            {isOwnProfile && (
                                <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => setIsAddingWanted(!isAddingWanted)}>
                                    {isAddingWanted ? 'Cancel' : 'Add Skill'}
                                </button>
                            )}
                        </div>

                        {isAddingWanted && (
                            <div style={{ background: 'var(--background-color)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Skill Name</label>
                                    <input type="text" value={newSkillTitle} onChange={e => setNewSkillTitle(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Desired Level</label>
                                    <select value={newSkillLevel} onChange={e => setNewSkillLevel(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                        <option>Native</option>
                                    </select>
                                </div>
                                <button className="btn btn-primary" onClick={() => handleAddSkill('wanted')}>Add</button>
                            </div>
                        )}

                        <div className="skill-list">
                            {user.skillsWanted.map(skill => (
                                <div key={skill.id} className="skill-list-item" style={{ background: 'var(--background-color)' }}>
                                    <div className="skill-list-info">
                                        <span className="skill-list-title">{skill.title}</span>
                                        <span className="badge badge-blue" style={{ alignSelf: 'flex-start' }}>Wants to reach: {skill.level}</span>
                                    </div>
                                    {isOwnProfile && (
                                        <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)' }} onClick={() => handleRemoveSkill(skill.id, 'wanted')}>
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px', background: 'var(--surface-color)', padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Book Session with {user.name}</h3>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Date & Time</label>
                            <input type="datetime-local" value={bookingDate} onChange={e => setBookingDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn-outline" onClick={() => setShowBookingModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={submitBooking}>Confirm Booking</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;
