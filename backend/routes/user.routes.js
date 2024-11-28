const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
//const adminMiddleware = require('../middleware/admin.middleware'); // Middleware pour protéger la route


// Route pour enregistrer un nouvel utilisateur
router.post('/register', UserController.register);

// Route pour connecter un utilisateur
router.post('/login', UserController.login);

// Route pour déconnecter un utilisateur
router.post('/logout', UserController.logout);

// Route pour obtenir les informations du profil (protégée)
router.get('/profile/:id', authMiddleware, UserController.getProfile);

// Route pour obtenir tous les profils (protégée)
router.get('/list/:page?', authMiddleware, UserController.list);

// Route pour créer un nouvel administrateur
router.post('/create-admin', UserController.createAdmin);


module.exports = router;
