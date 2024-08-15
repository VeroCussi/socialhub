const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Contrôleur pour enregistrer un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'email ou le nom d'utilisateur est déjà utilisé
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email ou nom d\'utilisateur déjà utilisé' });
    }

    // Hasher le mot de passe avant de le sauvegarder
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Retourner un message de succès
    res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Contrôleur pour connecter un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Chercher l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    // Comparer le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Créer un token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '365d' });

    // Retourner le token et les informations utilisateur
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Contrôleur pour deconnecter un utilisateur 
exports.logout = async (req, res) => {
  try {
    
  // Envoie une réponse à l'utilisateur indiquant que la déconnexion a réussi
  res.json({ message: 'Logout successful' });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir les informations de profil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

