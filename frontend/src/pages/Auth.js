// src/pages/Auth.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

const Auth = () => {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : '/');
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (tab === 'login') {
        const data = await login(form.email, form.password);
        navigate(data.user.role === 'admin' ? '/admin' : '/');
      } else {
        await register(form.fullName, form.email, form.password, form.phone);
        navigate('/');
      }
    } catch (err) {
      // ✅ FIX: Affiche le message d'erreur correctement
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>Foody<span style={styles.dot}>.</span></div>
        <p style={styles.subtitle}>
          {tab === 'login' ? 'Welcome back 👋' : 'Create your account'}
        </p>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tab === 'login' ? styles.tabActive : {}) }}
            onClick={() => { setTab('login'); setError(''); }}
          >Login</button>
          <button
            style={{ ...styles.tab, ...(tab === 'register' ? styles.tabActive : {}) }}
            onClick={() => { setTab('register'); setError(''); }}
          >Register</button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {tab === 'register' && (
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Nesrine Romdhani"
                required
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@email.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
              style={styles.input}
            />
          </div>

          {tab === 'register' && (
            <div style={styles.field}>
              <label style={styles.label}>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+216 XX XXX XXX"
                required
                style={styles.input}
              />
            </div>
          )}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F8F6F2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    background: '#fff',
    border: '0.5px solid #EBEBEB',
    borderRadius: '16px',
    padding: '2rem',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  logo: { fontSize: '24px', fontWeight: '600', color: '#E8621A', textAlign: 'center', marginBottom: '4px' },
  dot: { color: '#1A1A1A' },
  subtitle: { fontSize: '14px', color: '#888780', textAlign: 'center', marginBottom: '1.5rem' },
  tabs: {
    display: 'flex',
    border: '0.5px solid #EBEBEB',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '1.25rem',
  },
  tab: {
    flex: 1, padding: '10px', fontSize: '14px',
    background: 'transparent', border: 'none',
    color: '#888780',
  },
  tabActive: {
    background: '#FDF0E8', color: '#E8621A', fontWeight: '500',
  },
  error: {
    background: '#FCEBEB', color: '#A32D2D',
    border: '0.5px solid #F09595',
    borderRadius: '8px', padding: '10px 14px',
    fontSize: '13px', marginBottom: '1rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '12px', color: '#888780', fontWeight: '500' },
  input: {
    border: '0.5px solid #EBEBEB',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    outline: 'none',
    background: '#fff',
    color: '#1A1A1A',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    background: '#E8621A', color: '#fff',
    border: 'none', borderRadius: '10px',
    padding: '12px', fontSize: '15px', fontWeight: '500',
    marginTop: '6px',
  },
};

export default Auth;