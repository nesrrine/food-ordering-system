// src/pages/PaymentSuccess.js
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { paymentsAPI } from '../services/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'pending' | 'failed'

  // PayHere ajoute ?order_id=PAY-xxx dans la return_url
  const paymentId = searchParams.get('order_id');

  useEffect(() => {
    if (!paymentId) {
      setStatus('failed');
      return;
    }

    // Vérifier le statut réel côté serveur
    paymentsAPI.verifyPayment(paymentId)
      .then(res => {
        const s = res.data.payment?.status;
        if (s === 'success') setStatus('success');
        else if (s === 'pending') setStatus('pending');
        else setStatus('failed');
      })
      .catch(() => setStatus('pending')); // pending par défaut si callback pas encore reçu
  }, [paymentId]);

  const content = {
    verifying: {
      icon: '⏳',
      title: 'Verifying payment...',
      sub: 'Please wait a moment.',
      color: '#888780',
      bg: '#F8F6F2',
    },
    success: {
      icon: '✓',
      title: 'Payment successful!',
      sub: 'Your order is being prepared 🍕',
      color: '#3B6D11',
      bg: '#EAF3DE',
    },
    pending: {
      icon: '⏳',
      title: 'Payment pending',
      sub: 'We\'ll confirm your order shortly.',
      color: '#854F0B',
      bg: '#FAEEDA',
    },
    failed: {
      icon: '✗',
      title: 'Payment failed',
      sub: 'Please try again.',
      color: '#A32D2D',
      bg: '#FCEBEB',
    },
  };

  const c = content[status];

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F2' }}>
      <Navbar />
      <div style={{ maxWidth: '420px', margin: '3rem auto', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{
          background: '#fff',
          border: '0.5px solid #EBEBEB',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            width: '64px', height: '64px',
            background: c.bg, color: c.color,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
            fontSize: '26px', fontWeight: '600',
          }}>
            {c.icon}
          </div>

          <h1 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '6px' }}>{c.title}</h1>
          <p style={{ color: '#888780', fontSize: '14px', marginBottom: '1.5rem' }}>{c.sub}</p>

          {paymentId && (
            <p style={{ fontSize: '12px', color: '#BBBBBB', marginBottom: '1.5rem' }}>
              Ref: {paymentId}
            </p>
          )}

          <button
            style={{
              width: '100%', background: '#E8621A', color: '#fff',
              border: 'none', borderRadius: '10px',
              padding: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
              marginBottom: '8px',
            }}
            onClick={() => navigate('/orders')}
          >
            My Orders
          </button>
          <button
            style={{
              background: 'transparent', border: 'none',
              color: '#888780', fontSize: '13px', cursor: 'pointer', width: '100%',
            }}
            onClick={() => navigate('/')}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;