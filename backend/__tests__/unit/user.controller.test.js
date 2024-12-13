const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Mock du modèle user
jest.mock('../../models/user.model');

describe('User Controller Tests', () => {
  let token;

  beforeAll(() => {
    // Mocking JWT simulé
    token = jwt.sign({ _id: 'mockUserId', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1d' });
  });

  afterAll(async () => {
    await mongoose.disconnect(); 
  });

  // Tests pour créer un new user
  describe('Register a new user', () => {
    it('should register a user successfully', async () => {
      User.find.mockResolvedValue([]);
      User.prototype.save = jest.fn().mockResolvedValue({
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
      });

      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          username: 'johndoe',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('should return an error for missing fields', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Des données manquent');
    });

    it('should return an error for duplicate user', async () => {
      User.find.mockResolvedValue([{ email: 'john@example.com' }]);

      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          username: 'johndoe',
          password: 'password123',
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('L\'utilisateur existe déjà');
    });
  });

    // Tests pour login
  describe('User login', () => {
    it('should log in a user successfully', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      User.findOne.mockResolvedValue({
        email: 'john@example.com',
        password: hashedPassword,
        _id: 'mockUserId',
        _doc: { email: 'john@example.com', password: hashedPassword },
      });

      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.token).toBeDefined();
    });

    it('should return an error for invalid email', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'invalid@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Utilisateur non trouvé');
    });

    it('should return an error for invalid password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      User.findOne.mockResolvedValue({
        email: 'john@example.com',
        password: hashedPassword,
      });

      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Mot de passe incorrect');
    });
  });

    // Tests pour logout
  describe('User logout', () => {
    it('should log out the user successfully', async () => {
      const response = await request(app)
        .post('/api/user/logout');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Déconnexion réussie');
    });
  });
});
