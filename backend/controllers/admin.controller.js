const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Contrôleur pour enregistrer un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const { adminname, email, password } = req.body;

    // Vérifier si l'email ou le nom d'admin est déjà utilisé
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { adminname }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email ou nom d\'admin déjà utilisé' });
    }

    // Hasher le mot de passe avant de le sauvegarder
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel Admin
    const newAdmin = new Admin({ adminname, email, password: hashedPassword });
    await newAdmin.save();

    // Retourner un message de succès
    res.status(201).json({ message: 'Admin enregistré avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Contrôleur pour connecter un Admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Chercher l'Admin par email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Admin non trouvé' });
    }

    // Comparer le mot de passe
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Créer un token JWT
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '365d' });

    // Retourner le token et les informations utilisateur
    res.json({
      token,
      admin: {
        id: admin._id,
        adminname: admin.adminname,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Contrôleur pour obtenir les informations de profil
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

