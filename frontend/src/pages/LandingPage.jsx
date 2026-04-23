import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import TeacherCard from '../components/TeacherCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, ArrowRight, Star, Users, BookOpen, Zap, ChevronRight } from 'lucide-react';

const HOW_IT_WORKS = [
  { icon: '🔍', title: 'Discover Skills', desc: 'Search thousands of skills and find expert teachers in any domain.' },
  { icon: '📅', title: 'Book a Session', desc: 'Pick a date, time slot and confirm your session instantly.' },
  { icon: '💬', title: 'Learn & Teach', desc: 'Chat in real time, share knowledge and grow together.' },
  { icon: '⭐', title: 'Review & Repeat', desc: 'Rate your sessions and build a trusted community.' },
];

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery]       = useState('');
  const [teachers, setTeachers] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [searching, setSearching] = useState(false);
  const [results, setResults]   = useState(null);

  useEffect(() => {
    api.get('/users/teachers')
      .then(({ data }) => {
        if (data.success) {
          setTeachers(data.data);
          setFeatured(data.data.slice(0, 6));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const { data } = await api.get(`/skills/search?q=${encodeURIComponent(query)}`);
      if (data.success) setResults(data.data);
    } catch {
      setResults({ teachers: [], skills: [] });
    } finally {
      setSearching(false);
    }
  };

  const displayTeachers = results ? results.teachers : featured;

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="mesh-bg" style={{ padding:'6rem 1.5rem 5rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
        {/* Decorative blobs */}
        <div style={{ position:'absolute', top:-100, left:-100, width:400, height:400,
          background:'radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-100, right:-100, width:400, height:400,
          background:'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

        <div style={{ position:'relative', maxWidth:800, margin:'0 auto' }} className="fade-up">
          <div style={{
            display:'inline-flex', alignItems:'center', gap:6,
            background:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.25)',
            borderRadius:20, padding:'4px 14px', fontSize:'0.8rem', color:'#06b6d4',
            marginBottom:'1.5rem', fontWeight:600,
          }}>
            <Zap size={13} fill="#06b6d4" /> Peer-to-peer skill exchange platform
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight:800, color:'#f1f5f9', lineHeight:1.1, margin:'0 0 1.5rem',
          }}>
            Trade Knowledge.<br />
            <span className="gradient-text">Grow Together.</span>
          </h1>

          <p style={{ fontSize:'1.1rem', color:'#94a3b8', maxWidth:560, margin:'0 auto 2.5rem', lineHeight:1.7 }}>
            Learn any skill from real people. Teach what you know. Build meaningful connections through knowledge exchange.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ display:'flex', gap:10, maxWidth:560, margin:'0 auto 2rem', position:'relative' }}>
            <div style={{ position:'relative', flex:1 }}>
              <Search size={18} color="#64748b" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }} />
              <input
                className="input"
                style={{ paddingLeft:'2.75rem', fontSize:'1rem', height:52 }}
                placeholder="Search skills — Python, Guitar, Spanish…"
                value={query}
                onChange={(e) => { setQuery(e.target.value); if (!e.target.value) setResults(null); }}
              />
            </div>
            <button className="btn-primary" type="submit" disabled={searching}
              style={{ padding:'0 1.5rem', height:52, flexShrink:0, fontSize:'0.95rem' }}>
              {searching ? '…' : <><Search size={16} /> Search</>}
            </button>
          </form>

          {/* CTA buttons */}
          {!user && (
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ padding:'0.75rem 2rem', fontSize:'1rem' }}>
                Get Started Free <ArrowRight size={16} />
              </Link>
              <Link to="/explore" className="btn-secondary" style={{ padding:'0.75rem 2rem', fontSize:'1rem' }}>
                Browse Teachers
              </Link>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display:'flex', justifyContent:'center', gap:'3rem', marginTop:'4rem', flexWrap:'wrap' }}>
          {[
            { value: `${teachers.length}+`, label:'Expert Teachers', icon: <Users size={18} color="#06b6d4" /> },
            { value: '50+', label:'Skills Available', icon: <BookOpen size={18} color="#7c3aed" /> },
            { value: '4.9', label:'Avg Rating', icon: <Star size={18} color="#fbbf24" fill="#fbbf24" /> },
          ].map((s) => (
            <div key={s.label} style={{ textAlign:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'center' }}>
                {s.icon}
                <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:'1.75rem', fontWeight:800, color:'#f1f5f9' }}>{s.value}</span>
              </div>
              <p style={{ margin:'4px 0 0', fontSize:'0.8rem', color:'#64748b' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Teachers ────────────────────────────────────────────── */}
      <section style={{ padding:'4rem 1.5rem', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h2 style={{ margin:0, fontSize:'1.5rem', fontWeight:700, color:'#f1f5f9' }}>
              {results ? `Results for "${query}"` : 'Featured Teachers'}
            </h2>
            <p style={{ margin:'0.25rem 0 0', color:'#64748b', fontSize:'0.875rem' }}>
              {results ? `${results.teachers.length} teacher${results.teachers.length !== 1 ? 's' : ''} found` : 'Top-rated teachers ready to share their knowledge'}
            </p>
          </div>
          {!results && (
            <Link to="/explore" className="btn-ghost" style={{ display:'flex', alignItems:'center', gap:6 }}>
              View All <ChevronRight size={15} />
            </Link>
          )}
        </div>

        {loading ? <LoadingSpinner /> : (
          displayTeachers.length > 0 ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1.25rem' }}>
              {displayTeachers.map((t) => (
                <TeacherCard key={t._id} teacher={t} onBook={() => navigate(`/book/${t._id}`)} />
              ))}
            </div>
          ) : (
            <div className="glass" style={{ padding:'3rem', textAlign:'center' }}>
              <p style={{ color:'#64748b', fontSize:'1rem' }}>No teachers found for "{query}"</p>
              <button className="btn-ghost" style={{ marginTop:'1rem' }} onClick={() => { setQuery(''); setResults(null); }}>
                Clear Search
              </button>
            </div>
          )
        )}
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section style={{ padding:'4rem 1.5rem', background:'rgba(30,41,59,0.3)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <h2 style={{ textAlign:'center', margin:'0 0 0.5rem', fontSize:'1.5rem', fontWeight:700, color:'#f1f5f9' }}>How it works</h2>
          <p style={{ textAlign:'center', color:'#64748b', marginBottom:'2.5rem' }}>Four simple steps to start learning or teaching</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'1.25rem' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="glass card-hover" style={{ padding:'1.5rem', textAlign:'center' }}>
                <div style={{ fontSize:'2.25rem', marginBottom:'0.875rem' }}>{step.icon}</div>
                <h3 style={{ margin:'0 0 0.5rem', fontSize:'1rem', fontWeight:700, color:'#f1f5f9' }}>{step.title}</h3>
                <p style={{ margin:0, fontSize:'0.85rem', color:'#94a3b8', lineHeight:1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────── */}
      {!user && (
        <section style={{ padding:'4rem 1.5rem', textAlign:'center' }}>
          <div style={{ maxWidth:560, margin:'0 auto' }}>
            <h2 style={{ margin:'0 0 1rem', fontSize:'2rem', fontWeight:800, color:'#f1f5f9' }}>
              Ready to start your journey?
            </h2>
            <p style={{ color:'#94a3b8', marginBottom:'1.75rem' }}>
              Join thousands of learners and teachers already on SkillSwap.
            </p>
            <Link to="/register" className="btn-primary" style={{ padding:'0.875rem 2.5rem', fontSize:'1.05rem' }}>
              Join for Free <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
