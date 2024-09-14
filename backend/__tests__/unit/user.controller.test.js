// user.controller.test.js
const { register, login, getProfile, createAdmin } = require('../../controllers/user.controller');
const User = require('../../models/user.model')
const bcrypt = require('bcrypt');

jest.mock('../../models/user.model');
jest.mock('bcrypt');

describe('User Controller - Register', () => {
  it('debería registrar un nuevo usuario', async () => {
    const req = {
      body: { username: 'newuser', email: 'newuser@example.com', password: 'password123' }
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedpassword');
    User.prototype.save = jest.fn().mockResolvedValue(true);

    await register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ $or: [{ email: 'newuser@example.com' }, { username: 'newuser' }] });
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(User.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur enregistré avec succès' });
  });

  it('debería devolver un error si el usuario ya existe', async () => {
    const req = {
      body: { username: 'existinguser', email: 'existinguser@example.com', password: 'password123' }
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockResolvedValue({ username: 'existinguser' });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email ou nom utilisateur déjà utilisé' });
  });
});
