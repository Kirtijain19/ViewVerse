import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/constants';
import Sidebar from '../components/common/Sidebar';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullname: '', email: '', username: '', password: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setAvatarFile(f || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // backend expects multipart/form-data (avatar file)
      const fd = new FormData();
      fd.append('fullname', form.fullname);
      fd.append('username', form.username);
      fd.append('email', form.email);
      fd.append('password', form.password);
      if (avatarFile) fd.append('avatar', avatarFile);

      const res = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        body: fd,
      });

      // If backend not reachable, this will throw network error
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 20, maxWidth: 700 }}>
          <h2>Create account</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }} encType="multipart/form-data">
            <input name="fullname" value={form.fullname} onChange={handleChange} placeholder="Full name" required />
            <input name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required />
            <label style={{ fontSize: 13 }}>Avatar (optional)</label>
            <input name="avatar" type="file" accept="image/*" onChange={handleFileChange} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Register;