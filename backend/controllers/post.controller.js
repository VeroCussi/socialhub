const Post = require('../models/post.model');
const User = require('../models/user.model');
const Admin = require('../models/admin.model');

// Créer un nouveau post
exports.createPost = async (req, res) => {
    try {
        // Créer une instance du modèle Post avec les données reçues
        const post = new Post({
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            userId: req.body.userId
        });
        // Enregistrer le post dans la base de données
        const savedPost = await post.save();
        // Retourner une réponse avec le post créé
        res.status(201).json(savedPost);
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        res.status(500).json({ message: "Échec de la création du post", error });
    }
};

// Obtenir tous les posts
exports.getAllPosts = async (req, res) => {
    try {
        // Récupérer tous les posts et les trier du plus récent au plus ancien
        const posts = await Post.find().sort({ createdAt: -1 });
        // Retourner la liste des posts
        res.status(200).json(posts);
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        res.status(500).json({ message: "Échec de la récupération des posts", error });
    }
};

// Obtenir un post par ID
exports.getPostById = async (req, res) => {
    try {
        // Récupérer le post par son ID
        const post = await Post.findById(req.params.id);
        if (!post) {
            // Si le post n'existe pas, retourner un message d'erreur
            return res.status(404).json({ message: "Post non trouvé" });
        }
        // Retourner le post trouvé
        res.status(200).json(post);
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        res.status(500).json({ message: "Échec de la récupération du post", error });
    }
};

// Mettre à jour un post
exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId; // Ceci est l'utilisateur authentifié
        const adminId = req.adminId; // Ceci est l'admin authentifié

        // Trouver le post par son ID
        const post = await Post.findById(postId);

        if (!post) {
            // Si le post n'existe pas, retourner un message d'erreur
            return res.status(404).json({ message: "Post non trouvé" });
        }

        // Vérifier si l'utilisateur est le créateur du post
        if (userId) {
            const user = await User.findById(userId);
            if (!user || post.userId.toString() !== userId) {
                return res.status(403).json({ message: "Vous n'avez pas la permission de mettre à jour ce post" });
            }
        }

        // Vérifier si l'admin a le droit de mettre à jour le post
        if (adminId) {
            const admin = await Admin.findById(adminId);
            if (!admin) {
                return res.status(403).json({ message: "Vous n'avez pas la permission de mettre à jour ce post" });
            }
        }

        // Mettre à jour le post avec les nouvelles données
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl
            },
            { new: true } // Retourner le post mis à jour
        );

        // Retourner le post mis à jour
        res.status(200).json(updatedPost);
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur
        res.status(500).json({ message: "Échec de la mise à jour du post", error });
    }
};

// Supprimer un post
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId; // Ceci est l'utilisateur authentifié
        const adminId = req.adminId; // Ceci est l'admin authentifié

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        // Si c'est un utilisateur normal
        if (userId) {
            const user = await User.findById(userId);
            if (!user || post.userId.toString() !== userId) {
                return res.status(403).json({ message: "Vous n'avez pas la permission de supprimer ce post" });
            }
        }

        // Si c'est un administrateur
        if (adminId) {
            const admin = await Admin.findById(adminId);
            if (!admin) {
                return res.status(403).json({ message: "Vous n'avez pas la permission de supprimer ce post" });
            }
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post supprimé avec succès" });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du post", error });
    }
};
