const Comment = require('../models/comment.model');

// Crear un nuevo comentario
exports.createComment = async (req, res) => {
    try {
        // Crear una instancia del modelo Comment con los datos recibidos
        const comment = new Comment({
            text: req.body.text,
            userId: req.body.userId,
            postId: req.body.postId
        });
        // Guardar el comentario en la base de datos
        const savedComment = await comment.save();
        // Devolver una respuesta con el comentario creado
        res.status(201).json(savedComment);
    } catch (error) {
        // En caso de error, devolver un mensaje de error
        res.status(500).json({ message: "Échec de la création du commentaire", error });
    }
};

// Obtener todos los comentarios
exports.getAllComments = async (req, res) => {
    try {
        // Recuperar todos los comentarios y ordenarlos del más reciente al más antiguo
        const comments = await Comment.find().sort({ createdAt: -1 });
        // Devolver la lista de comentarios
        res.status(200).json(comments);
    } catch (error) {
        // En caso de error, devolver un mensaje de error
        res.status(500).json({ message: "Échec de la récupération des commentaires", error });
    }
};

// Obtener un comentario por ID
exports.getCommentById = async (req, res) => {
    try {
        // Recuperar el comentario por su ID
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            // Si el comentario no existe, devolver un mensaje de error
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }
        // Devolver el comentario encontrado
        res.status(200).json(comment);
    } catch (error) {
        // En caso de error, devolver un mensaje de error
        res.status(500).json({ message: "Échec de la récupération du commentaire", error });
    }
};

// Actualizar un comentario
exports.updateComment = async (req, res) => {
    try {
        // Encontrar y actualizar el comentario por su ID con los nuevos datos
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                text: req.body.text,
            },
            { new: true } // Devolver el comentario actualizado
        );
        if (!updatedComment) {
            // Si el comentario no existe, devolver un mensaje de error
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }
        // Devolver el comentario actualizado
        res.status(200).json(updatedComment);
    } catch (error) {
        // En caso de error, devolver un mensaje de error
        res.status(500).json({ message: "Échec de la mise à jour du commentaire", error });
    }
};

// Eliminar un comentario
exports.deleteComment = async (req, res) => {
    try {
        // Encontrar y eliminar el comentario por su ID
        const deletedComment = await Comment.findByIdAndDelete(req.params.id);
        if (!deletedComment) {
            // Si el comentario no existe, devolver un mensaje de error
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }
        // Devolver un mensaje de éxito después de la eliminación
        res.status(200).json({ message: "Commentaire supprimé avec succès" });
    } catch (error) {
        // En caso de error, devolver un mensaje de error
        res.status(500).json({ message: "Échec de la suppression du commentaire", error });
    }
};
