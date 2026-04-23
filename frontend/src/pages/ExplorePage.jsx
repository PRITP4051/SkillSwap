import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import TeacherCard from '../components/TeacherCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [skillFilter, setSkillFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [allSkills, setAllSkills] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (skillFilter) params.append('skill', skillFilter);
      if (minPrice)    params.append('minPrice', minPrice);
      if (maxPrice)    params.append('maxPrice', maxPrice);

      const { data } = await api.get(`/users/teachers?${params}`);
      if (data.success) setTeachers(data.data);
    } catch {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, [skillFilter, minPrice, maxPrice]);

  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

  // Build skill list from teachers
  useEffect(() => {
    api.get('/users/teachers').then(({ data }) => {
      if (data.success) {
        const set = new Set();
        data.data.forEach((t) => t.skillsTeach?.forEach((s) => set.add(s)));
        setAllSkills(Array.from(set).sort());
      }
    });
  }, []);

  const clearFilters = () => { setSkillFilter(''); setMinPrice(''); setMaxPrice(''); };
  const hasFilters = skillFilter || minPrice || maxPrice;

  return (
    <div style={{ maxWidth:1280, margin:'0 auto', padding:'2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ margin:0, fontSize:'1.75rem', fontWeight:800, color:'#f1f5f9' }}>Explore Teachers</h1>
        <p style={{ margin:'0.4rem 0 0', color:'#94a3b8' }}>Find the perfect mentor for any skill</p>
      </div>

      {/* Filter Bar */}
      <div className="glass" style={{ padding:'1rem 1.25rem', marginBottom:'1.5rem', display:'flex', gap:'0.875rem', alignItems:'center', flexWrap:'wrap' }}>
        {/* Skill select */}
        <div style={{ flex:1, minWidth:180, position:'relative' }}>
          <Search size={15} color="#64748b" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }} />
          <select className="input" style={{ paddingLeft:'2rem', cursor:'pointer' }}
            value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
            <option value="">All Skills</option>
            {allSkills.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Price range */}
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <input className="input" style={{ width:100 }} type="number" placeholder="Min ₹"
            value={minPrice} onChange={(e) => setMinPrice(e.target.value)} min={0} />
          <span style={{ color:'#475569' }}>—</span>
          <input className="input" style={{ width:100 }} type="number" placeholder="Max ₹"
            value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} min={0} />
        </div>

        {hasFilters && (
          <button className="btn-ghost" onClick={clearFilters}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Results count */}
      {!loading && (
        <p style={{ color:'#64748b', fontSize:'0.85rem', marginBottom:'1rem' }}>
          {teachers.length} teacher{teachers.length !== 1 ? 's' : ''} found
          {hasFilters && <> · <span style={{ color:'#06b6d4' }}>Filtered</span></>}
        </p>
      )}

      {/* Teacher Grid */}
      {loading ? <LoadingSpinner /> : (
        teachers.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1.25rem' }}>
            {teachers.map((t) => (
              <TeacherCard key={t._id} teacher={t} onBook={() => navigate(`/book/${t._id}`)} />
            ))}
          </div>
        ) : (
          <div className="glass" style={{ padding:'4rem', textAlign:'center' }}>
            <p style={{ fontSize:'1.5rem', marginBottom:'0.5rem' }}>🔍</p>
            <p style={{ color:'#64748b', marginBottom:'1rem' }}>No teachers match your filters</p>
            <button className="btn-ghost" onClick={clearFilters}>Clear filters</button>
          </div>
        )
      )}
    </div>
  );
};

export default ExplorePage;
