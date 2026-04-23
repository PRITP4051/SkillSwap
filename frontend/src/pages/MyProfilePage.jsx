import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import SkillTag from '../components/SkillTag';
import AvatarImage from '../components/AvatarImage';
import { Camera, Plus, IndianRupee, Clock, GraduationCap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TagInput = ({ tags, setTags, placeholder, variant }) => {
  const [input, setInput] = useState('');
  const add = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) { setTags([...tags, val]); setInput(''); }
  };
  return (
    <div>
      <div style={{ display:'flex', gap:6, marginBottom:8 }}>
        <input className="input" style={{ flex:1 }} value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key==='Enter'||e.key===','){e.preventDefault();add();} }}
          placeholder={placeholder} />
        <button type="button" className="btn-ghost" onClick={add}><Plus size={15}/></button>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {tags.map((t) => <SkillTag key={t} skill={t} onRemove={(s) => setTags(tags.filter(x=>x!==s))} variant={variant} />)}
      </div>
    </div>
  );
};

const MyProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    hourlyRate: user?.hourlyRate || 500,
    availability: user?.availability || '',
  });
  const [skillsTeach, setSkillsTeach] = useState(user?.skillsTeach || []);
  const [skillsLearn, setSkillsLearn] = useState(user?.skillsLearn || []);
  const [avatarFile, setAvatarFile]   = useState(null);
  const [preview, setPreview]         = useState(null);
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name || '',
      bio: user?.bio || '',
      hourlyRate: user?.hourlyRate || 500,
      availability: user?.availability || '',
    });
    setSkillsTeach(user?.skillsTeach || []);
    setSkillsLearn(user?.skillsLearn || []);
  }, [user]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('bio', form.bio);
      fd.append('hourlyRate', form.hourlyRate);
      fd.append('availability', form.availability);
      skillsTeach.forEach((s) => fd.append('skillsTeach', s));
      skillsLearn.forEach((s) => fd.append('skillsLearn', s));
      if (avatarFile) fd.append('avatar', avatarFile);

      const { data } = await api.put('/users/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        await refreshUser();
        toast.success('Profile updated!');
        setAvatarFile(null);
        setPreview(null);
        setEditing(false);
      } else toast.error(data.message || 'Update failed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const avatar = preview || user?.avatar;

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'2rem 1.5rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <h1 style={{ margin:0, fontSize:'1.5rem', fontWeight:800, color:'#f1f5f9' }}>My Profile</h1>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn-ghost" onClick={() => navigate(`/profile/${user?._id}`)}>View Public</button>
          {!editing && <button className="btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>}
        </div>
      </div>

      {/* Stats bar */}
      <div className="glass" style={{ padding:'1rem 1.5rem', marginBottom:'1.25rem', display:'flex', gap:'2rem', flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Star size={16} color="#fbbf24" fill="#fbbf24" />
          <span style={{ fontWeight:700, color:'#f1f5f9' }}>{user?.rating?.toFixed(1) || '0.0'}</span>
          <span style={{ color:'#64748b', fontSize:'0.8rem' }}>rating</span>
        </div>
        <div style={{ color:'#64748b', fontSize:'0.875rem' }}>
          <strong style={{ color:'#f1f5f9' }}>{user?.totalReviews || 0}</strong> reviews
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4, color:'#94a3b8', fontSize:'0.875rem' }}>
          <IndianRupee size={13} color="#06b6d4" />
          <strong style={{ color:'#f1f5f9' }}>{user?.hourlyRate?.toLocaleString('en-IN')}</strong>/hr
        </div>
      </div>

      {editing ? (
        <form className="glass" style={{ padding:'1.75rem' }} onSubmit={handleSave}>
          {/* Avatar */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:'1.5rem' }}>
            <div style={{ position:'relative', cursor:'pointer' }} onClick={() => fileRef.current.click()}>
              <div style={{ width:80, height:80, borderRadius:20, overflow:'hidden',
                background:'linear-gradient(135deg,#06b6d4,#7c3aed)',
                display:'flex', alignItems:'center', justifyContent:'center',
                border:'3px solid rgba(6,182,212,0.4)' }}>
                {preview ? (
                  <img src={preview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  <AvatarImage src={user?.avatar} alt={user?.name || 'User'} size={80} iconSize={32} borderRadius={20} />
                )}
              </div>
              <div style={{ position:'absolute', bottom:-3, right:-3, background:'#06b6d4', borderRadius:'50%', padding:5, border:'2px solid #0f172a' }}>
                <Camera size={12} color="white" />
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFileChange} />
            </div>
          </div>

          <div style={{ marginBottom:'1rem' }}>
            <label className="label">Name</label>
            <input
              className="input"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your display name"
            />
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label className="label">Bio</label>
            <textarea className="input" rows={3} value={form.bio}
              onChange={(e) => setForm({...form, bio:e.target.value})} placeholder="About you…" style={{ resize:'vertical' }} />
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label className="label">Skills I teach</label>
            <TagInput tags={skillsTeach} setTags={setSkillsTeach} placeholder="Add skill…" variant="teal" />
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label className="label">Skills I want to learn</label>
            <TagInput tags={skillsLearn} setTags={setSkillsLearn} placeholder="Add skill…" variant="violet" />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.25rem' }}>
            <div>
              <label className="label">Hourly Rate (₹)</label>
              <input className="input" type="number" min={100} value={form.hourlyRate}
                onChange={(e) => setForm({...form, hourlyRate:Number(e.target.value)})} />
            </div>
            <div>
              <label className="label">Availability</label>
              <input className="input" type="text" value={form.availability}
                onChange={(e) => setForm({...form, availability:e.target.value})}
                placeholder="Weekends 10am–6pm" />
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn-primary" type="submit" disabled={loading} style={{ flex:1, justifyContent:'center' }}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
            <button type="button" className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="glass" style={{ padding:'1.75rem' }}>
          {/* Avatar + Name */}
          <div style={{ display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1.25rem' }}>
            <div style={{ width:72, height:72, borderRadius:18, overflow:'hidden',
              background:'linear-gradient(135deg,#06b6d4,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center',
              border:'3px solid rgba(6,182,212,0.3)', flexShrink:0 }}>
              <AvatarImage src={user?.avatar} alt={user?.name || 'User'} size={72} iconSize={30} borderRadius={18} />
            </div>
            <div>
              <h2 style={{ margin:0, fontWeight:800, fontSize:'1.2rem', color:'#f1f5f9' }}>{user?.name}</h2>
              <p style={{ margin:'2px 0 0', fontSize:'0.85rem', color:'#64748b' }}>{user?.email}</p>
              <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:4 }}>
                <Clock size={13} color="#7c3aed" />
                <span style={{ fontSize:'0.8rem', color:'#94a3b8' }}>{user?.availability || 'No availability set'}</span>
              </div>
            </div>
          </div>

          <div className="divider" />

          {user?.bio && <p style={{ color:'#94a3b8', lineHeight:1.6, marginBottom:'1.25rem' }}>{user.bio}</p>}

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
            <div>
              <p style={{ margin:'0 0 0.5rem', fontSize:'0.8rem', fontWeight:600, color:'#06b6d4' }}>TEACHING</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {user?.skillsTeach?.length ? user.skillsTeach.map((s) => <SkillTag key={s} skill={s} />)
                  : <span style={{ color:'#475569', fontSize:'0.85rem' }}>None</span>}
              </div>
            </div>
            <div>
              <p style={{ margin:'0 0 0.5rem', fontSize:'0.8rem', fontWeight:600, color:'#8b5cf6' }}>LEARNING</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {user?.skillsLearn?.length ? user.skillsLearn.map((s) => <SkillTag key={s} skill={s} variant="violet" />)
                  : <span style={{ color:'#475569', fontSize:'0.85rem' }}>None</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfilePage;
