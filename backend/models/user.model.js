const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  surname: {
    type: String
  },

  bio: {
    type: String
  },

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
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
    enum: ['user', 'admin'], // Rôles disponibles
    default: 'user',         // Rôle par défaut
  },
  permissions: {
    type: [String],
    default: function() {
      return this.role === 'admin' ? ['manage_posts', 'manage_users', 'manage_comments'] : [];
    },
    enum: ['manage_users', 'manage_posts', 'manage_comments', 'manage_roles'], // Permissions possibles
  },
  image: {
    type: String,
    default: "image.jpg",
  }
}, {
  timestamps: true, // Champs createdAt et updatedAt automatiques
});

// Ajoute la validation des champs uniques
userSchema.plugin(uniqueValidator);
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);
