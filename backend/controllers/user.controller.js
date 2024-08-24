const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Contrôleur pour enregistrer un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email ou nom utilisateur déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Contrôleur pour connecter un utilisateur
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

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Contrôleur pour deconnecter un utilisateur 
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
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer un nouvel administrateur
exports.createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email ou nom d\'utilisateur déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
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


// const User = require('../models/user.model');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// // Contrôleur pour enregistrer un nouvel utilisateur
// exports.register = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Vérifier si l'email ou le nom d'utilisateur est déjà utilisé
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email ou nom d\'utilisateur déjà utilisé' });
//     }

//     // Hasher le mot de passe avant de le sauvegarder
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Créer un nouvel utilisateur
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();

//     // Retourner un message de succès
//     res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Contrôleur pour connecter un utilisateur
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: 'Usuario no encontrado' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Contraseña incorrecta' });
//     }

//     const token = jwt.sign(
//       { _id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '365d' }
//     );

//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // exports.login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     // Chercher l'utilisateur par email
// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(400).json({ message: 'Utilisateur non trouvé' });
// //     }

// //     // Comparer le mot de passe
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(400).json({ message: 'Mot de passe incorrect' });
// //     }

// //     // Créer un token JWT
// //     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '365d' });

// //     // Retourner le token et les informations utilisateur
// //     res.json({
// //       token,
// //       user: {
// //         id: user._id,
// //         username: user.username,
// //         email: user.email,
// //         role: user.role,
// //       },
// //     });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // Contrôleur pour deconnecter un utilisateur 
// exports.logout = async (req, res) => {
//   try {
    
//   // Envoie une réponse à l'utilisateur indiquant que la déconnexion a réussi
//   res.json({ message: 'Logout successful' });
    
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Obtenir les informations de profil
// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Controller para crear un admin
// exports.createAdmin = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Verificar si el email o el nombre de usuario ya están en uso
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email o nombre de usuario ya está en uso' });
//     }

//     // Hashear la contraseña antes de guardarla
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Crear un nuevo administrador
//     const newAdmin = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role: 'admin', // Establecer el rol como 'admin'
//       permissions: ['manage_posts', 'manage_users', 'manage_comments'] // Permisos adicionales si es necesario
//     });

//     // Guardar el administrador en la base de datos
//     await newAdmin.save();

//     // Responder con un mensaje de éxito
//     res.status(201).json({ message: 'Administrador creado exitosamente' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
