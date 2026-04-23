import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import SkillTag from '../components/SkillTag';
import { Camera, Plus, IndianRupee, Clock, GraduationCap } from 'lucide-react';

const TagInput = ({ tags, setTags, placeholder, variant }) => {
  const [input, setInput] = useState('');

  const add = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setInput('');
    }
  };

  const remove = (skill) => setTags(tags.filter((t) => t !== skill));

  return (
    <div>
      <div style={{ display:'flex', gap:6, marginBottom:8 }}>
        <input className="input" style={{ flex:1 }}
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          placeholder={placeholder} />
        <button type="button" className="btn-ghost" onClick={add} style={{ flexShrink:0 }}>
          <Plus size={15} />
        </button>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {tags.map((t) => <SkillTag key={t} skill={t} onRemove={remove} variant={variant} />)}
      </div>
    </div>
  );
};

const CompleteProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  const [name, setName]             = useState(user?.name || '');
  const [bio, setBio]               = useState('');
  const [skillsTeach, setSkillsTeach] = useState([]);
  const [skillsLearn, setSkillsLearn] = useState([]);
  const [hourlyRate, setHourlyRate]   = useState(500);
  const [availability, setAvailability] = useState('');
  const [avatarFile, setAvatarFile]   = useState(null);
  const [preview, setPreview]         = useState(null);
  const [loading, setLoading]         = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('bio', bio);
      fd.append('hourlyRate', hourlyRate);
      fd.append('availability', availability);
      skillsTeach.forEach((s) => fd.append('skillsTeach', s));
      skillsLearn.forEach((s) => fd.append('skillsLearn', s));
      if (avatarFile) fd.append('avatar', avatarFile);

      const { data } = await api.put('/users/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        await refreshUser();
        toast.success('Profile saved!');
        navigate('/');
      } else {
        toast.error(data.message || 'Failed to save profile');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mesh-bg" style={{ minHeight:'100vh', padding:'2rem 1.5rem' }}>
      <div style={{ maxWidth:580, margin:'0 auto' }} className="fade-up">
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <h1 style={{ margin:0, fontSize:'1.75rem', fontWeight:800, color:'#f1f5f9' }}>Complete Your Profile</h1>
          <p style={{ margin:'0.5rem 0 0', color:'#94a3b8' }}>Let others know who you are and what you can teach</p>
        </div>

        <form className="glass" style={{ padding:'2rem' }} onSubmit={handleSubmit}>
          {/* Avatar upload */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:'1.75rem' }}>
            <div style={{ position:'relative', cursor:'pointer' }} onClick={() => fileRef.current.click()}>
              <div style={{
                width:90, height:90, borderRadius:24,
                background:'linear-gradient(135deg,#06b6d4,#7c3aed)',
                display:'flex', alignItems:'center', justifyContent:'center',
                overflow:'hidden', border:'3px solid rgba(6,182,212,0.4)',
              }}>
                {preview
                  ? <img src={preview} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <GraduationCap size={36} color="white" />}
              </div>
              <div style={{
                position:'absolute', bottom:-4, right:-4,
                background:'#06b6d4', borderRadius:'50%', padding:6,
                border:'2px solid #0f172a',
              }}>
                <Camera size={14} color="white" />
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFileChange} />
            </div>
          </div>

          {/* Bio */}
          <div style={{ marginBottom:'1.25rem' }}>
            <label className="label">Name <span style={{ color:'#06b6d4' }}>*</span></label>
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
            />
          </div>

          {/* Bio */}
          <div style={{ marginBottom:'1.25rem' }}>
            <label className="label">Bio</label>
            <textarea className="input" rows={3} placeholder="Tell the community about yourself…"
              value={bio} onChange={(e) => setBio(e.target.value)}
              style={{ resize:'vertical', lineHeight:1.6 }} />
          </div>

          {/* Skills Teach */}
          <div style={{ marginBottom:'1.25rem' }}>
            <label className="label">Skills I can teach <span style={{ color:'#06b6d4' }}>*</span></label>
            <TagInput tags={skillsTeach} setTags={setSkillsTeach} placeholder="e.g. Python, Guitar…" variant="teal" />
          </div>

          {/* Skills Learn */}
          <div style={{ marginBottom:'1.25rem' }}>
            <label className="label">Skills I want to learn</label>
            <TagInput tags={skillsLearn} setTags={setSkillsLearn} placeholder="e.g. Spanish, Cooking…" variant="violet" />
          </div>

          {/* Hourly Rate */}
          <div style={{ marginBottom:'1.25rem' }}>
            <label className="label">Hourly Rate (INR)</label>
            <div style={{ position:'relative' }}>
              <IndianRupee size={15} color="#64748b" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
              <input className="input" style={{ paddingLeft:'2.25rem' }} type="number" min={100} max={10000}
                value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} />
            </div>
          </div>

          {/* Availability */}
          <div style={{ marginBottom:'1.75rem' }}>
            <label className="label">Availability</label>
            <div style={{ position:'relative' }}>
              <Clock size={15} color="#64748b" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
              <input className="input" style={{ paddingLeft:'2.25rem' }} type="text"
                placeholder="e.g. Weekends 10am–6pm IST"
                value={availability} onChange={(e) => setAvailability(e.target.value)} />
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading}
            style={{ width:'100%', justifyContent:'center', padding:'0.75rem', fontSize:'0.95rem' }}>
            {loading ? 'Saving…' : 'Save Profile & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
