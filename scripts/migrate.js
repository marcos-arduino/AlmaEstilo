const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { User, Category, Product, Order } = require('../models');

// Leer catalog.json
const catalogPath = path.join(__dirname, '..', 'catalog.json');
const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

async function migrate() {
  try {
    console.log('🔄 Iniciando migración de base de datos...\n');

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Conectado a MongoDB\n');

    // 1. Crear categorías únicas
    console.log('📁 Creando categorías...');
    const uniqueCategories = [...new Set(catalogData.map(p => p.category))];
    const categoryMap = {};

    for (const catName of uniqueCategories) {
      let category = await Category.findOne({ name: catName });
      if (!category) {
        category = await Category.create({
          name: catName,
          description: `Categoría de ${catName.toLowerCase()}`,
          isActive: true
        });
        console.log(`  ✓ Categoría creada: ${catName}`);
      } else {
        console.log(`  ℹ Categoría existente: ${catName}`);
      }
      categoryMap[catName] = category._id;
    }
    console.log(`✅ ${uniqueCategories.length} categorías procesadas\n`);

    // 2. Migrar productos
    console.log('📦 Migrando productos...');
    
    // Eliminar colección antigua si existe
    const oldCollection = mongoose.connection.db.collection('products');
    const oldProductsExist = await oldCollection.countDocuments();
    
    if (oldProductsExist > 0) {
      console.log(`  ℹ Encontrados ${oldProductsExist} productos en formato antiguo`);
    }

    let migratedCount = 0;
    let skippedCount = 0;

    for (const oldProduct of catalogData) {
      try {
        // Verificar si ya existe por nombre
        const exists = await Product.findOne({ name: oldProduct.name });
        
        if (!exists) {
          const newProduct = await Product.create({
            name: oldProduct.name,
            description: oldProduct.description || `${oldProduct.name} de alta calidad`,
            price: oldProduct.price,
            category: categoryMap[oldProduct.category],
            stock: oldProduct.stock || 0,
            image: oldProduct.image,
            isActive: true,
            isFeatured: false
          });
          console.log(`  ✓ Producto migrado: ${newProduct.name}`);
          migratedCount++;
        } else {
          console.log(`  ⊘ Producto ya existe: ${oldProduct.name}`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`  ✗ Error al migrar ${oldProduct.name}:`, error.message);
      }
    }

    console.log(`✅ Productos migrados: ${migratedCount}`);
    console.log(`ℹ Productos omitidos (ya existían): ${skippedCount}\n`);

    // 3. Crear usuario administrador por defecto
    console.log('👤 Creando usuario administrador...');
    const adminExists = await User.findOne({ email: 'admin@almendra.com' });
    
    if (!adminExists) {
      const admin = await User.create({
        email: 'admin@almendra.com',
        password: 'admin123',
        name: 'Administrador',
        role: 'admin',
        isActive: true
      });
      console.log('✅ Usuario administrador creado');
      console.log('   Email: admin@almendra.com');
      console.log('   Password: admin123');
      console.log('   ⚠️  CAMBIAR LA CONTRASEÑA EN PRODUCCIÓN\n');
    } else {
      console.log('ℹ Usuario administrador ya existe\n');
    }

    // 4. Limpiar colección antigua (opcional)
    if (oldProductsExist > 0) {
      console.log('🗑️  ¿Deseas eliminar la colección antigua "products"?');
      console.log('   (Puedes hacerlo manualmente más tarde si prefieres)');
      // await oldCollection.drop();
      // console.log('✅ Colección antigua eliminada\n');
    }

    console.log('✅ ¡Migración completada exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - Categorías: ${uniqueCategories.length}`);
    console.log(`   - Productos: ${migratedCount} nuevos, ${skippedCount} existentes`);
    console.log(`   - Usuarios: 1 admin\n`);

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar migración
migrate();
