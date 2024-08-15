const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Route pour enregistrer un nouvel utilisateur
router.post('/register', AdminController.register);

// Route pour connecter un utilisateur
router.post('/login', AdminController.login);

// Route pour obtenir les informations de profil (protégée)
router.get('/profile', authMiddleware, AdminController.getProfile);

module.exports = router;