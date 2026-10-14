import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import SubscriberTable from './components/SubscriberTable';
import SubscriberModal from './components/SubscriberModal';
import UsageCalculator from './components/UsageCalculator';
import Toast from './components/Toast';
import { api } from './api/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('subscribers');
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersPlan, setSubscribersPlan] = useState([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ online: false });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check Backend Health
  const checkHealth = useCallback(async () => {
    try {
      await api.getHealth();
      setBackendStatus({ online: true });
    } catch {
      setBackendStatus({ online: false });
    }
  }, []);

  // Fetch Subscribers List
  const fetchSubscribers = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoadingSubscribers(true);
    try {
      const res = await api.getAllSubscribers();
      const planRes = await api.getAllSubscribersPlan();

      setSubscribers(res.data || []);
      setSubscribersPlan(planRes.data || []);
      setBackendStatus({ online: true });

    } catch (err) {
      if (!quiet) addToast(err.message || 'Failed to connect to backend', 'error');
      setBackendStatus({ online: false });
    } finally {
      if (!quiet) setIsLoadingSubscribers(false);
    }
  }, [addToast]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkHealth();
    await fetchSubscribers(true);
    setIsRefreshing(false);
    addToast('Data refreshed successfully', 'info');
  };

  useEffect(() => {
    checkHealth();
    fetchSubscribers();
  }, [checkHealth, fetchSubscribers]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingSubscriber(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (subscriber) => {
    setEditingSubscriber(subscriber);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingSubscriber) {
        // Update
        const res = await api.updateSubscriber(editingSubscriber.pk_huawei_subscriber_id, formData);
        addToast(res.message || 'Subscriber updated successfully', 'success');
        console.log("update res", res);
      } else {
        // Create
        const res = await api.createSubscriber(formData);
        addToast(res.message || 'Subscriber created successfully', 'success');
        console.log("create res", res);
      }
      setIsModalOpen(false);
      fetchSubscribers(true);
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleDeleteSubscriber = async (subscriber) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete subscriber "${subscriber.name}" (ID: ${subscriber.id})?`
    );
    if (!confirmed) return;

    try {
      const res = await api.deleteSubscriber(subscriber.pk_huawei_subscriber_id);
      addToast(res.message || 'Subscriber deleted successfully', 'success');
      fetchSubscribers(true);
    } catch (err) {
      addToast(err.message || 'Failed to delete subscriber', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* KPI Stats Overview */}
      <StatsCards
        subscribers={subscribers}
        backendStatus={backendStatus}
      />

      {/* Main Tab Content */}
      <main>
        {activeTab === 'subscribers' ? (
          <SubscriberTable
            subscribers={subscribers}
            isLoading={isLoadingSubscribers}
            onAddClick={handleOpenAddModal}
            onEditClick={handleOpenEditModal}
            onDeleteClick={handleDeleteSubscriber}
          />
        ) : (
          <UsageCalculator
            onToast={addToast}
            subscribers={subscribers}
          />
        )}
      </main>

      {/* Add / Edit Subscriber Modal */}
      <SubscriberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingSubscriber}
        isSubmitting={isSubmitting}
        subscribersPlan={subscribersPlan}
      />

      {/* Notification Toast System */}
      <Toast
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}
