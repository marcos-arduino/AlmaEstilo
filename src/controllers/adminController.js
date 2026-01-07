// src/controllers/adminController.js
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// Obtener todos los productos (incluyendo inactivos)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, price, stock, images, sku, weight, dimensions, tags } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      stock: stock || 0,
      images: images || [],
      sku,
      weight,
      dimensions,
      tags: tags || [],
      isActive: true
    });

    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Actualizar un producto existente
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto (marcar como inactivo)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// Obtener estadísticas del panel de administración
const getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, activeProducts, outOfStockProducts, totalOrders, recentOrders] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: { $lte: 0 } }),
      // TODO: Agregar lógica para órdenes cuando esté implementado
      Promise.resolve(0),
      Promise.resolve([]),
      Product.find({ isActive: true })
        .sort({ 'salesCount': -1 })
        .limit(5)
        .select('name price stock salesCount')
    ]);

    res.json({
      stats: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        totalCategories,
        totalOrders
      },
      recentOrders,
      topSellingProducts
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener las estadísticas' });
  }
};

module.exports = {
  // Productos
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Dashboard
  getDashboardStats
};
