// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FoodCard from '../components/FoodCard';
import { foodsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext.js';

const CATEGORIES = [
  { key: 'All',      label: 'All',      emoji: '🍽️' },
  { key: 'Pizza',    label: 'Pizza',    emoji: '🍕' },
  { key: 'Burger',   label: 'Burger',   emoji: '🍔' },
  { key: 'Cake',     label: 'Cake',     emoji: '🎂' },
  { key: 'Salad',    label: 'Salad',    emoji: '🥗' },
  { key: 'Sandwich', label: 'Sandwich', emoji: '🥪' },
  { key: 'Drink',    label: 'Drink',    emoji: '🥤' },
  { key: 'Sushi',    label: 'Sushi',    emoji: '🍱' },
  { key: 'Pasta',    label: 'Pasta',    emoji: '🍝' },
];

const PROMOS = [
  { emoji: '🚀', title: 'Fast Delivery', sub: '30 min or free' },
  { emoji: '🌿', title: 'Fresh Daily',   sub: 'Made every morning' },
  { emoji: '💳', title: 'Secure Pay',    sub: 'PayHere protected' },
];

const Home = () => {
  const { user } = useAuth();
  const [foods, setFoods]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch]     = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => { fetchFoods(); }, [category, search]);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category.toLowerCase();
      if (search) params.search = search;
      const res = await foodsAPI.getAll(params);
      setFoods(res.data.foods || []);
    } catch (err) {
      console.error('Fetch foods error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div style={s.page}>
      <Navbar />

      {/* ── HERO ── */}
      <div style={s.heroWrap}>
        <div style={s.heroInner}>
          <div style={s.heroLeft}>
            <div style={s.heroEyebrow}>🔥 Free delivery today</div>
            <h1 style={s.heroTitle}>
              Crave it.<br />
              <span style={s.heroAccent}>Order it.</span><br />
              Love it.
            </h1>
            <p style={s.heroSub}>
              Fresh meals from the best spots — delivered hot to your door in 30 min.
            </p>

            {/* Search inline dans le hero */}
            <form onSubmit={handleSearch} style={s.heroSearch}>
              <span style={s.searchIcon}>🔍</span>
              <input
                style={s.searchInput}
                placeholder="Search pizza, burger, sushi..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              <button type="submit" style={s.searchBtn}>Search</button>
            </form>
          </div>

          <div style={s.heroRight}>
            <div style={s.heroImageCircle}>🍔</div>
            <div style={s.heroBadge1}>⚡ 30 min</div>
            <div style={s.heroBadge2}>⭐ 4.9</div>
          </div>
        </div>

        {/* Promo strip */}
        <div style={s.promoStrip}>
          {PROMOS.map(p => (
            <div key={p.title} style={s.promoItem}>
              <span style={s.promoEmoji}>{p.emoji}</span>
              <div>
                <div style={s.promoTitle}>{p.title}</div>
                <div style={s.promoSub}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.container}>

        {/* ── CATEGORIES ── */}
        <div style={s.catsWrap}>
          <h2 style={s.sectionLabel}>Browse by category</h2>
          <div style={s.cats}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                style={{
                  ...s.cat,
                  ...(category === cat.key ? s.catActive : {}),
                }}
              >
                <span style={s.catEmoji}>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── SECTION HEADER ── */}
        <div style={s.sectionHeader}>
          <div>
            <h2 style={s.sectionTitle}>
              {search
                ? `Results for "${search}"`
                : category === 'All' ? 'All Items' : category}
            </h2>
            <p style={s.sectionCount}>{foods.length} items available</p>
          </div>
          {search && (
            <button
              style={s.clearBtn}
              onClick={() => { setSearch(''); setSearchInput(''); }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* ── GRID ── */}
        {loading ? (
          <div style={s.loadingGrid}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={s.skeleton} />)}
          </div>
        ) : foods.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}>😕</div>
            <p style={s.emptyText}>No items found</p>
            <button style={s.emptyBtn} onClick={() => { setSearch(''); setSearchInput(''); setCategory('All'); }}>
              Reset filters
            </button>
          </div>
        ) : (
          <div style={s.grid}>
            {foods.map(food => <FoodCard key={food._id} food={food} />)}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────── STYLES ─────────────── */
const s = {
  page: { minHeight: '100vh', background: '#F8F6F2', fontFamily: 'inherit' },

  /* Hero */
  heroWrap: {
    background: 'linear-gradient(135deg, #1A0A00 0%, #3D1A00 60%, #E8621A 100%)',
    padding: '0 0 0 0',
    overflow: 'hidden',
  },
  heroInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '3rem 1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
  },
  heroLeft: { flex: 1, maxWidth: '560px' },
  heroEyebrow: {
    display: 'inline-block',
    background: 'rgba(232,98,26,0.25)',
    color: '#FFB085',
    fontSize: '13px',
    padding: '4px 14px',
    borderRadius: '20px',
    marginBottom: '1rem',
    border: '1px solid rgba(232,98,26,0.4)',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#fff',
    lineHeight: 1.1,
    marginBottom: '1rem',
    letterSpacing: '-1px',
  },
  heroAccent: { color: '#FF7A35' },
  heroSub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: '15px',
    marginBottom: '1.75rem',
    lineHeight: 1.6,
  },
  heroSearch: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    borderRadius: '12px',
    padding: '6px 6px 6px 14px',
    gap: '8px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    maxWidth: '460px',
  },
  searchIcon: { fontSize: '16px', flexShrink: 0 },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#1A1A1A',
    background: 'transparent',
  },
  searchBtn: {
    background: '#E8621A',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    flexShrink: 0,
  },

  heroRight: {
    position: 'relative',
    width: '240px',
    height: '240px',
    flexShrink: 0,
  },
  heroImageCircle: {
    width: '200px',
    height: '200px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '90px',
    border: '2px solid rgba(255,255,255,0.15)',
    margin: '20px auto 0',
  },
  heroBadge1: {
    position: 'absolute',
    top: '10px',
    right: '0',
    background: '#fff',
    color: '#1A1A1A',
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 14px',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  heroBadge2: {
    position: 'absolute',
    bottom: '30px',
    left: '0',
    background: '#E8621A',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 14px',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(232,98,26,0.4)',
  },

  /* Promo strip */
  promoStrip: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    gap: '0',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  promoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    padding: '0 1.5rem 0 0',
  },
  promoEmoji: { fontSize: '24px' },
  promoTitle: { color: '#fff', fontSize: '13px', fontWeight: '600' },
  promoSub: { color: 'rgba(255,255,255,0.5)', fontSize: '11px' },

  /* Container */
  container: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' },

  /* Categories */
  catsWrap: { marginBottom: '2rem' },
  sectionLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#888780',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '1rem',
  },
  cats: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  cat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    border: '1.5px solid #E8E6E2',
    borderRadius: '24px',
    background: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    color: '#4A4A4A',
    cursor: 'pointer',
    transition: 'all 0.15s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  catActive: {
    background: '#E8621A',
    color: '#fff',
    border: '1.5px solid #E8621A',
    boxShadow: '0 4px 12px rgba(232,98,26,0.3)',
  },
  catEmoji: { fontSize: '16px' },

  /* Section header */
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '1.25rem',
  },
  sectionTitle: { fontSize: '20px', fontWeight: '600', color: '#1A1A1A', marginBottom: '2px' },
  sectionCount: { fontSize: '13px', color: '#888780' },
  clearBtn: {
    background: 'transparent',
    border: '1px solid #E8621A',
    color: '#E8621A',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '13px',
    cursor: 'pointer',
  },

  /* Grid */
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
  },

  /* Loading skeletons */
  loadingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
  },
  skeleton: {
    height: '280px',
    borderRadius: '16px',
    background: 'linear-gradient(90deg, #f0ede9 25%, #e8e5e1 50%, #f0ede9 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  },

  /* Empty */
  empty: { textAlign: 'center', padding: '4rem 0' },
  emptyIcon: { fontSize: '56px', marginBottom: '1rem' },
  emptyText: { color: '#888780', fontSize: '16px', marginBottom: '1rem' },
  emptyBtn: {
    background: '#E8621A',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 24px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default Home;