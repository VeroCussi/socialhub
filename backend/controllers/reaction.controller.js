const Reaction = require('../models/reaction.model');
const Post = require('../models/post.model');

// Añadir o cambiar reacción a un post
exports.toggleReaction = async (req, res) => {
  try {
    const { postId } = req.params;
    const { type = 'like' } = req.body;
    const userId = req.user._id;

    // Verificar que el post existe
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Post no encontrado"
      });
    }

    // Buscar si ya existe una reacción del usuario
    let existingReaction = await Reaction.findOne({ userId, postId });

    if (existingReaction) {
      // Si la reacción es del mismo tipo, eliminarla (toggle)
      if (existingReaction.type === type) {
        await Reaction.findByIdAndDelete(existingReaction._id);
        
        res.status(200).json({
          status: "success",
          message: "Reacción eliminada",
          action: "removed"
        });
      } else {
        // Si es diferente, actualizar el tipo
        existingReaction.type = type;
        await existingReaction.save();
        
        res.status(200).json({
          status: "success",
          message: "Reacción actualizada",
          action: "updated",
          reaction: existingReaction
        });
      }
    } else {
      // Crear nueva reacción
      const newReaction = new Reaction({
        userId,
        postId,
        type
      });
      
      await newReaction.save();
      
      res.status(201).json({
        status: "success",
        message: "Reacción añadida",
        action: "added",
        reaction: newReaction
      });
    }

  } catch (error) {
    console.error("Error al manejar reacción:", error);
    
    // Si es error de duplicado, manejarlo específicamente
    if (error.code === 11000) {
      return res.status(409).json({
        status: "error",
        message: "Ya existe una reacción para este post"
      });
    }
    
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Obtener reacciones de un post
exports.getPostReactions = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const reactions = await Reaction.find({ postId })
      .populate('userId', 'username image')
      .sort({ createdAt: -1 });

    // Contar reacciones por tipo
    const reactionCounts = {
      like: 0,
      love: 0,
      haha: 0,
      wow: 0,
      sad: 0,
      angry: 0,
      total: reactions.length
    };

    reactions.forEach(reaction => {
      reactionCounts[reaction.type]++;
    });

    res.status(200).json({
      status: "success",
      reactions,
      counts: reactionCounts
    });

  } catch (error) {
    console.error("Error al obtener reacciones:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Obtener reacción del usuario actual para un post
exports.getUserReaction = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    
    const reaction = await Reaction.findOne({ userId, postId });
    
    res.status(200).json({
      status: "success",
      reaction: reaction || null
    });

  } catch (error) {
    console.error("Error al obtener reacción del usuario:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error: error.message
    });
  }
};
