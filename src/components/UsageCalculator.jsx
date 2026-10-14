import React, { useState, useEffect } from 'react';
import { Calendar, Activity, Clock, Database, CheckCircle, Info, Sparkles, PlusCircle, Send, Phone, MessageSquare, HardDrive } from 'lucide-react';
import { api } from '../api/api';

export default function UsageCalculator({ onToast, subscribers = [] }) {
  // Calculation State
  const [selectedDate, setSelectedDate] = useState('2026-10-12');
  const [isLoadingCalc, setIsLoadingCalc] = useState(false);
  const [usageResult, setUsageResult] = useState(null);

  // New Usage Snapshot Form State
  const [newUsage, setNewUsage] = useState({
    subscriberId: '',
    date: '2026-10-12',
    timeSlot: '08:00', // Strictly '08:00', '12:00', '15:00'
    dataUsageMB: '',
    callMinutes: '0',
    smsCount: '0',
  });
  const [isSubmittingUsage, setIsSubmittingUsage] = useState(false);

  // Recent usage list
  const [recentUsages, setRecentUsages] = useState([]);
  const [premiumDataUsage, setPremiumDataUsage] = useState([]);
  const [callMinutesLowUsage, setCallMinutesLowUsage] = useState([]);
  const [dataUsagePremium, setDataUsagePremium] = useState(null);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [isLoadingPremium, setIsLoadingPremium] = useState(false);
  const [isLoadingCallMinutesLowUsage, setIsLoadingCallMinutesLowUsage] = useState(false);

  // Fetch recent usage records
  const fetchRecent = async () => {
    setIsLoadingRecent(true);
    try {
      const res = await api.getRecentUsage();
      setRecentUsages(res.data || []);
    } catch {
      // ignore
    } finally {
      setIsLoadingRecent(false);
    }
  };

  const fetchPremiumDataUsage = async () => {
    setIsLoadingPremium(true);
    try {
      const res = await api.getPremiumDataUsage();
      setPremiumDataUsage(res.data || []);

    } catch (error) {
      console.error("Failed to fetch premium data usage:", error);
    } finally {
      setIsLoadingPremium(false);
    }
  };

  const fetchCallMinutesLowUsage = async () => {
    setIsLoadingCallMinutesLowUsage(true);
    try {
      const res = await api.calculateCallMinutesLowUsage();
      setCallMinutesLowUsage(res.data || []);
    } catch (error) {
      console.error("Failed to fetch call minutes low usage:", error);
    } finally {
      setIsLoadingCallMinutesLowUsage(false);
    }
  };

  const fetchDataUsagePremium = async () => {
    try {
      const res = await api.calculateDataUsagePremium();
      setDataUsagePremium(res);
    } catch (error) {
      console.error("Failed to fetch data usage premium:", error);
    }
  };

  useEffect(() => {
    fetchRecent();
    fetchPremiumDataUsage();
    fetchCallMinutesLowUsage();
    fetchDataUsagePremium();
    if (subscribers.length > 0 && !newUsage.subscriberId) {
      setNewUsage((prev) => ({ ...prev, subscriberId: subscribers[0].pk_huawei_subscriber_id }));
    }
  }, [subscribers]);

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    if (!selectedDate) {
      onToast('Please select a valid date in YYYY-MM-DD format', 'error');
      return;
    }

    setIsLoadingCalc(true);
    try {
      const response = await api.getPremiumDataUsage(selectedDate);
      setUsageResult(response);
      onToast(response.message, response.data?.total_data_usage_mb > 0 ? 'success' : 'info');
    } catch (err) {
      onToast(err.message || 'Failed to calculate usage data', 'error');
    } finally {
      setIsLoadingCalc(false);
    }
  };

  const handleCreateUsage = async (e) => {
    e.preventDefault();
    if (!newUsage.subscriberId) {
      onToast('Please select a subscriber', 'error');
      return;
    }
    if (!newUsage.date) {
      onToast('Please select a date', 'error');
      return;
    }
    if (newUsage.dataUsageMB === '' || Number(newUsage.dataUsageMB) < 0) {
      onToast('Please enter a valid data usage in MB', 'error');
      return;
    }

    // Construct timestamp formatted as YYYY-MM-DD HH:mm:00
    const fullTimestamp = `${newUsage.date} ${newUsage.timeSlot}:00`;

    setIsSubmittingUsage(true);
    try {
      const payload = {
        subscriberId: Number(newUsage.subscriberId),
        callMinutes: Number(newUsage.callMinutes) || 0,
        smsCount: Number(newUsage.smsCount) || 0,
        dataUsageMB: Number(newUsage.dataUsageMB),
        timestamp: fullTimestamp,
      };

      console.log("payloaddd", payload);

      const res = await api.createUsageSubscriber(payload);
      onToast(res.message || 'Usage snapshot saved successfully', 'success');

      // Reset form usage data
      setNewUsage((prev) => ({
        ...prev,
        dataUsageMB: '',
        callMinutes: '0',
        smsCount: '0',
      }));

      // Refresh recent records and recalculate
      fetchRecent();
      if (selectedDate === newUsage.date) {
        handleCalculate();
      }
    } catch (err) {
      onToast(err.message || 'Failed to create usage record', 'error');
    } finally {
      setIsSubmittingUsage(false);
    }
  };

  const formatSnapshotTime = (ts) => {
    if (!ts) return '-';
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB';
    } catch {
      return String(ts);
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Grid: Calculate Analytics & Output */}


      {/* Bottom Section: Record New Snapshot (POST) & Recent Records */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* POST New Snapshot Form Card */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.1))',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171',
            }}>
              <PlusCircle size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                Record Usage Snapshot (POST)
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Insert snapshot record for <code>huawei_usage_subscriber</code>
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateUsage}>
            {/* Subscriber Selection */}
            <div className="form-group">
              <label className="form-label">Subscriber (subscriberId) *</label>
              <select
                value={newUsage.subscriberId}
                onChange={(e) => setNewUsage({ ...newUsage, subscriberId: e.target.value })}
                className="form-input"
              >
                {subscribers.length === 0 ? (
                  <option value="">No subscribers found (Add one in Subscribers tab)</option>
                ) : (
                  subscribers.map((sub) => (
                    <option key={sub.pk_huawei_subscriber_id} value={sub.pk_huawei_subscriber_id}>
                      #{sub.pk_huawei_subscriber_id} - {sub.id} ({sub.name}) [{sub.plan}]
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Date and Strict Snapshot Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="#ffffff" />
                  <span>Snapshot Date *</span>
                </label>
                <input
                  type="date"
                  value={newUsage.date}
                  onChange={(e) => setNewUsage({ ...newUsage, date: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--accent-cyan)' }}>
                  Snapshot Time (WIB) *
                </label>
                <select
                  value={newUsage.timeSlot}
                  onChange={(e) => setNewUsage({ ...newUsage, timeSlot: e.target.value })}
                  className="form-input"
                  style={{ borderColor: 'rgba(6, 182, 212, 0.4)', fontWeight: '700' }}
                >
                  <option value="08:00">08:00 WIB</option>
                  <option value="12:00">12:00 WIB</option>
                  <option value="15:00">15:00 WIB</option>
                </select>
              </div>
            </div>

            {/* Usage Columns: dataUsageMB, callMinutes, smsCount */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HardDrive size={14} color="#38bdf8" />
                <span>Data Usage MB (dataUsageMB) *</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 500, 1250, 4000"
                value={newUsage.dataUsageMB}
                onChange={(e) => setNewUsage({ ...newUsage, dataUsageMB: e.target.value })}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} />
                  <span>Call Minutes (callMinutes)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={newUsage.callMinutes}
                  onChange={(e) => setNewUsage({ ...newUsage, callMinutes: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={14} />
                  <span>SMS Count (smsCount)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={newUsage.smsCount}
                  onChange={(e) => setNewUsage({ ...newUsage, smsCount: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingUsage}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            >
              <Send size={16} />
              <span>{isSubmittingUsage ? 'Saving Snapshot...' : 'Save Usage Snapshot'}</span>
            </button>
          </form>
        </div>


        {/* Recent Usage Records Table Card */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                Recent Usage Snapshots
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Latest recorded snapshots in database
              </p>
            </div>
            <button onClick={fetchRecent} className="btn btn-secondary btn-sm" disabled={isLoadingRecent}>
              Refresh
            </button>
          </div>

          <div className="table-container" style={{ maxHeight: '380px' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Subscriber</th>
                  <th>Snapshot Time</th>
                  <th>Data Usage</th>
                  <th>Calls / SMS</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingRecent ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      Loading snapshots...
                    </td>
                  </tr>
                ) : recentUsages.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No usage snapshots recorded yet. Use the form to record one!
                    </td>
                  </tr>
                ) : (
                  recentUsages.map((item) => (
                    <tr key={item.pk_usage_subscriber_id || item.pk_huawei_usage_subscriber_id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>
                          {item.subscriber_name || `ID #${item.fk_huawei_subscribee_id}`}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {item.subscriber_code} • {item.subscriber_plan}
                        </span>
                      </td>
                      <td style={{ color: 'var(--accent-cyan)', fontWeight: '600' }}>
                        {formatSnapshotTime(item.timestamp)}
                      </td>
                      <td style={{ fontWeight: '700', color: '#38bdf8' }}>
                        {item.data_usage_mb?.toLocaleString()} MB
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {item.call_minutes}m / {item.sms_count} sms
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '28px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                Total Data Usage
              </h1>

              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#38bdf8' }}>{dataUsagePremium?.totalDataUsageMB?.total_data_usage_mb} MB</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
              Top 3 Subscribers
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Latest recorded snapshots in database
            </p>
          </div>
          <button onClick={fetchPremiumDataUsage} className="btn btn-secondary btn-sm" disabled={isLoadingPremium}>
            Refresh
          </button>
        </div>

        <div className="table-container" style={{ maxHeight: '380px' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Subscriber</th>
                <th>Total Data Usage</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingPremium ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Loading snapshots...
                  </td>
                </tr>
              ) : premiumDataUsage.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No premium data usage recorded yet. Use the form to record one!
                  </td>
                </tr>
              ) : (
                premiumDataUsage.map((item) => (
                  <tr key={item.pk_usage_subscriber_id || item.pk_huawei_usage_subscriber_id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>
                        {item.rank}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>
                        {item.subscriber}
                      </div>
                    </td>
                    <td style={{ fontWeight: '700', color: '#38bdf8' }}>
                      {item.total_mb?.toLocaleString()} MB
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
              Average call minutes of subscribers ≤ 30
            </h2>
          </div>
          <button onClick={fetchCallMinutesLowUsage} className="btn btn-secondary btn-sm" disabled={isLoadingCallMinutesLowUsage}>
            Refresh
          </button>
        </div>

        <div className="table-container" style={{ maxHeight: '380px' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subscriber</th>
                <th>Average Call Minutes</th>
                <th>Total Snapshots</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingCallMinutesLowUsage ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Loading snapshots...
                  </td>
                </tr>
              ) : callMinutesLowUsage.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No usage snapshots recorded yet. Use the form to record one!
                  </td>
                </tr>
              ) : (
                callMinutesLowUsage.map((item) => (
                  <tr key={item.pk_usage_subscriber_id || item.pk_huawei_usage_subscriber_id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>
                        {item.subscriber}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {item.subscriber_id}
                      </span>
                    </td>
                    <td style={{ color: 'var(--accent-cyan)', fontWeight: '600' }}>
                      {item.average_call_minutes}
                    </td>
                    <td style={{ fontWeight: '700', color: '#38bdf8' }}>
                      {item.total_snapshots}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
