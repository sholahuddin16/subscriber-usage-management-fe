import React from 'react';
import { Radio, Database, RefreshCw } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendStatus, onRefresh, isRefreshing }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      marginBottom: '28px',
      background: 'rgba(16, 21, 36, 0.7)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      flexWrap: 'wrap',
      gap: '16px',
    }}>
      {/* Brand & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #ef4444, #991b1b)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
        }}>
          <Radio size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              HUAWEI
            </h1>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}>
              TELCO API v1.0
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Subscriber Management & Premium Usage Analytics
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(10, 13, 20, 0.7)',
        padding: '5px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
      }}>
        <button
          onClick={() => setActiveTab('subscribers')}
          style={{
            padding: '8px 16px',
            fontSize: '0.85rem',
            fontWeight: '600',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeTab === 'subscribers' ? 'var(--bg-card-hover)' : 'transparent',
            color: activeTab === 'subscribers' ? 'var(--text-main)' : 'var(--text-muted)',
            boxShadow: activeTab === 'subscribers' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
          }}
        >
          Subscribers (CRUD)
        </button>
        <button
          onClick={() => setActiveTab('usage')}
          style={{
            padding: '8px 16px',
            fontSize: '0.85rem',
            fontWeight: '600',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeTab === 'usage' ? 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(14,165,233,0.1))' : 'transparent',
            color: activeTab === 'usage' ? '#38bdf8' : 'var(--text-muted)',
            boxShadow: activeTab === 'usage' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
          }}
        >
          Usage Analytics (Premium)
        </button>
      </nav>

      {/* Backend Status & Refresh */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          background: backendStatus.online ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${backendStatus.online ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: backendStatus.online ? 'var(--accent-emerald)' : 'var(--brand-huawei)',
            boxShadow: `0 0 8px ${backendStatus.online ? 'var(--accent-emerald)' : 'var(--brand-huawei)'}`,
          }}></span>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: backendStatus.online ? '#34d399' : '#f87171' }}>
            {backendStatus.online ? 'API :8085 Online' : 'API Offline'}
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="btn btn-secondary btn-sm"
          title="Refresh Data"
        >
          <RefreshCw size={14} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          <span>Refresh</span>
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}
