// src/pages/Checkout.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { ordersAPI, paymentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext.js';

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const paymentFormRef = useRef();

  const [form, setForm] = useState({
    street: '',
    city: '',
    postalCode: '',
    phone: user?.phone || '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentParams, setPaymentParams] = useState(null);

  const subtotal = total;
  const tax = subtotal * 0.08;
  const delivery = 5.49;
  const grandTotal = subtotal + tax + delivery;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

 const handlePlaceOrder = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    console.log('STEP 1 - items:', items);
    const orderRes = await ordersAPI.createOrder({
      items: items.map(i => ({ foodId: i._id, quantity: i.quantity })),
      deliveryAddress: { street: form.street, city: form.city, postalCode: form.postalCode },
      customerPhone: form.phone,
      specialInstructions: form.notes,
    });
    console.log('STEP 1 OK:', orderRes.data);

    const orderId = orderRes.data.orderId;
    console.log('STEP 2 - orderId:', orderId);
    const payRes = await paymentsAPI.initializePayment({ orderId });
    console.log('STEP 2 OK:', payRes.data);

    setPaymentParams(payRes.data.paymentParams);
    clearCart();
    setTimeout(() => { if (paymentFormRef.current) paymentFormRef.current.submit(); }, 300);

  } catch (err) {
    console.log('ERROR status:', err.response?.status);
    console.log('ERROR data:', err.response?.data);
    console.log('ERROR message:', err.message);
    setError(err.response?.data?.message || err.message || 'Failed to place order');
    setLoading(false);
  }
};

  if (items.length === 0 && !paymentParams) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🛒</div>
          <p style={styles.emptyText}>Your cart is empty</p>
          <button style={styles.backBtn} onClick={() => navigate('/')}>Browse Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />

      {/* Hidden PayHere form — soumis automatiquement vers sandbox */}
      {paymentParams && (
        <form
          ref={paymentFormRef}
          method="post"
          action="https://sandbox.payhere.lk/pay/checkout"
          style={{ display: 'none' }}
        >
          {Object.entries(paymentParams).map(([key, val]) => (
            <input key={key} type="hidden" name={key} value={val} />
          ))}
        </form>
      )}

      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Checkout</h1>

        <div style={styles.layout}>
          {/* Left — Form */}
          <div style={styles.left}>
            <form onSubmit={handlePlaceOrder}>
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Delivery Address</h2>
                <div style={styles.fieldGrid}>
                  <div style={styles.field}>
                    <label style={styles.label}>Street address</label>
                    <input name="street" value={form.street} onChange={handleChange} required placeholder="Rue de la Paix" style={styles.input} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>City</label>
                    <input name="city" value={form.city} onChange={handleChange} required placeholder="Tunis" style={styles.input} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Postal code</label>
                    <input name="postalCode" value={form.postalCode} onChange={handleChange} required placeholder="1000" style={styles.input} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+216 XX XXX XXX" style={styles.input} />
                  </div>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Special instructions (optional)</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="No onions, extra sauce..." rows={3} style={{ ...styles.input, resize: 'vertical' }} />
                </div>
              </div>

              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Payment</h2>
                <div style={styles.payMethod}>
                  <span style={styles.payIcon}>💳</span>
                  <div>
                    <div style={styles.payName}>PayHere Sandbox</div>
                    <div style={styles.paySub}>Secure payment gateway</div>
                  </div>
                  <span style={styles.payCheck}>✓</span>
                </div>
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Processing...' : `Pay $${grandTotal.toFixed(2)} →`}
              </button>
            </form>
          </div>

          {/* Right — Summary */}
          <div style={styles.right}>
            <div style={styles.summaryCard}>
              <h2 style={styles.sectionTitle}>Order Summary</h2>
              <div style={styles.orderItems}>
                {items.map(item => (
                  <div key={item._id} style={styles.orderItem}>
                    <span style={styles.orderItemEmoji}>{item.emoji || '🍽️'}</span>
                    <span style={styles.orderItemName}>{item.name} × {item.quantity}</span>
                    <span style={styles.orderItemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={styles.divider} />
              <div style={styles.summaryRow}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div style={styles.summaryRow}><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div style={styles.summaryRow}><span>Delivery</span><span>${delivery.toFixed(2)}</span></div>
              <div style={styles.divider} />
              <div style={styles.totalRow}><span>Total</span><span style={styles.totalVal}>${grandTotal.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#F8F6F2' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '1.5rem' },
  pageTitle: { fontSize: '22px', fontWeight: '500', marginBottom: '1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' },
  left: {},
  section: { background: '#fff', border: '0.5px solid #EBEBEB', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' },
  sectionTitle: { fontSize: '16px', fontWeight: '500', marginBottom: '1rem' },
  fieldGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '12px', color: '#888780', fontWeight: '500' },
  input: {
    border: '0.5px solid #EBEBEB', borderRadius: '8px',
    padding: '9px 12px', fontSize: '13px',
    outline: 'none', background: '#fff', color: '#1A1A1A',
    width: '100%',
  },
  payMethod: {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: '#FDF0E8', border: '0.5px solid #F5A06A',
    borderRadius: '10px', padding: '12px',
  },
  payIcon: { fontSize: '24px' },
  payName: { fontSize: '14px', fontWeight: '500' },
  paySub: { fontSize: '12px', color: '#888780' },
  payCheck: { marginLeft: 'auto', color: '#E8621A', fontWeight: '600' },
  error: {
    background: '#FCEBEB', color: '#A32D2D',
    border: '0.5px solid #F09595',
    borderRadius: '8px', padding: '10px 14px',
    fontSize: '13px', marginBottom: '1rem',
  },
  submitBtn: {
    width: '100%', background: '#E8621A', color: '#fff',
    border: 'none', borderRadius: '10px',
    padding: '14px', fontSize: '15px', fontWeight: '500',
    cursor: 'pointer',
  },
  summaryCard: { background: '#fff', border: '0.5px solid #EBEBEB', borderRadius: '12px', padding: '1.25rem', position: 'sticky', top: '80px' },
  orderItems: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' },
  orderItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' },
  orderItemEmoji: { fontSize: '18px' },
  orderItemName: { flex: 1, color: '#1A1A1A' },
  orderItemPrice: { color: '#E8621A', fontWeight: '500' },
  divider: { borderTop: '0.5px solid #EBEBEB', margin: '10px 0' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888780', padding: '3px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '500' },
  totalVal: { color: '#E8621A' },
  empty: { textAlign: 'center', padding: '4rem 0' },
  emptyIcon: { fontSize: '48px', marginBottom: '1rem' },
  emptyText: { color: '#888780', marginBottom: '1rem' },
  backBtn: { background: '#E8621A', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', cursor: 'pointer' },
};

export default Checkout;