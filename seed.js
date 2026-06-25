// seed.js
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Food = require('./models/Food');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB...');

  await User.deleteMany({});
  await Food.deleteMany({});

  // ✅ Password en clair — le modèle User va le hasher automatiquement
  await User.create({
    fullName: 'Admin Foody',
    email: 'admin@foody.com',
    password: '123456',
    phone: '0123456789',
    role: 'admin'
  });

  await User.create({
    fullName: 'Customer Test',
    email: 'customer@foody.com',
    password: '123456',
    phone: '0123456789',
    role: 'customer'
  });

  await Food.insertMany([
    { name: 'Pizza Margherita', description: 'Tomate, mozzarella, basilic', category: 'pizza', price: 12.99, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400', stock: 50, preparationTime: 20 },
    { name: 'Pizza Pepperoni', description: 'Tomate, mozzarella, pepperoni', category: 'pizza', price: 14.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', stock: 50, preparationTime: 20 },
    { name: 'Burger Classic', description: 'Bœuf, salade, tomate, fromage', category: 'burger', price: 9.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', stock: 50, preparationTime: 15 },
    { name: 'Burger BBQ', description: 'Bœuf, sauce BBQ, oignons caramélisés', category: 'burger', price: 11.99, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', stock: 50, preparationTime: 15 },
    { name: 'Chocolate Cake', description: 'Gâteau au chocolat fondant', category: 'cake', price: 6.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', stock: 30, preparationTime: 5 },
    { name: 'Cheesecake', description: 'Cheesecake vanille et fruits rouges', category: 'cake', price: 7.99, image: 'https://images.unsplash.com/photo-1567327613485-fbc7bf196198?w=400', stock: 30, preparationTime: 5 },
    { name: 'Coca Cola', description: 'Boisson gazeuse 33cl', category: 'drink', price: 2.99, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', stock: 100, preparationTime: 1 },
    { name: 'Jus Orange', description: 'Jus d\'orange frais pressé', category: 'drink', price: 3.99, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', stock: 100, preparationTime: 5 },
    { name: 'Caesar Salad', description: 'Salade romaine, parmesan, croutons', category: 'salad', price: 8.99, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', stock: 40, preparationTime: 10 },
    { name: 'Club Sandwich', description: 'Poulet, bacon, tomate, laitue', category: 'sandwich', price: 8.49, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', stock: 40, preparationTime: 10 },
  ]);

  console.log('✅ Admin created    → admin@foody.com / 123456');
  console.log('✅ Customer created → customer@foody.com / 123456');
  console.log('✅ 10 food items created');
  console.log('\n🎉 Seed complete!');

  mongoose.disconnect();
}

seed().catch(console.error);