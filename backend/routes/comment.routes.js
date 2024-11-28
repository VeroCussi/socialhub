const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const auth = require('../middleware/auth.middleware');

// Route pour créer un commentaire
router.post('/:id', auth, commentController.createComment); 

// Route pour récupérer tous les commentaire par post
router.get('/:id', auth, commentController.getCommentsByPostId);

// Route pour mettre à jour un commentaire
router.put('/:id', auth, commentController.updateComment); 

// Route pour supprimer un commentaire
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;
