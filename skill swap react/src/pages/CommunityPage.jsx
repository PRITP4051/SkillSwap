import React from 'react';

const CommunityPage = () => {
    return (
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Community Hub</h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                See what the SkillSwap community is talking about. Join discussions, share achievements, and find new exchange partners.
            </p>
            <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
                <div className="card" style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Sarah Lee</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>2 hours ago</div>
                        </div>
                    </div>
                    <p>Just completed an amazing React swap. The knowledge exchange was super smooth!</p>
                </div>
                <div className="card" style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <img src="https://i.pravatar.cc/150?u=a04258114e29026702d" alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Carlos Ruiz</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>1 day ago</div>
                        </div>
                    </div>
                    <p>Anyone looking to learn Spanish? I'm free this weekend for some intensive sessions!</p>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
