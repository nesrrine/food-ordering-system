// src/components/FoodCard.js
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGES = {
  pizza:    'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&q=80',
  burger:   'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  cake:     'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
  salad:    'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80',
  drink:    'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80',
  sushi:    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80',
  pasta:    'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=400&q=80',
  other:    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
};

const FoodCard = ({ food }) => {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const cartItem = items.find(i => i._id === food._id);
  const qty = cartItem?.quantity || 0;

  const imgSrc = (!food.image || imgError)
    ? (FALLBACK_IMAGES[food.category?.toLowerCase()] || FALLBACK_IMAGES.other)
    : food.image;

  const handleAdd = () => {
    addItem(food);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const stars = Math.round(food.rating || 0);

  return (
    <div style={s.card}>
      {/* Image */}
      <div style={s.imgWrap}>
        <img
          src={imgSrc}
          alt={food.name}
          style={s.img}
          onError={() => setImgError(true)}
        />
        {food.preparationTime && (
          <div style={s.timeBadge}>⏱ {food.preparationTime} min</div>
        )}
        {!food.isAvailable && (
          <div style={s.unavailableOverlay}>Unavailable</div>
        )}
      </div>

      {/* Body */}
      <div style={s.body}>
        <div style={s.category}>{food.category}</div>
        <h3 style={s.name}>{food.name}</h3>
        <p style={s.desc}>{food.description}</p>

        {/* Rating */}
        {food.rating > 0 && (
          <div style={s.ratingRow}>
            <div style={s.stars}>
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{ color: i <= stars ? '#F5A623' : '#E0DDD9', fontSize: '12px' }}>★</span>
              ))}
            </div>
            <span style={s.ratingNum}>{food.rating?.toFixed(1)}</span>
          </div>
        )}

        {/* Footer */}
        <div style={s.footer}>
          <div>
            <div style={s.price}>${food.price?.toFixed(2)}</div>
            {qty > 0 && <div style={s.inCart}>{qty} in cart</div>}
          </div>

          <button
            style={{
              ...s.addBtn,
              ...(added ? s.addBtnAdded : {}),
              ...((!food.isAvailable) ? s.addBtnDisabled : {}),
            }}
            onClick={handleAdd}
            disabled={!food.isAvailable}
          >
            {added ? '✓' : qty > 0 ? `+${qty + 1}` : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

const s = {
  card: {
    background: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #F0EDE9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },

  imgWrap: {
    position: 'relative',
    height: '160px',
    overflow: 'hidden',
    background: '#F8F6F2',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  timeBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(255,255,255,0.92)',
    color: '#4A4A4A',
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 8px',
    borderRadius: '12px',
    backdropFilter: 'blur(4px)',
  },
  unavailableOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '500',
  },

  body: { padding: '14px' },

  category: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#E8621A',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '4px',
  },
  name: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: '4px',
    lineHeight: 1.3,
  },
  desc: {
    fontSize: '12px',
    color: '#888780',
    marginBottom: '8px',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '10px',
  },
  stars: { display: 'flex', gap: '1px' },
  ratingNum: { fontSize: '11px', color: '#888780' },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: { fontSize: '17px', fontWeight: '700', color: '#E8621A' },
  inCart: { fontSize: '10px', color: '#888780', marginTop: '1px' },

  addBtn: {
    background: '#E8621A',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.15s, transform 0.1s',
    minWidth: '60px',
  },
  addBtnAdded: {
    background: '#3B6D11',
  },
  addBtnDisabled: {
    background: '#C4C1BB',
    cursor: 'not-allowed',
  },
};

export default FoodCard;