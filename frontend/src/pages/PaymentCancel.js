import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <h2>Payment cancelled</h2>
      <p>Your payment was cancelled. No order was created.</p>
      <button onClick={() => navigate('/checkout')}>Retour Checkout</button>
    </div>
  );
};

export default PaymentCancel;

