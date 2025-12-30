const mongoose = require('mongoose');
require('dotenv').config();

async function convertProducts() {
  try {
    console.log('🔄 Iniciando conversión de productos...\n');

    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Conectado a MongoDB\n');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');
    const categoriesCollection = db.collection('categories');

    // 1. Obtener todas las categorías
    const categories = await categoriesCollection.find().toArray();
    const categoryMap = {};
    
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    console.log('📁 Categorías encontradas:');
    Object.keys(categoryMap).forEach(name => {
      console.log(`   - ${name} → ${categoryMap[name]}`);
    });
    console.log('');

    // 2. Obtener productos con category como string
    const oldProducts = await productsCollection.find({
      category: { $type: 'string' }
    }).toArray();

    console.log(`📦 Productos a convertir: ${oldProducts.length}\n`);

    if (oldProducts.length === 0) {
      console.log('✅ No hay productos para convertir. Todos ya están en el formato correcto.');
      return;
    }

    // 3. Convertir cada producto
    let converted = 0;
    let errors = 0;

    for (const product of oldProducts) {
      try {
        const categoryName = product.category;
        const categoryId = categoryMap[categoryName];

        if (!categoryId) {
          console.log(`   ⚠️  ${product.name}: Categoría "${categoryName}" no encontrada`);
          errors++;
          continue;
        }

        // Generar slug
        const slug = product.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Actualizar producto
        await productsCollection.updateOne(
          { _id: product._id },
          {
            $set: {
              category: categoryId,
              slug: slug,
              isActive: true,
              isFeatured: false,
              sizes: product.sizes || [],
              colors: product.colors || [],
              images: product.images || []
            }
          }
        );

        console.log(`   ✓ ${product.name} → ${categoryName}`);
        converted++;
      } catch (error) {
        console.error(`   ✗ Error con ${product.name}:`, error.message);
        errors++;
      }
    }

    console.log('');
    console.log('✅ Conversión completada!');
    console.log(`   - Convertidos: ${converted}`);
    console.log(`   - Errores: ${errors}`);
    console.log('');

    // 4. Verificar resultado
    const newProducts = await productsCollection.find({
      category: { $type: 'objectId' }
    }).toArray();

    console.log(`📊 Productos con nuevo formato: ${newProducts.length}`);
    
    // Mostrar un ejemplo
    if (newProducts.length > 0) {
      console.log('\n📦 Ejemplo de producto convertido:');
      const example = newProducts[0];
      console.log(`   Nombre: ${example.name}`);
      console.log(`   Categoría: ${example.category} (ObjectId)`);
      console.log(`   Slug: ${example.slug}`);
      console.log(`   Activo: ${example.isActive}`);
    }

  } catch (error) {
    console.error('❌ Error durante la conversión:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

convertProducts();
