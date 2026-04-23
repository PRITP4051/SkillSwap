import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, IndianRupee, GraduationCap } from 'lucide-react';
import AvatarImage from './AvatarImage';

const StarRating = ({ rating }) => (
  <div style={{ display:'flex', alignItems:'center', gap:2 }}>
    {[1,2,3,4,5].map((s) => (
      <Star key={s} size={12} className={s <= Math.round(rating) ? 'star-filled' : 'star-empty'} fill={s <= Math.round(rating) ? '#fbbf24' : 'none'} />
    ))}
    <span style={{ fontSize:'0.75rem', color:'#94a3b8', marginLeft:4 }}>{rating?.toFixed(1) || '0.0'}</span>
  </div>
);

const TeacherCard = ({ teacher, onBook }) => {
  return (
    <div className="glass card-hover" style={{ padding:'1.25rem', display:'flex', flexDirection:'column', gap:'0.875rem' }}>
      {/* Avatar + Name */}
      <div style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
        <Link to={`/profile/${teacher._id}`} style={{ flexShrink:0 }}>
          <div style={{
            width:52, height:52, borderRadius:12, overflow:'hidden',
            background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
            display:'flex', alignItems:'center', justifyContent:'center',
            border:'2px solid rgba(6,182,212,0.3)',
          }}>
            <AvatarImage src={teacher.avatar} alt={teacher.name} size={52} iconSize={24} borderRadius={12} />
          </div>
        </Link>
        <div style={{ flex:1, minWidth:0 }}>
          <Link to={`/profile/${teacher._id}`} style={{ textDecoration:'none' }}>
            <h3 style={{ margin:0, fontSize:'0.95rem', fontWeight:700, color:'#f1f5f9', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {teacher.name}
            </h3>
          </Link>
          <StarRating rating={teacher.rating} />
          <span style={{ fontSize:'0.7rem', color:'#64748b' }}>{teacher.totalReviews || 0} reviews</span>
        </div>
      </div>

      {/* Bio */}
      {teacher.bio && (
        <p style={{ margin:0, fontSize:'0.8rem', color:'#94a3b8', lineHeight:1.5,
          display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {teacher.bio}
        </p>
      )}

      {/* Skills teaching */}
      {teacher.skillsTeach?.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
          {teacher.skillsTeach.slice(0, 4).map((s) => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
          {teacher.skillsTeach.length > 4 && (
            <span className="skill-tag" style={{ opacity:0.6 }}>+{teacher.skillsTeach.length - 4}</span>
          )}
        </div>
      )}

      <div className="divider" style={{ margin:'0.25rem 0' }} />

      {/* Rate + Book */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <IndianRupee size={14} color="#06b6d4" />
          <span style={{ fontWeight:700, fontSize:'1rem', color:'#f1f5f9' }}>{teacher.hourlyRate?.toLocaleString('en-IN') || 500}</span>
          <span style={{ fontSize:'0.75rem', color:'#64748b' }}>/hr</span>
        </div>
        <button
          className="btn-primary"
          style={{ padding:'0.4rem 1rem', fontSize:'0.8rem' }}
          onClick={() => onBook ? onBook(teacher) : null}
        >
          Book Session
        </button>
      </div>
    </div>
  );
};

export default TeacherCard;
