import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/api';

const STATUS_BADGE = {
  pending: { bg: '#FDF0E8', color: '#E8621A' },
  processing: { bg: '#E6F1FB', color: '#185FA5' },
  out_for_delivery: { bg: '#FAEEDA', color: '#854F0B' },
  delivered: { bg: '#EAF3DE', color: '#3B6D11' },
  cancelled: { bg: '#FCEBEB', color: '#A32D2D' },
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboardStats()
      .then(res => {
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div style={{ color: '#888780' }}>Loading...</div>
      ) : (
        <>
          {/* STATS */}
          <div style={styles.statsGrid}>
            <StatCard label="Total Orders" value={stats?.totalOrders} icon="📦" />
            <StatCard label="Revenue" value={`$${stats?.totalRevenue}`} icon="💰" highlight />
            <StatCard label="Customers" value={stats?.totalUsers} icon="👥" />
            <StatCard label="Food Items" value={stats?.totalFoods} icon="🍕" />
          </div>

          {/* RECENT ORDERS */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Recent Orders</h2>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Order ID', 'Customer', 'Total', 'Payment', 'Status'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map(order => {
                    const s = STATUS_BADGE[order.status] || STATUS_BADGE.pending;

                    return (
                      <tr key={order._id}>
                        <td style={styles.td}>#{order.orderId}</td>
                        <td style={styles.td}>
                          {order.customerId?.fullName || 'N/A'}
                        </td>
                        <td style={styles.td}>
                          ${order.totalAmount?.toFixed(2)}
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            background: order.paymentStatus === 'paid'
                              ? '#EAF3DE'
                              : '#FDF0E8',
                            color: order.paymentStatus === 'paid'
                              ? '#3B6D11'
                              : '#E8621A'
                          }}>
                            {order.paymentStatus || 'pending'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            background: s.bg,
                            color: s.color
                          }}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

// ================= UI COMPONENT =================
const StatCard = ({ label, value, icon, highlight }) => (
  <div style={styles.statCard}>
    <div style={styles.statIcon}>{icon}</div>
    <div style={styles.statLabel}>{label}</div>
    <div style={{
      ...styles.statVal,
      ...(highlight ? { color: '#E8621A' } : {})
    }}>
      {value}
    </div>
  </div>
);

const styles = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '1.5rem'
  },
  statCard: {
    background: '#fff',
    border: '0.5px solid #EBEBEB',
    borderRadius: '12px',
    padding: '1.25rem'
  },
  statIcon: { fontSize: '24px', marginBottom: '8px' },
  statLabel: { fontSize: '12px', color: '#888780', marginBottom: '4px' },
  statVal: { fontSize: '24px', fontWeight: '600', color: '#1A1A1A' },

  section: {
    background: '#fff',
    border: '0.5px solid #EBEBEB',
    borderRadius: '12px',
    padding: '1.25rem'
  },

  sectionTitle: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '1rem'
  },

  tableWrap: { overflowX: 'auto' },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px'
  },

  th: {
    textAlign: 'left',
    padding: '8px 12px',
    color: '#888780',
    borderBottom: '0.5px solid #EBEBEB',
    fontWeight: '400'
  },

  td: {
    padding: '10px 12px',
    borderBottom: '0.5px solid #EBEBEB',
    color: '#1A1A1A'
  },

  badge: {
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px'
  },
};

export default Dashboard;