# 🍕 Foody — Food Ordering System

Full-stack food ordering app built with React.js + Node.js + MongoDB + PayHere Sandbox.

---

## 🛠 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js / Express
- **Database**: MongoDB
- **Payment**: PayHere Sandbox
- **Auth**: JWT

---

## 🚀 Installation

### 1. Clone the repo
git clone https://github.com/nesrrine/food-ordering-system
cd food-ordering-system

### 2. Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your values
node seed.js
npm start

### 3. Frontend setup
cd ../frontend
npm install
npm start

---

## 👤 Test Accounts

| Role     | Email                | Password |
|----------|----------------------|----------|
| Admin    | admin@foody.com      | 123456   |
| Customer | customer@foody.com   | 123456   |

---

## 💳 PayHere Test Card

| Field  | Value            |
|--------|------------------|
| Card   | 4916217501611292 |
| Expiry | 12/29            |
| CVV    | 100              |
| Name   | Test User        |

---

## ✨ Features

### Customer
- Register / Login
- Browse food items by category
- Add to cart
- Checkout with PayHere Sandbox
- View order confirmation
- Track orders

### Admin
- View all orders
- Update order status
- Manage food items
- View customer details
- View payment status