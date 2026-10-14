import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

export default function SubscriberModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting,
  subscribersPlan,
}) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    plan: '1',
    activation_date: '',
  });
  const [error, setError] = useState('');

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        name: initialData.name || '',
        plan: String(
          initialData.fk_huawei_subscriber_plan_id ??
          initialData.plan ??
          '1'
        ),
        activation_date: initialData.activation_date
          ? new Date(initialData.activation_date).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData({
        id: '',
        name: '',
        plan: '1',
        activation_date: new Date().toISOString().split('T')[0],
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id.trim()) {
      setError("Subscriber ID code is required (e.g. 'SUB-001')");
      return;
    }
    if (!formData.name.trim()) {
      setError("Subscriber name is required");
      return;
    }
    if (!formData.plan.trim()) {
      setError("Plan selection is required");
      return;
    }

    setError('');
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
              {isEdit ? 'Edit Subscriber' : 'Add New Subscriber'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {isEdit ? `Updating PK #${initialData.pk_huawei_subscriber_id}` : 'Fill in details to register subscriber'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.825rem',
            marginBottom: '16px',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subscriber Code ID *</label>
            <input
              type="text"
              placeholder="e.g. SUB-001, HUA-998"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className="form-input"
              maxLength={50}
              autoFocus={!isEdit}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Budi Santoso"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Service Plan *</label>
            <select
              value={formData.plan}
              onChange={(e) =>
                setFormData({ ...formData, plan: e.target.value })
              }
              className="form-input"
            >
              {subscribersPlan?.map((item) => (
                <option
                  key={item.pk_huawei_subscriber_plan_id}
                  value={item.pk_huawei_subscriber_plan_id}
                >
                  {item.plan}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Activation Date</label>
            <input
              type="date"
              value={formData.activation_date}
              onChange={(e) => setFormData({ ...formData, activation_date: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Save size={16} />
              <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Subscriber' : 'Create Subscriber'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
