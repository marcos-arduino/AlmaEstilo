const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function exportToCatalog() {
  try {
    console.log('📤 Exportando productos a catalog.json...\n');

    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Conectado a MongoDB\n');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Obtener todos los productos
    const products = await productsCollection.find().toArray();

    console.log(`📦 Productos encontrados: ${products.length}\n`);

    // Convertir ObjectId de category a string (nombre de categoría)
    const categoriesCollection = db.collection('categories');
    const categories = await categoriesCollection.find().toArray();
    
    // Crear mapa de ID -> nombre
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat._id.toString()] = cat.name;
    });

    // Transformar productos al formato del catalog.json
    const catalogProducts = products.map(product => {
      // Si category es ObjectId, convertir a nombre
      let categoryName = product.category;
      if (typeof product.category === 'object' && product.category._id) {
        categoryName = categoryMap[product.category._id.toString()] || product.category;
      } else if (typeof product.category === 'string' && categoryMap[product.category]) {
        categoryName = categoryMap[product.category];
      }

      return {
        _id: product._id.toString(),
        name: product.name,
        price: product.price,
        category: categoryName,
        image: product.image,
        stock: product.stock || 0,
        description: product.description || `${product.name}`,
        __v: product.__v || 0
      };
    });

    // Guardar en catalog.json
    const catalogPath = path.join(__dirname, '..', 'catalog.json');
    
    // Hacer backup del archivo actual
    if (fs.existsSync(catalogPath)) {
      const backupPath = path.join(__dirname, '..', `catalog.backup.${Date.now()}.json`);
      fs.copyFileSync(catalogPath, backupPath);
      console.log(`💾 Backup creado: ${path.basename(backupPath)}\n`);
    }

    // Escribir nuevo archivo
    fs.writeFileSync(
      catalogPath,
      JSON.stringify(catalogProducts, null, 2),
      'utf8'
    );

    console.log('✅ Productos exportados exitosamente!\n');
    console.log(`📁 Archivo: catalog.json`);
    console.log(`📊 Total de productos: ${catalogProducts.length}\n`);

    // Mostrar resumen por categoría
    const categoryCounts = {};
    catalogProducts.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    console.log('📋 Resumen por categoría:');
    Object.keys(categoryCounts).sort().forEach(cat => {
      console.log(`   - ${cat}: ${categoryCounts[cat]} productos`);
    });

  } catch (error) {
    console.error('❌ Error al exportar:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

exportToCatalog();
