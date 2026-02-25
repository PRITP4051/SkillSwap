import React from 'react';
import { Check, X, Clock, MessageSquare } from 'lucide-react';
import './RequestCard.css';

const RequestCard = ({ request, onAccept, onReject }) => {
    const isIncoming = request.type === 'incoming';

    return (
        <div className="card request-card">
            <div className="request-info">
                <img src={request.user.avatar} alt={request.user.name} className="request-avatar" />

                <div className="request-details">
                    <div className="request-header">
                        <span className="request-user">
                            {isIncoming ? `${request.user.name} wants to swap` : `You asked to swap with ${request.user.name}`}
                        </span>
                        <span className="request-time"><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} /> {request.date}</span>
                    </div>

                    <div className="request-swap-details">
                        <div className="request-swap-row">
                            <span className="request-swap-label">Offering:</span>
                            <span className="request-swap-value">{request.offering}</span>
                        </div>
                        <div className="request-swap-row">
                            <span className="request-swap-label">Wanting:</span>
                            <span className="request-swap-value">{request.requesting}</span>
                        </div>
                    </div>

                    {request.message && (
                        <div className="request-message">
                            "{request.message}"
                        </div>
                    )}
                </div>
            </div>

            <div className="request-actions">
                {request.status === 'pending' && isIncoming ? (
                    <>
                        <button className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444', padding: '0.5rem 1rem' }} onClick={() => onReject(request.id)}>
                            <X size={16} /> Reject
                        </button>
                        <button className="btn btn-primary" style={{ backgroundColor: '#10b981', padding: '0.5rem 1rem' }} onClick={() => onAccept(request.id)}>
                            <Check size={16} /> Accept
                        </button>
                    </>
                ) : (
                    <div className={`request-status status-${request.status}`}>
                        {request.status === 'pending' && <Clock size={16} />}
                        {request.status === 'accepted' && <Check size={16} />}
                        {request.status === 'rejected' && <X size={16} />}
                        <span style={{ textTransform: 'capitalize' }}>{request.status}</span>
                    </div>
                )}

                {request.status === 'accepted' && (
                    <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                        <MessageSquare size={16} /> Chat
                    </button>
                )}
            </div>
        </div>
    );
};

export default RequestCard;
