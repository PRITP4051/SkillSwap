import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRightLeft, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const location = useLocation();
  const { currentUser, login, logout, isAuthenticated } = useAuth();
  const { users, getUserById } = useData();

  const loggedInUser = isAuthenticated ? getUserById(currentUser) : null;

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="navbar-wrapper">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            <ArrowRightLeft className="navbar-logo" size={28} />
            <span>SkillSwap</span>
          </Link>

          {/* Desktop Links */}
          <ul className="navbar-links">
            <li><Link to="/discover" className={`navbar-link ${isActive('/discover')}`}>Explore Skills</Link></li>
            <li><Link to="/requests" className={`navbar-link ${isActive('/requests')}`}>Swap Requests</Link></li>
            <li><Link to="/community" className={`navbar-link ${isActive('/community')}`}>Community</Link></li>
          </ul>

          {/* Desktop Actions */}
          <div className="navbar-actions">
            {!isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => setShowLoginMenu(!showLoginMenu)}>
                  Log in
                </button>
                {showLoginMenu && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.5rem', width: 'max-content', zIndex: 50, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Select demo user:</div>
                    {users.slice(0, 3).map(u => (
                      <button key={u.id} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', marginBottom: '0.5rem', justifyContent: 'flex-start', background: 'transparent', color: 'var(--text-primary)' }} onClick={() => { login(u.id); setShowLoginMenu(false); }}>
                        <img src={u.avatar} alt={u.name} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                        {u.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
                  <img src={loggedInUser?.avatar} alt={loggedInUser?.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                  <span style={{ fontWeight: '600' }}>{loggedInUser?.name.split(' ')[0]}</span>
                </Link>
                <button onClick={logout} title="Logout" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  <LogOut size={20} />
                </button>
              </div>
            )}
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Dashboard</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Basic Dropdown for Mobile (Inline for simplicity) */}
      {isMenuOpen && (
        <div style={{ padding: '1rem', background: 'white', borderBottom: '1px solid var(--border-color)', position: 'absolute', width: '100%' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><Link onClick={() => setIsMenuOpen(false)} to="/discover" style={{ display: 'block' }}>Explore Skills</Link></li>
            <li><Link onClick={() => setIsMenuOpen(false)} to="/requests" style={{ display: 'block' }}>Swap Requests</Link></li>
            <li><Link onClick={() => setIsMenuOpen(false)} to="/dashboard" style={{ display: 'block', color: 'var(--primary-color)', fontWeight: 'bold' }}>Dashboard</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
