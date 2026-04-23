import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => (
  <div className="mesh-bg" style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', textAlign:'center', padding:'2rem' }}>
    <div style={{ fontSize:'5rem', marginBottom:'1rem' }}>🔍</div>
    <h1 style={{ margin:'0 0 0.5rem', fontSize:'2rem', fontWeight:800, color:'#f1f5f9' }}>404 — Page not found</h1>
    <p style={{ color:'#64748b', marginBottom:'1.5rem' }}>The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn-primary">
      <Home size={16} /> Go Home
    </Link>
  </div>
);

export default NotFoundPage;
