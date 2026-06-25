// src/pages/OrderConfirmation.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ordersAPI  } from '../services/api';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    ordersAPI.getOrderById(orderId)
      .then(res => setOrder(res.data.order))
      .catch(() => navigate('/orders'));
  }, [orderId, navigate]);

  if (!order) return (
    <div style={{ minHeight: '100vh', background: '#F8F6F2' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '4rem', color: '#888780' }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F2' }}>
      <Navbar />
      <div style={{ maxWidth: '420px', margin: '2rem auto', padding: '1.5rem' }}>
        <div style={cardStyle}>
          <div style={iconStyle}>✓</div>
          <h1 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '6px' }}>Order Confirmed!</h1>
          <p style={{ color: '#888780', fontSize: '14px', marginBottom: '1.5rem' }}>Your food is being prepared 🍕</p>

          <div style={detailsStyle}>
            <Row label="Order ID" value={`#${order.orderId}`} />
            <Row label="Status" value={order.status} />
            <Row label="Delivery to" value={`${order.deliveryAddress?.street}, ${order.deliveryAddress?.city}`} />
            <Row label="Est. delivery" value="30–45 min" />
            <div style={{ borderTop: '0.5px solid #EBEBEB', margin: '8px 0' }} />
            <Row label="Total" value={`$${order.totalAmount?.toFixed(2)}`} highlight />
          </div>

          <button style={btnStyle} onClick={() => navigate('/orders')}>Track Order</button>
          <button style={backStyle} onClick={() => navigate('/')}>Back to Menu</button>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, highlight }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
    <span style={{ color: '#888780' }}>{label}</span>
    <span style={{ fontWeight: highlight ? '600' : '500', color: highlight ? '#E8621A' : '#1A1A1A' }}>{value}</span>
  </div>
);

const cardStyle = { background: '#fff', border: '0.5px solid #EBEBEB', borderRadius: '16px', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' };
const iconStyle = { width: '60px', height: '60px', background: '#EAF3DE', color: '#3B6D11', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '24px', fontWeight: '600' };
const detailsStyle = { background: '#F8F6F2', borderRadius: '10px', padding: '12px 16px', textAlign: 'left', marginBottom: '1.25rem' };
const btnStyle = { background: '#E8621A', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: '100%', marginBottom: '8px' };
const backStyle = { background: 'transparent', border: 'none', color: '#888780', fontSize: '13px', cursor: 'pointer', width: '100%' };

export default OrderConfirmation;