const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'Accès refusé, token absent' });

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Verifier les propriétés nécessaires
    if (!verified || !verified._id) {
      return res.status(400).json({ message: 'Token invalide' });
    }

    req.user = {
      _id: verified._id,
      role: verified.role // Verifier que `role` est dans le token, pour vérifier les autorisations
    };

    next();
  } catch (err) {
    res.status(400).json({ message: 'Token invalide' });
  }
};

