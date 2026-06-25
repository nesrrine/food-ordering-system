// src/pages/Admin/Orders.js
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/api';

const STATUSES = ['pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending:          { bg: '#FDF0E8', color: '#E8621A' },
  processing:       { bg: '#E6F1FB', color: '#185FA5' },
  out_for_delivery: { bg: '#FAEEDA', color: '#854F0B' },
  delivered:        { bg: '#EAF3DE', color: '#3B6D11' },
  cancelled:        { bg: '#FCEBEB', color: '#A32D2D' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => { fetchOrders(); }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllOrders({ status: filter || undefined });
      setOrders(res.data.orders);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await adminAPI.updateOrderStatus(orderId, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) { console.error(err); }
    finally { setUpdating(null); }
  };

  return (
    <AdminLayout title="Orders">
      {/* Filter */}
      <div style={styles.filterBar}>
        <button style={{ ...styles.filterBtn, ...(filter === '' ? styles.filterActive : {}) }} onClick={() => setFilter('')}>All</button>
        {STATUSES.map(s => (
          <button
            key={s}
            style={{ ...styles.filterBtn, ...(filter === s ? styles.filterActive : {}) }}
            onClick={() => setFilter(s)}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={styles.card}>
        {loading ? (
          <div style={{ padding: '2rem', color: '#888780', textAlign: 'center' }}>Loading...</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Update Status'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                return (
                  <tr key={order._id}>
                    <td style={styles.td}><span style={styles.orderId}>#{order.orderId}</span></td>
                    <td style={styles.td}>
                      <div style={{ fontSize: '13px' }}>{order.customerId?.fullName}</div>
                      <div style={{ fontSize: '11px', color: '#888780' }}>{order.customerId?.email}</div>
                    </td>
                    <td style={styles.td}>{order.items?.length} items</td>
                    <td style={styles.td}><span style={{ color: '#E8621A', fontWeight: '500' }}>${order.totalAmount?.toFixed(2)}</span></td>
                    <td style={styles.td}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', background: order.paymentStatus === 'paid' ? '#EAF3DE' : '#FDF0E8', color: order.paymentStatus === 'paid' ? '#3B6D11' : '#E8621A' }}>
                        {order.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: s.bg, color: s.color }}>{order.status}</span>
                    </td>
                    <td style={styles.td}>
                      <select
                        style={styles.select}
                        value={order.status}
                        disabled={updating === order._id}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

const styles = {
  filterBar: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' },
  filterBtn: { padding: '6px 14px', borderRadius: '20px', fontSize: '12px', border: '0.5px solid #EBEBEB', background: '#fff', color: '#888780', cursor: 'pointer' },
  filterActive: { background: '#FDF0E8', borderColor: '#F5A06A', color: '#E8621A', fontWeight: '500' },
  card: { background: '#fff', border: '0.5px solid #EBEBEB', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { textAlign: 'left', padding: '10px 14px', color: '#888780', borderBottom: '0.5px solid #EBEBEB', fontWeight: '400', whiteSpace: 'nowrap' },
  td: { padding: '12px 14px', borderBottom: '0.5px solid #EBEBEB', color: '#1A1A1A' },
  orderId: { fontWeight: '500', color: '#E8621A' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '11px' },
  select: { border: '0.5px solid #EBEBEB', borderRadius: '6px', padding: '5px 8px', fontSize: '12px', background: '#fff', color: '#1A1A1A', outline: 'none' },
};

export default Orders;