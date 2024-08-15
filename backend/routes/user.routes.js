const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Route pour enregistrer un nouvel utilisateur
router.post('/register', UserController.register);

// Route pour connecter un utilisateur
router.post('/login', UserController.login);

// Route pour deconnecter un utilisateur
router.post('/logout', UserController.logout);

// Route pour obtenir les informations de profil (protégée)
router.get('/profile', authMiddleware, UserController.getProfile);

module.exports = router;
