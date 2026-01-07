const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const { check } = require('express-validator');

// Aplicar middleware de autenticación y autorización a todas las rutas
router.use(protect);
router.use(admin);

// Rutas de productos
router.route('/products')
  .get(adminController.getAllProducts)
  .post(
    [
      check('name', 'El nombre es requerido').not().isEmpty(),
      check('description', 'La descripción es requerida').not().isEmpty(),
      check('price', 'El precio es requerido y debe ser un número positivo').isFloat({ min: 0 }),
      check('stock', 'El stock debe ser un número entero no negativo').isInt({ min: 0 })
    ],
    adminController.createProduct
  );

router.route('/products/:id')
  .put(
    [
      check('name', 'El nombre es requerido').optional().not().isEmpty(),
      check('price', 'El precio debe ser un número positivo').optional().isFloat({ min: 0 }),
      check('stock', 'El stock debe ser un número entero no negativo').optional().isInt({ min: 0 })
    ],
    adminController.updateProduct
  )
  .delete(adminController.deleteProduct);

// Ruta para obtener estadísticas del dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

module.exports = router;
