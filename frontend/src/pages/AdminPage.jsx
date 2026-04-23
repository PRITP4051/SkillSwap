import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Users, BookOpen, IndianRupee, Trash2, ShieldOff, Shield, TrendingUp } from 'lucide-react';

const StatCard = ({ icon, label, value, color }) => (
  <div className="glass" style={{ padding:'1.5rem', display:'flex', alignItems:'center', gap:'1rem' }}>
    <div style={{
      width:52, height:52, borderRadius:14, flexShrink:0,
      background:`rgba(${color},0.12)`, display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      {icon}
    </div>
    <div>
      <p style={{ margin:0, fontSize:'0.8rem', color:'#64748b', fontWeight:500 }}>{label}</p>
      <p style={{ margin:'4px 0 0', fontSize:'1.6rem', fontWeight:800, color:'#f1f5f9', fontFamily:'Plus Jakarta Sans,sans-serif' }}>{value}</p>
    </div>
  </div>
);

const AdminPage = () => {
  const [stats, setStats]   = useState(null);
  const [users, setUsers]   = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [tab, setTab]       = useState('users');
  const [page, setPage]     = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, uRes, sessRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/users?page=${page}&limit=20`),
        api.get('/admin/sessions?page=1&limit=20'),
      ]);
      if (sRes.data.success)    setStats(sRes.data.data);
      if (uRes.data.success)    { setUsers(uRes.data.data.users); setTotalPages(uRes.data.data.pagination?.pages || 1); }
      if (sessRes.data.success) setSessions(sessRes.data.data.sessions);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [page]);

  const handleSuspend = async (userId, isActive) => {
    setActionLoading(`suspend-${userId}`);
    try {
      const { data } = await api.put(`/admin/users/${userId}/suspend`);
      if (data.success) {
        toast.success(isActive ? 'User suspended' : 'User reactivated');
        loadData();
      }
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Permanently delete this user?')) return;
    setActionLoading(`delete-${userId}`);
    try {
      const { data } = await api.delete(`/admin/users/${userId}`);
      if (data.success) { toast.success('User deleted'); loadData(); }
    } catch {
      toast.error('Delete failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSpinner fullscreen />;

  return (
    <div style={{ maxWidth:1280, margin:'0 auto', padding:'2rem 1.5rem' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1.75rem' }}>
        <Shield size={22} color="#7c3aed" />
        <h1 style={{ margin:0, fontSize:'1.5rem', fontWeight:800, color:'#f1f5f9' }}>Admin Dashboard</h1>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
          <StatCard icon={<Users size={24} color="#06b6d4" />} label="Total Users" value={stats.totalUsers} color="6,182,212" />
          <StatCard icon={<BookOpen size={24} color="#7c3aed" />} label="Total Sessions" value={stats.totalSessions} color="124,58,237" />
          <StatCard icon={<IndianRupee size={24} color="#22c55e" />} label="Total Revenue"
            value={`₹${(stats.totalRevenue||0).toLocaleString('en-IN')}`} color="34,197,94" />
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:'1.25rem', background:'rgba(30,41,59,0.5)', borderRadius:12, padding:4, width:'fit-content' }}>
        {['users','sessions'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding:'0.5rem 1.25rem', border:'none', borderRadius:9, cursor:'pointer',
              fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:'0.875rem',
              background: tab===t ? 'rgba(6,182,212,0.15)' : 'transparent',
              color: tab===t ? '#06b6d4' : '#64748b',
            }}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {/* Users table */}
      {tab === 'users' && (
        <div className="glass" style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                {['Name','Email','Role','Status','Skills','Rate','Actions'].map((h) => (
                  <th key={h} style={{ padding:'0.875rem 1rem', textAlign:'left', color:'#64748b', fontWeight:600, fontSize:'0.78rem', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', transition:'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
                  {(() => {
                    const suspending = actionLoading === `suspend-${u._id}`;
                    const deleting = actionLoading === `delete-${u._id}`;
                    return (
                      <>
                  <td style={{ padding:'0.75rem 1rem', color:'#e2e8f0', fontWeight:600 }}>{u.name}</td>
                  <td style={{ padding:'0.75rem 1rem', color:'#94a3b8' }}>{u.email}</td>
                  <td style={{ padding:'0.75rem 1rem' }}>
                    <span className={u.role==='admin'?'badge-admin':'badge-confirmed'} style={{ fontSize:'0.7rem' }}>{u.role}</span>
                  </td>
                  <td style={{ padding:'0.75rem 1rem' }}>
                    <span className={u.isActive?'badge-completed':'badge-cancelled'}>{u.isActive?'Active':'Suspended'}</span>
                  </td>
                  <td style={{ padding:'0.75rem 1rem', color:'#94a3b8' }}>{u.skillsTeach?.length || 0} skills</td>
                  <td style={{ padding:'0.75rem 1rem', color:'#94a3b8' }}>₹{u.hourlyRate?.toLocaleString('en-IN')}</td>
                  <td style={{ padding:'0.75rem 1rem' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button
                        disabled={suspending || deleting}
                        onClick={() => handleSuspend(u._id, u.isActive)}
                        title={u.isActive?'Suspend':'Activate'}
                        style={{ background:'none', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, padding:'4px 8px', cursor:suspending || deleting ? 'not-allowed' : 'pointer', color: u.isActive?'#fbbf24':'#4ade80', opacity:suspending || deleting ? 0.65 : 1, minWidth:38, minHeight:30, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {suspending ? <LoadingSpinner size={14} /> : (u.isActive ? <ShieldOff size={14} /> : <Shield size={14} />)}
                      </button>
                      <button
                        disabled={suspending || deleting}
                        onClick={() => handleDelete(u._id)}
                        title="Delete user"
                        style={{ background:'none', border:'1px solid rgba(239,68,68,0.2)', borderRadius:6, padding:'4px 8px', cursor:suspending || deleting ? 'not-allowed' : 'pointer', color:'#f87171', opacity:suspending || deleting ? 0.65 : 1, minWidth:38, minHeight:30, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {deleting ? <LoadingSpinner size={14} /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </td>
                      </>
                    );
                  })()}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', padding:'1rem' }}>
              <button className="btn-ghost" disabled={page===1} onClick={() => setPage(p=>p-1)}>Prev</button>
              <span style={{ padding:'0.5rem', color:'#94a3b8', fontSize:'0.875rem' }}>{page} / {totalPages}</span>
              <button className="btn-ghost" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>Next</button>
            </div>
          )}
        </div>
      )}

      {/* Sessions table */}
      {tab === 'sessions' && (
        <div className="glass" style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                {['Skill','Teacher','Learner','Date','Price','Status'].map((h) => (
                  <th key={h} style={{ padding:'0.875rem 1rem', textAlign:'left', color:'#64748b', fontWeight:600, fontSize:'0.78rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding:'0.75rem 1rem' }}><span className="skill-tag">{s.skill}</span></td>
                  <td style={{ padding:'0.75rem 1rem', color:'#e2e8f0' }}>{s.teacher?.name}</td>
                  <td style={{ padding:'0.75rem 1rem', color:'#94a3b8' }}>{s.learner?.name}</td>
                  <td style={{ padding:'0.75rem 1rem', color:'#94a3b8' }}>{s.date ? new Date(s.date).toLocaleDateString('en-IN') : '—'}</td>
                  <td style={{ padding:'0.75rem 1rem', color:'#06b6d4' }}>₹{s.price?.toLocaleString('en-IN')}</td>
                  <td style={{ padding:'0.75rem 1rem' }}>
                    <span className={`badge-${s.status}`}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
