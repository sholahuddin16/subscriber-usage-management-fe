/**
 * API client to connect to Huawei Express.js Backend on port 8085
 */

const BASE_URL = 'http://localhost:8085';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Backend health check
  async getHealth() {
    return request('/health');
  },

  // Subscriber CRUD
  async getAllSubscribers() {
    return request('/api/subscribers');
  },

  async getAllSubscribersPlan() {
    return request('/api/subscribers/plan');
  },

  async getSubscriberById(id) {
    return request(`/api/subscribers/${id}`);
  },

  async createSubscriber(payload) {
    return request('/api/subscribers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateSubscriber(id, payload) {
    return request(`/api/subscribers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteSubscriber(id) {
    return request(`/api/subscribers/${id}`, {
      method: 'DELETE',
    });
  },

  // Usage Subscriber Operations
  
  async createUsageSubscriber(payload) {
    return request('/api/usage-subscribers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getRecentUsage() {
    return request('/api/usage-subscribers');
  },

  async getPremiumDataUsage() {
    return request('/api/usage-subscribers/premium-data');
  },

  async calculateDataUsagePremium() {
    return request('/api/usage-subscribers/data-usage-premium');
  },

  async calculateCallMinutesLowUsage() {
    return request('/api/usage-subscribers/call-minutes-low-usage');
  }
};
