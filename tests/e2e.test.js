const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

let authToken;
let testProductId;
let testOrderId;

describe('E-Commerce API Tests', () => {
  beforeAll(async () => {
    // Create test user
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test1234',
      role: 'user'
    });

    // Create test product
    const product = await Product.create({
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      category: 'Electronics',
      stock: 10
    });
    testProductId = product._id;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
  });

  describe('Authentication', () => {
    test('User Login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'test1234'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      authToken = res.body.token;
    });
  });

  describe('Products', () => {
    test('Get All Products', async () => {
      const res = await request(app)
        .get('/api/products');
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    test('Get Single Product', async () => {
      const res = await request(app)
        .get(`/api/products/${testProductId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty('name', 'Test Product');
    });
  });

  describe('Orders', () => {
    test('Create New Order', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          orderItems: [{
            product: testProductId,
            name: 'Test Product',
            quantity: 1,
            price: 99.99,
            image: 'test.jpg'
          }],
          shippingInfo: {
            address: '123 Test St',
            city: 'Testville',
            postalCode: '12345',
            country: 'Testland'
          },
          paymentMethod: 'Stripe',
          taxPrice: 9.99,
          shippingPrice: 5.99
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('totalPrice', 115.97);
      testOrderId = res.body.data._id;
    });

    test('Get Order by ID', async () => {
      const res = await request(app)
        .get(`/api/orders/${testOrderId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty('_id', testOrderId);
    });
  });
});
