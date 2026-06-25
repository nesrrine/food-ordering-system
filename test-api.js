// test-api.js
// Run: node test-api.js
const axios = require('axios');

const BASE = 'http://localhost:5000/api';
let token = '';
let adminToken = '';
let orderId = '';
let foodId = '';

const log = (label, data) => {
  console.log(`\n✅ ${label}:`);
  console.log(JSON.stringify(data, null, 2));
};

const err = (label, error) => {
  console.log(`\n❌ ${label}:`);
  console.log(error.response?.data || error.message);
};

async function runTests() {
  console.log('🚀 Starting API tests...\n');

  // 1. Register
  try {
    const res = await axios.post(`${BASE}/auth/register`, {
      fullName: 'Test User',
      email: `test${Date.now()}@test.com`,
      password: '123456',
      phone: '0123456789'
    });
    token = res.data.token;
    log('Register', { token: token.substring(0, 20) + '...', user: res.data.user });
  } catch (e) { err('Register', e); }

  // 2. Login
  try {
    const res = await axios.post(`${BASE}/auth/login`, {
      email: 'test1782259140327@test.com', // change to your admin email
      password: '123456'
    });
    adminToken = res.data.token;
    log('Admin Login', { role: res.data.user.role });
  } catch (e) { err('Admin Login (normal if no admin yet)', e); }

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const adminHeader = { headers: { Authorization: `Bearer ${adminToken || token}` } };

  // 3. Get Profile
  try {
    const res = await axios.get(`${BASE}/auth/profile`, authHeader);
    log('Get Profile', res.data.user);
  } catch (e) { err('Get Profile', e); }

  // 4. Create Food (admin)
  try {
    const res = await axios.post(`${BASE}/admin/foods`, {
      name: 'Pizza Test',
      description: 'Une pizza de test',
      category: 'pizza',
      price: 12.99,
      image: 'https://via.placeholder.com/300',
      stock: 50,
      preparationTime: 20
    }, adminHeader);
    foodId = res.data.food._id;
    log('Create Food', { foodId, name: res.data.food.name });
  } catch (e) { err('Create Food', e); }

  // 5. Get all foods
  try {
    const res = await axios.get(`${BASE}/foods`);
    if (!foodId && res.data.foods.length > 0) foodId = res.data.foods[0]._id;
    log('Get Foods', { total: res.data.pagination?.total, first: res.data.foods[0]?.name });
  } catch (e) { err('Get Foods', e); }

  // 6. Get foods by category
  try {
    const res = await axios.get(`${BASE}/foods?category=pizza`);
    log('Get Foods by Category', { count: res.data.foods.length });
  } catch (e) { err('Get Foods by Category', e); }

  // 7. Create Order
  if (foodId) {
    try {
      const res = await axios.post(`${BASE}/orders`, {
        items: [{ foodId, quantity: 2 }],
        deliveryAddress: { street: 'Rue Test', city: 'Tunis', postalCode: '1000' },
        customerPhone: '0123456789',
        specialInstructions: 'Test order'
      }, authHeader);
      orderId = res.data.orderId;
      log('Create Order', { orderId, total: res.data.order.totalAmount });
    } catch (e) { err('Create Order', e); }
  }

  // 8. Get my orders
  try {
    const res = await axios.get(`${BASE}/orders`, authHeader);
    log('Get My Orders', { count: res.data.orders.length });
  } catch (e) { err('Get My Orders', e); }

  // 9. Initialize Payment
  if (orderId) {
    try {
      const res = await axios.post(`${BASE}/payments/initialize`, { orderId }, authHeader);
      log('Initialize Payment', { hasHash: !!res.data.paymentParams.hash });
    } catch (e) { err('Initialize Payment', e); }
  }

  // 10. Admin Dashboard
  try {
    const res = await axios.get(`${BASE}/admin/dashboard`, adminHeader);
    log('Admin Dashboard', res.data.stats);
  } catch (e) { err('Admin Dashboard', e); }

  // 11. Admin - Get all orders
  try {
    const res = await axios.get(`${BASE}/admin/orders`, adminHeader);
    log('Admin Get Orders', { total: res.data.pagination?.total });
  } catch (e) { err('Admin Get Orders', e); }

  // 12. Admin - Update order status
  if (orderId) {
    try {
      const res = await axios.put(`${BASE}/admin/orders/${orderId}/status`, {
        status: 'processing',
        notes: 'Test status update'
      }, adminHeader);
      log('Update Order Status', { newStatus: res.data.order.status });
    } catch (e) { err('Update Order Status', e); }
  }

  // 13. Admin - Get all users
  try {
    const res = await axios.get(`${BASE}/admin/users`, adminHeader);
    log('Admin Get Users', { total: res.data.pagination?.total });
  } catch (e) { err('Admin Get Users', e); }

  console.log('\n\n🏁 Tests finished!');
}

runTests();