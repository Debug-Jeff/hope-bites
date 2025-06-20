# Hope Bites - E-commerce Platform

![Hope Bites Logo](assets/HB-logo.png)

## 🌟 Overview

Hope Bites is a comprehensive e-commerce platform focused on providing nutritious snacks for children's healthy development. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

## ✨ Features

### 🛒 **E-commerce Functionality**
- Product catalog with categories and filtering
- Shopping cart with real-time updates
- Secure checkout process (3-step flow)
- Order management and tracking
- User authentication and profiles

### 💳 **Payment Processing**
- Stripe integration for credit/debit cards
- PayPal integration for alternative payments
- Secure payment handling with webhooks
- Multiple payment methods support

### 🔐 **Security & Performance**
- JWT authentication with HTTP-only cookies
- Rate limiting and DDoS protection
- Input sanitization and XSS prevention
- Password hashing with bcrypt
- Comprehensive security headers

### 📱 **User Experience**
- Responsive design for all devices
- Dark/light mode toggle
- Product search and filtering
- Real-time cart updates
- Email notifications

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Stripe account (for payments)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Debug-Jeff/hope-bites.git
cd hope-bites
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment setup:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Database setup:**
```bash
# Seed database with sample data
npm run seed
```

5. **Start the application:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

6. **Access the application:**
- Frontend: http://localhost:5000
- API: http://localhost:5000/api

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with bcrypt
- **Payments:** Stripe, PayPal
- **Email:** Nodemailer

### Frontend
- **Languages:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS with CSS Variables
- **Icons:** Boxicons
- **Responsive:** Mobile-first design

### Security
- **Rate Limiting:** express-rate-limit
- **Security Headers:** Helmet.js
- **Data Sanitization:** express-mongo-sanitize
- **XSS Protection:** xss-clean

## 📁 Project Structure

```
hope-bites/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── cartController.js    # Shopping cart logic
│   ├── orderController.js   # Order management
│   ├── paymentController.js # Payment processing
│   └── productController.js # Product management
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── error.js            # Error handling
│   ├── security.js         # Security middleware
│   └── async.js            # Async wrapper
├── models/
│   ├── User.js             # User schema
│   ├── Product.js          # Product schema
│   └── Order.js            # Order schema
├── routes/
│   ├── auth.js             # Auth routes
│   ├── cart.js             # Cart routes
│   ├── orders.js           # Order routes
│   ├── payment.js          # Payment routes
│   └── products.js         # Product routes
├── scripts/
│   └── seedDatabase.js     # Database seeding
├── utils/
│   ├── email.js            # Email utilities
│   └── errorResponse.js    # Error response class
├── tests/
│   └── e2e.test.js         # End-to-end tests
├── assets/                 # Static assets
├── *.html                  # Frontend pages
├── *.css                   # Stylesheets
├── *.js                    # Frontend JavaScript
└── server.js               # Main server file
```

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/me          # Get current user
PUT  /api/auth/updatedetails # Update user details
```

### Products
```
GET  /api/products         # Get all products
GET  /api/products/:id     # Get single product
POST /api/products         # Create product (admin)
PUT  /api/products/:id     # Update product (admin)
DELETE /api/products/:id   # Delete product (admin)
```

### Shopping Cart
```
GET  /api/cart             # Get user cart
POST /api/cart/add         # Add item to cart
PUT  /api/cart/update/:id  # Update cart item
DELETE /api/cart/remove/:id # Remove cart item
```

### Orders
```
POST /api/orders           # Create new order
GET  /api/orders/:id       # Get order details
GET  /api/orders/myorders  # Get user orders
```

### Payments
```
POST /api/payment/stripe/create-intent # Create Stripe payment
POST /api/payment/paypal/create        # Create PayPal payment
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test tests/e2e.test.js
```

## 🚀 Deployment

### Environment Variables
```env
NODE_ENV=production
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
PAYPAL_CLIENT_ID=your_paypal_id
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_email_password
```

### Deployment Platforms
- **Heroku:** See [Heroku deployment guide](docs/DEPLOYMENT.md#heroku)
- **Vercel:** See [Vercel deployment guide](docs/DEPLOYMENT.md#vercel)
- **DigitalOcean:** See [DigitalOcean deployment guide](docs/DEPLOYMENT.md#digitalocean)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Hope Bites** - Nourishing children worldwide with nutritious and delicious snacks designed for healthy development.