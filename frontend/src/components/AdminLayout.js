// src/components/AdminLayout.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

const NAV = [
  { path: '/admin',       icon: '📊', label: 'Dashboard' },
  { path: '/admin/orders',icon: '📦', label: 'Orders' },
  { path: '/admin/foods', icon: '🍕', label: 'Foods' },
  { path: '/admin/users', icon: '👥', label: 'Users' },
];

const AdminLayout = ({ children, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/auth'); };

  return (
    <div style={styles.wrap}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>Foody<span style={{ color: '#1A1A1A' }}>.</span></div>
        <div style={styles.adminBadge}>Admin Panel</div>
        <nav style={styles.nav}>
          {NAV.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{ ...styles.navItem, ...(location.pathname === item.path ? styles.navActive : {}) }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>← Logout</button>
      </aside>

      <main style={styles.main}>
        <div style={styles.topbar}>
          <h1 style={styles.pageTitle}>{title}</h1>
        </div>
        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
};

const styles = {
  wrap: { display: 'flex', minHeight: '100vh', background: '#F8F6F2' },
  sidebar: {
    width: '220px', background: '#fff',
    borderRight: '0.5px solid #EBEBEB',
    padding: '1.5rem 1rem',
    display: 'flex', flexDirection: 'column',
    position: 'sticky', top: 0, height: '100vh',
  },
  logo: { fontSize: '20px', fontWeight: '600', color: '#E8621A', marginBottom: '4px' },
  adminBadge: { fontSize: '11px', color: '#888780', marginBottom: '1.5rem' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '8px',
    fontSize: '14px', color: '#888780',
    textDecoration: 'none',
  },
  navActive: { background: '#FDF0E8', color: '#E8621A', fontWeight: '500' },
  logoutBtn: {
    background: 'none', border: 'none',
    color: '#888780', fontSize: '13px',
    textAlign: 'left', padding: '10px 12px',
    cursor: 'pointer',
  },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  topbar: {
    background: '#fff', borderBottom: '0.5px solid #EBEBEB',
    padding: '1rem 1.5rem',
  },
  pageTitle: { fontSize: '18px', fontWeight: '500' },
  content: { padding: '1.5rem', flex: 1 },
};

export default AdminLayout;