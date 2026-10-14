import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, UserPlus, Filter } from 'lucide-react';

export default function SubscriberTable({
  subscribers = [],
  isLoading,
  onAddClick,
  onEditClick,
  onDeleteClick,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('ALL');

  const plans = ['ALL', ...new Set(subscribers.map(s => s.plan).filter(Boolean))];

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch =
      sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(sub.pk_huawei_subscriber_id).includes(searchTerm);

    const matchesPlan =
      planFilter === 'ALL' ||
      sub.plan?.toLowerCase() === planFilter.toLowerCase();

    return matchesSearch && matchesPlan;
  });

  const getPlanBadgeClass = (plan) => {
    const lower = plan?.toLowerCase();
    if (lower === 'premium') return 'badge badge-premium';
    if (lower === 'standard') return 'badge badge-standard';
    return 'badge badge-basic';
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return '-';
    try {
      const d = new Date(dateVal);
      return isNaN(d.getTime()) ? String(dateVal) : d.toISOString().split('T')[0];
    } catch {
      return String(dateVal);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      {/* Table Header & Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
      }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '4px' }}>
            Subscriber Directory
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Manage active Huawei subscribers and service subscriptions
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search ID, name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '34px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Plan Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} color="var(--text-dim)" />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="form-input"
              style={{ width: '130px', fontSize: '0.85rem', padding: '9px 12px' }}
            >
              {plans.map((p, i) => (
                <option key={i} value={p}>
                  {p === 'ALL' ? 'All Plans' : p}
                </option>
              ))}
            </select>
          </div>

          {/* Add Subscriber Button */}
          <button onClick={onAddClick} className="btn btn-primary">
            <Plus size={16} />
            <span>Add Subscriber</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>PK ID</th>
              <th>Subscriber Code</th>
              <th>Full Name</th>
              <th>Service Plan</th>
              <th>Activation Date</th>
              <th>Created Date</th>
              <th style={{ textAlign: 'center', width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  Loading subscribers from PostgreSQL...
                </td>
              </tr>
            ) : filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <UserPlus size={32} color="var(--text-dim)" />
                    <p style={{ fontWeight: '500' }}>No subscribers found</p>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {searchTerm ? 'Try adjusting your search criteria' : 'Click "Add Subscriber" to create the first record'}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSubscribers.map((sub) => (
                <tr key={sub.pk_huawei_subscriber_id}>
                  <td className="font-mono" style={{ color: 'var(--text-dim)' }}>
                    #{sub.pk_huawei_subscriber_id}
                  </td>
                  <td className="font-mono" style={{ fontWeight: '600', color: 'var(--accent-cyan)' }}>
                    {sub.id}
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    {sub.name}
                  </td>
                  <td>
                    <span className={getPlanBadgeClass(sub.plan)}>
                      {sub.plan}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {formatDate(sub.activation_date)}
                  </td>
                  <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                    {formatDate(sub.created_date)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => onEditClick(sub)}
                        className="btn btn-secondary btn-sm"
                        title="Edit Subscriber"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => onDeleteClick(sub)}
                        className="btn btn-danger btn-sm"
                        title="Delete Subscriber"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
