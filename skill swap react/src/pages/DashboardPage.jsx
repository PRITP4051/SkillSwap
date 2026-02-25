import React, { useState } from 'react';
import { Book, Heart, Clock, Settings, Plus, MessageSquare, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const { currentUser, isAuthenticated } = useAuth();
    const { getUserById, swapRequests, bookings, chats } = useData();
    const [activeTab, setActiveTab] = useState('skills');
    const navigate = useNavigate();

    if (!isAuthenticated) return (
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Please log in to view your dashboard</h2>
            <Link to="/discover" className="btn btn-primary">Back to Explore</Link>
        </div>
    );

    const user = getUserById(currentUser);
    if (!user) return null;

    const userSkills = user.skillsOffered || [];
    const completedSwaps = user.stats?.swapsCompleted || 0;

    // For demo simplicity, pretend all mock requests are relevant to logged in user if not sent by them
    const pendingRequests = swapRequests.filter(req => req.status === 'pending');

    // User's chats length
    const chatCount = chats.filter(c => c.id.includes(currentUser)).length;

    // User's bookings
    const myBookings = bookings;

    return (
        <div className="container" style={{ padding: '3rem 0' }}>

            {/* Dashboard Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem' }}>Welcome back, {user.name.split(' ')[0]}!</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your skill swaps today.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/profile')}>
                    <Plus size={18} /> Manage Skills in Profile
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Quick Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Book size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{userSkills.length}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Listings</div>
                        </div>
                    </div>

                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Heart size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{completedSwaps}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Completed Swaps</div>
                        </div>
                    </div>

                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pendingRequests.length}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Pending Requests</div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    {/* Tabs Nav */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--surface-color)', overflowX: 'auto' }}>
                        <button
                            onClick={() => setActiveTab('skills')}
                            style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: activeTab === 'skills' ? 'var(--primary-color)' : 'var(--text-muted)', borderBottom: activeTab === 'skills' ? '2px solid var(--primary-color)' : '2px solid transparent', marginBottom: '-1px', whiteSpace: 'nowrap' }}
                        >
                            My Skills
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: activeTab === 'requests' ? 'var(--primary-color)' : 'var(--text-muted)', borderBottom: activeTab === 'requests' ? '2px solid var(--primary-color)' : '2px solid transparent', marginBottom: '-1px', whiteSpace: 'nowrap' }}
                        >
                            Swap Requests
                        </button>
                        <button
                            onClick={() => setActiveTab('bookings')}
                            style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: activeTab === 'bookings' ? 'var(--primary-color)' : 'var(--text-muted)', borderBottom: activeTab === 'bookings' ? '2px solid var(--primary-color)' : '2px solid transparent', marginBottom: '-1px', whiteSpace: 'nowrap' }}
                        >
                            Bookings
                        </button>
                        <button
                            onClick={() => setActiveTab('messages')}
                            style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: activeTab === 'messages' ? 'var(--primary-color)' : 'var(--text-muted)', borderBottom: activeTab === 'messages' ? '2px solid var(--primary-color)' : '2px solid transparent', marginBottom: '-1px', whiteSpace: 'nowrap' }}
                        >
                            Messages {chatCount > 0 && <span style={{ background: 'var(--accent-color)', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.75rem', marginLeft: '0.5rem' }}>{chatCount}</span>}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div style={{ padding: '2rem' }}>

                        {activeTab === 'skills' && (
                            <div>
                                <h3 style={{ marginBottom: '1.5rem' }}>Manage Your Listings</h3>
                                {userSkills.length > 0 ? (
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        {userSkills.map(skill => (
                                            <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{skill.title}</div>
                                                    <div style={{ color: 'var(--primary-color)', fontSize: '0.875rem' }}>Level: {skill.level}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                                        <Book size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                        <p>You haven't listed any skills yet.</p>
                                        <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => navigate('/profile')}>Create First Listing</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'requests' && (
                            <div>
                                <h3 style={{ marginBottom: '1.5rem' }}>Incoming & Pending Requests</h3>
                                {swapRequests.length > 0 ? (
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        {swapRequests.map(req => (
                                            <div key={req.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', alignItems: 'center' }}>
                                                <img src={req.user?.avatar || 'https://i.pravatar.cc/150'} alt="User" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold' }}>Swap with {req.user?.name || 'Someone'}</div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>They want: <b>{req.offering}</b></div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>They offer: <b>{req.requesting}</b></div>
                                                </div>
                                                <div>
                                                    <span className={`badge badge-${req.status === 'pending' ? 'orange' : 'green'}`}>{req.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                                        <Heart size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                        <p>No active swap requests found.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'bookings' && (
                            <div>
                                <h3 style={{ marginBottom: '1.5rem' }}>Upcoming Sessions</h3>
                                {myBookings.length > 0 ? (
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        {myBookings.map(b => (
                                            <div key={b.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', alignItems: 'center' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Calendar size={24} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold' }}>Session with {b.withUser?.name}</div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{new Date(b.date).toLocaleString()}</div>
                                                </div>
                                                <div>
                                                    <button className="btn btn-outline" onClick={() => navigate(`/chat/${b.withUser?.id}`)}>Chat</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                                        <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                        <p>You have no upcoming sessions scheduled.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'messages' && (
                            <div>
                                <h3 style={{ marginBottom: '1.5rem' }}>Recent Conversations</h3>
                                {chatCount > 0 ? (
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        {chats.filter(c => c.id.includes(currentUser)).map(chat => {
                                            const otherUserId = chat.id.split('_').find(id => id !== currentUser);
                                            const otherUser = getUserById(otherUserId) || { name: 'User' };
                                            return (
                                                <div key={chat.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate(`/chat/${otherUserId}`)}>
                                                    <img src={otherUser.avatar || 'https://i.pravatar.cc/150'} alt="User" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 'bold' }}>{otherUser.name}</div>
                                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                                                            {chat.messages[chat.messages.length - 1]?.text}
                                                        </div>
                                                    </div>
                                                    <div style={{ color: 'var(--primary-color)' }}>
                                                        <MessageSquare size={20} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                                        <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                        <p>No messages yet. Start exploring skills to chat with users!</p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;
