import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import authService from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authService.login(form);
      if (res?.token) {
        localStorage.setItem('token', res.token);
      }
      if (res?.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 20, maxWidth: 600 }}>
          <h2>Login</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Login;