import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { getSocket } from '../lib/socket';
import { useAuth } from '../context/AuthContext';
import ChatBubble from '../components/ChatBubble';
import LoadingSpinner from '../components/LoadingSpinner';
import AvatarImage from '../components/AvatarImage';
import toast from 'react-hot-toast';
import { Send, GraduationCap, MessageSquare, Lock, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

const ChatPage = () => {
  const { user }   = useAuth();
  const location   = useLocation();
  const navigate   = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeRoom, setActiveRoom]   = useState(location.state?.roomId || null);
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [convLoading, setConvLoading] = useState(true);
  const [msgLoading, setMsgLoading]   = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef      = useRef(null);
  const activeRoomRef  = useRef(activeRoom);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { activeRoomRef.current = activeRoom; }, [activeRoom]);

  // Load conversations
  useEffect(() => {
    api.get('/chat/conversations')
      .then(({ data }) => { if (data.success) setConversations(data.data); })
      .catch(() => toast.error('Failed to load conversations'))
      .finally(() => setConvLoading(false));
  }, []);

  // Auto-select first conversation if routed without roomId
  useEffect(() => {
    if (!activeRoom && conversations.length > 0) {
      setActiveRoom(conversations[0].roomId);
    }
  }, [conversations, activeRoom]);

  // Socket setup
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const handleReceiveMessage = (msg) => {
      if (msg.roomId !== activeRoomRef.current) {
        return;
      }

      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const handleSocketError = (err) => toast.error(err.message || 'Socket error');

    const handleConnect = () => {
      if (activeRoomRef.current) {
        socket.emit('join_room', { roomId: activeRoomRef.current });
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('error', handleSocketError);
    socket.on('connect', handleConnect);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('error', handleSocketError);
      socket.off('connect', handleConnect);
    };
  }, []);

  // Load messages and join room on activeRoom change
  useEffect(() => {
    if (!activeRoom) return;
    setMsgLoading(true);
    setMessages([]);

    // Join socket room
    socketRef.current?.emit('join_room', { roomId: activeRoom });

    api.get(`/chat/messages/${activeRoom}`)
      .then(({ data }) => { if (data.success) setMessages(data.data); })
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setMsgLoading(false));
  }, [activeRoom]);

  const sendMessage = (e) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || !activeRoom) return;

    socketRef.current?.emit('send_message', { roomId: activeRoom, content });
    setInput('');
  };

  const getOther = (conv) => {
    const isTeacher = conv.teacher?._id === user?._id || conv.teacher?._id?.toString() === user?._id;
    return isTeacher ? conv.learner : conv.teacher;
  };

  const activeConv   = conversations.find((c) => c.roomId === activeRoom);
  const otherUser    = activeConv ? getOther(activeConv) : null;
  const chatEnabled  = activeConv?.chatEnabled ?? false;

  return (
    <div style={{ height:'calc(100vh - 64px)', display:'flex', overflow:'hidden' }}>
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside style={{
        width:300, flexShrink:0, borderRight:'1px solid rgba(255,255,255,0.06)',
        background:'rgba(15,23,42,0.6)', display:'flex', flexDirection:'column', overflow:'hidden',
      }}>
        <div style={{ padding:'1rem', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'#f1f5f9' }}>Messages</h2>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'0.5rem' }}>
          {convLoading ? <LoadingSpinner size={28} /> : (
            conversations.length === 0 ? (
              <div style={{ textAlign:'center', padding:'2rem 1rem', color:'#475569', fontSize:'0.85rem' }}>
                No conversations yet. Book a session to start chatting.
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOther(conv);
                const isActive = conv.roomId === activeRoom;
                return (
                  <div key={conv.roomId}
                    onClick={() => setActiveRoom(conv.roomId)}
                    style={{
                      display:'flex', gap:'0.625rem', alignItems:'center', padding:'0.625rem 0.75rem',
                      borderRadius:10, cursor:'pointer', transition:'background 0.15s',
                      background: isActive ? 'rgba(6,182,212,0.12)' : 'transparent',
                      border: isActive ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent',
                      marginBottom:3,
                    }}>
                    <div style={{ width:36, height:36, borderRadius:9, overflow:'hidden', flexShrink:0,
                      background:'linear-gradient(135deg,#06b6d4,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <AvatarImage src={other?.avatar} alt={other?.name || 'User'} size={36} iconSize={16} borderRadius={9} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ margin:0, fontWeight:600, fontSize:'0.85rem', color:isActive?'#06b6d4':'#e2e8f0',
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {other?.name || 'Unknown'}
                      </p>
                      <p style={{ margin:0, fontSize:'0.72rem', color:'#475569',
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {conv.session?.skill} · {conv.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span style={{ background:'#06b6d4', color:'#0f172a', borderRadius:10, padding:'1px 7px',
                        fontSize:'0.7rem', fontWeight:700, flexShrink:0 }}>
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )
          )}
        </div>
      </aside>

      {/* ── Main chat area ──────────────────────────────────────────── */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {activeRoom ? (
          <>
            {/* Chat header */}
            <div style={{ padding:'0.875rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.06)',
              background:'rgba(15,23,42,0.5)', display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <div style={{ width:36, height:36, borderRadius:9, overflow:'hidden', flexShrink:0,
                background:'linear-gradient(135deg,#06b6d4,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <AvatarImage src={otherUser?.avatar} alt={otherUser?.name || 'User'} size={36} iconSize={16} borderRadius={9} />
              </div>
              <div>
                <p style={{ margin:0, fontWeight:700, fontSize:'0.95rem', color:'#f1f5f9' }}>{otherUser?.name || '—'}</p>
                <p style={{ margin:0, fontSize:'0.72rem', color:'#64748b' }}>{activeConv?.session?.skill}</p>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', padding:'1rem 1.25rem' }}>
              {msgLoading ? <LoadingSpinner /> : (
                messages.length === 0
                  ? <div style={{ textAlign:'center', padding:'3rem', color:'#475569' }}>No messages yet. Say hello! 👋</div>
                  : messages.map((msg, i) => <ChatBubble key={msg._id || i} message={msg} />)
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input — only when payment verified */}
            {chatEnabled ? (
              <form onSubmit={sendMessage} style={{
                display:'flex', gap:10, padding:'0.875rem 1.25rem',
                borderTop:'1px solid rgba(255,255,255,0.06)', background:'rgba(15,23,42,0.6)',
              }}>
                <input
                  className="input"
                  style={{ flex:1 }}
                  placeholder="Type a message…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoComplete="off"
                />
                <button className="btn-primary" type="submit" disabled={!input.trim()}
                  style={{ padding:'0.625rem 1.125rem', flexShrink:0 }}>
                  <Send size={16} />
                </button>
              </form>
            ) : (
              <div style={{
                display:'flex', alignItems:'center', justifyContent:'center', gap:'0.625rem',
                padding:'1rem 1.25rem', borderTop:'1px solid rgba(255,255,255,0.06)',
                background:'rgba(15,23,42,0.6)', color:'#64748b', fontSize:'0.85rem',
              }}>
                <Lock size={15} color="#fbbf24" />
                <span style={{ color:'#94a3b8' }}>Chat unlocks after payment is verified.</span>
                <ShieldCheck size={15} color="#fbbf24" />
              </div>
            )}
          </>
        ) : (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem', color:'#475569' }}>
            <MessageSquare size={48} />
            <p style={{ fontSize:'1rem' }}>Select a conversation to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
