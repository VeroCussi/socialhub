const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
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
    enum: ['user', 'admin'], // Roles disponibles
    default: 'user',         // Rol por defecto
  },
  permissions: {
    type: [String],
    default: function() {
      return this.role === 'admin' ? ['manage_posts', 'manage_users', 'manage_comments'] : [];
    },
    enum: ['manage_users', 'manage_posts', 'manage_comments', 'manage_roles'], // Permisos posibles
  },
  image: {
    type: String,
    default: "image.jpg",
  }
}, {
  timestamps: true, // Campos createdAt y updatedAt automáticos
});

// Agrega la validación de campos únicos
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
