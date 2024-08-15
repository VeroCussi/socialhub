const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

// Rutas asociadas con las funciones del controlador
router.post('/', commentController.createComment);
router.get('/', commentController.getAllComments);
router.get('/:id', commentController.getCommentById);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
