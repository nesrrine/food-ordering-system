// src/pages/Admin/Foods.js
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/api';
import { foodsAPI } from '../../services/api';

const EMPTY_FORM = { name: '', description: '', category: 'pizza', price: '', stock: '', preparationTime: 20, image: '', isAvailable: true };
const CATEGORIES = ['pizza', 'burger', 'cake', 'salad', 'sandwich', 'drink', 'sushi', 'pasta'];
const EMOJI_MAP = { pizza: '🍕', burger: '🍔', cake: '🎂', salad: '🥗', sandwich: '🥪', drink: '🥤', sushi: '🍱', pasta: '🍝' };

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchFoods(); }, []);

const fetchFoods = async () => {
  setLoading(true);
  try {
    const res = await foodsAPI.getAll(); // ✅ FIX HERE
    setFoods(res.data.foods);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (food) => {
    setEditing(food._id);
    setForm({ name: food.name, description: food.description, category: food.category, price: food.price, stock: food.stock, preparationTime: food.preparationTime, image: food.image || '', isAvailable: food.isAvailable });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    try {
      await adminAPI.deleteFood(id);
      setFoods(prev => prev.filter(f => f._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const res = await adminAPI.updateFood(editing, { ...form, price: Number(form.price), stock: Number(form.stock) });
        setFoods(prev => prev.map(f => f._id === editing ? res.data.food : f));
      } else {
        const res = await adminAPI.createFood({ ...form, price: Number(form.price), stock: Number(form.stock) });
        setFoods(prev => [res.data.food, ...prev]);
      }
      setShowModal(false);
      setEditing(null);
      setForm(EMPTY_FORM);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <AdminLayout title="Food Management">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button style={styles.addBtn} onClick={() => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); }}>
          + Add Food
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#888780' }}>Loading...</div>
      ) : (
        <div style={styles.grid}>
          {foods.map(food => (
            <div key={food._id} style={styles.card}>
              <div style={styles.cardImg}>{EMOJI_MAP[food.category] || '🍽️'}</div>
              <div style={styles.cardBody}>
                <div style={styles.cardName}>{food.name}</div>
                <div style={styles.cardCat}>{food.category}</div>
                <div style={styles.cardDesc}>{food.description?.substring(0, 60)}...</div>
                <div style={styles.cardFooter}>
                  <span style={styles.cardPrice}>${food.price?.toFixed(2)}</span>
                  <span style={{ fontSize: '11px', color: '#888780' }}>Stock: {food.stock}</span>
                </div>
                <div style={styles.cardActions}>
                  <button style={styles.editBtn} onClick={() => handleEdit(food)}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(food._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <>
          <div style={styles.overlay} onClick={() => setShowModal(false)} />
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editing ? 'Edit Food' : 'Add Food'}</h2>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <Field label="Name"><input style={styles.input} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Pizza Margherita" /></Field>
              <Field label="Description"><textarea style={{ ...styles.input, resize: 'vertical' }} rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Describe the dish..." /></Field>
              <div style={styles.row}>
                <Field label="Category">
                  <select style={styles.input} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Price ($)"><input style={styles.input} type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required placeholder="12.99" /></Field>
              </div>
              <div style={styles.row}>
                <Field label="Stock"><input style={styles.input} type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required placeholder="50" /></Field>
                <Field label="Prep time (min)"><input style={styles.input} type="number" min="1" value={form.preparationTime} onChange={e => setForm({...form, preparationTime: e.target.value})} /></Field>
              </div>
              <Field label="Image URL (optional)"><input style={styles.input} value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://..." /></Field>
              <label style={styles.checkLabel}>
                <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({...form, isAvailable: e.target.checked})} />
                Available for order
              </label>
              <button type="submit" style={styles.submitBtn} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Food'}
              </button>
            </form>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
    <label style={{ fontSize: '12px', color: '#888780' }}>{label}</label>
    {children}
  </div>
);

const styles = {
  addBtn: { background: '#E8621A', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' },
  card: { background: '#fff', border: '0.5px solid #EBEBEB', borderRadius: '12px', overflow: 'hidden' },
  cardImg: { height: '90px', background: '#FDF0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' },
  cardBody: { padding: '10px 12px' },
  cardName: { fontSize: '14px', fontWeight: '500', marginBottom: '2px' },
  cardCat: { fontSize: '11px', color: '#888780', marginBottom: '4px' },
  cardDesc: { fontSize: '12px', color: '#888780', marginBottom: '8px', lineHeight: '1.4' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  cardPrice: { fontSize: '14px', fontWeight: '600', color: '#E8621A' },
  cardActions: { display: 'flex', gap: '6px' },
  editBtn: { flex: 1, background: '#FDF0E8', color: '#E8621A', border: 'none', borderRadius: '6px', padding: '5px', fontSize: '12px', cursor: 'pointer' },
  deleteBtn: { flex: 1, background: '#FCEBEB', color: '#A32D2D', border: 'none', borderRadius: '6px', padding: '5px', fontSize: '12px', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200 },
  modal: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', border: '0.5px solid #EBEBEB', borderRadius: '16px', padding: '1.5rem', width: '480px', maxWidth: '95vw', zIndex: 201, maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  modalTitle: { fontSize: '18px', fontWeight: '500' },
  closeBtn: { background: 'none', border: 'none', fontSize: '16px', color: '#888780', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  row: { display: 'flex', gap: '10px' },
  input: { border: '0.5px solid #EBEBEB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', outline: 'none', background: '#fff', color: '#1A1A1A', width: '100%' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#888780' },
  submitBtn: { background: '#E8621A', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '4px' },
};

export default Foods;