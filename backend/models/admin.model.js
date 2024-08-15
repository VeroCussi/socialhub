const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');


const adminSchema = new Schema({
   adminname: {
    type: String,
    required: true,
    unique: true,
    trim: true,      // Supprime les espaces en début et en fin de chaîne
    lowercase: true  // Convertit la chaîne en minuscules
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Définit les rôles possibles
    default: 'admin',         // Le rôle par défaut est "admin"
  },
  permissions: {
    type: [String], // Liste des permissions spécifiques
    default: ['manage_posts', 'manage_users'], // Permissions par défaut
    enum: ['manage_users', 'manage_posts', 'manage_comments', 'manage_roles'], // Liste des permissions possibles
},
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Ajoute une validation unique pour les champs "unique"
adminSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Admin', adminSchema);
