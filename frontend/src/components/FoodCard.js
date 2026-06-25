// src/components/FoodCard.js
import React from 'react';
import { useCart } from '../context/CartContext';

const EMOJI_MAP = {
  pizza: '🍕', burger: '🍔', cake: '🎂',
  salad: '🥗', sandwich: '🥪', drink: '🥤',
  sushi: '🍱', pasta: '🍝', default: '🍽️'
};

const FoodCard = ({ food }) => {
  const { addItem, items } = useCart();
  const emoji = EMOJI_MAP[food.category?.toLowerCase()] || EMOJI_MAP.default;
  const inCart = items.find(i => i._id === food._id);

  return (
    <div style={styles.card}>
      <div style={styles.imgWrap}>
        <span style={styles.emoji}>{emoji}</span>
        {food.stock < 5 && food.stock > 0 && (
          <span style={styles.lowStock}>Only {food.stock} left</span>
        )}
        {food.stock === 0 && (
          <span style={{ ...styles.lowStock, background: '#E24B4A' }}>Out of stock</span>
        )}
      </div>
      <div style={styles.info}>
        <div style={styles.name}>{food.name}</div>
        <div style={styles.desc}>{food.description?.substring(0, 50)}{food.description?.length > 50 ? '...' : ''}</div>
        <div style={styles.meta}>
          <span style={styles.time}>⏱ {food.preparationTime || 20} min</span>
        </div>
        <div style={styles.bottom}>
          <span style={styles.price}>${food.price?.toFixed(2)}</span>
          <button
            style={{ ...styles.addBtn, ...(food.stock === 0 ? styles.disabledBtn : {}), ...(inCart ? styles.inCartBtn : {}) }}
            onClick={() => food.stock > 0 && addItem({ ...food, emoji })}
            disabled={food.stock === 0}
          >
            {inCart ? `In cart (${inCart.quantity})` : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#fff',
    border: '0.5px solid #EBEBEB',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s',
  },
  imgWrap: {
    height: '110px',
    background: '#FDF0E8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: { fontSize: '48px' },
  lowStock: {
    position: 'absolute', top: '8px', right: '8px',
    background: '#E8621A', color: '#fff',
    fontSize: '10px', padding: '2px 8px',
    borderRadius: '20px',
  },
  info: { padding: '12px 14px' },
  name: { fontSize: '14px', fontWeight: '500', marginBottom: '2px' },
  desc: { fontSize: '12px', color: '#888780', marginBottom: '6px', lineHeight: '1.4' },
  meta: { marginBottom: '8px' },
  time: { fontSize: '11px', color: '#888780' },
  bottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: '15px', fontWeight: '600', color: '#E8621A' },
  addBtn: {
    background: '#E8621A', color: '#fff',
    border: 'none', borderRadius: '8px',
    padding: '6px 14px', fontSize: '12px', fontWeight: '500',
  },
  inCartBtn: { background: '#FDF0E8', color: '#E8621A' },
  disabledBtn: { background: '#EBEBEB', color: '#888780' },
};

export default FoodCard;