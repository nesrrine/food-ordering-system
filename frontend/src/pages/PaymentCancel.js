// src/pages/PaymentCancel.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PaymentCancel = () => {
  const navigate = useNavigate();

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
            background: '#FAEEDA', color: '#854F0B',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
            fontSize: '26px',
          }}>
            ✕
          </div>

          <h1 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '6px' }}>Payment cancelled</h1>
          <p style={{ color: '#888780', fontSize: '14px', marginBottom: '1.5rem' }}>
            Your payment was cancelled. No order was confirmed.
          </p>

          <button
            style={{
              width: '100%', background: '#E8621A', color: '#fff',
              border: 'none', borderRadius: '10px',
              padding: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
              marginBottom: '8px',
            }}
            onClick={() => navigate('/checkout')}
          >
            Try again
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

export default PaymentCancel;