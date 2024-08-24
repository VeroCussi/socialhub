const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'Acceso denegado, token ausente' });

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Asegurarse de que verified tiene las propiedades necesarias
    if (!verified || !verified._id) {
      return res.status(400).json({ message: 'Token inválido' });
    }

    req.user = {
      _id: verified._id,
      role: verified.role // Asegúrate de que `role` esté en el token, si lo usas para verificar permisos
    };

    next();
  } catch (err) {
    res.status(400).json({ message: 'Token inválido' });
  }
};



// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   try {
//     const token = req.header('x-auth-token');
//     if (!token) return res.status(401).json({ message: 'Accès refusé, token manquant' });

//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     req.admin = verified;
//     next();
//   } catch (err) {
//     res.status(400).json({ message: 'Token invalide' });
//   }
// };
