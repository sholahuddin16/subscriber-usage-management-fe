import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = CheckCircle;
        let className = 'toast toast-success';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          className = 'toast toast-error';
        } else if (toast.type === 'info') {
          Icon = Info;
          className = 'toast toast-info';
        }

        return (
          <div key={toast.id} className={className}>
            <Icon size={18} />
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'currentColor',
                cursor: 'pointer',
                padding: '2px',
                opacity: 0.8,
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
