import React from 'react';

const LoadingSpinner = ({ fullscreen = false, size = 40 }) => {
  const spinner = (
    <div
      style={{
        width: size, height: size,
        border: `${size / 13}px solid rgba(6,182,212,0.15)`,
        borderTopColor: '#06b6d4',
        borderRadius: '50%',
        animation: 'spin 0.75s linear infinite',
      }}
    />
  );

  if (fullscreen) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#0f172a',
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display:'flex', justifyContent:'center', padding:'3rem 0' }}>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
