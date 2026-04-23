import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AvatarImage from './AvatarImage';
import {
  Zap, Search, BookOpen, MessageSquare, User,
  LogOut, Shield, ChevronDown, Menu, X, GraduationCap,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/explore', label: 'Explore', icon: <Search size={15} /> },
    { to: '/sessions', label: 'Sessions', icon: <BookOpen size={15} /> },
    { to: '/chat', label: 'Chat', icon: <MessageSquare size={15} /> },
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(15,23,42,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display:'flex', alignItems:'center', height:64, gap:'1.5rem' }}>
        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', flexShrink:0 }}>
          <div style={{
            width:34, height:34, borderRadius:10,
            background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontFamily:'Plus Jakarta Sans, sans-serif', fontWeight:800, fontSize:'1.1rem', color:'#f1f5f9' }}>
            Skill<span style={{ color:'#06b6d4' }}>Swap</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:4, flex:1 }}>
          {user && navLinks.map((l) => (
            <Link key={l.to} to={l.to} style={{
              display:'flex', alignItems:'center', gap:5, padding:'0.4rem 0.75rem',
              borderRadius:8, textDecoration:'none', fontSize:'0.875rem', fontWeight:500,
              color: isActive(l.to) ? '#06b6d4' : '#94a3b8',
              background: isActive(l.to) ? 'rgba(6,182,212,0.1)' : 'transparent',
              transition:'all 0.15s',
            }}>
              {l.icon} {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginLeft:'auto' }}>
          {user ? (
            <div ref={dropRef} style={{ position:'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  background:'rgba(30,41,59,0.8)', border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:10, padding:'6px 12px 6px 6px', cursor:'pointer',
                  color:'#f1f5f9', transition:'border-color 0.2s',
                }}
              >
                <div style={{
                  width:30, height:30, borderRadius:8, overflow:'hidden',
                  background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  <AvatarImage src={user.avatar} alt={user.name} size={30} iconSize={16} borderRadius={8} />
                </div>
                <span style={{ fontSize:'0.85rem', fontWeight:600, maxWidth:100, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="#94a3b8" />
              </button>

              {dropdownOpen && (
                <div className="glass" style={{
                  position:'absolute', right:0, top:'calc(100% + 8px)',
                  minWidth:190, padding:'6px', zIndex:100,
                }}>
                  <Link to="/my-profile" className="sidebar-item" onClick={() => setDropdownOpen(false)}>
                    <User size={15} /> My Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="sidebar-item" onClick={() => setDropdownOpen(false)}>
                      <Shield size={15} /> Admin Panel
                    </Link>
                  )}
                  <div className="divider" style={{ margin:'4px 0' }} />
                  <button
                    onClick={handleLogout}
                    className="sidebar-item"
                    style={{ width:'100%', border:'none', background:'none', cursor:'pointer', color:'#f87171' }}
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Log In</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}

          {/* Mobile menu toggle */}
          {user && (
            <button
              className="hide-desktop"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background:'none', border:'none', color:'#94a3b8', cursor:'pointer', padding:4, display:'none' }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && user && (
        <div style={{ padding:'0.5rem 1rem 1rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="sidebar-item" style={{ display:'flex', marginBottom:2 }}
              onClick={() => setMobileOpen(false)}>
              {l.icon} {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
