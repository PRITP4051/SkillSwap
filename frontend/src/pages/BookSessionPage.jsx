import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AvatarImage from '../components/AvatarImage';
import toast from 'react-hot-toast';
import { Calendar, Clock, IndianRupee, GraduationCap, ArrowLeft, CheckCircle } from 'lucide-react';

const TIME_SLOTS = [
  '9:00 AM – 10:00 AM', '10:00 AM – 11:00 AM', '11:00 AM – 12:00 PM',
  '12:00 PM – 1:00 PM',  '2:00 PM – 3:00 PM',   '3:00 PM – 4:00 PM',
  '4:00 PM – 5:00 PM',   '5:00 PM – 6:00 PM',   '7:00 PM – 8:00 PM',
  '8:00 PM – 9:00 PM',
];

const BookSessionPage = () => {
  const { teacherId } = useParams();
  const { user }      = useAuth();
  const navigate      = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked]   = useState(false);

  const [form, setForm] = useState({
    skill: '',
    date: '',
    timeSlot: '',
    duration: 60,
    notes: '',
  });

  useEffect(() => {
    api.get(`/users/${teacherId}`)
      .then(({ data }) => {
        if (data.success) {
          setTeacher(data.data);
          if (data.data.skillsTeach?.length) setForm((f) => ({ ...f, skill: data.data.skillsTeach[0] }));
        }
      })
      .catch(() => toast.error('Teacher not found'))
      .finally(() => setLoading(false));
  }, [teacherId]);

  const price = teacher ? Math.round((teacher.hourlyRate * form.duration) / 60) : 0;
  const isSelfBooking = teacherId === user?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.skill || !form.date || !form.timeSlot) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/sessions/book', {
        teacherId,
        skill: form.skill,
        date: form.date,
        timeSlot: form.timeSlot,
        duration: form.duration,
        price,
        notes: form.notes,
      });
      if (data.success) {
        setBooked(true);
        toast.success('Session booked successfully!');
      } else {
        toast.error(data.message || 'Booking failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullscreen />;
  if (!teacher) return <div style={{ textAlign:'center', padding:'4rem', color:'#64748b' }}>Teacher not found.</div>;
  if (isSelfBooking) {
    return (
      <div style={{ maxWidth:480, margin:'5rem auto', padding:'0 1.5rem', textAlign:'center' }}>
        <div className="glass" style={{ padding:'3rem' }}>
          <h2 style={{ fontWeight:800, color:'#f1f5f9' }}>You cannot book yourself</h2>
          <p style={{ color:'#94a3b8', marginBottom:'1.5rem' }}>
            Choose another teacher from the explore page to create a session.
          </p>
          <button className="btn-primary" onClick={() => navigate('/explore')}>Find a Teacher</button>
        </div>
      </div>
    );
  }

  if (booked) {
    return (
      <div style={{ maxWidth:480, margin:'5rem auto', padding:'0 1.5rem', textAlign:'center' }}>
        <div className="glass" style={{ padding:'3rem' }}>
          <CheckCircle size={56} color="#06b6d4" style={{ marginBottom:'1rem' }} />
          <h2 style={{ fontWeight:800, color:'#f1f5f9' }}>Session Booked!</h2>
          <p style={{ color:'#94a3b8', marginBottom:'1.5rem' }}>Your session with {teacher.name} has been requested. You'll be notified when they confirm.</p>
          <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
            <button className="btn-primary" onClick={() => navigate('/sessions')}>View Sessions</button>
            <button className="btn-ghost"  onClick={() => navigate('/')}>Go Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'2rem 1.5rem' }}>
      <button className="btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom:'1.5rem' }}>
        <ArrowLeft size={15} /> Back
      </button>

      <h1 style={{ margin:'0 0 1.5rem', fontSize:'1.5rem', fontWeight:800, color:'#f1f5f9' }}>Book a Session</h1>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'1.25rem', alignItems:'start' }}>
        {/* Form */}
        <form className="glass" style={{ padding:'1.75rem' }} onSubmit={handleSubmit}>
          {/* Teacher info */}
          <div style={{ display:'flex', gap:'0.875rem', alignItems:'center', marginBottom:'1.5rem' }}>
            <div style={{ width:52, height:52, borderRadius:12, overflow:'hidden',
              background:'linear-gradient(135deg,#06b6d4,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <AvatarImage src={teacher.avatar} alt={teacher.name} size={52} iconSize={24} borderRadius={12} />
            </div>
            <div>
              <p style={{ margin:0, fontSize:'0.75rem', color:'#64748b' }}>Teacher</p>
              <p style={{ margin:0, fontWeight:700, color:'#f1f5f9' }}>{teacher.name}</p>
            </div>
          </div>

          {/* Skill */}
          <div style={{ marginBottom:'1rem' }}>
            <label className="label">Skill to Learn <span style={{ color:'#06b6d4' }}>*</span></label>
            <select className="input" value={form.skill} onChange={(e) => setForm({...form, skill:e.target.value})} required>
              {teacher.skillsTeach?.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Date */}
          <div style={{ marginBottom:'1rem' }}>
            <label className="label">Date <span style={{ color:'#06b6d4' }}>*</span></label>
            <div style={{ position:'relative' }}>
              <Calendar size={15} color="#64748b" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
              <input className="input" style={{ paddingLeft:'2.25rem' }} type="date"
                value={form.date} onChange={(e) => setForm({...form, date:e.target.value})}
                min={new Date().toISOString().split('T')[0]} required />
            </div>
          </div>

          {/* Time slot */}
          <div style={{ marginBottom:'1rem' }}>
            <label className="label">Time Slot <span style={{ color:'#06b6d4' }}>*</span></label>
            <select className="input" value={form.timeSlot} onChange={(e) => setForm({...form, timeSlot:e.target.value})} required>
              <option value="">Select a time slot</option>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Duration */}
          <div style={{ marginBottom:'1rem' }}>
            <label className="label">Duration</label>
            <select className="input" value={form.duration} onChange={(e) => setForm({...form, duration:Number(e.target.value)})}>
              {[30,45,60,90,120].map((d) => <option key={d} value={d}>{d} minutes</option>)}
            </select>
          </div>

          {/* Notes */}
          <div style={{ marginBottom:'1.5rem' }}>
            <label className="label">Notes (optional)</label>
            <textarea className="input" rows={3} placeholder="What you'd like to focus on…"
              value={form.notes} onChange={(e) => setForm({...form, notes:e.target.value})}
              style={{ resize:'vertical' }} />
          </div>

          <button className="btn-primary" type="submit" disabled={submitting}
            style={{ width:'100%', justifyContent:'center', padding:'0.75rem', fontSize:'0.95rem' }}>
            {submitting ? 'Booking…' : 'Confirm Booking'}
          </button>
        </form>

        {/* Price Summary */}
        <div className="glass" style={{ padding:'1.5rem' }}>
          <h3 style={{ margin:'0 0 1rem', fontWeight:700, color:'#f1f5f9' }}>Price Summary</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem', marginBottom:'1rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.875rem' }}>
              <span style={{ color:'#94a3b8' }}>Hourly rate</span>
              <span style={{ color:'#f1f5f9' }}>₹{teacher.hourlyRate?.toLocaleString('en-IN')}/hr</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.875rem' }}>
              <span style={{ color:'#94a3b8' }}>Duration</span>
              <span style={{ color:'#f1f5f9' }}>{form.duration} min</span>
            </div>
          </div>
          <div className="divider" />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:700, color:'#f1f5f9' }}>Total</span>
            <div style={{ display:'flex', alignItems:'center', gap:3 }}>
              <IndianRupee size={18} color="#06b6d4" />
              <span style={{ fontSize:'1.5rem', fontWeight:800, color:'#06b6d4' }}>{price.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {teacher.availability && (
            <div className="glass-light" style={{ padding:'0.75rem', marginTop:'1rem' }}>
              <p style={{ margin:0, fontSize:'0.75rem', color:'#64748b', display:'flex', alignItems:'center', gap:5 }}>
                <Clock size={12} /> {teacher.availability}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSessionPage;
