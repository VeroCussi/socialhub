const Post = require("../models/post.model");
const User = require("../models/user.model");

// Créer un nouveau post
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;

    // Vérifier si une image est présente
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    // Créer une instance du modèle Post avec les données reçues
    const post = new Post({
      content,
      imageUrl,
      userId: req.user._id,
    });

    // Enregistrer le post dans la base de données
    await post.save();
    res.status(201).json({ message: "Post créé avec succès!" });
  } catch (error) {
    res.status(500).json({ message: "Échec de la création du post", error });
  }
};

// Obtenir tous les posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username imageUrl") // Aquí se hace populate del usuario
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Échec de la récupération des posts", error });
  }
};

// Obtenir un post par ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }
    res.status(200).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Échec de la récupération du post", error });
  }
};

// Mettre à jour un post
exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    // Vérifier si l'utilisateur est le créateur du post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }
    if (post.userId.toString() !== userId) {
      return res
        .status(403)
        .json({
          message: "Vous n'avez pas la permission de mettre à jour ce post",
        });
    }

    // Mettre à jour le post avec les nouvelles données
    post.content = req.body.content;
    post.imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : post.imageUrl;
    post.updatedAt = Date.now();

    await post.save();
    res.status(200).json({ message: "Post mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Échec de la mise à jour du post", error });
  }
};

// Supprimer un post
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const userRole = req.user.role;  // MIRAR QUE TENGA SENTIDO METER ESTO ACA

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }
    if (post.userId.toString() !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({
          message: "Vous n'avez pas la permission de supprimer ce post",
        });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du post", error });
  }
};
