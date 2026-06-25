// src/pages/PaymentSuccess.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { paymentsAPI } from '../services/api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('order_id');

  useEffect(() => {
    if (paymentId) {
      setTimeout(() => navigate(`/orders`), 3000);
    }
  }, [paymentId, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F2' }}>
      <Navbar />
      <div style={{ maxWidth: '420px', margin: '4rem auto', padding: '1.5rem' }}>
        <div style={cardStyle}>
          <div style={iconStyle('#EAF3DE', '#3B6D11')}>✓</div>
          <h1 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px' }}>Payment Successful!</h1>
          <p style={{ color: '#888780', fontSize: '14px', marginBottom: '1.5rem' }}>
            Your order has been placed and is being prepared 🍕
          </p>
          <p style={{ color: '#888780', fontSize: '12px', marginBottom: '1.5rem' }}>
            Redirecting to your orders...
          </p>
          <button style={btnStyle} onClick={() => navigate('/orders')}>View My Orders</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

// ─────────────────────────────────────────────

// src/pages/PaymentCancel.js — inline export below
export const PaymentCancel = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F2' }}>
      <Navbar />
      <div style={{ maxWidth: '420px', margin: '4rem auto', padding: '1.5rem' }}>
        <div style={cardStyle}>
          <div style={iconStyle('#FCEBEB', '#A32D2D')}>✕</div>
          <h1 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px' }}>Payment Cancelled</h1>
          <p style={{ color: '#888780', fontSize: '14px', marginBottom: '1.5rem' }}>
            Your payment was cancelled. Your order is still saved.
          </p>
          <button style={btnStyle} onClick={() => navigate('/')}>Back to Menu</button>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  background: '#fff',
  border: '0.5px solid #EBEBEB',
  borderRadius: '16px',
  padding: '2rem',
  textAlign: 'center',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
};

const iconStyle = (bg, color) => ({
  width: '60px', height: '60px',
  background: bg, color: color,
  borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  margin: '0 auto 1.25rem',
  fontSize: '24px', fontWeight: '600',
});

const btnStyle = {
  background: '#E8621A', color: '#fff',
  border: 'none', borderRadius: '10px',
  padding: '12px 24px', fontSize: '14px', fontWeight: '500',
  cursor: 'pointer', width: '100%',
};