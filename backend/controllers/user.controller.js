const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Enregistrer un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    let params = req.body;

    // Vérification des champs obligatoires
    if (!params.name || !params.email || !params.username || !params.password) {
      return res.status(400).json({
        status: "error",
        message: "Todos los campos son obligatorios: nombre, email, username y contraseña",
        missingFields: {
          name: !params.name,
          email: !params.email,
          username: !params.username,
          password: !params.password
        }
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.email)) {
      return res.status(400).json({
        status: "error",
        message: "El formato del email no es válido"
      });
    }

    // Validar longitud de username y password
    if (params.username.length < 3) {
      return res.status(400).json({
        status: "error",
        message: "El username debe tener al menos 3 caracteres"
      });
    }

    if (params.password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    // Contrôle des utilisateurs en double
    let existingUser = await User.findOne({
      $or: [
        { email: params.email.toLowerCase() },
        { username: params.username }
      ]
    });

    if (existingUser) {
      if (existingUser.email === params.email.toLowerCase()) {
        return res.status(409).json({
          status: "error",
          message: "El email ya está registrado en el sistema",
          field: "email"
        });
      } else {
        return res.status(409).json({
          status: "error",
          message: "El username ya está en uso",
          field: "username"
        });
      }
    }

    // Chiffrer le mot de passe
    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    // Asegurar que el email esté en minúsculas
    params.email = params.email.toLowerCase();

    // Créer un objet utilisateur
    let newUser = new User(params);

    // Enregistrer l'utilisateur dans la base de données
    let savedUser = await newUser.save();

    // Excluir la contraseña de la respuesta
    const { password, ...userWithoutPassword } = savedUser._doc;

    // Retourner le résultat en cas de succès
    return res.status(201).json({
      status: "success",
      message: "Usuario registrado exitosamente",
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Error en registro:", error);
    
    // Manejar errores específicos de Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: "error",
        message: "Error de validación",
        errors: validationErrors
      });
    }

    if (error.code === 11000) {
      // Error de duplicado
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        status: "error",
        message: `El ${field} ya está en uso`,
        field: field
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );

    // Exclure le mot de passe avant d'envoyer les informations de l'utilisateur
    const { password: _, ...userWithoutPassword } = user._doc;

    res.json({ 
      status: 'success', 
      message: 'Utilisateur connecté avec succès', 
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Déconnexion d'un utilisateur
exports.logout = async (req, res) => {
  try {
    res.json({ message: 'Déconnexion réussie' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir les informations de profil
exports.getProfile = async (req, res) => {
  try {
    const id = req.params.id;

    // Recherche du profil utilisateur par ID avec async/await
    const userProfile = await User.findById(id).select('-password -role');

    // Si l'utilisateur n'est pas trouvé, renvoyer une erreur 404
    if (!userProfile) {
      return res.status(404).json({
        status: "error",
        message: "L'utilisateur n'existe pas"
      });
    }

    // Si tout va bien, retourner le profil de l'utilisateur
    return res.status(200).json({
      status: "success",
      user: userProfile
    });

  } catch (err) {
    // Capture des erreurs du serveur
    return res.status(500).json({
      status: "error",
      message: "Erreur du serveur",
      error: err.message
    });
  }
};

// Obtenir le profil de l'utilisateur connecté
exports.getCurrentUser = async (req, res) => {
  try {
    // L'utilisateur est déjà disponible grâce au middleware d'authentification
    const currentUser = await User.findById(req.user._id).select('-password');

    if (!currentUser) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    return res.status(200).json({
      status: "success",
      user: currentUser
    });

  } catch (error) {
    console.error("Error obteniendo usuario actual:", error);
    return res.status(500).json({
      status: "error",
      message: "Error del servidor",
      error: error.message
    });
  }
};

// Liste de tous les utilisateurs de l'application
exports.list = async (req, res) => {
  try {
    // Déterminer la page actuelle
    let page = req.params.page ? parseInt(req.params.page) : 1;
    let itemsPerPage = 10;

    // Configurer les options de pagination
    const options = {
      page: page,
      limit: itemsPerPage,
      sort: { _id: 1 }
    };

    // Effectuer la pagination
    const result = await User.paginate({}, options);

    if (!result.docs || result.docs.length === 0) {
      return res.status(404).send({
        status: 'error',
        message: 'Aucun utilisateur disponible'
      });
    }

    // Retourner le résultat si des utilisateurs sont trouvés
    return res.status(200).send({
      status: 'success',
      users: result.docs,
      page: result.page,
      itemsPerPage: result.limit,
      total: result.totalDocs,
      pages: result.totalPages
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 'error',
      message: 'Erreur du serveur',
      error
    });
  }
};


// Créer un nouvel administrateur
exports.createAdmin = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email ou nom d\'utilisateur déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: 'admin',
      permissions: ['manage_posts', 'manage_users', 'manage_comments']
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Administrateur créé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar perfil de usuario
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;

    // Campos permitidos para actualizar
    const allowedFields = ['name', 'surname', 'bio', 'email'];
    const filteredData = {};

    // Filtrar solo los campos permitidos
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    // Si se está actualizando el email, verificar que no exista
    if (filteredData.email) {
      const existingUser = await User.findOne({ 
        email: filteredData.email, 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return res.status(409).json({
          status: "error",
          message: "El email ya está en uso por otro usuario"
        });
      }
    }

    // Actualizar el usuario
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      filteredData,
      { new: true, runValidators: true }
    ).select('-password'); // Excluir la contraseña de la respuesta

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Perfil actualizado correctamente",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Se requieren la contraseña actual y la nueva"
      });
    }

    // Buscar el usuario con la contraseña
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    // Verificar la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "La contraseña actual es incorrecta"
      });
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Actualizar la contraseña
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Seguir a un usuario
exports.followUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const userToFollowId = req.params.id;

    // No se puede seguir a uno mismo
    if (currentUserId.toString() === userToFollowId) {
      return res.status(400).json({
        status: "error",
        message: "No puedes seguirte a ti mismo"
      });
    }

    // Verificar que el usuario a seguir existe
    const userToFollow = await User.findById(userToFollowId);
    if (!userToFollow) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    // Verificar si ya lo está siguiendo
    const currentUser = await User.findById(currentUserId);
    if (currentUser.following.includes(userToFollowId)) {
      return res.status(400).json({
        status: "error",
        message: "Ya estás siguiendo a este usuario"
      });
    }

    // Añadir a following del usuario actual
    await User.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { following: userToFollowId } }
    );

    // Añadir a followers del usuario seguido
    await User.findByIdAndUpdate(
      userToFollowId,
      { $addToSet: { followers: currentUserId } }
    );

    res.status(200).json({
      status: "success",
      message: "Usuario seguido correctamente"
    });

  } catch (error) {
    console.error("Error al seguir usuario:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Dejar de seguir a un usuario
exports.unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const userToUnfollowId = req.params.id;

    // Verificar que el usuario a dejar de seguir existe
    const userToUnfollow = await User.findById(userToUnfollowId);
    if (!userToUnfollow) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    // Verificar si lo está siguiendo
    const currentUser = await User.findById(currentUserId);
    if (!currentUser.following.includes(userToUnfollowId)) {
      return res.status(400).json({
        status: "error",
        message: "No estás siguiendo a este usuario"
      });
    }

    // Remover de following del usuario actual
    await User.findByIdAndUpdate(
      currentUserId,
      { $pull: { following: userToUnfollowId } }
    );

    // Remover de followers del usuario
    await User.findByIdAndUpdate(
      userToUnfollowId,
      { $pull: { followers: currentUserId } }
    );

    res.status(200).json({
      status: "success",
      message: "Usuario dejado de seguir correctamente"
    });

  } catch (error) {
    console.error("Error al dejar de seguir usuario:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Obtener estadísticas de un usuario (following, followers, posts)
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId).select('following followers');
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    // Contar posts del usuario
    const Post = require('../models/post.model');
    const postCount = await Post.countDocuments({ userId });

    res.status(200).json({
      status: "success",
      stats: {
        following: user.following.length,
        followers: user.followers.length,
        posts: postCount
      }
    });

  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Buscar usuarios
exports.searchUsers = async (req, res) => {
  try {
    const { q: searchQuery, page = 1, limit = 10 } = req.query;
    
    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.status(400).json({
        status: "error",
        message: "La búsqueda debe tener al menos 2 caracteres"
      });
    }

    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(searchQuery.trim(), 'i');

    // Buscar usuarios por nombre, apellido, username o bio
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { surname: searchRegex },
        { username: searchRegex },
        { bio: searchRegex }
      ]
    })
    .select('-password')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ username: 1 });

    // Contar total de resultados
    const total = await User.countDocuments({
      $or: [
        { name: searchRegex },
        { surname: searchRegex },
        { username: searchRegex },
        { bio: searchRegex }
      ]
    });

    res.status(200).json({
      status: "success",
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNextPage: skip + users.length < total,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      error: error.message
    });
  }
};
