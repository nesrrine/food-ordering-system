// src/components/Cart.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = ({ onClose }) => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={styles.drawer}>
        <div style={styles.header}>
          <h2 style={styles.title}>Your Cart</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {items.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🛒</div>
            <p style={styles.emptyText}>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div style={styles.items}>
              {items.map(item => (
                <div key={item._id} style={styles.item}>
                  <div style={styles.itemEmoji}>{item.emoji || '🍽️'}</div>
                  <div style={styles.itemInfo}>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                  <div style={styles.qtyControls}>
                    <button style={styles.qtyBtn} onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                    <span style={styles.qty}>{item.quantity}</span>
                    <button style={styles.qtyBtn} onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <button style={styles.removeBtn} onClick={() => removeItem(item._id)}>✕</button>
                </div>
              ))}
            </div>

            <div style={styles.footer}>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Subtotal</span>
                <span style={styles.totalVal}>${total.toFixed(2)}</span>
              </div>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Delivery</span>
                <span style={styles.totalVal}>$5.49</span>
              </div>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Tax (8%)</span>
                <span style={styles.totalVal}>${(total * 0.08).toFixed(2)}</span>
              </div>
              <div style={{ ...styles.totalRow, ...styles.grandTotal }}>
                <span>Total</span>
                <span style={styles.grandTotalVal}>${(total + 5.49 + total * 0.08).toFixed(2)}</span>
              </div>
              <button style={styles.checkoutBtn} onClick={handleCheckout}>
                Proceed to Checkout →
              </button>
              <button style={styles.clearBtn} onClick={clearCart}>Clear cart</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.3)',
    zIndex: 200,
  },
  drawer: {
    position: 'fixed', right: 0, top: 0, bottom: 0,
    width: '380px',
    background: '#fff',
    zIndex: 201,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
  },
  header: {
    padding: '1.25rem 1.5rem',
    borderBottom: '0.5px solid #EBEBEB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: '18px', fontWeight: '500' },
  closeBtn: { background: 'none', border: 'none', fontSize: '16px', color: '#888780' },
  empty: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' },
  emptyIcon: { fontSize: '48px' },
  emptyText: { color: '#888780', fontSize: '14px' },
  items: { flex: 1, overflowY: 'auto', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' },
  item: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px',
    background: '#F8F6F2',
    borderRadius: '10px',
  },
  itemEmoji: { fontSize: '24px' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: '13px', fontWeight: '500' },
  itemPrice: { fontSize: '13px', color: '#E8621A' },
  qtyControls: { display: 'flex', alignItems: 'center', gap: '8px' },
  qtyBtn: {
    width: '24px', height: '24px',
    background: '#fff', border: '0.5px solid #EBEBEB',
    borderRadius: '6px', fontSize: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  qty: { fontSize: '13px', fontWeight: '500', minWidth: '16px', textAlign: 'center' },
  removeBtn: { background: 'none', border: 'none', color: '#888780', fontSize: '12px' },
  footer: {
    padding: '1.25rem 1.5rem',
    borderTop: '0.5px solid #EBEBEB',
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888780' },
  grandTotal: { fontWeight: '500', color: '#1A1A1A', fontSize: '15px', marginTop: '4px', paddingTop: '8px', borderTop: '0.5px solid #EBEBEB' },
  grandTotalVal: { color: '#E8621A', fontWeight: '600' },
  checkoutBtn: {
    background: '#E8621A', color: '#fff',
    border: 'none', borderRadius: '10px',
    padding: '12px', fontSize: '14px', fontWeight: '500',
    marginTop: '8px',
  },
  clearBtn: {
    background: 'transparent', border: 'none',
    color: '#888780', fontSize: '12px', padding: '4px',
  },
};

export default Cart;