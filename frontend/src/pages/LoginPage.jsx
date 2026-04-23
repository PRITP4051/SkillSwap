import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Zap, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.success) {
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mesh-bg" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <div className="fade-up" style={{ width:'100%', maxWidth:440 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{
            width:56, height:56, borderRadius:16, margin:'0 auto 1rem',
            background:'linear-gradient(135deg, #06b6d4, #7c3aed)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Zap size={28} color="white" fill="white" />
          </div>
          <h1 style={{ margin:0, fontSize:'1.75rem', fontWeight:800, color:'#f1f5f9' }}>
            Welcome back
          </h1>
          <p style={{ margin:'0.5rem 0 0', color:'#94a3b8', fontSize:'0.9rem' }}>
            Sign in to your SkillSwap account
          </p>
        </div>

        <form className="glass" style={{ padding:'2rem' }} onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom:'1.25rem' }}>
            <label className="label">Email address</label>
            <div style={{ position:'relative' }}>
              <Mail size={16} color="#64748b" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
              <input
                className="input"
                style={{ paddingLeft:'2.25rem' }}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom:'1.5rem' }}>
            <label className="label">Password</label>
            <div style={{ position:'relative' }}>
              <Lock size={16} color="#64748b" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
              <input
                className="input"
                style={{ paddingLeft:'2.25rem', paddingRight:'2.5rem' }}
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', color:'#64748b' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading}
            style={{ width:'100%', justifyContent:'center', padding:'0.75rem', fontSize:'0.95rem' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p style={{ textAlign:'center', marginTop:'1.25rem', fontSize:'0.875rem', color:'#94a3b8' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'#06b6d4', fontWeight:600, textDecoration:'none' }}>Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
