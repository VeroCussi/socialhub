const mongoose = require('mongoose');
const { Schema } = mongoose;

const reactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
    default: 'like'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice compuesto para evitar reacciones duplicadas
reactionSchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);
