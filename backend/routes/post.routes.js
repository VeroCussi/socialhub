const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

// Ruta para crear un nuevo post
router.post('/', postController.createPost);

// Ruta para obtener todos los posts
router.get('/', postController.getAllPosts);

// Ruta para obtener un post por ID
router.get('/:id', postController.getPostById);

// Ruta para actualizar un post
router.put('/:id', postController.updatePost);

// Ruta para eliminar un post
router.delete('/:id', postController.deletePost);

module.exports = router;
