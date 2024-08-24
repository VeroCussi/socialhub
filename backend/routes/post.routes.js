const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth.middleware');

// Route pour créer un nouveau post avec une image
router.post('/', auth, multer, postController.createPost);

// Route pour obtenir tous les posts
router.get('/', postController.getAllPosts);

// Route pour obtenir un post par ID
router.get('/:id', postController.getPostById);

// Route pour mettre à jour un post
router.put('/:id', auth, multer, postController.updatePost);

// Route pour supprimer un post
router.delete('/:id', auth, multer, postController.deletePost);

module.exports = router;
