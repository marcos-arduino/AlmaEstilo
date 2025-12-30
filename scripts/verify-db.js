const mongoose = require('mongoose');
require('dotenv').config();

const { User, Category, Product, Order } = require('../models');

async function verifyDatabase() {
  try {
    console.log('🔍 Verificando estructura de base de datos...\n');

    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Conectado a MongoDB\n');

    // Verificar colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Colecciones encontradas:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    console.log('');

    // Contar documentos
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    console.log('📊 Estadísticas:');
    console.log(`   👥 Usuarios: ${userCount}`);
    console.log(`   📁 Categorías: ${categoryCount}`);
    console.log(`   📦 Productos: ${productCount}`);
    console.log(`   🛒 Órdenes: ${orderCount}`);
    console.log('');

    // Verificar usuarios
    if (userCount > 0) {
      console.log('👥 Usuarios:');
      const users = await User.find().select('email name role isActive');
      users.forEach(user => {
        const roleIcon = user.role === 'admin' ? '👑' : '👤';
        const statusIcon = user.isActive ? '✅' : '❌';
        console.log(`   ${roleIcon} ${user.email} (${user.name}) - ${user.role} ${statusIcon}`);
      });
      console.log('');
    }

    // Verificar categorías
    if (categoryCount > 0) {
      console.log('📁 Categorías:');
      const categories = await Category.find().select('name slug isActive');
      categories.forEach(cat => {
        const statusIcon = cat.isActive ? '✅' : '❌';
        console.log(`   ${statusIcon} ${cat.name} (${cat.slug})`);
      });
      console.log('');
    }

    // Verificar productos
    if (productCount > 0) {
      console.log('📦 Productos (primeros 5):');
      const products = await Product.find()
        .populate('category', 'name')
        .limit(5)
        .select('name price category stock isActive');
      
      products.forEach(prod => {
        const statusIcon = prod.isActive ? '✅' : '❌';
        const stockIcon = prod.stock > 0 ? '📦' : '⚠️';
        console.log(`   ${statusIcon} ${prod.name} - $${prod.price} - ${prod.category?.name || 'Sin categoría'} ${stockIcon}${prod.stock}`);
      });
      
      if (productCount > 5) {
        console.log(`   ... y ${productCount - 5} más`);
      }
      console.log('');
    }

    // Verificar órdenes
    if (orderCount > 0) {
      console.log('🛒 Órdenes (últimas 5):');
      const orders = await Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderNumber user totalAmount status paymentStatus createdAt');
      
      orders.forEach(order => {
        const statusIcons = {
          pending: '⏳',
          processing: '🔄',
          shipped: '🚚',
          delivered: '✅',
          cancelled: '❌'
        };
        const paymentIcons = {
          pending: '⏳',
          approved: '✅',
          rejected: '❌',
          refunded: '↩️'
        };
        
        console.log(`   ${statusIcons[order.status] || '❓'} ${order.orderNumber} - ${order.user?.name || 'Usuario'} - $${order.totalAmount} - ${paymentIcons[order.paymentStatus] || '❓'}`);
      });
      console.log('');
    }

    // Verificar integridad de relaciones
    console.log('🔗 Verificando integridad de relaciones...');
    
    const productsWithoutCategory = await Product.countDocuments({ category: null });
    if (productsWithoutCategory > 0) {
      console.log(`   ⚠️  ${productsWithoutCategory} productos sin categoría`);
    } else {
      console.log('   ✅ Todos los productos tienen categoría');
    }

    const ordersWithoutUser = await Order.countDocuments({ user: null });
    if (ordersWithoutUser > 0) {
      console.log(`   ⚠️  ${ordersWithoutUser} órdenes sin usuario`);
    } else {
      console.log('   ✅ Todas las órdenes tienen usuario');
    }

    console.log('');
    console.log('✅ Verificación completada!\n');

    // Resumen de salud
    console.log('💚 Estado de la Base de Datos:');
    const health = {
      users: userCount > 0,
      categories: categoryCount > 0,
      products: productCount > 0,
      integrity: productsWithoutCategory === 0 && ordersWithoutUser === 0
    };

    if (Object.values(health).every(v => v)) {
      console.log('   🎉 ¡Todo está perfecto!');
    } else {
      console.log('   ⚠️  Hay algunos problemas que resolver');
      if (!health.users) console.log('      - No hay usuarios creados');
      if (!health.categories) console.log('      - No hay categorías creadas');
      if (!health.products) console.log('      - No hay productos creados');
      if (!health.integrity) console.log('      - Hay problemas de integridad referencial');
    }

  } catch (error) {
    console.error('❌ Error al verificar base de datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

verifyDatabase();
