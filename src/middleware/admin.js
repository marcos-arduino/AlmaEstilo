// Middleware para verificar si el usuario es administrador
const admin = (req, res, next) => {
  // Verificar si el usuario está autenticado y es administrador
  if (req.user && req.user.role === 'admin') {
    next(); // Continuar si es administrador
  } else {
    res.status(403).json({ 
      error: 'Acceso denegado. Se requieren privilegios de administrador.' 
    });
  }
};

module.exports = admin;
