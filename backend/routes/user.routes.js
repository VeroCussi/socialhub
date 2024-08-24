const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware'); // Middleware para proteger la ruta
// const User = require('../models/user.model'); to create first admin
// const bcrypt = require('bcrypt'); to create first admin

// Route pour enregistrer un nouvel utilisateur
router.post('/register', UserController.register);

// Route pour connecter un utilisateur
router.post('/login', UserController.login);

// Route pour deconnecter un utilisateur
router.post('/logout', UserController.logout);

// Route pour obtenir les informations de profil (protégée)
router.get('/profile', authMiddleware, UserController.getProfile);

// Ruta para crear un nuevo administrador (protegida)
router.post('/create-admin', authMiddleware, adminMiddleware, UserController.createAdmin);

// Ruta para crear el primer admin
// router.post('/init-admin', async (req, res) => {
//     try {
//       const { username, email, password } = req.body;
  
//       // Verificar si ya existe un admin
//       const existingAdmin = await User.findOne({ role: 'admin' });
//       if (existingAdmin) {
//         return res.status(400).json({ message: 'Un administrador ya existe.' });
//       }
  
//       // Hashear la contraseña
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // Crear el nuevo administrador
//       const newAdmin = new User({
//         username,
//         email,
//         password: hashedPassword,
//         role: 'admin',
//         permissions: ['manage_posts', 'manage_users', 'manage_comments']
//       });
  
//       await newAdmin.save();
  
//       res.status(201).json({ message: 'First admin successfully created' });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });

module.exports = router;
