import React from 'react';

export default function CommonModal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: 16,
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target.className === 'modal-backdrop') onClose();
      }}
    >
      <div
        className="modal"
        style={{
          background: '#fff',
          borderRadius: 8,
          padding: 16,
          width: '100%',
          maxWidth: 500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
            gap: 8,
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.25rem', flex: 1 }}>{title}</h3>
          <button
            className="btn secondary"
            onClick={onClose}
            style={{ flexShrink: 0, padding: '6px 12px' }}
          >
            Close
          </button>
        </div>
        <div style={{ overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}
