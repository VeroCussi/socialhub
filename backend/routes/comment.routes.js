const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const auth = require('../middleware/auth.middleware');

// Rutas asociadas con las funciones del controlador
router.post('/:id', auth, commentController.createComment); // 'id' es el postId
router.get('/', commentController.getAllComments);
router.get('/:id', commentController.getCommentById); // esto es raro, se puede borrar, no?
router.put('/:id', auth, commentController.updateComment);
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;
