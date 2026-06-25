// src/pages/MyOrders.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { ordersAPI} from '../services/api';

const STATUS_STYLES = {
  pending:          { bg: '#FDF0E8', color: '#E8621A', label: '⏳ Pending' },
  processing:       { bg: '#E6F1FB', color: '#185FA5', label: '🔄 Processing' },
  out_for_delivery: { bg: '#FAEEDA', color: '#854F0B', label: '🚚 On the way' },
  delivered:        { bg: '#EAF3DE', color: '#3B6D11', label: '✅ Delivered' },
  cancelled:        { bg: '#FCEBEB', color: '#A32D2D', label: '❌ Cancelled' },
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getMyOrders()
      .then(res => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F8F6F2' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '4rem', color: '#888780' }}>Loading orders...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F2' }}>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1.5rem' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '1.5rem' }}>My Orders</h1>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📦</div>
            <p style={{ color: '#888780' }}>No orders yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map(order => {
              const s = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
              return (
                <div key={order._id} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>Order #{order.orderId}</div>
                      <div style={{ fontSize: '12px', color: '#888780' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <span style={{ background: s.bg, color: s.color, fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}>
                      {s.label}
                    </span>
                  </div>

                  <div style={{ borderTop: '0.5px solid #EBEBEB', paddingTop: '10px', marginBottom: '10px' }}>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '2px 0', color: '#888780' }}>
                        <span>{item.name || 'Item'} × {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#888780' }}>
                      📍 {order.deliveryAddress?.city}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#E8621A' }}>
                      ${order.totalAmount?.toFixed(2)}
                    </div>
                  </div>

                  {order.paymentStatus === 'paid' && (
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#3B6D11', background: '#EAF3DE', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
                      ✓ Paid
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const cardStyle = {
  background: '#fff',
  border: '0.5px solid #EBEBEB',
  borderRadius: '12px',
  padding: '1.25rem',
};

export default MyOrders;