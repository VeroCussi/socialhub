const express = require('express')
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');

const MONGO_ACCESS = process.env.MONGOLAB_URI;
mongoose.connect(MONGO_ACCESS,
    { 

     })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json()) // Pour pouvoir gérer JSON dans les requêtes

// Connecter les routes utilisateur
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);


module.exports = app