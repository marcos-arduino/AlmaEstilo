const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Generar JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'almendra-secret-key-change-in-production',
    { expiresIn: '7d' }
  );
};

// Middleware de autenticación
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No autorizado - Token no proporcionado' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'almendra-secret-key-change-in-production'
    );
    
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'No autorizado - Usuario inválido' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'No autorizado - Token inválido' });
  }
};

// Middleware para verificar rol de administrador
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado - Se requiere rol de administrador' });
  }
  next();
};

module.exports = {
  generateToken,
  authenticate,
  requireAdmin
};
