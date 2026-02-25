import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Send } from 'lucide-react';

const ChatPage = () => {
    const { id } = useParams(); // Target User ID
    const { currentUser } = useAuth();
    const { chats, addMessage, getUserById } = useData();
    const [newMessage, setNewMessage] = useState('');

    const targetUser = getUserById(id) || { name: 'Unknown User' };

    // Sort logic to get unique chat ID for the pair
    const chatId = [currentUser, id].sort().join('_');
    const conversation = chats.find(c => c.id === chatId);
    const messages = conversation ? conversation.messages : [];

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now(),
            senderId: currentUser,
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        addMessage(chatId, msg);
        setNewMessage('');
    };

    return (
        <div className="container" style={{ padding: '2rem 0', height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={targetUser.avatar || 'https://i.pravatar.cc/150'} alt={targetUser.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <h3 style={{ margin: 0 }}>{targetUser.name}</h3>
                </div>

                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--background-color)' }}>
                    {messages.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
                            Start the conversation with {targetUser.name}!
                        </div>
                    )}
                    {messages.map(msg => {
                        const isMine = msg.senderId === currentUser;
                        return (
                            <div key={msg.id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                                <div style={{
                                    background: isMine ? 'var(--primary-color)' : 'var(--surface-color)',
                                    color: isMine ? 'white' : 'var(--text-primary)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '1rem',
                                    borderBottomRightRadius: isMine ? 0 : '1rem',
                                    borderBottomLeftRadius: isMine ? '1rem' : 0,
                                    border: isMine ? 'none' : '1px solid var(--border-color)'
                                }}>
                                    {msg.text}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: isMine ? 'right' : 'left' }}>
                                    {msg.timestamp}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
                    <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
