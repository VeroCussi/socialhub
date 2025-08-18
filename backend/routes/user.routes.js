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

// Route pour obtenir le profil de l'utilisateur connecté (protégée)
router.get('/me', authMiddleware, UserController.getCurrentUser);

// Route pour obtenir tous les profils (protégée)
router.get('/list/:page?', authMiddleware, UserController.list);

// Route pour créer un nouvel administrateur
router.post('/create-admin', UserController.createAdmin);

// Route para actualizar perfil de usuario
router.put('/profile', authMiddleware, UserController.updateProfile);

// Route para cambiar contraseña
router.put('/change-password', authMiddleware, UserController.changePassword);

// Route para seguir a un usuario
router.post('/follow/:id', authMiddleware, UserController.followUser);

// Route para dejar de seguir a un usuario
router.delete('/unfollow/:id', authMiddleware, UserController.unfollowUser);

// Route para obtener estadísticas de un usuario
router.get('/stats/:id', authMiddleware, UserController.getUserStats);

// Route para buscar usuarios
router.get('/search', authMiddleware, UserController.searchUsers);


module.exports = router;
