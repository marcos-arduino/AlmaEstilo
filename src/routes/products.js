const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

// Importar controladores
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Rutas públicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rutas protegidas (requieren autenticación y rol de administrador)
router.post(
  '/',
  [
    protect,
    admin,
    [
      check('name', 'El nombre es obligatorio').not().isEmpty(),
      check('price', 'El precio es obligatorio').isNumeric(),
      check('category', 'La categoría es obligatoria').not().isEmpty()
    ]
  ],
  createProduct
);

router.put(
  '/:id',
  [
    protect,
    admin,
    [
      check('name', 'El nombre es obligatorio').not().isEmpty(),
      check('price', 'El precio es obligatorio').isNumeric(),
      check('category', 'La categoría es obligatoria').not().isEmpty()
    ]
  ],
  updateProduct
);

router.delete('/:id', [protect, admin], deleteProduct);

module.exports = router;
