import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FoodCard from '../components/FoodCard';
import { foodsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext.js';

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Cake', 'Salad', 'Sandwich', 'Drink', 'Sushi', 'Pasta'];

const EMOJI_CAT = {
  All: '🍽️',
  Pizza: '🍕',
  Burger: '🍔',
  Cake: '🎂',
  Salad: '🥗',
  Sandwich: '🥪',
  Drink: '🥤',
  Sushi: '🍱',
  Pasta: '🍝'
};

const Home = () => {
  const { user } = useAuth();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFoods();
  }, [category]);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const params = {};

      if (category !== 'All') {
        params.category = category.toLowerCase();
      }

      if (search) {
        params.search = search;
      }

      // ✅ FIX IMPORTANT
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
    fetchFoods();
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* Hero */}
        <div style={styles.hero}>
          <div>
            <h1 style={styles.heroTitle}>
              Order your<br />favourite food 🍕
            </h1>
            <p style={styles.heroSub}>
              Fast delivery, fresh meals — right to your door
            </p>
          </div>
          <div style={styles.heroEmoji}>🍔</div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={styles.searchBar}>
          <span>🔍</span>

          <input
            style={styles.searchInput}
            placeholder="Search pizza, burger..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit" style={styles.searchBtn}>
            Search
          </button>
        </form>

        {/* Categories */}
        <div style={styles.cats}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                ...styles.cat,
                ...(category === cat ? styles.catActive : {})
              }}
            >
              {EMOJI_CAT[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Title */}
        <div style={styles.sectionHeader}>
          <h2>{category === 'All' ? 'All Items' : category}</h2>
          <span>{foods.length} items</span>
        </div>

        {/* Content */}
        {loading ? (
          <p>Loading...</p>
        ) : foods.length === 0 ? (
          <p>No foods found</p>
        ) : (
          <div style={styles.grid}>
            {foods.map(food => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#F8F6F2' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' },
  hero: {
    background: '#E8621A',
    borderRadius: '16px',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  heroTitle: { color: '#fff', fontSize: '22px' },
  heroSub: { color: '#fff', opacity: 0.8 },
  heroEmoji: { fontSize: '60px' },

  searchBar: {
    display: 'flex',
    gap: '10px',
    background: '#fff',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '1rem'
  },

  searchInput: { flex: 1, border: 'none', outline: 'none' },

  searchBtn: {
    background: '#E8621A',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px'
  },

  cats: { display: 'flex', gap: '8px', flexWrap: 'wrap' },

  cat: {
    padding: '6px 12px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    background: '#fff'
  },

  catActive: {
    background: '#E8621A',
    color: '#fff'
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1rem 0'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '14px'
  }
};

export default Home;