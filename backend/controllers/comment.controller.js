const Comment = require('../models/comment.model');

// Créer un nouveau commentaire
exports.createComment = async (req, res) => {
  try {
      // Vérifier que l'utilisateur est authentifié
      if (!req.user || !req.user._id) {
          return res.status(401).json({ message: "Utilisateur non authentifié" });
      }

      // Créer une instance du modèle Comment avec les données reçues
      const comment = new Comment({
          text: req.body.text,
          userId: req.user._id, // Utiliser l'ID de l'utilisateur authentifié
          postId: req.params.id // Prendre le postId depuis les paramètres de l'URL
      });

      // Enregistrer le commentaire dans la base de données
      const savedComment = await comment.save();

      // Retourner une réponse avec le commentaire créé
      res.status(201).json(savedComment);
  } catch (error) {
      // En cas d'erreur, retourner un message d'erreur
      res.status(500).json({ message: "Échec de la création du commentaire", error });
  }
};


// Obtenir tous les commentaires
exports.getAllComments = async (req, res) => {
    try {
        // Récupérer tous les commentaires et les trier du plus récent au plus ancien
        const comments = await Comment.find().sort({ createdAt: -1 });
        // Retourner la liste des commentaires
        res.status(200).json(comments);
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        res.status(500).json({ message: "Échec de la récupération des commentaires", error });
    }
};

// Obtenir un commentaire par ID
exports.getCommentById = async (req, res) => {
    try {
        // Récupérer le commentaire par son ID
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            // Si le commentaire n'existe pas, retourner un message d'erreur
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }
        // Retourner le commentaire trouvé
        res.status(200).json(comment);
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        res.status(500).json({ message: "Échec de la récupération du commentaire", error });
    }
};

// Mettre à jour un commentaire
exports.updateComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user._id; // Utilisateur authentifié
        const userRole = req.user.role; // Rôle de l'utilisateur authentifié

        // Rechercher le commentaire par son ID
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }

        // Vérifier si l'utilisateur est le créateur du commentaire ou s'il est administrateur
        if (comment.userId.toString() !== userId.toString() && userRole !== 'admin') {
            return res.status(403).json({ message: "Vous n'avez pas la permission de mettre à jour ce commentaire" });
        }

        // Mettre à jour le commentaire avec le nouveau texte fourni
        comment.text = req.body.text || comment.text;

        // Enregistrer les modifications dans la base de données
        const updatedComment = await comment.save();

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du commentaire :", error); // Journal de l'erreur détaillée
        res.status(500).json({ message: "Erreur lors de la mise à jour du commentaire", error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id; // ID du commentaire à supprimer
        const userId = req.user._id; // ID de l'utilisateur authentifié
        const userRole = req.user.role; // Rôle de l'utilisateur authentifié

        // Rechercher le commentaire par son ID
        const comment = await Comment.findById(commentId);

        if (!comment) {
            // Si le commentaire n'existe pas, renvoyer un message d'erreur
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }

        // Vérifier si l'utilisateur est le créateur du commentaire ou s'il est administrateur
        if (comment.userId.toString() !== userId.toString() && userRole !== 'admin') {
            return res.status(403).json({ message: "Vous n'avez pas la permission de supprimer ce commentaire" });
        }

        // Supprimer le commentaire de la base de données
        await Comment.findByIdAndDelete(commentId);

        // Renvoyer un message de succès après la suppression
        res.status(200).json({ message: "Commentaire supprimé avec succès" });
    } catch (error) {
        // En cas d'erreur, renvoyer un message d'erreur
        res.status(500).json({ message: "Erreur lors de la suppression du commentaire", error: error.message });
    }
};

