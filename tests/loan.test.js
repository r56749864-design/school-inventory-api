
require('dotenv').config();

const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const app = require('../app');

const User = require('../model/user');
const Category = require('../model/category');
const Item = require('../model/item');
const Loan = require('../model/loan');

let user;
let category;
let token;
let emptyItem;
let availableItem;

beforeAll(async () => {
  if (!process.env.TEST_MONGO_URI) {
    throw new Error('TEST_MONGO_URI is not configured');
  }

  await mongoose.connect(process.env.TEST_MONGO_URI);

  user = await User.create({
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'testpassword123',
    role: 'user'
  });

  token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  category = await Category.create({
    name: 'Test Category',
    description: 'Category for automated testing'
  });

  emptyItem = await Item.create({
    name: 'Empty Test Item',
    stock: 0,
    category: category._id
  });

  availableItem = await Item.create({
    name: 'Available Test Item',
    stock: 5,
    category: category._id
  });
});

afterAll(async () => {
  await Loan.deleteMany({ user: user?._id });

  if (emptyItem) {
    await Item.deleteOne({ _id: emptyItem._id });
  }

  if (availableItem) {
    await Item.deleteOne({ _id: availableItem._id });
  }

  if (category) {
    await Category.deleteOne({ _id: category._id });
  }

  if (user) {
    await User.deleteOne({ _id: user._id });
  }

  await mongoose.connection.close();
});

describe('Loan API Tests', () => {
  test('Database connection should be successful', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  test('Loan should fail when item stock is empty', async () => {
    const response = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        item: emptyItem._id,
        quantity: 1
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('Loan should fail when requested quantity exceeds stock', async () => {
    const response = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        item: availableItem._id,
        quantity: 10
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('Loan should fail when item does not exist', async () => {
    const response = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        item: new mongoose.Types.ObjectId(),
        quantity: 1
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });

  test('Loan should fail when quantity is zero', async () => {
    const response = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        item: availableItem._id,
        quantity: 0
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('Loan should fail when quantity is not an integer', async () => {
    const response = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        item: availableItem._id,
        quantity: 1.5
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('Loan should fail when quantity is not a number', async () => {
    const response = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        item: availableItem._id,
        quantity: 'abc'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('Loan should be created when stock is available', async () => {
    const response = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        item: availableItem._id,
        quantity: 2
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.loan.status).toBe('pending');
  });
});
