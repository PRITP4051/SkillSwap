import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import RequestCard from '../components/RequestCard';
import { swapRequests } from '../data/mockData';

const SwapRequestsPage = () => {
    const [requests, setRequests] = useState(swapRequests);
    const [activeTab, setActiveTab] = useState('incoming');

    const incomingRequests = requests.filter(req => req.type === 'incoming');
    const sentRequests = requests.filter(req => req.type === 'sent');

    const handleAccept = (id) => {
        setRequests(requests.map(req =>
            req.id === id ? { ...req, status: 'accepted' } : req
        ));
    };

    const handleReject = (id) => {
        setRequests(requests.map(req =>
            req.id === id ? { ...req, status: 'rejected' } : req
        ));
    };

    const displayRequests = activeTab === 'incoming' ? incomingRequests : sentRequests;

    return (
        <div className="container" style={{ padding: '3rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RefreshCw size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Swap Requests</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your learning and teaching invitations.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                <button
                    onClick={() => setActiveTab('incoming')}
                    style={{
                        padding: '1rem',
                        fontWeight: '600',
                        color: activeTab === 'incoming' ? 'var(--primary-color)' : 'var(--text-muted)',
                        borderBottom: activeTab === 'incoming' ? '2px solid var(--primary-color)' : '2px solid transparent',
                        marginBottom: '-1px'
                    }}
                >
                    Incoming Requests ({incomingRequests.length})
                </button>
                <button
                    onClick={() => setActiveTab('sent')}
                    style={{
                        padding: '1rem',
                        fontWeight: '600',
                        color: activeTab === 'sent' ? 'var(--primary-color)' : 'var(--text-muted)',
                        borderBottom: activeTab === 'sent' ? '2px solid var(--primary-color)' : '2px solid transparent',
                        marginBottom: '-1px'
                    }}
                >
                    Sent Requests ({sentRequests.length})
                </button>
            </div>

            <div>
                {displayRequests.length > 0 ? (
                    displayRequests.map(request => (
                        <RequestCard
                            key={request.id}
                            request={request}
                            onAccept={handleAccept}
                            onReject={handleReject}
                        />
                    ))
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>No {activeTab} requests</h3>
                        <p style={{ color: 'var(--text-muted)' }}>When you receive or send a swap request, it will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SwapRequestsPage;
