import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SkillTag from '../components/SkillTag';
import AvatarImage from '../components/AvatarImage';
import toast from 'react-hot-toast';
import { Star, IndianRupee, Clock, GraduationCap, MessageSquare, BookOpen, Calendar } from 'lucide-react';

const StarRow = ({ rating }) => (
  <div style={{ display:'flex', gap:2 }}>
    {[1,2,3,4,5].map((s) => (
      <Star key={s} size={14} fill={s<=Math.round(rating)?'#fbbf24':'none'}
        color={s<=Math.round(rating)?'#fbbf24':'#334155'} />
    ))}
    <span style={{ marginLeft:4, fontSize:'0.85rem', color:'#94a3b8' }}>{rating?.toFixed(1)}</span>
  </div>
);

const ProfilePage = () => {
  const { userId } = useParams();
  const { user: me } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/users/${userId}`),
      api.get(`/reviews/user/${userId}`),
    ]).then(([pRes, rRes]) => {
      if (pRes.data.success)  setProfile(pRes.data.data);
      if (rRes.data.success)  setReviews(rRes.data.data);
    }).catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <LoadingSpinner fullscreen />;
  if (!profile) return (
    <div style={{ textAlign:'center', padding:'5rem', color:'#64748b' }}>User not found.</div>
  );

  const isMe = me?._id === userId;

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'2rem 1.5rem' }}>
      {/* Profile Header */}
      <div className="glass" style={{ padding:'2rem', marginBottom:'1.5rem', display:'flex', gap:'1.5rem', flexWrap:'wrap', alignItems:'flex-start' }}>
        <div style={{
          width:96, height:96, borderRadius:24, overflow:'hidden', flexShrink:0,
          background:'linear-gradient(135deg,#06b6d4,#7c3aed)',
          display:'flex', alignItems:'center', justifyContent:'center',
          border:'3px solid rgba(6,182,212,0.35)',
        }}>
          <AvatarImage src={profile.avatar} alt={profile.name} size={96} iconSize={40} borderRadius={24} />
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:4 }}>
            <h1 style={{ margin:0, fontSize:'1.5rem', fontWeight:800, color:'#f1f5f9' }}>{profile.name}</h1>
            {profile.role === 'admin' && <span className="badge-admin">Admin</span>}
          </div>
          <StarRow rating={profile.rating} />
          <p style={{ margin:'0.25rem 0 0', fontSize:'0.8rem', color:'#64748b' }}>{profile.totalReviews || 0} reviews</p>

          {profile.bio && (
            <p style={{ margin:'0.875rem 0 0', color:'#94a3b8', fontSize:'0.9rem', lineHeight:1.6 }}>{profile.bio}</p>
          )}

          <div style={{ display:'flex', flexWrap:'wrap', gap:'1.25rem', marginTop:'1rem', fontSize:'0.85rem', color:'#94a3b8' }}>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <IndianRupee size={14} color="#06b6d4" />
              <strong style={{ color:'#f1f5f9' }}>{profile.hourlyRate?.toLocaleString('en-IN')}</strong>/hr
            </div>
            {profile.availability && (
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <Clock size={14} color="#7c3aed" /> {profile.availability}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {!isMe && me && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button className="btn-primary" onClick={() => navigate(`/book/${profile._id}`)}>
              <BookOpen size={15} /> Book Session
            </button>
            <button className="btn-secondary" onClick={() => navigate('/chat')}>
              <MessageSquare size={15} /> Message
            </button>
          </div>
        )}
        {isMe && (
          <button className="btn-ghost" onClick={() => navigate('/my-profile')}>Edit Profile</button>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', marginBottom:'1.5rem' }}>
        {/* Skills Teaching */}
        <div className="glass" style={{ padding:'1.25rem' }}>
          <h3 style={{ margin:'0 0 0.875rem', fontSize:'0.95rem', fontWeight:700, color:'#06b6d4', display:'flex', alignItems:'center', gap:6 }}>
            <GraduationCap size={15} /> Teaching
          </h3>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {profile.skillsTeach?.length
              ? profile.skillsTeach.map((s) => <SkillTag key={s} skill={s} />)
              : <span style={{ color:'#475569', fontSize:'0.85rem' }}>None listed</span>}
          </div>
        </div>

        {/* Skills Learning */}
        <div className="glass" style={{ padding:'1.25rem' }}>
          <h3 style={{ margin:'0 0 0.875rem', fontSize:'0.95rem', fontWeight:700, color:'#8b5cf6', display:'flex', alignItems:'center', gap:6 }}>
            <BookOpen size={15} /> Learning
          </h3>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {profile.skillsLearn?.length
              ? profile.skillsLearn.map((s) => <SkillTag key={s} skill={s} variant="violet" />)
              : <span style={{ color:'#475569', fontSize:'0.85rem' }}>None listed</span>}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="glass" style={{ padding:'1.5rem' }}>
        <h2 style={{ margin:'0 0 1.25rem', fontSize:'1.1rem', fontWeight:700, color:'#f1f5f9', display:'flex', alignItems:'center', gap:6 }}>
          <Star size={16} color="#fbbf24" fill="#fbbf24" /> Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <p style={{ color:'#475569', textAlign:'center', padding:'1.5rem 0' }}>No reviews yet</p>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
            {reviews.map((r) => (
              <div key={r._id} className="glass-light" style={{ padding:'1rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#06b6d4,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <AvatarImage src={r.reviewer?.avatar} alt={r.reviewer?.name || 'Reviewer'} size={32} iconSize={14} borderRadius={8} />
                    </div>
                    <span style={{ fontWeight:600, fontSize:'0.875rem', color:'#e2e8f0' }}>{r.reviewer?.name}</span>
                  </div>
                  <div style={{ display:'flex', gap:2 }}>
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={12} fill={s<=r.rating?'#fbbf24':'none'} color={s<=r.rating?'#fbbf24':'#334155'} />
                    ))}
                  </div>
                </div>
                {r.comment && <p style={{ margin:0, fontSize:'0.85rem', color:'#94a3b8', lineHeight:1.6 }}>{r.comment}</p>}
                {r.session?.skill && <span className="skill-tag" style={{ marginTop:8, display:'inline-block' }}>{r.session.skill}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
