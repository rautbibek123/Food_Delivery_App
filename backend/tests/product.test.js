const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Product = require('../models/Product');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Import setup file
require('./setup');

let adminToken;
let userToken;

beforeEach(async () => {
    // Create Admin User
    const admin = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        isAdmin: true,
        phone: '9800000001',
        address: 'Admin Address'
    });
    adminToken = jwt.sign({ userId: admin._id, isAdmin: true }, process.env.JWT_SECRET || 'secret_key_dev');

    // Create Normal User
    const user = await User.create({
        name: 'Normal User',
        email: 'user@example.com',
        password: 'user123',
        isAdmin: false,
        phone: '9800000002',
        address: 'User Address'
    });
    userToken = jwt.sign({ userId: user._id, isAdmin: false }, process.env.JWT_SECRET || 'secret_key_dev');

    // Create Sample Product
    await Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        category: 'momo',
        image: 'test.jpg'
    });
});

describe('Products API', () => {
    describe('GET /api/products', () => {
        it('should return all products', async () => {
            const res = await request(app).get('/api/products');
            expect(res.statusCode).toEqual(200);
            expect(res.body.products).toHaveLength(1);
            expect(res.body.products[0]).toHaveProperty('name', 'Test Product');
        });
    });

    describe('POST /api/products', () => {
        it('should allow admin to create a product', async () => {
            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'New Product',
                    description: 'New Description',
                    price: 200,
                    category: 'burger',
                    image: 'new.jpg'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('name', 'New Product');

            const products = await Product.find();
            expect(products).toHaveLength(2);
        });

        it('should NOT allow normal user to create a product', async () => {
            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Hacker Product',
                    description: 'Hacked',
                    price: 0,
                    category: 'momo'
                });

            // Expecting 403 Forbidden or 401 Unauthorized
            expect([401, 403]).toContain(res.statusCode);
        });
    });

    describe('DELETE /api/products/:id', () => {
        it('should allow admin to delete a product', async () => {
            const product = await Product.findOne({ name: 'Test Product' });

            const res = await request(app)
                .delete(`/api/products/${product._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);

            const dbProduct = await Product.findById(product._id);
            expect(dbProduct).toBeNull();
        });
    });
});
