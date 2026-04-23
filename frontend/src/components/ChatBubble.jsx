import React from 'react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';
import AvatarImage from './AvatarImage';

const ChatBubble = ({ message }) => {
  const { user } = useAuth();
  const isSelf = message.sender?._id === user?._id ||
                 message.sender?._id?.toString() === user?._id ||
                 message.sender === user?._id;

  const time = message.timestamp
    ? format(new Date(message.timestamp), 'HH:mm')
    : '';

  if (isSelf) {
    return (
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'0.625rem' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3 }}>
          <div className="bubble-self">
            <p style={{ margin:0, fontSize:'0.875rem', color:'#f1f5f9', lineHeight:1.5 }}>{message.content}</p>
          </div>
          <span style={{ fontSize:'0.7rem', color:'#475569' }}>{time}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.625rem', alignItems:'flex-end' }}>
      <div style={{
        width:30, height:30, borderRadius:8, overflow:'hidden', flexShrink:0,
        background:'linear-gradient(135deg,#06b6d4,#7c3aed)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <AvatarImage src={message.sender?.avatar} alt={message.sender?.name || 'User'} size={30} iconSize={14} borderRadius={8} />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
        <span style={{ fontSize:'0.72rem', color:'#64748b', marginLeft:2 }}>{message.sender?.name || 'User'}</span>
        <div className="bubble-other">
          <p style={{ margin:0, fontSize:'0.875rem', color:'#e2e8f0', lineHeight:1.5 }}>{message.content}</p>
        </div>
        <span style={{ fontSize:'0.7rem', color:'#475569', marginLeft:2 }}>{time}</span>
      </div>
    </div>
  );
};

export default ChatBubble;
