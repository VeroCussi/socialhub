const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({

  username: {
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
    trim: true,      // Supprime les espaces en début et en fin de chaîne
    lowercase: true, // Convertit la chaîne en minuscules
  },
  password: {
    type: String,
    required: true,  // Le mot de passe est requis
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Définit les rôles possibles
    default: 'user',         // Le rôle par défaut est "user"
  },
}, {
  timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
});

// Ajoute une validation unique pour les champs "unique"
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

