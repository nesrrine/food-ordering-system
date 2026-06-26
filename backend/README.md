# Food Ordering System - Implementation Roadmap

## 📅 Complete Development Timeline

This roadmap assumes you have 4-6 weeks to complete the project. Adjust based on your schedule.

---

## 🔷 Week 1: Project Setup & Authentication

### Day 1-2: Backend Setup
**Objectives:**
- [ ] Initialize Node.js/Express project
- [ ] Install required dependencies
- [ ] Set up MongoDB/MySQL database connection
- [ ] Configure environment variables
- [ ] Create project folder structure

**Tasks:**
```bash
# Initialize backend
mkdir food-ordering-system
cd food-ordering-system
mkdir backend frontend
cd backend
npm init -y
npm install express cors dotenv mongoose bcryptjs jsonwebtoken axios
npm install -D nodemon
```

**Create server.js and test it runs on localhost:5000**

### Day 3: User Model & Database Setup
**Objectives:**
- [ ] Create User model with schema validation
- [ ] Set up database connection
- [ ] Test database connectivity
- [ ] Create User collection/table

**Tasks:**
1. Create `models/User.js` with full schema
2. Create `config/database.js` for MongoDB/MySQL connection
3. Test connection with simple query
4. Create indexes on email field

### Day 4-5: Authentication Routes
**Objectives:**
- [ ] Create register endpoint
- [ ] Create login endpoint
- [ ] Implement password hashing
- [ ] Generate JWT tokens
- [ ] Test with Postman

**Tasks:**
1. Create `controllers/authController.js`
2. Create `routes/auth.js`
3. Create `middleware/auth.js`
4. Test registration with various inputs
5. Test login with valid/invalid credentials
6. Test JWT token generation

### Day 6-7: React Setup & Auth Frontend
**Objectives:**
- [ ] Initialize React project
- [ ] Install dependencies
- [ ] Create Auth page component
- [ ] Implement login/register UI
- [ ] Set up API service with Axios

**Tasks:**
```bash
# Initialize frontend
cd ../frontend
npx create-react-app .
npm install react-router-dom axios
```

**Create:**
1. `pages/Auth.js` - Login/Register page
2. `services/api.js` - Axios configuration
3. `context/AuthContext.js` - Auth state management
4. Basic styling with CSS/Tailwind

**Test:**
- Register new user from React
- Login with credentials
- Token stored in localStorage
- Redirect to home on successful login

---

## 🔷 Week 2: Food Management

### Day 1-2: Food Model & Routes
**Objectives:**
- [ ] Create Food model with schema
- [ ] Create GET endpoint for all foods
- [ ] Create GET endpoint for single food
- [ ] Seed sample food data
- [ ] Test endpoints with Postman

**Tasks:**
1. Create `models/Food.js` with complete schema
2. Create `controllers/foodController.js` with getAll and getById
3. Create `routes/foods.js`
4. Insert 10-15 sample foods into database
5. Test `/api/foods` endpoint
6. Test `/api/foods/:id` endpoint

**Sample Foods to Add:**
- Pizza Margherita - $12.00
- Chocolate Cake - $8.50
- Classic Burger - $10.00
- Veggie Sandwich - $7.99
- Caesar Salad - $9.50
- (Add 10+ more)

### Day 3: Browse Foods Frontend
**Objectives:**
- [ ] Create Home/Browse page
- [ ] Display foods in grid
- [ ] Implement search functionality
- [ ] Add filter by category
- [ ] Show food images

**Tasks:**
1. Create `pages/Home.js`
2. Create `components/FoodCard.js`
3. Fetch foods from API on page load
4. Display in responsive grid (3-4 columns)
5. Add search input with filtering
6. Add category filter dropdown

### Day 4: Food Details Modal
**Objectives:**
- [ ] Create food details modal/page
- [ ] Show full food information
- [ ] Display food image properly
- [ ] Add quantity selector
- [ ] Add "Add to Cart" button

**Tasks:**
1. Create `components/FoodDetailModal.js`
2. Fetch single food data by ID
3. Show expanded food information
4. Add quantity selector (−/+)
5. Connect Add to Cart button

### Day 5-7: Admin Food Management
**Objectives:**
- [ ] Create admin-only food routes
- [ ] Create admin add food form
- [ ] Create admin edit food form
- [ ] Create admin delete food functionality
- [ ] Build admin food list page

**Tasks:**
1. Create POST `/api/admin/foods` endpoint
2. Create PATCH `/api/admin/foods/:id` endpoint
3. Create DELETE `/api/admin/foods/:id` endpoint
4. Add `adminAuth` middleware for protection
5. Create `pages/Admin/Foods.js`
6. Create `components/FoodForm.js`
7. Create `components/FoodList.js` (for admin)
8. Test add/edit/delete functionality

---

## 🔷 Week 3: Shopping Cart & Orders

### Day 1-2: Shopping Cart Context & UI
**Objectives:**
- [ ] Create Cart context for state management
- [ ] Create Cart page component
- [ ] Display cart items with prices
- [ ] Implement quantity controls
- [ ] Calculate and display totals

**Tasks:**
1. Create `context/CartContext.js` with add/remove/update items
2. Store cart in localStorage for persistence
3. Create `pages/Cart.js` component
4. Create `components/CartItem.js` component
5. Display:
   - Each item with image, name, price
   - Quantity controls (−/+)
   - Remove button
   - Subtotal per item
   - Cart totals (Subtotal, Tax, Delivery, Total)

### Day 3: Order Creation
**Objectives:**
- [ ] Create Order model in database
- [ ] Create order creation endpoint
- [ ] Connect checkout to order creation
- [ ] Test order creation flow

**Tasks:**
1. Create `models/Order.js` with complete schema
2. Create `controllers/orderController.js`
3. Create POST `/api/orders` endpoint
4. Generate unique order IDs
5. Calculate taxes and delivery charges
6. Test creating order via API

### Day 4: Checkout Page
**Objectives:**
- [ ] Create checkout form component
- [ ] Collect delivery address
- [ ] Collect customer phone number
- [ ] Show order summary
- [ ] Implement form validation

**Tasks:**
1. Create `pages/Checkout.js`
2. Create form fields:
   - Full Name
   - Phone Number
   - Street Address
   - City
   - Postal Code
   - Special Instructions (optional)
3. Display order summary from cart
4. Form validation with error messages
5. "Pay Now" button ready for payment integration

### Day 5-7: Admin Orders Dashboard
**Objectives:**
- [ ] Create admin orders list page
- [ ] Display all orders with details
- [ ] Implement order status updates
- [ ] Show payment status
- [ ] Create order detail view

**Tasks:**
1. Create GET `/api/admin/orders` endpoint
2. Create PATCH `/api/admin/orders/:id/status` endpoint
3. Create `pages/Admin/Orders.js`
4. Create `components/OrderTable.js`
5. Implement status update dropdown
6. Display order details modal/page
7. Show:
   - Order ID, Customer name, Total amount
   - Items ordered, Delivery address
   - Current status, Payment status
   - Order date/time

---

## 🔷 Week 4: Payment Integration

### Day 1-2: PayHere Setup
**Objectives:**
- [ ] Create PayHere Sandbox account
- [ ] Get merchant credentials
- [ ] Create Payment model
- [ ] Set up payment initialization endpoint
- [ ] Document test credentials

**Tasks:**
1. Register on PayHere Sandbox
2. Get Merchant Code and API Key
3. Store in `.env` file
4. Create `models/Payment.js`
5. Create `controllers/paymentController.js`
6. Create POST `/api/payments/initialize` endpoint

### Day 3-4: Payment Button Integration
**Objectives:**
- [ ] Add PayHere button to checkout
- [ ] Redirect to PayHere payment page
- [ ] Handle payment response

**Tasks:**
1. Install PayHere SDK in React
2. Create payment initialization function
3. Update Checkout page with PayHere button
4. Test payment initiation (redirect to sandbox)
5. Test with PayHere sandbox card credentials

### Day 5: Payment Callback & Verification
**Objectives:**
- [ ] Set up callback endpoint
- [ ] Verify payment status
- [ ] Update order payment status
- [ ] Handle success/failure scenarios

**Tasks:**
1. Create POST `/api/payments/callback` endpoint
2. Implement payment verification logic
3. Update order status when payment succeeds
4. Log payment details
5. Handle payment failures
6. Send confirmation to customer

### Day 6-7: Order Confirmation Flow
**Objectives:**
- [ ] Create order confirmation page
- [ ] Show order details after payment
- [ ] Generate invoice
- [ ] Enable order tracking
- [ ] Test complete payment flow

**Tasks:**
1. Create `pages/OrderConfirmation.js`
2. Display order confirmation details:
   - Order ID and date
   - Items ordered
   - Delivery address
   - Estimated delivery time
   - Download invoice button
3. Create `components/OrderTracker.js`
4. Test complete flow: Add items → Checkout → Payment → Confirmation

---

## 🔷 Week 5: User Features & Admin Dashboard

### Day 1-2: User Profile & Orders
**Objectives:**
- [ ] Create user profile page
- [ ] Create "My Orders" page
- [ ] Show order history
- [ ] Enable order reordering
- [ ] Add address management

**Tasks:**
1. Create `pages/Profile.js`
2. Create `pages/MyOrders.js`
3. Create GET `/api/orders` endpoint (user's orders)
4. Display all customer orders
5. Filter/sort by status and date
6. Show order details on click
7. Implement reorder functionality
8. Add profile information display
9. Add save/edit address functionality

### Day 3-5: Admin Dashboard
**Objectives:**
- [ ] Create admin dashboard overview
- [ ] Display key metrics
- [ ] Show recent orders
- [ ] Show top customers
- [ ] Display revenue analytics

**Tasks:**
1. Create `pages/Admin/Dashboard.js`
2. Calculate and display:
   - Total orders count
   - Today's revenue
   - Active orders count
   - Total customers count
3. Create `components/MetricCard.js`
4. Create `components/RecentOrders.js`
5. Create `components/TopCustomers.js`
6. Add charts for visualization (Chart.js or Recharts)

### Day 6: Admin Customers List
**Objectives:**
- [ ] Create customers list page
- [ ] Show customer details
- [ ] Display order history per customer
- [ ] Show total spent

**Tasks:**
1. Create GET `/api/admin/customers` endpoint
2. Create `pages/Admin/Customers.js`
3. Display customer table:
   - Name, email, phone
   - Total orders
   - Total spent
   - Last order date
4. Click customer to see details
5. Show customer's order history

### Day 7: Payments Tracking
**Objectives:**
- [ ] Create payment tracking page
- [ ] Show payment status
- [ ] Display transaction details
- [ ] Add payment filters

**Tasks:**
1. Create `pages/Admin/Payments.js`
2. Create GET `/api/admin/payments` endpoint
3. Display payment table:
   - Payment ID, Order ID, Amount
   - Status (Success/Failed/Pending)
   - Date/Time
4. Add status filter
5. Add revenue analytics

---

## 🔷 Week 6: Testing, Polish & Deployment

### Day 1-2: Testing & Bug Fixes
**Objectives:**
- [ ] Test all user flows
- [ ] Test all admin features
- [ ] Fix bugs
- [ ] Test on mobile devices

**Manual Test Checklist:**
- [ ] Registration and login
- [ ] Browse and search foods
- [ ] Add items to cart
- [ ] Modify cart quantities
- [ ] Checkout process
- [ ] PayHere payment (sandbox)
- [ ] Order confirmation
- [ ] View order history
- [ ] Admin login
- [ ] Admin dashboard metrics
- [ ] Admin order management
- [ ] Admin food management
- [ ] Admin customer view
- [ ] Responsive design (mobile, tablet, desktop)

### Day 3: Documentation
**Objectives:**
- [ ] Write comprehensive README
- [ ] Document API endpoints
- [ ] Document database schema
- [ ] Add setup instructions
- [ ] Create environment variables guide

**Create:**
1. `README.md` with:
   - Project overview
   - Tech stack
   - Installation steps
   - Running instructions
   - Features list
2. `API.md` with all endpoints
3. Database schema documentation
4. `.env.example` file

### Day 4-5: Deployment
**Objectives:**
- [ ] Deploy backend to cloud
- [ ] Deploy frontend to cloud
- [ ] Test deployment
- [ ] Fix deployment issues

**Backend Deployment (Choose one):**
- Heroku (Railway.app is easier now)
- Railway.app (recommended)
- Render.com
- DigitalOcean

**Frontend Deployment (Choose one):**
- Vercel
- Netlify
- GitHub Pages

**Steps:**
1. Push code to GitHub
2. Deploy backend (set environment variables)
3. Deploy frontend (update API URL)
4. Test deployed application
5. Fix any issues

### Day 6: Demo Video Recording
**Objectives:**
- [ ] Record feature walkthrough
- [ ] Show all user flows
- [ ] Show all admin features
- [ ] Demonstrate payment integration

**Demo Video Content (3-5 minutes):**
1. App overview (30 seconds)
2. Customer registration (1 minute)
3. Browse and search foods (1 minute)
4. Add to cart and checkout (1 minute)
5. PayHere payment (Sandbox) (1 minute)
6. Order confirmation (30 seconds)
7. Admin login and dashboard (1 minute)
8. Admin order management (1 minute)
9. Admin food management (1 minute)
10. Q&A about implementation (1 minute)

**Recording Tips:**
- Use screen recorder (OBS, Loom, or built-in)
- Clear audio and good lighting
- Speak clearly
- Show all features
- Save to Google Drive and get shareable link

### Day 7: Final Submission
**Objectives:**
- [ ] Complete submission form
- [ ] Add all required information
- [ ] Double-check all links
- [ ] Submit on time

**Submission Checklist:**
- [ ] GitHub repo link works
- [ ] GitHub repo has all code
- [ ] GitHub repo has README
- [ ] GitHub repo has .env.example
- [ ] Demo video link works
- [ ] Demo video is 3-5 minutes
- [ ] Demo video shows all features
- [ ] Form filled with correct details:
  - Full name
  - Email address
  - Phone number
  - GitHub link
  - Demo video link

---

## ⚠️ Common Issues & Solutions

### Authentication Issues
**Problem:** Login not working
**Solution:**
- Check JWT secret in .env
- Verify password hashing
- Test endpoint with Postman
- Check token in localStorage

**Problem:** Protected routes not redirecting
**Solution:**
- Check AuthContext setup
- Verify middleware is applied
- Test token expiration
- Check localStorage token

### Payment Issues
**Problem:** PayHere button not working
**Solution:**
- Verify merchant code and API key
- Check PayHere SDK loaded
- Test with sandbox credentials
- Check callback URL configuration
- Verify HTTPS on production

**Problem:** Payment callback not triggered
**Solution:**
- Check firewall settings
- Verify callback URL in PayHere
- Check error logs
- Test manually with cURL
- Whitelist PayHere IP addresses

### Database Issues
**Problem:** Cannot connect to database
**Solution:**
- Check database URL in .env
- Verify database is running
- Check network connectivity
- Test with MongoDB Compass (MongoDB) or MySQL Workbench
- Check user credentials

**Problem:** Query errors
**Solution:**
- Check schema definition
- Verify field names match schema
- Check data types
- Test queries in database client
- Check indexes

### Frontend Issues
**Problem:** API calls returning CORS error
**Solution:**
- Check CORS middleware in Express
- Verify CORS origin URL
- Check API base URL in .env
- Clear browser cache
- Check network tab in DevTools

**Problem:** Images not loading
**Solution:**
- Check image URLs
- Verify image paths
- Check CORS for images
- Test with placeholder images first
- Use absolute URLs for uploaded images

---

## 📋 Final Verification Checklist

Before submission, verify:

### Backend
- [ ] All routes implemented
- [ ] All controllers working
- [ ] Authentication middleware applied
- [ ] Error handling implemented
- [ ] Database connections working
- [ ] Environment variables configured
- [ ] PayHere integration working
- [ ] CORS enabled
- [ ] Code is clean and commented

### Frontend
- [ ] All pages created
- [ ] All forms working
- [ ] API calls functional
- [ ] Authentication flows correct
- [ ] Cart persistence working
- [ ] Payment integration working
- [ ] Responsive design on mobile
- [ ] No console errors
- [ ] Code is clean and commented

### Deployment
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] API URL updated in frontend
- [ ] Database accessible from server
- [ ] PayHere integration working on live
- [ ] HTTPS enabled
- [ ] No hardcoded secrets

### Documentation
- [ ] README.md complete
- [ ] Setup instructions clear
- [ ] API documentation complete
- [ ] Database schema documented
- [ ] .env.example provided
- [ ] Installation steps accurate
- [ ] Running instructions accurate

---

## 🎯 Success Criteria

Your project will be evaluated on:

1. **Functionality** (40%)
   - All required features work
   - No major bugs
   - Smooth user experience
   - Payment integration works

2. **Code Quality** (20%)
   - Clean, readable code
   - Proper folder structure
   - Comments where needed
   - No code duplication

3. **UI/UX** (20%)
   - Responsive design
   - Good user experience
   - Proper navigation
   - Clear feedback messages

4. **Documentation** (10%)
   - Clear README
   - API documentation
   - Setup instructions
   - Deployment details

5. **Completeness** (10%)
   - All required pages
   - All required roles (customer/admin)
   - All features implemented
   - Proper authentication

---

**Good luck with your project! Follow this roadmap step by step and you'll have a complete, functional food ordering system!**
