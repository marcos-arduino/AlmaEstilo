const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { login, register, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Registrar usuario
// @access  Public
router.post(
  '/register',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Por favor incluye un email válido').isEmail(),
    check('password', 'Por favor ingresa una contraseña con 6 o más caracteres').isLength({ min: 6 })
  ],
  register
);

// @route   POST api/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Por favor incluye un email válido').isEmail(),
    check('password', 'La contraseña es requerida').exists()
  ],
  login
);

// @route   GET api/auth
// @desc    Obtener usuario autenticado
// @access  Private
router.get('/', protect, getCurrentUser);

module.exports = router;
