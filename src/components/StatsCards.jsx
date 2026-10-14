import React from 'react';
import { Users, Award, Clock, Database } from 'lucide-react';

export default function StatsCards({ subscribers = [], dbInfo }) {
  const totalSubscribers = subscribers.length;
  const premiumCount = subscribers.filter(s => s.plan?.toLowerCase() === 'premium').length;

  const stats = [
    {
      title: 'Total Subscribers',
      value: totalSubscribers,
      subtitle: 'Registered in Huawei database',
      icon: Users,
      color: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.2)',
    },
    {
      title: 'Premium Plan Active',
      value: premiumCount,
      subtitle: `${totalSubscribers > 0 ? Math.round((premiumCount / totalSubscribers) * 100) : 0}% of all subscribers`,
      icon: Award,
      color: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.2)',
    },
    {
      title: 'WIB Snapshot Hours',
      value: '08:00 • 12:00 • 15:00',
      subtitle: 'Asia/Jakarta (UTC+7) monitored',
      icon: Clock,
      color: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.2)',
      isText: true,
    },
    {
      title: 'Backend & Database',
      value: 'Port 8085 / PG 5433',
      subtitle: 'Pool: dbdev_huwawei',
      icon: Database,
      color: '#34d399',
      glow: 'rgba(52, 211, 153, 0.2)',
      isText: true,
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '28px',
    }}>
      {stats.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '20px 22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Ambient background glow */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: item.glow,
              filter: 'blur(25px)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                {item.title}
              </span>
              <div style={{
                padding: '8px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <IconComponent size={18} color={item.color} />
              </div>
            </div>

            <div>
              <div style={{
                fontSize: item.isText ? '1.15rem' : '1.9rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                color: item.color,
                marginBottom: '4px',
              }}>
                {item.value}
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)' }}>
                {item.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
