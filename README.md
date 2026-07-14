# 🥭 Pranu Bytes — Full-Stack E-Commerce Platform

A production-style e-commerce web application built for a home-based pickles and snacks business. Includes a full customer storefront and a complete admin management dashboard.

**Live Demo:** [pranubytes-frontend.vercel.app](https://pranubytes-frontend.vercel.app)

---

## 📋 Features

### Customer-Facing
- Browse products by category with real-time search
- Multi-variant product selection (different weights/prices per product)
- Persistent shopping cart
- Saved address book with GPS-based auto-fill (Google Geocoding API)
- Coupon code application with live discount calculation
- Secure checkout with Razorpay payment integration (UPI, Card, COD)
- Order tracking with full status lifecycle (Pending → Accepted → Packing → Packed → Shipped → Out for Delivery → Delivered/Cancelled)
- Installable as a Progressive Web App (PWA)

### Admin Dashboard
- Real-time analytics: total orders, revenue, customers, today's sales, order status breakdown
- Low stock alerts
- Full CRUD for products (with image upload and multiple weight/price variants)
- Category management with images
- Order management with status updates
- Banner/promotional carousel management
- Coupon management (percentage or flat discounts, minimum order thresholds, expiry dates)
- Configurable delivery and platform fees

---

## 🛠️ Tech Stack

**Frontend:** React (Vite), React Router, Axios
**Backend:** Node.js, Express.js, JWT Authentication
**Database:** MySQL
**Payments:** Razorpay
**Image Hosting:** Cloudinary
**Geolocation:** Google Geocoding API
**Deployment:** Railway (backend + database), Vercel (frontend)

---

## 🏗️ Architecture
Key backend modules:
- Authentication (JWT-based, role-based access for admin/customer)
- Product & Category management (with variant support)
- Order management (checkout, status tracking)
- Address book (with geolocation support)
- Coupon & discount engine
- Payment processing (Razorpay order creation + signature verification)
- Image upload (Cloudinary integration)

---

## 📦 Database Schema (Key Tables)

- `users` — customer & admin accounts
- `products` / `product_variants` — catalog with multi-weight pricing
- `categories` — product categories with images
- `orders` / `order_items` — order records and line items
- `addresses` — saved customer delivery addresses
- `coupons` — discount codes with rules
- `banners` — homepage promotional carousel
- `settings` — configurable delivery/platform fees

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- MySQL database
- Razorpay test account
- Cloudinary account
- Google Cloud API key (Geocoding API enabled)

### Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
# JWT_SECRET
# CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
# RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
# Create a .env file with:
# VITE_GOOGLE_MAPS_API_KEY
npm run dev
```

---

## 🔮 Future Enhancements

- Product reviews & ratings
- Wishlist functionality
- Push notifications for order updates
- Courier/delivery partner tracking integration
- Sales reports & analytics export
- Return/refund management

---

## 👤 Author

**Monika Pranathi Reddy**