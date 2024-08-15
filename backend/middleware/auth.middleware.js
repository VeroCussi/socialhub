const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'Accès refusé, token manquant' });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    req.admin = req.user;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token invalide' });
  }
};
