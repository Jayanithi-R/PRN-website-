import React from 'react';

export default function Header() {
  return (
    <div
      className="header"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div
        className="title"
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: 8,
        }}
      >
        Billing Dashboard
      </div>

      <div
        className="header-actions"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <span
          style={{
            color: 'var(--muted)',
            minWidth: 50,
          }}
        >
          Hi, Admin
        </span>
        <button
          className="btn secondary"
          style={{
            flexShrink: 0,
            padding: '6px 12px',
          }}
        >
          Settings
        </button>
      </div>
    </div>
  );
}
