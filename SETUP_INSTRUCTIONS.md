# Hope Bites E-commerce Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

## Database Setup (MongoDB)

### Option 1: Local MongoDB Installation
1. **Install MongoDB Community Edition:**
   - **Windows:** Download from https://www.mongodb.com/try/download/community
   - **macOS:** `brew install mongodb-community`
   - **Linux:** Follow instructions at https://docs.mongodb.com/manual/installation/

2. **Start MongoDB Service:**
   ```bash
   # Windows (as service)
   net start MongoDB
   
   # macOS/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is running:**
   ```bash
   mongo --eval "db.adminCommand('ismaster')"
   ```

### Option 2: MongoDB Atlas (Cloud - FREE)
1. **Create Account:** Go to https://www.mongodb.com/cloud/atlas
2. **Create Cluster:** Choose the FREE M0 tier
3. **Setup Database Access:**
   - Create a database user with read/write permissions
   - Note down username and password
4. **Setup Network Access:**
   - Add your IP address or use 0.0.0.0/0 for development
5. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Project Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration (choose one)
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/hopebites_db

# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hopebites_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex_123456789
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email Configuration (Gmail - FREE)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password

# Payment Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal Configuration (Sandbox - FREE)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Frontend URL
CLIENT_URL=http://localhost:5000

# Security
BCRYPT_ROUNDS=12
```

### 3. Email Setup (Gmail - FREE)

#### Enable 2-Factor Authentication:
1. Go to Google Account settings
2. Security → 2-Step Verification → Turn on

#### Generate App Password:
1. Google Account → Security → App passwords
2. Select app: "Mail"
3. Select device: "Other" → Enter "Hope Bites"
4. Copy the generated 16-character password
5. Use this password in `EMAIL_PASSWORD` (not your regular Gmail password)

### 4. Payment Setup

#### Stripe (FREE for testing):
1. **Create Account:** https://dashboard.stripe.com/register
2. **Get Test Keys:**
   - Dashboard → Developers → API keys
   - Copy "Publishable key" and "Secret key"
   - Use test keys (they start with `pk_test_` and `sk_test_`)

#### PayPal (FREE for testing):
1. **Create Developer Account:** https://developer.paypal.com/
2. **Create App:**
   - My Apps & Credentials → Create App
   - Choose "Sandbox" environment
   - Copy Client ID and Client Secret

### 5. Database Seeding
```bash
# Seed the database with sample products and admin user
npm run seed

# To clear and reseed:
npm run seed -- -d
npm run seed
```

### 6. Start the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## API Testing

### Test Endpoints:
```bash
# Health check
curl http://localhost:5000/api/health

# Get products
curl http://localhost:5000/api/products

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'
```

## Frontend Access

### Available Pages:
- **Home:** http://localhost:5000/
- **Shop:** http://localhost:5000/shop
- **Products:** http://localhost:5000/products
- **About:** http://localhost:5000/about
- **Support:** http://localhost:5000/support
- **Contact:** http://localhost:5000/contact

### Admin Access:
- **Email:** admin@hopebites.com
- **Password:** admin123456

## Free APIs Used

### 1. **Stripe (Payment Processing)**
- **Free Tier:** Unlimited test transactions
- **Setup:** Create account at https://stripe.com
- **Documentation:** https://stripe.com/docs

### 2. **PayPal (Alternative Payment)**
- **Free Tier:** Sandbox testing
- **Setup:** Create developer account at https://developer.paypal.com
- **Documentation:** https://developer.paypal.com/docs

### 3. **Gmail SMTP (Email Service)**
- **Free Tier:** 500 emails/day
- **Setup:** Use app passwords with 2FA enabled
- **Alternative:** Use services like Mailtrap for testing

### 4. **MongoDB Atlas (Database)**
- **Free Tier:** 512MB storage, shared cluster
- **Setup:** Create account at https://www.mongodb.com/cloud/atlas
- **Alternative:** Local MongoDB installation

## Security Features Implemented

### 1. **Authentication & Authorization**
- JWT tokens with HTTP-only cookies
- Password hashing with bcrypt
- Role-based access control

### 2. **Data Protection**
- Input sanitization (NoSQL injection prevention)
- XSS protection
- HTTP parameter pollution prevention
- CORS configuration

### 3. **Rate Limiting**
- General API: 100 requests/15 minutes
- Authentication: 5 attempts/15 minutes
- Payment: 10 attempts/hour

### 4. **Security Headers**
- Helmet.js for security headers
- Content Security Policy
- HTTPS enforcement in production

## Performance Optimizations

### 1. **Frontend**
- Lazy loading for images
- Compression middleware
- Static file caching
- Minified assets

### 2. **Backend**
- Database indexing
- Query optimization
- Response compression
- Error handling

### 3. **Database**
- Proper indexing on search fields
- Aggregation pipelines for complex queries
- Connection pooling

## Troubleshooting

### Common Issues:

#### 1. **MongoDB Connection Error**
```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ismaster')"

# For Atlas, verify:
# - Correct connection string
# - Database user permissions
# - Network access settings
```

#### 2. **Email Not Sending**
```bash
# Verify Gmail settings:
# - 2FA enabled
# - App password generated
# - Correct credentials in .env
```

#### 3. **Payment Issues**
```bash
# Verify Stripe/PayPal:
# - Test keys being used
# - Correct environment (sandbox/test)
# - Valid API credentials
```

#### 4. **Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=3000
```

## Production Deployment

### Environment Variables for Production:
```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
# Use production Stripe/PayPal keys
# Configure production email service
```

### Security Checklist:
- [ ] Use production database
- [ ] Enable HTTPS
- [ ] Use production payment keys
- [ ] Set secure JWT secret
- [ ] Configure proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Check console logs for error messages
4. Verify environment variables are set correctly

## License
MIT License - see LICENSE file for details