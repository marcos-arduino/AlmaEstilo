const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  let token;

  // Verificar si hay un token en el encabezado
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obtener el token del encabezado
      token = req.headers.authorization.split(' ')[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Obtener el usuario del token
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Error en la autenticación:', error);
      res.status(401).json({ error: 'No autorizado, token fallido' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'No autorizado, no se proporcionó token' });
  }
};

// Middleware para verificar si el usuario es administrador
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado, se requieren privilegios de administrador' });
  }
};

module.exports = { protect, admin };
