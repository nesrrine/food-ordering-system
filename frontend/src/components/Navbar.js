// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useCart } from '../context/CartContext';
import Cart from './Cart';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>Foody<span style={styles.dot}>.</span></Link>

        <div style={styles.links}>
          <Link to="/" style={{ ...styles.link, ...(isActive('/') ? styles.linkActive : {}) }}>Home</Link>
          <Link to="/orders" style={{ ...styles.link, ...(isActive('/orders') ? styles.linkActive : {}) }}>My Orders</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" style={{ ...styles.link, ...(isActive('/admin') ? styles.linkActive : {}) }}>Admin</Link>
          )}
        </div>

        <div style={styles.right}>
          <span style={styles.userName}>{user?.fullName?.split(' ')[0]}</span>
          <button style={styles.cartBtn} onClick={() => setCartOpen(true)}>
            🛒 Cart {count > 0 && <span style={styles.badge}>{count}</span>}
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {cartOpen && <Cart onClose={() => setCartOpen(false)} />}
    </>
  );
};

const styles = {
  nav: {
    background: '#fff',
    borderBottom: '0.5px solid #EBEBEB',
    padding: '0 2rem',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#E8621A',
    textDecoration: 'none',
  },
  dot: { color: '#1A1A1A' },
  links: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  link: { fontSize: '14px', color: '#888780', textDecoration: 'none' },
  linkActive: { color: '#E8621A', fontWeight: '500' },
  right: { display: 'flex', gap: '10px', alignItems: 'center' },
  userName: { fontSize: '14px', color: '#888780' },
  cartBtn: {
    background: '#E8621A',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    position: 'relative',
  },
  badge: {
    background: '#fff',
    color: '#E8621A',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '11px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
    background: 'transparent',
    border: '0.5px solid #EBEBEB',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '13px',
    color: '#888780',
  },
};

export default Navbar;