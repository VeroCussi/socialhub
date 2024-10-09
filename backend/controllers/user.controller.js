const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoosePaginate = require('mongoose-paginate-v2');

// Enregistrer un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    let params = req.body;

    // Vérification des champs obligatoires
    if (!params.name || !params.email || !params.username || !params.password) {
      return res.status(400).json({
        status: "error",
        message: "Des données manquent",
      });
    }

    // Contrôle des utilisateurs en double
    let users = await User.find({
      $or: [
        { email: params.email.toLowerCase() },
        { username: params.username }
      ]
    });

    if (users && users.length >= 1) {
      return res.status(409).json({
        status: "error",
        message: "L'utilisateur existe déjà"
      });
    }

    // Chiffrer le mot de passe
    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    // Créer un objet utilisateur
    let newUser = new User(params);

    // Enregistrer l'utilisateur dans la base de données
    let savedUser = await newUser.save();

    // Retourner le résultat en cas de succès
    return res.status(200).json({
      status: "success",
      message: "Utilisateur enregistré avec succès",
      user: savedUser
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Erreur du serveur",
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
