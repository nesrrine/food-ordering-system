// src/pages/Admin/Users.js
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

const fetchUsers = async () => {
  try {
    const res = await adminAPI.getUsers(); // ✅ FIX
    setUsers(res.data.users);
  } catch (err) {
    console.error(err);
  }
};
  const toggleActive = async (user) => {
    try {
      await adminAPI.updateUser(user._id, { isActive: !user.isActive });
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: !u.isActive } : u));
    } catch (err) { console.error(err); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  return (
    <AdminLayout title="Users">
      <form onSubmit={handleSearch} style={styles.searchBar}>
        <input
          style={styles.searchInput}
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" style={styles.searchBtn}>Search</button>
      </form>

      <div style={styles.card}>
        {loading ? (
          <div style={{ padding: '2rem', color: '#888780', textAlign: 'center' }}>Loading...</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {['User', 'Phone', 'Role', 'Joined', 'Status', 'Action'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td style={styles.td}>
                    <div style={styles.userCell}>
                      <div style={styles.avatar}>{user.fullName?.[0]?.toUpperCase()}</div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '500' }}>{user.fullName}</div>
                        <div style={{ fontSize: '11px', color: '#888780' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>{user.phone}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: user.role === 'admin' ? '#E6F1FB' : '#F8F6F2', color: user.role === 'admin' ? '#185FA5' : '#888780' }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: user.isActive ? '#EAF3DE' : '#FCEBEB', color: user.isActive ? '#3B6D11' : '#A32D2D' }}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.actionBtn, background: user.isActive ? '#FCEBEB' : '#EAF3DE', color: user.isActive ? '#A32D2D' : '#3B6D11' }}
                      onClick={() => toggleActive(user)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

const styles = {
  searchBar: { display: 'flex', gap: '8px', marginBottom: '1rem' },
  searchInput: { flex: 1, border: '0.5px solid #EBEBEB', borderRadius: '8px', padding: '9px 14px', fontSize: '13px', outline: 'none', background: '#fff' },
  searchBtn: { background: '#E8621A', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '13px', cursor: 'pointer' },
  card: { background: '#fff', border: '0.5px solid #EBEBEB', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { textAlign: 'left', padding: '10px 14px', color: '#888780', borderBottom: '0.5px solid #EBEBEB', fontWeight: '400' },
  td: { padding: '12px 14px', borderBottom: '0.5px solid #EBEBEB', color: '#1A1A1A' },
  userCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '32px', height: '32px', background: '#FDF0E8', color: '#E8621A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '11px' },
  actionBtn: { border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' },
};

export default Users;