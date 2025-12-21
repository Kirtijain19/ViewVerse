import { API_BASE, STORAGE_TOKEN_KEY, STORAGE_USER_KEY } from '../utils/constants';

const getAuthHeaders = () => {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const subscriptionService = {
  checkSubscription: async (channelId) => {
    // Determine current user id from localStorage if available
    const stored = localStorage.getItem(STORAGE_USER_KEY);
    if (!stored) return { data: { isSubscribed: false } };
    const currentUser = JSON.parse(stored);
    try {
      const res = await fetch(`${API_BASE}/subscriptions/u/${currentUser._id}`, {
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      });
      if (!res.ok) return { data: { isSubscribed: false } };
      const json = await res.json();
      const channels = json.data || [];
      const isSubscribed = channels.some((c) => (c.channel?._id || c._id) === channelId);
      return { data: { isSubscribed } };
    } catch (err) {
      return { data: { isSubscribed: false } };
    }
  },
  subscribe: async (channelId) => {
    const res = await fetch(`${API_BASE}/subscriptions/c/${channelId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error('Failed to subscribe');
    return res.json();
  },
  unsubscribe: async (channelId) => {
    // toggle endpoint is used for both subscribe/unsubscribe
    const res = await fetch(`${API_BASE}/subscriptions/c/${channelId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error('Failed to unsubscribe');
    return res.json();
  },
};

export default subscriptionService;
