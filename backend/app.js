const express = require('express')
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');

// Connexion à MongoDB
const MONGO_ACCESS = process.env.MONGOLAB_URI;
mongoose.connect(MONGO_ACCESS)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(cors()); // Configure automatiquement les en-têtes pour accepter les requêtes de toutes les origines.
app.use(express.json()) // Pour pouvoir gérer JSON dans les requêtes
app.use(express.urlencoded({extended: true})); // Permet de parser les données URL-encodées avec des objets imbriqués.

// Gérer les fichiers statiques: comme les images
app.use('/uploads', express.static('uploads'));

// Connecter les routes utilisateur
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

module.exports = app;
