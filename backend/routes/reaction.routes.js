const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reaction.controller');
const auth = require('../middleware/auth.middleware');

// Route para añadir/cambiar reacción a un post
router.post('/:postId', auth, reactionController.toggleReaction);

// Route para obtener reacciones de un post
router.get('/:postId', auth, reactionController.getPostReactions);

// Route para obtener reacción del usuario actual para un post
router.get('/:postId/user', auth, reactionController.getUserReaction);

module.exports = router;
