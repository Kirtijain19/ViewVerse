import React, { useEffect, useState } from 'react';
import { API_BASE } from '../utils/constants';

const HealthCheck = () => {
  const [status, setStatus] = useState('Checking...');
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_BASE}/healthcheck`);
        if (!res.ok) throw new Error('Down');
        const data = await res.json();
        setStatus(data.message || 'OK');
      } catch {
        setStatus('Unavailable');
      }
    };
    check();
  }, []);
  return (
    <div style={{ padding: 20 }}>
      <h2>Health Check</h2>
      <p>Status: {status}</p>
    </div>
  );
};

export default HealthCheck;