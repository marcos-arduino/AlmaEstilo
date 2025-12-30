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
      check('category', 'La categoría es requerida').isMongoId(),
      check('stock', 'El stock debe ser un número entero no negativo').isInt({ min: 0 })
    ],
    adminController.createProduct
  );

router.route('/products/:id')
  .put(
    [
      check('name', 'El nombre es requerido').optional().not().isEmpty(),
      check('price', 'El precio debe ser un número positivo').optional().isFloat({ min: 0 }),
      check('category', 'La categoría no es válida').optional().isMongoId(),
      check('stock', 'El stock debe ser un número entero no negativo').optional().isInt({ min: 0 })
    ],
    adminController.updateProduct
  )
  .delete(adminController.deleteProduct);

// Rutas de categorías
router.route('/categories')
  .get(adminController.getAllCategories)
  .post(
    [
      check('name', 'El nombre de la categoría es requerido').not().isEmpty(),
      check('parent', 'La categoría padre no es válida').optional().isMongoId()
    ],
    adminController.createCategory
  );

router.route('/categories/:id')
  .put(
    [
      check('name', 'El nombre de la categoría es requerido').optional().not().isEmpty(),
      check('parent', 'La categoría padre no es válida').optional().isMongoId()
    ],
    adminController.updateCategory
  )
  .delete(adminController.deleteCategory);

// Ruta para obtener estadísticas del dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

module.exports = router;
