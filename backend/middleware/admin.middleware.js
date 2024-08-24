module.exports = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' });
    }
    next();
  };
  