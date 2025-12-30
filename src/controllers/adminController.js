// src/controllers/adminController.js
const Product = require('../models/Product');
const Category = require('../models/Category');
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
    const { name, description, price, category, stock, images, sku, weight, dimensions, tags } = req.body;
    
    // Verificar si la categoría existe
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: 'Categoría no válida' });
    }

    // Crear el producto
    const product = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      images: images || [],
      sku,
      weight,
      dimensions,
      tags
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

    // Si se está actualizando la categoría, verificar que exista
    if (updates.category) {
      const categoryExists = await Category.findById(updates.category);
      if (!categoryExists) {
        return res.status(400).json({ error: 'Categoría no válida' });
      }
    }

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

// Obtener todas las categorías
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

// Crear una nueva categoría
const createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, image, parent } = req.body;
    
    // Verificar si la categoría padre existe
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).json({ error: 'Categoría padre no válida' });
      }
    }

    const category = new Category({
      name,
      description,
      image,
      parent: parent || null
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'El nombre de la categoría ya existe' });
    }
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

// Actualizar una categoría existente
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Si se está actualizando la categoría padre, verificar que exista
    if (updates.parent) {
      const parentCategory = await Category.findById(updates.parent);
      if (!parentCategory) {
        return res.status(400).json({ error: 'Categoría padre no válida' });
      }
      // Evitar que una categoría sea su propio padre
      if (id === updates.parent) {
        return res.status(400).json({ error: 'Una categoría no puede ser su propio padre' });
      }
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'El nombre de la categoría ya existe' });
    }
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};

// Eliminar una categoría (solo si no tiene productos asociados)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay productos en esta categoría
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar la categoría porque tiene productos asociados' 
      });
    }

    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};

// Obtener estadísticas del panel de administración
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalCategories,
      totalOrders,
      recentOrders,
      topSellingProducts
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: { $lte: 0 } }),
      Category.countDocuments(),
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
  
  // Categorías
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  
  // Dashboard
  getDashboardStats
};
