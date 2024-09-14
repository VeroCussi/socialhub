const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware'); // Middleware pour protéger la route
// const User = require('../models/user.model'); pour créer le premier admin
// const bcrypt = require('bcrypt'); pour créer le premier admin

// Route pour enregistrer un nouvel utilisateur
router.post('/register', UserController.register);

// Route pour connecter un utilisateur
router.post('/login', UserController.login);

// Route pour déconnecter un utilisateur
router.post('/logout', UserController.logout);

// Route pour obtenir les informations du profil (protégée)
router.get('/profile/:id', authMiddleware, UserController.getProfile);

// Route pour obtenir les todos los profil con páginas (protégée)
router.get('/list/:page?', authMiddleware, UserController.list);

// Route pour créer un nouvel administrateur (protégée)
router.post('/create-admin', adminMiddleware, UserController.createAdmin);

// Route pour créer le premier admin // REVISAR Y BORRAR LO QUE NO SIRVA
// router.post('/init-admin', async (req, res) => {
//     try {
//       const { username, email, password } = req.body;
  
//       // Vérifier s'il existe déjà un admin
//       const existingAdmin = await User.findOne({ role: 'admin' });
//       if (existingAdmin) {
//         return res.status(400).json({ message: 'Un administrateur existe déjà.' });
//       }
  
//       // Hasher le mot de passe
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // Créer le nouvel administrateur
//       const newAdmin = new User({
//         username,
//         email,
//         password: hashedPassword,
//         role: 'admin',
//         permissions: ['manage_posts', 'manage_users', 'manage_comments']
//       });
  
//       await newAdmin.save();
  
//       res.status(201).json({ message: 'Premier admin créé avec succès' });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });

module.exports = router;
