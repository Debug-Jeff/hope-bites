# Hope Bites API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://hopebites.com/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
```
*Requires authentication*

### Products

#### Get All Products
```http
GET /products
```

**Query Parameters:**
- `category` - Filter by category
- `price[gte]` - Minimum price
- `price[lte]` - Maximum price
- `sort` - Sort by field (e.g., 'price', '-rating')
- `page` - Page number
- `limit` - Items per page

**Example:**
```http
GET /products?category=Growth Support&price[lte]=30&sort=-rating&page=1&limit=10
```

#### Get Single Product
```http
GET /products/:id
```

#### Create Product (Admin Only)
```http
POST /products
```
*Requires authentication and admin role*

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 29.99,
  "category": "Growth Support",
  "stock": 100,
  "images": [
    {
      "url": "/assets/product.jpg",
      "alt": "Product image",
      "isPrimary": true
    }
  ]
}
```

### Shopping Cart

#### Get User Cart
```http
GET /cart
```
*Requires authentication*

#### Add Item to Cart
```http
POST /cart/add
```
*Requires authentication*

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 2,
  "size": "Medium (400g)"
}
```

#### Update Cart Item
```http
PUT /cart/update/:itemId
```
*Requires authentication*

**Request Body:**
```json
{
  "quantity": 3
}
```

#### Remove Cart Item
```http
DELETE /cart/remove/:itemId
```
*Requires authentication*

#### Apply Promo Code
```http
POST /cart/promo
```
*Requires authentication*

**Request Body:**
```json
{
  "code": "WELCOME10"
}
```

### Orders

#### Create Order
```http
POST /orders
```
*Requires authentication*

**Request Body:**
```json
{
  "orderItems": [
    {
      "product": "product_id",
      "name": "Product Name",
      "quantity": 2,
      "price": 29.99,
      "image": "/assets/product.jpg"
    }
  ],
  "shippingInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "US"
  },
  "paymentMethod": "Stripe",
  "taxPrice": 4.80,
  "shippingPrice": 5.99
}
```

#### Get Order
```http
GET /orders/:id
```
*Requires authentication*

#### Get User Orders
```http
GET /orders/myorders
```
*Requires authentication*

### Payments

#### Create Stripe Payment Intent
```http
POST /payment/stripe/create-intent
```
*Requires authentication*

**Request Body:**
```json
{
  "amount": 59.98,
  "currency": "usd",
  "orderId": "order_id"
}
```

#### Confirm Stripe Payment
```http
POST /payment/stripe/confirm
```
*Requires authentication*

**Request Body:**
```json
{
  "paymentIntentId": "pi_1234567890",
  "orderId": "order_id"
}
```

#### Create PayPal Payment
```http
POST /payment/paypal/create
```
*Requires authentication*

**Request Body:**
```json
{
  "amount": 59.98,
  "orderId": "order_id",
  "returnUrl": "https://yoursite.com/success",
  "cancelUrl": "https://yoursite.com/cancel"
}
```

## Rate Limits

- **General API:** 100 requests per 15 minutes
- **Authentication:** 5 requests per 15 minutes
- **Payment:** 10 requests per hour

## Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error