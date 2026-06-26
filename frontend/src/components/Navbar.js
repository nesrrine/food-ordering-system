// src/components/Navbar.js - VERSION AMÉLIORÉE
import React, { useState, useEffect } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Effet scroll pour shadow dynamique
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{
        ...styles.nav,
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.08)' : 'none',
      }}>
        {/* Logo Section */}
        <Link to="/" style={styles.logoContainer}>
          <span style={styles.logo}>
            Foody<span style={styles.dot}>.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div style={styles.desktopNav}>
          <div style={styles.linksContainer}>
            <Link 
              to="/" 
              style={{
                ...styles.link,
                ...(isActive('/') ? styles.linkActive : {}),
              }}
            >
              Home
            </Link>
            <Link 
              to="/orders" 
              style={{
                ...styles.link,
                ...(isActive('/orders') ? styles.linkActive : {}),
              }}
            >
              My Orders
            </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                style={{
                  ...styles.link,
                  ...(isActive('/admin') ? styles.linkActive : {}),
                }}
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div style={styles.rightSection}>
            {user && (
              <div style={styles.userInfo}>
                <div style={styles.userAvatar}>
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <span style={styles.userName}>{user?.fullName?.split(' ')[0]}</span>
              </div>
            )}

            <button 
              style={styles.cartBtn} 
              onClick={() => setCartOpen(true)}
              title="Panier"
            >
              <span style={styles.cartIcon}>🛒</span>
              {count > 0 && <span style={styles.badge}>{count}</span>}
            </button>

            <button 
              style={styles.logoutBtn} 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          style={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span style={{
            ...styles.hamburger,
            transform: mobileMenuOpen ? 'rotate(45deg) translateY(8px)' : 'none',
          }}></span>
          <span style={{
            ...styles.hamburger,
            opacity: mobileMenuOpen ? 0 : 1,
          }}></span>
          <span style={{
            ...styles.hamburger,
            transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none',
          }}></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenuOverlay} onClick={() => setMobileMenuOpen(false)}>
          <div 
            style={styles.mobileMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <Link 
              to="/" 
              style={styles.mobileLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/orders" 
              style={styles.mobileLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              My Orders
            </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                style={styles.mobileLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            <div style={styles.mobileDivider}></div>
            {user && (
              <div style={styles.mobileUser}>
                <div style={styles.userAvatar}>{user?.fullName?.charAt(0).toUpperCase()}</div>
                <span>{user?.fullName}</span>
              </div>
            )}
            <button 
              style={styles.mobileLogoutBtn} 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && <Cart onClose={() => setCartOpen(false)} />}
    </>
  );
};

const styles = {
  nav: {
    background: '#FFFFFF',
    borderBottom: '1px solid #F0F0F0',
    padding: '0 1.5rem',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    transition: 'box-shadow 0.3s ease',
  },

  // Logo
  logoContainer: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #E8621A 0%, #FF8C42 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.5px',
  },
  dot: {
    color: '#1A1A1A',
  },

  // Desktop Navigation
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '3rem',
    flex: 1,
    marginLeft: '2rem',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },

  linksContainer: {
    display: 'flex',
    gap: '2.5rem',
    alignItems: 'center',
  },

  link: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#888780',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    position: 'relative',
    cursor: 'pointer',
  },

  linkActive: {
    color: '#E8621A',
    fontWeight: '600',
    backgroundColor: '#FFF5F0',
  },

  rightSection: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    marginLeft: 'auto',
  },

  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #E8621A 0%, #FF8C42 100%)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },

  userName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1A1A1A',
  },

  cartBtn: {
    background: 'linear-gradient(135deg, #E8621A 0%, #FF8C42 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 18px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(232, 98, 26, 0.2)',
  },

  cartIcon: {
    fontSize: '16px',
  },

  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#FF4444',
    color: '#FFFFFF',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #FFFFFF',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },

  logoutBtn: {
    background: 'transparent',
    border: '1.5px solid #E8621A',
    borderRadius: '8px',
    padding: '9px 18px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#E8621A',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  // Mobile Menu Button
  mobileMenuBtn: {
    display: 'none',
    flexDirection: 'column',
    gap: '6px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginLeft: 'auto',
  },

  hamburger: {
    width: '24px',
    height: '2.5px',
    background: '#1A1A1A',
    borderRadius: '2px',
    display: 'block',
    transition: 'all 0.3s ease',
  },

  // Mobile Menu
  mobileMenuOverlay: {
    position: 'fixed',
    top: '70px',
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 99,
    animation: 'fadeIn 0.2s ease',
  },

  mobileMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '280px',
    height: 'calc(100vh - 70px)',
    background: '#FFFFFF',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    boxShadow: '-2px 0 16px rgba(0,0,0,0.1)',
    animation: 'slideIn 0.3s ease',
  },

  mobileLink: {
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#888780',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },

  mobileDivider: {
    height: '1px',
    background: '#F0F0F0',
    margin: '0.5rem 0',
  },

  mobileUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    marginTop: '0.5rem',
  },

  mobileLogoutBtn: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1.5px solid #E8621A',
    background: 'transparent',
    color: '#E8621A',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: 'auto',
    transition: 'all 0.2s ease',
  },
};

// Media queries CSS (à ajouter à votre fichier CSS global)
const mediaStyles = `
  @media (max-width: 768px) {
    [data-mobile-menu-btn] {
      display: flex !important;
    }
    [data-desktop-nav] {
      display: none !important;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
`;

// Injecter les styles media
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = mediaStyles;
  document.head.appendChild(style);
}

export default Navbar;