import { useState, useEffect } from 'react';

let showToastFunction = null;

export function useToast() {
  return {
    showToast: (message, type = 'success') => {
      if (showToastFunction) {
        showToastFunction(message, type);
      }
    }
  };
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    showToastFunction = (message, type) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            background: toast.type === 'success' ? '#4CAF50' : toast.type === 'error' ? '#f44336' : '#2196F3',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            minWidth: '300px',
            animation: 'slideIn 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '500'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          {toast.message}
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
