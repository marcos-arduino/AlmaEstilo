// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Generar JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
};

// Registrar nuevo usuario
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  const { email, password, name } = req.body;

  // Validación adicional
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      error: 'Por favor proporcione todos los campos requeridos'
    });
  }

  try {
    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false,
        error: 'El correo electrónico ya está en uso' 
      });
    }

    // Crear nuevo usuario
    user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: 'user'
    });

    // Guardar usuario (el pre-save se encargará de hashear la contraseña)
    await user.save();

    // Eliminar la contraseña de la respuesta
    user.password = undefined;

    // Crear token
    const token = generateToken(user);
    
    res.status(201).json({ 
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    // Error de duplicado de email
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'El correo electrónico ya está en uso'
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Error al registrar el usuario' 
    });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validación básica
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'Por favor, proporcione email y contraseña' 
    });
  }

  try {
    // Buscar usuario incluyendo el campo password que normalmente está excluido
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log(`Intento de inicio de sesión fallido para el email: ${email}`);
      return res.status(401).json({ 
        success: false,
        error: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`Contraseña incorrecta para el usuario: ${email}`);
      return res.status(401).json({ 
        success: false,
        error: 'Credenciales inválidas' 
      });
    }

    // Crear token
    const token = generateToken(user);
    
    // Eliminar la contraseña de la respuesta
    user.password = undefined;

    res.status(200).json({ 
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en inicio de sesión:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error en el servidor al procesar la solicitud' 
    });
  }
};

// Obtener usuario actual
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};