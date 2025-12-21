import React, { useEffect, useState } from 'react';
import { API_BASE } from '../utils/constants';
import Sidebar from '../components/common/Sidebar';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/dashboard`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard');
      const data = await res.json();
      setStats(data.data || data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 20 }}>
          <h2>Dashboard</h2>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              <div style={{ padding: 16, border: '1px solid #ddd' }}>
                <h3>Videos</h3>
                <p>{stats.totalVideos ?? stats.videos ?? 0}</p>
              </div>
              <div style={{ padding: 16, border: '1px solid #ddd' }}>
                <h3>Subscribers</h3>
                <p>{stats.subscribers ?? 0}</p>
              </div>
              <div style={{ padding: 16, border: '1px solid #ddd' }}>
                <h3>Views</h3>
                <p>{stats.views ?? 0}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;